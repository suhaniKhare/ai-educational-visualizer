import { useEffect, useState } from "react";
import "./ProcessSynchronizationVisualizer.css";

function ProcessSynchronizationVisualizer() {
  const [activeTab, setActiveTab] = useState("producer-consumer"); // "producer-consumer" | "critical-section"

  // --------------------------------
  // PRODUCER-CONSUMER STATE
  // --------------------------------
  const bufferSize = 5;
  const [buffer, setBuffer] = useState([]);
  const [mutex, setMutex] = useState(1);
  const [empty, setEmpty] = useState(5);
  const [full, setFull] = useState(0);

  const [pcLog, setPcLog] = useState([]);
  const [autoSim, setAutoSim] = useState(false);

  // --------------------------------
  // CRITICAL SECTION STATE
  // --------------------------------
  const [csOwner, setCsOwner] = useState(null);
  const [csWaitingQueue, setCsWaitingQueue] = useState([]);
  const [csLog, setCsLog] = useState([]);

  // Auto simulation for Producer-Consumer
  useEffect(() => {
    if (!autoSim || activeTab !== "producer-consumer") return;

    const timer = setInterval(() => {
      const isProduce = Math.random() > 0.5;
      if (isProduce) {
        handleProduce();
      } else {
        handleConsume();
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [autoSim, activeTab, buffer, mutex, empty, full]);

  // Producer action
  const handleProduce = () => {
    if (empty === 0) {
      addPcLog("❌ Producer BLOCKED! Buffer is FULL (empty = 0).");
      return;
    }
    if (mutex === 0) {
      addPcLog("🔒 Producer BLOCKED! Mutex lock is held by another process.");
      return;
    }

    // Produce item
    const newItem = `Item-${Date.now().toString().slice(-3)}`;
    const newBuffer = [...buffer, newItem];
    setBuffer(newBuffer);
    setEmpty((prev) => prev - 1);
    setFull((prev) => prev + 1);

    addPcLog(
      `✅ Producer produced [${newItem}]. (empty=${empty - 1}, full=${full + 1}, mutex=1)`
    );
  };

  // Consumer action
  const handleConsume = () => {
    if (full === 0) {
      addPcLog("❌ Consumer BLOCKED! Buffer is EMPTY (full = 0).");
      return;
    }
    if (mutex === 0) {
      addPcLog("🔒 Consumer BLOCKED! Mutex lock is held by another process.");
      return;
    }

    // Consume item
    const consumedItem = buffer[0];
    const newBuffer = buffer.slice(1);
    setBuffer(newBuffer);
    setEmpty((prev) => prev + 1);
    setFull((prev) => prev - 1);

    addPcLog(
      `🍴 Consumer consumed [${consumedItem}]. (empty=${empty + 1}, full=${full - 1}, mutex=1)`
    );
  };

  const addPcLog = (msg) => {
    setPcLog((prev) => [msg, ...prev.slice(0, 7)]);
  };

  const handleResetPC = () => {
    setAutoSim(false);
    setBuffer([]);
    setMutex(1);
    setEmpty(5);
    setFull(0);
    setPcLog([]);
  };

  // --------------------------------
  // CRITICAL SECTION HANDLERS
  // --------------------------------
  const handleRequestCS = (pId) => {
    if (csOwner === null) {
      setCsOwner(pId);
      addCsLog(`🔑 Process ${pId} acquired Mutex Lock (wait(mutex)) and entered Critical Section.`);
    } else if (csOwner === pId) {
      addCsLog(`Process ${pId} is already inside Critical Section.`);
    } else {
      if (!csWaitingQueue.includes(pId)) {
        setCsWaitingQueue((prev) => [...prev, pId]);
        addCsLog(`⏳ Process ${pId} BLOCKED! Mutex held by ${csOwner}. ${pId} added to Waiting Queue.`);
      }
    }
  };

  const handleExitCS = (pId) => {
    if (csOwner !== pId) return;

    addCsLog(`🔓 Process ${pId} released Mutex Lock (signal(mutex)) and exited Critical Section.`);

    if (csWaitingQueue.length > 0) {
      const nextOwner = csWaitingQueue[0];
      setCsWaitingQueue((prev) => prev.slice(1));
      setCsOwner(nextOwner);
      addCsLog(`🔑 Waiting Process ${nextOwner} woken up & granted Mutex Lock!`);
    } else {
      setCsOwner(null);
    }
  };

  const addCsLog = (msg) => {
    setCsLog((prev) => [msg, ...prev.slice(0, 7)]);
  };

  const handleResetCS = () => {
    setCsOwner(null);
    setCsWaitingQueue([]);
    setCsLog([]);
  };

  return (
    <div className="sync-page">
      {/* HEADER */}
      <div className="sync-header">
        <span className="sync-label">CONCURRENCY &amp; SYNCHRONIZATION</span>
        <h1>Process Synchronization Visualizer</h1>
        <p>
          Understand semaphores, mutex locks, critical sections, and the bounded
          buffer producer-consumer problem.
        </p>
      </div>

      <div className="sync-layout">
        {/* =========================================
            LEFT SIDE - CONTROL & SETTINGS
        ========================================= */}
        <div className="sync-panel">
          <h2>Synchronization Concept</h2>

          {/* TAB SELECTOR */}
          <div className="sync-tabs">
            <button
              className={activeTab === "producer-consumer" ? "active" : ""}
              onClick={() => setActiveTab("producer-consumer")}
            >
              Producer-Consumer
            </button>
            <button
              className={activeTab === "critical-section" ? "active" : ""}
              onClick={() => setActiveTab("critical-section")}
            >
              Critical Section &amp; Mutex
            </button>
          </div>

          {activeTab === "producer-consumer" ? (
            <>
              {/* PRODUCER CONSUMER CONTROLS */}
              <div className="sync-section">
                <h3>Process Actions</h3>
                <div className="pc-buttons-grid">
                  <button className="produce-btn" onClick={handleProduce}>
                    ➕ Produce Item
                  </button>
                  <button className="consume-btn" onClick={handleConsume}>
                    ➖ Consume Item
                  </button>
                </div>
              </div>

              <div className="sync-buttons">
                <button onClick={() => setAutoSim(!autoSim)}>
                  {autoSim ? "⏸ Pause Auto Sim" : "▶ Start Auto Sim"}
                </button>
                <button className="reset-btn" onClick={handleResetPC}>
                  Reset
                </button>
              </div>

              {/* SEMAPHORE VARIABLES CARD */}
              <div className="sync-current-calculation">
                <h3>Semaphore Variables</h3>
                <p>
                  <strong>mutex:</strong>{" "}
                  <span className="sync-tag-green">{mutex}</span> (Binary Mutex Lock)
                </p>
                <p>
                  <strong>empty:</strong>{" "}
                  <span className="sync-tag-cyan">{empty}</span> (Empty Slots Remaining)
                </p>
                <p>
                  <strong>full:</strong>{" "}
                  <span className="sync-tag-orange">{full}</span> (Filled Buffer Slots)
                </p>
              </div>
            </>
          ) : (
            <>
              {/* CRITICAL SECTION CONTROLS */}
              <div className="sync-section">
                <h3>Process Entry Requests</h3>
                <div className="proc-request-list">
                  {["P1", "P2", "P3"].map((pid) => {
                    const isOwner = csOwner === pid;
                    const isWaiting = csWaitingQueue.includes(pid);

                    return (
                      <div key={pid} className="proc-control-card">
                        <span>Process {pid}</span>
                        {!isOwner ? (
                          <button
                            className="req-entry-btn"
                            disabled={isWaiting}
                            onClick={() => handleRequestCS(pid)}
                          >
                            {isWaiting ? "Waiting in Queue..." : "Request Entry →"}
                          </button>
                        ) : (
                          <button
                            className="exit-cs-btn"
                            onClick={() => handleExitCS(pid)}
                          >
                            Exit CS 🔓
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="sync-buttons">
                <button className="reset-btn" onClick={handleResetCS}>
                  Reset
                </button>
              </div>

              {/* MUTEX LOCK STATUS CARD */}
              <div className="sync-current-calculation">
                <h3>Mutex Lock Status</h3>
                <p>
                  <strong>Lock State:</strong>{" "}
                  {csOwner ? (
                    <span className="status-locked">
                      LOCKED by Process {csOwner}
                    </span>
                  ) : (
                    <span className="status-free">UNLOCKED (FREE)</span>
                  )}
                </p>
                <p>
                  <strong>Waiting Queue:</strong>{" "}
                  {csWaitingQueue.length > 0
                    ? csWaitingQueue.join(" → ")
                    : "None"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* =========================================
            RIGHT SIDE - VISUAL CANVAS & LOGS
        ========================================= */}
        <div className="sync-visualizer">
          {activeTab === "producer-consumer" ? (
            <>
              <h2>Shared Bounded Buffer (Capacity: {bufferSize})</h2>

              {/* SHARED BUFFER GRID */}
              <div className="buffer-grid">
                {Array.from({ length: bufferSize }).map((_, idx) => {
                  const item = buffer[idx];
                  const isFilled = item !== undefined;

                  return (
                    <div
                      key={idx}
                      className={`buffer-slot ${isFilled ? "filled-slot" : "empty-slot"}`}
                    >
                      <span className="slot-index">Slot {idx + 1}</span>
                      <strong className="slot-val">{item || "EMPTY"}</strong>
                    </div>
                  );
                })}
              </div>

              {/* LOG HISTORY */}
              <div className="sync-logs-container">
                <h3>Execution &amp; Semaphore Log</h3>
                {pcLog.length === 0 ? (
                  <p className="no-logs">No execution events yet. Click Produce/Consume to begin.</p>
                ) : (
                  pcLog.map((logStr, i) => <p key={i}>{logStr}</p>)
                )}
              </div>
            </>
          ) : (
            <>
              <h2>Critical Section &amp; Process States</h2>

              {/* CRITICAL SECTION VISUAL REGIONS */}
              <div className="cs-regions-container">
                {/* REMAINDER SECTION */}
                <div className="region-box remainder-box">
                  <h3>Remainder Section</h3>
                  <div className="proc-pills">
                    {["P1", "P2", "P3"]
                      .filter((p) => csOwner !== p && !csWaitingQueue.includes(p))
                      .map((p) => (
                        <div key={p} className="proc-pill">
                          {p}
                        </div>
                      ))}
                  </div>
                </div>

                {/* WAITING QUEUE */}
                <div className="region-box queue-box">
                  <h3>Entry Queue (Blocked)</h3>
                  <div className="proc-pills">
                    {csWaitingQueue.map((p) => (
                      <div key={p} className="proc-pill waiting-pill">
                        {p} (Wait)
                      </div>
                    ))}
                  </div>
                </div>

                {/* CRITICAL SECTION */}
                <div className="region-box cs-box">
                  <h3>🔒 CRITICAL SECTION (Max 1)</h3>
                  {csOwner ? (
                    <div className="proc-pill active-cs-pill">
                      Process {csOwner} (ACTIVE)
                    </div>
                  ) : (
                    <div className="empty-cs-text">Critical Section is Empty</div>
                  )}
                </div>
              </div>

              {/* MUTEX LOCK STEPS LOG */}
              <div className="sync-logs-container">
                <h3>Mutex Lock &amp; Signal Log</h3>
                {csLog.length === 0 ? (
                  <p className="no-logs">No synchronization events. Click Request Entry to test mutex lock.</p>
                ) : (
                  csLog.map((logStr, i) => <p key={i}>{logStr}</p>)
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =========================================
          ALGORITHM EXPLANATION
      ========================================= */}
      <div className="sync-explanation">
        <h2>Process Synchronization Concepts &amp; Semaphores</h2>
        <div className="sync-formula">
          <p>
            <strong>1. Critical Section (CS):</strong> A code region that accesses
            shared resources. Only one process can execute in CS at any instant to prevent race conditions.
          </p>
          <p>
            <strong>2. Mutex (Binary Semaphore):</strong> An integer variable initialized
            to 1. `wait(mutex)` locks access; `signal(mutex)` unlocks it.
          </p>
          <p>
            <strong>3. Bounded Buffer Semaphores:</strong> Uses `mutex=1` for mutual exclusion,
            `empty=N` for space tracking, and `full=0` for item counting.
          </p>
          <p>
            <strong>4. Race Condition Protection:</strong> Prevents buffer overflow when full
            and buffer underflow when empty through atomic semaphore operations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProcessSynchronizationVisualizer;
