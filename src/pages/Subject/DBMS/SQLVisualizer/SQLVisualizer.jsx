import { useEffect, useMemo, useState } from "react";
import { initialEmployees } from "../../../../data/dbms/employees";
import "./SQLVisualizer.css";

const PRESET_QUERIES = [
  "SELECT * FROM employees;",
  "SELECT name, salary FROM employees;",
  "SELECT name, salary FROM employees WHERE salary > 50000;",
  "SELECT * FROM employees WHERE department = 'IT';",
  "SELECT department, COUNT(*) FROM employees GROUP BY department;",
];

function SQLVisualizer() {
  const [queryInput, setQueryInput] = useState(PRESET_QUERIES[2]);
  const [activeQuery, setActiveQuery] = useState(PRESET_QUERIES[2]);
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // --------------------------------
  // QUERY PARSER & SIMULATION ENGINE
  // --------------------------------
  const parsedPlan = useMemo(() => {
    const q = activeQuery.trim().replace(/;$/, "");
    const selectMatch = q.match(/SELECT\s+(.+?)\s+FROM\s+employees/i);
    const whereMatch = q.match(/WHERE\s+(.+?)(?:\s+GROUP BY|$)/i);
    const groupMatch = q.match(/GROUP BY\s+(.+)/i);

    const colsRaw = selectMatch ? selectMatch[1].trim() : "*";
    const whereStr = whereMatch ? whereMatch[1].trim() : null;
    const groupStr = groupMatch ? groupMatch[1].trim() : null;

    let condition = null;
    if (whereStr) {
      const condMatch = whereStr.match(/(\w+)\s*(=|>|<|>=|<=|!=)\s*(.+)/);
      if (condMatch) {
        let val = condMatch[3].trim().replace(/^['"]|['"]$/g, "");
        if (!isNaN(val)) val = Number(val);
        condition = {
          col: condMatch[1],
          op: condMatch[2],
          val: val,
          raw: whereStr,
        };
      }
    }

    // Generate Step Sequence
    const steps = [];

    // Step 0: Ready
    steps.push({
      stepNumber: 0,
      title: "Query Initialization",
      operation: "PARSING SQL QUERY",
      description: "Parsing SQL statement into relational algebra execution plan...",
      conditionText: condition ? condition.raw : "None",
      rowsChecked: 0,
      rowsSelected: 0,
      evaluatedRows: [],
      projectedData: null,
    });

    // Step 1: Scan Table
    steps.push({
      stepNumber: 1,
      title: "Full Table Scan",
      operation: "SCANNING TABLE",
      description: "Reading all 5 rows from EMPLOYEES table into memory buffer.",
      conditionText: condition ? condition.raw : "None",
      rowsChecked: initialEmployees.length,
      rowsSelected: initialEmployees.length,
      evaluatedRows: initialEmployees.map((r) => ({ ...r, status: "scanning" })),
      projectedData: null,
    });

    // Step 2: Apply Filter (if WHERE clause exists)
    let filteredRows = [...initialEmployees];
    let evaluatedRows = [];

    if (condition) {
      evaluatedRows = initialEmployees.map((row) => {
        const rowVal = row[condition.col];
        let pass = false;
        if (condition.op === ">") pass = rowVal > condition.val;
        else if (condition.op === "<") pass = rowVal < condition.val;
        else if (condition.op === ">=") pass = rowVal >= condition.val;
        else if (condition.op === "<=") pass = rowVal <= condition.val;
        else if (condition.op === "=") pass = String(rowVal).toLowerCase() === String(condition.val).toLowerCase();
        else if (condition.op === "!=") pass = String(rowVal).toLowerCase() !== String(condition.val).toLowerCase();

        return {
          ...row,
          status: pass ? "passed" : "failed",
          evalNote: `${condition.col} (${rowVal}) ${condition.op} ${condition.val} → ${pass ? "TRUE" : "FALSE"}`,
        };
      });

      filteredRows = evaluatedRows.filter((r) => r.status === "passed");

      steps.push({
        stepNumber: 2,
        title: "Filter Rows (WHERE Clause)",
        operation: "FILTERING ROWS",
        description: `Evaluating condition [ ${condition.raw} ] row by row.`,
        conditionText: condition.raw,
        rowsChecked: initialEmployees.length,
        rowsSelected: filteredRows.length,
        evaluatedRows,
        projectedData: null,
      });
    }

    // Step 3: Projection or Group By
    if (groupStr) {
      const groups = {};
      filteredRows.forEach((row) => {
        const key = row[groupStr] || "Other";
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });

      const groupResult = Object.keys(groups).map((groupKey) => ({
        [groupStr]: groupKey,
        "COUNT(*)": groups[groupKey].length,
      }));

      steps.push({
        stepNumber: steps.length,
        title: "Grouping & Aggregation",
        operation: "GROUP BY & COUNT(*)",
        description: `Grouping matching rows by '${groupStr}' and computing count aggregate.`,
        conditionText: condition ? condition.raw : "None",
        rowsChecked: initialEmployees.length,
        rowsSelected: groupResult.length,
        evaluatedRows: evaluatedRows.length > 0 ? evaluatedRows : filteredRows.map((r) => ({ ...r, status: "passed" })),
        projectedData: groupResult,
      });
    } else {
      let projectedCols = ["id", "name", "department", "salary"];
      if (colsRaw !== "*") {
        projectedCols = colsRaw.split(",").map((c) => c.trim());
      }

      const finalRows = filteredRows.map((row) => {
        const obj = {};
        projectedCols.forEach((col) => {
          if (row[col] !== undefined) obj[col] = row[col];
        });
        return obj;
      });

      steps.push({
        stepNumber: steps.length,
        title: "Projection & Output Selection",
        operation: "SELECT COLUMNS",
        description: `Selecting requested target columns: [ ${projectedCols.join(", ")} ].`,
        conditionText: condition ? condition.raw : "None",
        rowsChecked: initialEmployees.length,
        rowsSelected: finalRows.length,
        evaluatedRows: evaluatedRows.length > 0 ? evaluatedRows : filteredRows.map((r) => ({ ...r, status: "passed" })),
        projectedData: finalRows,
      });
    }

    return {
      colsRaw,
      condition,
      groupStr,
      steps,
    };
  }, [activeQuery]);

  const currentStepObj = parsedPlan.steps[step] || parsedPlan.steps[0];
  const maxSteps = parsedPlan.steps.length - 1;

  // --------------------------------
  // AUTOMATIC ANIMATION
  // --------------------------------
  useEffect(() => {
    if (!isRunning) return;

    if (step >= maxSteps) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, step, maxSteps]);

  // --------------------------------
  // HANDLERS
  // --------------------------------
  const handleStartQuery = () => {
    setActiveQuery(queryInput);
    if (step >= maxSteps) {
      setStep(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleNext = () => {
    setIsRunning(false);
    if (step < maxSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setStep(0);
  };

  const handlePresetClick = (presetStr) => {
    setQueryInput(presetStr);
    setActiveQuery(presetStr);
    setStep(0);
    setIsRunning(false);
  };

  return (
    <div className="sql-page">
      {/* HEADER */}
      <div className="sql-header">
        <span className="sql-label">QUERY PROCESSING SIMULATOR</span>
        <h1>SQL Query Visualizer</h1>
        <p>
          Observe how the relational database engine executes table scans, WHERE
          condition filters, projections, and aggregations step by step.
        </p>
      </div>

      <div className="sql-layout">
        {/* =========================================
            LEFT SIDE - CONTROL PANEL
        ========================================= */}
        <div className="sql-panel">
          <h2>Query Control Center</h2>

          {/* PRESET BUTTONS */}
          <div className="sql-section">
            <h3>Sample Queries</h3>
            <div className="preset-buttons">
              {PRESET_QUERIES.map((pq, idx) => (
                <button
                  key={idx}
                  className={`preset-btn ${queryInput === pq ? "active" : ""}`}
                  onClick={() => handlePresetClick(pq)}
                >
                  {pq}
                </button>
              ))}
            </div>
          </div>

          {/* QUERY EDITOR */}
          <div className="sql-section">
            <h3>SQL Editor</h3>
            <textarea
              className="sql-editor"
              rows={3}
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value);
                setIsRunning(false);
                setStep(0);
              }}
            />
          </div>

          {/* CONTROLS */}
          <div className="sql-buttons">
            {!isRunning ? (
              <button onClick={handleStartQuery}>▶ Start Query</button>
            ) : (
              <button onClick={handlePause}>⏸ Pause</button>
            )}

            <button onClick={handleNext} disabled={step >= maxSteps}>
              Next Step →
            </button>

            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>

          {/* STATUS & STEP INFO */}
          <div className="sql-current-calculation">
            <h3>Current Step Calculation</h3>
            <p>
              <strong>Step:</strong> {step} / {maxSteps} ({currentStepObj.title})
            </p>
            <p>
              <strong>Operation:</strong>{" "}
              <span className="sql-tag">{currentStepObj.operation}</span>
            </p>
            <p>
              <strong>Condition:</strong> {currentStepObj.conditionText}
            </p>
            <p>
              <strong>Rows Checked:</strong> {currentStepObj.rowsChecked}
            </p>
            <p>
              <strong>Rows Selected:</strong> {currentStepObj.rowsSelected}
            </p>
            <p className="sql-step-desc">{currentStepObj.description}</p>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE - DATA PIPELINE VISUALIZER
        ========================================= */}
        <div className="sql-visualizer">
          <h2>Database Processing Pipeline</h2>

          {/* PIPELINE STAGES BAR */}
          <div className="pipeline-steps">
            {parsedPlan.steps.map((st, idx) => (
              <div
                key={idx}
                className={`pipeline-stage ${step >= idx ? "reached" : ""} ${
                  step === idx ? "active" : ""
                }`}
              >
                <span>Stage {idx}</span>
                <strong>{st.title}</strong>
              </div>
            ))}
          </div>

          {/* SOURCE TABLE SCAN DISPLAY */}
          <div className="table-wrapper">
            <h3>Source Table: EMPLOYEES</h3>
            <table className="db-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>department</th>
                  <th>salary</th>
                  {step >= 2 && parsedPlan.condition && <th>WHERE Evaluation</th>}
                </tr>
              </thead>
              <tbody>
                {initialEmployees.map((row) => {
                  const evalRow = currentStepObj.evaluatedRows.find(
                    (r) => r.id === row.id
                  );
                  const status = evalRow ? evalRow.status : "";

                  return (
                    <tr
                      key={row.id}
                      className={`row-state-${status} ${
                        status === "passed" ? "row-highlight-pass" : ""
                      }`}
                    >
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.department}</td>
                      <td>${row.salary.toLocaleString()}</td>
                      {step >= 2 && parsedPlan.condition && (
                        <td className="eval-note">
                          {evalRow?.evalNote || "—"}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* OUTPUT RESULT SET TABLE */}
          {currentStepObj.projectedData && (
            <div className="table-wrapper result-wrapper">
              <h3>
                QueryResult Set ({currentStepObj.projectedData.length} Rows)
              </h3>
              <table className="db-table result-table">
                <thead>
                  <tr>
                    {Object.keys(currentStepObj.projectedData[0] || {}).map(
                      (colKey) => (
                        <th key={colKey}>{colKey}</th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentStepObj.projectedData.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx}>
                          {typeof val === "number" && val > 1000
                            ? `$${val.toLocaleString()}`
                            : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          ALGORITHM EXPLANATION
      ========================================= */}
      <div className="sql-explanation">
        <h2>How Relational Query Processing Works</h2>
        <div className="sql-formula">
          <p>
            <strong>1. Parsing &amp; Syntax Analysis:</strong> The SQL query is
            validated syntactically and parsed into a logical query tree.
          </p>
          <p>
            <strong>2. Full Table Scan (FROM):</strong> The relational engine reads
            the target table records from disk/memory into input buffers.
          </p>
          <p>
            <strong>3. Predicate Evaluation (WHERE):</strong> Each tuple is evaluated
            against conditional boolean predicates to eliminate non-matching records.
          </p>
          <p>
            <strong>4. Grouping &amp; Aggregation (GROUP BY):</strong> Rows are partitioned
            into key buckets, and aggregate functions (COUNT, SUM, AVG) are evaluated.
          </p>
          <p>
            <strong>5. Projection (SELECT):</strong> Unnecessary attributes are pruned,
            returning only requested columns to the client application.
          </p>
          <p>
            <strong>6. Query Optimization:</strong> Real relational DBMS engines use
            indexes and cost models to convert scans into index lookups.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SQLVisualizer;
