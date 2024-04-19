"use client";
import EarthCanvas from "../components/canvas/Earth";
import { motion } from "framer-motion";
import { slideIn } from "../utils/motion";
import "../app/styles/components/hero.scss";

export default function Hero() {
  return (
    <div className="hero-wrap">
      <div className="hero-content">
        <div className="hero-panel">
          <div className="panel-welcome">WELCOME TO</div>
          <h2>QKIT Promixity Service</h2>
          <div className="panel-description"></div>
          <div className="panel-button-wrap">
            <button type="button" className="btn btn-primary">
              START NOW
            </button>
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
