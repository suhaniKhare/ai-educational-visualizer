import { useEffect, useState } from "react";
import "./BresenhamVisualizer.css";

function BresenhamVisualizer() {
  const [x1, setX1] = useState(2);
  const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(12);
  const [y2, setY2] = useState(7);

  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // --------------------------------
  // BRESENHAM CALCULATIONS
  // --------------------------------

  const dx = x2 - x1;
  const dy = y2 - y1;

  const sx = dx >= 0 ? 1 : -1;
  const sy = dy >= 0 ? 1 : -1;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  const isShallow = absDx >= absDy;
  const totalSteps = isShallow ? absDx : absDy;

  const initialP = isShallow ? 2 * absDy - absDx : 2 * absDx - absDy;

  // Generate all Bresenham steps & points
  const points = [];
  let currX = Number(x1);
  let currY = Number(y1);
  let p = initialP;

  for (let i = 0; i <= totalSteps; i++) {
    if (i === totalSteps) {
      points.push({
        step: i,
        x: currX,
        y: currY,
        p: p,
        decisionText: "Reached endpoint",
        nextP: p,
        nextX: currX,
        nextY: currY,
        chosenDirection: "Endpoint Reached",
      });
      break;
    }

    let nextX = currX;
    let nextY = currY;
    let nextP = p;
    let decisionText = "";
    let chosenDirection = "";

    if (isShallow) {
      if (p < 0) {
        nextX = currX + sx;
        nextY = currY;
        nextP = p + 2 * absDy;
        chosenDirection = sx > 0 ? "East (E)" : "West (W)";
        decisionText = `p = ${p} < 0 → Choose ${chosenDirection}`;
      } else {
        nextX = currX + sx;
        nextY = currY + sy;
        nextP = p + 2 * absDy - 2 * absDx;
        const mainDir = sx > 0 ? "East" : "West";
        const subDir = sy > 0 ? "North" : "South";
        chosenDirection = `${subDir}-${mainDir}`;
        decisionText = `p = ${p} ≥ 0 → Choose ${chosenDirection}`;
      }
    } else {
      if (p < 0) {
        nextX = currX;
        nextY = currY + sy;
        nextP = p + 2 * absDx;
        chosenDirection = sy > 0 ? "North (N)" : "South (S)";
        decisionText = `p = ${p} < 0 → Choose ${chosenDirection}`;
      } else {
        nextX = currX + sx;
        nextY = currY + sy;
        nextP = p + 2 * absDx - 2 * absDy;
        const mainDir = sy > 0 ? "North" : "South";
        const subDir = sx > 0 ? "East" : "West";
        chosenDirection = `${mainDir}-${subDir}`;
        decisionText = `p = ${p} ≥ 0 → Choose ${chosenDirection}`;
      }
    }

    points.push({
      step: i,
      x: currX,
      y: currY,
      p: p,
      decisionText,
      nextP,
      nextX,
      nextY,
      chosenDirection,
    });

    currX = nextX;
    currY = nextY;
    p = nextP;
  }

  // Points currently visible on grid
  const visiblePoints = points.slice(0, step + 1);

  // Current step state
  const currentPoint = points[step] || points[0];

  // --------------------------------
  // AUTOMATIC ANIMATION
  // --------------------------------

  useEffect(() => {
    if (!isRunning) return;

    if (step >= points.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setStep((prevStep) => prevStep + 1);
    }, 700);

    return () => clearTimeout(timer);
  }, [isRunning, step, points.length]);

  // --------------------------------
  // BUTTON FUNCTIONS
  // --------------------------------

  const handleStart = () => {
    if (step >= points.length - 1) {
      setStep(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleNext = () => {
    setIsRunning(false);
    if (step < points.length - 1) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setStep(0);
  };

  // --------------------------------
  // INPUT CHANGE
  // --------------------------------

  const handleInputChange = (setter) => (event) => {
    setter(Number(event.target.value));
    setStep(0);
    setIsRunning(false);
  };

  return (
    <div className="bresenham-page">
      {/* HEADER */}
      <div className="bresenham-header">
        <span className="bresenham-label">LINE DRAWING ALGORITHM</span>
        <h1>Bresenham Line Drawing</h1>
        <p>
          Understand how Bresenham's algorithm efficiently selects pixels using
          integer decision parameters.
        </p>
      </div>

      <div className="bresenham-layout">
        {/* =========================================
            LEFT SIDE - CONTROL & CALCULATIONS
        ========================================= */}
        <div className="bresenham-panel">
          <h2>Input Coordinates</h2>

          {/* INPUTS */}
          <div className="bresenham-input-grid">
            <div>
              <label>X₁</label>
              <input
                type="number"
                value={x1}
                onChange={handleInputChange(setX1)}
              />
            </div>

            <div>
              <label>Y₁</label>
              <input
                type="number"
                value={y1}
                onChange={handleInputChange(setY1)}
              />
            </div>

            <div>
              <label>X₂</label>
              <input
                type="number"
                value={x2}
                onChange={handleInputChange(setX2)}
              />
            </div>

            <div>
              <label>Y₂</label>
              <input
                type="number"
                value={y2}
                onChange={handleInputChange(setY2)}
              />
            </div>
          </div>

          {/* BASIC CALCULATIONS */}
          <div className="bresenham-info">
            <p>
              <strong>ΔX:</strong> {dx} &nbsp;&nbsp;|&nbsp;&nbsp;{" "}
              <strong>ΔY:</strong> {dy}
            </p>
            <p>
              <strong>|ΔX|:</strong> {absDx} &nbsp;&nbsp;|&nbsp;&nbsp;{" "}
              <strong>|ΔY|:</strong> {absDy}
            </p>
            <p>
              <strong>Slope Category:</strong>{" "}
              <span className="bresenham-tag">
                {isShallow ? "Shallow (|ΔX| ≥ |ΔY|)" : "Steep (|ΔY| > |ΔX|)"}
              </span>
            </p>
            <p>
              <strong>Initial Decision (P₀):</strong> {initialP}
            </p>
            <p>
              <strong>Total Steps:</strong> {totalSteps}
            </p>
          </div>

          {/* CURRENT CALCULATION */}
          <div className="bresenham-current-calculation">
            <h3>Current Step Calculation</h3>
            <p>
              <strong>Step:</strong> {currentPoint.step} / {totalSteps}
            </p>
            <p>
              <strong>Current Point:</strong> ({currentPoint.x},{" "}
              {currentPoint.y})
            </p>
            <p>
              <strong>Decision Parameter (p):</strong> {currentPoint.p}
            </p>
            <p>
              <strong>Decision:</strong>{" "}
              <span className="bresenham-highlight-text">
                {currentPoint.decisionText}
              </span>
            </p>
            <p>
              <strong>Next Decision (p_next):</strong> {currentPoint.nextP}
            </p>
            <p>
              <strong>Next Pixel Selected:</strong> ({currentPoint.nextX},{" "}
              {currentPoint.nextY})
            </p>
          </div>

          {/* CONTROLS */}
          <div className="bresenham-buttons">
            {!isRunning ? (
              <button onClick={handleStart}>▶ Start Animation</button>
            ) : (
              <button onClick={handlePause}>⏸ Pause</button>
            )}

            <button
              onClick={handleNext}
              disabled={step >= points.length - 1}
            >
              Next Step →
            </button>

            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>

          {/* STEP INDICATOR */}
          <div className="bresenham-step">
            Step {step} / {totalSteps}
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE - PIXEL GRID
        ========================================= */}
        <div className="bresenham-visualizer">
          <h2>Pixel Grid</h2>

          <div className="bresenham-grid">
            {Array.from({ length: 15 * 10 }).map((_, index) => {
              const x = index % 15;
              const y = 9 - Math.floor(index / 15);

              const active = visiblePoints.some(
                (point) => point.x === x && point.y === y
              );

              const start = x === Number(x1) && y === Number(y1);
              const end = x === Number(x2) && y === Number(y2);

              const current =
                currentPoint.x === x &&
                currentPoint.y === y &&
                active;

              return (
                <div
                  key={index}
                  className={`
                    bresenham-cell
                    ${active ? "active" : ""}
                    ${start ? "start" : ""}
                    ${end ? "end" : ""}
                    ${current ? "current" : ""}
                  `}
                >
                  {active && "•"}
                </div>
              );
            })}
          </div>

          {/* LEGEND */}
          <div className="bresenham-legend">
            <span>● Generated Pixel</span>
            <span>● Start Point</span>
            <span>● End Point</span>
            <span>● Current Step</span>
          </div>
        </div>
      </div>

      {/* =========================================
          ALGORITHM EXPLANATION
      ========================================= */}
      <div className="bresenham-explanation">
        <h2>How Bresenham Line Drawing Works</h2>

        <div className="bresenham-formula">
          <p>
            <strong>1. Calculate Differences:</strong> Compute ΔX = X₂ - X₁ and
            ΔY = Y₂ - Y₁. Determine step directions sx = sign(ΔX), sy =
            sign(ΔY).
          </p>

          <p>
            <strong>2. Determine Slope Type:</strong> If |ΔX| ≥ |ΔY|, algorithm
            is X-dominant (shallow slope). Otherwise, it is Y-dominant (steep
            slope).
          </p>

          <p>
            <strong>3. Initial Decision Parameter P₀:</strong> For shallow slopes,
            P₀ = 2|ΔY| - |ΔX|. For steep slopes, P₀ = 2|ΔX| - |ΔY|.
          </p>

          <p>
            <strong>4. Decision Rule at Step k:</strong>
            <br />
            If Pₖ &lt; 0: Pₖ₊₁ = Pₖ + 2|ΔY| (Move East / Straight)
            <br />
            If Pₖ ≥ 0: Pₖ₊₁ = Pₖ + 2|ΔY| - 2|ΔX| (Move North-East / Diagonal)
          </p>

          <p>
            <strong>5. Integer Precision Advantage:</strong> All calculations use
            only integer addition, subtraction, and multiplication by 2 (left shift), making it fast &amp; hardware efficient.
          </p>

          <p>
            <strong>6. Octant Handling:</strong> Works seamlessly for shallow,
            steep, positive, negative, and reversed directional lines.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BresenhamVisualizer;
