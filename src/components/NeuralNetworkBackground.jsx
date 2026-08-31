import React, { useEffect, useRef } from "react";
import {
  clamp,
  dischargeEnvelope,
  findConnectedNeighborIds,
  generateElectricalArcPoints,
  generateLocalSparkPoints,
  pickNearbyNodeIds,
  randomInRange
} from "../lib/neuralEffects";

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

const MAX_DPR = 2; // cap devicePixelRatio so retina canvases stay at most 2x
const DISCHARGE_INTERVAL_MIN_MS = 900;
const DISCHARGE_INTERVAL_MAX_MS = 2200;
const DISCHARGE_OFFSET_PX = 18;
const DISCHARGE_DURATION_MIN_MS = 140;
const DISCHARGE_DURATION_MAX_MS = 240;
const ARC_JITTER_PX = 7;
const ARC_SEGMENTS_MIN = 4;
const ARC_SEGMENTS_MAX = 6;
const FLASH_DURATION_MS = 180;
const NODE_EXCITATION_DECAY = 0.9;
const EDGE_PULSE_DURATION_MS = 280;
const AMBIENT_INTERVAL_MIN_MS = 4000;
const AMBIENT_INTERVAL_MAX_MS = 7000;
const MAX_ACTIVE_DISCHARGES = 4;
const MAX_ACTIVE_EDGE_PULSES = 8;
const MAX_SIMULTANEOUS_EXCITED_NODES = 12;
const MAX_ACTIVE_FLASHES = 4;
const PROPAGATION_ONE_HOP_CHANCE = 0.25;
const PROPAGATION_TWO_HOP_CHANCE = 0.05;
const HERO_VISIBILITY_THRESHOLD = 0.12;
const CLICK_DISCHARGE_COOLDOWN_MS = 300;
const TAP_MAX_MOVE_PX = 10;
const TAP_MAX_DURATION_MS = 600;
const INTERACTIVE_SELECTOR = "a, button, input, textarea, select, label";

