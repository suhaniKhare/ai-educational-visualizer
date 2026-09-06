import { useEffect, useMemo, useState } from "react";
import { initialProcesses } from "../../../../data/os/sampleProcesses";
import "./CPUSchedulingVisualizer.css";

const ALGORITHMS = [
  { id: "fcfs", name: "FCFS (First-Come, First-Served)" },
  { id: "sjf", name: "SJF (Shortest Job First - Non Preemptive)" },
  { id: "srtf", name: "SRTF (Shortest Remaining Time First - Preemptive)" },
  { id: "rr", name: "Round Robin (RR)" },
  { id: "priority", name: "Priority Scheduling (Non Preemptive)" },
];

function CPUSchedulingVisualizer() {
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState(initialProcesses);

  const [currentTimeStep, setCurrentTimeStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // --------------------------------
  // SCHEDULING SIMULATION ENGINE
  // --------------------------------
  const simulationResult = useMemo(() => {
    const procList = processes.map((p) => ({
      ...p,
      arrivalTime: Number(p.arrivalTime),
      burstTime: Number(p.burstTime),
      priority: Number(p.priority),
      remainingTime: Number(p.burstTime),
    }));

    const timeline = []; // Per unit time step: { t, activeProcessId, readyQueue, remainingTimes }
    const ganttBlocks = []; // { id, start, end, color }
    const completionTimes = {};

    let t = 0;
    let completedCount = 0;
    const n = procList.length;

    let rrQueue = [];
    let currentProc = null;
    let rrQuantumLeft = Number(timeQuantum);

    // Track arrived processes for RR queue initialization
    const arrivedSet = new Set();

    while (completedCount < n && t < 100) {
      // 1. Find newly arrived processes at time t
      const newlyArrived = procList.filter(
        (p) => p.arrivalTime <= t && p.remainingTime > 0
      );

      // --------------------------------
      // ALGORITHM SPECIFIC SELECTION
      // --------------------------------
      let nextProc = null;

      if (algorithm === "fcfs") {
        newlyArrived.sort((a, b) => a.arrivalTime - b.arrivalTime);
        nextProc = newlyArrived[0] || null;
      } else if (algorithm === "sjf") {
        if (currentProc && currentProc.remainingTime > 0) {
          nextProc = currentProc;
        } else {
          newlyArrived.sort(
            (a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime
          );
          nextProc = newlyArrived[0] || null;
        }
      } else if (algorithm === "srtf") {
        newlyArrived.sort(
          (a, b) =>
            a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime
        );
        nextProc = newlyArrived[0] || null;
      } else if (algorithm === "priority") {
        if (currentProc && currentProc.remainingTime > 0) {
          nextProc = currentProc;
        } else {
          newlyArrived.sort(
            (a, b) =>
              a.priority - b.priority || a.arrivalTime - b.arrivalTime
          );
          nextProc = newlyArrived[0] || null;
        }
      } else if (algorithm === "rr") {
        // Add newly arrived processes to RR Queue
        procList.forEach((p) => {
          if (
            p.arrivalTime <= t &&
            p.remainingTime > 0 &&
            !arrivedSet.has(p.id)
          ) {
            rrQueue.push(p);
            arrivedSet.add(p.id);
          }
        });

        if (
          !currentProc ||
          currentProc.remainingTime === 0 ||
          rrQuantumLeft === 0
        ) {
          if (currentProc && currentProc.remainingTime > 0) {
            rrQueue.push(currentProc); // Re-queue unfinished process
          }
          currentProc = rrQueue.shift() || null;
          rrQuantumLeft = Number(timeQuantum);
        }

        nextProc = currentProc;
      }

      currentProc = nextProc;

      // 2. Record Timeline & Execute 1 Time Unit
      const activeId = nextProc ? nextProc.id : null;
      const readyQueueIds = newlyArrived
        .filter((p) => p.id !== activeId)
        .map((p) => p.id);

      const remTimesSnapshot = {};
      procList.forEach((p) => {
        remTimesSnapshot[p.id] = p.remainingTime;
      });

      timeline.push({
        t,
        activeProcessId: activeId,
        readyQueue: readyQueueIds,
        remainingTimes: remTimesSnapshot,
      });

      // 3. Update Gantt Blocks
      if (nextProc) {
        const lastBlock = ganttBlocks[ganttBlocks.length - 1];
        if (lastBlock && lastBlock.id === nextProc.id) {
          lastBlock.end = t + 1;
        } else {
          ganttBlocks.push({
            id: nextProc.id,
            start: t,
            end: t + 1,
            color: nextProc.color,
          });
        }

        // Deduct 1 unit time
        nextProc.remainingTime -= 1;
        if (algorithm === "rr") rrQuantumLeft -= 1;

        if (nextProc.remainingTime === 0) {
          completionTimes[nextProc.id] = t + 1;
          completedCount++;
        }
      }

      t++;
    }

    // 4. Calculate Final Process Metrics (CT, TAT, WT)
    const metrics = procList.map((p) => {
      const ct = completionTimes[p.id] || p.arrivalTime + p.burstTime;
      const tat = ct - p.arrivalTime;
      const wt = tat - p.burstTime;
      return {
        ...p,
        ct,
        tat: Math.max(tat, 0),
        wt: Math.max(wt, 0),
      };
    });

    const totalWT = metrics.reduce((acc, m) => acc + m.wt, 0);
    const totalTAT = metrics.reduce((acc, m) => acc + m.tat, 0);

    const avgWT = (totalWT / n).toFixed(2);
    const avgTAT = (totalTAT / n).toFixed(2);

    return {
      timeline,
      ganttBlocks,
      metrics,
      avgWT,
      avgTAT,
      maxTime: t,
    };
  }, [processes, algorithm, timeQuantum]);

  const maxSteps = simulationResult.timeline.length;
  const currentStepData =
    simulationResult.timeline[currentTimeStep] ||
    simulationResult.timeline[0] ||
    { t: 0, activeProcessId: null, readyQueue: [] };

  // --------------------------------
  // ANIMATION CONTROL
  // --------------------------------
  useEffect(() => {
    if (!isRunning) return;

    if (currentTimeStep >= maxSteps - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentTimeStep((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [isRunning, currentTimeStep, maxSteps]);

  const handleStart = () => {
    if (currentTimeStep >= maxSteps - 1) {
      setCurrentTimeStep(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleNext = () => {
    setIsRunning(false);
    if (currentTimeStep < maxSteps - 1) {
      setCurrentTimeStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTimeStep(0);
  };

  // Process editing handlers
  const handleProcessChange = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = Number(value);
    setProcesses(updated);
    setCurrentTimeStep(0);
    setIsRunning(false);
  };

  return (
    <div className="cpu-page">
      {/* HEADER */}
      <div className="cpu-header">
        <span className="cpu-label">PROCESS MANAGEMENT</span>
        <h1>CPU Scheduling Visualizer</h1>
        <p>
          Observe how the OS CPU Scheduler allocates processor time using FCFS,
          SJF, SRTF, Round Robin, and Priority algorithms.
        </p>
      </div>

      <div className="cpu-layout">
        {/* =========================================
            LEFT SIDE - CONTROL & PROCESS INPUTS
        ========================================= */}
        <div className="cpu-panel">
          <h2>Scheduler Settings</h2>

          {/* ALGORITHM SELECTOR */}
          <div className="cpu-section">
            <h3>Algorithm Selection</h3>
            <select
              className="cpu-select"
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                setCurrentTimeStep(0);
                setIsRunning(false);
              }}
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>

          {/* ROUND ROBIN QUANTUM INPUT */}
          {algorithm === "rr" && (
            <div className="cpu-section">
              <h3>Time Quantum (Q)</h3>
              <input
                type="number"
                min="1"
                className="cpu-input"
                value={timeQuantum}
                onChange={(e) => {
                  setTimeQuantum(Math.max(1, Number(e.target.value)));
                  setCurrentTimeStep(0);
                  setIsRunning(false);
                }}
              />
            </div>
          )}

          {/* PROCESS INPUT TABLE */}
          <div className="cpu-section">
            <h3>Process Set (Arrival &amp; Burst Times)</h3>
            <div className="process-input-table">
              <div className="proc-row header-row">
                <span>ID</span>
                <span>Arrival</span>
                <span>Burst</span>
                {algorithm === "priority" && <span>Priority</span>}
              </div>
              {processes.map((proc, idx) => (
                <div key={proc.id} className="proc-row">
                  <span className="proc-id" style={{ color: proc.color }}>
                    {proc.id}
                  </span>
                  <input
                    type="number"
                    value={proc.arrivalTime}
                    onChange={(e) =>
                      handleProcessChange(idx, "arrivalTime", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    value={proc.burstTime}
                    onChange={(e) =>
                      handleProcessChange(idx, "burstTime", e.target.value)
                    }
                  />
                  {algorithm === "priority" && (
                    <input
                      type="number"
                      value={proc.priority}
                      onChange={(e) =>
                        handleProcessChange(idx, "priority", e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="cpu-buttons">
            {!isRunning ? (
              <button onClick={handleStart}>▶ Start Animation</button>
            ) : (
              <button onClick={handlePause}>⏸ Pause</button>
            )}

            <button onClick={handleNext} disabled={currentTimeStep >= maxSteps - 1}>
              Next Step →
            </button>

            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>

          {/* TIMELINE STATUS CARD */}
          <div className="cpu-current-calculation">
            <h3>Simulation Time: t = {currentStepData.t}</h3>
            <p>
              <strong>Active CPU Process:</strong>{" "}
              <span
                className="cpu-tag"
                style={{
                  color:
                    processes.find((p) => p.id === currentStepData.activeProcessId)
                      ?.color || "#94a3b8",
                }}
              >
                {currentStepData.activeProcessId
                  ? `${currentStepData.activeProcessId} (Executing)`
                  : "CPU Idle"}
              </span>
            </p>
            <p>
              <strong>Ready Queue:</strong>{" "}
              {currentStepData.readyQueue.length > 0
                ? currentStepData.readyQueue.join(", ")
                : "Empty"}
            </p>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE - GANTT CHART & VISUAL PIPELINE
        ========================================= */}
        <div className="cpu-visualizer">
          {/* LIVE CPU & READY QUEUE STATUS */}
          <div className="pipeline-container">
            {/* CPU UNIT */}
            <div className="cpu-unit-box">
              <span className="unit-label">CPU CORE</span>
              <div
                className={`cpu-active-chip ${
                  currentStepData.activeProcessId ? "busy" : "idle"
                }`}
                style={{
                  borderColor:
                    processes.find((p) => p.id === currentStepData.activeProcessId)
                      ?.color || "#334155",
                }}
              >
                <strong>{currentStepData.activeProcessId || "IDLE"}</strong>
              </div>
            </div>

            {/* READY QUEUE PIPELINE */}
            <div className="ready-queue-box">
              <span className="unit-label">READY QUEUE</span>
              <div className="queue-chips">
                {currentStepData.readyQueue.length > 0 ? (
                  currentStepData.readyQueue.map((pid) => {
                    const pObj = processes.find((p) => p.id === pid);
                    return (
                      <div
                        key={pid}
                        className="queue-chip"
                        style={{
                          backgroundColor: `${pObj?.color}22`,
                          borderColor: pObj?.color,
                          color: pObj?.color,
                        }}
                      >
                        {pid}
                      </div>
                    );
                  })
                ) : (
                  <span className="empty-queue-text">Queue is empty</span>
                )}
              </div>
            </div>
          </div>

          {/* ANIMATED GANTT CHART */}
          <div className="gantt-section">
            <h2>Gantt Chart Timeline</h2>
            <div className="gantt-chart-container">
              <div className="gantt-bar">
                {simulationResult.ganttBlocks
                  .filter((b) => b.start <= currentStepData.t)
                  .map((block, idx) => {
                    const duration =
                      Math.min(block.end, currentStepData.t + 1) - block.start;
                    const flexWidth = duration;

                    return (
                      <div
                        key={idx}
                        className="gantt-block"
                        style={{
                          flex: flexWidth,
                          backgroundColor: block.color,
                        }}
                      >
                        <span>{block.id}</span>
                      </div>
                    );
                  })}
              </div>

              {/* GANTT TIME TICKS */}
              <div className="gantt-ticks">
                <span>0</span>
                {simulationResult.ganttBlocks
                  .filter((b) => b.start <= currentStepData.t)
                  .map((block, idx) => (
                    <span
                      key={idx}
                      style={{
                        flex:
                          Math.min(block.end, currentStepData.t + 1) - block.start,
                      }}
                    >
                      {Math.min(block.end, currentStepData.t + 1)}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* CALCULATED PROCESS METRICS TABLE */}
          <div className="metrics-section">
            <h2>Calculated Performance Metrics</h2>
            <table className="cpu-table">
              <thead>
                <tr>
                  <th>Process</th>
                  <th>Arrival (AT)</th>
                  <th>Burst (BT)</th>
                  <th>Completion (CT)</th>
                  <th>Turnaround (TAT)</th>
                  <th>Waiting (WT)</th>
                </tr>
              </thead>
              <tbody>
                {simulationResult.metrics.map((m) => (
                  <tr key={m.id}>
                    <td style={{ color: m.color, fontWeight: "bold" }}>
                      {m.id}
                    </td>
                    <td>{m.arrivalTime}</td>
                    <td>{m.burstTime}</td>
                    <td>{m.ct}</td>
                    <td>{m.tat}</td>
                    <td className="wt-cell">{m.wt}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* AVERAGE METRICS DISPLAY CARDS */}
            <div className="averages-grid">
              <div className="avg-card">
                <span>Average Waiting Time (Avg WT)</span>
                <strong>{simulationResult.avgWT} ms</strong>
              </div>
              <div className="avg-card">
                <span>Average Turnaround Time (Avg TAT)</span>
                <strong>{simulationResult.avgTAT} ms</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ALGORITHM EXPLANATION
      ========================================= */}
      <div className="cpu-explanation">
        <h2>CPU Scheduling Formulas &amp; Concepts</h2>
        <div className="cpu-formula">
          <p>
            <strong>1. Turnaround Time (TAT):</strong> TAT = Completion Time (CT) - Arrival Time (AT). Total time spent from process submission to completion.
          </p>
          <p>
            <strong>2. Waiting Time (WT):</strong> WT = Turnaround Time (TAT) - Burst Time (BT). Total time process spent waiting in the ready queue.
          </p>
          <p>
            <strong>3. FCFS vs SJF:</strong> FCFS schedules processes in arrival order. SJF reduces average waiting time by executing shortest burst processes first.
          </p>
          <p>
            <strong>4. Preemption vs Non-Preemption:</strong> Preemptive algorithms (like SRTF and Round Robin) interrupt running processes when higher priority/shorter jobs arrive.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CPUSchedulingVisualizer;
