import React, { useState } from "react";
import { evaluate } from "mathjs";
import Plot from 'react-plotly.js';
import '../App.css';
import Header from '../components/Header';


function SecantMethod() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(2);
  const [tolerance, setTolerance] = useState(0.000001);
  const [iterations, setIterations] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  const calculateSecant = () => {
    const f = equation;
    const tol = parseFloat(tolerance);
    const maxIter = 100;

    let x_prev = parseFloat(x0);
    let x_curr = parseFloat(x1);
    let x_next;
    let iter = 0;

    const results = [];
    const graphPoints = [];

    while (iter < maxIter) {
      const f_prev = evaluate(f, { x: x_prev });
      const f_curr = evaluate(f, { x: x_curr });

      if (f_curr - f_prev === 0) {
        alert("Division by zero in denominator. Method fails.");
        return;
      }

      x_next = x_curr - f_curr * (x_curr - x_prev) / (f_curr - f_prev);
      const error = Math.abs(x_next - x_curr);

      results.push({
        iteration: iter + 1,
        x_prev: x_prev.toFixed(6),
        x_curr: x_curr.toFixed(6),
        f_prev: f_prev.toFixed(6),
        f_curr: f_curr.toFixed(6),
        x_next: x_next.toFixed(6),
        error: error.toExponential(3),
      });

      graphPoints.push({ x: iter + 1, y: x_next });

      if (error < tol) break;

      x_prev = x_curr;
      x_curr = x_next;
      iter++;
    }

    setIterations(results);
    setDataPoints(graphPoints);
  };

  const chartData = {
    labels: dataPoints.map((point) => point.x),
    datasets: [
      {
        label: `x (Approximate Root)`,
        data: dataPoints.map((point) => point.y),
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
        text: `Secant Method: Convergence`,
        color: "#1e3a8a",
      },
    },
    scales: {
      y: { title: { display: true, text: "x (Root)", color: "#1e3a8a" } },
      x: { title: { display: true, text: "Iteration", color: "#1e3a8a" } },
    },
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "2rem", backgroundColor: "#f9fafb", color: "#1e293b" }}>
        <h1 style={{ color: "#1e3a8a" }}>Secant Method</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>f(x) = </label>
          <input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem", width: "300px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Initial x₀:</label>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />

          <label style={{ marginLeft: "2rem" }}>Initial x₁:</label>
          <input
            type="number"
            value={x1}
            onChange={(e) => setX1(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />

          <label style={{ marginLeft: "2rem" }}>Tolerance:</label>
          <input
            type="number"
            step="0.000001"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />
        </div>

        <button
          className="b"
          onClick={calculateSecant}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Calculate
        </button>

  {iterations.length > 0 && (
  <>
    <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
    <div style={{ width: "600px", height: "400px", margin: "0 auto" }}>
      <Plot
        data={[
          {
            x: dataPoints.map(p => p.x),
            y: dataPoints.map(p => p.y),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'x (Approximate Root)',
            line: { color: '#1e3a8a', width: 2 },
          },
        ]}
        layout={{
          title: {
            text: 'Secant Method: Convergence',
            font: { color: '#1e3a8a' },
          },
          xaxis: {
            title: { text: 'Iteration', font: { color: '#1e3a8a' } },
            dtick: 1,
          },
          yaxis: {
            title: { text: 'x (Root)', font: { color: '#1e3a8a' } },
          },
          plot_bgcolor: '#f9fafb',
          paper_bgcolor: '#f9fafb',
          font: { color: '#1e293b' },
          height: 400,
          width: 600,
        }}
      />
    </div>

    <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Results</h2>
    <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem", backgroundColor: "white" }}>
      <thead style={{ backgroundColor: "#e0e7ff" }}>
        <tr>
          <th>Iteration</th>
          <th>x_prev</th>
          <th>x_curr</th>
          <th>f(x_prev)</th>
          <th>f(x_curr)</th>
          <th>x_next</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody>
        {iterations.map((row, index) => (
          <tr key={index}>
            <td>{row.iteration}</td>
            <td>{row.x_prev}</td>
            <td>{row.x_curr}</td>
            <td>{row.f_prev}</td>
            <td>{row.f_curr}</td>
            <td>{row.x_next}</td>
            <td>{row.error}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}

      </div>
    </>
  );
}

export default SecantMethod;
