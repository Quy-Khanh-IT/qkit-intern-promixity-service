"use client";

import Footer from "@/app/components/Footer";
import HeroSection from "@/app/components/HeroSection";
import Navbar from "@/app/components/Navbar";
import ServiceSlider from "@/app/components/ServiceSlider";
import StarsCanvas from "./components/canvas/Star";
import CredibilitySection from "./components/CredibilitySection";
import { useRef } from "react";
import NavProcessbar from "./components/NavProcessbar";
import AboutusSection from "./components/AboutusSection";

export default function Home() {
  return (
    <main>
      <NavProcessbar />
      <Navbar />
      <div style={{ position: "relative", zIndex: 0 }}>
        <HeroSection />
        <CredibilitySection />
        <StarsCanvas />
        <AboutusSection />
      </div>
      <ServiceSlider />

      <Footer />
    </main>
  );
}
