import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header2 from "../components/Header2";

// ฟังก์ชันสร้าง Natural Cubic Spline
function computeSpline(points) {
  const n = points.length - 1;
  const a = points.map(p => p.y);
  const x = points.map(p => p.x);
  const h = Array(n);
  for (let i = 0; i < n; i++) {
    h[i] = x[i + 1] - x[i];
  }

  const alpha = Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    alpha[i] =
      (3 / h[i]) * (a[i + 1] - a[i]) -
      (3 / h[i - 1]) * (a[i] - a[i - 1]);
  }

  const l = Array(n + 1).fill(0);
  const mu = Array(n).fill(0);
  const z = Array(n + 1).fill(0);
  l[0] = 1;

  for (let i = 1; i < n; i++) {
    l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  l[n] = 1;

  const c = Array(n + 1).fill(0);
  const b = Array(n).fill(0);
  const d = Array(n).fill(0);

  for (let j = n - 1; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] =
      (a[j + 1] - a[j]) / h[j] -
      (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  // คืนค่าพารามิเตอร์ spline
  return { a, b, c, d, x };
}

// ฟังก์ชันประเมินค่า spline
function evaluateSpline(spline, xVal) {
  const { a, b, c, d, x } = spline;
  let i = x.length - 2;

  for (let j = 0; j < x.length - 1; j++) {
    if (xVal >= x[j] && xVal <= x[j + 1]) {
      i = j;
      break;
    }
  }

  const dx = xVal - x[i];
  return (
    a[i] +
    b[i] * dx +
    c[i] * dx ** 2 +
    d[i] * dx ** 3
  );
}

function SplineInterpolation() {
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  const [interpolatedX, setInterpolatedX] = useState("");
  const [interpolatedY, setInterpolatedY] = useState(null);

  const addPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = parseFloat(value);
    setPoints(updated);
  };

  const calculate = () => {
    if (interpolatedX === "") return;
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const spline = computeSpline(sorted);
    const y = evaluateSpline(spline, parseFloat(interpolatedX));
    setInterpolatedY(y);
  };

  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const minX = Math.min(...sortedPoints.map((p) => p.x));
  const maxX = Math.max(...sortedPoints.map((p) => p.x));
  const spline = computeSpline(sortedPoints);
  const plotXs = Array.from({ length: 200 }, (_, i) => minX + ((maxX - minX) * i) / 199);
  const plotYs = plotXs.map((x) => evaluateSpline(spline, x));

  return (
    <>
      <Header2 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Cubic Spline Interpolation</h1>

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

        {interpolatedY !== null && (() => {
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const spline = computeSpline(sortedPoints);
  const minX = Math.min(...sortedPoints.map((p) => p.x));
  const maxX = Math.max(...sortedPoints.map((p) => p.x));
  const plotXs = Array.from({ length: 200 }, (_, i) => minX + ((maxX - minX) * i) / 199);
  const plotYs = plotXs.map((x) => evaluateSpline(spline, x));

  return (
    <>
      <h2 style={{ color: "#1e3a8a", textAlign: "center", marginTop: "2rem" }}>Graph</h2>
      <div style={{ width: 600, height: 400, margin: "0 auto" }}>
        <Plot
          data={[
            {
              x: sortedPoints.map((p) => p.x),
              y: sortedPoints.map((p) => p.y),
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
  );
})()}

      </div>
    </>
  );
}

export default SplineInterpolation;
