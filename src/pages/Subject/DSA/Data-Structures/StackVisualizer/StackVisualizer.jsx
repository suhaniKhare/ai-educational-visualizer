import { useState } from "react";
import { ArrowLeft, RotateCcw, Plus, Minus, Eye } from "lucide-react";
import "./StackVisualizer.css";

const MAX_SIZE = 7;
const INITIAL_STACK = [10, 20, 30];

function StackVisualizer() {
  const [stack, setStack] = useState(INITIAL_STACK);
  const [value, setValue] = useState("");
  const [operation, setOperation] = useState("push");
  const [status, setStatus] = useState(
    "Choose an operation to visualize Stack."
  );
  const [highlight, setHighlight] = useState(-1);
  const [step, setStep] = useState(0);

  const reset = () => {
    setStack(INITIAL_STACK);
    setValue("");
    setHighlight(-1);
    setStep(0);
    setStatus("Stack reset to its initial state.");
  };

  const pushElement = () => {
    if (stack.length >= MAX_SIZE) {
      setStatus("Stack Overflow! The stack is full.");
      return;
    }

    const num = Number(value);

    if (Number.isNaN(num)) {
      setStatus("Enter a valid value to push.");
      return;
    }

    const updatedStack = [...stack, num];

    setStack(updatedStack);
    setHighlight(updatedStack.length - 1);
    setValue("");
    setStep((prev) => prev + 1);
    setStatus(`Pushed ${num} onto the stack.`);
  };

  const popElement = () => {
    if (stack.length === 0) {
      setStatus("Stack Underflow! There is nothing to pop.");
      return;
    }

    const removed = stack[stack.length - 1];

    setHighlight(stack.length - 1);

    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
      setHighlight(-1);
    }, 250);

    setStep((prev) => prev + 1);
    setStatus(`Popped ${removed} from the stack.`);
  };

  const peekElement = () => {
    if (stack.length === 0) {
      setStatus("Stack is empty. Nothing to peek.");
      return;
    }

    const topIndex = stack.length - 1;

    setHighlight(topIndex);
    setStep((prev) => prev + 1);

    setStatus(`TOP element is ${stack[topIndex]}.`);
  };

  const handleAction = () => {
    if (operation === "push") {
      pushElement();
    }

    if (operation === "pop") {
      popElement();
    }

    if (operation === "peek") {
      peekElement();
    }
  };

  return (
    <div className="ds-page stack-page">
      <button
        className="back-button"
        onClick={() => (window.location.href = "/subject/data-structures")}
      >
        <ArrowLeft size={18} />
        Back to Data Structures
      </button>

      <div className="ds-header">
        <span className="ds-label">LINEAR DATA STRUCTURE</span>

        <h1>Stack Visualizer</h1>

        <p>
          Understand the LIFO principle by visualizing push, pop, and peek
          operations on a stack.
        </p>
      </div>

      <div className="stack-layout">
        {/* Controls */}
        <aside className="control-panel">
          <div className="panel-title">Stack Controls</div>

          <label>Operation</label>

          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              setHighlight(-1);
              setStatus("Operation changed.");
            }}
          >
            <option value="push">Push</option>
            <option value="pop">Pop</option>
            <option value="peek">Peek</option>
          </select>

          {operation === "push" && (
            <>
              <label>Value</label>

              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    pushElement();
                  }
                }}
              />
            </>
          )}

          <button className="primary-action" onClick={handleAction}>
            {operation === "push" && <Plus size={17} />}
            {operation === "pop" && <Minus size={17} />}
            {operation === "peek" && <Eye size={17} />}

            {operation === "push" && "Push Element"}
            {operation === "pop" && "Pop Element"}
            {operation === "peek" && "Peek Top"}
          </button>

          <button className="secondary-action" onClick={reset}>
            <RotateCcw size={17} />
            Reset
          </button>

          <div className="stack-info">
            <div>
              <span>Size</span>
              <strong>
                {stack.length}/{MAX_SIZE}
              </strong>
            </div>

            <div>
              <span>TOP</span>
              <strong>
                {stack.length > 0 ? stack[stack.length - 1] : "—"}
              </strong>
            </div>
          </div>

          <div className="lifo-card">
            <span>PRINCIPLE</span>
            <strong>LIFO</strong>
            <p>Last In, First Out</p>
          </div>
        </aside>

        {/* Visualization */}
        <main className="visualization-panel">
          <div className="visualization-heading">
            <div>
              <span className="mini-label">VISUALIZATION</span>
              <h2>Stack Memory</h2>
            </div>

            <div className="stack-size">
              Capacity: <strong>{MAX_SIZE}</strong>
            </div>
          </div>

          <div className="stack-visual-area">
            <div className="top-indicator">
              <span>TOP</span>
              <div className="top-arrow">↓</div>
            </div>

            <div className="stack-container">
              {Array.from({ length: MAX_SIZE }).map((_, reverseIndex) => {
                const actualIndex = MAX_SIZE - 1 - reverseIndex;
                const valueAtIndex = stack[actualIndex];
                const isFilled = actualIndex < stack.length;
                const isHighlighted = actualIndex === highlight;

                return (
                  <div
                    className={`stack-slot ${
                      isFilled ? "filled-stack-slot" : "empty-stack-slot"
                    } ${isHighlighted ? "highlight-stack-slot" : ""}`}
                    key={actualIndex}
                  >
                    <span className="stack-index">
                      {actualIndex}
                    </span>

                    <div className="stack-value">
                      {isFilled ? valueAtIndex : ""}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bottom-label">BOTTOM</div>
          </div>

          <div className="status-box">
            <div className="status-icon">
              {operation === "push" && <Plus size={18} />}
              {operation === "pop" && <Minus size={18} />}
              {operation === "peek" && <Eye size={18} />}
            </div>

            <div>
              <span>Current Operation</span>
              <p>{status}</p>
            </div>
          </div>

          <div className="concept-card">
            <h3>How Stack works</h3>

            <p>
              A stack follows the <strong>LIFO</strong> principle. The last
              element inserted is the first element removed. Both insertion
              and deletion happen only at the TOP of the stack.
            </p>

            <div className="stack-complexity">
              <div>
                <span>Push</span>
                <strong>O(1)</strong>
              </div>

              <div>
                <span>Pop</span>
                <strong>O(1)</strong>
              </div>

              <div>
                <span>Peek</span>
                <strong>O(1)</strong>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StackVisualizer;