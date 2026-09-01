import React from "react";
import { Route, Routes } from "react-router-dom";
import ElectricalCursorOverlay from "./components/ElectricalCursorOverlay";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RouteScrollManager from "./components/RouteScrollManager";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollProgressBar from "./components/ScrollProgressBar";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import TeamPage from "./pages/TeamPage";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
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
