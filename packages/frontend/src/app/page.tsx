"use client";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ServiceSlider from "@/components/ServiceSlider";
import StarsCanvas from "@/components/canvas/Star";

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
