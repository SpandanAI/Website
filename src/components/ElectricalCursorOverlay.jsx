import React, { useEffect, useRef } from "react";
import {
  clamp,
  dischargeEnvelope,
  generateClickDischarge,
  generateMicroSparkBranches,
  randomInRange
} from "../lib/neuralEffects";

const MAX_DPR = 2;
const GLOBAL_DISCHARGE_INTERVAL_MIN_MS = 1500;
const GLOBAL_DISCHARGE_INTERVAL_MAX_MS = 3200;
const GLOBAL_SPARK_DURATION_MIN_MS = 130;
const GLOBAL_SPARK_DURATION_MAX_MS = 220;
const GLOBAL_SPARK_RADIUS_MIN = 14;
const GLOBAL_SPARK_RADIUS_MAX = 34;
const GLOBAL_SPARK_BRANCH_COUNT_MIN = 1;
const GLOBAL_SPARK_BRANCH_COUNT_MAX = 3;
const GLOBAL_SPARK_JITTER = 2.6;
const GLOBAL_SPARK_OFFSET_PX = 8;
const GLOBAL_FLASH_ONLY_CHANCE = 0.11;
const GLOBAL_SPARK_INTENSITY = 0.55;
const GLOBAL_CLICK_INTENSITY = 0.86;
const GLOBAL_TAP_INTENSITY = 0.76;
const GLOBAL_CLICK_DURATION_MIN_MS = 180;
const GLOBAL_CLICK_DURATION_MAX_MS = 250;
const GLOBAL_TAP_DURATION_MIN_MS = 160;
const GLOBAL_TAP_DURATION_MAX_MS = 220;
const GLOBAL_CLICK_FLASH_MIN_MS = 55;
const GLOBAL_CLICK_FLASH_MAX_MS = 95;
const GLOBAL_CLICK_FLASH_RADIUS_MIN = 3.5;
const GLOBAL_CLICK_FLASH_RADIUS_MAX = 7.5;
const GLOBAL_CLICK_OUTER_ALPHA = 0.4;
const GLOBAL_CLICK_MAIN_ALPHA = 0.94;
const GLOBAL_CLICK_CORE_ALPHA = 0.52;
const GLOBAL_CLICK_ORIGIN_JITTER = 2;
const GLOBAL_TAP_ORIGIN_JITTER = 1.6;
const GLOBAL_SPARK_OUTER_ALPHA = 0.34;
const GLOBAL_SPARK_CORE_ALPHA = 0.88;
const GLOBAL_SPARK_FLASH_ALPHA = 0.3;
const MAX_GLOBAL_SPARKS = 2;
const CLICK_DISCHARGE_COOLDOWN_MS = 300;
const TAP_MAX_MOVE_PX = 10;
const TAP_MAX_DURATION_MS = 600;
const INTERACTIVE_SELECTOR = "a, button, input, textarea, select, label";

