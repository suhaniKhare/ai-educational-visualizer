import { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Plus,
  Minus,
  Eye,
  RefreshCw,
} from "lucide-react";
import "./QueueVisualizer.css";

const MAX_SIZE = 7;
const INITIAL_QUEUE = [10, 20, 30];

function QueueVisualizer() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [value, setValue] = useState("");
  const [operation, setOperation] = useState("enqueue");
  const [queueType, setQueueType] = useState("linear");
  const [highlight, setHighlight] = useState(-1);
  const [status, setStatus] = useState(
    "Choose an operation to visualize Queue."
  );
  const [step, setStep] = useState(0);

  const reset = () => {
    setQueue(INITIAL_QUEUE);
    setValue("");
    setHighlight(-1);
    setStep(0);
    setStatus("Queue reset to its initial state.");
  };

  const enqueue = () => {
    if (queue.length >= MAX_SIZE) {
      setStatus("Queue Overflow! The queue is full.");
      return;
    }

    const num = Number(value);

    if (Number.isNaN(num)) {
      setStatus("Enter a valid value to enqueue.");
      return;
    }

    const updated = [...queue, num];

    setQueue(updated);
    setHighlight(updated.length - 1);
    setValue("");
    setStep((prev) => prev + 1);
    setStatus(`Enqueued ${num} at the REAR of the queue.`);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setStatus("Queue Underflow! There is nothing to dequeue.");
      return;
    }

    const removed = queue[0];

    setHighlight(0);

    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      setHighlight(-1);
    }, 250);

    setStep((prev) => prev + 1);
    setStatus(`Dequeued ${removed} from the FRONT of the queue.`);
  };

  const peek = () => {
    if (queue.length === 0) {
      setStatus("Queue is empty. Nothing to peek.");
      return;
    }

    setHighlight(0);
    setStep((prev) => prev + 1);
    setStatus(`FRONT element is ${queue[0]}.`);
  };

  const handleAction = () => {
    if (operation === "enqueue") {
      enqueue();
    }

    if (operation === "dequeue") {
      dequeue();
    }

    if (operation === "peek") {
      peek();
    }
  };

  return (
    <div className="ds-page queue-page">
      <button
        className="back-button"
        onClick={() => (window.location.href = "/subject/data-structures")}
      >
        <ArrowLeft size={18} />
        Back to Data Structures
      </button>

      <div className="ds-header">
        <span className="ds-label">LINEAR DATA STRUCTURE</span>

        <h1>Queue Visualizer</h1>

        <p>
          Understand the FIFO principle through enqueue, dequeue, peek, and
          circular queue visualization.
        </p>
      </div>

      <div className="queue-layout">
        {/* Controls */}
        <aside className="control-panel">
          <div className="panel-title">Queue Controls</div>

          <label>Queue Type</label>

          <div className="queue-type-tabs">
            <button
              className={queueType === "linear" ? "active" : ""}
              onClick={() => {
                setQueueType("linear");
                setHighlight(-1);
                setStatus("Linear Queue selected.");
              }}
            >
              Linear
            </button>

            <button
              className={queueType === "circular" ? "active" : ""}
              onClick={() => {
                setQueueType("circular");
                setHighlight(-1);
                setStatus("Circular Queue selected.");
              }}
            >
              Circular
            </button>
          </div>

          <label>Operation</label>

          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              setHighlight(-1);
              setStatus("Operation changed.");
            }}
          >
            <option value="enqueue">Enqueue</option>
            <option value="dequeue">Dequeue</option>
            <option value="peek">Peek Front</option>
          </select>

          {operation === "enqueue" && (
            <>
              <label>Value</label>

              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    enqueue();
                  }
                }}
              />
            </>
          )}

          <button className="primary-action" onClick={handleAction}>
            {operation === "enqueue" && <Plus size={17} />}
            {operation === "dequeue" && <Minus size={17} />}
            {operation === "peek" && <Eye size={17} />}

            {operation === "enqueue" && "Enqueue"}
            {operation === "dequeue" && "Dequeue"}
            {operation === "peek" && "Peek Front"}
          </button>

          <button className="secondary-action" onClick={reset}>
            <RotateCcw size={17} />
            Reset
          </button>

          <div className="queue-info">
            <div>
              <span>Size</span>
              <strong>
                {queue.length}/{MAX_SIZE}
              </strong>
            </div>

            <div>
              <span>FRONT</span>
              <strong>
                {queue.length ? queue[0] : "—"}
              </strong>
            </div>

            <div>
              <span>REAR</span>
              <strong>
                {queue.length ? queue[queue.length - 1] : "—"}
              </strong>
            </div>
          </div>
        </aside>

        {/* Visualization */}
        <main className="visualization-panel">
          <div className="visualization-heading">
            <div>
              <span className="mini-label">VISUALIZATION</span>

              <h2>
                {queueType === "linear"
                  ? "Linear Queue"
                  : "Circular Queue"}
              </h2>
            </div>

            <div className="queue-capacity">
              Capacity: <strong>{MAX_SIZE}</strong>
            </div>
          </div>

          <div
            className={`queue-visual-area ${
              queueType === "circular" ? "circular-mode" : ""
            }`}
          >
            {queueType === "linear" ? (
              <>
                <div className="queue-end-labels">
                  <div>
                    <span>FRONT</span>
                    <b>↓</b>
                  </div>

                  <div>
                    <span>REAR</span>
                    <b>↓</b>
                  </div>
                </div>

                <div className="queue-container">
                  {Array.from({ length: MAX_SIZE }).map((_, index) => {
                    const isFilled = index < queue.length;
                    const isHighlighted = index === highlight;

                    return (
                      <div
                        className={`queue-slot ${
                          isFilled ? "filled-queue-slot" : ""
                        } ${
                          isHighlighted ? "highlight-queue-slot" : ""
                        }`}
                        key={index}
                      >
                        <span className="queue-index">{index}</span>

                        <div className="queue-value">
                          {isFilled ? queue[index] : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="queue-direction">
                  <span>DEQUEUE</span>
                  <div>←</div>

                  <div className="queue-arrow-line" />

                  <div>→</div>
                  <span>ENQUEUE</span>
                </div>
              </>
            ) : (
              <div className="circular-queue-wrapper">
                <div className="circular-ring">
                  {Array.from({ length: MAX_SIZE }).map((_, index) => {
                    const angle =
                      (index / MAX_SIZE) * 360 - 90;

                    const radius = 150;

                    const x =
                      Math.cos((angle * Math.PI) / 180) * radius;

                    const y =
                      Math.sin((angle * Math.PI) / 180) * radius;

                    const isFilled = index < queue.length;
                    const isHighlighted = index === highlight;

                    return (
                      <div
                        key={index}
                        className={`circular-slot ${
                          isFilled ? "filled-circular-slot" : ""
                        } ${
                          isHighlighted
                            ? "highlight-circular-slot"
                            : ""
                        }`}
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                      >
                        <span>{index}</span>
                        <strong>
                          {isFilled ? queue[index] : ""}
                        </strong>
                      </div>
                    );
                  })}

                  <div className="circular-center">
                    <RefreshCw size={28} />
                    <span>FIFO</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="status-box">
            <div className="status-icon">
              {operation === "enqueue" && <Plus size={18} />}
              {operation === "dequeue" && <Minus size={18} />}
              {operation === "peek" && <Eye size={18} />}
            </div>

            <div>
              <span>Current Operation</span>
              <p>{status}</p>
            </div>
          </div>

          <div className="concept-card">
            <h3>How Queue works</h3>

            <p>
              A queue follows the <strong>FIFO</strong> principle —
              First In, First Out. New elements enter from the REAR while
              elements are removed from the FRONT.
            </p>

            <div className="queue-complexity">
              <div>
                <span>Enqueue</span>
                <strong>O(1)</strong>
              </div>

              <div>
                <span>Dequeue</span>
                <strong>O(1)</strong>
              </div>

              <div>
                <span>Peek</span>
                <strong>O(1)</strong>
              </div>
            </div>

            {queueType === "circular" && (
              <div className="circular-note">
                <RefreshCw size={15} />
                Circular queues reuse empty positions by wrapping the REAR
                back to the beginning of the array.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default QueueVisualizer;