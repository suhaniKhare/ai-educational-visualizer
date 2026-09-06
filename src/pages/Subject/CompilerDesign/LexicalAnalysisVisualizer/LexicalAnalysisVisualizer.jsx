import { useEffect, useMemo, useState } from "react";
import {
  Code2,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import "./LexicalAnalysisVisualizer.css";

const KEYWORDS = new Set([
  "int",
  "float",
  "double",
  "char",
  "if",
  "else",
  "for",
  "while",
  "return",
  "void",
  "class",
  "public",
  "private",
  "static",
  "new",
]);

const OPERATORS = new Set([
  "+",
  "-",
  "*",
  "/",
  "%",
  "=",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "&&",
  "||",
  "++",
  "--",
]);

const SYMBOLS = new Set([
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  ";",
  ",",
  ".",
]);

function tokenize(code) {
  const regex =
    /\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\d+(?:\.\d+)?|==|!=|<=|>=|&&|\|\||\+\+|--|[A-Za-z_][A-Za-z0-9_]*|[+\-*/%=<>()[\]{};,\.]/g;

  const matches = code.match(regex) || [];

  return matches.map((value, index) => {
    let type = "Unknown";

    if (KEYWORDS.has(value)) {
      type = "Keyword";
    } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
      type = "Identifier";
    } else if (/^\d+(\.\d+)?$/.test(value)) {
      type = "Literal";
    } else if (
      /^".*"$/.test(value) ||
      /^'.*'$/.test(value)
    ) {
      type = "Literal";
    } else if (OPERATORS.has(value)) {
      type = "Operator";
    } else if (SYMBOLS.has(value)) {
      type = "Symbol";
    } else if (value.startsWith("//") || value.startsWith("/*")) {
      type = "Comment";
    }

    return {
      id: index,
      value,
      type,
    };
  });
}

function LexicalAnalysisVisualizer() {
  const [code, setCode] = useState(
    "int sum = a + 10;"
  );

  const [currentToken, setCurrentToken] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const tokens = useMemo(() => tokenize(code), [code]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setCurrentToken((prev) => {
        if (prev >= tokens.length - 1) {
          setIsRunning(false);
          return prev;
        }

        return prev + 1;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [isRunning, tokens.length]);

  const reset = () => {
    setIsRunning(false);
    setCurrentToken(-1);
  };

  const nextToken = () => {
    setCurrentToken((prev) =>
      Math.min(prev + 1, tokens.length - 1)
    );
  };

  const activeToken =
    currentToken >= 0 ? tokens[currentToken] : null;

  return (
    <main className="lex-page">
      <section className="lex-header">
        <span className="lex-label">COMPILER DESIGN</span>

        <h1>
          Lexical Analysis <span>Visualizer</span>
        </h1>

        <p>
          Watch how source code is scanned and converted into a stream
          of tokens before reaching the parser.
        </p>
      </section>

      <div className="lex-layout">
        {/* LEFT */}
        <section className="lex-panel lex-controls">
          <div className="lex-title">
            <Code2 size={20} />
            <h2>Source Code</h2>
          </div>

          <textarea
            className="lex-editor"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCurrentToken(-1);
              setIsRunning(false);
            }}
            spellCheck="false"
          />

          <div className="lex-actions">
            <button
              className="lex-primary"
              onClick={() => setIsRunning((prev) => !prev)}
              disabled={!tokens.length}
            >
              {isRunning ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}

              {isRunning ? "Pause" : "Start"}
            </button>

            <button
              className="lex-next"
              onClick={nextToken}
              disabled={!tokens.length}
            >
              Next Token
            </button>

            <button className="lex-reset" onClick={reset}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="lex-progress">
            <div className="lex-progress-top">
              <span>SCANNING PROGRESS</span>

              <strong>
                {Math.max(currentToken + 1, 0)} / {tokens.length}
              </strong>
            </div>

            <div className="lex-progress-bar">
              <span
                style={{
                  width: `${
                    tokens.length
                      ? ((currentToken + 1) / tokens.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="lex-panel lex-visualizer">
          <div className="lex-visualizer-header">
            <div>
              <span>TOKEN STREAM</span>
              <h2>Lexical Scanner</h2>
            </div>

            {activeToken && (
              <div className="lex-active-badge">
                <CheckCircle2 size={16} />
                {activeToken.type}
              </div>
            )}
          </div>

          <div className="lex-source-preview">
            {tokens.map((token, index) => (
              <span
                key={token.id}
                className={`lex-source-token ${
                  index === currentToken ? "active" : ""
                } ${index < currentToken ? "processed" : ""}`}
              >
                {token.value}
              </span>
            ))}
          </div>

          <div className="lex-arrow">
            <ArrowRight size={22} />
            <span>LEXICAL ANALYZER</span>
            <ArrowRight size={22} />
          </div>

          <div className="lex-token-table">
            <div className="lex-table-head">
              <span>#</span>
              <span>Lexeme</span>
              <span>Token Type</span>
            </div>

            {tokens.map((token, index) => (
              <div
                key={token.id}
                className={`lex-table-row ${
                  index === currentToken ? "active" : ""
                }`}
              >
                <span>{index + 1}</span>

                <code>{token.value}</code>

                <span className={`lex-type ${token.type.toLowerCase()}`}>
                  {token.type}
                </span>
              </div>
            ))}
          </div>

          {activeToken && (
            <div className="lex-current-card">
              <div className="lex-current-number">
                {currentToken + 1}
              </div>

              <div>
                <span>CURRENT LEXEME</span>
                <h3>{activeToken.value}</h3>
                <p>
                  Classified as a{" "}
                  <strong>{activeToken.type}</strong>.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="lex-explanation">
        <span className="lex-label">CONCEPT</span>

        <h2>What Does the Lexical Analyzer Do?</h2>

        <div className="lex-explanation-grid">
          <div>
            <strong>1. Scanning</strong>
            <p>
              The lexical analyzer reads the source program character by
              character and groups characters into meaningful sequences.
            </p>
          </div>

          <div>
            <strong>2. Tokenization</strong>
            <p>
              Each lexeme is classified as a keyword, identifier, literal,
              operator, symbol, or another token category.
            </p>
          </div>

          <div>
            <strong>3. Token Stream</strong>
            <p>
              The generated tokens are passed to the syntax analyzer for
              parsing and grammatical validation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LexicalAnalysisVisualizer;