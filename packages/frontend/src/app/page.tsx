"use client";

import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import ServiceSlider from "@/app/components/ServiceSlider";
import StarsCanvas from "./components/canvas/Star";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div style={{ position: "relative", zIndex: 0 }}>
        <Hero />
        <StarsCanvas />
      </div>
      <ServiceSlider />
      <Footer />
    </main>
  );
}
