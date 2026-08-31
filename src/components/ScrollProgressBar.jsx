import React, { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const progressRef = useRef(null);

  useEffect(() => {
    const progressElement = progressRef.current;

    if (!progressElement) {
      return undefined;
    }

    let frameId = null;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollableHeight = Math.max(scrollHeight - clientHeight, 1);
      const progress = Math.min(Math.max(scrollTop / scrollableHeight, 0), 1);

      // Transform updates are GPU-friendly and avoid layout thrashing.
      progressElement.style.transform = `scaleX(${progress})`;
      frameId = null;
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]"
      aria-hidden="true"
    >
      <div
        ref={progressRef}
        className="h-full w-full origin-left scale-x-0 bg-blue-600 transition-transform duration-150 ease-out"
      />
    </div>
  );
}
