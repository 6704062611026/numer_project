import React, { useState } from "react";
import Plot from "react-plotly.js";
import { evaluate, parse } from "mathjs";
import Header4 from "../components/Header4";

// ✅ Class: Trapezoidal Integration Logic (OOP)
class TrapezoidalIntegrator {
  constructor(fx, a, b) {
    this.fx = fx;
    this.a = parseFloat(a);
    this.b = parseFloat(b);
  }

  validate() {
    try {
      const parsed = parse(this.fx);
      parsed.evaluate({ x: 1 }); // ทดลอง evaluate
      return true;
    } catch (error) {
      return false;
    }
  }

  integrate() {
    const fa = evaluate(this.fx, { x: this.a });
    const fb = evaluate(this.fx, { x: this.b });
    return ((this.b - this.a) / 2) * (fa + fb);
  }

  getFunctionPoints(numPoints = 200) {
    const step = (this.b - this.a) / (numPoints - 1);
    const x = Array.from({ length: numPoints }, (_, i) => this.a + i * step);
    const y = x.map((xi) => evaluate(this.fx, { x: xi }));
    return { x, y };
  }

  getTrapezoidPoints() {
    const fa = evaluate(this.fx, { x: this.a });
    const fb = evaluate(this.fx, { x: this.b });
    return {
      x: [this.a, this.a, this.b, this.b, this.a],
      y: [0, fa, fb, 0, 0],
    };
  }
}

// ✅ React Component
function TrapezoidalIntegrationPage() {
  const [fx, setFx] = useState("x^2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const integrator = new TrapezoidalIntegrator(fx, a, b);
    if (!integrator.validate()) {
      alert("Invalid function expression!");
      return;
    }

    const value = integrator.integrate();
    setResult(value);

    // ✅ บันทึกประวัติ
    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "Simple Trapezoidal",
        equation: fx,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("History saved:", data))
      .catch((err) => console.error("Save history failed:", err));
  };

  // เตรียม plot ถ้ามีผลลัพธ์
  let plotData = [];
  if (result !== null) {
    const integrator = new TrapezoidalIntegrator(fx, a, b);
    const { x, y } = integrator.getFunctionPoints();
    const trapezoid = integrator.getTrapezoidPoints();

    plotData = [
      {
        x,
        y,
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
    ];
  }

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
            onClick={handleCalculate}
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
                data={plotData}
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

export default TrapezoidalIntegrationPage;
