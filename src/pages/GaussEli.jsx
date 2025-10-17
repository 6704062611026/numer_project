import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";

class GaussSolver {
  constructor(A, B) {
    this.A = A.map(row => [...row]);
    this.B = [...B];
    this.n = A.length;

    this.forwardSteps = [];
    this.backSubstitutionSteps = [];
    this.solution = Array(this.n).fill(0);
  }

  cloneMatrixWithB() {
    return this.A.map((row, i) => [...row, this.B[i]]);
  }

  toLatexMatrix(matrix) {
    const rows = matrix.map(row => row.map(v => v.toFixed(3)).join(" & "));
    return `\\begin{bmatrix}${rows.join(" \\\\ ")}\\end{bmatrix}`;
  }

  solve() {
    this.forwardElimination();
    const solution = this.backSubstitution();
    return {
      forward: this.forwardSteps,
      backSubstitution: this.backSubstitutionSteps,
      solution,
      upperMatrixLatex: this.toLatexMatrix(this.cloneMatrixWithB())
    };
  }

  forwardElimination() {
    const n = this.n;

    for (let i = 0; i < n; i++) {
     
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(this.A[k][i]) > Math.abs(this.A[maxRow][i])) {
          maxRow = k;
        }
      }

     
      if (maxRow !== i) {
        [this.A[i], this.A[maxRow]] = [this.A[maxRow], this.A[i]];
        [this.B[i], this.B[maxRow]] = [this.B[maxRow], this.B[i]];
        this.forwardSteps.push({
          type: "swap",
          latex: `R_{${i + 1}} \\leftrightarrow R_{${maxRow + 1}}`,
          matrixLatex: this.toLatexMatrix(this.cloneMatrixWithB())
        });
      }

 
      for (let k = i + 1; k < n; k++) {
        const factor = this.A[k][i] / this.A[i][i];
        for (let j = i; j < n; j++) {
          this.A[k][j] -= factor * this.A[i][j];
        }
        this.B[k] -= factor * this.B[i];

        this.forwardSteps.push({
          type: "factor",
          latex: `R_{${k + 1}} = R_{${k + 1}} - (${factor.toFixed(3)})R_{${i + 1}}`,
          matrixLatex: this.toLatexMatrix(this.cloneMatrixWithB())
        });
      }
    }
  }

  backSubstitution() {
    const n = this.n;
    const x = Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {
      let sum = this.B[i];
      for (let j = i + 1; j < n; j++) {
        sum -= this.A[i][j] * x[j];
      }
      x[i] = sum / this.A[i][i];
      this.backSubstitutionSteps.push(`x_{${i + 1}} = ${x[i].toFixed(6)}`);
    }

    this.solution = x;
    return x;
  }
}


function GaussElimination() {
  const [inputSize, setInputSize] = useState("3");
  const [matrixA, setMatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function createEmptyMatrix(n) {
    return Array.from({ length: n }, () => Array(n).fill(0));
  }

  const handleChangeA = (row, col, value) => {
    const newMatrix = matrixA.map(r => [...r]);
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

   
    const solver = new GaussSolver(matrixA, matrixB);
    const res = solver.solve();
    setResult(res);
  };

  return (
    <>
      <Header1 />
      <div style={{ padding: "1rem", maxWidth: 1000, margin: "auto", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Gaussian Elimination</h1>

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
            {matrixA.length === parseInt(inputSize) ? "Solve" : "Create Matrix"}
          </button>
        </div>

        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{
            backgroundColor: "#f0f4ff",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            marginTop: "2rem",
            textAlign: "left",
          }}>
            <h3 style={{ textAlign: "center" }}>Solution Steps</h3>

            <BlockMath math={`\\text{Forward Elimination (Gaussian Elimination)}`} />
            {result.forward.map((item, idx) => (
              <div key={idx} style={{ marginBottom: "0.5rem" }}>
                {item.type === "swap" && (
                  <>
                    <BlockMath math={`\\text{Swap rows: } ${item.latex}`} />
                    <BlockMath math={item.matrixLatex} />
                  </>
                )}
                {item.type === "factor" && (
                  <>
                    <BlockMath math={item.latex} />
                    <BlockMath math={item.matrixLatex} />
                  </>
                )}
              </div>
            ))}

            <BlockMath math={`\\text{Upper triangular form (after forward elimination):}`} />
            <BlockMath math={result.upperMatrixLatex} />

            <BlockMath math={`\\text{Back Substitution}`} />
            {result.backSubstitution.map((line, i) => (
              <div key={i}>
                <BlockMath math={line} />
              </div>
            ))}

            <BlockMath math={`\\therefore\\ (x_1,\\ x_2,\\ ...,\\ x_n) = (${result.solution.map(v => v.toFixed(6)).join(",\\; ")})`} />
          </div>
        )}
      </div>
    </>
  );
}

export default GaussElimination;
