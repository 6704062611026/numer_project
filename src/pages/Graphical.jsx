import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Plot from "react-plotly.js";
import Header from "../components/Header";
import { evaluate } from "mathjs";

// ✅ GraphicalMethod class (OOP)
class GraphicalMethod {
  constructor(equation, xStart, xEnd, tolerance = 1e-6, step = 0.1) {
    this.equation = equation;
    this.xStart = parseFloat(xStart);
    this.xEnd = parseFloat(xEnd);
    this.tolerance = parseFloat(tolerance);
    this.step = step;
    this.dataPoints = [];
  }

  evaluateAt(x) {
    try {
      return evaluate(this.equation, { x });
    } catch {
      return NaN;
    }
  }

  generatePoints() {
    const points = [];
    for (let x = this.xStart; x <= this.xEnd; x += this.step) {
      const y = this.evaluateAt(x);
      points.push({
        x: parseFloat(x.toFixed(6)),
        y: parseFloat(y.toFixed(10)),
      });
    }
    this.dataPoints = points;
    return points;
  }

  findRootByZoomIn(maxDepth = 10) {
    const recursiveSearch = (xStart, xEnd, step, depth) => {
      let closestX = null;
      let closestY = Infinity;

      for (let x = xStart; x <= xEnd; x += step) {
        const y = this.evaluateAt(x);
        if (!isNaN(y) && Math.abs(y) < Math.abs(closestY)) {
          closestX = x;
          closestY = y;
        }
      }

      if (Math.abs(closestY) <= this.tolerance || depth >= maxDepth) {
        return { x: parseFloat(closestX.toFixed(8)), y: parseFloat(closestY.toFixed(10)) };
      }

      const newStart = closestX - step;
      const newEnd = closestX + step;
      const newStep = step / 10;

      return recursiveSearch(newStart, newEnd, newStep, depth + 1);
    };

    return recursiveSearch(this.xStart, this.xEnd, this.step, 0);
  }

  appendErrorFromEstimatedRoot(estimatedRoot) {
    return this.dataPoints.map((point) => {
      const error = Math.abs((point.x - estimatedRoot) / estimatedRoot);
      return {
        ...point,
        error: parseFloat(error.toFixed(6)),
      };
    });
  }
}

// ✅ React Component
function Graphical() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [xStart, setXStart] = useState(-5);
  const [xEnd, setXEnd] = useState(5);
  const [tolerance, setTolerance] = useState(0.000001);
  const [dataPoints, setDataPoints] = useState([]);
  const [estimatedRoot, setEstimatedRoot] = useState(null);

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
    const graphical = new GraphicalMethod(equation, xStart, xEnd, tolerance);
    const points = graphical.generatePoints();
    const estimated = graphical.findRootByZoomIn();

    if (Math.abs(estimated.y) > tolerance) {
      alert(`ไม่พบค่า f(x) ที่เข้าใกล้ 0 ภายใน tolerance ที่กำหนด`);
      setDataPoints([]);
      setEstimatedRoot(null);
      return;
    }

    const withError = graphical.appendErrorFromEstimatedRoot(estimated.x);
    setDataPoints(withError);
    setEstimatedRoot(estimated.x);

    // Optional: Save history
    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "Graphical",
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
        <h1 style={{ color: "#1e3a8a" }}>Graphical Method</h1>

        <div style={{ marginBottom: "1rem", backgroundColor: "#f0f4ff", padding: "1rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
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
            style={{ padding: "0.4rem", width: "100%", borderRadius: 4, border: "1px solid #ccc" }}
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

        <div style={{ marginBottom: "1rem" }}>
          <label>Error Tolerance:</label>
          <input
            type="number"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            step="any"
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

        {dataPoints.length > 0 && (
          <>
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
            <div style={{ width: "100%", maxWidth: 600, height: 400, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: dataPoints.map((p) => p.x),
                    y: dataPoints.map((p) => p.y),
                    type: "scatter",
                    mode: "lines+markers",
                    name: "f(x)",
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
            <p>Estimated Root: <strong>{estimatedRoot}</strong></p>

            <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>iteration</th>
                  <th>X</th>
                  <th>f(X)</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.map((point, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{point.x}</td>
                    <td>{point.y}</td>
                    <td>{point.error}</td>
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
