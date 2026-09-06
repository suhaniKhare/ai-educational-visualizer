import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Layers,
  RotateCcw,
  Play,
  Pause,
  Network,
} from "lucide-react";

import "./OSIModelVisualizer.css";

const layers = [
  {
    number: 7,
    name: "Application",
    protocol: "HTTP / FTP / DNS",
    data: "Data",
    description:
      "Provides network services directly to applications used by the end user.",
  },
  {
    number: 6,
    name: "Presentation",
    protocol: "SSL / TLS / JPEG",
    data: "Data",
    description:
      "Handles data translation, encryption, decryption, and compression.",
  },
  {
    number: 5,
    name: "Session",
    protocol: "NetBIOS / RPC",
    data: "Data",
    description:
      "Establishes, manages, and terminates communication sessions.",
  },
  {
    number: 4,
    name: "Transport",
    protocol: "TCP / UDP",
    data: "Segment",
    description:
      "Provides end-to-end delivery, segmentation, flow control, and reliability.",
  },
  {
    number: 3,
    name: "Network",
    protocol: "IP / ICMP",
    data: "Packet",
    description:
      "Handles logical addressing and routing packets between networks.",
  },
  {
    number: 2,
    name: "Data Link",
    protocol: "Ethernet / ARP",
    data: "Frame",
    description:
      "Provides node-to-node delivery using MAC addresses and frames.",
  },
  {
    number: 1,
    name: "Physical",
    protocol: "Ethernet / Fiber",
    data: "Bits",
    description:
      "Transmits raw bits through physical media such as cables and radio.",
  },
];

function OSIModelVisualizer() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [direction, setDirection] = useState("encapsulation");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setCurrentLayer((prev) => {
        if (direction === "encapsulation") {
          if (prev >= layers.length - 1) {
            setIsRunning(false);
            return prev;
          }

          return prev + 1;
        }

        if (prev <= 0) {
          setIsRunning(false);
          return prev;
        }

        return prev - 1;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [isRunning, direction]);

  const reset = () => {
    setIsRunning(false);
    setCurrentLayer(direction === "encapsulation" ? 0 : layers.length - 1);
  };

  const nextStep = () => {
    if (direction === "encapsulation") {
      setCurrentLayer((prev) => Math.min(prev + 1, layers.length - 1));
    } else {
      setCurrentLayer((prev) => Math.max(prev - 1, 0));
    }
  };

  const changeDirection = (newDirection) => {
    setIsRunning(false);
    setDirection(newDirection);

    setCurrentLayer(
      newDirection === "encapsulation" ? 0 : layers.length - 1
    );
  };

  const activeLayer = layers[currentLayer];

  return (
    <main className="osi-page">
      <section className="osi-header">
        <span className="osi-label">COMPUTER NETWORKS</span>

        <h1>
          OSI Model <span>Visualizer</span>
        </h1>

        <p>
          Visualize how data travels through the seven layers of the OSI model
          during encapsulation and decapsulation.
        </p>
      </section>

      <div className="osi-layout">
        {/* LEFT PANEL */}
        <section className="osi-panel osi-controls">
          <div className="osi-panel-title">
            <Layers size={20} />
            <h2>OSI Layers</h2>
          </div>

          <div className="osi-layer-list">
            {layers.map((layer, index) => (
              <button
                key={layer.number}
                className={`osi-layer ${
                  index === currentLayer ? "active" : ""
                } ${index < currentLayer ? "visited" : ""}`}
                onClick={() => {
                  setIsRunning(false);
                  setCurrentLayer(index);
                }}
              >
                <span className="osi-layer-number">{layer.number}</span>

                <div>
                  <strong>{layer.name}</strong>
                  <small>{layer.protocol}</small>
                </div>

                {index === currentLayer && (
                  <span className="osi-active-dot" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="osi-panel osi-visualizer">
          <div className="osi-visualizer-header">
            <div>
              <span className="osi-small-label">CURRENT LAYER</span>

              <h2>
                Layer {activeLayer.number}: {activeLayer.name}
              </h2>
            </div>

            <Network size={28} />
          </div>

          <div className="osi-flow">
            <div className="osi-flow-label">
              {direction === "encapsulation" ? (
                <>
                  <ArrowDown size={18} />
                  Sender — Encapsulation
                </>
              ) : (
                <>
                  <ArrowUp size={18} />
                  Receiver — Decapsulation
                </>
              )}
            </div>

            <div className="osi-stack">
              {layers.map((layer, index) => {
                const isActive = index === currentLayer;

                return (
                  <div
                    key={layer.number}
                    className={`osi-stack-layer ${
                      isActive ? "active" : ""
                    } ${index < currentLayer ? "completed" : ""}`}
                  >
                    <span>Layer {layer.number}</span>

                    <strong>{layer.name}</strong>

                    <small>{layer.data}</small>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="osi-current-card">
            <div className="osi-current-number">
              {activeLayer.number}
            </div>

            <div>
              <span>PROCESSING AT</span>

              <h3>{activeLayer.name} Layer</h3>

              <p>{activeLayer.description}</p>

              <div className="osi-protocol">
                Protocols: <strong>{activeLayer.protocol}</strong>
              </div>
            </div>
          </div>

          <div className="osi-controls-row">
            <button
              className={`osi-direction-btn ${
                direction === "encapsulation" ? "selected" : ""
              }`}
              onClick={() => changeDirection("encapsulation")}
            >
              <ArrowDown size={17} />
              Encapsulation
            </button>

            <button
              className={`osi-direction-btn ${
                direction === "decapsulation" ? "selected" : ""
              }`}
              onClick={() => changeDirection("decapsulation")}
            >
              <ArrowUp size={17} />
              Decapsulation
            </button>
          </div>

          <div className="osi-action-buttons">
            <button
              className="osi-primary-btn"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? <Pause size={17} /> : <Play size={17} />}

              {isRunning ? "Pause" : "Start"}
            </button>

            <button className="osi-next-btn" onClick={nextStep}>
              Next Step
            </button>

            <button className="osi-reset-btn" onClick={reset}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </section>
      </div>

      {/* EXPLANATION */}
      <section className="osi-explanation">
        <span className="osi-small-label">CONCEPT</span>

        <h2>How the OSI Model Works</h2>

        <div className="osi-explanation-grid">
          <div>
            <strong>Encapsulation</strong>
            <p>
              At the sender side, application data moves from Layer 7 down to
              Layer 1. Each layer adds its own information before the data is
              transmitted.
            </p>
          </div>

          <div>
            <strong>Decapsulation</strong>
            <p>
              At the receiver side, data moves from Layer 1 upward. Each layer
              removes and processes the information added by the corresponding
              sender layer.
            </p>
          </div>

          <div>
            <strong>Data Units</strong>
            <p>
              Layers 5–7 generally work with data, Layer 4 uses segments,
              Layer 3 uses packets, Layer 2 uses frames, and Layer 1 transmits
              bits.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OSIModelVisualizer;