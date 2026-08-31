import React from "react";
import Applications from "./components/Applications";
import Contact from "./components/Contact";
import ElectricalCursorOverlay from "./components/ElectricalCursorOverlay";
import Footer from "./components/Footer";
import Founders from "./components/Founders";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollProgressBar from "./components/ScrollProgressBar";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollProgressBar />
      <Header />
      <ScrollToTopButton />
      <main>
        <Hero />
        <Applications />
        <Founders />
        <Contact />
      </main>
      <Footer />
      <ElectricalCursorOverlay />
    </div>
  );
}
