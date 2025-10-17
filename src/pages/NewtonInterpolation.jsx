import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header2 from "../components/Header2";

// ✅ Class NewtonInterpolationMethod (รวมไว้ในไฟล์)
class NewtonInterpolationMethod {
  constructor(points) {
    this.points = points.sort((a, b) => a.x - b.x);
    this.n = points.length;
    this.xs = this.points.map((p) => p.x);
    this.ys = this.points.map((p) => p.y);
    this.dividedDifferenceTable = this.buildDividedDifferenceTable();
  }

  buildDividedDifferenceTable() {
    const n = this.n;
    const table = Array.from({ length: n }, () => Array(n).fill(0));

    // Fill first column with y values
    for (let i = 0; i < n; i++) {
      table[i][0] = this.ys[i];
    }

    // Compute divided differences
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        const numerator = table[i + 1][j - 1] - table[i][j - 1];
        const denominator = this.xs[i + j] - this.xs[i];
        table[i][j] = numerator / denominator;
      }
    }

    return table;
  }

  getTable() {
    return this.dividedDifferenceTable;
  }

  getXs() {
    return this.xs;
  }

  getYs() {
    return this.ys;
  }

  evaluate(x) {
    let result = this.dividedDifferenceTable[0][0];
    let term = 1;

    for (let i = 1; i < this.n; i++) {
      term *= x - this.xs[i - 1];
      result += term * this.dividedDifferenceTable[0][i];
    }

    return result;
  }

  generatePlotPoints(steps = 100) {
    const minX = Math.min(...this.xs);
    const maxX = Math.max(...this.xs);
    const plotXs = [];
    const plotYs = [];

    for (let i = 0; i <= steps; i++) {
      const x = minX + (i * (maxX - minX)) / steps;
      plotXs.push(x);
      plotYs.push(this.evaluate(x));
    }

    return { plotXs, plotYs };
  }
}

// ✅ React Component: NewtonInterpolation
function NewtonInterpolation() {
  const [points, setPoints] = useState([{ x: 0, y: 0 }]);
  const [interpolator, setInterpolator] = useState(null);
  const [dividedDiffTable, setDividedDiffTable] = useState([]);
  const [xs, setXs] = useState([]);
  const [ys, setYs] = useState([]);
  const [plotXs, setPlotXs] = useState([]);
  const [plotYs, setPlotYs] = useState([]);

  const addPoint = () => setPoints([...points, { x: 0, y: 0 }]);

  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = parseFloat(value);
    setPoints(updated);
  };

  const saveHistory = (methodName) => {
    const equation = points.map((p) => `(${p.x}, ${p.y})`).join(", ");
    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: methodName,
        points: equation,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("History saved:", data))
      .catch((err) => console.error("Error saving history:", err));
  };

  const calculate = () => {
    if (points.length < 2) {
      alert("Please enter at least two points.");
      return;
    }

    try {
      const method = new NewtonInterpolationMethod(points);
      const table = method.getTable();
      const { plotXs, plotYs } = method.generatePlotPoints();

      setInterpolator(method);
      setDividedDiffTable(table);
      setXs(method.getXs());
      setYs(method.getYs());
      setPlotXs(plotXs);
      setPlotYs(plotYs);

      saveHistory("Newton Divided-Differences Interpolation");
    } catch (error) {
      alert("Error in interpolation: " + error.message);
    }
  };

  return (
    <>
      <Header2 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Newton Divided-Differences Interpolation</h1>

        {points.map((point, index) => (
          <div key={index} style={{ marginBottom: "1rem", textAlign: "center" }}>
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
            style={{ marginRight: 10, padding: "0.4rem 1rem", backgroundColor: "#60a5fa", border: "none", borderRadius: 4, color: "white" }}
          >
            Add Point
          </button>
          <button
            onClick={calculate}
            style={{ padding: "0.4rem 1rem", backgroundColor: "#1e3a8a", border: "none", borderRadius: 4, color: "white" }}
          >
            Calculate
          </button>
        </div>

        {dividedDiffTable.length > 0 && (
          <>
            <h2 style={{ color: "#1e3a8a", textAlign: "center" }}>Divided Difference Table</h2>
            <table border="1" cellPadding="8" style={{ width: "100%", backgroundColor: "white", textAlign: "center", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>x</th>
                  <th>f[x]</th>
                  {[...Array(points.length - 1)].map((_, i) => (
                    <th key={i}>Δ^{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dividedDiffTable.map((row, i) => (
                  <tr key={i}>
                    <td>{xs[i]}</td>
                    {row.map((val, j) => (
                      <td key={j}>{!isNaN(val) ? val.toFixed(6) : ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 style={{ color: "#1e3a8a", textAlign: "center", marginTop: "2rem" }}>Graph</h2>
            <div style={{ width: 600, height: 400, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: xs,
                    y: ys,
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
                    name: "Interpolation Curve",
                    line: { color: "#1e3a8a" },
                  },
                ]}
                layout={{
                  title: "Newton Interpolated Curve",
                  xaxis: { title: "x" },
                  yaxis: { title: "y" },
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

export default NewtonInterpolation;
