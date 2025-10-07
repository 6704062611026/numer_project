import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header1 from "../components/Header1";

function Jacobi() {
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrixA, setMatrixA] = useState(Array(2).fill().map(() => Array(2).fill(0)));
  const [vectorB, setVectorB] = useState(Array(2).fill(0));
  const [initialGuess, setInitialGuess] = useState(Array(2).fill(0));
  const [maxIterations, setMaxIterations] = useState(25);
  const [tolerance, setTolerance] = useState(0.0001);
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

  const handleMatrixChange = (row, col, value) => {
    const updated = [...matrixA];
    updated[row][col] = value === "" ? "" : parseFloat(value);
    setMatrixA(updated);
  };

  const handleVectorChange = (i, value) => {
    const updated = [...vectorB];
    updated[i] = value === "" ? "" : parseFloat(value);
    setVectorB(updated);
  };

  const handleGuessChange = (i, value) => {
    const updated = [...initialGuess];
    updated[i] = value === "" ? "" : parseFloat(value);
    setInitialGuess(updated);
  };

  const calculateJacobi = () => {
    const x = [...initialGuess];
    const newX = Array(matrixSize).fill(0);
    const logs = [];

    for (let iter = 0; iter < maxIterations; iter++) {
      for (let i = 0; i < matrixSize; i++) {
        let sum = 0;
        for (let j = 0; j < matrixSize; j++) {
          if (j !== i) {
            sum += matrixA[i][j] * x[j];
          }
        }
        newX[i] = (vectorB[i] - sum) / matrixA[i][i];
      }

      const diff = newX.map((val, i) => Math.abs(val - x[i]));
      logs.push([...newX]);

      if (diff.every((d) => d < tolerance)) {
        setSolution(newX.map((val) => val.toFixed(6)));
        setIterationsLog(logs);
        return;
      }

      for (let i = 0; i < matrixSize; i++) {
        x[i] = newX[i];
      }
    }

    setSolution(x.map((val) => val.toFixed(6)));
    setIterationsLog(logs);
  };

  const inputWidth = 60;
  const inputMargin = 8;
  const totalWidth = (inputWidth + inputMargin) * matrixSize;

  return (
    <>
      <Header1 />
      <div
        className="App"
        style={{
          padding: "2rem",
          backgroundColor: "#f9fafb",
          color: "#1e293b",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Jacobi Iteration Method</h1>

        
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <label>Matrix Size: </label>
          <select
            value={matrixSize}
            onChange={handleSizeChange}
            style={{ marginLeft: 8, padding: "0.3rem" }}
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} x {n}</option>
            ))}
          </select>
        </div>

        
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ textAlign: "center" }}>Matrix A:</h3>
          <div style={{
            width: totalWidth,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {matrixA.map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
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

        {/* Vector B */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ textAlign: "center" }}>Vector B:</h3>
          <div style={{ width: totalWidth, margin: "0 auto", display: "flex", justifyContent: "center", gap: "8px" }}>
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
          <h3 style={{ textAlign: "center" }}>Initial Guess (x₀):</h3>
          <div style={{ width: totalWidth, margin: "0 auto", display: "flex", justifyContent: "center", gap: "8px" }}>
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

        {/* Iteration Settings */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <label style={{ marginRight: 8 }}>Max Iterations: </label>
          <input
            type="number"
            value={maxIterations}
            onChange={(e) => setMaxIterations(parseInt(e.target.value))}
            style={{ width: 80, marginRight: 16 }}
          />
          <label style={{ marginRight: 8 }}>Tolerance: </label>
          <input
            type="number"
            step="0.00001"
            value={tolerance}
            onChange={(e) => setTolerance(parseFloat(e.target.value))}
            style={{ width: 80 }}
          />
        </div>

        {/* Calculate Button */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button
            onClick={calculateJacobi}
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

        {/* Solution & Graph */}
        {solution.length > 0 && (
          <>
            <h2 style={{ color: "#1e3a8a", textAlign: "center" }}>Graph</h2>
            <div style={{ width: 600, height: 400, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: solution.map((_, i) => `x${i + 1}`),
                    y: solution.map(Number),
                    type: 'bar',
                    marker: { color: '#1e3a8a' },
                  },
                ]}
                layout={{
                  title: { text: "Jacobi Method: Final Solution", font: { color: '#1e3a8a' } },
                  xaxis: { title: { text: 'Variable', font: { color: '#1e3a8a' } } },
                  yaxis: { title: { text: 'Value', font: { color: '#1e3a8a' } } },
                  plot_bgcolor: '#f9fafb',
                  paper_bgcolor: '#f9fafb',
                  font: { color: '#1e293b' },
                }}
              />
            </div>

            {/* Result Table */}
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a", textAlign: "center" }}>Final Result</h2>
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
                  {solution.map((_, i) => (
                    <th key={i}>x{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {solution.map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}

export default Jacobi;
