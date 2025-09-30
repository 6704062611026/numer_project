import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Header1 from "./components/Header1";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CholeskyDecomposition() {
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
    const updated = matrixA.map(r => [...r]);
    updated[row][col] = value === "" ? "" : parseFloat(value);
    setMatrixA(updated);
  };

  const handleVectorChange = (i, value) => {
    const updated = [...vectorB];
    updated[i] = value === "" ? "" : parseFloat(value);
    setVectorB(updated);
  };

  const calculateCholesky = () => {
    try {
      const n = matrixSize;
      const A = matrixA.map(row => [...row]);
      const B = [...vectorB];

      // ตรวจสอบว่า A เป็น symmetric หรือไม่
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (A[i][j] !== A[j][i]) {
            alert("Matrix A must be symmetric for Cholesky decomposition.");
            return;
          }
        }
      }

      // สร้างเมทริกซ์ L (lower triangular)
      const L = Array(n).fill().map(() => Array(n).fill(0));

      // Cholesky decomposition
      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
          let sum = 0;

          for (let k = 0; k < j; k++) {
            sum += L[i][k] * L[j][k];
          }

          if (i === j) {
            const val = A[i][i] - sum;
            if (val <= 0) {
              alert("Matrix is not positive definite.");
              return;
            }
            L[i][j] = Math.sqrt(val);
          } else {
            L[i][j] = (1.0 / L[j][j]) * (A[i][j] - sum);
          }
        }
      }

      // Solve Ly = B (forward substitution)
      const y = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += L[i][j] * y[j];
        }
        y[i] = (B[i] - sum) / L[i][i];
      }

      // Solve L^T x = y (backward substitution)
      const x = Array(n).fill(0);
      for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
          sum += L[j][i] * x[j]; // note L^T
        }
        x[i] = (y[i] - sum) / L[i][i];
      }

      setSolution(x.map(val => val.toFixed(6)));
    } catch (error) {
      alert(error.message || "Invalid input.");
    }
  };

  // กำหนดความกว้างอินพุต
  const inputWidth = 60;
  const inputMargin = 8;
  const totalWidth = (inputWidth + inputMargin) * matrixSize;

  const chartData = {
    labels: solution.map((_, i) => `x${i + 1}`),
    datasets: [
      {
        label: "Solution x Values",
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
        text: "Cholesky Decomposition: Solution Values",
        color: "#1e3a8a",
      },
    },
    scales: {
      y: { title: { display: true, text: "Value", color: "#1e3a8a" } },
      x: { title: { display: true, text: "Variable", color: "#1e3a8a" } },
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
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Cholesky Decomposition Method</h1>

        {/* Matrix Size */}
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

        {/* Matrix A */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ textAlign: "center" }}>Matrix A (Symmetric, Positive Definite):</h3>
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

        {/* Vector B */}
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

        {/* Calculate Button */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button
            onClick={calculateCholesky}
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

        {/* Graph */}
        {solution.length > 0 && (
          <>
            <h2 style={{ color: "#1e3a8a", textAlign: "center" }}>Graph</h2>
            <div style={{ width: 600, height: 400, margin: "0 auto" }}>
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Solution Table */}
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a", textAlign: "center" }}>
              Solution
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

export default CholeskyDecomposition;
//Hello