import React, { useState } from "react";
import { evaluate, derivative } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import Header5 from "../components/Header5";

// ✅ OOP Class: NumericalDifferentiator
class NumericalDifferentiator {
  constructor(fx, x, h, direction, order) {
    this.fx = fx;
    this.x = parseFloat(x);
    this.h = parseFloat(h);
    this.direction = direction;
    this.order = order;
  }

  evaluateAt(val) {
    return evaluate(this.fx, { x: val });
  }

  approximate() {
    const x = this.x;
    const h = this.h;
    const order = this.order;
    const values = {};
    let approx = null;

    switch (this.direction) {
      case "forward":
        if (order === 1) {
          values.f_x = this.evaluateAt(x);
          values.f_xh = this.evaluateAt(x + h);
          approx = (values.f_xh - values.f_x) / h;
        } else if (order === 2) {
          values.f_x = this.evaluateAt(x);
          values.f_xh = this.evaluateAt(x + h);
          values.f_x2h = this.evaluateAt(x + 2 * h);
          approx = (values.f_x2h - 2 * values.f_xh + values.f_x) / (h ** 2);
        } else if (order === 3) {
          values.f_x = this.evaluateAt(x);
          values.f_xh = this.evaluateAt(x + h);
          values.f_x2h = this.evaluateAt(x + 2 * h);
          values.f_x3h = this.evaluateAt(x + 3 * h);
          approx = (-values.f_x3h + 3 * values.f_x2h - 3 * values.f_xh + values.f_x) / (h ** 3);
        } else if (order === 4) {
          values.f_x = this.evaluateAt(x);
          values.f_xh = this.evaluateAt(x + h);
          values.f_x2h = this.evaluateAt(x + 2 * h);
          values.f_x3h = this.evaluateAt(x + 3 * h);
          values.f_x4h = this.evaluateAt(x + 4 * h);
          approx = (values.f_x4h - 4 * values.f_x3h + 6 * values.f_x2h - 4 * values.f_xh + values.f_x) / (h ** 4);
        }
        break;

      case "backward":
        if (order === 1) {
          values.f_x = this.evaluateAt(x);
          values.f_xmh = this.evaluateAt(x - h);
          approx = (values.f_x - values.f_xmh) / h;
        } else if (order === 2) {
          values.f_x = this.evaluateAt(x);
          values.f_xmh = this.evaluateAt(x - h);
          values.f_xm2h = this.evaluateAt(x - 2 * h);
          approx = (values.f_x - 2 * values.f_xmh + values.f_xm2h) / (h ** 2);
        } else if (order === 3) {
          values.f_x = this.evaluateAt(x);
          values.f_xmh = this.evaluateAt(x - h);
          values.f_xm2h = this.evaluateAt(x - 2 * h);
          values.f_xm3h = this.evaluateAt(x - 3 * h);
          approx = (values.f_x - 3 * values.f_xmh + 3 * values.f_xm2h - values.f_xm3h) / (h ** 3);
        } else if (order === 4) {
          values.f_x = this.evaluateAt(x);
          values.f_xmh = this.evaluateAt(x - h);
          values.f_xm2h = this.evaluateAt(x - 2 * h);
          values.f_xm3h = this.evaluateAt(x - 3 * h);
          values.f_xm4h = this.evaluateAt(x - 4 * h);
          approx = (values.f_x - 4 * values.f_xmh + 6 * values.f_xm2h - 4 * values.f_xm3h + values.f_xm4h) / (h ** 4);
        }
        break;

      case "central":
      default:
        if (order === 1) {
          values.f_xh = this.evaluateAt(x + h);
          values.f_xmh = this.evaluateAt(x - h);
          approx = (values.f_xh - values.f_xmh) / (2 * h);
        } else if (order === 2) {
          values.f_x = this.evaluateAt(x);
          values.f_xh = this.evaluateAt(x + h);
          values.f_xmh = this.evaluateAt(x - h);
          approx = (values.f_xh - 2 * values.f_x + values.f_xmh) / (h ** 2);
        } else if (order === 3) {
          values.f_xp2h = this.evaluateAt(x + 2 * h);
          values.f_xp1h = this.evaluateAt(x + h);
          values.f_xm1h = this.evaluateAt(x - h);
          values.f_xm2h = this.evaluateAt(x - 2 * h);
          approx = (values.f_xm2h - 2 * values.f_xm1h + 2 * values.f_xp1h - values.f_xp2h) / (2 * h ** 3);
        } else if (order === 4) {
          values.f_x = this.evaluateAt(x);
          values.f_xp1h = this.evaluateAt(x + h);
          values.f_xp2h = this.evaluateAt(x + 2 * h);
          values.f_xm1h = this.evaluateAt(x - h);
          values.f_xm2h = this.evaluateAt(x - 2 * h);
          approx = (values.f_xm2h - 4 * values.f_xm1h + 6 * values.f_x - 4 * values.f_xp1h + values.f_xp2h) / (h ** 4);
        }
        break;
    }

    return { approx, values };
  }

