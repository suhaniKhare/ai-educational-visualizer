import { useMemo, useState } from "react";
import {
  Binary,
  RotateCcw,
  ArrowDown,
  Code2,
} from "lucide-react";

import "./IntermediateCodeVisualizer.css";

function generateThreeAddressCode(expression) {
  const clean = expression.replace(/\s+/g, "");

  const tokens = clean.match(/[A-Za-z_]\w*|\d+|[+\-*/()]/g);

  if (!tokens) return [];

  const output = [];
  const operators = [];
  let tempCount = 1;

  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  const applyOperator = () => {
    const operator = operators.pop();

    const right = output.pop();
    const left = output.pop();

    const temp = `t${tempCount++}`;

    output.push(temp);

    return {
      temp,
      left,
      operator,
      right,
    };
  };

  const instructions = [];

  for (const token of tokens) {
    if (/^[A-Za-z_]\w*$/.test(token) || /^\d+$/.test(token)) {
      output.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (
        operators.length &&
        operators[operators.length - 1] !== "("
      ) {
        instructions.push(applyOperator());
      }

      operators.pop();
    } else {
      while (
        operators.length &&
        operators[operators.length - 1] !== "(" &&
        precedence[operators[operators.length - 1]] >=
          precedence[token]
      ) {
        instructions.push(applyOperator());
      }

      operators.push(token);
    }
  }

  while (operators.length) {
    instructions.push(applyOperator());
  }

  return instructions;
}

function IntermediateCodeVisualizer() {
  const [expression, setExpression] = useState(
    "a + b * c"
  );

  const [visibleSteps, setVisibleSteps] = useState(0);

  const instructions = useMemo(
    () => generateThreeAddressCode(expression),
    [expression]
  );

  const reset = () => {
    setVisibleSteps(0);
  };

  const nextStep = () => {
    setVisibleSteps((prev) =>
      Math.min(prev + 1, instructions.length)
    );
  };

  return (
    <main className="ir-page">
      <section className="ir-header">
        <span className="ir-label">COMPILER DESIGN</span>

        <h1>
          Intermediate Code <span>Generation</span>
        </h1>

        <p>
          Convert arithmetic expressions into three-address code using
          temporary variables and operator precedence.
        </p>
      </section>

      <div className="ir-layout">
        {/* LEFT */}
        <section className="ir-panel ir-controls">
          <div className="ir-title">
            <Binary size={20} />
            <h2>Expression</h2>
          </div>

          <label>Arithmetic Expression</label>

          <input
            className="ir-input"
            value={expression}
            onChange={(e) => {
              setExpression(e.target.value);
              setVisibleSteps(0);
            }}
            placeholder="a + b * c"
          />

          <div className="ir-presets">
            <span>QUICK EXAMPLES</span>

            <button
              onClick={() => {
                setExpression("a + b * c");
                setVisibleSteps(0);
              }}
            >
              a + b * c
            </button>

            <button
              onClick={() => {
                setExpression("(a + b) * c");
                setVisibleSteps(0);
              }}
            >
              (a + b) * c
            </button>

            <button
              onClick={() => {
                setExpression("a * b + c / d");
                setVisibleSteps(0);
              }}
            >
              a * b + c / d
            </button>
          </div>

          <div className="ir-actions">
            <button
              className="ir-next"
              onClick={nextStep}
              disabled={visibleSteps >= instructions.length}
            >
              <ArrowDown size={16} />
              Generate Next
            </button>

            <button className="ir-reset" onClick={reset}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="ir-info">
            <span>OUTPUT TYPE</span>
            <strong>Three-Address Code</strong>

            <p>
              Each instruction contains at most one operator and produces
              a temporary result.
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="ir-panel ir-visualizer">
          <div className="ir-visualizer-header">
            <div>
              <span>INTERMEDIATE REPRESENTATION</span>
              <h2>Three-Address Code</h2>
            </div>

            <Code2 size={28} />
          </div>

          <div className="ir-expression">
            <span>INPUT</span>

            <strong>{expression}</strong>
          </div>

          <div className="ir-flow">
            <div className="ir-flow-line" />

            {instructions.map((instruction, index) => (
              <div
                key={index}
                className={`ir-instruction ${
                  index < visibleSteps ? "visible" : ""
                } ${index === visibleSteps - 1 ? "current" : ""}`}
              >
                <div className="ir-step-number">
                  {index + 1}
                </div>

                <div className="ir-operation">
                  <span>
                    {instruction.left} {instruction.operator}{" "}
                    {instruction.right}
                  </span>

                  <strong>
                    {instruction.temp} = {instruction.left}{" "}
                    {instruction.operator} {instruction.right}
                  </strong>
                </div>
              </div>
            ))}

            {instructions.length === 0 && (
              <div className="ir-empty">
                Enter a valid arithmetic expression.
              </div>
            )}
          </div>

          <div className="ir-output">
            <span>FINAL RESULT</span>

            {visibleSteps === instructions.length &&
            instructions.length > 0 ? (
              <strong>
                result ={" "}
                {instructions[instructions.length - 1].temp}
              </strong>
            ) : (
              <strong>Processing...</strong>
            )}
          </div>
        </section>
      </div>

      <section className="ir-explanation">
        <span className="ir-label">CONCEPT</span>

        <h2>Three-Address Code</h2>

        <div className="ir-explanation-grid">
          <div>
            <strong>Temporary Variables</strong>
            <p>
              Intermediate results are stored in temporary variables such
              as t1, t2, and t3.
            </p>
          </div>

          <div>
            <strong>Operator Precedence</strong>
            <p>
              Multiplication and division are evaluated before addition and
              subtraction unless parentheses change the order.
            </p>
          </div>

          <div>
            <strong>Simple Instructions</strong>
            <p>
              Each three-address instruction contains a destination and at
              most two operands with one operator.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default IntermediateCodeVisualizer;