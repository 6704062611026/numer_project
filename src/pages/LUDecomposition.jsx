import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";

// ✅ OOP Class สำหรับ LU Decomposition
class LUDecomposer {
  constructor(A, B) {
    this.A = A.map(row => [...row]);
    this.B = [...B];
    this.n = A.length;
    this.L = this.createZeroMatrix();
    this.U = this.createZeroMatrix();
    this.steps = [];
    this.forward = [];
    this.backward = [];
    this.solution = [];
  }

  createZeroMatrix() {
    return Array.from({ length: this.n }, () => Array(this.n).fill(0));
  }

  toLatexMatrix(matrix) {
    return `\\begin{bmatrix}
${matrix.map(row => row.map(num => num.toFixed(4)).join(" & ")).join(" \\\\ ")}
\\end{bmatrix}`;
  }

  decompose() {
    for (let i = 0; i < this.n; i++) {
      // Upper Triangular (U)
      for (let k = i; k < this.n; k++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += this.L[i][j] * this.U[j][k];
        }
        this.U[i][k] = this.A[i][k] - sum;
      }

      // Lower Triangular (L)
      for (let k = i; k < this.n; k++) {
        if (i === k) {
          this.L[i][i] = 1;
        } else {
          let sum = 0;
          for (let j = 0; j < i; j++) {
            sum += this.L[k][j] * this.U[j][i];
          }
          this.L[k][i] = (this.A[k][i] - sum) / this.U[i][i];
        }
      }

      this.steps.push({
        latex: `\\text{Step ${i + 1}: }\\quad L = ${this.toLatexMatrix(this.L)},\\quad U = ${this.toLatexMatrix(this.U)}`,
      });
    }
  }

  forwardSubstitution() {
    const y = Array(this.n).fill(0);
    for (let i = 0; i < this.n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += this.L[i][j] * y[j];
      }
      y[i] = this.B[i] - sum;
      this.forward.push(`y_${i + 1} = ${this.B[i]} - (${sum.toFixed(4)}) = ${y[i].toFixed(4)}`);
    }
    return y;
  }

  backwardSubstitution(y) {
    const x = Array(this.n).fill(0);
    for (let i = this.n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < this.n; j++) {
        sum += this.U[i][j] * x[j];
      }
      x[i] = (y[i] - sum) / this.U[i][i];
      this.backward.push(`x_${i + 1} = (${y[i].toFixed(4)} - ${sum.toFixed(4)}) / ${this.U[i][i].toFixed(4)} = ${x[i].toFixed(4)}`);
    }
    return x;
  }

  solve() {
    this.decompose();
    const y = this.forwardSubstitution();
    const x = this.backwardSubstitution(y);
    this.solution = x.map(num => parseFloat(num.toFixed(6)));
    return {
      steps: this.steps,
      forward: this.forward,
      backward: this.backward,
      solution: this.solution,
    };
  }
}

function LUDecomposition() {
  const [size, setSize] = useState("3");
  const [matrixA, setMatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const createEmptyMatrix = (n) =>
    Array.from({ length: n }, () => Array(n).fill(0));

  const handleChangeA = (row, col, value) => {
    const newMatrix = matrixA.map((r) => [...r]);
    newMatrix[row][col] = value === "" ? "" : parseFloat(value);
    setMatrixA(newMatrix);
  };

  const handleChangeB = (row, value) => {
    const newMatrix = [...matrixB];
    newMatrix[row] = value === "" ? "" : parseFloat(value);
    setMatrixB(newMatrix);
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
      setMatrixB(Array(n).fill(0));
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
      if (
        matrixB[i] === "" ||
        matrixB[i] === undefined ||
        Number.isNaN(matrixB[i])
      ) {
        setError("Please fill all entries in Matrix B.");
        return;
      }
    }

    const lu = new LUDecomposer(matrixA, matrixB);
    const res = lu.solve();
    setResult(res);
  };

  return (
    <>
      <Header1 />
      <div style={{ padding: "1rem", maxWidth: 1000, margin: "auto", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>LU Decomposition Method</h1>

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

            <h3>Matrix B ({matrixB.length}×1):</h3>
            <div style={{ display: "inline-block", textAlign: "center" }}>
              {matrixB.map((value, index) => (
                <div key={index}>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChangeB(index, e.target.value)}
                    style={{
                      width: "70px",
                      margin: "4px",
                      textAlign: "center",
                    }}
                  />
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
            {matrixA.length === parseInt(size)
              ? "Solve"
              : "Create Matrix"}
          </button>
        </div>

        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}

        {result && (
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
            <h3 style={{ textAlign: "center" }}>Step-by-step LU Decomposition</h3>

            {result.steps.map((s, i) => (
              <div key={i}>
                <BlockMath math={s.latex} />
              </div>
            ))}

            <h3>Forward Substitution</h3>
            {result.forward.map((f, i) => (
              <BlockMath key={i} math={f} />
            ))}

            <h3>Back Substitution</h3>
            {result.backward.map((b, i) => (
              <BlockMath key={i} math={b} />
            ))}

            <br />
            <BlockMath math={`\\therefore\\ (x_1,\\ x_2,\\ ...,\\ x_n) = (${result.solution.join(", ")})`} />
          </div>
        )}
      </div>
    </>
  );
}

export default LUDecomposition;
