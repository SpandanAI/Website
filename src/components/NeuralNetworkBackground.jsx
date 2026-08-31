import React, { useEffect, useRef } from "react";

const NODE_COUNT = 80;
const NODE_RADIUS = 2.4;
const NODE_ALPHA = 0.9;
const LINE_ALPHA = 0.25;
const CONNECTION_DISTANCE = 140;
const CURSOR_RADIUS = 180;
const CURSOR_SMOOTHING = 0.15;
const NODE_REPULSION_RADIUS = 140;
const NODE_RETURN_EASING = 0.05;
const MAX_NODE_DISPLACEMENT = 12;
const NODE_MOTION_DAMPING = 0.92;
const IDLE_MOTION_AMPLITUDE = 0.02;
const IDLE_MOTION_SPEED = 0.001;
const IDLE_SPEED_THRESHOLD = 0.02;

const GLOW_BLUR_PX = 14;
const GLOW_RADIUS_MIN = 95;
const GLOW_RADIUS_MAX = 140;
const RIPPLE_DURATION_MS = 900;
const RIPPLE_MAX_ALPHA = 0.18;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function NeuralNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cursor = {
      x: 0,
      y: 0,
      active: false
    };
    const cursorTarget = {
      x: 0,
      y: 0
    };
    let cursorSpeed = 0;
    let smoothedSpeed = 0;
    let lastCursorX = 0;
    let lastCursorY = 0;
    let lastCursorTime = Date.now();
    let glowRadius = GLOW_RADIUS_MAX;
    let rippleStartTimestamp = 0;
    let rippleX = 0;
    let rippleY = 0;
    let rippleTimeoutId = 0;
    let isRippleActive = false;

    const nodes = [];
    const interactionBoosts = new Array(NODE_COUNT).fill(0);

    const createNode = (id, x, y) => ({
      id,
      originalX: x,
      originalY: y,
      currentX: 0,
      currentY: 0,
      driftVX: (Math.random() - 0.5) * 0.28,
      driftVY: (Math.random() - 0.5) * 0.28,
      vx: 0,
      vy: 0
    });

    const initializeNodes = () => {
      if (!width || !height) return;
      nodes.length = 0;
      const clusterCount = Math.max(8, Math.round(NODE_COUNT / 8));
      const columns = Math.ceil(Math.sqrt(clusterCount));
      const rows = Math.ceil(clusterCount / columns);
      const cellWidth = width / columns;
      const cellHeight = height / rows;
      const clusterRadius = Math.min(cellWidth, cellHeight) * 0.24;
      const baseNodesPerCluster = Math.floor(NODE_COUNT / clusterCount);
      let remainingNodes = NODE_COUNT % clusterCount;
      let nodeId = 0;

      for (let clusterIndex = 0; clusterIndex < clusterCount; clusterIndex += 1) {
        const column = clusterIndex % columns;
        const row = Math.floor(clusterIndex / columns);
        const centerX = (column + 0.5) * cellWidth + (Math.random() - 0.5) * cellWidth * 0.35;
        const centerY = (row + 0.5) * cellHeight + (Math.random() - 0.5) * cellHeight * 0.35;
        const nodesInCluster = baseNodesPerCluster + (remainingNodes > 0 ? 1 : 0);
        remainingNodes = Math.max(remainingNodes - 1, 0);

        for (let nodeIndex = 0; nodeIndex < nodesInCluster; nodeIndex += 1) {
          const angle = Math.random() * Math.PI * 2;
          const radius = clusterRadius * Math.sqrt(Math.random());
          const x = clamp(centerX + Math.cos(angle) * radius, 0, width);
          const y = clamp(centerY + Math.sin(angle) * radius, 0, height);
          const node = createNode(nodeId, x, y);
          node.currentX = node.originalX;
          node.currentY = node.originalY;
          nodes.push(node);
          nodeId += 1;
        }
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = rect.width;
      const nextHeight = rect.height;
      const dpr = window.devicePixelRatio || 1;

      if (!nextWidth || !nextHeight) return;

      if (width && height && nodes.length) {
        const scaleX = nextWidth / width;
        const scaleY = nextHeight / height;
        nodes.forEach((node) => {
          node.originalX *= scaleX;
          node.originalY *= scaleY;
          node.currentX *= scaleX;
          node.currentY *= scaleY;
        });
      }

      width = nextWidth;
      height = nextHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!nodes.length) {
        initializeNodes();
      }
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const currentTime = Date.now();
        const dx = x - lastCursorX;
        const dy = y - lastCursorY;
        const distance = Math.hypot(dx, dy);
        const timeDelta = currentTime - lastCursorTime;
        cursorSpeed = Math.min(distance / Math.max(timeDelta, 1), 2);
        lastCursorX = x;
        lastCursorY = y;
        lastCursorTime = currentTime;

        cursorTarget.x = x;
        cursorTarget.y = y;
        if (!cursor.active) {
          cursor.x = x;
          cursor.y = y;
        }
        cursor.active = true;
      } else {
        cursor.active = false;
      }
    };

    const clearCursor = () => {
      cursor.active = false;
    };

    const scheduleSignalRipple = () => {
      if (prefersReducedMotion) return;

      const delay = 8000 + Math.random() * 2000;
      rippleTimeoutId = window.setTimeout(() => {
        if (!width || !height) {
          scheduleSignalRipple();
          return;
        }

        rippleX = Math.random() * width;
        rippleY = Math.random() * height;
        rippleStartTimestamp = performance.now();
        isRippleActive = true;
        scheduleSignalRipple();
      }, delay);
    };

    const updateInteractions = () => {
      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        if (!cursor.active) {
          interactionBoosts[index] = 0;
          continue;
        }

        const dx = node.currentX - cursor.x;
        const dy = node.currentY - cursor.y;
        const distance = Math.hypot(dx, dy);
        interactionBoosts[index] = clamp(1 - distance / CURSOR_RADIUS, 0, 1);
      }
    };

    const step = (timestamp) => {
      if (!width || !height) {
        animationFrameId = window.requestAnimationFrame(step);
        return;
      }

      smoothedSpeed += (cursorSpeed - smoothedSpeed) * 0.15;

      if (cursor.active) {
        cursor.x += (cursorTarget.x - cursor.x) * CURSOR_SMOOTHING;
        cursor.y += (cursorTarget.y - cursor.y) * CURSOR_SMOOTHING;
      }

      updateInteractions();

      context.clearRect(0, 0, width, height);
      if (isRippleActive) {
        const rippleProgress = (timestamp - rippleStartTimestamp) / RIPPLE_DURATION_MS;

        if (rippleProgress >= 1) {
          isRippleActive = false;
        } else {
          const rippleEase = 1 - (1 - rippleProgress) * (1 - rippleProgress);
          const rippleRadius = 60 + rippleEase * 280;
          const rippleOpacity = Math.sin(rippleProgress * Math.PI) * RIPPLE_MAX_ALPHA;

          context.save();
          context.globalCompositeOperation = "lighter";
          const rippleGradient = context.createRadialGradient(
            rippleX,
            rippleY,
            0,
            rippleX,
            rippleY,
            rippleRadius
          );
          rippleGradient.addColorStop(0, `rgba(56, 189, 248, ${rippleOpacity * 0.65})`);
          rippleGradient.addColorStop(0.55, `rgba(56, 189, 248, ${rippleOpacity * 0.2})`);
          rippleGradient.addColorStop(1, "rgba(56, 189, 248, 0)");
          context.fillStyle = rippleGradient;
          context.beginPath();
          context.arc(rippleX, rippleY, rippleRadius, 0, Math.PI * 2);
          context.fill();
          context.restore();
        }
      }
      if (cursor.active) {
        const targetGlowRadius = clamp(
          GLOW_RADIUS_MIN + smoothedSpeed * ((GLOW_RADIUS_MAX - GLOW_RADIUS_MIN) / 2),
          GLOW_RADIUS_MIN,
          GLOW_RADIUS_MAX
        );
        const dynamicEase = clamp(0.12 + cursorSpeed * 0.08, 0.12, 0.25);
        glowRadius += (targetGlowRadius - glowRadius) * dynamicEase;

        context.save();
        context.filter = `blur(${GLOW_BLUR_PX}px)`;
        context.globalCompositeOperation = "lighter";
        const cursorGlow = context.createRadialGradient(
          cursor.x,
          cursor.y,
          0,
          cursor.x,
          cursor.y,
          glowRadius
        );
        cursorGlow.addColorStop(0, "rgba(56, 189, 248, 0.15)");
        cursorGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
        context.fillStyle = cursorGlow;
        context.beginPath();
        context.arc(cursor.x, cursor.y, glowRadius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        node.originalX += node.driftVX;
        node.originalY += node.driftVY;
        const repulsionStrength = clamp(0.02 + smoothedSpeed * 0.01, 0.02, 0.04);
        let easeBackToOrigin = true;

        if (node.originalX <= 0 || node.originalX >= width) {
          node.driftVX *= -1;
          node.originalX = clamp(node.originalX, 0, width);
        }

        if (node.originalY <= 0 || node.originalY >= height) {
          node.driftVY *= -1;
          node.originalY = clamp(node.originalY, 0, height);
        }

        if (cursor.active) {
          const dx = node.currentX - cursor.x;
          const dy = node.currentY - cursor.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0 && distance < NODE_REPULSION_RADIUS) {
            const strength = clamp(1 - distance / NODE_REPULSION_RADIUS, 0, 1);
            const scaledForce = repulsionStrength * strength;
            node.vx += dx * scaledForce;
            node.vy += dy * scaledForce;
            easeBackToOrigin = false;
          }
        }

        node.vx *= NODE_MOTION_DAMPING;
        node.vy *= NODE_MOTION_DAMPING;
        node.currentX += node.vx;
        node.currentY += node.vy;

        if (easeBackToOrigin) {
          node.currentX += (node.originalX - node.currentX) * NODE_RETURN_EASING;
          node.currentY += (node.originalY - node.currentY) * NODE_RETURN_EASING;
        }

        if (smoothedSpeed < IDLE_SPEED_THRESHOLD) {
          const idlePhase = timestamp * IDLE_MOTION_SPEED + node.id;
          node.currentX += Math.sin(idlePhase) * IDLE_MOTION_AMPLITUDE;
          node.currentY += Math.cos(idlePhase) * IDLE_MOTION_AMPLITUDE;
        }

        const offsetX = node.currentX - node.originalX;
        const offsetY = node.currentY - node.originalY;
        const offsetDistance = Math.hypot(offsetX, offsetY);
        if (offsetDistance > MAX_NODE_DISPLACEMENT) {
          const scale = MAX_NODE_DISPLACEMENT / offsetDistance;
          node.currentX = node.originalX + offsetX * scale;
          node.currentY = node.originalY + offsetY * scale;
        }
      }

      for (let first = 0; first < nodes.length; first += 1) {
        const nodeA = nodes[first];
        for (let second = first + 1; second < nodes.length; second += 1) {
          const nodeB = nodes[second];
          const dx = nodeA.currentX - nodeB.currentX;
          const dy = nodeA.currentY - nodeB.currentY;
          const distance = Math.hypot(dx, dy);

          if (distance > CONNECTION_DISTANCE) continue;

          const proximity = 1 - distance / CONNECTION_DISTANCE;
          const baseOpacity = LINE_ALPHA * proximity;
          let alpha = baseOpacity;

          if (cursor.active) {
            const midpointX = (nodeA.currentX + nodeB.currentX) / 2;
            const midpointY = (nodeA.currentY + nodeB.currentY) / 2;
            const cursorDx = midpointX - cursor.x;
            const cursorDy = midpointY - cursor.y;
            const cursorDistance = Math.hypot(cursorDx, cursorDy);

            if (cursorDistance < CURSOR_RADIUS) {
              const strength = clamp(1 - cursorDistance / CURSOR_RADIUS, 0, 1);
              alpha = baseOpacity + 0.15 * strength;
            }
          }

          context.strokeStyle = `rgba(56, 189, 248, ${clamp(alpha, 0, 0.45)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(nodeA.currentX, nodeA.currentY);
          context.lineTo(nodeB.currentX, nodeB.currentY);
          context.stroke();
        }
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        const boost = interactionBoosts[index];
        const alpha = NODE_ALPHA + 0.5 * boost;
        const radius = NODE_RADIUS * (1 + 0.4 * boost);
        context.fillStyle = `rgba(56, 189, 248, ${clamp(alpha, NODE_ALPHA, 1)})`;
        context.beginPath();
        context.arc(node.currentX, node.currentY, radius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrameId = window.requestAnimationFrame(step);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", clearCursor);
    scheduleSignalRipple();

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(rippleTimeoutId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", clearCursor);
    };
  }, []);

  return (
    <div className="pointer-events-auto absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
