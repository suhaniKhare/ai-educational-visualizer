import { useEffect, useState } from "react";
import { initialIndexRecords, sampleBPlusTree } from "../../../../data/dbms/indexData";
import "./IndexingVisualizer.css";

function IndexingVisualizer() {
  const [activeTab, setActiveTab] = useState("comparison"); // "comparison" | "insertion"
  const [searchTarget, setSearchTarget] = useState(70);
  const [insertInput, setInsertInput] = useState(25);

  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Dynamic B+ Tree state for insertion mode
  const [treeState, setTreeState] = useState(sampleBPlusTree);
  const [treeLogs, setTreeLogs] = useState([]);

  // --------------------------------
  // SEARCH COMPARISON STEPS GENERATOR
  // --------------------------------
  const linearScanSteps = [];
  let foundLinearIdx = -1;

  for (let i = 0; i < initialIndexRecords.length; i++) {
    const rec = initialIndexRecords[i];
    linearScanSteps.push({
      index: i,
      id: rec.id,
      name: rec.name,
      checked: true,
      isMatch: rec.id === Number(searchTarget),
    });
    if (rec.id === Number(searchTarget)) {
      foundLinearIdx = i;
      break;
    }
  }

  // B+ Tree Search Path Generator
  const btreePath = [];
  const root = sampleBPlusTree;
  btreePath.push({ nodeId: "root", title: "Root Node [40 | 70]", keys: root.keys });

  let chosenChild = null;
  const targetNum = Number(searchTarget);

  if (targetNum < 40) {
    chosenChild = root.children[0];
  } else if (targetNum < 70) {
    chosenChild = root.children[1];
  } else {
    chosenChild = root.children[2];
  }

  if (chosenChild) {
    btreePath.push({
      nodeId: chosenChild.id,
      title: `Leaf Node [${chosenChild.keys.join(" | ")}]`,
      keys: chosenChild.keys,
      found: chosenChild.keys.includes(targetNum),
    });
  }

  const maxSteps = Math.max(linearScanSteps.length, btreePath.length) + 1;

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
    }, 900);

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
    setTreeState(sampleBPlusTree);
    setTreeLogs([]);
  };

  // --------------------------------
  // B+ TREE INSERTION ENGINE (Order M=3)
  // --------------------------------
  const handleInsertKey = () => {
    const val = Number(insertInput);
    if (isNaN(val)) return;

    // Helper clone
    const newTree = JSON.parse(JSON.stringify(treeState));
    const logs = [];
    logs.push(`Step 1: Searching insertion path for key ${val}...`);

    // Find leaf
    let targetLeaf = null;
    if (val < 40) targetLeaf = newTree.children[0];
    else if (val < 70) targetLeaf = newTree.children[1];
    else targetLeaf = newTree.children[2];

    logs.push(`Step 2: Located target leaf node [${targetLeaf.keys.join(", ")}].`);

    if (!targetLeaf.keys.includes(val)) {
      targetLeaf.keys.push(val);
      targetLeaf.keys.sort((a, b) => a - b);
      targetLeaf.records.push({ id: val, name: `Record ${val}` });
      targetLeaf.records.sort((a, b) => a.id - b.id);
      logs.push(`Step 3: Key ${val} inserted into leaf node. Keys: [${targetLeaf.keys.join(", ")}].`);

      // Check overflow (max 3 keys per leaf)
      if (targetLeaf.keys.length > 3) {
        logs.push(`Step 4: Node Overflow detected (> 3 keys)! Splitting leaf node...`);
        const midIdx = Math.floor(targetLeaf.keys.length / 2);
        const rightKeys = targetLeaf.keys.splice(midIdx);
        const promotedKey = rightKeys[0];

        logs.push(`Step 5: Promoted key ${promotedKey} to parent Root node.`);
        newTree.keys.push(promotedKey);
        newTree.keys.sort((a, b) => a - b);
      }
    } else {
      logs.push(`Key ${val} already exists in tree.`);
    }

    setTreeState(newTree);
    setTreeLogs(logs);
  };

  return (
    <div className="indexing-page">
      {/* HEADER */}
      <div className="indexing-header">
        <span className="indexing-label">STORAGE &amp; INDEXING ALGORITHM</span>
        <h1>Indexing / B+ Tree Visualizer</h1>
        <p>
          Compare full table scans vs indexed B+ tree search and observe node
          traversals, key insertions, and node splitting in real time.
        </p>
      </div>

      <div className="indexing-layout">
        {/* =========================================
            LEFT SIDE - CONTROL & METRICS PANEL
        ========================================= */}
        <div className="indexing-panel">
          <h2>Visualizer Mode</h2>

          {/* MODE TABS */}
          <div className="indexing-tabs">
            <button
              className={activeTab === "comparison" ? "active" : ""}
              onClick={() => {
                setActiveTab("comparison");
                setStep(0);
                setIsRunning(false);
              }}
            >
              Search Comparison
            </button>
            <button
              className={activeTab === "insertion" ? "active" : ""}
              onClick={() => {
                setActiveTab("insertion");
                setStep(0);
                setIsRunning(false);
              }}
            >
              B+ Tree Insertion
            </button>
          </div>

          {/* PARAMETER CONTROLS */}
          {activeTab === "comparison" ? (
            <div className="indexing-section">
              <h3>Search Key</h3>
              <div className="input-group">
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => {
                    setSearchTarget(Number(e.target.value));
                    setStep(0);
                    setIsRunning(false);
                  }}
                />
                <div className="preset-keys">
                  <button onClick={() => setSearchTarget(30)}>Key 30</button>
                  <button onClick={() => setSearchTarget(50)}>Key 50</button>
                  <button onClick={() => setSearchTarget(70)}>Key 70</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="indexing-section">
              <h3>Insert Key into B+ Tree</h3>
              <div className="input-group">
                <input
                  type="number"
                  value={insertInput}
                  onChange={(e) => setInsertInput(e.target.value)}
                />
                <button className="action-btn" onClick={handleInsertKey}>
                  Insert Key
                </button>
              </div>
            </div>
          )}

          {/* PLAY CONTROLS */}
          <div className="indexing-buttons">
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

          {/* METRICS & PERFORMANCE COMPARISON CARD */}
          <div className="indexing-current-calculation">
            <h3>Search Efficiency Metrics</h3>
            <p>
              <strong>Search Target Key:</strong> {searchTarget}
            </p>
            <p>
              <strong>Linear Scan Checks:</strong>{" "}
              <span className="indexing-tag-red">
                {Math.min(step + 1, linearScanSteps.length)} / {initialIndexRecords.length} Rows
              </span>
            </p>
            <p>
              <strong>B+ Tree Node Accesses:</strong>{" "}
              <span className="indexing-tag-green">
                {Math.min(step + 1, btreePath.length)} Node(s) ($O(\log N)$)
              </span>
            </p>
            {step >= btreePath.length - 1 && (
              <div className="efficiency-badge">
                🎉 Work Reduced by{" "}
                {Math.round(
                  (1 - btreePath.length / linearScanSteps.length) * 100
                )}
                %!
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE - VISUALIZER CANVAS
        ========================================= */}
        <div className="indexing-visualizer">
          {activeTab === "comparison" ? (
            <>
              {/* PART A: UNINDEXED LINEAR SCAN */}
              <div className="vis-section">
                <h2>PART A: Unindexed Full Table Scan</h2>
                <div className="table-scan-row">
                  {initialIndexRecords.map((rec, i) => {
                    const isChecked = i <= step && i < linearScanSteps.length;
                    const isCurrent = i === step;
                    const isFound = isChecked && rec.id === Number(searchTarget);

                    return (
                      <div
                        key={rec.id}
                        className={`record-block ${isChecked ? "checked" : ""} ${
                          isCurrent ? "current" : ""
                        } ${isFound ? "found" : ""}`}
                      >
                        <span className="rec-id">ID: {rec.id}</span>
                        <span className="rec-name">{rec.name}</span>
                        {isFound && <span className="found-tag">MATCH ✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PART B: B+ TREE INDEX TRAVERSAL */}
              <div className="vis-section">
                <h2>PART B: B+ Tree Index Search Traversal</h2>
                <div className="btree-canvas">
                  {/* ROOT NODE */}
                  <div
                    className={`tree-node root-node ${
                      step >= 0 ? "active-node" : ""
                    }`}
                  >
                    <span className="node-label">ROOT NODE</span>
                    <div className="node-keys">
                      {treeState.keys.map((k) => (
                        <span key={k} className="key-box">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* POINTER ARROWS */}
                  <div className="connector-lines">
                    <div className="line-branch">↙</div>
                    <div className="line-branch">↓</div>
                    <div className="line-branch">↘</div>
                  </div>

                  {/* LEAF NODES LEVEL */}
                  <div className="leaf-level">
                    {treeState.children.map((leafNode, idx) => {
                      const isVisited =
                        step >= 1 &&
                        btreePath[1] &&
                        btreePath[1].nodeId === leafNode.id;
                      const hasKey = leafNode.keys.includes(Number(searchTarget));
                      const isMatched = isVisited && hasKey;

                      return (
                        <div
                          key={leafNode.id}
                          className={`tree-node leaf-node ${
                            isVisited ? "active-node" : ""
                          } ${isMatched ? "found-node" : ""}`}
                        >
                          <span className="node-label">LEAF NODE {idx + 1}</span>
                          <div className="node-keys">
                            {leafNode.keys.map((k) => (
                              <span
                                key={k}
                                className={`key-box ${
                                  isVisited && k === Number(searchTarget)
                                    ? "matched-key"
                                    : ""
                                }`}
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* LINKED LEAVES CHAIN INDICATOR */}
                  <div className="linked-chain-bar">
                    <span>Double-Linked Leaf Node Sequence (Sequential Scanning Supported) &rarr;</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* DYNAMIC INSERTION LOGS & TREE VIEW */
            <div className="vis-section">
              <h2>Dynamic B+ Tree Structure &amp; Insertion Logs</h2>

              <div className="btree-canvas">
                {/* ROOT NODE */}
                <div className="tree-node root-node active-node">
                  <span className="node-label">ROOT NODE</span>
                  <div className="node-keys">
                    {treeState.keys.map((k) => (
                      <span key={k} className="key-box">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="connector-lines">
                  <div className="line-branch">↙</div>
                  <div className="line-branch">↓</div>
                  <div className="line-branch">↘</div>
                </div>

                {/* LEAF NODES LEVEL */}
                <div className="leaf-level">
                  {treeState.children.map((leafNode, idx) => (
                    <div key={idx} className="tree-node leaf-node">
                      <span className="node-label">LEAF {idx + 1}</span>
                      <div className="node-keys">
                        {leafNode.keys.map((k) => (
                          <span key={k} className="key-box">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INSERTION LOGS */}
              {treeLogs.length > 0 && (
                <div className="insertion-log-box">
                  <h3>Insertion Operation Log</h3>
                  {treeLogs.map((log, i) => (
                    <p key={i}>{log}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          ALGORITHM EXPLANATION
      ========================================= */}
      <div className="indexing-explanation">
        <h2>Why Databases Use B+ Tree Indexing</h2>
        <div className="indexing-formula">
          <p>
            <strong>1. Balanced Tree Height ($O(\log N)$):</strong> Ensures search,
            insertion, and deletion operations take logarithmic time regardless of table size.
          </p>
          <p>
            <strong>2. High Fan-out &amp; Low Disk I/O:</strong> Internal nodes hold
            many keys, allowing a 3-level B+ Tree to index millions of records with only 3 disk reads.
          </p>
          <p>
            <strong>3. Leaf Level Pointer Links:</strong> All actual data pointers reside
            at the leaf level. Leaves form a doubly linked list, enabling fast range queries (`WHERE key BETWEEN A AND B`).
          </p>
          <p>
            <strong>4. Node Overflow &amp; Splitting:</strong> When a node reaches capacity,
            it splits evenly and promotes the separator key to the parent node to maintain balance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default IndexingVisualizer;
