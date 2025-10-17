import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";


class JacobiSolver {
  constructor(A, B, X0, maxIterations = 5) {
    this.A = A;
    this.B = B;
    this.X = [...X0];
    this.n = A.length;
    this.maxIterations = maxIterations;
    this.steps = [];
  }

  formatNumber(x) {
    if (Math.abs(x) < 1e-10) return "0";
    if (Number.isInteger(x)) return String(x);
    return parseFloat(x.toFixed(6)).toString();
  }

  iterate() {
    const X_new = Array(this.n).fill(0);

    for (let iter = 1; iter <= this.maxIterations; iter++) {
      let stepLatex = `x^{(${iter})} = \\begin{pmatrix}`;
      for (let i = 0; i < this.n; i++) {
        let sum = this.B[i];
        for (let j = 0; j < this.n; j++) {
          if (j !== i) {
            sum -= this.A[i][j] * this.X[j];
          }
        }
        X_new[i] = sum / this.A[i][i];
        stepLatex += this.formatNumber(X_new[i]);
        if (i !== this.n - 1) stepLatex += " \\\\ ";
      }
      stepLatex += "\\end{pmatrix}";
      this.steps.push(stepLatex);
      this.X = [...X_new];
    }

    const finalLatex = `\\begin{pmatrix}${this.X.map(this.formatNumber).join(" \\\\ ")}\\end{pmatrix}`;

    return {
      steps: this.steps,
      finalLatex,
    };
  }
}


function JacobiIteration() {
  const [size, setSize] = useState("3");
  const [matrixA, setMatrixA] = useState([]);
  const [vectorB, setVectorB] = useState([]);
  const [vectorX0, setVectorX0] = useState([]);
  const [iterations, setIterations] = useState(5);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const createEmptyMatrix = (n) => Array.from({ length: n }, () => Array(n).fill(0));
  const createEmptyVector = (n) => Array(n).fill(0);

  const handleChangeA = (row, col, value) => {
    const newMatrix = matrixA.map((r) => [...r]);
    newMatrix[row][col] = value === "" ? "" : parseFloat(value);
    setMatrixA(newMatrix);
  };

  const handleChangeB = (i, value) => {
    const newB = [...vectorB];
    newB[i] = value === "" ? "" : parseFloat(value);
    setVectorB(newB);
  };

  const handleChangeX0 = (i, value) => {
    const newX = [...vectorX0];
    newX[i] = value === "" ? "" : parseFloat(value);
    setVectorX0(newX);
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
      setVectorB(createEmptyVector(n));
      setVectorX0(createEmptyVector(n));
      setResult(null);
      return;
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (
          matrixA[i][j] === "" ||
          matrixA[i][j] === undefined ||
          Number.isNaN(matrixA[i][j])
        )
          return setError("Please fill all entries in Matrix A.");
      }
      if (
        vectorB[i] === "" ||
        vectorB[i] === undefined ||
        Number.isNaN(vectorB[i])
      )
        return setError("Please fill all entries in Vector B.");
      if (
        vectorX0[i] === "" ||
        vectorX0[i] === undefined ||
        Number.isNaN(vectorX0[i])
      )
        return setError("Please fill all initial guesses X₀.");
    }

    const solver = new JacobiSolver(matrixA, vectorB, vectorX0, parseInt(iterations));
    const res = solver.iterate();
    setResult(res);

    // Optional: บันทึกประวัติ
    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "Jacobi",
        matrixA,
        vectorB,
        initialGuess: vectorX0,
        iterations,
        result: res,
      }),
    })
      .then((r) => r.json())
      .then(() => console.log("History saved"))
      .catch((err) => console.warn("History save failed:", err));
  };

  return (
    <>
      <Header1 />
      <div style={{ padding: "1rem", maxWidth: 1000, margin: "auto", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Jacobi Iteration Method</h1>

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
            <h3>Matrix A:</h3>
            <div style={{ display: "inline-block" }}>
              {matrixA.map((row, i) => (
                <div key={i}>
                  {row.map((value, j) => (
                    <input
                      key={j}
                      type="number"
                      value={value}
                      onChange={(e) => handleChangeA(i, j, e.target.value)}
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

            <h3>Vector B:</h3>
            <div>
              {vectorB.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => handleChangeB(i, e.target.value)}
                  style={{
                    width: "70px",
                    margin: "4px",
                    textAlign: "center",
                  }}
                />
              ))}
            </div>

            <h3>Initial Guess X₀:</h3>
            <div>
              {vectorX0.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => handleChangeX0(i, e.target.value)}
                  style={{
                    width: "70px",
                    margin: "4px",
                    textAlign: "center",
                  }}
                />
              ))}
            </div>

            <h3>Number of Iterations:</h3>
            <input
              type="number"
              value={iterations}
              onChange={(e) => setIterations(e.target.value)}
              min={1}
              style={{ width: "70px" }}
            />
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
            <h3 style={{ textAlign: "center" }}>Step-by-step Jacobi Iteration</h3>
            {result.steps.map((s, i) => (
              <div key={i}>
                <BlockMath math={s} />
              </div>
            ))}
            <h3>Final Approximation:</h3>
            <BlockMath math={`x^{(${iterations})} = ${result.finalLatex}`} />
          </div>
        )}
      </div>
    </>
  );
}

export default JacobiIteration;
