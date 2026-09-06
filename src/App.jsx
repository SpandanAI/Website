import React from "react";
import { Route, Routes } from "react-router-dom";
import DocumentMeta from "./components/DocumentMeta";
import ElectricalCursorOverlay from "./components/ElectricalCursorOverlay";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RouteScrollManager from "./components/RouteScrollManager";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollProgressBar from "./components/ScrollProgressBar";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import TeamPage from "./pages/TeamPage";

function SkipToMainContent() {
  const handleClick = (event) => {
    event.preventDefault();
    const main = document.getElementById("main-content");
    if (!main) return;

    main.focus({ preventScroll: true });
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    main.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  return (
    <a href="#main-content" className="skip-link" onClick={handleClick}>
      Skip to main content
    </a>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <DocumentMeta />
      <SkipToMainContent />
      <RouteScrollManager />
      <ScrollProgressBar />
      <Header />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <ElectricalCursorOverlay />
    </div>
  );
}
