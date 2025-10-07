import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Plot from "react-plotly.js";
import Header from "../components/Header";
import GraphicalMethod from "../utils/GraphicalMethod";

function Graphical() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [xStart, setXStart] = useState(-5);
  const [xEnd, setXEnd] = useState(5);
  const [dataPoints, setDataPoints] = useState([]);

  // แปลง mathjs -> LaTeX
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

  const calculateGraphical = () => {
    const graphical = new GraphicalMethod(equation, xStart, xEnd);
    const points = graphical.generatePoints();
    setDataPoints(points);
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "1rem", maxWidth: 700, margin: "auto" }}>
        <h1 style={{ color: "#1e3a8a" }}>Graphical Method</h1>

        {/* แสดงสมการในรูปแบบ LaTeX */}
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
          <label>X Start:</label>
          <input
            type="number"
            value={xStart}
            onChange={(e) => setXStart(e.target.value)}
            style={{ padding: "0.4rem", width: "100%", borderRadius: 4, border: "1px solid #ccc", marginBottom: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>X End:</label>
          <input
            type="number"
            value={xEnd}
            onChange={(e) => setXEnd(e.target.value)}
            style={{ padding: "0.4rem", width: "100%", borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <button
          onClick={calculateGraphical}
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

        {/* แสดงผลลัพธ์ */}
        {dataPoints.length > 0 && (
          <>
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
            <div style={{ width: "100%", maxWidth: 600, height: 400, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: dataPoints.map((point) => point.x),
                    y: dataPoints.map((point) => point.y),
                    type: "scatter",
                    mode: "lines+markers",
                    name: `f(x)`,
                    marker: { color: "#1e3a8a" },
                    line: { shape: "spline" },
                  },
                ]}
                layout={{
                  title: "Graphical Method: f(x) vs x",
                  xaxis: { title: "x" },
                  yaxis: { title: "f(x)" },
                  autosize: true,
                  height: 400,
                  width: 600,
                }}
                style={{ margin: "0 auto" }}
              />
            </div>

            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Results</h2>
            <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>X</th>
                  <th>f(X)</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.map((point, index) => (
                  <tr key={index}>
                    <td>{point.x}</td>
                    <td>{point.y}</td>
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

export default Graphical;
