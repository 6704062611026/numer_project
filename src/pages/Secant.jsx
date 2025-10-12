import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Header from "../components/Header";
import Plot from "react-plotly.js";
import SecantMethod from "../utils/SecantMethod";

function Secant() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(2);
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

  const calculateSecant = () => {
    try {
      setErrorMsg("");
      const method = new SecantMethod(equation, x0, x1, tolerance);
      const resultData = method.solve();
      setResults(resultData);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };
fetch("http://localhost:5000/api/history", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    method: "Secant",
    equation: equation,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("History saved:", data);
  });
  return (
    <>
      <Header />
      <div className="App" style={{ padding: "1rem", maxWidth: 700, margin: "auto" }}>
        <h1 style={{ color: "#1e3a8a" }}>Secant Method</h1>

        {/* แสดงสมการ */}
        <div style={{
          marginBottom: "1rem",
          backgroundColor: "#f0f4ff",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
        }}>
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
          <label>x₀:</label>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(e.target.value)}
            style={{ padding: "0.4rem", width: "100%", borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>x₁:</label>
          <input
            type="number"
            value={x1}
            onChange={(e) => setX1(e.target.value)}
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
          onClick={calculateSecant}
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

        {/* ผลลัพธ์ */}
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
                    name: "x (Root)",
                    marker: { color: "blue" },
                  },
                ]}
                layout={{
                  title: "Secant Method: x over Iterations",
                  xaxis: { title: "Iteration" },
                  yaxis: { title: "x" },
                  height: 400,
                  width: 600,
                }}
              />
            </div>

            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Results</h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <p>Estimated Root: <strong>{results[results.length - 1]?.xNew}</strong>
            </p></p> 
            <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>Iteration</th>
                  <th>x₀</th>
                  <th>x₁</th>
                  <th>f(x₀)</th>
                  <th>f(x₁)</th>
                  <th>x<sub>new</sub></th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iteration}</td>
                    <td>{row.xOld}</td>
                    <td>{row.xCurr}</td>
                    <td>{row.fxOld}</td>
                    <td>{row.fxCurr}</td>
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

export default Secant;
