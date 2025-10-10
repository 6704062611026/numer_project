import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";
import solveGaussJordan from "../utils/GaussJordanMethod";

function GaussJordan() {
  const [inputSize, setInputSize] = useState("3");
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
    const newB = [...matrixB];
    newB[row] = value === "" ? "" : parseFloat(value);
    setMatrixB(newB);
  };

  const handleCreateOrSolve = () => {
    const n = parseInt(inputSize);
    if (isNaN(n) || n < 2) {
      setError("Matrix size must be a number >= 2");
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

    const res = solveGaussJordan(matrixA, matrixB);
    setResult(res);
  };

  return (
    <>
      <Header1 />
      <div
        style={{
          padding: "1rem",
          maxWidth: 1000,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#1e3a8a" }}>Gauss–Jordan Elimination (Step-by-step)</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <strong>Matrix Size (n × n):</strong>
          </label>
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
                      onChange={(e) =>
                        handleChangeA(rowIndex, colIndex, e.target.value)
                      }
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

            <h3>Vector B ({matrixB.length}×1):</h3>
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
            {matrixA.length === parseInt(inputSize)
              ? "Solve (Gauss–Jordan)"
              : "Create Matrix"}
          </button>
        </div>

        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
        )}

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
            <h3 style={{ textAlign: "center" }}>Solution Steps</h3>
            <BlockMath math={`\\text{Gauss–Jordan Elimination Steps}`} />
            {result.steps.map((s, i) => (
              <div key={i}>
                <BlockMath math={s.latex} />
                <BlockMath math={s.matrixLatex} />
              </div>
            ))}
            <br />
            <BlockMath
              math={`\\text{Final Reduced Row Echelon Form (RREF):}`}
            />
            <BlockMath math={result.finalMatrixLatex} />
            <br />
            <BlockMath
              math={`\\therefore\\ (x_1,\\ x_2,\\ ...,\\ x_n) = (${result.solution
                .map((v) => v.toFixed(6))
                .join(",\\; ")})`}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default GaussJordan;
