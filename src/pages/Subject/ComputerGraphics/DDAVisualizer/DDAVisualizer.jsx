import { useEffect, useState } from "react";
import "./DDAVisualizer.css";

function DDAVisualizer() {
  const [x1, setX1] = useState(2);
  const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(12);
  const [y2, setY2] = useState(8);

  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // --------------------------------
  // DDA CALCULATIONS
  // --------------------------------

  const dx = x2 - x1;
  const dy = y2 - y1;

  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  const xIncrement = steps === 0 ? 0 : dx / steps;
  const yIncrement = steps === 0 ? 0 : dy / steps;

  // Generate all DDA points
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const calculatedX = x1 + i * xIncrement;
    const calculatedY = y1 + i * yIncrement;

    points.push({
      step: i,
      calculatedX,
      calculatedY,
      x: Math.round(calculatedX),
      y: Math.round(calculatedY),
    });
  }

  // Points currently visible on grid
  const visiblePoints = points.slice(0, step + 1);

  // Current calculation
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
      setStep((previousStep) => previousStep + 1);
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
      setStep((previousStep) => previousStep + 1);
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
    <div className="dda-page">

      {/* HEADER */}
      <div className="dda-header">
        <span className="dda-label">
          LINE DRAWING ALGORITHM
        </span>

        <h1>DDA Line Drawing</h1>

        <p>
          Visualize how the Digital Differential Analyzer algorithm
          generates a line pixel by pixel.
        </p>
      </div>

      <div className="dda-layout">

        {/* =========================================
            LEFT SIDE
        ========================================= */}

        <div className="dda-panel">

          <h2>Input Coordinates</h2>

          {/* INPUTS */}

          <div className="dda-input-grid">

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

          <div className="dda-info">

            <p>
              <strong>ΔX:</strong> {dx}
            </p>

            <p>
              <strong>ΔY:</strong> {dy}
            </p>

            <p>
              <strong>Steps:</strong> {steps}
            </p>

            <p>
              <strong>X Increment:</strong>{" "}
              {xIncrement.toFixed(2)}
            </p>

            <p>
              <strong>Y Increment:</strong>{" "}
              {yIncrement.toFixed(2)}
            </p>

          </div>


          {/* =========================================
              CURRENT CALCULATION
          ========================================= */}

          <div className="dda-current-calculation">

            <h3>
              Current Calculation
            </h3>

            <p>
              <strong>Step:</strong>{" "}
              {currentPoint.step}
            </p>

            <p>
              <strong>X:</strong>{" "}
              {currentPoint.calculatedX.toFixed(2)}
            </p>

            <p>
              <strong>Y:</strong>{" "}
              {currentPoint.calculatedY.toFixed(2)}
            </p>

            <p>
              <strong>Pixel:</strong>{" "}
              ({currentPoint.x}, {currentPoint.y})
            </p>

          </div>


          {/* =========================================
              CONTROLS
          ========================================= */}

          <div className="dda-buttons">

            {!isRunning ? (
              <button onClick={handleStart}>
                ▶ Start Animation
              </button>
            ) : (
              <button onClick={handlePause}>
                ⏸ Pause
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={step >= points.length - 1}
            >
              Next Step →
            </button>

            <button
              className="reset-btn"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>


          {/* STEP INDICATOR */}

          <div className="dda-step">

            Step {step} / {steps}

          </div>

        </div>


        {/* =========================================
            RIGHT SIDE - PIXEL GRID
        ========================================= */}

        <div className="dda-visualizer">

          <h2>Pixel Grid</h2>

          <div className="dda-grid">

            {Array.from({
              length: 15 * 10,
            }).map((_, index) => {

              const x = index % 15;

              const y =
                9 - Math.floor(index / 15);

              const active =
                visiblePoints.some(
                  (point) =>
                    point.x === x &&
                    point.y === y
                );

              const start =
                x === x1 &&
                y === y1;

              const end =
                x === x2 &&
                y === y2;

              const current =
                currentPoint.x === x &&
                currentPoint.y === y &&
                active;

              return (
                <div
                  key={index}
                  className={`
                    dda-cell
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

          <div className="dda-legend">

            <span>
              ● Generated Pixel
            </span>

            <span>
              ● Start Point
            </span>

            <span>
              ● End Point
            </span>

          </div>

        </div>

      </div>


      {/* =========================================
          ALGORITHM EXPLANATION
      ========================================= */}

      <div className="dda-explanation">

        <h2>How DDA Works</h2>

        <div className="dda-formula">

          <p>
            <strong>1.</strong>{" "}
            Calculate ΔX and ΔY
          </p>

          <p>
            <strong>2.</strong>{" "}
            Steps = max(|ΔX|, |ΔY|)
          </p>

          <p>
            <strong>3.</strong>{" "}
            X Increment = ΔX / Steps
          </p>

          <p>
            <strong>4.</strong>{" "}
            Y Increment = ΔY / Steps
          </p>

          <p>
            <strong>5.</strong>{" "}
            Calculate X and Y for every step
          </p>

          <p>
            <strong>6.</strong>{" "}
            Round X and Y to select the pixel
          </p>

        </div>

      </div>

    </div>
  );
}

export default DDAVisualizer;