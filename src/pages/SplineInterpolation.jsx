import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header2 from "../components/Header2";

// ✅ CubicSpline class (OOP)
class CubicSpline {
  constructor(points) {
    this.points = points.sort((a, b) => a.x - b.x);
    this.n = this.points.length - 1;
    this.x = this.points.map(p => p.x);
    this.a = this.points.map(p => p.y);
    this.b = Array(this.n).fill(0);
    this.c = Array(this.n + 1).fill(0);
    this.d = Array(this.n).fill(0);
    this.h = Array(this.n);

    for (let i = 0; i < this.n; i++) {
      this.h[i] = this.x[i + 1] - this.x[i];
    }

    const alpha = Array(this.n).fill(0);
    for (let i = 1; i < this.n; i++) {
      alpha[i] = (3 / this.h[i]) * (this.a[i + 1] - this.a[i]) - (3 / this.h[i - 1]) * (this.a[i] - this.a[i - 1]);
    }

    const l = Array(this.n + 1).fill(0);
    const mu = Array(this.n).fill(0);
    const z = Array(this.n + 1).fill(0);

    l[0] = 1;
    for (let i = 1; i < this.n; i++) {
      l[i] = 2 * (this.x[i + 1] - this.x[i - 1]) - this.h[i - 1] * mu[i - 1];
      mu[i] = this.h[i] / l[i];
      z[i] = (alpha[i] - this.h[i - 1] * z[i - 1]) / l[i];
    }
    l[this.n] = 1;

    for (let j = this.n - 1; j >= 0; j--) {
      this.c[j] = z[j] - mu[j] * this.c[j + 1];
      this.b[j] = (this.a[j + 1] - this.a[j]) / this.h[j] - this.h[j] * (this.c[j + 1] + 2 * this.c[j]) / 3;
      this.d[j] = (this.c[j + 1] - this.c[j]) / (3 * this.h[j]);
    }
  }

  evaluate(xVal) {
    let i = this.n - 1;
    for (let j = 0; j < this.n; j++) {
      if (xVal >= this.x[j] && xVal <= this.x[j + 1]) {
        i = j;
        break;
      }
    }
    const dx = xVal - this.x[i];
    return this.a[i] + this.b[i] * dx + this.c[i] * dx ** 2 + this.d[i] * dx ** 3;
  }

  generatePlotPoints(steps = 200) {
    const minX = Math.min(...this.x);
    const maxX = Math.max(...this.x);
    const plotXs = Array.from({ length: steps }, (_, i) => minX + ((maxX - minX) * i) / (steps - 1));
    const plotYs = plotXs.map(x => this.evaluate(x));
    return { plotXs, plotYs };
  }
}

// ✅ React Component
function SplineInterpolation() {
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  const [interpolatedX, setInterpolatedX] = useState("");
  const [interpolatedY, setInterpolatedY] = useState(null);

  const addPoint = () => setPoints([...points, { x: 0, y: 0 }]);
  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = parseFloat(value);
    setPoints(updated);
  };

  const saveHistory = () => {
    const equation = points.map((p) => `(${p.x}, ${p.y})`).join(", ");
    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "Cubic Spline Interpolation",
        points: equation,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("History saved:", data))
      .catch((err) => console.error("Error saving history:", err));
  };

  const calculate = () => {
    if (interpolatedX === "") return;
    const spline = new CubicSpline(points);
    const y = spline.evaluate(parseFloat(interpolatedX));
    setInterpolatedY(y);
    saveHistory();
  };

  const spline = new CubicSpline(points);
  const { plotXs, plotYs } = spline.generatePlotPoints();

  return (
    <>
      <Header2 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Cubic Spline Interpolation</h1>

        {points.map((point, index) => (
          <div key={index} style={{ textAlign: "center", marginBottom: "1rem" }}>
            <label style={{ marginRight: 8 }}>x{index + 1}:</label>
            <input type="number" value={point.x} onChange={(e) => handlePointChange(index, "x", e.target.value)} style={{ marginRight: 16 }} />
            <label style={{ marginRight: 8 }}>y{index + 1}:</label>
            <input type="number" value={point.y} onChange={(e) => handlePointChange(index, "y", e.target.value)} />
          </div>
        ))}

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button onClick={addPoint} style={{ marginRight: 10, padding: "0.4rem 1rem", backgroundColor: "#60a5fa", border: "none", borderRadius: 4, color: "white" }}>
            Add Point
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <label style={{ marginRight: 8 }}>Find f(x) at x = </label>
          <input type="number" value={interpolatedX} onChange={(e) => setInterpolatedX(e.target.value)} style={{ marginRight: 10 }} />
          <button onClick={calculate} style={{ padding: "0.4rem 1rem", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: 4 }}>
            Calculate
          </button>
        </div>

        {interpolatedY !== null && (
          <h3 style={{ textAlign: "center", color: "#1e3a8a" }}>
            Result: f({interpolatedX}) = {interpolatedY.toFixed(6)}
          </h3>
        )}

        {interpolatedY !== null && (
          <>
            <h2 style={{ color: "#1e3a8a", textAlign: "center", marginTop: "2rem" }}>Graph</h2>
            <div style={{ width: 600, height: 400, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: points.map((p) => p.x),
                    y: points.map((p) => p.y),
                    mode: "markers",
                    type: "scatter",
                    name: "Data Points",
                    marker: { color: "red", size: 8 },
                  },
                  {
                    x: plotXs,
                    y: plotYs,
                    mode: "lines",
                    type: "scatter",
                    name: "Spline Curve",
                    line: { color: "#1e3a8a" },
                  },
                ]}
                layout={{
                  title: "Cubic Spline Interpolation",
                  xaxis: { title: "x" },
                  yaxis: { title: "f(x)" },
                  plot_bgcolor: "#f9fafb",
                  paper_bgcolor: "#f9fafb",
                  font: { color: "#1e293b" },
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SplineInterpolation;
