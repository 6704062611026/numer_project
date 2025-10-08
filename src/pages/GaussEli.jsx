import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";
import solveGaussElimination from "../utils/GaussEliminationMethod";

function GaussElimination() {
  const [inputSize, setInputSize] = useState("2");
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
      setError("Matrix size must be a number greater than or equal to 2");
      setResult(null);
      return;
    }

    setError("");

    if (matrixA.length !== size) {
      setMatrixA(createEmptyMatrix(size));
      setMatrixB(Array(size).fill(0));
      setResult(null);
      return;
    }

    const res = solveGaussElimination(matrixA, matrixB);
    setResult(res);
  };

  return (
    <>
      <Header1 />
      <div style={{ padding: "1rem", maxWidth: 1000, margin: "auto", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Gauss Elimination Method</h1>

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
            <div style={{ display: "inline-block" }}>
              {matrixA.map((row, rowIndex) => (
                <div key={rowIndex}>
                  {row.map((value, colIndex) => (
                    <input
                      key={colIndex}
                      type="number"
                      value={value}
                      onChange={(e) => handleChangeA(rowIndex, colIndex, e.target.value)}
                      style={{
                        width: "60px",
                        margin: "4px",
                        textAlign: "center",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <h3>Matrix B ({matrixB.length}×1):</h3>
            <div style={{ display: "inline-block" }}>
              {matrixB.map((value, index) => (
                <div key={index}>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChangeB(index, e.target.value)}
                    style={{
                      width: "60px",
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
        </div>

        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>
            {error}
          </div>
        )}

        {result && (
  <div style={{ padding: "1rem", marginTop: "2rem", backgroundColor: "#f8fafc", borderRadius: 8 }}>
    <h2>🔁 Forward Elimination</h2>
    {result.forwardSteps.map((step, index) => (
      <div key={index} style={{ marginBottom: "1rem" }}>
        <h4>Step {index + 1}</h4>
        {step.pivotInfo && <p><strong>Swap:</strong> {step.pivotInfo}</p>}
        {step.factorInfo.map((f, idx) => (
          <p key={idx}>Factor: a{f.row}{index + 1}/a{index + 1}{index + 1} = {f.factor.toFixed(6)} → {f.formula}</p>
        ))}
        <table border="1" cellPadding="6" style={{ marginTop: "0.5rem" }}>
          <tbody>
            {step.matrixSnapshot.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j}>{val.toFixed(4)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}

    <h2>🔁 Back Substitution</h2>
    {result.backSubSteps.map((step, i) => (
      <p key={i}>
        {step.variable} = {step.formula} = <strong>{step.value}</strong>
      </p>
    ))}

    <h3>✅ Final Solution:</h3>
    <p>( {result.solution.join(", ")} )</p>
  </div>
)}

      </div>
    </>
  );
}

export default GaussElimination;
