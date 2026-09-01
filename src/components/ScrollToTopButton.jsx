import React, { useEffect, useRef, useState } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > window.innerHeight * 1.1);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isVisible && buttonRef.current === document.activeElement) {
      buttonRef.current.blur();
    }
  }, [isVisible]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Back to top"
      aria-hidden={isVisible ? undefined : true}
      tabIndex={isVisible ? 0 : -1}
      inert={!isVisible}
      onClick={scrollToTop}
      className={`scroll-top-button md:hidden ${isVisible ? "visible" : ""}`}
    >
      ↑
    </button>
  );
}
