import React, { useState } from "react";
import Plot from "react-plotly.js";
import { evaluate, parse } from "mathjs";
import Header4 from "../components/Header4";

// Class สำหรับ Composite Trapezoidal Rule
class CompositeTrapezoidal {
  constructor(fx, a, b, n) {
    this.fx = fx;
    this.a = a;
    this.b = b;
    this.n = n;
  }

  evaluateFunction(x) {
    return evaluate(this.fx, { x });
  }

  calculate() {
    const h = (this.b - this.a) / this.n;
    let sum = 0.5 * (this.evaluateFunction(this.a) + this.evaluateFunction(this.b));

    for (let i = 1; i < this.n; i++) {
      const x = this.a + i * h;
      sum += this.evaluateFunction(x);
    }

    return h * sum;
  }

  getTrapezoidsData() {
    const h = (this.b - this.a) / this.n;
    const trapezoids = [];

    for (let i = 0; i < this.n; i++) {
      const x0 = this.a + i * h;
      const x1 = x0 + h;
      const y0 = this.evaluateFunction(x0);
      const y1 = this.evaluateFunction(x1);

      trapezoids.push({
        x: [x0, x0, x1, x1],
        y: [0, y0, y1, 0],
      });
    }

    return trapezoids;
  }
}

function CompositeTrapezoidalIntegration() {
  const [fx, setFx] = useState("x^2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [n, setN] = useState(4);
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      const parsed = parse(fx);
      parsed.evaluate({ x: 1 });

      const trapezoidal = new CompositeTrapezoidal(
        fx,
        parseFloat(a),
        parseFloat(b),
        parseInt(n)
      );
      const value = trapezoidal.calculate();
      setResult({ value, trapezoidal });
    } catch {
      alert("Invalid function expression!");
    }

    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "CompositeTrapezoidal",
        equation: fx,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("History saved:", data));
  };

  // เตรียมข้อมูลกราฟ
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

  const trapezoids = result?.trapezoidal?.getTrapezoidsData() || [];

  return (
    <>
      <Header4 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>
          Composite Trapezoidal Rule Integration
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
          <label>n = </label>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            style={{ marginRight: 10, width: 60 }}
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
            ∫ f(x) dx from {a} to {b} ≈ {result.value.toFixed(6)}
          </h3>
        )}

        {result !== null && (
          <>
            <h2
              style={{ color: "#1e3a8a", textAlign: "center", marginTop: "2rem" }}
            >
              Graph with Trapezoids
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
                  ...trapezoids.map((t, i) => ({
                    x: [...t.x, t.x[0]],
                    y: [...t.y, t.y[0]],
                    fill: "toself",
                    fillcolor: "rgba(96,165,250,0.4)",
                    type: "scatter",
                    mode: "lines",
                    line: { color: "rgba(96,165,250,0.7)" },
                    name: i === 0 ? "Trapezoids" : undefined,
                    showlegend: i === 0,
                  })),
                ]}
                layout={{
                  title: "Composite Trapezoidal Approximation of ∫f(x)dx",
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

export default CompositeTrapezoidalIntegration;
