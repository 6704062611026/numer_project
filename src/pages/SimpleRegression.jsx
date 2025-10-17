import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header3 from "../components/Header3";

// ✅ แยก OOP class สำหรับ Simple Linear Regression
class SimpleLinearRegression {
  constructor(points) {
    this.points = points;
    this.n = points.length;
    this.a = 0;
    this.b = 0;
    this.computeCoefficients();
  }

  computeCoefficients() {
    const sumX = this.points.reduce((sum, p) => sum + p.x, 0);
    const sumY = this.points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = this.points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = this.points.reduce((sum, p) => sum + p.x * p.x, 0);

    const meanX = sumX / this.n;
    const meanY = sumY / this.n;

    const numerator = sumXY - this.n * meanX * meanY;
    const denominator = sumX2 - this.n * meanX * meanX;

    this.b = numerator / denominator;
    this.a = meanY - this.b * meanX;
  }

  predict(x) {
    return this.a + this.b * x;
  }

  getEquation() {
    return `f(x) = ${this.a.toFixed(6)} + ${this.b.toFixed(6)} * x`;
  }

  getLineRange(minX, maxX) {
    return [minX, maxX].map((x) => ({
      x,
      y: this.predict(x),
    }));
  }
}

// ✅ React Component
function SimpleRegression() {
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  const [predictX, setPredictX] = useState("");
  const [predictedY, setPredictedY] = useState(null);

  const addPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
    setPredictedY(null);
  };

  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = parseFloat(value);
    setPoints(updated);
    setPredictedY(null);
  };

  const saveHistory = (regression) => {
    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "Simple Regression",
        equation: regression.getEquation(),
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("History saved:", data))
      .catch((err) => console.error("Error saving history:", err));
  };

  const calculate = () => {
    if (predictX === "") return;
    const regression = new SimpleLinearRegression(points);
    const x = parseFloat(predictX);
    const y = regression.predict(x);
    setPredictedY(y);
    saveHistory(regression);
  };

  const regression = new SimpleLinearRegression(points);
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const minX = Math.min(...sortedPoints.map((p) => p.x));
  const maxX = Math.max(...sortedPoints.map((p) => p.x));
  const range = maxX - minX || 1;
  const [p1, p2] = regression.getLineRange(minX - range * 0.2, maxX + range * 0.2);

  return (
    <>
      <Header3 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>
          Simple Linear Regression
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
                    x: [p1.x, p2.x],
                    y: [p1.y, p2.y],
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
