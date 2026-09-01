import React, { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Applications from "../components/Applications";
import Contact from "../components/Contact";
import Founders from "../components/Founders";
import Hero from "../components/Hero";

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = "SpandanAI";
  }, []);

  useLayoutEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.replace("#", ""));
    const section = document.getElementById(id);
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }, [hash]);

  return (
    <main>
      <Hero />
      <Applications />
      <Founders />
      <Contact />
    </main>
  );
}
