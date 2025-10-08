import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header2 from "../components/Header2";
import NewtonInterpolationMethod from "../utils/NewtonInterpolationMethod";

function NewtonInterpolation() {
  const [points, setPoints] = useState([{ x: 0, y: 0 }]);
  const [interpolator, setInterpolator] = useState(null);
  const [dividedDiffTable, setDividedDiffTable] = useState([]);
  const [xs, setXs] = useState([]);
  const [ys, setYs] = useState([]);
  const [plotXs, setPlotXs] = useState([]);
  const [plotYs, setPlotYs] = useState([]);

  const addPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = parseFloat(value);
    setPoints(updated);
  };

  const calculate = () => {
    const method = new NewtonInterpolationMethod(points);
    const table = method.getTable();
    const { plotXs, plotYs } = method.generatePlotPoints();

    setInterpolator(method);
    setDividedDiffTable(table);
    setXs(method.getXs());
    setYs(method.getYs());
    setPlotXs(plotXs);
    setPlotYs(plotYs);
  };

  return (
    <>
      <Header2 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Newton Divided-Differences Interpolation</h1>

        {/* Input Points */}
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

        {/* Divided Difference Table */}
        {dividedDiffTable.length > 0 && (
          <>
            <h2 style={{ color: "#1e3a8a", textAlign: "center" }}>Divided Difference Table</h2>
            <table
              border="1"
              cellPadding="8"
              style={{
                width: "100%",
                backgroundColor: "white",
                textAlign: "center",
                borderCollapse: "collapse",
              }}
            >
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

            {/* Graph */}
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
