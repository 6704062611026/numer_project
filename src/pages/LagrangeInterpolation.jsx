import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header2 from "../components/Header2";

// ✅ LagrangeInterpolator class (OOP)
class LagrangeInterpolator {
  constructor(points) {
    this.points = points.sort((a, b) => a.x - b.x);
  }

  evaluate(x) {
    const n = this.points.length;
    let result = 0;

    for (let i = 0; i < n; i++) {
      let term = this.points[i].y;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          term *= (x - this.points[j].x) / (this.points[i].x - this.points[j].x);
        }
      }
      result += term;
    }

    return result;
  }

  generatePlotPoints(steps = 100) {
    const xs = this.points.map(p => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const plotXs = Array.from({ length: steps }, (_, i) => minX + ((maxX - minX) * i) / (steps - 1));
    const plotYs = plotXs.map((x) => this.evaluate(x));
    return { plotXs, plotYs };
  }
}

// ✅ React component
function LagrangeInterpolation() {
  const [points, setPoints] = useState([{ x: 0, y: 0 }]);
  const [interpolatedX, setInterpolatedX] = useState("");
  const [interpolatedY, setInterpolatedY] = useState(null);

  const addPoint = () => setPoints([...points, { x: 0, y: 0 }]);
  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = parseFloat(value);
    setPoints(updated);
  };

  const calculate = () => {
    if (interpolatedX === "") return;
    const interpolator = new LagrangeInterpolator(points);
    const y = interpolator.evaluate(parseFloat(interpolatedX));
    setInterpolatedY(y);
  };

  const interpolator = new LagrangeInterpolator(points);
  const { plotXs, plotYs } = interpolator.generatePlotPoints();

  return (
    <>
      <Header2 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Lagrange Interpolation</h1>

        {points.map((point, index) => (
          <div key={index} style={{ textAlign: "center", marginBottom: "1rem" }}>
            <label style={{ marginRight: 8 }}>x{index + 1}:</label>
            <input
              type="number"
              value={point.x}
              onChange={(e) => handlePointChange(index, "x", e.target.value)}
              style={{ marginRight: 16 }}
            />
            <label style={{ marginRight: 8 }}>y{index + 1}:</label>
            <input
              type="number"
              value={point.y}
              onChange={(e) => handlePointChange(index, "y", e.target.value)}
            />
          </div>
        ))}

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button
            onClick={addPoint}
            style={{
              marginRight: 10,
              padding: "0.4rem 1rem",
              backgroundColor: "#60a5fa",
              border: "none",
              borderRadius: 4,
              color: "white",
            }}
          >
            Add Point
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <label style={{ marginRight: 8 }}>Find f(x) at x = </label>
          <input
            type="number"
            value={interpolatedX}
            onChange={(e) => setInterpolatedX(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button
            onClick={calculate}
            style={{
              padding: "0.4rem 1rem",
              backgroundColor: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
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
                    name: "Points",
                    marker: { color: "red", size: 8 },
                  },
                  {
                    x: plotXs,
                    y: plotYs,
                    mode: "lines",
                    type: "scatter",
                    name: "Interpolated Curve",
                    line: { color: "#1e3a8a" },
                  },
                ]}
                layout={{
                  title: "Lagrange Interpolation",
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

export default LagrangeInterpolation;
