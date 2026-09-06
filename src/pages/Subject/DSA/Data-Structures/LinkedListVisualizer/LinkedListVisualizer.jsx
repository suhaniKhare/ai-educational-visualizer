import { useState } from "react";
import { ArrowLeft, RotateCcw, Plus, Trash2, Search } from "lucide-react";
import "./LinkedListVisualizer.css";

const INITIAL_NODES = [10, 20, 30, 40];

function LinkedListVisualizer() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");
  const [operation, setOperation] = useState("insert-end");
  const [current, setCurrent] = useState(-1);
  const [status, setStatus] = useState("Choose an operation.");
  const [step, setStep] = useState(0);

  const reset = () => {
    setNodes(INITIAL_NODES);
    setCurrent(-1);
    setStatus("Linked list reset.");
    setStep(0);
    setValue("");
    setPosition("");
  };

  const insertBeginning = () => {
    const num = Number(value);

    if (Number.isNaN(num)) {
      setStatus("Enter a valid value.");
      return;
    }

    setNodes([num, ...nodes]);
    setCurrent(0);
    setStatus(`Inserted ${num} at the beginning.`);
    setStep((s) => s + 1);
  };

  const insertEnd = () => {
    const num = Number(value);

    if (Number.isNaN(num)) {
      setStatus("Enter a valid value.");
      return;
    }

    setNodes([...nodes, num]);
    setCurrent(nodes.length);
    setStatus(`Inserted ${num} at the end.`);
    setStep((s) => s + 1);
  };

  const insertPosition = () => {
    const num = Number(value);
    const pos = Number(position);

    if (Number.isNaN(num)) {
      setStatus("Enter a valid value.");
      return;
    }

    if (Number.isNaN(pos) || pos < 0 || pos > nodes.length) {
      setStatus(`Position must be between 0 and ${nodes.length}.`);
      return;
    }

    const updated = [...nodes];
    updated.splice(pos, 0, num);

    setNodes(updated);
    setCurrent(pos);
    setStatus(`Inserted ${num} at position ${pos}.`);
    setStep((s) => s + 1);
  };

  const deleteNode = () => {
    const pos = Number(position);

    if (Number.isNaN(pos) || pos < 0 || pos >= nodes.length) {
      setStatus(`Position must be between 0 and ${nodes.length - 1}.`);
      return;
    }

    const deleted = nodes[pos];
    setNodes(nodes.filter((_, i) => i !== pos));
    setCurrent(-1);
    setStatus(`Deleted node ${deleted} from position ${pos}.`);
    setStep((s) => s + 1);
  };

  const searchNode = () => {
    const target = Number(value);

    if (Number.isNaN(target)) {
      setStatus("Enter a value to search.");
      return;
    }

    const found = nodes.indexOf(target);

    if (found === -1) {
      setCurrent(-1);
      setStatus(`${target} was not found.`);
    } else {
      setCurrent(found);
      setStatus(`Found ${target} at position ${found}.`);
    }

    setStep((s) => s + 1);
  };

  const traverse = () => {
    const next = current + 1;

    if (next >= nodes.length) {
      setCurrent(-1);
      setStatus("Traversal completed.");
      return;
    }

    setCurrent(next);
    setStatus(`Pointer is visiting node ${nodes[next]}.`);
    setStep((s) => s + 1);
  };

  const handleAction = () => {
    if (operation === "insert-beginning") insertBeginning();
    if (operation === "insert-end") insertEnd();
    if (operation === "insert-position") insertPosition();
    if (operation === "delete") deleteNode();
    if (operation === "search") searchNode();
    if (operation === "traverse") traverse();
  };

  return (
    <div className="ds-page linked-page">
      <button
        className="back-button"
        onClick={() => (window.location.href = "/subject/data-structures")}
      >
        <ArrowLeft size={18} />
        Back to Data Structures
      </button>

      <div className="ds-header">
        <span className="ds-label">LINEAR DATA STRUCTURE</span>
        <h1>Linked List Visualizer</h1>
        <p>
          See how nodes and pointers work together during insertion,
          deletion, traversal, and searching.
        </p>
      </div>

      <div className="linked-layout">
        <aside className="control-panel">
          <div className="panel-title">Controls</div>

          <label>Operation</label>

          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              setCurrent(-1);
            }}
          >
            <option value="insert-end">Insert at End</option>
            <option value="insert-beginning">Insert at Beginning</option>
            <option value="insert-position">Insert at Position</option>
            <option value="delete">Delete</option>
            <option value="search">Search</option>
            <option value="traverse">Traverse</option>
          </select>

          {operation !== "traverse" && (
            <>
              <label>
                {operation === "search" ? "Search Value" : "Node Value"}
              </label>

              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
              />
            </>
          )}

          {(operation === "insert-position" || operation === "delete") && (
            <>
              <label>Position</label>

              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Enter position"
              />
            </>
          )}

          <button className="primary-action" onClick={handleAction}>
            {operation.includes("insert") ? (
              <Plus size={17} />
            ) : operation === "delete" ? (
              <Trash2 size={17} />
            ) : operation === "search" ? (
              <Search size={17} />
            ) : (
              <Plus size={17} />
            )}

            {operation === "traverse" ? "Next Node" : "Run Operation"}
          </button>

          <button className="secondary-action" onClick={reset}>
            <RotateCcw size={17} />
            Reset
          </button>

          <div className="operation-info">
            <div>
              <span>Nodes</span>
              <strong>{nodes.length}</strong>
            </div>

            <div>
              <span>Current</span>
              <strong>{current === -1 ? "—" : current}</strong>
            </div>
          </div>
        </aside>

        <main className="visualization-panel">
          <div className="visualization-heading">
            <div>
              <span className="mini-label">VISUALIZATION</span>
              <h2>Singly Linked List</h2>
            </div>
          </div>

          <div className="linked-canvas">
            <div className="pointer-label">
              HEAD
              <span>↓</span>
            </div>

            <div className="linked-list">
              {nodes.map((node, i) => (
                <div className="linked-node-group" key={`${node}-${i}`}>
                  <div
                    className={`linked-node ${
                      current === i ? "active-node" : ""
                    }`}
                  >
                    <div className="node-data">{node}</div>
                    <div className="node-pointer">•</div>
                  </div>

                  {i < nodes.length - 1 && (
                    <div className="node-arrow">→</div>
                  )}
                </div>
              ))}

              <div className="null-node">NULL</div>
            </div>
          </div>

          <div className="status-box">
            <div className="status-icon">
              <Search size={18} />
            </div>

            <div>
              <span>Current Step</span>
              <p>{status}</p>
            </div>
          </div>

          <div className="concept-card">
            <h3>How Linked List works</h3>
            <p>
              Every node stores data and a pointer/reference to the next
              node. Unlike arrays, linked-list elements do not need
              contiguous memory. Insertion and deletion can be efficient
              because pointers are changed instead of shifting all elements.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LinkedListVisualizer;