import { useEffect, useState } from "react";
import { normalizationData } from "../../../../data/dbms/normalizationExamples";
import "./NormalizationVisualizer.css";

const STAGES = ["unf", "nf1", "nf2", "nf3"];
const STAGE_LABELS = {
  unf: "UNF",
  nf1: "1NF",
  nf2: "2NF",
  nf3: "3NF",
};

function NormalizationVisualizer() {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const currentStageKey = STAGES[step];
  const currentStageData = normalizationData[currentStageKey];

  // Automatic animation
  useEffect(() => {
    if (!isRunning) return;

    if (step >= STAGES.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isRunning, step]);

  const handleStart = () => {
    if (step >= STAGES.length - 1) {
      setStep(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleNext = () => {
    setIsRunning(false);
    if (step < STAGES.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setStep(0);
  };

  const handleSelectStage = (idx) => {
    setIsRunning(false);
    setStep(idx);
  };

  return (
    <div className="normalization-page">
      {/* HEADER */}
      <div className="normalization-header">
        <span className="normalization-label">DATABASE DESIGN &amp; NORMALIZATION</span>
        <h1>Normalization Visualizer</h1>
        <p>
          Observe step-by-step table decomposition from Unnormalized Form (UNF)
          up to Third Normal Form (3NF).
        </p>
      </div>

      <div className="normalization-layout">
        {/* =========================================
            LEFT SIDE - CONTROL & STAGE DETAILS
        ========================================= */}
        <div className="normalization-panel">
          <h2>Normalization Stages</h2>

          {/* STAGE SELECTOR TABS */}
          <div className="stage-tabs">
            {STAGES.map((stKey, idx) => (
              <button
                key={stKey}
                className={`stage-tab ${step === idx ? "active" : ""} ${
                  step > idx ? "completed" : ""
                }`}
                onClick={() => handleSelectStage(idx)}
              >
                {STAGE_LABELS[stKey]}
              </button>
            ))}
          </div>

          {/* CONTROLS */}
          <div className="normalization-buttons">
            {!isRunning ? (
              <button onClick={handleStart}>▶ Start Normalization</button>
            ) : (
              <button onClick={handlePause}>⏸ Pause</button>
            )}

            <button onClick={handleNext} disabled={step >= STAGES.length - 1}>
              Next Step →
            </button>

            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>

          {/* STEP CALCULATION & STATUS */}
          <div className="normalization-current-calculation">
            <h3>Current Normal Form: {STAGE_LABELS[currentStageKey]}</h3>
            <p>
              <strong>Stage Title:</strong> {currentStageData.title}
            </p>
            <p>
              <strong>Description:</strong> {currentStageData.description}
            </p>

            <div className="problem-box">
              <strong>Identified Problem / Anomaly:</strong>
              <p>{currentStageData.problem}</p>
            </div>

            {/* FUNCTIONAL DEPENDENCIES */}
            {currentStageData.dependencies && (
              <div className="fd-box">
                <h4>Active Functional Dependencies (FDs)</h4>
                {currentStageData.dependencies.map((fd, i) => (
                  <div key={i} className="fd-item">
                    <span className="fd-arrow">
                      <strong>{fd.lhs}</strong> &rarr; <span>{fd.rhs}</span>
                    </span>
                    <span
                      className="fd-type-badge"
                      style={{ backgroundColor: `${fd.color}22`, color: fd.color, borderColor: fd.color }}
                    >
                      {fd.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE - LIVE TABLES VISUALIZER
        ========================================= */}
        <div className="normalization-visualizer">
          <h2>Decomposed Tables ({currentStageData.tables.length} Table{currentStageData.tables.length > 1 ? "s" : ""})</h2>

          <div className="tables-container">
            {currentStageData.tables.map((table, tIdx) => (
              <div key={tIdx} className="table-card-wrapper">
                <div className="table-card-header">
                  <span className="table-name">{table.tableName}</span>
                  <span className="table-cols-badge">
                    {table.columns.join(" | ")}
                  </span>
                </div>

                <div className="table-scroll-box">
                  <table className="norm-table">
                    <thead>
                      <tr>
                        {Object.keys(table.rows[0] || {}).map((colKey) => (
                          <th key={colKey}>{colKey}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx}>{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          ALGORITHM EXPLANATION & ANOMALIES
      ========================================= */}
      <div className="normalization-explanation">
        <h2>Understanding Database Normal Forms &amp; Anomalies</h2>
        <div className="normalization-formula">
          <p>
            <strong>1. Unnormalized Form (UNF):</strong> Data contains repeating
            attribute groups or non-atomic values. Redundancy is high.
          </p>
          <p>
            <strong>2. 1st Normal Form (1NF):</strong> All attributes contain only
            atomic values (no lists/arrays). A unique Primary Key is established.
          </p>
          <p>
            <strong>3. 2nd Normal Form (2NF):</strong> Must be in 1NF. All non-prime
            attributes must be fully functionally dependent on the entire Primary Key (No Partial Dependencies).
          </p>
          <p>
            <strong>4. 3rd Normal Form (3NF):</strong> Must be in 2NF. No non-prime
            attribute may depend on another non-prime attribute (No Transitive Dependencies).
          </p>
          <p>
            <strong>5. Update Anomaly:</strong> Modifying a record requires updating
            multiple duplicated rows, risking data inconsistency.
          </p>
          <p>
            <strong>6. Insertion &amp; Deletion Anomalies:</strong> Cannot insert new
            entities without dummy relations, or deleting a record inadvertently wipes out unrelated attributes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NormalizationVisualizer;
