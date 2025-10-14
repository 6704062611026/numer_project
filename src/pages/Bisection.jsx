import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header from "../components/Header";
import Plot from "react-plotly.js";
import { evaluate } from "mathjs";

// ✅ class BisectionMethod ย้ายมาไว้ในไฟล์นี้
class BisectionMethod {
  constructor(equation, xl, xr, tolerance, maxIterations = 50) {
    this.equation = equation;
    this.xl = parseFloat(xl);
    this.xr = parseFloat(xr);
    this.tolerance = parseFloat(tolerance);
    this.maxIterations = maxIterations;
    this.results = [];
  }

  evaluateAt(x) {
    return evaluate(this.equation, { x });
  }

  solve() {
    let iter = 0;
    let xL = this.xl;
    let xR = this.xr;
    let xm, fxl, fxr, fxm, error;

    this.results = [];

    do {
      xm = (xL + xR) / 2;
      fxl = this.evaluateAt(xL);
      fxr = this.evaluateAt(xR);
      fxm = this.evaluateAt(xm);

      if (fxm * fxr < 0) {
        xL = xm;
      } else {
        xR = xm;
      }

      error = Math.abs((xR - xL) / xm);

      this.results.push({
        iteration: iter + 1,
        xL: xL.toFixed(6),
        xR: xR.toFixed(6),
        xM: xm.toFixed(6),
        fXM: fxm.toFixed(6),
        error: error.toFixed(6),
      });

      iter++;
    } while (error > this.tolerance && iter < this.maxIterations);

    return this.results;
  }
}

function Bisection() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [xl, setXl] = useState(1);
  const [xr, setXr] = useState(2);
  const [tolerance, setTolerance] = useState(0.000001);
  const [results, setResults] = useState([]);

  const mathjsToLatex = (expr) => {
    try {
      return expr
        .replace(/\*/g, " \\cdot ")
        .replace(/\^([0-9]+)/g, "^{$1}")
        .replace(/sin/g, "\\sin")
        .replace(/cos/g, "\\cos")
        .replace(/tan/g, "\\tan");
    } catch {
      return expr;
    }
  };

  const calculateBisection = () => {
    const bisection = new BisectionMethod(equation, xl, xr, tolerance);
    const resultData = bisection.solve();
    setResults(resultData);

    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "Bisection",
        equation: equation,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("History saved:", data))
      .catch((error) => console.error("Error saving history:", error));
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "1rem", maxWidth: 700, margin: "auto" }}>
        <h1 style={{ color: "#1e3a8a" }}>Bisection Method</h1>

        <div
          style={{
            marginBottom: "1rem",
            backgroundColor: "#f0f4ff",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
          }}
        >
          <BlockMath math={`f(x) = ${mathjsToLatex(equation)}`} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Equation:</label>
          <input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>XL:</label>
          <input
            type="number"
            value={xl}
            onChange={(e) => setXl(e.target.value)}
            style={{
              padding: "0.4rem",
              width: "100%",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>XR:</label>
          <input
            type="number"
            value={xr}
            onChange={(e) => setXr(e.target.value)}
            style={{
              padding: "0.4rem",
              width: "100%",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Tolerance:</label>
          <input
            type="number"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            style={{
              padding: "0.4rem",
              width: "100%",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          onClick={calculateBisection}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Calculate
        </button>

        {results.length > 0 && (
          <>
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
            <div style={{ width: "100%", maxWidth: 600, height: 400, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: results.map((row) => row.iteration),
                    y: results.map((row) => parseFloat(row.xM)),
                    type: "scatter",
                    mode: "lines+markers",
                    name: "XM (Approximated Root)",
                    marker: { color: "blue" },
                  },
                  {
                    x: results.map((row) => row.iteration),
                    y: results.map((row) => parseFloat(row.fXM)),
                    type: "scatter",
                    mode: "lines+markers",
                    name: "f(XM)",
                    marker: { color: "red" },
                  },
                ]}
                layout={{
                  title: "Bisection Method: Root Approximation & f(x)",
                  xaxis: { title: "Iteration" },
                  yaxis: { title: "Value" },
                  autosize: true,
                  height: 400,
                  width: 600,
                }}
                style={{ margin: "0 auto" }}
              />
            </div>

            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Results</h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Estimated Root: <strong>{results[results.length - 1]?.xM}</strong>
            </p>

            <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>Iteration</th>
                  <th>XL</th>
                  <th>XR</th>
                  <th>XM</th>
                  <th>f(XM)</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iteration}</td>
                    <td>{row.xL}</td>
                    <td>{row.xR}</td>
                    <td>{row.xM}</td>
                    <td>{row.fXM}</td>
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

export default Bisection;