export default function ElectricalCursorOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const hoverQuery = window.matchMedia("(hover: hover)");
    const anyPointerQuery = window.matchMedia("(any-pointer: fine)");
    const anyHoverQuery = window.matchMedia("(any-hover: hover)");

    const computeFineHoverPointer = () =>
      (pointerQuery.matches && hoverQuery.matches) ||
      (anyPointerQuery.matches && anyHoverQuery.matches);

    let prefersReducedMotion = motionQuery.matches;
    let hasFineHoverPointer = computeFineHoverPointer();
    let isPageVisible = document.visibilityState !== "hidden";
    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let dischargeTimeoutId = 0;
    let wasEligible = false;
    let lastManualAt = 0;
    let pendingTouch = null;

    const pointer = {
      x: 0,
      y: 0,
      insideWindow: false,
      insideHero: false,
      overHeader: false,
      overInteractive: false
    };
    const activeSparks = [];

    const getDpr = () => Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const resizeCanvas = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const dpr = getDpr();
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pointInHero = (clientX, clientY) => {
      const hero = document.getElementById("home");
      if (!hero) return false;
      const rect = hero.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    const isEligible = () =>
      hasFineHoverPointer &&
      !prefersReducedMotion &&
      isPageVisible &&
      pointer.insideWindow &&
      !pointer.insideHero &&
      !pointer.overHeader &&
      !pointer.overInteractive &&
      width > 0 &&
      height > 0;

    const clearCanvas = () => {
      if (width && height) context.clearRect(0, 0, width, height);
    };

    const stopLoop = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    const drawPolyline = (points, strokeStyle, lineWidth) => {
      if (points.length < 2) return;
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < points.length; index += 1) {
        context.lineTo(points[index].x, points[index].y);
      }
      context.stroke();
    };

    const drawSparks = (now) => {
      clearCanvas();
      for (let index = 0; index < activeSparks.length; index += 1) {
        const spark = activeSparks[index];
        const progress = clamp((now - spark.createdAt) / spark.duration, 0, 1);
        const isManual = spark.source === "click" || spark.source === "tap";
        const envelope = dischargeEnvelope(progress) * (spark.intensity ?? GLOBAL_SPARK_INTENSITY);
        if (!isManual && envelope <= 0) continue;
        const flashLife = spark.flashDuration || spark.duration;
        const flashProgress = clamp((now - spark.createdAt) / flashLife, 0, 1);
        let flashEnvelope = envelope;
        if (isManual) {
          if (flashProgress >= 1) flashEnvelope = 0;
          else if (flashProgress < 0.48) flashEnvelope = 1;
          else flashEnvelope = (1 - (flashProgress - 0.48) / 0.52) ** 1.7;
        }

        if (flashEnvelope > 0) {
          const flashRadius = isManual
            ? spark.flashRadius
            : spark.flashRadius * (0.75 + progress * 0.5);
          const flash = context.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, flashRadius);
          flash.addColorStop(0, `rgba(37, 99, 235, ${(isManual ? 0.55 : GLOBAL_SPARK_FLASH_ALPHA) * flashEnvelope})`);
          flash.addColorStop(0.45, `rgba(8, 110, 140, ${(isManual ? 0.22 : 0.16) * flashEnvelope})`);
          flash.addColorStop(1, "rgba(37, 99, 235, 0)");
          context.fillStyle = flash;
          context.beginPath();
          context.arc(spark.x, spark.y, flashRadius, 0, Math.PI * 2);
          context.fill();
        }

        const polylines = spark.branches;
        for (let branchIndex = 0; branchIndex < polylines.length; branchIndex += 1) {
          const points = polylines[branchIndex];
          const life = spark.branchLives?.[branchIndex] ?? 1;
          if (progress > life) continue;
          const localProgress = life >= 0.999 ? progress : clamp(progress / life, 0, 1);
          const branchEnvelope = dischargeEnvelope(localProgress) * (spark.intensity ?? GLOBAL_SPARK_INTENSITY);
          if (branchEnvelope <= 0) continue;
          if (isManual) {
            const level = spark.branchLevels?.[branchIndex] ?? (branchIndex === 0 ? "primary" : "secondary");
            const weight = spark.branchWeights?.[branchIndex] ?? 1;
            const widthScale = level === "primary" ? 1 : weight;
            const alphaScale = level === "primary" ? 1 : 0.55 + weight * 0.35;
            const outerW = (spark.energy ? 4.05 : 3.45) * widthScale;
            const mainW = (spark.energy ? 2.05 : 1.72) * widthScale;
            const coreW = 0.72 * (level === "primary" ? 1 : Math.max(0.45, widthScale * 0.7));
            drawPolyline(points, `rgba(37, 99, 235, ${GLOBAL_CLICK_OUTER_ALPHA * branchEnvelope * alphaScale})`, outerW);
            drawPolyline(points, `rgba(8, 110, 140, ${GLOBAL_CLICK_MAIN_ALPHA * branchEnvelope * alphaScale})`, mainW);
            drawPolyline(points, `rgba(186, 230, 253, ${GLOBAL_CLICK_CORE_ALPHA * branchEnvelope * alphaScale})`, coreW);
          } else {
            drawPolyline(points, `rgba(37, 99, 235, ${GLOBAL_SPARK_OUTER_ALPHA * branchEnvelope})`, 2.35);
            drawPolyline(points, `rgba(8, 110, 140, ${GLOBAL_SPARK_CORE_ALPHA * branchEnvelope})`, 1.05);
          }
        }

        if (isManual && spark.fragments?.length) {
          for (let fragmentIndex = 0; fragmentIndex < spark.fragments.length; fragmentIndex += 1) {
            const life = spark.fragmentLives?.[fragmentIndex] ?? 0.7;
            if (progress > life) continue;
            const fragmentEnvelope =
              dischargeEnvelope(clamp(progress / life, 0, 1)) ** 2 * (spark.intensity ?? GLOBAL_SPARK_INTENSITY);
            if (fragmentEnvelope <= 0) continue;
            const points = spark.fragments[fragmentIndex];
            drawPolyline(points, `rgba(37, 99, 235, ${0.32 * fragmentEnvelope})`, 2.1);
            drawPolyline(points, `rgba(8, 110, 140, ${0.8 * fragmentEnvelope})`, 0.95);
          }
        }
      }
    };

    const step = (now) => {
      for (let index = activeSparks.length - 1; index >= 0; index -= 1) {
        if (now - activeSparks[index].createdAt >= activeSparks[index].duration) {
          activeSparks.splice(index, 1);
        }
      }

      if (!activeSparks.length) {
        clearCanvas();
        animationFrameId = 0;
        return;
      }

      drawSparks(now);
      animationFrameId = window.requestAnimationFrame(step);
    };

    const startLoop = () => {
      if (animationFrameId) return;
      animationFrameId = window.requestAnimationFrame(step);
    };

    const fireSpark = (now, options = {}) => {
      const source = options.source || "random";
      const isClick = source === "click";
      const isTap = source === "tap";

      if (prefersReducedMotion || !isPageVisible || !width || !height) return;
      if (pointer.insideHero || pointer.overHeader || pointer.overInteractive) return;
      if (isClick && (!hasFineHoverPointer || !pointer.insideWindow)) return;
      if (!isClick && !isTap && !isEligible()) return;

      if (activeSparks.length >= MAX_GLOBAL_SPARKS) activeSparks.shift();

      let intensity = GLOBAL_SPARK_INTENSITY;
      let radiusMin = GLOBAL_SPARK_RADIUS_MIN;
      let radiusMax = GLOBAL_SPARK_RADIUS_MAX;
      let durationMin = GLOBAL_SPARK_DURATION_MIN_MS;
      let durationMax = GLOBAL_SPARK_DURATION_MAX_MS;
      let branchMin = GLOBAL_SPARK_BRANCH_COUNT_MIN;
      let branchMax = GLOBAL_SPARK_BRANCH_COUNT_MAX;
      let flashOnlyChance = GLOBAL_FLASH_ONLY_CHANCE;
      let originJitter = GLOBAL_SPARK_OFFSET_PX;

      if (isClick) {
        intensity = GLOBAL_CLICK_INTENSITY;
        durationMin = GLOBAL_CLICK_DURATION_MIN_MS;
        durationMax = GLOBAL_CLICK_DURATION_MAX_MS;
        originJitter = GLOBAL_CLICK_ORIGIN_JITTER;
      } else if (isTap) {
        intensity = GLOBAL_TAP_INTENSITY;
        durationMin = GLOBAL_TAP_DURATION_MIN_MS;
        durationMax = GLOBAL_TAP_DURATION_MAX_MS;
        originJitter = GLOBAL_TAP_ORIGIN_JITTER;
      }

      const originX = clamp(pointer.x + (Math.random() - 0.5) * 2 * originJitter, 0, width);
      const originY = clamp(pointer.y + (Math.random() - 0.5) * 2 * originJitter, 0, height);

      if (isClick || isTap) {
        const discharge = generateClickDischarge(originX, originY, width, height, { compact: isTap });
        const energy = discharge.variant === "energy";
        activeSparks.push({
          x: originX,
          y: originY,
          createdAt: now,
          duration: randomInRange(durationMin, durationMax),
          flashDuration: randomInRange(GLOBAL_CLICK_FLASH_MIN_MS, GLOBAL_CLICK_FLASH_MAX_MS),
          flashRadius: randomInRange(GLOBAL_CLICK_FLASH_RADIUS_MIN, GLOBAL_CLICK_FLASH_RADIUS_MAX) * (energy ? 1.15 : 1),
          intensity: intensity * (energy ? 1.12 : 1),
          source,
          energy,
          branches: discharge.branches,
          fragments: discharge.fragments,
          branchLives: discharge.branchLives,
          fragmentLives: discharge.fragmentLives,
          branchLevels: discharge.branchLevels,
          branchWeights: discharge.branchWeights
        });
        startLoop();
        return;
      }

      const radius = randomInRange(radiusMin, radiusMax);
      const flashOnly = Math.random() < flashOnlyChance;
      const maxBranches = flashOnly ? 0 : Math.round(randomInRange(branchMin, branchMax));

      activeSparks.push({
        x: originX,
        y: originY,
        createdAt: now,
        duration: randomInRange(durationMin, durationMax),
        flashRadius: 8 + radius * 0.32,
        intensity,
        source,
        branches: maxBranches
          ? generateMicroSparkBranches(originX, originY, radius, maxBranches, GLOBAL_SPARK_JITTER)
          : []
      });
      startLoop();
    };

    const clearDischargeTimer = () => {
      window.clearTimeout(dischargeTimeoutId);
      dischargeTimeoutId = 0;
    };

    const scheduleDischarge = () => {
      clearDischargeTimer();
      if (!isEligible()) return;
      const delay = randomInRange(GLOBAL_DISCHARGE_INTERVAL_MIN_MS, GLOBAL_DISCHARGE_INTERVAL_MAX_MS);
      dischargeTimeoutId = window.setTimeout(() => {
        dischargeTimeoutId = 0;
        if (isEligible()) fireSpark(performance.now());
        scheduleDischarge();
      }, delay);
    };

    const syncScheduler = () => {
      const eligible = isEligible();
      if (eligible && !wasEligible) scheduleDischarge();
      if (!eligible && wasEligible) clearDischargeTimer();
      wasEligible = eligible;
    };

    const updatePointerFromEvent = (event) => {
      if (event.pointerType === "touch") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.insideWindow = true;
      pointer.insideHero = pointInHero(event.clientX, event.clientY);
      const target = event.target;
      pointer.overHeader = Boolean(target?.closest?.("header"));
      pointer.overInteractive = Boolean(target?.closest?.(INTERACTIVE_SELECTOR));
    };

    const refreshPointerGeometry = () => {
      if (!pointer.insideWindow) return;
      pointer.insideHero = pointInHero(pointer.x, pointer.y);
      const target = document.elementFromPoint(pointer.x, pointer.y);
      pointer.overHeader = Boolean(target?.closest?.("header"));
      pointer.overInteractive = Boolean(target?.closest?.(INTERACTIVE_SELECTOR));
      syncScheduler();
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        if (pendingTouch && event.pointerId === pendingTouch.pointerId) {
          const dist = Math.hypot(event.clientX - pendingTouch.x, event.clientY - pendingTouch.y);
          if (dist > TAP_MAX_MOVE_PX) pendingTouch = null;
        }
        pointer.insideWindow = false;
        syncScheduler();
        return;
      }
      updatePointerFromEvent(event);
      syncScheduler();
    };

    const handlePointerDown = (event) => {
      const overInteractive = Boolean(event.target?.closest?.(INTERACTIVE_SELECTOR));
      const overHeader = Boolean(event.target?.closest?.("header"));
      const insideHero = pointInHero(event.clientX, event.clientY);

      if (event.pointerType === "touch") {
        pendingTouch = {
          x: event.clientX,
          y: event.clientY,
          t: performance.now(),
          pointerId: event.pointerId,
          overInteractive,
          overHeader,
          insideHero
        };
        return;
      }

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.insideWindow = true;
      pointer.insideHero = insideHero;
      pointer.overHeader = overHeader;
      pointer.overInteractive = overInteractive;
      if (!isEligible()) return;
      if (performance.now() - lastManualAt < CLICK_DISCHARGE_COOLDOWN_MS) return;
      lastManualAt = performance.now();
      fireSpark(performance.now(), { source: "click" });
      wasEligible = true;
      scheduleDischarge();
    };

    const handlePointerUp = (event) => {
      if (event.pointerType !== "touch") return;
      const start = pendingTouch;
      pendingTouch = null;
      if (!start || start.pointerId !== event.pointerId) return;
      if (start.overInteractive || start.overHeader || start.insideHero) return;
      const dist = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      const elapsed = performance.now() - start.t;
      if (dist > TAP_MAX_MOVE_PX || elapsed > TAP_MAX_DURATION_MS) return;
      if (event.target?.closest?.(INTERACTIVE_SELECTOR) || event.target?.closest?.("header")) return;
      if (pointInHero(event.clientX, event.clientY)) return;
      if (prefersReducedMotion || !isPageVisible) return;
      if (performance.now() - lastManualAt < CLICK_DISCHARGE_COOLDOWN_MS) return;
      lastManualAt = performance.now();
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.insideHero = false;
      pointer.overHeader = false;
      pointer.overInteractive = false;
      fireSpark(performance.now(), { source: "tap" });
    };

    const clearPointer = () => {
      pendingTouch = null;
      pointer.insideWindow = false;
      pointer.insideHero = false;
      pointer.overHeader = false;
      pointer.overInteractive = false;
      syncScheduler();
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState !== "hidden";
      if (!isPageVisible) {
        activeSparks.length = 0;
        stopLoop();
        clearCanvas();
      }
      syncScheduler();
    };

    const syncCapability = () => {
      prefersReducedMotion = motionQuery.matches;
      hasFineHoverPointer = computeFineHoverPointer();
      if (prefersReducedMotion) {
        activeSparks.length = 0;
        stopLoop();
        clearCanvas();
      }
      syncScheduler();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", refreshPointerGeometry, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointerleave", clearPointer);
    window.addEventListener("pointercancel", clearPointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const bindQuery = (query, handler) => {
      if (query.addEventListener) query.addEventListener("change", handler);
      else query.addListener(handler);
    };
    const unbindQuery = (query, handler) => {
      if (query.removeEventListener) query.removeEventListener("change", handler);
      else query.removeListener(handler);
    };

    bindQuery(motionQuery, syncCapability);
    bindQuery(pointerQuery, syncCapability);
    bindQuery(hoverQuery, syncCapability);
    bindQuery(anyPointerQuery, syncCapability);
    bindQuery(anyHoverQuery, syncCapability);

    return () => {
      clearDischargeTimer();
      stopLoop();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", refreshPointerGeometry);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("pointercancel", clearPointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unbindQuery(motionQuery, syncCapability);
      unbindQuery(pointerQuery, syncCapability);
      unbindQuery(hoverQuery, syncCapability);
      unbindQuery(anyPointerQuery, syncCapability);
      unbindQuery(anyHoverQuery, syncCapability);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[45]"
      aria-hidden="true"
    />
  );
}
