import { useEffect, useState } from "react";
import {
  GitBranch,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import "./SyntaxAnalysisVisualizer.css";

const steps = [
  {
    production: "E → T E'",
    explanation: "Start with the expression grammar.",
  },
  {
    production: "T → F T'",
    explanation: "An expression begins with a term.",
  },
  {
    production: "F → ( E )",
    explanation: "The factor can be a parenthesized expression.",
  },
  {
    production: "F → id",
    explanation: "The identifier becomes the basic factor.",
  },
  {
    production: "T' → ε",
    explanation: "No additional multiplication is present.",
  },
  {
    production: "E' → ε",
    explanation: "The expression has been completely derived.",
  },
];

const grammar = [
  "E  → T E'",
  "E' → + T E' | ε",
  "T  → F T'",
  "T' → * F T' | ε",
  "F  → ( E ) | id",
];

function SyntaxAnalysisVisualizer() {
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
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep((prev) =>
      Math.min(prev + 1, steps.length - 1)
    );
  };

  return (
    <main className="syntax-page">
      <section className="syntax-header">
        <span className="syntax-label">COMPILER DESIGN</span>

        <h1>
          Syntax Analysis <span>Visualizer</span>
        </h1>

        <p>
          Follow grammar productions step by step and understand how a
          parser derives a valid expression.
        </p>
      </section>

      <div className="syntax-layout">
        <section className="syntax-panel syntax-controls">
          <div className="syntax-title">
            <GitBranch size={20} />
            <h2>Grammar</h2>
          </div>

          <div className="syntax-grammar">
            {grammar.map((rule, index) => (
              <div key={index}>{rule}</div>
            ))}
          </div>

          <div className="syntax-input-card">
            <span>INPUT STRING</span>
            <strong>id</strong>
          </div>

          <div className="syntax-actions">
            <button
              className="syntax-primary"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}

              {isRunning ? "Pause" : "Start"}
            </button>

            <button
              className="syntax-next"
              onClick={nextStep}
            >
              Next Step
            </button>

            <button
              className="syntax-reset"
              onClick={reset}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </section>

        <section className="syntax-panel syntax-visualizer">
          <div className="syntax-visualizer-header">
            <div>
              <span>PARSE PROCESS</span>
              <h2>Derivation Steps</h2>
            </div>

            <div className="syntax-step-count">
              {currentStep + 1} / {steps.length}
            </div>
          </div>

          <div className="syntax-progress">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`syntax-progress-step ${
                  index <= currentStep ? "active" : ""
                }`}
              >
                <span>
                  {index < currentStep ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    index + 1
                  )}
                </span>

                {index < steps.length - 1 && <i />}
              </div>
            ))}
          </div>

          <div className="syntax-current">
            <span>CURRENT PRODUCTION</span>

            <h3>{steps[currentStep].production}</h3>

            <p>{steps[currentStep].explanation}</p>
          </div>

          <div className="syntax-tree">
            <div className="syntax-node root">E</div>

            <div className="syntax-branch">
              <span />
              <span />
            </div>

            <div className="syntax-children">
              <div
                className={
                  currentStep >= 1
                    ? "syntax-node highlighted"
                    : "syntax-node"
                }
              >
                T
              </div>

              <div
                className={
                  currentStep >= 5
                    ? "syntax-node highlighted"
                    : "syntax-node"
                }
              >
                E'
              </div>
            </div>

            <div className="syntax-branch small">
              <span />
              <span />
            </div>

            <div className="syntax-children">
              <div
                className={
                  currentStep >= 2
                    ? "syntax-node highlighted"
                    : "syntax-node"
                }
              >
                F
              </div>

              <div className="syntax-node muted">
                T'
              </div>
            </div>

            <div className="syntax-leaf-row">
              <div
                className={
                  currentStep >= 3
                    ? "syntax-leaf active"
                    : "syntax-leaf"
                }
              >
                id
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="syntax-explanation">
        <span className="syntax-label">CONCEPT</span>

        <h2>What is Syntax Analysis?</h2>

        <div className="syntax-explanation-grid">
          <div>
            <strong>Grammar</strong>
            <p>
              A context-free grammar defines the valid structure of
              expressions and programs.
            </p>
          </div>

          <div>
            <strong>Parser</strong>
            <p>
              The parser consumes tokens from the lexical analyzer and
              checks whether they follow the grammar.
            </p>
          </div>

          <div>
            <strong>Parse Tree</strong>
            <p>
              A parse tree represents the hierarchical syntactic structure
              produced from the grammar.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SyntaxAnalysisVisualizer;