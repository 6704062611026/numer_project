import React, { useState } from "react";
import { evaluate, derivative } from "mathjs";
import Plot from 'react-plotly.js';
import '../App.css';
import Header from '../components/Header';

function NewtonRaphson() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [initialGuess, setInitialGuess] = useState(1.5);
  const [tolerance, setTolerance] = useState(0.000001);
  const [iterations, setIterations] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  const calculateNewtonRaphson = () => {
    const f = equation;
    const x0 = parseFloat(initialGuess);
    const tol = parseFloat(tolerance);
    const maxIter = 100;

    let xOld = x0;
    let xNew;
    let iter = 0;
    const results = [];
    const graphPoints = [];

    const df = derivative(f, 'x').toString();

    while (iter < maxIter) {
      const fx = evaluate(f, { x: xOld });
      const dfx = evaluate(df, { x: xOld });

      if (dfx === 0) {
        alert("Derivative is zero. Method fails.");
        return;
      }

      xNew = xOld - fx / dfx;
      const error = Math.abs(xNew - xOld);

      results.push({
        iteration: iter + 1,
        x_old: xOld.toFixed(6),
        fx: fx.toFixed(6),
        dfx: dfx.toFixed(6),
        x_new: xNew.toFixed(6),
        error: error.toExponential(3),
      });

      graphPoints.push({ x: iter + 1, y: xNew });

      if (error < tol) break;

      xOld = xNew;
      iter++;
    }

    setIterations(results);
    setDataPoints(graphPoints);
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "2rem", backgroundColor: "#f9fafb", color: "#1e293b" }}>
        <h1 style={{ color: "#1e3a8a" }}>Newton-Raphson Method</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>f(x) = </label>
          <input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem", width: "300px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Initial Guess (x₀):</label>
          <input
            type="number"
            value={initialGuess}
            onChange={(e) => setInitialGuess(e.target.value)}
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
          onClick={calculateNewtonRaphson}
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
                    x: dataPoints.map((p) => p.x),
                    y: dataPoints.map((p) => p.y),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'x (Approximate Root)',
                    line: { color: '#1e3a8a', width: 2 },
                  },
                ]}
                layout={{
                  title: {
                    text: 'Newton-Raphson Method: Convergence',
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

            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Iterations</h2>
            <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem", backgroundColor: "white" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>Iteration</th>
                  <th>x_old</th>
                  <th>f(x)</th>
                  <th>f'(x)</th>
                  <th>x_new</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {iterations.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iteration}</td>
                    <td>{row.x_old}</td>
                    <td>{row.fx}</td>
                    <td>{row.dfx}</td>
                    <td>{row.x_new}</td>
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

export default NewtonRaphson;
