import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header3 from "../components/Header3";

function SimpleRegression() {
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  const [predictX, setPredictX] = useState("");
  const [predictedY, setPredictedY] = useState(null);

  const addPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = parseFloat(value);
    setPoints(updated);
    setPredictedY(null); // Reset result if data changes
  };

  const calculateRegression = () => {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);

    const meanX = sumX / n;
    const meanY = sumY / n;

    const b = (sumXY - n * meanX * meanY) / (sumX2 - n * meanX * meanX);
    const a = meanY - b * meanX;

    return { a, b };
  };

  const calculate = () => {
    if (predictX === "") return;
    const { a, b } = calculateRegression();
    const x = parseFloat(predictX);
    const y = a + b * x;
    setPredictedY(y);
  };

  const { a, b } = calculateRegression();
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const minX = Math.min(...sortedPoints.map(p => p.x));
  const maxX = Math.max(...sortedPoints.map(p => p.x));
  const range = maxX - minX;
  const plotXs = [minX - range * 0.2, maxX + range * 0.2];
  const plotYs = plotXs.map(x => a + b * x);

  return (
    <>
      <Header3 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>
          Simple Linear Regression (with Extrapolation)
        </h1>

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
          <label style={{ marginRight: 8 }}>Predict f(x) at x = </label>
          <input
            type="number"
            value={predictX}
            onChange={(e) => setPredictX(e.target.value)}
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

        {predictedY !== null && (
          <h3 style={{ textAlign: "center", color: "#1e3a8a" }}>
            Predicted: f({predictX}) = {predictedY.toFixed(6)}
          </h3>
        )}

        {predictedY !== null && (
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
                    name: "Regression Line",
                    line: { color: "#1e3a8a" },
                  },
                  {
                    x: [parseFloat(predictX)],
                    y: [predictedY],
                    mode: "markers",
                    type: "scatter",
                    name: "Extrapolated Point",
                    marker: { color: "green", size: 10, symbol: "cross" },
                  },
                ]}
                layout={{
                  title: "Simple Linear Regression",
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

export default SimpleRegression;
