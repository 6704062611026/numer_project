import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header from "../components/Header";
import Plot from "react-plotly.js";
import { evaluate } from "mathjs";

// ✅ class OnePointMethod (OOP style)
class OnePointMethod {
  constructor(equation, initialGuess, tolerance, maxIterations = 50) {
    this.equation = equation;
    this.x0 = parseFloat(initialGuess);
    this.tolerance = parseFloat(tolerance);
    this.maxIterations = maxIterations;
    this.results = [];
  }

  solve() {
    let xOld = this.x0;
    let iter = 0;
    let xNew, error;

    do {
      try {
        xNew = evaluate(this.equation, { x: xOld });
        error = Math.abs((xNew - xOld) / xNew);
      } catch (err) {
        throw new Error("Invalid equation or evaluation error");
      }

      this.results.push({
        iteration: iter + 1,
        xOld: parseFloat(xOld.toFixed(6)),
        xNew: parseFloat(xNew.toFixed(6)),
        error: parseFloat(error.toFixed(6)),
      });

      xOld = xNew;
      iter++;
    } while (error > this.tolerance && iter < this.maxIterations);

    return this.results;
  }
}

// ✅ React Component
function OnePoint() {
  const [equation, setEquation] = useState("cos(x)");
  const [initialGuess, setInitialGuess] = useState(0.5);
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
        .replace(/tan/g, "\\tan")
        .replace(/exp/g, "\\exp");
    } catch {
      return expr;
    }
  };

  const calculateOnePoint = () => {
    try {
      setErrorMsg("");
      const onePoint = new OnePointMethod(equation, initialGuess, tolerance);
      const data = onePoint.solve();
      setResults(data);

      // บันทึกประวัติ (optional)
      fetch("http://localhost:5000/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "OnePoint",
          equation,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("History saved:", data));
    } catch (error) {
      setErrorMsg("⚠️ Invalid equation or input.");
      setResults([]);
    }
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "1rem", maxWidth: 700, margin: "auto" }}>
        <h1 style={{ color: "#1e3a8a" }}>One-Point Iteration Method</h1>

        <div style={{
          marginBottom: "1rem",
          backgroundColor: "#f0f4ff",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
        }}>
          <BlockMath math={`x = ${mathjsToLatex(equation)}`} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Equation (in form x = g(x)):</label>
          <input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem", borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Initial Guess (x₀):</label>
          <input
            type="number"
            value={initialGuess}
            onChange={(e) => setInitialGuess(e.target.value)}
            style={{ padding: "0.4rem", width: "100%", borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Tolerance:</label>
          <input
            type="number"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            style={{ padding: "0.4rem", width: "100%", borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <button
          onClick={calculateOnePoint}
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
            <strong>{errorMsg}</strong>
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
                    y: results.map((row) => row.xNew),
                    type: "scatter",
                    mode: "lines+markers",
                    name: "x (next guess)",
                    marker: { color: "blue" },
                  },
                ]}
                layout={{
                  title: "One-Point Iteration: x over Iterations",
                  xaxis: { title: "Iteration" },
                  yaxis: { title: "x" },
                  autosize: true,
                  height: 400,
                  width: 600,
                }}
                style={{ margin: "0 auto" }}
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
                  <th>x<sub>new</sub></th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iteration}</td>
                    <td>{row.xOld}</td>
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

export default OnePoint;
