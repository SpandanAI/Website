import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { navigationLinks } from "../data/siteContent";
import { SET_ACTIVE_NAV_EVENT } from "../lib/activeNavEvent";
import { buttonHover } from "../lib/animations";
import { getLogoTo, getNavTo, getPartnerTo, getSectionId } from "../lib/navHrefs";

const NAV_SECTION_IDS = navigationLinks.map((link) => link.href.replace("#", ""));

const INTERSECTION_THRESHOLDS = [0, 0.1, 0.2, 0.3, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1];
const ACTIVE_RATIO_MIN = 0.45;

const MotionLink = motion(Link);

function getNavbarScrollOffset() {
  if (typeof document === "undefined") return 96;
  const parsed = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--navbar-height"),
    10
  );
  return Number.isFinite(parsed) ? parsed : 96;
}

export default function Header() {
  const location = useLocation();
  const isTeamRoute = location.pathname === "/team";
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === "undefined") return "home";
    if (window.location.pathname === "/team") return "team";
    const hash = window.location.hash.replace("#", "");
    return NAV_SECTION_IDS.includes(hash) ? hash : "home";
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pendingNavSectionRef = useRef(null);
  const intersectionRatiosRef = useRef({});

  const closeMenu = () => setIsOpen(false);

  const markNavIntent = useCallback((id) => {
    pendingNavSectionRef.current = id;
    setActiveSection(id);
  }, []);

  const computeActiveSectionFromIntersection = useCallback(() => {
    let bestId = null;
    let bestRatio = -1;
    for (const id of NAV_SECTION_IDS) {
      const ratio = intersectionRatiosRef.current[id] ?? 0;
      if (ratio >= ACTIVE_RATIO_MIN && ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    }
    if (bestId) return bestId;
    if (typeof window === "undefined" || window.scrollY < 80) return "home";
    return null;
  }, []);

  const resolveActiveSection = useCallback(() => {
    if (location.pathname === "/team") return "team";

    let next = computeActiveSectionFromIntersection();
    const intent = pendingNavSectionRef.current;
    if (intent) {
      const el = document.getElementById(intent);
      const offset = getNavbarScrollOffset();
      const rect = el?.getBoundingClientRect();
      const inViewAtNav = Boolean(rect && rect.top <= offset && rect.bottom > offset);
      const arrivedHome = intent === "home" && window.scrollY < 80;
      if (next === intent || inViewAtNav || arrivedHome) {
        pendingNavSectionRef.current = null;
        if (arrivedHome) next = "home";
      } else {
        next = intent;
      }
    }
    return next;
  }, [computeActiveSectionFromIntersection, location.pathname]);

  const flushActiveSection = useCallback(() => {
    setActiveSection(resolveActiveSection());
  }, [resolveActiveSection]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth"
    });
  }, [shouldReduceMotion]);

  useLayoutEffect(() => {
    const sync = () => {
      const y = window.scrollY;
      setIsScrolled(y > 10);
      flushActiveSection();
    };
    sync();
    requestAnimationFrame(sync);
  }, [flushActiveSection, location.pathname]);

  useEffect(() => {
    const onSetActiveNav = (event) => {
      const id = event.detail;
      if (typeof id !== "string" || !id) return;
      pendingNavSectionRef.current = id;
      setActiveSection(id);
    };

    window.addEventListener(SET_ACTIVE_NAV_EVENT, onSetActiveNav);
    return () => window.removeEventListener(SET_ACTIVE_NAV_EVENT, onSetActiveNav);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      intersectionRatiosRef.current = {};
      return undefined;
    }

    const offset = getNavbarScrollOffset();
    const rootMargin = `-${offset}px 0px 0px 0px`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          intersectionRatiosRef.current[id] = entry.intersectionRatio;
        }
        flushActiveSection();
      },
      {
        root: null,
        rootMargin,
        threshold: INTERSECTION_THRESHOLDS
      }
    );

    for (const id of NAV_SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    flushActiveSection();

    return () => observer.disconnect();
  }, [flushActiveSection, location.pathname]);

  useEffect(() => {
    let scrollRafId = 0;
    let isScrollPending = false;

    const flushScroll = () => {
      isScrollPending = false;
      scrollRafId = 0;
      const y = window.scrollY;
      setIsScrolled(y > 10);
      flushActiveSection();
    };

    const handleScroll = () => {
      if (isScrollPending) return;
      isScrollPending = true;
      scrollRafId = window.requestAnimationFrame(flushScroll);
    };

    flushScroll();
    requestAnimationFrame(flushScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("load", flushScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", flushScroll);
      window.cancelAnimationFrame(scrollRafId);
    };
  }, [flushActiveSection]);

  const handleNavClick = (sectionId) => {
    closeMenu();

    if (isTeamRoute) {
      if (sectionId === "team") {
        scrollToTop();
        pendingNavSectionRef.current = null;
        setActiveSection("team");
        return;
      }
      markNavIntent(sectionId);
      return;
    }

    if (sectionId === "home") {
      scrollToTop();
    }
    markNavIntent(sectionId);
  };

  const handleLogoClick = () => {
    closeMenu();
    markNavIntent("home");
    if (!isTeamRoute) {
      scrollToTop();
    }
  };

  return (
    <header className={`header-shell sticky top-0 z-50 ${isScrolled ? "scrolled" : ""}`}>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}
      {/* Sticky navigation mirrors the reference-style single-page landing pattern. */}
      <nav
        className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link
          to={getLogoTo(location.pathname)}
          className="flex items-center gap-3"
          onClick={handleLogoClick}
        >
          <img
            src="/images/logo-light.webp"
            alt="SpandanAI"
            className="logo"
            loading="eager"
            decoding="async"
          />
          <span
            className={`text-base font-semibold tracking-[-0.01em] ${isScrolled ? "text-ink" : "text-white"}`}
          >
            SpandanAI
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex lg:gap-8">
          {navigationLinks.map((link) => {
            const linkSection = getSectionId(link.href);
            const isActive = isTeamRoute ? linkSection === "team" : activeSection === linkSection;

            return (
              <Link
                key={link.href}
                to={getNavTo(link.href, location.pathname)}
                aria-current={isActive ? (isTeamRoute ? "page" : "location") : undefined}
                className={`nav-link rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
                  isScrolled
                    ? "text-slate-600 hover:text-ink focus-visible:ring-offset-white"
                    : "text-white/85 hover:text-white focus-visible:ring-offset-slate-900"
                } ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(linkSection)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <MotionLink
          to={getPartnerTo(location.pathname)}
          className="hidden rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 md:inline-flex"
          onClick={() => handleNavClick("contact")}
          whileHover={shouldReduceMotion ? undefined : buttonHover}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Partner With Us
        </MotionLink>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-[transform,filter] duration-200 ease-out hover:-translate-y-[2px] hover:brightness-110 md:hidden ${
            isScrolled ? "border-slate-200 text-ink" : "border-white/40 text-white"
          }`}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">Menu</span>
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </nav>

      {isOpen && (
        <div className="relative z-50 border-t border-slate-200 bg-white px-5 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navigationLinks.map((link) => {
              const linkSection = getSectionId(link.href);
              const isActive = isTeamRoute ? linkSection === "team" : activeSection === linkSection;

              return (
                <Link
                  key={link.href}
                  to={getNavTo(link.href, location.pathname)}
                  aria-current={isActive ? (isTeamRoute ? "page" : "location") : undefined}
                  className={`nav-link rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => handleNavClick(linkSection)}
                >
                  {link.label}
                </Link>
              );
            })}
            <MotionLink
              to={getPartnerTo(location.pathname)}
              className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white"
              onClick={() => handleNavClick("contact")}
              whileHover={shouldReduceMotion ? undefined : buttonHover}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Partner With Us
            </MotionLink>
          </div>
        </div>
      )}
    </header>
  );
}
