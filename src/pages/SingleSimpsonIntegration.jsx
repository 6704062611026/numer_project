import React, { useState } from "react";
import Plot from "react-plotly.js";
import { evaluate, parse } from "mathjs";
import Header4 from "../components/Header4";

// Class สำหรับ Single Simpson's Rule
class SingleSimpson {
  constructor(fx, a, b) {
    this.fx = fx;
    this.a = a;
    this.b = b;
  }

  evaluateFunction(x) {
    return evaluate(this.fx, { x });
  }

  calculate() {
    const fa = this.evaluateFunction(this.a);
    const fb = this.evaluateFunction(this.b);
    const mid = (this.a + this.b) / 2;
    const fmid = this.evaluateFunction(mid);

    return ((this.b - this.a) / 6) * (fa + 4 * fmid + fb);
  }
}

function SingleSimpsonIntegration() {
  const [fx, setFx] = useState("x^3");
  const [a, setA] = useState(0);
  const [b, setB] = useState(4);
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      const parsed = parse(fx);
      parsed.evaluate({ x: 1 });

      const simpson = new SingleSimpson(fx, parseFloat(a), parseFloat(b));
      const value = simpson.calculate();
      setResult(value);
    } catch (error) {
      alert("Invalid function expression!");
    }

    fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "SingleSimpsonIntegration",
        equation: fx,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("History saved:", data);
      });
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

  return (
    <>
      <Header4 />
      <div className="App" style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>
          Single Simpson's Rule Integration
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
              Graph of f(x)
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
                ]}
                layout={{
                  title: "Function Plot for ∫f(x)dx",
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

export default SingleSimpsonIntegration;
