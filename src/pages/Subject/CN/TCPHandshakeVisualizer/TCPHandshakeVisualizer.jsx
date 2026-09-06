import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Server,
  Monitor,
  ShieldCheck,
} from "lucide-react";

import "./TCPHandshakeVisualizer.css";

const steps = [
  {
    number: 1,
    title: "SYN",
    from: "Client",
    to: "Server",
    description:
      "The client requests a TCP connection by sending a SYN packet containing its initial sequence number.",
  },
  {
    number: 2,
    title: "SYN + ACK",
    from: "Server",
    to: "Client",
    description:
      "The server acknowledges the client's request and sends its own sequence number using SYN + ACK.",
  },
  {
    number: 3,
    title: "ACK",
    from: "Client",
    to: "Server",
    description:
      "The client acknowledges the server's sequence number. The TCP connection is now established.",
  },
];

function TCPHandshakeVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsRunning(false);
          return prev;
        }

        return prev + 1;
      });
    }, 1300);

    return () => clearInterval(timer);
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const activeStep = steps[currentStep];

  return (
    <main className="tcp-page">
      <section className="tcp-header">
        <span className="tcp-label">COMPUTER NETWORKS</span>

        <h1>
          TCP 3-Way <span>Handshake</span>
        </h1>

        <p>
          Visualize how TCP establishes a reliable connection between a client
          and a server using SYN, SYN-ACK, and ACK.
        </p>
      </section>

      <div className="tcp-layout">
        {/* LEFT */}
        <section className="tcp-panel tcp-controls">
          <div className="tcp-title">
            <ShieldCheck size={20} />
            <h2>Connection Steps</h2>
          </div>

          <div className="tcp-step-list">
            {steps.map((step, index) => (
              <button
                key={step.number}
                className={`tcp-step ${
                  index === currentStep ? "active" : ""
                } ${index < currentStep ? "completed" : ""}`}
                onClick={() => {
                  setIsRunning(false);
                  setCurrentStep(index);
                }}
              >
                <span className="tcp-step-number">
                  {index < currentStep ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    step.number
                  )}
                </span>

                <div>
                  <strong>{step.title}</strong>
                  <small>
                    {step.from} → {step.to}
                  </small>
                </div>
              </button>
            ))}
          </div>

          <div className="tcp-status-card">
            <span>CURRENT STATE</span>

            <strong>
              {currentStep === steps.length - 1
                ? "Connection Established"
                : `Step ${currentStep + 1} of ${steps.length}`}
            </strong>

            <p>{activeStep.description}</p>
          </div>

          <div className="tcp-actions">
            <button
              className="tcp-primary-btn"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? <Pause size={17} /> : <Play size={17} />}
              {isRunning ? "Pause" : "Start"}
            </button>

            <button className="tcp-next-btn" onClick={nextStep}>
              Next Step
            </button>

            <button className="tcp-reset-btn" onClick={reset}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </section>

        {/* RIGHT */}
        <section className="tcp-panel tcp-visualizer">
          <div className="tcp-visualizer-title">
            <div>
              <span>TCP CONNECTION</span>
              <h2>Client ↔ Server</h2>
            </div>

            <div
              className={`tcp-connection-status ${
                currentStep === 2 ? "connected" : ""
              }`}
            >
              <span />
              {currentStep === 2 ? "CONNECTED" : "CONNECTING"}
            </div>
          </div>

          <div className="tcp-network">
            <div className="tcp-endpoint">
              <div className="tcp-icon">
                <Monitor size={30} />
              </div>

              <strong>Client</strong>
              <small>192.168.1.10</small>
            </div>

            <div className="tcp-channel">
              <div className="tcp-line" />

              {steps.map((step, index) => {
                const visible = index <= currentStep;

                return (
                  <div
                    key={step.number}
                    className={`tcp-packet ${
                      visible ? "visible" : ""
                    } ${index === currentStep ? "current" : ""}`}
                  >
                    <span>{step.title}</span>
                    <ArrowRight size={17} />
                  </div>
                );
              })}

              <div className="tcp-channel-label">
                TCP Connection Channel
              </div>
            </div>

            <div className="tcp-endpoint">
              <div className="tcp-icon">
                <Server size={30} />
              </div>

              <strong>Server</strong>
              <small>192.168.1.20</small>
            </div>
          </div>

          <div className="tcp-sequence-box">
            <div>
              <span>CLIENT</span>
              <strong>
                {currentStep >= 0 ? "SEQ = 100" : "—"}
              </strong>
            </div>

            <div>
              <span>SERVER</span>
              <strong>
                {currentStep >= 1 ? "SEQ = 500" : "—"}
              </strong>
            </div>

            <div>
              <span>STATE</span>
              <strong>
                {currentStep === 2
                  ? "ESTABLISHED"
                  : "SYN-SENT"}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <section className="tcp-explanation">
        <span className="tcp-label">CONCEPT</span>

        <h2>Why Three Steps?</h2>

        <div className="tcp-explanation-grid">
          <div>
            <strong>1. SYN</strong>
            <p>
              The client tells the server that it wants to establish a TCP
              connection and sends its initial sequence number.
            </p>
          </div>

          <div>
            <strong>2. SYN + ACK</strong>
            <p>
              The server acknowledges the client's sequence number and sends
              its own sequence number.
            </p>
          </div>

          <div>
            <strong>3. ACK</strong>
            <p>
              The client acknowledges the server. Both sides can now begin
              reliable data transmission.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TCPHandshakeVisualizer;