  exactDerivative() {
    let d = this.fx;
    for (let i = 0; i < this.order; i++) {
      d = derivative(d, "x");
    }
    return d.evaluate({ x: this.x });
  }

  calculate() {
    const { approx, values } = this.approximate();
    const exact = this.exactDerivative();
    const error = Math.abs((approx - exact) / exact) * 100;

    return { approx, exact, error, values };
  }
}

// ✅ React Component
function NumericalDifferentiation() {
  const [fx, setFx] = useState("x^2");
  const [x, setX] = useState(2);
  const [h, setH] = useState(0.01);
  const [direction, setDirection] = useState("central");
  const [order, setOrder] = useState(1);
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      const diff = new NumericalDifferentiator(fx, x, h, direction, order);
      const resultData = diff.calculate();
      setResult(resultData);

      fetch("http://localhost:5000/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "NumericalDifferentiation",
          equation: fx,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("History saved:", data));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const renderFormula = () => {
    const xi = parseFloat(x);
    const hh = parseFloat(h);
    const v = result?.values || {};
    const f = (val) => val?.toFixed(6);

    if (direction === "central" && order === 4) {
      return (
        <>
          <BlockMath math={`f^{(4)}(x) \\approx \\frac{f(x - 2h) - 4f(x - h) + 6f(x) - 4f(x + h) + f(x + 2h)}{h^4}`} />
          <BlockMath math={`= \\frac{${f(v.f_xm2h)} - 4(${f(v.f_xm1h)}) + 6(${f(v.f_x)}) - 4(${f(v.f_xp1h)}) + ${f(v.f_xp2h)}}{${(hh ** 4).toFixed(6)}}`} />
          <BlockMath math={`= ${result.approx.toFixed(6)}`} />
        </>
      );
    }

    return (
      <BlockMath math={`\\text{No detailed formula rendered for this case yet.}`} />
    );
  };

  return (
    <>
      <Header5 />
      <div style={{ padding: "2rem", maxWidth: 700, margin: "auto" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Numerical Differentiation</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>f(x): </label>
          <input type="text" value={fx} onChange={(e) => setFx(e.target.value)} style={{ width: "90%" }} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>x: </label>
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>h: </label>
          <input type="number" step="0.001" value={h} onChange={(e) => setH(e.target.value)} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Direction: </label>
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="forward">Forward</option>
            <option value="backward">Backward</option>
            <option value="central">Central</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Order: </label>
          <select value={order} onChange={(e) => setOrder(parseInt(e.target.value))}>
            <option value={1}>1st Derivative</option>
            <option value={2}>2nd Derivative</option>
            <option value={3}>3rd Derivative</option>
            <option value={4}>4th Derivative</option>
          </select>
        </div>

        <button onClick={calculate} style={{
          background: "#1e3a8a", color: "#fff", padding: "0.5rem 1rem",
          borderRadius: 4, border: "none", cursor: "pointer"
        }}>
          Calculate
        </button>

        {result && (
          <div style={{ marginTop: "2rem", padding: "1rem", background: "#f0f4ff", borderRadius: 8 }}>
            <h3 style={{ color: "#1e3a8a" }}>Solution</h3>
            {renderFormula()}
            <BlockMath math={`\\text{Exact Derivative: } f^{(${order})}(${x}) = ${result.exact.toFixed(6)}`} />
            <BlockMath math={`\\text{Relative Error: } \\left| \\frac{\\text{Approx} - \\text{Exact}}{\\text{Exact}} \\right| \\times 100 = ${result.error.toFixed(6)}\\%`} />
          </div>
        )}
      </div>
    </>
  );
}

export default NumericalDifferentiation;
