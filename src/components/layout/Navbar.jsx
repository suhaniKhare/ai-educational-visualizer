import { BookOpen, Sparkles } from "lucide-react";

import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div
        className="navbar__brand"
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <div className="navbar__logo">
          <BookOpen size={22} strokeWidth={2.2} />
        </div>

        <div className="navbar__brand-text">
          <span className="navbar__title">Visual Learning Lab</span>

          <span className="navbar__tagline">
            Learn. Visualize. Understand.
          </span>
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__ai-badge">
          <Sparkles size={15} />

          <span>Interactive Learning</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;