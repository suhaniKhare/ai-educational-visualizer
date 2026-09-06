import React, { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Plus,
  GitBranch,
  Play,
} from "lucide-react";
import "./GraphVisualizer.css";

const initialNodes = ["A", "B", "C", "D", "E"];

const initialEdges = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["C", "D"],
  ["C", "E"],
];

const positions = {
  A: { x: 50, y: 18 },
  B: { x: 25, y: 48 },
  C: { x: 75, y: 48 },
  D: { x: 35, y: 80 },
  E: { x: 70, y: 80 },
};

function getNeighbors(node, edges) {
  const neighbors = [];

  edges.forEach(([a, b]) => {
    if (a === node) neighbors.push(b);
    if (b === node) neighbors.push(a);
  });

  return neighbors;
}

function bfs(start, nodes, edges) {
  if (!nodes.includes(start)) return [];

  const visited = new Set();
  const queue = [start];
  const result = [];

  visited.add(start);

  while (queue.length) {
    const current = queue.shift();

    result.push(current);

    getNeighbors(current, edges).forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    });
  }

  return result;
}

function dfs(start, nodes, edges) {
  if (!nodes.includes(start)) return [];

  const visited = new Set();
  const result = [];

  const traverse = (node) => {
    if (visited.has(node)) return;

    visited.add(node);
    result.push(node);

    getNeighbors(node, edges).forEach((neighbor) => {
      traverse(neighbor);
    });
  };

  traverse(start);

  return result;
}

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [nodeInput, setNodeInput] = useState("");
  const [fromNode, setFromNode] = useState("A");
  const [toNode, setToNode] = useState("B");
  const [startNode, setStartNode] = useState("A");

  const [operation, setOperation] = useState("bfs");
  const [visited, setVisited] = useState([]);
  const [result, setResult] = useState([]);

  const [status, setStatus] = useState(
    "Graph ready. Choose BFS or DFS to start traversal."
  );

  const reset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setNodeInput("");
    setFromNode("A");
    setToNode("B");
    setStartNode("A");
    setVisited([]);
    setResult([]);
    setStatus("Graph reset successfully.");
  };

  const addNode = () => {
    const node = nodeInput.trim().toUpperCase();

    if (!node) {
      setStatus("Enter a node name.");
      return;
    }

    if (node.length > 2) {
      setStatus("Keep node name short, e.g. A, B, C.");
      return;
    }

    if (nodes.includes(node)) {
      setStatus(`Node ${node} already exists.`);
      return;
    }

    setNodes((prev) => [...prev, node]);

    if (!fromNode) setFromNode(node);
    if (!toNode) setToNode(node);
    if (!startNode) setStartNode(node);

    setStatus(`Node ${node} added.`);
    setNodeInput("");
  };

  const addEdge = () => {
    if (!fromNode || !toNode) {
      setStatus("Select both nodes.");
      return;
    }

    if (fromNode === toNode) {
      setStatus("Self-loop is not allowed in this visualizer.");
      return;
    }

    const exists = edges.some(
      ([a, b]) =>
        (a === fromNode && b === toNode) ||
        (a === toNode && b === fromNode)
    );

    if (exists) {
      setStatus(`Edge ${fromNode} — ${toNode} already exists.`);
      return;
    }

    setEdges((prev) => [...prev, [fromNode, toNode]]);
    setStatus(`Edge added: ${fromNode} — ${toNode}`);
  };

  const runTraversal = () => {
    if (!startNode) {
      setStatus("Select a starting node.");
      return;
    }

    const traversal =
      operation === "bfs"
        ? bfs(startNode, nodes, edges)
        : dfs(startNode, nodes, edges);

    setResult(traversal);
    setVisited([]);

    traversal.forEach((node, index) => {
      setTimeout(() => {
        setVisited((prev) => [...prev, node]);
      }, index * 600);
    });

    setStatus(
      `${operation.toUpperCase()} started from ${startNode}.`
    );
  };

  const nodePosition = (node, index) => {
    if (positions[node]) return positions[node];

    const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2;

    return {
      x: 50 + Math.cos(angle) * 35,
      y: 50 + Math.sin(angle) * 35,
    };
  };

  return (
    <div className="ds-page graph-page">
      <div className="ds-header">
        <button
          className="back-button"
          onClick={() =>
            (window.location.href = "/subject/data-structures")
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1>Graph Visualizer</h1>
          <p>Build graphs and explore BFS & DFS traversals</p>
        </div>

        <button className="reset-button" onClick={reset}>
          <RotateCcw size={17} />
          Reset
        </button>
      </div>

      <div className="graph-layout">
        <div className="control-panel">
          <h2 className="panel-title">Graph Controls</h2>

          <label className="ds-label">Add Node</label>

          <div className="inline-control">
            <input
              className="ds-input"
              placeholder="A"
              value={nodeInput}
              onChange={(e) => setNodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addNode();
              }}
            />

            <button className="small-action" onClick={addNode}>
              <Plus size={17} />
            </button>
          </div>

          <label className="ds-label">Connect Nodes</label>

          <div className="edge-control">
            <select
              className="ds-select"
              value={fromNode}
              onChange={(e) => setFromNode(e.target.value)}
            >
              {nodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>

            <span>—</span>

            <select
              className="ds-select"
              value={toNode}
              onChange={(e) => setToNode(e.target.value)}
            >
              {nodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
          </div>

          <button className="secondary-action" onClick={addEdge}>
            <GitBranch size={17} />
            Add Edge
          </button>

          <div className="divider" />

          <label className="ds-label">Traversal</label>

          <div className="traversal-tabs">
            <button
              className={operation === "bfs" ? "active-tab" : ""}
              onClick={() => setOperation("bfs")}
            >
              BFS
            </button>

            <button
              className={operation === "dfs" ? "active-tab" : ""}
              onClick={() => setOperation("dfs")}
            >
              DFS
            </button>
          </div>

          <label className="ds-label">Starting Node</label>

          <select
            className="ds-select"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
          >
            {nodes.map((node) => (
              <option key={node} value={node}>
                {node}
              </option>
            ))}
          </select>

          <button className="primary-action" onClick={runTraversal}>
            <Play size={18} />
            Run {operation.toUpperCase()}
          </button>

          <div className="status-box">
            <div className="status-icon">●</div>
            <div>{status}</div>
          </div>

          {result.length > 0 && (
            <div className="graph-result">
              <span>Traversal Order</span>

              <div className="result-values">
                {result.map((node, index) => (
                  <React.Fragment key={`${node}-${index}`}>
                    <span className="result-node">{node}</span>
                    {index !== result.length - 1 && (
                      <span className="result-arrow">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="visualization-panel">
          <div className="visualization-heading">
            <div>
              <span className="mini-label">VISUALIZATION</span>
              <h2>Undirected Graph</h2>
            </div>

            <div className="graph-stats">
              <span>V = {nodes.length}</span>
              <span>E = {edges.length}</span>
            </div>
          </div>

          <div className="graph-canvas">
            <svg className="graph-edges">
              {edges.map(([from, to], index) => {
                const p1 = nodePosition(
                  from,
                  nodes.indexOf(from)
                );
                const p2 = nodePosition(
                  to,
                  nodes.indexOf(to)
                );

                return (
                  <line
                    key={index}
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    className={
                      visited.includes(from) &&
                      visited.includes(to)
                        ? "active-edge"
                        : ""
                    }
                  />
                );
              })}
            </svg>

            {nodes.map((node, index) => {
              const position = nodePosition(node, index);

              return (
                <div
                  key={node}
                  className={`graph-node ${
                    visited.includes(node)
                      ? "visited-graph-node"
                      : ""
                  } ${
                    node === startNode ? "start-graph-node" : ""
                  }`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                >
                  {node}

                  {visited.includes(node) && (
                    <span className="visit-number">
                      {visited.indexOf(node) + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="concept-card">
            <h3>🕸️ Graph Traversal</h3>

            <p>
              <strong>BFS</strong> explores nodes level by level using
              a queue. <strong>DFS</strong> explores as deeply as
              possible before backtracking.
            </p>

            <div className="graph-complexity">
              <div>
                <span>BFS</span>
                <strong>O(V + E)</strong>
              </div>

              <div>
                <span>DFS</span>
                <strong>O(V + E)</strong>
              </div>

              <div>
                <span>Space</span>
                <strong>O(V)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;