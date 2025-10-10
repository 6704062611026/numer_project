import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";
import solveConjugateGradient from "../utils/ConjugateGradientMethod";

function ConjugateGradient() {
  const [inputSize, setInputSize] = useState("3");
  const [matrixA, setMatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function createEmptyMatrix(n) {
    return Array.from({ length: n }, () => Array(n).fill(0));
  }

  const handleChangeA = (row, col, value) => {
    const newMatrix = [...matrixA];
    newMatrix[row][col] = parseFloat(value);
    setMatrixA(newMatrix);
  };

  const handleChangeB = (row, value) => {
    const newMatrix = [...matrixB];
    newMatrix[row] = parseFloat(value);
    setMatrixB(newMatrix);
  };

  const handleSolve = () => {
    const size = parseInt(inputSize);
    if (isNaN(size) || size < 2) {
      setError("Matrix size must be >= 2");
      return;
    }
    setError("");

    if (matrixA.length !== size) {
      setMatrixA(createEmptyMatrix(size));
      setMatrixB(Array(size).fill(0));
      setResult(null);
      return;
    }

    const res = solveConjugateGradient(matrixA, matrixB);
    setResult(res);
  };

  return (
    <>
      <Header1 />
      <div style={{ padding: "1rem", maxWidth: 1000, margin: "auto", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Conjugate Gradient Method</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label><strong>Matrix Size (n × n):</strong></label>
          <input
            type="number"
            value={inputSize}
            onChange={(e) => setInputSize(e.target.value)}
            min={2}
            style={{ width: "60px", marginLeft: "10px" }}
          />
        </div>

        {matrixA.length > 0 && (
          <>
            <h3>Matrix A ({matrixA.length}×{matrixA.length}):</h3>
            {matrixA.map((row, i) => (
              <div key={i}>
                {row.map((val, j) => (
                  <input
                    key={j}
                    type="number"
                    value={val}
                    onChange={(e) => handleChangeA(i, j, e.target.value)}
                    style={{ width: "60px", margin: "4px", textAlign: "center" }}
                  />
                ))}
              </div>
            ))}

            <h3>Matrix B ({matrixB.length}×1):</h3>
            {matrixB.map((val, i) => (
              <div key={i}>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => handleChangeB(i, e.target.value)}
                  style={{ width: "60px", margin: "4px", textAlign: "center" }}
                />
              </div>
            ))}
          </>
        )}

        <button
          onClick={handleSolve}
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
          {matrixA.length === parseInt(inputSize) ? "Solve" : "Create Matrix"}
        </button>

        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}

        {result && (
          <div style={{
            backgroundColor: "#f0f4ff",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            marginTop: "2rem",
            textAlign: "left",
          }}>
            <BlockMath math={`\\text{Using the Conjugate Gradient Method: } A x = b`} />
            {result.steps.map((step, i) => (
              <div key={i}>
                <BlockMath
                  math={`\\text{Iteration ${i + 1}:}\\quad r^{(${i})} = ${step.r}\\quad p^{(${i})} = ${step.p}\\quad x^{(${i + 1})} = ${step.x}`}
                />
                <BlockMath
                  math={`\\alpha_${i + 1} = ${step.alpha.toFixed(6)}\\quad\\beta_${i + 1} = ${step.beta.toFixed(6)}`}
                />
                <br />
              </div>
            ))}
            <BlockMath math={`\\text{Final solution: } x = (${result.solution.map(x => x.toFixed(6)).join(", ")})`} />
          </div>
        )}
      </div>
    </>
  );
}

export default ConjugateGradient;
