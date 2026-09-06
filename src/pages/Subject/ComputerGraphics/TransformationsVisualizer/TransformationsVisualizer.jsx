import { useState } from "react";
import "./TransformationsVisualizer.css";

function TransformationsVisualizer() {
  // Original Triangle Vertices
  const [vertices, setVertices] = useState([
    { label: "A", x: 2, y: 2 },
    { label: "B", x: 6, y: 2 },
    { label: "C", x: 4, y: 6 },
  ]);

  // Transformation Mode: "translation" | "rotation" | "scaling" | "reflection" | "shearing"
  const [activeTab, setActiveTab] = useState("translation");

  // Parameters
  const [tx, setTx] = useState(2);
  const [ty, setTy] = useState(1);

  const [angle, setAngle] = useState(45);

  const [sx, setSx] = useState(1.5);
  const [sy, setSy] = useState(1.5);

  const [reflectionAxis, setReflectionAxis] = useState("x-axis"); // "x-axis" | "y-axis" | "origin" | "y=x"

  const [shx, setShx] = useState(0.5);
  const [shy, setShy] = useState(0);

  // Animation / Display progress (0 to 1)
  const [progress, setProgress] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // --------------------------------
  // TRANSFORMATION CALCULATIONS
  // --------------------------------

  const computeTransformedVertex = (vertex) => {
    const { x, y } = vertex;
    let newX = x;
    let newY = y;
    let formulaStr = "";

    switch (activeTab) {
      case "translation": {
        newX = x + Number(tx);
        newY = y + Number(ty);
        formulaStr = `X' = ${x} + (${tx}) = ${newX.toFixed(2)}, Y' = ${y} + (${ty}) = ${newY.toFixed(2)}`;
        break;
      }
      case "rotation": {
        const rad = (Number(angle) * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        newX = x * cos - y * sin;
        newY = x * sin + y * cos;
        formulaStr = `X' = ${x}·cos(${angle}°) - ${y}·sin(${angle}°) = ${newX.toFixed(2)}, Y' = ${x}·sin(${angle}°) + ${y}·cos(${angle}°) = ${newY.toFixed(2)}`;
        break;
      }
      case "scaling": {
        newX = x * Number(sx);
        newY = y * Number(sy);
        formulaStr = `X' = ${x} × ${sx} = ${newX.toFixed(2)}, Y' = ${y} × ${sy} = ${newY.toFixed(2)}`;
        break;
      }
      case "reflection": {
        if (reflectionAxis === "x-axis") {
          newX = x;
          newY = -y;
          formulaStr = `X' = ${x}, Y' = -(${y}) = ${newY.toFixed(2)}`;
        } else if (reflectionAxis === "y-axis") {
          newX = -x;
          newY = y;
          formulaStr = `X' = -(${x}) = ${newX.toFixed(2)}, Y' = ${y}`;
        } else if (reflectionAxis === "origin") {
          newX = -x;
          newY = -y;
          formulaStr = `X' = -(${x}) = ${newX.toFixed(2)}, Y' = -(${y}) = ${newY.toFixed(2)}`;
        } else if (reflectionAxis === "y=x") {
          newX = y;
          newY = x;
          formulaStr = `X' = ${y}, Y' = ${x}`;
        }
        break;
      }
      case "shearing": {
        newX = x + Number(shx) * y;
        newY = y + Number(shy) * x;
        formulaStr = `X' = ${x} + (${shx} × ${y}) = ${newX.toFixed(2)}, Y' = ${y} + (${shy} × ${x}) = ${newY.toFixed(2)}`;
        break;
      }
      default:
        break;
    }

    return {
      label: `${vertex.label}'`,
      x: Number(newX.toFixed(2)),
      y: Number(newY.toFixed(2)),
      formulaStr,
    };
  };

  const transformedVertices = vertices.map(computeTransformedVertex);

  // Computed displayed vertices based on progress interpolation
  const interpolatedVertices = vertices.map((orig, i) => {
    const target = transformedVertices[i];
    return {
      label: orig.label,
      x: orig.x + (target.x - orig.x) * progress,
      y: orig.y + (target.y - orig.y) * progress,
    };
  });

  // --------------------------------
  // INTERACTION HANDLERS
  // --------------------------------

  const handleVertexChange = (index, field, value) => {
    const updated = [...vertices];
    updated[index][field] = Number(value);
    setVertices(updated);
  };

  const handleAnimate = () => {
    setIsAnimating(true);
    setProgress(0);
    let start = null;
    const duration = 1000;

    const stepFrame = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct < 1) {
        requestAnimationFrame(stepFrame);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(stepFrame);
  };

  const handleReset = () => {
    setVertices([
      { label: "A", x: 2, y: 2 },
      { label: "B", x: 6, y: 2 },
      { label: "C", x: 4, y: 6 },
    ]);
    setTx(2);
    setTy(1);
    setAngle(45);
    setSx(1.5);
    setSy(1.5);
    setReflectionAxis("x-axis");
    setShx(0.5);
    setShy(0);
    setProgress(1);
  };

  // --------------------------------
  // COORDINATE SYSTEM HELPER (SVG)
  // ViewBox: -12 to 12 in coordinate units mapped to 0..500
  // --------------------------------

  const minGrid = -10;
  const maxGrid = 10;
  const svgSize = 500;

  const toSvgX = (x) => {
    return ((x - minGrid) / (maxGrid - minGrid)) * svgSize;
  };

  const toSvgY = (y) => {
    return svgSize - ((y - minGrid) / (maxGrid - minGrid)) * svgSize;
  };

  const origPolygonPoints = vertices
    .map((v) => `${toSvgX(v.x)},${toSvgY(v.y)}`)
    .join(" ");

  const transformedPolygonPoints = interpolatedVertices
    .map((v) => `${toSvgX(v.x)},${toSvgY(v.y)}`)
    .join(" ");

  return (
    <div className="transformations-page">
      {/* HEADER */}
      <div className="transformations-header">
        <span className="transformations-label">2D GRAPHICS TRANSFORMATIONS</span>
        <h1>2D Transformations</h1>
        <p>
          Interact with translation, rotation, scaling, reflection, and shearing
          on a 2D coordinate plane.
        </p>
      </div>

      <div className="transformations-layout">
        {/* =========================================
            LEFT SIDE - CONTROL PANEL
        ========================================= */}
        <div className="transformations-panel">
          <h2>Shape &amp; Transformation Controls</h2>

          {/* VERTEX INPUTS */}
          <div className="transformations-section">
            <h3>Original Shape Vertices (Triangle)</h3>
            <div className="transformations-vertices-inputs">
              {vertices.map((v, i) => (
                <div key={v.label} className="vertex-input-row">
                  <span className="vertex-name">{v.label}:</span>
                  <label>X</label>
                  <input
                    type="number"
                    value={v.x}
                    onChange={(e) => handleVertexChange(i, "x", e.target.value)}
                  />
                  <label>Y</label>
                  <input
                    type="number"
                    value={v.y}
                    onChange={(e) => handleVertexChange(i, "y", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* TRANSFORMATION TYPE TABS */}
          <div className="transformations-section">
            <h3>Select Transformation</h3>
            <div className="transformations-tabs">
              <button
                className={activeTab === "translation" ? "active" : ""}
                onClick={() => setActiveTab("translation")}
              >
                Translation
              </button>
              <button
                className={activeTab === "rotation" ? "active" : ""}
                onClick={() => setActiveTab("rotation")}
              >
                Rotation
              </button>
              <button
                className={activeTab === "scaling" ? "active" : ""}
                onClick={() => setActiveTab("scaling")}
              >
                Scaling
              </button>
              <button
                className={activeTab === "reflection" ? "active" : ""}
                onClick={() => setActiveTab("reflection")}
              >
                Reflection
              </button>
              <button
                className={activeTab === "shearing" ? "active" : ""}
                onClick={() => setActiveTab("shearing")}
              >
                Shearing
              </button>
            </div>
          </div>

          {/* PARAMETER CONTROLS FOR ACTIVE TAB */}
          <div className="transformations-section parameter-box">
            {activeTab === "translation" && (
              <div className="param-group">
                <h4>Translation Factors</h4>
                <div className="param-row">
                  <label>Tₓ (Shift X):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={tx}
                    onChange={(e) => setTx(Number(e.target.value))}
                  />
                </div>
                <div className="param-row">
                  <label>Tᵧ (Shift Y):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={ty}
                    onChange={(e) => setTy(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {activeTab === "rotation" && (
              <div className="param-group">
                <h4>Rotation Angle</h4>
                <div className="param-row">
                  <label>Angle θ (°):</label>
                  <input
                    type="number"
                    step="15"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {activeTab === "scaling" && (
              <div className="param-group">
                <h4>Scaling Factors</h4>
                <div className="param-row">
                  <label>Sₓ (Scale X):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sx}
                    onChange={(e) => setSx(Number(e.target.value))}
                  />
                </div>
                <div className="param-row">
                  <label>Sᵧ (Scale Y):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sy}
                    onChange={(e) => setSy(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {activeTab === "reflection" && (
              <div className="param-group">
                <h4>Reflection Axis</h4>
                <div className="param-row">
                  <label>Reflect Across:</label>
                  <select
                    value={reflectionAxis}
                    onChange={(e) => setReflectionAxis(e.target.value)}
                  >
                    <option value="x-axis">X-Axis (Y' = -Y)</option>
                    <option value="y-axis">Y-Axis (X' = -X)</option>
                    <option value="origin">Origin (X' = -X, Y' = -Y)</option>
                    <option value="y=x">Line Y = X (X' = Y, Y' = X)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "shearing" && (
              <div className="param-group">
                <h4>Shear Factors</h4>
                <div className="param-row">
                  <label>Shₓ (Shear X):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shx}
                    onChange={(e) => setShx(Number(e.target.value))}
                  />
                </div>
                <div className="param-row">
                  <label>Shᵧ (Shear Y):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shy}
                    onChange={(e) => setShy(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="transformations-buttons">
            <button onClick={handleAnimate} disabled={isAnimating}>
              {isAnimating ? "Transforming..." : "▶ Animate Transformation"}
            </button>
            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE - COORDINATE PLANE VISUALIZER
        ========================================= */}
        <div className="transformations-visualizer">
          <h2>Coordinate Plane</h2>

          <div className="svg-container">
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="coord-svg">
              {/* Grid Lines */}
              {Array.from({ length: maxGrid - minGrid + 1 }).map((_, idx) => {
                const val = minGrid + idx;
                const pos = toSvgX(val);
                const isZero = val === 0;
                return (
                  <g key={`grid-${val}`}>
                    {/* Vertical grid line */}
                    <line
                      x1={pos}
                      y1={0}
                      x2={pos}
                      y2={svgSize}
                      stroke={isZero ? "#94a3b8" : "#1e293b"}
                      strokeWidth={isZero ? 2 : 1}
                      strokeDasharray={isZero ? "none" : "2,2"}
                    />
                    {/* Horizontal grid line */}
                    <line
                      x1={0}
                      y1={pos}
                      x2={svgSize}
                      y2={pos}
                      stroke={isZero ? "#94a3b8" : "#1e293b"}
                      strokeWidth={isZero ? 2 : 1}
                      strokeDasharray={isZero ? "none" : "2,2"}
                    />
                    {/* Grid numbers */}
                    {val !== 0 && val % 2 === 0 && (
                      <>
                        <text
                          x={pos}
                          y={toSvgY(0) + 15}
                          fill="#64748b"
                          fontSize="10"
                          textAnchor="middle"
                        >
                          {val}
                        </text>
                        <text
                          x={toSvgX(0) - 10}
                          y={pos + 4}
                          fill="#64748b"
                          fontSize="10"
                          textAnchor="end"
                        >
                          {-val}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {/* Reflection Axis Line indicator if Y = X */}
              {activeTab === "reflection" && reflectionAxis === "y=x" && (
                <line
                  x1={toSvgX(-10)}
                  y1={toSvgY(-10)}
                  x2={toSvgX(10)}
                  y2={toSvgY(10)}
                  stroke="#eab308"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              )}

              {/* ORIGINAL POLYGON */}
              <polygon
                points={origPolygonPoints}
                fill="rgba(6, 182, 212, 0.15)"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4,4"
              />

              {/* TRANSFORMED POLYGON */}
              <polygon
                points={transformedPolygonPoints}
                fill="rgba(245, 158, 11, 0.25)"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />

              {/* ORIGINAL VERTICES */}
              {vertices.map((v) => (
                <g key={`orig-${v.label}`}>
                  <circle
                    cx={toSvgX(v.x)}
                    cy={toSvgY(v.y)}
                    r="4"
                    fill="#06b6d4"
                  />
                  <text
                    x={toSvgX(v.x) + 7}
                    y={toSvgY(v.y) - 7}
                    fill="#38bdf8"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {v.label}({v.x},{v.y})
                  </text>
                </g>
              ))}

              {/* TRANSFORMED VERTICES */}
              {transformedVertices.map((v, i) => {
                const interp = interpolatedVertices[i];
                return (
                  <g key={`trans-${v.label}`}>
                    <circle
                      cx={toSvgX(interp.x)}
                      cy={toSvgY(interp.y)}
                      r="5"
                      fill="#f59e0b"
                    />
                    <text
                      x={toSvgX(interp.x) + 7}
                      y={toSvgY(interp.y) + 14}
                      fill="#fbbf24"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {v.label}({v.x},{v.y})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* LEGEND */}
          <div className="transformations-legend">
            <span>
              <strong style={{ color: "#06b6d4" }}>---</strong> Original Shape
            </span>
            <span>
              <strong style={{ color: "#f59e0b" }}>—</strong> Transformed Shape
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          MATHEMATICAL CALCULATIONS BREAKDOWN
      ========================================= */}
      <div className="transformations-explanation">
        <h2>Mathematical Transformation Formulas &amp; Step Breakdown</h2>

        <div className="transformations-matrix-grid">
          {/* Active Formula Matrix Box */}
          <div className="formula-box">
            <h3>Active Transformation Formula</h3>
            {activeTab === "translation" && (
              <pre>
                {`[ X' ]   [ 1  0  Tx ] [ X ]\n[ Y' ] = [ 0  1  Ty ] [ Y ]\n[ 1  ]   [ 0  0   1 ] [ 1 ]\n\nFormula:\nX' = X + Tx\nY' = Y + Ty`}
              </pre>
            )}
            {activeTab === "rotation" && (
              <pre>
                {`[ X' ]   [ cosθ  -sinθ  0 ] [ X ]\n[ Y' ] = [ sinθ   cosθ  0 ] [ Y ]\n[ 1  ]   [   0      0    1 ] [ 1 ]\n\nFormula:\nX' = X·cosθ - Y·sinθ\nY' = X·sinθ + Y·cosθ`}
              </pre>
            )}
            {activeTab === "scaling" && (
              <pre>
                {`[ X' ]   [ Sx  0   0 ] [ X ]\n[ Y' ] = [ 0   Sy  0 ] [ Y ]\n[ 1  ]   [ 0   0   1 ] [ 1 ]\n\nFormula:\nX' = X × Sx\nY' = Y × Sy`}
              </pre>
            )}
            {activeTab === "reflection" && (
              <pre>
                {reflectionAxis === "x-axis" &&
                  `[ X' ]   [ 1   0  0 ] [ X ]\n[ Y' ] = [ 0  -1  0 ] [ Y ]\n[ 1  ]   [ 0   0  1 ] [ 1 ]\n\nFormula: X' = X, Y' = -Y`}
                {reflectionAxis === "y-axis" &&
                  `[ X' ]   [ -1  0  0 ] [ X ]\n[ Y' ] = [  0  1  0 ] [ Y ]\n[ 1  ]   [  0  0  1 ] [ 1 ]\n\nFormula: X' = -X, Y' = Y`}
                {reflectionAxis === "origin" &&
                  `[ X' ]   [ -1   0  0 ] [ X ]\n[ Y' ] = [  0  -1  0 ] [ Y ]\n[ 1  ]   [  0   0  1 ] [ 1 ]\n\nFormula: X' = -X, Y' = -Y`}
                {reflectionAxis === "y=x" &&
                  `[ X' ]   [ 0  1  0 ] [ X ]\n[ Y' ] = [ 1  0  0 ] [ Y ]\n[ 1  ]   [ 0  0  1 ] [ 1 ]\n\nFormula: X' = Y, Y' = X`}
              </pre>
            )}
            {activeTab === "shearing" && (
              <pre>
                {`[ X' ]   [  1   Shx  0 ] [ X ]\n[ Y' ] = [ Shy   1   0 ] [ Y ]\n[ 1  ]   [  0    0   1 ] [ 1 ]\n\nFormula:\nX' = X + Shx × Y\nY' = Y + Shy × X`}
              </pre>
            )}
          </div>

          {/* Vertex Calculations List */}
          <div className="vertex-calculations-box">
            <h3>Vertex Calculations</h3>
            {transformedVertices.map((tv, idx) => (
              <div key={tv.label} className="calc-item">
                <strong>
                  {vertices[idx].label}({vertices[idx].x}, {vertices[idx].y})
                  {" → "}
                  <span style={{ color: "#f59e0b" }}>
                    {tv.label}({tv.x}, {tv.y})
                  </span>
                </strong>
                <p>{tv.formulaStr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransformationsVisualizer;
