import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header from "../components/Header";
import Plot from "react-plotly.js";
import { evaluate, parse, derivative } from "mathjs";

function NewtonRaphson() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [x0, setX0] = useState(1.5);
  const [tolerance, setTolerance] = useState(0.000001);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

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

  const solveNewtonRaphson = (eq, x0, tol, maxIter = 50) => {
    const expr = parse(eq);
    const diffExpr = derivative(expr, "x");

    const results = [];
    let iter = 0;
    let xOld = parseFloat(x0);
    let xNew, fx, fpx, error;

    do {
      fx = expr.evaluate({ x: xOld });
      fpx = diffExpr.evaluate({ x: xOld });

      if (fpx === 0) {
        throw new Error("Derivative is zero. Cannot proceed.");
      }

      xNew = xOld - fx / fpx;
      error = Math.abs((xNew - xOld) / xNew);

      results.push({
        iteration: iter + 1,
        xOld: xOld.toFixed(6),
        fx: fx.toFixed(6),
        fpx: fpx.toFixed(6),
        xNew: xNew.toFixed(6),
        error: error.toFixed(6),
      });

      xOld = xNew;
      iter++;
    } while (error > tol && iter < maxIter);

    return results;
  };

  const calculateNewtonRaphson = () => {
    try {
      setErrorMsg("");
      const resultData = solveNewtonRaphson(equation, x0, tolerance);
      setResults(resultData);
    } catch (error) {
      setErrorMsg(error.message);
      setResults([]);
    }

    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "NewtonRaphson",
        equation: equation,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("History saved:", data);
      });
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "1rem", maxWidth: 700, margin: "auto" }}>
        <h1 style={{ color: "#1e3a8a" }}>Newton-Raphson Method</h1>

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
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem", borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Initial x₀:</label>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(e.target.value)}
            style={{ width: "100%", padding: "0.4rem", borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Tolerance:</label>
          <input
            type="number"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            style={{ width: "100%", padding: "0.4rem", borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <button
          onClick={calculateNewtonRaphson}
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

        {errorMsg && (
          <div style={{ color: "red", marginTop: "1rem" }}>
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {results.length > 0 && (
          <>
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
            <div style={{ width: "100%", maxWidth: 600, height: 400, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: results.map((row) => row.iteration),
                    y: results.map((row) => parseFloat(row.xNew)),
                    type: "scatter",
                    mode: "lines+markers",
                    name: "x (Approximated Root)",
                    marker: { color: "blue" },
                  },
                ]}
                layout={{
                  title: "Newton-Raphson: x over Iterations",
                  xaxis: { title: "Iteration" },
                  yaxis: { title: "x" },
                  height: 400,
                  width: 600,
                }}
              />
            </div>

            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Results</h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Estimated Root: <strong>{results[results.length - 1]?.xNew}</strong>
            </p>

            <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>Iteration</th>
                  <th>x<sub>old</sub></th>
                  <th>f(x)</th>
                  <th>f'(x)</th>
                  <th>x<sub>new</sub></th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iteration}</td>
                    <td>{row.xOld}</td>
                    <td>{row.fx}</td>
                    <td>{row.fpx}</td>
                    <td>{row.xNew}</td>
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
