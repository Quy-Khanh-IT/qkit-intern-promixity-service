import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import StarsCanvas from "@/components/canvas/Star";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div style={{ position: "relative", zIndex: 0 }}>
        <Hero />
        <StarsCanvas />
      </div>
    </main>
  );
}
