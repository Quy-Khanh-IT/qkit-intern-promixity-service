"use client";
import EarthCanvas from "../components/canvas/Earth";
import { motion } from "framer-motion";
import { slideIn } from "../utils/motion";
import "../app/styles/components/hero.scss";

export default function Hero() {
  return (
    <div className="hero-wrap">
      <div className="hero-content">
        <div>
          <h1>YOUR MAP</h1>
          <h1>YOUR BUSINESS</h1>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",

              margin: "16px 0 24px 24px",
            }}
          >
            <button className="hero-btn">START NOW</button>
          </div>
          <div style={{ maxWidth: "700px", marginTop: "8px" }}>
            <span>
              Welcome to{" "}
              <strong style={{ color: "#64ffda", fontWeight: "500" }}>
                {" "}
                Proximity Service
              </strong>{" "}
              ! We're a platform dedicated to providing exceptional
              location-based experiences with unique customization options and
              utilities. With advanced technology and a vast database, we make
              it easy for you to find places, calculate distances, and even
              create proximity zones. Discover how{" "}
              <strong style={{ color: "#64ffda", fontWeight: "500" }}>
                {" "}
                Proximity Service
              </strong>{" "}
              can enhance your journey starting now!
            </span>
          </div>
        </div>
      </div>
      <div className="hero-container">
        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="planet"
        >
          <EarthCanvas />
        </motion.div>
      </div>
    </div>
  );
}
