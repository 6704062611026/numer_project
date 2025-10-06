import React, { useState } from "react";
import Plot from 'react-plotly.js';
import Header1 from "../components/Header1";


function GaussEli() {
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrixA, setMatrixA] = useState(Array(2).fill().map(() => Array(2).fill(0)));
  const [vectorB, setVectorB] = useState(Array(2).fill(0));
  const [solution, setSolution] = useState([]);

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setMatrixSize(size);
    setMatrixA(Array(size).fill().map(() => Array(size).fill(0)));
    setVectorB(Array(size).fill(0));
    setSolution([]);
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

  const calculateGaussElimination = () => {
  try {
    const size = matrixSize;
    const A = matrixA.map(row => [...row]);
    const B = [...vectorB];
    const n = size;

    // Forward Elimination
    for (let i = 0; i < n; i++) {
     
      if (A[i][i] === 0) {
        let swapped = false;
        for (let j = i + 1; j < n; j++) {
          if (A[j][i] !== 0) {
            [A[i], A[j]] = [A[j], A[i]];
            [B[i], B[j]] = [B[j], B[i]];
            swapped = true;
            break;
          }
        }
        if (!swapped) {
          alert("Cannot solve: zero pivot encountered.");
          return;
        }
      }

      
      for (let j = i + 1; j < n; j++) {
        const factor = A[j][i] / A[i][i];
        for (let k = i; k < n; k++) {
          A[j][k] -= factor * A[i][k];
        }
        B[j] -= factor * B[i];
      }
    }

    
    const X = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += A[i][j] * X[j];
      }
      X[i] = (B[i] - sum) / A[i][i];
    }

    setSolution(X.map(val => val.toFixed(6)));
  } catch {
    alert("Invalid input.");
  }
};


  
  const inputWidth = 60;
  const inputMargin = 8;
  const totalWidth = (inputWidth + inputMargin) * matrixSize;

  const chartData = {
    labels: solution.map((_, i) => `x${i + 1}`),
    datasets: [
      {
        label: "Variable Values",
        data: solution.map(Number),
        borderColor: "#1e3a8a",
        backgroundColor: "#93c5fd",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1e293b" } },
      title: {
        display: true,
        text: "Cramer's Rule: Solution Values",
        color: "#1e3a8a",
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Value", color: "#1e3a8a" },
      },
      x: {
        title: { display: true, text: "Variable", color: "#1e3a8a" },
      },
    },
  };

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
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Gauss Elimination</h1>

        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <label>Matrix Size: </label>
          <div className="s">
          <select
            value={matrixSize}
            onChange={handleSizeChange}
            style={{ marginLeft: 8, padding: "0.3rem" }}
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} x {n}
              </option>
            ))}
          </select>
          </div>
        </div>

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
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {row.map((val, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    value={val}
                    onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                    style={{
                      width: inputWidth,
                      height: 40,
                      textAlign: "center",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

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
                style={{
                  width: inputWidth,
                  height: 40,
                  textAlign: "center",
                }}
              />
            ))}
          </div>
        </div>


        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button
            onClick={calculateGaussElimination}
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
        y: solution.map(Number),
        type: 'bar',
        marker: { color: '#1e3a8a' },
      },
    ]}
    layout={{
      title: { text: "Gauss Elimination: Solution Values", font: { color: '#1e3a8a' } },
      xaxis: { title: { text: 'Variable', font: { color: '#1e3a8a' } } },
      yaxis: { title: { text: 'Value', font: { color: '#1e3a8a' } } },
      plot_bgcolor: '#f9fafb',
      paper_bgcolor: '#f9fafb',
      font: { color: '#1e293b' },
      height: 400,
      width: 600,
    }}
  />
</div>


            <h2 style={{ marginTop: "2rem", color: "#1e3a8a", textAlign: "center" }}>
              Results
            </h2>
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

export default GaussEli;