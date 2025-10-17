import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";


class CholeskySolver {
  constructor(matrix) {
    this.A = matrix;
    this.n = matrix.length;
    this.L = Array.from({ length: this.n }, () => Array(this.n).fill(0));
    this.steps = [];
  }

  isSymmetric() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.A[i][j] !== this.A[j][i]) return false;
      }
    }
    return true;
  }

  formatNumber(x) {
    if (Math.abs(x) < 1e-10) return "0";
    if (Number.isInteger(x)) return String(x);
    return parseFloat(x.toFixed(6)).toString();
  }

  decompose() {
    if (!this.isSymmetric()) {
      return { error: "Matrix A is not symmetric. Cholesky cannot be applied." };
    }

    try {
      for (let i = 0; i < this.n; i++) {
        for (let j = 0; j <= i; j++) {
          let sum = 0;
          for (let k = 0; k < j; k++) {
            sum += this.L[i][k] * this.L[j][k];
          }

          if (i === j) {
            const val = this.A[i][i] - sum;
            if (val <= 0) {
              return { error: "Matrix is not positive definite. Cholesky failed." };
            }
            this.L[i][j] = Math.sqrt(val);
            this.steps.push(
              `L_{${i + 1}${j + 1}} = \\sqrt{${this.A[i][i]} - ${this.formatNumber(sum)}} = ${this.formatNumber(this.L[i][j])}`
            );
          } else {
            this.L[i][j] = (this.A[i][j] - sum) / this.L[j][j];
            this.steps.push(
              `L_{${i + 1}${j + 1}} = \\frac{${this.A[i][j]} - ${this.formatNumber(sum)}}{${this.formatNumber(this.L[j][j])}} = ${this.formatNumber(this.L[i][j])}`
            );
          }
        }
      }

      const Llatex = `\\begin{pmatrix}${this.L.map(row => row.map(this.formatNumber).join("&")).join("\\\\")}\\end{pmatrix}`;
      const LT = this.L[0].map((_, i) => this.L.map(row => row[i]));
      const LTlatex = `\\begin{pmatrix}${LT.map(row => row.map(this.formatNumber).join("&")).join("\\\\")}\\end{pmatrix}`;

      return {
        steps: this.steps,
        Llatex,
        LTlatex,
      };
    } catch (e) {
      return { error: "Error computing Cholesky decomposition." };
    }
  }
}


function CholeskyDecomposition() {
  const [size, setSize] = useState("3");
  const [matrixA, setMatrixA] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const createEmptyMatrix = (n) => Array.from({ length: n }, () => Array(n).fill(0));

  const handleChangeA = (row, col, value) => {
    const newMatrix = matrixA.map(row => [...row]);
    newMatrix[row][col] = value === "" ? "" : parseFloat(value);
    setMatrixA(newMatrix);
  };

  const handleCreateOrSolve = () => {
    const n = parseInt(size);
    if (isNaN(n) || n < 2) {
      setError("Matrix size must be ≥ 2");
      return;
    }

    setError("");

    if (matrixA.length !== n) {
      setMatrixA(createEmptyMatrix(n));
      setResult(null);
      return;
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (
          matrixA[i][j] === "" ||
          matrixA[i][j] === undefined ||
          Number.isNaN(matrixA[i][j])
        ) {
          setError("Please fill all entries in Matrix A.");
          return;
        }
      }
    }

    const solver = new CholeskySolver(matrixA);
    const res = solver.decompose();
    setResult(res);


    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "Cholesky",
        matrixA: matrixA,
        result: res,
      }),
    })
      .then((r) => r.json())
      .then(() => alert("History saved successfully!"))
      .catch((err) => alert("Error saving history: " + err));
  };

  return (
    <>
      <Header1 />
      <div style={{ padding: "1rem", maxWidth: 1000, margin: "auto", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Cholesky Decomposition Method</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label><strong>Matrix Size (n × n):</strong></label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            min={2}
            style={{ width: "60px", marginLeft: "10px" }}
          />
        </div>

        {matrixA.length > 0 && (
          <>
            <h3>Matrix A ({matrixA.length}×{matrixA.length}):</h3>
            <div style={{ display: "inline-block", textAlign: "center" }}>
              {matrixA.map((row, rowIndex) => (
                <div key={rowIndex}>
                  {row.map((value, colIndex) => (
                    <input
                      key={colIndex}
                      type="number"
                      value={value}
                      onChange={(e) => handleChangeA(rowIndex, colIndex, e.target.value)}
                      style={{
                        width: "70px",
                        margin: "4px",
                        textAlign: "center",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        <div>
          <button
            onClick={handleCreateOrSolve}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            {matrixA.length === parseInt(size) ? "Solve" : "Create Matrix"}
          </button>
        </div>

        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}

        {result && !result.error && (
          <div
            style={{
              backgroundColor: "#f0f4ff",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              marginTop: "2rem",
              textAlign: "left",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Step-by-step Cholesky Decomposition</h3>

            {result.steps.map((s, i) => (
              <div key={i}>
                <BlockMath math={s} />
              </div>
            ))}

            <h3>Final Result:</h3>
            <BlockMath math={`L = ${result.Llatex}`} />
            <BlockMath math={`L^{T} = ${result.LTlatex}`} />
          </div>
        )}

        {result?.error && (
          <div style={{ color: "red", marginTop: "1rem" }}>{result.error}</div>
        )}
      </div>
    </>
  );
}

export default CholeskyDecomposition;
