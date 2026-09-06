import { useEffect, useMemo, useState } from "react";
import { samplePageReferences } from "../../../../data/os/pageReplacementData";
import "./PageReplacementVisualizer.css";

const ALGORITHMS = [
  { id: "fifo", name: "FIFO (First-In, First-Out)" },
  { id: "lru", name: "LRU (Least Recently Used)" },
  { id: "optimal", name: "Optimal (Belady's Optimal Page Replacement)" },
];

function PageReplacementVisualizer() {
  const [algorithm, setAlgorithm] = useState("fifo");
  const [frameCount, setFrameCount] = useState(3);
  const [refInput, setRefInput] = useState(samplePageReferences[0]);

  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // --------------------------------
  // PAGE REPLACEMENT ENGINE
  // --------------------------------
  const simulationResult = useMemo(() => {
    const pages = refInput
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((s) => s !== "" && !isNaN(s))
      .map(Number);

    if (pages.length === 0) {
      return { stepsData: [], totalFaults: 0, totalHits: 0, faultRate: 0, hitRate: 0 };
    }

    const stepsData = [];
    const numFrames = Math.max(1, Number(frameCount));

    let currentFrames = [];
    let fifoQueue = []; // For FIFO tracking
    let lastUsedMap = {}; // For LRU tracking { page: lastSeenIdx }

    let hitCount = 0;
    let faultCount = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const isHit = currentFrames.includes(page);
      let replacedPage = null;

      if (isHit) {
        hitCount++;
        if (algorithm === "lru") {
          lastUsedMap[page] = i;
        }
      } else {
        faultCount++;
        if (currentFrames.length < numFrames) {
          currentFrames.push(page);
          fifoQueue.push(page);
          lastUsedMap[page] = i;
        } else {
          // Frame is full - Replace Page
          if (algorithm === "fifo") {
            replacedPage = fifoQueue.shift();
            const replaceIdx = currentFrames.indexOf(replacedPage);
            currentFrames[replaceIdx] = page;
            fifoQueue.push(page);
          } else if (algorithm === "lru") {
            // Find page with lowest lastUsed index
            let lruPage = currentFrames[0];
            let minLastUsed = lastUsedMap[lruPage] ?? -1;

            for (let j = 1; j < currentFrames.length; j++) {
              const p = currentFrames[j];
              const lastT = lastUsedMap[p] ?? -1;
              if (lastT < minLastUsed) {
                minLastUsed = lastT;
                lruPage = p;
              }
            }

            replacedPage = lruPage;
            const replaceIdx = currentFrames.indexOf(replacedPage);
            currentFrames[replaceIdx] = page;
            lastUsedMap[page] = i;
          } else if (algorithm === "optimal") {
            // Find page that won't be used for longest time in future
            let optPage = currentFrames[0];
            let maxFutureDist = -1;

            for (let j = 0; j < currentFrames.length; j++) {
              const p = currentFrames[j];
              let nextUse = Infinity;
              for (let k = i + 1; k < pages.length; k++) {
                if (pages[k] === p) {
                  nextUse = k;
                  break;
                }
              }
              if (nextUse > maxFutureDist) {
                maxFutureDist = nextUse;
                optPage = p;
              }
            }

            replacedPage = optPage;
            const replaceIdx = currentFrames.indexOf(replacedPage);
            currentFrames[replaceIdx] = page;
          }
        }
      }

      stepsData.push({
        stepIndex: i,
        page,
        framesSnapshot: [...currentFrames],
        isHit,
        replacedPage,
        runningHits: hitCount,
        runningFaults: faultCount,
      });
    }

    const totalReq = pages.length;
    const faultRate = ((faultCount / totalReq) * 100).toFixed(1);
    const hitRate = ((hitCount / totalReq) * 100).toFixed(1);

    return {
      pages,
      stepsData,
      totalFaults: faultCount,
      totalHits: hitCount,
      faultRate,
      hitRate,
    };
  }, [refInput, frameCount, algorithm]);

  const maxSteps = simulationResult.stepsData.length;
  const currentStepData =
    simulationResult.stepsData[step] ||
    simulationResult.stepsData[0] ||
    { page: null, framesSnapshot: [], isHit: false, runningHits: 0, runningFaults: 0 };

  // --------------------------------
  // ANIMATION CONTROL
  // --------------------------------
  useEffect(() => {
    if (!isRunning) return;

    if (step >= maxSteps - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [isRunning, step, maxSteps]);

  const handleStart = () => {
    if (step >= maxSteps - 1) {
      setStep(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleNext = () => {
    setIsRunning(false);
    if (step < maxSteps - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setStep(0);
  };

  return (
    <div className="page-repl-page">
      {/* HEADER */}
      <div className="page-repl-header">
        <span className="page-repl-label">MEMORY MANAGEMENT</span>
        <h1>Page Replacement Visualizer</h1>
        <p>
          Visualize how virtual memory manages main memory frames using FIFO, LRU,
          and Optimal page replacement algorithms.
        </p>
      </div>

      <div className="page-repl-layout">
        {/* =========================================
            LEFT SIDE - CONTROL & SETTINGS
        ========================================= */}
        <div className="page-repl-panel">
          <h2>Simulation Controls</h2>

          {/* ALGORITHM SELECTOR */}
          <div className="page-repl-section">
            <h3>Algorithm Selection</h3>
            <select
              className="page-repl-select"
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                setStep(0);
                setIsRunning(false);
              }}
            >
              {ALGORITHMS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* FRAME COUNT INPUT */}
          <div className="page-repl-section">
            <h3>Memory Frame Slots</h3>
            <input
              type="number"
              min="1"
              max="6"
              className="page-repl-input"
              value={frameCount}
              onChange={(e) => {
                setFrameCount(Math.max(1, Math.min(6, Number(e.target.value))));
                setStep(0);
                setIsRunning(false);
              }}
            />
          </div>

          {/* REFERENCE STRING INPUT */}
          <div className="page-repl-section">
            <h3>Page Reference Sequence</h3>
            <input
              type="text"
              className="page-repl-input"
              value={refInput}
              onChange={(e) => {
                setRefInput(e.target.value);
                setStep(0);
                setIsRunning(false);
              }}
            />
            <div className="preset-refs">
              {samplePageReferences.map((refStr, idx) => (
                <button
                  key={idx}
                  className={`preset-ref-btn ${refInput === refStr ? "active" : ""}`}
                  onClick={() => {
                    setRefInput(refStr);
                    setStep(0);
                    setIsRunning(false);
                  }}
                >
                  Preset {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* PLAY CONTROLS */}
          <div className="page-repl-buttons">
            {!isRunning ? (
              <button onClick={handleStart}>▶ Start Animation</button>
            ) : (
              <button onClick={handlePause}>⏸ Pause</button>
            )}

            <button onClick={handleNext} disabled={step >= maxSteps - 1}>
              Next Step →
            </button>

            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>

          {/* CURRENT STEP STATUS CARD */}
          <div className="page-repl-current-calculation">
            <h3>Step {step + 1} / {maxSteps}</h3>
            <p>
              <strong>Requested Page:</strong>{" "}
              <span className="page-number-tag">{currentStepData.page}</span>
            </p>
            <p>
              <strong>Page Status:</strong>{" "}
              {currentStepData.isHit ? (
                <span className="status-hit">PAGE HIT ✓</span>
              ) : (
                <span className="status-miss">PAGE FAULT (MISS) ✗</span>
              )}
            </p>
            {currentStepData.replacedPage !== null && (
              <p>
                <strong>Replaced Page:</strong>{" "}
                <span className="status-evicted">
                  Page {currentStepData.replacedPage} Evicted
                </span>
              </p>
            )}
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE - MEMORY FRAME MATRIX
        ========================================= */}
        <div className="page-repl-visualizer">
          <h2>Memory Frames Execution Matrix</h2>

          {/* PAGE REFERENCE SEQUENCE TRACK */}
          <div className="ref-sequence-bar">
            {simulationResult.pages?.map((pg, idx) => {
              const isCurrent = idx === step;
              const isProcessed = idx <= step;
              const stepObj = simulationResult.stepsData[idx];

              return (
                <div
                  key={idx}
                  className={`ref-chip ${isCurrent ? "active-ref" : ""} ${
                    isProcessed ? (stepObj?.isHit ? "chip-hit" : "chip-miss") : ""
                  }`}
                >
                  {pg}
                </div>
              );
            })}
          </div>

          {/* MEMORY FRAMES GRID */}
          <div className="frames-matrix-container">
            {Array.from({ length: Number(frameCount) }).map((_, fIdx) => (
              <div key={fIdx} className="frame-row">
                <span className="frame-label">Frame {fIdx + 1}</span>
                <div className="frame-steps-line">
                  {simulationResult.stepsData.slice(0, step + 1).map((st, sIdx) => {
                    const pageInFrame = st.framesSnapshot[fIdx];
                    const isNewInsert =
                      !st.isHit && pageInFrame === st.page && sIdx === step;

                    return (
                      <div
                        key={sIdx}
                        className={`frame-cell ${
                          pageInFrame !== undefined ? "filled" : "empty"
                        } ${isNewInsert ? "newly-inserted" : ""}`}
                      >
                        {pageInFrame !== undefined ? pageInFrame : "—"}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* METRICS & PERFORMANCE CARDS */}
          <div className="metrics-grid">
            <div className="metric-card fault-card">
              <span>Total Page Faults (MISS)</span>
              <strong>{simulationResult.totalFaults}</strong>
              <small>Fault Rate: {simulationResult.faultRate}%</small>
            </div>
            <div className="metric-card hit-card">
              <span>Total Page Hits</span>
              <strong>{simulationResult.totalHits}</strong>
              <small>Hit Rate: {simulationResult.hitRate}%</small>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ALGORITHM EXPLANATION
      ========================================= */}
      <div className="page-repl-explanation">
        <h2>Page Replacement Concepts &amp; Formulas</h2>
        <div className="page-repl-formula">
          <p>
            <strong>1. Page Fault (Miss):</strong> Occurs when a referenced page is
            not present in main memory frames, requiring a disk fetch.
          </p>
          <p>
            <strong>2. First-In First-Out (FIFO):</strong> Replaces the oldest page
            that was brought into memory first. Subject to Belady's Anomaly.
          </p>
          <p>
            <strong>3. Least Recently Used (LRU):</strong> Replaces the page that
            has not been referenced for the longest period of time.
          </p>
          <p>
            <strong>4. Optimal Algorithm:</strong> Replaces the page that will not
            be used for the longest time in the future. Serves as theoretical benchmark.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageReplacementVisualizer;
