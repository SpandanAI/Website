import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { heroFadeIn, staggerContainer, staggerItem } from "../lib/animations";
import { SET_ACTIVE_NAV_EVENT } from "../lib/activeNavEvent";
import NeuralNetworkBackground from "./NeuralNetworkBackground";

export default function Hero() {
  const backgroundLayerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const backgroundLayer = backgroundLayerRef.current;
    if (!backgroundLayer) return undefined;

    if (shouldReduceMotion) {
      backgroundLayer.style.transform = "translateY(0px)";
      return undefined;
    }

    let frameId = 0;
    let isTicking = false;

    const updateParallax = () => {
      backgroundLayer.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      isTicking = false;
    };

    const handleScroll = () => {
      if (isTicking) return;
      isTicking = true;
      frameId = window.requestAnimationFrame(updateParallax);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(frameId);
    };
  }, [shouldReduceMotion]);

  const handleExploreUseCases = (event) => {
    event.preventDefault();
    const section = document.getElementById("use-cases");
    if (section) {
      section.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start"
      });
    }
    window.dispatchEvent(new CustomEvent(SET_ACTIVE_NAV_EVENT, { detail: "use-cases" }));
  };

  return (
    <motion.section
      id="home"
      className="hero-section relative isolate -mt-[var(--navbar-height)] min-h-[110vh] overflow-hidden pt-[var(--navbar-height)]"
      variants={heroFadeIn}
      initial="hidden"
      animate="visible"
    >
      <div
        ref={backgroundLayerRef}
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(5, 20, 45, 0.85) 0%, rgba(10, 35, 80, 0.75) 40%, rgba(10, 35, 80, 0.65) 100%), url("/images/wave-background.png")',
          filter: "brightness(0.8) contrast(1.15) saturate(0.9)"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 40%, rgba(0, 60, 140, 0.25), rgba(0, 10, 30, 0.9))"
        }}
      />
      <NeuralNetworkBackground />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-[180px]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(5, 20, 45, 0.0) 0%, rgba(5, 20, 45, 0.25) 55%, rgba(248, 250, 252, 1) 100%)"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 100%)"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(5, 20, 45, 0.75) 0%, rgba(5, 20, 45, 0.55) 35%, rgba(5, 20, 45, 0.25) 60%, rgba(5, 20, 45, 0.0) 100%)"
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[120px]"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))"
        }}
      />
      <motion.div
        className="hero-copy pointer-events-none relative z-[1] mx-auto flex min-h-screen max-w-7xl items-center px-5 py-20 sm:px-6 lg:px-8 lg:py-24"
        variants={staggerContainer}
      >
        <motion.div className="pointer-events-auto" variants={staggerItem}>
          <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold tracking-[0.01em] text-blue-900/70">
            Analog-Native AI and Communication Silicon
          </p>
          <h1
            className="mt-8 max-w-4xl text-5xl font-[650] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl"
          >
            SpandanAI
          </h1>
          <p
            className="hero-lede mt-6 max-w-2xl text-lg leading-[1.7] text-[rgba(255,255,255,0.92)]"
          >
            Analog-native AI silicon for edge inference and wireless systems.
          </p>
          <div className="hero-cta-row mt-10 flex flex-col gap-4 sm:flex-row">
            <motion.a
              href="#use-cases"
              className="rounded-full bg-blue-600 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={handleExploreUseCases}
              style={{
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.35)",
                transition: "all 0.25s ease"
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -1,
                      scale: 1.03,
                      boxShadow: "0 12px 28px rgba(59, 130, 246, 0.45)"
                    }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              Explore Use Cases
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
