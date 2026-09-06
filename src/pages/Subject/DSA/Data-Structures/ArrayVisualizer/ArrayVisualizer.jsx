import { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Play,
  Search,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react";
import "./ArrayVisualizer.css";

const DEFAULT_ARRAY = [10, 20, 30, 40, 50, 60];

function ArrayVisualizer() {
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [operation, setOperation] = useState("traverse");
  const [input, setInput] = useState("");
  const [index, setIndex] = useState("");
  const [current, setCurrent] = useState(-1);
  const [status, setStatus] = useState(
    "Choose an operation and start visualization."
  );
  const [step, setStep] = useState(0);

  const reset = () => {
    setArray(DEFAULT_ARRAY);
    setCurrent(-1);
    setStep(0);
    setStatus("Array reset to its initial state.");
    setInput("");
    setIndex("");
  };

  const traverse = () => {
    if (current + 1 >= array.length) {
      setCurrent(-1);
      setStatus("Traversal completed.");
      return;
    }

    const next = current + 1;

    setCurrent(next);
    setStep((prev) => prev + 1);
    setStatus(`Visiting index ${next} → value ${array[next]}`);
  };

  const linearSearch = () => {
    const target = Number(input);

    if (Number.isNaN(target)) {
      setStatus("Enter a valid target value.");
      return;
    }

    let next = current + 1;

    while (next < array.length && array[next] !== target) {
      next++;
    }

    if (next < array.length) {
      setCurrent(next);
      setStatus(`Found ${target} at index ${next}.`);
    } else {
      setCurrent(-1);
      setStatus(`${target} was not found in the array.`);
    }

    setStep((prev) => prev + 1);
  };

  const binarySearch = () => {
    const target = Number(input);

    if (Number.isNaN(target)) {
      setStatus("Enter a valid target value.");
      return;
    }

    let low = 0;
    let high = array.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      setCurrent(mid);

      if (array[mid] === target) {
        setStatus(`Binary Search: ${target} found at index ${mid}.`);
        setStep((prev) => prev + 1);
        return;
      }

      if (array[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    setCurrent(-1);
    setStatus(`${target} was not found using Binary Search.`);
    setStep((prev) => prev + 1);
  };

  const insertElement = () => {
    const value = Number(input);
    const position = Number(index);

    if (Number.isNaN(value)) {
      setStatus("Enter a valid value.");
      return;
    }

    if (
      Number.isNaN(position) ||
      position < 0 ||
      position > array.length
    ) {
      setStatus(`Index must be between 0 and ${array.length}.`);
      return;
    }

    const newArray = [...array];
    newArray.splice(position, 0, value);

    setArray(newArray);
    setCurrent(position);
    setStatus(`Inserted ${value} at index ${position}.`);
    setStep((prev) => prev + 1);
  };

  const deleteElement = () => {
    const position = Number(index);

    if (
      Number.isNaN(position) ||
      position < 0 ||
      position >= array.length
    ) {
      setStatus(`Index must be between 0 and ${array.length - 1}.`);
      return;
    }

    const deleted = array[position];
    const newArray = array.filter((_, i) => i !== position);

    setArray(newArray);
    setCurrent(-1);
    setStatus(`Deleted ${deleted} from index ${position}.`);
    setStep((prev) => prev + 1);
  };

  const handleAction = () => {
    if (operation === "traverse") traverse();
    if (operation === "linear-search") linearSearch();
    if (operation === "binary-search") binarySearch();
    if (operation === "insert") insertElement();
    if (operation === "delete") deleteElement();
  };

  return (
    <div className="ds-page">
      <button
        className="back-button"
        onClick={() => (window.location.href = "/subject/data-structures")}
      >
        <ArrowLeft size={18} />
        Back to Data Structures
      </button>

      <div className="ds-header">
        <span className="ds-label">LINEAR DATA STRUCTURE</span>

        <h1>Array Visualizer</h1>

        <p>
          Understand array operations by watching elements move and
          algorithms execute step by step.
        </p>
      </div>

      <div className="array-layout">
        <aside className="control-panel">
          <div className="panel-title">Controls</div>

          <label>Operation</label>

          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              setCurrent(-1);
              setStatus("Operation changed.");
            }}
          >
            <option value="traverse">Traversal</option>
            <option value="insert">Insert</option>
            <option value="delete">Delete</option>
            <option value="linear-search">Linear Search</option>
            <option value="binary-search">Binary Search</option>
          </select>

          {(operation === "insert" ||
            operation === "linear-search" ||
            operation === "binary-search") && (
            <>
              <label>Value / Target</label>

              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter value"
              />
            </>
          )}

          {(operation === "insert" || operation === "delete") && (
            <>
              <label>Index</label>

              <input
                type="number"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                placeholder="Enter index"
              />
            </>
          )}

          <button className="primary-action" onClick={handleAction}>
            <Play size={17} />
            {operation === "traverse" ? "Next Step" : "Run Operation"}
          </button>

          <button className="secondary-action" onClick={reset}>
            <RotateCcw size={17} />
            Reset
          </button>

          <div className="operation-info">
            <div>
              <span>Current Index</span>
              <strong>{current === -1 ? "—" : current}</strong>
            </div>

            <div>
              <span>Steps</span>
              <strong>{step}</strong>
            </div>
          </div>
        </aside>

        <main className="visualization-panel">
          <div className="visualization-heading">
            <div>
              <span className="mini-label">VISUALIZATION</span>
              <h2>Array Memory</h2>
            </div>

            <div className="array-size">
              Size: <strong>{array.length}</strong>
            </div>
          </div>

          <div className="array-container">
            {array.map((value, i) => (
              <div className="array-item-wrapper" key={`${value}-${i}`}>
                <div
                  className={`array-cell ${
                    i === current ? "active-cell" : ""
                  }`}
                >
                  {value}
                </div>

                <span className="array-index">[{i}]</span>
              </div>
            ))}
          </div>

          <div className="status-box">
            <div className="status-icon">
              {operation === "insert" ? (
                <Plus size={18} />
              ) : operation === "delete" ? (
                <Trash2 size={18} />
              ) : operation.includes("search") ? (
                <Search size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </div>

            <div>
              <span>Current Step</span>
              <p>{status}</p>
            </div>
          </div>

          <div className="concept-card">
            <h3>How it works</h3>

            {operation === "traverse" && (
              <p>
                Traversal visits every element sequentially from index 0 to
                the last index. Each step moves the pointer to the next
                element.
              </p>
            )}

            {operation === "insert" && (
              <p>
                Insertion at a particular index requires elements after that
                position to shift one place to the right.
              </p>
            )}

            {operation === "delete" && (
              <p>
                When an element is deleted, the elements after it shift one
                position to the left to fill the empty space.
              </p>
            )}

            {operation === "linear-search" && (
              <p>
                Linear Search checks elements one by one until the target is
                found or the array ends.
              </p>
            )}

            {operation === "binary-search" && (
              <p>
                Binary Search repeatedly divides a sorted array into halves,
                reducing the search space by half at every step.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ArrayVisualizer;