export default function NeuralNetworkBackground() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionQuery.matches;
    let isHeroVisible = true;
    let isPageVisible = document.visibilityState !== "hidden";

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
    let dischargeTimeoutId = 0;
    let ambientTimeoutId = 0;
    let isRippleActive = false;
    let wasCursorActive = false;
    let lastManualAt = 0;
    let pendingTouch = null;

    const nodes = [];
    const interactionBoosts = new Array(NODE_COUNT).fill(0);
    const activeDischarges = [];
    const activeFlashes = [];
    const activeEdgePulses = [];
    const edgeHighlights = new Map();

    const createNode = (id, x, y) => ({
      id,
      originalX: x,
      originalY: y,
      currentX: 0,
      currentY: 0,
      driftVX: (Math.random() - 0.5) * 0.28,
      driftVY: (Math.random() - 0.5) * 0.28,
      vx: 0,
      vy: 0,
      excitation: 0
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

    const getDpr = () => Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = rect.width;
      const nextHeight = rect.height;
      const dpr = getDpr();

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

    const effectsAllowed = () =>
      !prefersReducedMotion && isHeroVisible && isPageVisible && Boolean(width && height);

    const excitedNodeCount = () => {
      let count = 0;
      for (let index = 0; index < nodes.length; index += 1) {
        if (nodes[index].excitation > 0.08) count += 1;
      }
      return count;
    };

    const exciteNode = (nodeId, amount) => {
      const node = nodes[nodeId];
      if (!node) return;
      if (excitedNodeCount() >= MAX_SIMULTANEOUS_EXCITED_NODES && node.excitation < 0.08) return;
      node.excitation = clamp(node.excitation + amount, 0, 1);
    };

    const addFlash = (x, y, now, scale = 1) => {
      if (activeFlashes.length >= MAX_ACTIVE_FLASHES) activeFlashes.shift();
      activeFlashes.push({
        x,
        y,
        createdAt: now,
        duration: FLASH_DURATION_MS,
        scale
      });
    };

    const addDischarge = (points, now, duration) => {
      if (activeDischarges.length >= MAX_ACTIVE_DISCHARGES) activeDischarges.shift();
      activeDischarges.push({
        points,
        createdAt: now,
        duration
      });
    };

    const addEdgePulse = (fromId, toId, now, hopsRemaining) => {
      if (fromId === toId) return;
      if (activeEdgePulses.length >= MAX_ACTIVE_EDGE_PULSES) activeEdgePulses.shift();
      activeEdgePulses.push({
        fromId,
        toId,
        createdAt: now,
        duration: EDGE_PULSE_DURATION_MS,
        hopsRemaining
      });
      const key = fromId < toId ? `${fromId}:${toId}` : `${toId}:${fromId}`;
      edgeHighlights.set(key, 0.55);
    };

    const choosePropagationDepth = () => {
      const roll = Math.random();
      if (roll < PROPAGATION_TWO_HOP_CHANCE) return 2;
      if (roll < PROPAGATION_TWO_HOP_CHANCE + PROPAGATION_ONE_HOP_CHANCE) return 1;
      return 0;
    };

    const fireLocalSpark = (originX, originY, now) => {
      addDischarge(generateLocalSparkPoints(originX, originY, 22), now, randomInRange(120, 180));
      addFlash(originX, originY, now, 0.7);
    };

    const fireTowardNodes = (originX, originY, targetIds, now, hopsRemaining, excitation = 0.85, flashScale = 1) => {
      const duration = randomInRange(DISCHARGE_DURATION_MIN_MS, DISCHARGE_DURATION_MAX_MS);
      targetIds.forEach((nodeId) => {
        const node = nodes[nodeId];
        if (!node) return;
        const segments = Math.round(randomInRange(ARC_SEGMENTS_MIN, ARC_SEGMENTS_MAX));
        addDischarge(
          generateElectricalArcPoints(
            originX,
            originY,
            node.currentX,
            node.currentY,
            segments,
            ARC_JITTER_PX
          ),
          now,
          duration
        );
        exciteNode(nodeId, excitation);

        const neighbors = findConnectedNeighborIds(nodes, nodeId, CONNECTION_DISTANCE);
        const edgeCount = Math.min(neighbors.length, 1 + Math.floor(Math.random() * 3));
        for (let index = 0; index < edgeCount; index += 1) {
          const key = nodeId < neighbors[index] ? `${nodeId}:${neighbors[index]}` : `${neighbors[index]}:${nodeId}`;
          edgeHighlights.set(key, Math.max(edgeHighlights.get(key) ?? 0, 0.4));
        }

        if (hopsRemaining > 0 && neighbors.length) {
          const nextId = neighbors[Math.floor(Math.random() * Math.min(neighbors.length, 4))];
          addEdgePulse(nodeId, nextId, now, hopsRemaining - 1);
        }
      });
      addFlash(originX, originY, now, flashScale);
    };

    const fireCursorDischarge = (now) => {
      if (!effectsAllowed() || !cursor.active) return;
      const originX = cursor.x + (Math.random() - 0.5) * 2 * DISCHARGE_OFFSET_PX;
      const originY = cursor.y + (Math.random() - 0.5) * 2 * DISCHARGE_OFFSET_PX;
      const targetCount = 1 + (Math.random() < 0.45 ? 1 : 0) + (Math.random() < 0.18 ? 1 : 0);
      const targetIds = pickNearbyNodeIds(nodes, originX, originY, CURSOR_RADIUS, targetCount);
      if (!targetIds.length) {
        fireLocalSpark(originX, originY, now);
        return;
      }
      fireTowardNodes(originX, originY, targetIds, now, choosePropagationDepth());
    };

    const fireAmbientEvent = (now) => {
      if (!effectsAllowed() || !nodes.length) return;
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      exciteNode(node.id, 0.55);
      addFlash(node.currentX, node.currentY, now, 0.45);
      const neighbors = findConnectedNeighborIds(nodes, node.id, CONNECTION_DISTANCE);
      if (neighbors.length) {
        addEdgePulse(node.id, neighbors[0], now, 0);
      }
    };

    const firePointerStimulus = (clientX, clientY, pointerType) => {
      if (!effectsAllowed()) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const now = performance.now();
      const isFinePointer = pointerType !== "touch";
      const targetCount = isFinePointer ? 1 + (Math.random() < 0.55 ? 1 : 0) : 1;
      const searchRadius = isFinePointer ? CURSOR_RADIUS : CURSOR_RADIUS * 0.7;
      const targetIds = pickNearbyNodeIds(nodes, x, y, searchRadius, targetCount);
      const hopsRemaining = Math.random() < (isFinePointer ? 0.45 : 0.4) ? 1 : 0;
      if (!targetIds.length) {
        fireLocalSpark(x, y, now);
        return;
      }
      fireTowardNodes(x, y, targetIds, now, hopsRemaining, isFinePointer ? 0.95 : 0.9, isFinePointer ? 1.2 : 1);
    };

    const clearDischargeTimer = () => {
      window.clearTimeout(dischargeTimeoutId);
      dischargeTimeoutId = 0;
    };

    const scheduleCursorDischarge = () => {
      clearDischargeTimer();
      if (!effectsAllowed() || !cursor.active) return;
      const delay = randomInRange(DISCHARGE_INTERVAL_MIN_MS, DISCHARGE_INTERVAL_MAX_MS);
      dischargeTimeoutId = window.setTimeout(() => {
        dischargeTimeoutId = 0;
        if (!effectsAllowed() || !cursor.active) return;
        fireCursorDischarge(performance.now());
        scheduleCursorDischarge();
      }, delay);
    };

    const scheduleAmbientFiring = () => {
      window.clearTimeout(ambientTimeoutId);
      ambientTimeoutId = 0;
      if (!effectsAllowed()) return;
      const delay = randomInRange(AMBIENT_INTERVAL_MIN_MS, AMBIENT_INTERVAL_MAX_MS);
      ambientTimeoutId = window.setTimeout(() => {
        ambientTimeoutId = 0;
        if (!effectsAllowed()) return;
        fireAmbientEvent(performance.now());
        scheduleAmbientFiring();
      }, delay);
    };

    const scheduleSignalRipple = () => {
      if (!effectsAllowed()) return;
      const delay = 8000 + Math.random() * 2000;
      rippleTimeoutId = window.setTimeout(() => {
        if (!width || !height || !effectsAllowed()) {
          if (effectsAllowed()) scheduleSignalRipple();
          return;
        }
        rippleX = Math.random() * width;
        rippleY = Math.random() * height;
        rippleStartTimestamp = performance.now();
        isRippleActive = true;
        scheduleSignalRipple();
      }, delay);
    };

    const pointInCanvas = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        if (pendingTouch && event.pointerId === pendingTouch.pointerId) {
          const dist = Math.hypot(event.clientX - pendingTouch.x, event.clientY - pendingTouch.y);
          if (dist > TAP_MAX_MOVE_PX) pendingTouch = null;
        }
        return;
      }
      if (event.target?.closest?.("header")) {
        cursor.active = false;
        return;
      }
      if (!pointInCanvas(event.clientX, event.clientY)) {
        cursor.active = false;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
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
    };

    const clearCursor = () => {
      cursor.active = false;
      pendingTouch = null;
    };

    const isInteractiveTarget = (target) =>
      Boolean(target?.closest?.(INTERACTIVE_SELECTOR) || target?.closest?.("header"));

    const handlePointerDown = (event) => {
      if (isInteractiveTarget(event.target)) return;
      if (!pointInCanvas(event.clientX, event.clientY)) return;

      if (event.pointerType === "touch") {
        pendingTouch = {
          x: event.clientX,
          y: event.clientY,
          t: performance.now(),
          pointerId: event.pointerId
        };
        return;
      }

      if (performance.now() - lastManualAt < CLICK_DISCHARGE_COOLDOWN_MS) return;
      lastManualAt = performance.now();
      firePointerStimulus(event.clientX, event.clientY, event.pointerType);
      if (cursor.active) scheduleCursorDischarge();
    };

    const handlePointerUp = (event) => {
      if (event.pointerType !== "touch") return;
      const start = pendingTouch;
      pendingTouch = null;
      if (!start || start.pointerId !== event.pointerId) return;
      if (isInteractiveTarget(event.target)) return;
      if (!pointInCanvas(event.clientX, event.clientY)) return;
      const dist = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      const elapsed = performance.now() - start.t;
      if (dist > TAP_MAX_MOVE_PX || elapsed > TAP_MAX_DURATION_MS) return;
      if (performance.now() - lastManualAt < CLICK_DISCHARGE_COOLDOWN_MS) return;
      lastManualAt = performance.now();
      firePointerStimulus(event.clientX, event.clientY, "touch");
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

    const pruneEffects = (now) => {
      for (let index = activeDischarges.length - 1; index >= 0; index -= 1) {
        if (now - activeDischarges[index].createdAt >= activeDischarges[index].duration) {
          activeDischarges.splice(index, 1);
        }
      }
      for (let index = activeFlashes.length - 1; index >= 0; index -= 1) {
        if (now - activeFlashes[index].createdAt >= activeFlashes[index].duration) {
          activeFlashes.splice(index, 1);
        }
      }
      for (let index = activeEdgePulses.length - 1; index >= 0; index -= 1) {
        const pulse = activeEdgePulses[index];
        const progress = (now - pulse.createdAt) / pulse.duration;
        if (progress >= 1) {
          exciteNode(pulse.toId, 0.7);
          if (pulse.hopsRemaining > 0) {
            const neighbors = findConnectedNeighborIds(
              nodes,
              pulse.toId,
              CONNECTION_DISTANCE,
              pulse.fromId
            );
            if (neighbors.length) {
              addEdgePulse(pulse.toId, neighbors[0], now, pulse.hopsRemaining - 1);
            }
          }
          activeEdgePulses.splice(index, 1);
        }
      }
      edgeHighlights.forEach((value, key) => {
        const next = value * 0.9;
        if (next < 0.03) edgeHighlights.delete(key);
        else edgeHighlights.set(key, next);
      });
    };

    const drawPolyline = (points, alpha, lineWidth) => {
      if (points.length < 2) return;
      context.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < points.length; index += 1) {
        context.lineTo(points[index].x, points[index].y);
      }
      context.stroke();
    };

    const drawNetwork = (timestamp, withMotion) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);

      if (withMotion && isRippleActive) {
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

      if (withMotion && cursor.active) {
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

      context.save();
      context.globalCompositeOperation = "lighter";
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
          const edgeKey = `${first}:${second}`;
          const highlight = edgeHighlights.get(edgeKey) ?? 0;

          if (withMotion && cursor.active) {
            const midpointX = (nodeA.currentX + nodeB.currentX) / 2;
            const midpointY = (nodeA.currentY + nodeB.currentY) / 2;
            const cursorDistance = Math.hypot(midpointX - cursor.x, midpointY - cursor.y);
            if (cursorDistance < CURSOR_RADIUS) {
              const strength = clamp(1 - cursorDistance / CURSOR_RADIUS, 0, 1);
              alpha = baseOpacity + 0.15 * strength;
            }
          }

          alpha = clamp(alpha + highlight * 0.45, 0, 0.7);
          context.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          context.lineWidth = highlight > 0.15 ? 1.35 : 1;
          context.beginPath();
          context.moveTo(nodeA.currentX, nodeA.currentY);
          context.lineTo(nodeB.currentX, nodeB.currentY);
          context.stroke();
        }
      }

      if (withMotion) {
        for (let index = 0; index < activeEdgePulses.length; index += 1) {
          const pulse = activeEdgePulses[index];
          const from = nodes[pulse.fromId];
          const to = nodes[pulse.toId];
          if (!from || !to) continue;
          const progress = clamp((timestamp - pulse.createdAt) / pulse.duration, 0, 1);
          const x = from.currentX + (to.currentX - from.currentX) * progress;
          const y = from.currentY + (to.currentY - from.currentY) * progress;
          context.fillStyle = "rgba(224, 242, 254, 0.9)";
          context.beginPath();
          context.arc(x, y, 2.1, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = "rgba(56, 189, 248, 0.22)";
          context.beginPath();
          context.arc(x, y, 7, 0, Math.PI * 2);
          context.fill();
        }

        for (let index = 0; index < activeDischarges.length; index += 1) {
          const discharge = activeDischarges[index];
          const progress = clamp((timestamp - discharge.createdAt) / discharge.duration, 0, 1);
          const envelope = dischargeEnvelope(progress);
          drawPolyline(discharge.points, envelope * 0.22, 3.2);
          drawPolyline(discharge.points, envelope * 0.9, 1);
        }

        for (let index = 0; index < activeFlashes.length; index += 1) {
          const flash = activeFlashes[index];
          const progress = clamp((timestamp - flash.createdAt) / flash.duration, 0, 1);
          const envelope = 1 - progress;
          const radius = (10 + progress * 16) * flash.scale;
          const flashGradient = context.createRadialGradient(
            flash.x,
            flash.y,
            0,
            flash.x,
            flash.y,
            radius
          );
          flashGradient.addColorStop(0, `rgba(224, 242, 254, ${0.45 * envelope})`);
          flashGradient.addColorStop(0.4, `rgba(56, 189, 248, ${0.18 * envelope})`);
          flashGradient.addColorStop(1, "rgba(56, 189, 248, 0)");
          context.fillStyle = flashGradient;
          context.beginPath();
          context.arc(flash.x, flash.y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        const boost = withMotion ? interactionBoosts[index] : 0;
        const excitation = withMotion ? node.excitation : 0;
        const alpha = NODE_ALPHA + 0.5 * boost + 0.45 * excitation;
        const radius = NODE_RADIUS * (1 + 0.4 * boost + 0.7 * excitation);
        context.fillStyle = `rgba(56, 189, 248, ${clamp(alpha, NODE_ALPHA, 1)})`;
        context.beginPath();
        context.arc(node.currentX, node.currentY, radius, 0, Math.PI * 2);
        context.fill();
        if (excitation > 0.12) {
          context.fillStyle = `rgba(186, 230, 253, ${0.18 * excitation})`;
          context.beginPath();
          context.arc(node.currentX, node.currentY, radius + 3.5, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.restore();
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
        if (!wasCursorActive) scheduleCursorDischarge();
      } else if (wasCursorActive) {
        clearDischargeTimer();
      }
      wasCursorActive = cursor.active;

      updateInteractions();
      pruneEffects(timestamp);

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

        node.excitation *= NODE_EXCITATION_DECAY;
        if (node.excitation < 0.01) node.excitation = 0;
      }

      drawNetwork(timestamp, true);
      animationFrameId = window.requestAnimationFrame(step);
    };

    const freezeVisibleNetwork = () => {
      if (!width || !height) return;
      activeDischarges.length = 0;
      activeFlashes.length = 0;
      activeEdgePulses.length = 0;
      edgeHighlights.clear();
      for (let index = 0; index < nodes.length; index += 1) {
        nodes[index].excitation = 0;
      }
      drawNetwork(performance.now(), false);
    };

    const stopLoop = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      clearDischargeTimer();
      window.clearTimeout(ambientTimeoutId);
      window.clearTimeout(rippleTimeoutId);
      ambientTimeoutId = 0;
      rippleTimeoutId = 0;
      cursor.active = false;
      wasCursorActive = false;
    };

    const startLoop = () => {
      if (prefersReducedMotion) {
        drawNetwork(performance.now(), false);
        return;
      }
      if (!isHeroVisible || !isPageVisible) return;
      if (animationFrameId) return;
      scheduleSignalRipple();
      scheduleAmbientFiring();
      animationFrameId = window.requestAnimationFrame(step);
    };

    const syncRunState = () => {
      const shouldRun = !prefersReducedMotion && isHeroVisible && isPageVisible;
      if (shouldRun) startLoop();
      else {
        stopLoop();
        freezeVisibleNetwork();
      }
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState !== "hidden";
      syncRunState();
    };

    const handleMotionPreference = () => {
      prefersReducedMotion = motionQuery.matches;
      syncRunState();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointerleave", clearCursor);
    window.addEventListener("pointercancel", clearCursor);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionPreference);
    } else {
      motionQuery.addListener(handleMotionPreference);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isHeroVisible = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= HERO_VISIBILITY_THRESHOLD);
        syncRunState();
      },
      { threshold: [0, HERO_VISIBILITY_THRESHOLD, 0.35, 0.7, 1] }
    );
    observer.observe(wrapper);

    syncRunState();

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", clearCursor);
      window.removeEventListener("pointercancel", clearCursor);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionPreference);
      } else {
        motionQuery.removeListener(handleMotionPreference);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
