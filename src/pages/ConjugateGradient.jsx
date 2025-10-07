import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header1 from "../components/Header1";

function ConjugateGradient() {
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrixA, setMatrixA] = useState(Array(2).fill().map(() => Array(2).fill(0)));
  const [vectorB, setVectorB] = useState(Array(2).fill(0));
  const [initialGuess, setInitialGuess] = useState(Array(2).fill(0));
  const [maxIterations, setMaxIterations] = useState(25);
  const [tolerance, setTolerance] = useState(1e-6);
  const [solution, setSolution] = useState([]);
  const [iterationsLog, setIterationsLog] = useState([]);

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setMatrixSize(size);
    setMatrixA(Array(size).fill().map(() => Array(size).fill(0)));
    setVectorB(Array(size).fill(0));
    setInitialGuess(Array(size).fill(0));
    setSolution([]);
    setIterationsLog([]);
  };

  const handleMatrixChange = (i, j, val) => {
    const A2 = matrixA.map((row) => [...row]);
    A2[i][j] = val === "" ? "" : parseFloat(val);
    setMatrixA(A2);
  };

  const handleVectorChange = (i, val) => {
    const b2 = [...vectorB];
    b2[i] = val === "" ? "" : parseFloat(val);
    setVectorB(b2);
  };

  const handleGuessChange = (i, val) => {
    const g2 = [...initialGuess];
    g2[i] = val === "" ? "" : parseFloat(val);
    setInitialGuess(g2);
  };

  const dot = (v1, v2) => {
    return v1.reduce((sum, vi, i) => sum + vi * v2[i], 0);
  };

  const matVec = (A, v) => {
    return A.map((row) => row.reduce((s, aij, j) => s + aij * v[j], 0));
  };

  const subtract = (v1, v2) => v1.map((v, i) => v - v2[i]);
  const add = (v1, v2) => v1.map((v, i) => v + v2[i]);
  const scale = (v, scalar) => v.map((vi) => vi * scalar);

  const runConjugateGradient = () => {
    const n = matrixSize;
    let x = [...initialGuess];
    let r = subtract(vectorB, matVec(matrixA, x)); // r0 = b - A x0
    let p = [...r]; // p0 = r0
    const logs = [];

    for (let k = 0; k < maxIterations; k++) {
      const Ap = matVec(matrixA, p);
      const rr = dot(r, r);
      const denom = dot(p, Ap);
      if (denom === 0) {
        break;
      }
      const alpha = rr / denom;
      x = add(x, scale(p, alpha));  // x_{k+1}
      const r_new = subtract(r, scale(Ap, alpha)); // r_{k+1}

      logs.push([...x]);

      if (Math.sqrt(dot(r_new, r_new)) < tolerance) {
        break;
      }

      const rr_new = dot(r_new, r_new);
      const beta = rr_new / rr;
      p = add(r_new, scale(p, beta));
      r = r_new;
    }

    setSolution(x.map((v) => v.toFixed(6)));
    setIterationsLog(logs);
  };

  const inputWidth = 60;
  const inputMargin = 8;
  const totalWidth = (inputWidth + inputMargin) * matrixSize;

  return (
    <>
      <Header1 />
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#f9fafb",
          color: "#1e293b",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>
          Conjugate Gradient Method
        </h1>

        <div
          style={{
            width: totalWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1rem",
          }}
        >
          <label>Matrix Size:</label>
          <select
            value={matrixSize}
            onChange={handleSizeChange}
            style={{ padding: "0.3rem", width: 100 }}
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} x {n}
              </option>
            ))}
          </select>
        </div>

        {/* Matrix A input */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ textAlign: "center" }}>Matrix A:</h3>
          <div
            style={{
              width: totalWidth,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {matrixA.map((row, i) => (
              <div
                key={i}
                style={{ display: "flex", justifyContent: "center", gap: "8px" }}
              >
                {row.map((val, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    value={val}
                    onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                    style={{ width: inputWidth, height: 40, textAlign: "center" }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Vector B input */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ textAlign: "center" }}>Vector B:</h3>
          <div
            style={{
              width: totalWidth,
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {vectorB.map((val, i) => (
              <input
                key={i}
                type="number"
                value={val}
                onChange={(e) => handleVectorChange(i, e.target.value)}
                style={{ width: inputWidth, height: 40, textAlign: "center" }}
              />
            ))}
          </div>
        </div>

        {/* Initial Guess */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ textAlign: "center" }}>Initial Guess x⁰:</h3>
          <div
            style={{
              width: totalWidth,
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {initialGuess.map((val, i) => (
              <input
                key={i}
                type="number"
                value={val}
                onChange={(e) => handleGuessChange(i, e.target.value)}
                style={{ width: inputWidth, height: 40, textAlign: "center" }}
              />
            ))}
          </div>
        </div>

        {/* Settings */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <label style={{ marginRight: 8 }}>Max Iterations:</label>
          <input
            type="number"
            value={maxIterations}
            onChange={(e) => setMaxIterations(parseInt(e.target.value))}
            style={{ width: 80, marginRight: 16 }}
          />
          <label style={{ marginRight: 8 }}>Tolerance:</label>
          <input
            type="number"
            step="0.000001"
            value={tolerance}
            onChange={(e) => setTolerance(parseFloat(e.target.value))}
            style={{ width: 80 }}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button
            onClick={runConjugateGradient}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Calculate
          </button>
        </div>

        {solution.length > 0 && (
          <>
            <h2 style={{ color: "#1e3a8a", textAlign: "center" }}>Graph</h2>
            <div style={{ width: 600, height: 400, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: solution.map((_, i) => `x${i + 1}`),
                    y: solution.map((v) => Number(v)),
                    type: "bar",
                    marker: { color: "#1e3a8a" },
                  },
                ]}
                layout={{
                  title: { text: "Conjugate Gradient: Solution", font: { color: "#1e3a8a" } },
                  xaxis: { title: { text: "Variable", font: { color: "#1e3a8a" } } },
                  yaxis: { title: { text: "Value", font: { color: "#1e3a8a" } } },
                  plot_bgcolor: "#f9fafb",
                  paper_bgcolor: "#f9fafb",
                  font: { color: "#1e293b" },
                }}
              />
            </div>
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a", textAlign: "center" }}>Result</h2>
            <table
              border="1"
              cellPadding="8"
              style={{
                width: "100%",
                marginTop: "1rem",
                backgroundColor: "white",
                textAlign: "center",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  {solution.map((_, i) => <th key={i}>x{i+1}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {solution.map((val, i) => <td key={i}>{val}</td>)}
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}

export default ConjugateGradient;
