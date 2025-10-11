import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";
import solveCramer from "../utils/CramerRuleMethod";

function CramerRule() {
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

    const res = solveCramer(matrixA, matrixB);
    setResult(res);
  };

  return (
    <>
      <Header1 />
      <div style={{ padding: "1rem", maxWidth: 1000, margin: "auto", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Cramer's Rule</h1>

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
            <div style={{ display: "inline-block", textAlign: "center" }}>
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

     
        {result && !result.error && (
          <div style={{
            backgroundColor: "#f0f4ff",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            marginTop: "2rem",
            textAlign: "left",
          }}>
            <BlockMath math={`\\text{From Cramer's Rule:}\\quad x_i = \\frac{\\det(A_i)}{\\det(A)}`} />
            <BlockMath math={`\\det(A) = ${result.detA}`} />
            {result.steps.map((step, index) => (
              <div key={index}>
                <BlockMath math={`x_${index + 1} = \\frac{\\det(A_${index + 1})}{\\det(A)} = \\frac{${step.detAi}}{${result.detA}} = ${step.value}`} />
              </div>
            ))}
            <br />
            <BlockMath math={`\\therefore\\ (x_1,\\ x_2,\\ ...,\\ x_n) = (${result.steps.map(s => s.value).join(", ")})`} />
          </div>
        )}

      
        {result?.error && (
          <div style={{ color: "red", marginTop: "1rem" }}>
            {result.error}
          </div>
        )}
      </div>
    </>
  );
}

export default CramerRule;
