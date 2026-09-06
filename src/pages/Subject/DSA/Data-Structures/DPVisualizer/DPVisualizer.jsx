import React, { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Play,
  Sparkles,
} from "lucide-react";
import "./DPVisualizer.css";

const DPVisualizer = () => {
  const [problem, setProblem] = useState("fibonacci");
  const [n, setN] = useState(8);

  const [dp, setDp] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [status, setStatus] = useState(
    "Choose a DP problem and run the visualization."
  );
  const [result, setResult] = useState(null);

  const reset = () => {
    setDp([]);
    setActiveIndex(-1);
    setResult(null);
    setStatus("DP visualization reset.");
  };

  const runFibonacci = () => {
    const num = Math.max(0, Math.min(15, Number(n)));

    const values = new Array(num + 1).fill(0);

    if (num >= 1) values[1] = 1;

    setDp([0]);
    setActiveIndex(0);
    setResult(null);
    setStatus("Base case: dp[0] = 0");

    for (let i = 1; i <= num; i++) {
      setTimeout(() => {
        if (i === 1) {
          values[i] = 1;
        } else {
          values[i] = values[i - 1] + values[i - 2];
        }

        setDp([...values.slice(0, i + 1)]);
        setActiveIndex(i);

        setStatus(
          i === num
            ? `Completed. Fibonacci(${num}) = ${values[num]}`
            : `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}]`
        );

        if (i === num) {
          setResult(values[num]);
        }
      }, i * 550);
    }
  };

  const runKnapsack = () => {
    const weights = [1, 3, 4, 5];
    const values = [1, 4, 5, 7];
    const capacity = 7;

    const table = Array.from(
      { length: weights.length + 1 },
      () => new Array(capacity + 1).fill(0)
    );

    setDp([new Array(capacity + 1).fill(0)]);
    setActiveIndex(0);
    setResult(null);
    setStatus("Starting 0/1 Knapsack DP table...");

    let step = 0;

    for (let i = 1; i <= weights.length; i++) {
      for (let w = 0; w <= capacity; w++) {
        step++;

        setTimeout(() => {
          if (weights[i - 1] <= w) {
            table[i][w] = Math.max(
              table[i - 1][w],
              values[i - 1] + table[i - 1][w - weights[i - 1]]
            );
          } else {
            table[i][w] = table[i - 1][w];
          }

          setDp(table.map((row) => [...row]));
          setActiveIndex(i);

          if (
            i === weights.length &&
            w === capacity
          ) {
            setResult(table[i][w]);
            setStatus(
              `Completed. Maximum value = ${table[i][w]}`
            );
          } else {
            setStatus(
              `Computing dp[${i}][${w}]`
            );
          }
        }, step * 250);
      }
    }
  };

  const run = () => {
    reset();

    setTimeout(() => {
      if (problem === "fibonacci") {
        runFibonacci();
      } else {
        runKnapsack();
      }
    }, 100);
  };

  return (
    <div className="ds-page dp-page">
      <div className="ds-header">
        <button
          className="back-button"
          onClick={() =>
            (window.location.href = "/subject/data-structures")
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1>Dynamic Programming Visualizer</h1>
          <p>Understand how DP stores and reuses subproblem results</p>
        </div>

        <button className="reset-button" onClick={reset}>
          <RotateCcw size={17} />
          Reset
        </button>
      </div>

      <div className="dp-layout">
        <div className="control-panel">
          <h2 className="panel-title">DP Controls</h2>

          <label className="ds-label">Problem</label>

          <select
            className="ds-select"
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              reset();
            }}
          >
            <option value="fibonacci">
              Fibonacci
            </option>

            <option value="knapsack">
              0/1 Knapsack
            </option>
          </select>

          {problem === "fibonacci" && (
            <>
              <label className="ds-label">
                Number of terms
              </label>

              <input
                className="ds-input"
                type="number"
                min="0"
                max="15"
                value={n}
                onChange={(e) => setN(e.target.value)}
              />
            </>
          )}

          <button className="primary-action" onClick={run}>
            <Play size={18} />
            Run DP
          </button>

          <div className="status-box">
            <div className="status-icon">●</div>
            <div>{status}</div>
          </div>

          {result !== null && (
            <div className="dp-result">
              <span>Final Answer</span>
              <strong>{result}</strong>
            </div>
          )}
        </div>

        <div className="visualization-panel">
          <div className="visualization-heading">
            <div>
              <span className="mini-label">VISUALIZATION</span>

              <h2>
                {problem === "fibonacci"
                  ? "Fibonacci DP"
                  : "0/1 Knapsack DP"}
              </h2>
            </div>

            <div className="dp-badge">
              <Sparkles size={15} />
              Bottom-Up
            </div>
          </div>

          {problem === "fibonacci" ? (
            <div className="fibonacci-area">
              <div className="dp-array">
                {dp.map((value, index) => (
                  <div
                    className={`dp-cell ${
                      activeIndex === index
                        ? "active-dp-cell"
                        : ""
                    }`}
                    key={index}
                  >
                    <span className="dp-index">
                      dp[{index}]
                    </span>

                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              {dp.length > 0 && (
                <div className="formula-box">
                  {activeIndex >= 2 ? (
                    <>
                      <span>
                        dp[{activeIndex}]
                      </span>

                      <b>=</b>

                      <span>
                        dp[{activeIndex - 1}]
                      </span>

                      <b>+</b>

                      <span>
                        dp[{activeIndex - 2}]
                      </span>
                    </>
                  ) : (
                    <span>
                      Base Case
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <KnapsackTable
              dp={dp}
              activeIndex={activeIndex}
            />
          )}

          <div className="concept-card">
            <h3>🧠 Dynamic Programming</h3>

            <p>
              DP solves a problem by breaking it into overlapping
              subproblems and storing their answers so they don't
              need to be recomputed.
            </p>

            <div className="dp-concepts">
              <div>
                <strong>1</strong>
                <span>Define State</span>
              </div>

              <div>
                <strong>2</strong>
                <span>Find Transition</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Base Case</span>
              </div>

              <div>
                <strong>4</strong>
                <span>Build Answer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KnapsackTable = ({ dp, activeIndex }) => {
  if (!dp.length) {
    return (
      <div className="empty-dp">
        <span>DP table will appear here.</span>
      </div>
    );
  }

  return (
    <div className="knapsack-area">
      <div className="knapsack-info">
        <span>Weights: [1, 3, 4, 5]</span>
        <span>Values: [1, 4, 5, 7]</span>
        <span>Capacity: 7</span>
      </div>

      <div className="table-wrapper">
        <table className="dp-table">
          <thead>
            <tr>
              <th>Item / Capacity</th>

              {Array.from(
                { length: 8 },
                (_, i) => (
                  <th key={i}>{i}</th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {dp.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>
                  {rowIndex === 0
                    ? "0"
                    : `Item ${rowIndex}`}
                </th>

                {row.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className={
                      activeIndex === rowIndex
                        ? "active-table-cell"
                        : ""
                    }
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DPVisualizer;