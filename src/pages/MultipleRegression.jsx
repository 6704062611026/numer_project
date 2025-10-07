import React, { useState } from "react";
import Plot from "react-plotly.js";
import Header3 from "../components/Header3";
import * as math from "mathjs";


function computeMultipleRegression(points) {
  const n = points.length;
  let sumX1 = 0, sumX2 = 0, sumY = 0;
  let sumX1X1 = 0, sumX2X2 = 0, sumX1X2 = 0;
  let sumX1Y = 0, sumX2Y = 0;

  for (let i = 0; i < n; i++) {
    const { x1, x2, y } = points[i];
    sumX1 += x1;
    sumX2 += x2;
    sumY += y;
    sumX1X1 += x1 * x1;
    sumX2X2 += x2 * x2;
    sumX1X2 += x1 * x2;
    sumX1Y += x1 * y;
    sumX2Y += x2 * y;
  }

  const X = [
    [sumX1X1, sumX1X2, sumX1],
    [sumX1X2, sumX2X2, sumX2],
    [sumX1, sumX2, n],
  ];

  const Y = [sumX1Y, sumX2Y, sumY];

  // แก้สมการเมทริกซ์: [a, b1, b2]
  const inverse = math.inv(X); // ใช้ mathjs
  const coefficients = math.multiply(inverse, Y);

  return {
    b1: coefficients[0],
    b2: coefficients[1],
    a: coefficients[2],
  };
}

// ประเมิน y จากสูตร regression
function predictY(a, b1, b2, x1, x2) {
  return a + b1 * x1 + b2 * x2;
}

function MultipleRegression() {
  const [points, setPoints] = useState([
    { x1: 1, x2: 2, y: 10 },
    { x1: 2, x2: 1, y: 12 },
    { x1: 3, x2: 4, y: 20 },
  ]);

  const [inputX1, setInputX1] = useState("");
  const [inputX2, setInputX2] = useState("");
  const [predictedY, setPredictedY] = useState(null);

  const addPoint = () => {
    setPoints([...points, { x1: 0, x2: 0, y: 0 }]);
  };

  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = parseFloat(value);
    setPoints(updated);
    setPredictedY(null); // reset result
  };

  const calculate = () => {
    if (inputX1 === "" || inputX2 === "") return;
    const { a, b1, b2 } = computeMultipleRegression(points);
    const y = predictY(a, b1, b2, parseFloat(inputX1), parseFloat(inputX2));
    setPredictedY(y);
  };

  const { a, b1, b2 } = computeMultipleRegression(points);

  // เตรียมข้อมูลสำหรับ surface plot
  const x1s = [...new Set(points.map(p => p.x1))];
  const x2s = [...new Set(points.map(p => p.x2))];
  const x1Grid = Array.from({ length: 10 }, (_, i) => Math.min(...x1s) + i * ((Math.max(...x1s) - Math.min(...x1s)) / 9));
  const x2Grid = Array.from({ length: 10 }, (_, i) => Math.min(...x2s) + i * ((Math.max(...x2s) - Math.min(...x2s)) / 9));

  const zGrid = x1Grid.map(x1 =>
    x2Grid.map(x2 => predictY(a, b1, b2, x1, x2))
  );

  return (
    <>
      <Header3 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>
          Multiple Linear Regression (2 Variables)
        </h1>

        {points.map((point, index) => (
          <div key={index} style={{ textAlign: "center", marginBottom: "1rem" }}>
            <label style={{ marginRight: 8 }}>x1-{index + 1}:</label>
            <input
              type="number"
              value={point.x1}
              onChange={(e) => handlePointChange(index, "x1", e.target.value)}
              style={{ marginRight: 16 }}
            />
            <label style={{ marginRight: 8 }}>x2-{index + 1}:</label>
            <input
              type="number"
              value={point.x2}
              onChange={(e) => handlePointChange(index, "x2", e.target.value)}
              style={{ marginRight: 16 }}
            />
            <label style={{ marginRight: 8 }}>y-{index + 1}:</label>
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
          <label style={{ marginRight: 8 }}>Predict y at x1 = </label>
          <input
            type="number"
            value={inputX1}
            onChange={(e) => setInputX1(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <label style={{ marginRight: 8 }}>x2 = </label>
          <input
            type="number"
            value={inputX2}
            onChange={(e) => setInputX2(e.target.value)}
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
            Predicted: y({inputX1}, {inputX2}) = {predictedY.toFixed(6)}
          </h3>
        )}

        {predictedY !== null && (
          <>
            <h2 style={{ color: "#1e3a8a", textAlign: "center", marginTop: "2rem" }}>
              3D Regression Surface
            </h2>
            <div style={{ width: 700, height: 500, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: points.map(p => p.x1),
                    y: points.map(p => p.x2),
                    z: points.map(p => p.y),
                    mode: "markers",
                    type: "scatter3d",
                    name: "Data Points",
                    marker: { color: "red", size: 5 },
                  },
                  {
                    x: x1Grid,
                    y: x2Grid,
                    z: zGrid,
                    type: "surface",
                    name: "Regression Surface",
                    opacity: 0.6,
                    colorscale: "Blues",
                  },
                  {
                    x: [parseFloat(inputX1)],
                    y: [parseFloat(inputX2)],
                    z: [predictedY],
                    mode: "markers",
                    type: "scatter3d",
                    name: "Predicted Point",
                    marker: { color: "green", size: 6, symbol: "diamond" },
                  },
                ]}
                layout={{
                  scene: {
                    xaxis: { title: "x1" },
                    yaxis: { title: "x2" },
                    zaxis: { title: "y" },
                  },
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

export default MultipleRegression;
