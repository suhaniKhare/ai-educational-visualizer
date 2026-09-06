import { ArrowRight, MousePointer2, Play, Sparkles } from "lucide-react";

import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      {/* Background decorative elements */}
      <div className="hero__glow hero__glow--one"></div>
      <div className="hero__glow hero__glow--two"></div>

      <div className="hero__content">
        {/* Eyebrow */}
        <div className="hero__eyebrow">
          <Sparkles size={16} />

          <span>Interactive Learning Platform</span>
        </div>

        {/* Main heading */}
        <h1 className="hero__title">
          Turn Complex Concepts
          <span> Into Visual Experiences.</span>
        </h1>

        {/* Description */}
        <p className="hero__description">
          Explore computer science concepts through interactive animations,
          visual simulations, and step-by-step illustrations designed to make
          learning easier.
        </p>

        {/* Actions */}
        <div className="hero__actions">
          <button
            className="hero__primary-button"
            onClick={() => {
              document.getElementById("subjects")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <span>Explore Subjects</span>

            <ArrowRight size={18} />
          </button>

          <button className="hero__secondary-button">
            <Play size={17} />

            <span>Try Visualizer</span>
          </button>
        </div>

        {/* Small interaction hint */}
        <div className="hero__hint">
          <MousePointer2 size={15} />

          <span>Click, explore and interact with concepts</span>
        </div>
      </div>

      {/* Visual illustration */}
      <div className="hero__visual">
        <div className="hero__visual-orbit hero__visual-orbit--one"></div>

        <div className="hero__visual-orbit hero__visual-orbit--two"></div>

        <div className="hero__visual-core">
          <Sparkles size={42} />
        </div>

        <div className="hero__floating-card hero__floating-card--one">
          <span className="hero__floating-dot"></span>
          <span>Algorithms</span>
        </div>

        <div className="hero__floating-card hero__floating-card--two">
          <span className="hero__floating-dot"></span>
          <span>Visualization</span>
        </div>

        <div className="hero__floating-card hero__floating-card--three">
          <span className="hero__floating-dot"></span>
          <span>Animation</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
