import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header1 from "../components/Header1";

// ✅ OOP Class สำหรับ Matrix Inversion
class MatrixInverter {
  constructor(matrix) {
    this.n = matrix.length;
    this.A = matrix.map(row => [...row]);
    this.I = this.createIdentityMatrix(this.n);
    this.steps = [];
  }

  createIdentityMatrix(n) {
    return Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
  }

  getAugmentedMatrix() {
    return this.A.map((row, i) => [...row, ...this.I[i]]);
  }

  toLatexMatrix(matrix) {
    return `\\begin{bmatrix}
${matrix.map(row => row.map(num => num.toFixed(4)).join(" & ")).join(" \\\\ ")}
\\end{bmatrix}`;
  }

  addStep(description, matrix) {
    this.steps.push({
      latex: `\\text{${description}}`,
      matrixLatex: this.toLatexMatrix(matrix),
    });
  }

  invert() {
    let aug = this.getAugmentedMatrix();
    this.addStep("Initial Augmented Matrix", aug);

    const n = this.n;

    for (let i = 0; i < n; i++) {
      // ✅ Pivoting
      if (aug[i][i] === 0) {
        let swapped = false;
        for (let j = i + 1; j < n; j++) {
          if (aug[j][i] !== 0) {
            [aug[i], aug[j]] = [aug[j], aug[i]];
            this.addStep(`Swap row ${i + 1} with row ${j + 1}`, aug);
            swapped = true;
            break;
          }
        }
        if (!swapped) {
          return {
            steps: this.steps,
            error: "Matrix is singular and cannot be inverted.",
          };
        }
      }

      // ✅ Normalize pivot row
      const pivot = aug[i][i];
      for (let j = 0; j < 2 * n; j++) {
        aug[i][j] /= pivot;
      }
      this.addStep(`R${i + 1} ÷ ${pivot.toFixed(4)}`, aug);

      // ✅ Eliminate other rows
      for (let k = 0; k < n; k++) {
        if (k === i) continue;
        const factor = aug[k][i];
        for (let j = 0; j < 2 * n; j++) {
          aug[k][j] -= factor * aug[i][j];
        }
        this.addStep(`R${k + 1} - (${factor.toFixed(4)} × R${i + 1})`, aug);
      }
    }

    // ✅ Split result
    const inverse = aug.map(row => row.slice(n));
    return {
      initialLatex: this.toLatexMatrix(this.getAugmentedMatrix()),
      steps: this.steps,
      finalLatex: this.toLatexMatrix(aug),
      inverseLatex: this.toLatexMatrix(inverse),
    };
  }
}

function MatrixInversion() {
  const [size, setSize] = useState("3");
  const [matrixA, setMatrixA] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const createEmptyMatrix = (n) => Array.from({ length: n }, () => Array(n).fill(0));

  const handleChangeA = (row, col, value) => {
    const newMatrix = matrixA.map((r) => [...r]);
    newMatrix[row][col] = value === "" ? "" : parseFloat(value);
    setMatrixA(newMatrix);
  };

  const saveHistory = (matrix, inverseLatex) => {
    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "Matrix Inversion",
        size: matrix.length,
        matrix: matrix.map(row => row.join(",")).join(";"),
        inverse: inverseLatex,
      }),
    })
      .then(res => res.json())
      .then(data => console.log("History saved:", data))
      .catch(err => console.error("Error saving history:", err));
  };

  const handleCreateOrSolve = () => {
    const n = parseInt(size);
    if (isNaN(n) || n < 2) {
      setError("Matrix size must be a number >= 2");
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
        if (matrixA[i][j] === "" || matrixA[i][j] === undefined || Number.isNaN(matrixA[i][j])) {
          setError("Please fill all entries in Matrix A.");
          return;
        }
      }
    }

    const inverter = new MatrixInverter(matrixA);
    const res = inverter.invert();

    if (res.error) {
      setError(res.error);
      setResult(null);
    } else {
      setResult(res);
      saveHistory(matrixA, res.inverseLatex);
    }
  };

  return (
    <>
      <Header1 />
      <div style={{ padding: "1rem", maxWidth: 1000, margin: "auto", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Matrix Inversion</h1>

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
            <h3 style={{ textAlign: "center" }}>Step-by-step Matrix Inversion</h3>
            <BlockMath math={`\\text{Initial Augmented Matrix: } [A | I]`} />
            <BlockMath math={result.initialLatex} />

            {result.steps.map((s, i) => (
              <div key={i}>
                <BlockMath math={s.latex} />
                <BlockMath math={s.matrixLatex} />
              </div>
            ))}

            <BlockMath math={`\\text{Final: } [I | A^{-1}]`} />
            <BlockMath math={result.finalLatex} />

            <br />
            <BlockMath math={`A^{-1} = ${result.inverseLatex}`} />
          </div>
        )}
      </div>
    </>
  );
}

export default MatrixInversion;
