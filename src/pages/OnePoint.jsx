import React, { useState } from "react";
import { evaluate } from "mathjs";
import Plot from 'react-plotly.js';
import '../App.css';
import Header from '../components/Header';

function OnePoint() {
  const [equation, setEquation] = useState("cos(x)");
  const [initialGuess, setInitialGuess] = useState(0.5);
  const [tolerance, setTolerance] = useState(0.000001);
  const [iterations, setIterations] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  const onePointIteration = () => {
    const g = equation;
    const x0 = parseFloat(initialGuess);
    const tol = parseFloat(tolerance);
    const maxIter = 100;

    let xOld = x0;
    let xNew;
    let iter = 0;
    const results = [];
    const graphPoints = [];

    do {
      xNew = evaluate(g, { x: xOld });
      const error = Math.abs(xNew - xOld);

      results.push({
        iteration: iter + 1,
        x_old: xOld.toFixed(6),
        x_new: xNew.toFixed(6),
        error: error.toFixed(6),
      });

      graphPoints.push({
        iteration: iter + 1,
        x_new: parseFloat(xNew.toFixed(6)),
        error: parseFloat(error.toFixed(6)),
      });

      xOld = xNew;
      iter++;
    } while (iter < maxIter && Math.abs(xNew - xOld) > tol);

    setIterations(results);
    setDataPoints(graphPoints);
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "2rem", backgroundColor: "#f9fafb", color: "#1e293b" }}>
        <h1 style={{ color: "#1e3a8a" }}>One-Point Iteration Method</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>g(x) = </label>
          <input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
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
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Tolerance:</label>
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
          onClick={onePointIteration}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "4px" }}
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
                    x: dataPoints.map((p) => p.iteration),
                    y: dataPoints.map((p) => p.x_new),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'x_new',
                    marker: { color: '#1e3a8a' },
                  },
                  {
                    x: dataPoints.map((p) => p.iteration),
                    y: dataPoints.map((p) => p.error),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'error',
                    marker: { color: '#ef4444' },
                  },
                ]}
                layout={{
                  title: {
                    text: 'One-Point Iteration: Convergence Graph',
                    font: { color: '#1e3a8a' }
                  },
                  xaxis: {
                    title: { text: 'Iteration', font: { color: '#1e3a8a' } }
                  },
                  yaxis: {
                    title: { text: 'Value', font: { color: '#1e3a8a' } }
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
                  <th>x_old</th>
                  <th>x_new</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {iterations.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iteration}</td>
                    <td>{row.x_old}</td>
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

export default OnePoint;
