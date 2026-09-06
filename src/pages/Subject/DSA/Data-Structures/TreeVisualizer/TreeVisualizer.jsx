import React, { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Search,
  Plus,
  List,
} from "lucide-react";
import "./TreeVisualizer.css";

const initialTree = {
  value: 50,
  left: {
    value: 30,
    left: {
      value: 20,
      left: null,
      right: null,
    },
    right: {
      value: 40,
      left: null,
      right: null,
    },
  },
  right: {
    value: 70,
    left: {
      value: 60,
      left: null,
      right: null,
    },
    right: {
      value: 80,
      left: null,
      right: null,
    },
  },
};

function insertNode(root, value) {
  if (!root) {
    return {
      value,
      left: null,
      right: null,
    };
  }

  if (value < root.value) {
    return {
      ...root,
      left: insertNode(root.left, value),
    };
  }

  if (value > root.value) {
    return {
      ...root,
      right: insertNode(root.right, value),
    };
  }

  return root;
}

function searchNode(root, value, path = []) {
  if (!root) return path;

  const newPath = [...path, root.value];

  if (root.value === value) {
    return newPath;
  }

  if (value < root.value) {
    return searchNode(root.left, value, newPath);
  }

  return searchNode(root.right, value, newPath);
}

function inorder(root, result = []) {
  if (!root) return result;

  inorder(root.left, result);
  result.push(root.value);
  inorder(root.right, result);

  return result;
}

function preorder(root, result = []) {
  if (!root) return result;

  result.push(root.value);
  preorder(root.left, result);
  preorder(root.right, result);

  return result;
}

function postorder(root, result = []) {
  if (!root) return result;

  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.value);

  return result;
}

function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();

    result.push(node.value);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}

const TreeNode = ({ node, highlight }) => {
  if (!node) return null;

  return (
    <div className="tree-node-wrapper">
      <div
        className={`tree-node ${
          highlight.includes(node.value) ? "highlight-tree-node" : ""
        }`}
      >
        {node.value}
      </div>

      {(node.left || node.right) && (
        <div className="tree-children">
          <div className="tree-child">
            {node.left ? (
              <>
                <div className="tree-line vertical-line" />
                <TreeNode node={node.left} highlight={highlight} />
              </>
            ) : (
              <div className="empty-child">∅</div>
            )}
          </div>

          <div className="tree-child">
            {node.right ? (
              <>
                <div className="tree-line vertical-line" />
                <TreeNode node={node.right} highlight={highlight} />
              </>
            ) : (
              <div className="empty-child">∅</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TreeVisualizer = () => {
  const [tree, setTree] = useState(initialTree);
  const [value, setValue] = useState("");
  const [operation, setOperation] = useState("insert");
  const [highlight, setHighlight] = useState([]);
  const [result, setResult] = useState([]);
  const [status, setStatus] = useState(
    "BST ready. Choose an operation to visualize."
  );

  const reset = () => {
    setTree(initialTree);
    setValue("");
    setHighlight([]);
    setResult([]);
    setStatus("Tree reset successfully.");
  };

  const insert = () => {
    const num = Number(value);

    if (value === "" || Number.isNaN(num)) {
      setStatus("Please enter a valid number.");
      return;
    }

    if (searchNode(tree, num).at(-1) === num) {
      setStatus(`${num} already exists in the BST.`);
      setHighlight([num]);
      return;
    }

    setTree((prev) => insertNode(prev, num));
    setHighlight([num]);
    setResult([]);
    setStatus(`${num} inserted using BST property.`);

    setValue("");
  };

  const search = () => {
    const num = Number(value);

    if (value === "" || Number.isNaN(num)) {
      setStatus("Please enter a valid number.");
      return;
    }

    const path = searchNode(tree, num);

    setHighlight(path);

    if (path.length > 0 && path[path.length - 1] === num) {
      setStatus(`Found ${num}. Search path: ${path.join(" → ")}`);
    } else {
      setStatus(`Couldn't find ${num}. Search path: ${path.join(" → ")}`);
    }
  };

  const traversal = (type) => {
    let values = [];

    if (type === "inorder") values = inorder(tree);
    if (type === "preorder") values = preorder(tree);
    if (type === "postorder") values = postorder(tree);
    if (type === "levelorder") values = levelOrder(tree);

    setResult(values);
    setHighlight(values);
    setStatus(
      `${type
        .replace("order", " Order")
        .replace(/^./, (c) => c.toUpperCase())}: ${values.join(" → ")}`
    );
  };

  const handleAction = () => {
    if (operation === "insert") insert();
    else if (operation === "search") search();
    else traversal(operation);
  };

  return (
    <div className="ds-page tree-page">
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
          <h1>Tree Visualizer</h1>
          <p>Explore Binary Search Trees and tree traversals</p>
        </div>

        <button className="reset-button" onClick={reset}>
          <RotateCcw size={17} />
          Reset
        </button>
      </div>

      <div className="tree-layout">
        <div className="control-panel tree-control-panel">
          <h2 className="panel-title">BST Operations</h2>

          <label className="ds-label">Operation</label>

          <select
            className="ds-select"
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              setHighlight([]);
              setResult([]);
            }}
          >
            <option value="insert">Insert</option>
            <option value="search">Search</option>
            <option value="inorder">Inorder Traversal</option>
            <option value="preorder">Preorder Traversal</option>
            <option value="postorder">Postorder Traversal</option>
            <option value="levelorder">Level Order Traversal</option>
          </select>

          {(operation === "insert" || operation === "search") && (
            <>
              <label className="ds-label">Value</label>

              <input
                className="ds-input"
                type="number"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAction();
                }}
              />
            </>
          )}

          <button className="primary-action" onClick={handleAction}>
            {operation === "insert" && <Plus size={18} />}
            {operation === "search" && <Search size={18} />}
            {!["insert", "search"].includes(operation) && (
              <List size={18} />
            )}

            {operation === "insert"
              ? "Insert Node"
              : operation === "search"
              ? "Search Node"
              : "Run Traversal"}
          </button>

          <div className="status-box">
            <div className="status-icon">●</div>
            <div>{status}</div>
          </div>

          {result.length > 0 && (
            <div className="traversal-result">
              <span>Traversal Result</span>

              <div className="result-values">
                {result.map((item, index) => (
                  <React.Fragment key={`${item}-${index}`}>
                    <span className="result-node">{item}</span>

                    {index !== result.length - 1 && (
                      <span className="result-arrow">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="visualization-panel tree-visual-panel">
          <div className="visualization-heading">
            <div>
              <span className="mini-label">VISUALIZATION</span>
              <h2>Binary Search Tree</h2>
            </div>

            <div className="bst-rule">
              <span>Left &lt; Root</span>
              <span>Right &gt; Root</span>
            </div>
          </div>

          <div className="tree-canvas">
            <TreeNode node={tree} highlight={highlight} />
          </div>

          <div className="concept-card">
            <h3>🌳 Binary Search Tree</h3>

            <p>
              A BST stores smaller values in the left subtree and larger
              values in the right subtree. This property makes searching
              efficient when the tree is balanced.
            </p>

            <div className="tree-complexity">
              <div>
                <span>Search</span>
                <strong>O(log n)*</strong>
              </div>

              <div>
                <span>Insert</span>
                <strong>O(log n)*</strong>
              </div>

              <div>
                <span>Traversal</span>
                <strong>O(n)</strong>
              </div>
            </div>

            <small>* Average case for a balanced BST.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizer;