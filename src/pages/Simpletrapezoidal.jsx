import React, { useState } from "react";
import Plot from "react-plotly.js";
import { evaluate, parse } from "mathjs";
import Header4 from "../components/Header4";

function simpleTrapezoidalRule(fx, a, b) {
  const fa = evaluate(fx, { x: a });
  const fb = evaluate(fx, { x: b });
  return ((b - a) / 2) * (fa + fb);
}

function SimpleTrapezoidalIntegration() {
  const [fx, setFx] = useState("x^2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      const parsed = parse(fx); // ตรวจสอบว่าเป็นสมการได้
      parsed.evaluate({ x: 1 }); // ลอง evaluate

      const value = simpleTrapezoidalRule(fx, parseFloat(a), parseFloat(b));
      setResult(value);
    } catch (error) {
      alert("Invalid function expression!");
    }
  };

  const plotXs = Array.from({ length: 200 }, (_, i) => {
    const step = (b - a) / 199;
    return parseFloat(a) + i * step;
  });

  const plotYs = plotXs.map((x) => {
    try {
      return evaluate(fx, { x });
    } catch {
      return null;
    }
  });

  // Trapezoid data
  const fa = evaluate(fx, { x: parseFloat(a) });
  const fb = evaluate(fx, { x: parseFloat(b) });
  const trapezoid = {
    x: [a, a, b, b, a],
    y: [0, fa, fb, 0, 0],
  };
fetch("http://localhost:5000/api/history", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    method: "Simpletrapezoidal",
    equation: fx,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("History saved:", data);
  });
  return (
    <>
      <Header4 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>
          Simple Trapezoidal Rule Integration
        </h1>

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <label style={{ marginRight: 8 }}>f(x) = </label>
          <input
            type="text"
            value={fx}
            onChange={(e) => setFx(e.target.value)}
            style={{ marginRight: 20 }}
          />
          <label>a = </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            style={{ margin: "0 10px" }}
          />
          <label>b = </label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            style={{ margin: "0 10px" }}
          />
          <button
            onClick={calculate}
            style={{
              padding: "0.4rem 1rem",
              backgroundColor: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: 4,
              marginLeft: 10,
            }}
          >
            Calculate
          </button>
        </div>

        {result !== null && (
          <h3 style={{ textAlign: "center", color: "#1e3a8a" }}>
            ∫ f(x) dx from {a} to {b} ≈ {result.toFixed(6)}
          </h3>
        )}

        {result !== null && (
          <>
            <h2 style={{ color: "#1e3a8a", textAlign: "center", marginTop: "2rem" }}>
              Graph with Trapezoid
            </h2>
            <div style={{ width: 700, height: 500, margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: plotXs,
                    y: plotYs,
                    mode: "lines",
                    name: "f(x)",
                    line: { color: "#1e3a8a" },
                  },
                  {
                    x: trapezoid.x,
                    y: trapezoid.y,
                    fill: "toself",
                    fillcolor: "rgba(96,165,250,0.4)",
                    type: "scatter",
                    mode: "lines",
                    line: { color: "rgba(96,165,250,0.7)" },
                    name: "Trapezoid",
                  },
                ]}
                layout={{
                  title: "Simple Trapezoidal Approximation of ∫f(x)dx",
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

export default SimpleTrapezoidalIntegration;
