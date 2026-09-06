import React, { useEffect, useRef } from "react";
import {
  clamp,
  dischargeEnvelope,
  generateClickDischarge,
  generateMicroSparkBranches,
  generateWakeFilament,
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
const GLOBAL_CLICK_INTENSITY = 0.92;
const GLOBAL_TAP_INTENSITY = 0.84;
const GLOBAL_CLICK_DURATION_MIN_MS = 150;
const GLOBAL_CLICK_DURATION_MAX_MS = 210;
const GLOBAL_TAP_DURATION_MIN_MS = 145;
const GLOBAL_TAP_DURATION_MAX_MS = 195;
const GLOBAL_CLICK_FLASH_MIN_MS = 42;
const GLOBAL_CLICK_FLASH_MAX_MS = 72;
const GLOBAL_CLICK_FLASH_RADIUS_MIN = 2.8;
const GLOBAL_CLICK_FLASH_RADIUS_MAX = 5.4;
const GLOBAL_TAP_FLASH_MIN_MS = 40;
const GLOBAL_TAP_FLASH_MAX_MS = 68;
const GLOBAL_TAP_FLASH_RADIUS_MIN = 2.6;
const GLOBAL_TAP_FLASH_RADIUS_MAX = 4.6;
const GLOBAL_CLICK_OUTER_ALPHA = 0.4;
const GLOBAL_CLICK_MAIN_ALPHA = 0.94;
const GLOBAL_CLICK_CORE_ALPHA = 0.52;
const DESKTOP_CLICK_OUTER_WIDTH = 1.72;
const DESKTOP_CLICK_MAIN_WIDTH = 0.96;
const DESKTOP_CLICK_CORE_WIDTH = 0.4;
const DESKTOP_CLICK_OUTER_ALPHA = 0.2;
const DESKTOP_CLICK_MAIN_ALPHA = 0.7;
const DESKTOP_CLICK_CORE_ALPHA = 0.88;
const MOBILE_TAP_OUTER_WIDTH = 2.05;
const MOBILE_TAP_MAIN_WIDTH = 1.12;
const MOBILE_TAP_CORE_WIDTH = 0.46;
const MOBILE_TAP_OUTER_ALPHA = 0.22;
const MOBILE_TAP_MAIN_ALPHA = 0.74;
const MOBILE_TAP_CORE_ALPHA = 0.86;
const GLOBAL_CLICK_ORIGIN_JITTER = 2;
const GLOBAL_TAP_ORIGIN_JITTER = 1.6;
const GLOBAL_SPARK_OUTER_ALPHA = 0.34;
const GLOBAL_SPARK_CORE_ALPHA = 0.88;
const GLOBAL_SPARK_FLASH_ALPHA = 0.3;
const MAX_GLOBAL_SPARKS = 2;
const WAKE_PATH_MAX = 12;
const WAKE_SAMPLE_MIN_DIST_PX = 16;
const WAKE_SAMPLE_MIN_MS = 28;
const WAKE_MAX_ACTIVE = 8;
const WAKE_DURATION_MIN_MS = 260;
const WAKE_DURATION_MAX_MS = 460;
const WAKE_SPEED_SLOW = 0.16;
const WAKE_SPEED_FAST = 1.15;
const WAKE_SPEED_CLAMP = 2.2;
const WAKE_HERO_SCALE = 0.42;
const WAKE_INTERACTIVE_SCALE = 0.52;
const WAKE_CURSOR_INTENSITY = 0.36;
const CLICK_DISCHARGE_COOLDOWN_MS = 60;
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
    const activeWakes = [];
    const pathHistory = [];
    let lastWakeSampleAt = 0;

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
      pathHistory.length = 0;
      lastWakeSampleAt = 0;
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

    const isMobileNavOpen = () => Boolean(document.getElementById("mobile-navigation"));

    const wakeAllowed = () =>
      !prefersReducedMotion && isPageVisible && width > 0 && height > 0 && !isMobileNavOpen();

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
      for (let index = 0; index < activeSparks.length; index += 1) {
        const spark = activeSparks[index];
        const progress = clamp((now - spark.createdAt) / spark.duration, 0, 1);
        const isClick = spark.source === "click";
        const isTap = spark.source === "tap";
        const isManual = isClick || isTap;
        const envelope = dischargeEnvelope(progress) * (spark.intensity ?? GLOBAL_SPARK_INTENSITY);
        if (!isManual && envelope <= 0) continue;
        const flashLife = spark.flashDuration || spark.duration;
        const flashProgress = clamp((now - spark.createdAt) / flashLife, 0, 1);
        let flashEnvelope = envelope;
        if (isClick) {
          if (flashProgress >= 1) flashEnvelope = 0;
          else if (flashProgress < 0.34) flashEnvelope = 1;
          else flashEnvelope = (1 - (flashProgress - 0.34) / 0.66) ** 2.1;
        } else if (isTap) {
          if (flashProgress >= 1) flashEnvelope = 0;
          else if (flashProgress < 0.36) flashEnvelope = 1;
          else flashEnvelope = (1 - (flashProgress - 0.36) / 0.64) ** 2;
        }

        if (flashEnvelope > 0) {
          const flashRadius = isManual
            ? spark.flashRadius
            : spark.flashRadius * (0.75 + progress * 0.5);
          const originAlpha = isClick ? 0.7 : isTap ? 0.64 : GLOBAL_SPARK_FLASH_ALPHA;
          const midAlpha = isClick ? 0.18 : isTap ? 0.16 : 0.16;
          const flash = context.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, flashRadius);
          flash.addColorStop(0, `rgba(37, 99, 235, ${originAlpha * flashEnvelope})`);
          flash.addColorStop(0.45, `rgba(8, 110, 140, ${midAlpha * flashEnvelope})`);
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
          const fade = isClick
            ? dischargeEnvelope(localProgress) ** 1.28
            : isTap
              ? dischargeEnvelope(localProgress) ** 1.2
              : dischargeEnvelope(localProgress);
          const branchEnvelope = fade * (spark.intensity ?? GLOBAL_SPARK_INTENSITY);
          if (branchEnvelope <= 0) continue;
          if (isClick) {
            const level = spark.branchLevels?.[branchIndex] ?? (branchIndex === 0 ? "primary" : "secondary");
            const isPrimary = level === "primary";
            const isTertiary = level === "tertiary";
            const leadSecondary = !isPrimary && !isTertiary && branchIndex === 1;
            const widthScale = isPrimary ? 1 : isTertiary ? 0.32 : leadSecondary ? 0.55 : 0.42;
            const alphaScale = isPrimary ? 1 : isTertiary ? 0.38 : leadSecondary ? 0.62 : 0.48;
            const outerW = DESKTOP_CLICK_OUTER_WIDTH * widthScale;
            const mainW = DESKTOP_CLICK_MAIN_WIDTH * widthScale;
            const coreW = DESKTOP_CLICK_CORE_WIDTH * (isPrimary ? 1 : Math.max(0.55, widthScale));
            drawPolyline(points, `rgba(37, 99, 235, ${DESKTOP_CLICK_OUTER_ALPHA * branchEnvelope * alphaScale})`, outerW);
            drawPolyline(points, `rgba(8, 110, 140, ${DESKTOP_CLICK_MAIN_ALPHA * branchEnvelope * alphaScale})`, mainW);
            drawPolyline(points, `rgba(186, 230, 253, ${DESKTOP_CLICK_CORE_ALPHA * branchEnvelope * alphaScale})`, coreW);
          } else if (isTap) {
            const level = spark.branchLevels?.[branchIndex] ?? (branchIndex === 0 ? "primary" : "secondary");
            const isPrimary = level === "primary";
            const isTertiary = level === "tertiary";
            const leadSecondary = !isPrimary && !isTertiary && branchIndex === 1;
            const widthScale = isPrimary ? 1 : isTertiary ? 0.34 : leadSecondary ? 0.6 : 0.46;
            const alphaScale = isPrimary ? 1 : isTertiary ? 0.4 : leadSecondary ? 0.66 : 0.52;
            const outerW = MOBILE_TAP_OUTER_WIDTH * widthScale;
            const mainW = MOBILE_TAP_MAIN_WIDTH * widthScale;
            const coreW = MOBILE_TAP_CORE_WIDTH * (isPrimary ? 1 : Math.max(0.55, widthScale));
            drawPolyline(points, `rgba(37, 99, 235, ${MOBILE_TAP_OUTER_ALPHA * branchEnvelope * alphaScale})`, outerW);
            drawPolyline(points, `rgba(8, 110, 140, ${MOBILE_TAP_MAIN_ALPHA * branchEnvelope * alphaScale})`, mainW);
            drawPolyline(points, `rgba(186, 230, 253, ${MOBILE_TAP_CORE_ALPHA * branchEnvelope * alphaScale})`, coreW);
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
            if (isClick) {
              drawPolyline(points, `rgba(37, 99, 235, ${0.16 * fragmentEnvelope})`, 0.85);
              drawPolyline(points, `rgba(186, 230, 253, ${0.42 * fragmentEnvelope})`, 0.32);
            } else {
              drawPolyline(points, `rgba(37, 99, 235, ${0.18 * fragmentEnvelope})`, 0.95);
              drawPolyline(points, `rgba(186, 230, 253, ${0.48 * fragmentEnvelope})`, 0.36);
            }
          }
        }
      }
    };

    const drawWakePolyline = (points, envelope, weight) => {
      drawPolyline(points, `rgba(37, 99, 235, ${0.2 * envelope * weight})`, 1.85 * weight);
      drawPolyline(points, `rgba(8, 110, 140, ${0.5 * envelope * weight})`, 0.95 * weight);
      drawPolyline(points, `rgba(186, 230, 253, ${0.26 * envelope * weight})`, 0.5 * weight);
    };

    const drawWakes = (now) => {
      for (let index = 0; index < activeWakes.length; index += 1) {
        const wake = activeWakes[index];
        const progress = clamp((now - wake.createdAt) / wake.duration, 0, 1);
        const envelope = dischargeEnvelope(progress) ** 1.2 * wake.intensity;
        if (envelope <= 0.01) continue;
        if (wake.flashRadius > 0) {
          const flash = context.createRadialGradient(wake.x, wake.y, 0, wake.x, wake.y, wake.flashRadius);
          flash.addColorStop(0, `rgba(37, 99, 235, ${0.16 * envelope})`);
          flash.addColorStop(1, "rgba(37, 99, 235, 0)");
          context.fillStyle = flash;
          context.beginPath();
          context.arc(wake.x, wake.y, wake.flashRadius, 0, Math.PI * 2);
          context.fill();
        }
        drawWakePolyline(wake.points, envelope, 1);
        if (wake.branch) drawWakePolyline(wake.branch, envelope, 0.62);
      }
    };

    const hasActiveEffects = () => activeSparks.length > 0 || activeWakes.length > 0;

    const step = (now) => {
      for (let index = activeSparks.length - 1; index >= 0; index -= 1) {
        if (now - activeSparks[index].createdAt >= activeSparks[index].duration) {
          activeSparks.splice(index, 1);
        }
      }
      for (let index = activeWakes.length - 1; index >= 0; index -= 1) {
        if (now - activeWakes[index].createdAt >= activeWakes[index].duration) {
          activeWakes.splice(index, 1);
        }
      }

      if (!hasActiveEffects()) {
        clearCanvas();
        animationFrameId = 0;
        return;
      }

      clearCanvas();
      drawWakes(now);
      drawSparks(now);
      animationFrameId = window.requestAnimationFrame(step);
    };

    const startLoop = () => {
      if (animationFrameId) return;
      animationFrameId = window.requestAnimationFrame(step);
    };

    const pushWake = (wake) => {
      if (activeWakes.length >= WAKE_MAX_ACTIVE) activeWakes.shift();
      activeWakes.push(wake);
      startLoop();
    };

    const spawnCursorWake = (from, to, speed, now) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 8) return;
      const ux = dx / dist;
      const uy = dy / dist;
      const lag = 6;
      const startX = from.x + ux * 2;
      const startY = from.y + uy * 2;
      const endX = to.x - ux * lag;
      const endY = to.y - uy * lag;
      const speedT = clamp((speed - WAKE_SPEED_SLOW) / (WAKE_SPEED_FAST - WAKE_SPEED_SLOW), 0, 1);
      const locationScale = pointer.insideHero
        ? WAKE_HERO_SCALE
        : pointer.overInteractive
          ? WAKE_INTERACTIVE_SCALE
          : 1;
      const filament = generateWakeFilament(startX, startY, endX, endY, {
        allowBranch: speedT > 0.58 && Math.random() < 0.2
      });
      pushWake({
        x: (startX + endX) / 2,
        y: (startY + endY) / 2,
        points: filament.points,
        branch: filament.branch,
        createdAt: now,
        duration: randomInRange(
          WAKE_DURATION_MIN_MS,
          WAKE_DURATION_MIN_MS + (WAKE_DURATION_MAX_MS - WAKE_DURATION_MIN_MS) * (0.4 + 0.6 * speedT)
        ),
        intensity: WAKE_CURSOR_INTENSITY * (0.52 + 0.48 * speedT) * locationScale,
        flashRadius: 5 + speedT * 4
      });
    };

    const sampleCursorWake = (now) => {
      if (!hasFineHoverPointer || !wakeAllowed() || !pointer.insideWindow || pointer.overHeader) return;
      const last = pathHistory[pathHistory.length - 1];
      if (!last) {
        pathHistory.push({ x: pointer.x, y: pointer.y, t: now });
        lastWakeSampleAt = now;
        return;
      }
      const dist = Math.hypot(pointer.x - last.x, pointer.y - last.y);
      const dt = Math.max(1, now - last.t);
      if (dist < WAKE_SAMPLE_MIN_DIST_PX || now - lastWakeSampleAt < WAKE_SAMPLE_MIN_MS) return;
      const speed = clamp(dist / dt, 0, WAKE_SPEED_CLAMP);
      pathHistory.push({ x: pointer.x, y: pointer.y, t: now });
      if (pathHistory.length > WAKE_PATH_MAX) pathHistory.shift();
      lastWakeSampleAt = now;
      if (speed < WAKE_SPEED_SLOW && Math.random() > 0.32) return;
      spawnCursorWake(last, pointer, speed, now);
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
        const flashMin = isClick ? GLOBAL_CLICK_FLASH_MIN_MS : GLOBAL_TAP_FLASH_MIN_MS;
        const flashMax = isClick ? GLOBAL_CLICK_FLASH_MAX_MS : GLOBAL_TAP_FLASH_MAX_MS;
        const flashRadiusMin = isClick ? GLOBAL_CLICK_FLASH_RADIUS_MIN : GLOBAL_TAP_FLASH_RADIUS_MIN;
        const flashRadiusMax = isClick ? GLOBAL_CLICK_FLASH_RADIUS_MAX : GLOBAL_TAP_FLASH_RADIUS_MAX;
        const energyIntensity = isClick ? (energy ? 1.1 : 1) : energy ? 1.08 : 1;
        const energyFlash = isClick ? (energy ? 1.12 : 1) : energy ? 1.08 : 1;
        const energyDuration = energy
          ? isClick
            ? randomInRange(durationMin + 12, durationMax + 18)
            : randomInRange(durationMin + 8, durationMax + 12)
          : randomInRange(durationMin, durationMax);
        activeSparks.push({
          x: originX,
          y: originY,
          createdAt: now,
          duration: energyDuration,
          flashDuration: randomInRange(flashMin, flashMax),
          flashRadius: randomInRange(flashRadiusMin, flashRadiusMax) * energyFlash,
          intensity: intensity * energyIntensity,
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
      sampleCursorWake(performance.now());
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
      pathHistory.length = 0;
      lastWakeSampleAt = 0;
      syncScheduler();
    };

    const clearWakeState = () => {
      activeWakes.length = 0;
      pathHistory.length = 0;
      lastWakeSampleAt = 0;
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState !== "hidden";
      if (!isPageVisible) {
        activeSparks.length = 0;
        clearWakeState();
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
        clearWakeState();
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
    window.addEventListener("blur", clearPointer);
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
      window.removeEventListener("blur", clearPointer);
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
