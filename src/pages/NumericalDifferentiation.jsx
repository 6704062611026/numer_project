import React, { useState } from "react";
import { evaluate, derivative } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import Header5 from "../components/Header5";

function NumericalDifferentiation() {
  const [fx, setFx] = useState("x^2");
  const [x, setX] = useState(2);
  const [h, setH] = useState(0.01);
  const [direction, setDirection] = useState("central");
  const [order, setOrder] = useState(1);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const xi = parseFloat(x);
    const hh = parseFloat(h);
    let approx;
    let values = {};

    try {
      switch (direction) {
        case "forward":
          if (order === 1) {
            values.f_xh = evaluate(fx, { x: xi + hh });
            values.f_x = evaluate(fx, { x: xi });
            approx = (values.f_xh - values.f_x) / hh;
          } else if (order === 2) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xh = evaluate(fx, { x: xi + hh });
            values.f_x2h = evaluate(fx, { x: xi + 2 * hh });
            approx = (values.f_x2h - 2 * values.f_xh + values.f_x) / (hh ** 2);
          } else if (order === 3) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xh = evaluate(fx, { x: xi + hh });
            values.f_x2h = evaluate(fx, { x: xi + 2 * hh });
            values.f_x3h = evaluate(fx, { x: xi + 3 * hh });
            approx = (-values.f_x3h + 3 * values.f_x2h - 3 * values.f_xh + values.f_x) / (hh ** 3);
          } else if (order === 4) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xh = evaluate(fx, { x: xi + hh });
            values.f_x2h = evaluate(fx, { x: xi + 2 * hh });
            values.f_x3h = evaluate(fx, { x: xi + 3 * hh });
            values.f_x4h = evaluate(fx, { x: xi + 4 * hh });
            approx = (values.f_x4h - 4 * values.f_x3h + 6 * values.f_x2h - 4 * values.f_xh + values.f_x) / (hh ** 4);
          }
          break;

        case "backward":
          if (order === 1) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xmh = evaluate(fx, { x: xi - hh });
            approx = (values.f_x - values.f_xmh) / hh;
          } else if (order === 2) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xmh = evaluate(fx, { x: xi - hh });
            values.f_xm2h = evaluate(fx, { x: xi - 2 * hh });
            approx = (values.f_x - 2 * values.f_xmh + values.f_xm2h) / (hh ** 2);
          } else if (order === 3) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xmh = evaluate(fx, { x: xi - hh });
            values.f_xm2h = evaluate(fx, { x: xi - 2 * hh });
            values.f_xm3h = evaluate(fx, { x: xi - 3 * hh });
            approx = (values.f_x - 3 * values.f_xmh + 3 * values.f_xm2h - values.f_xm3h) / (hh ** 3);
          } else if (order === 4) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xmh = evaluate(fx, { x: xi - hh });
            values.f_xm2h = evaluate(fx, { x: xi - 2 * hh });
            values.f_xm3h = evaluate(fx, { x: xi - 3 * hh });
            values.f_xm4h = evaluate(fx, { x: xi - 4 * hh });
            approx = (values.f_x - 4 * values.f_xmh + 6 * values.f_xm2h - 4 * values.f_xm3h + values.f_xm4h) / (hh ** 4);
          }
          break;

        case "central":
        default:
          if (order === 1) {
            values.f_xh = evaluate(fx, { x: xi + hh });
            values.f_xmh = evaluate(fx, { x: xi - hh });
            approx = (values.f_xh - values.f_xmh) / (2 * hh);
          } else if (order === 2) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xh = evaluate(fx, { x: xi + hh });
            values.f_xmh = evaluate(fx, { x: xi - hh });
            approx = (values.f_xh - 2 * values.f_x + values.f_xmh) / (hh ** 2);
          } else if (order === 3) {
            values.f_xp2h = evaluate(fx, { x: xi + 2 * hh });
            values.f_xp1h = evaluate(fx, { x: xi + hh });
            values.f_xm1h = evaluate(fx, { x: xi - hh });
            values.f_xm2h = evaluate(fx, { x: xi - 2 * hh });
            approx = (values.f_xm2h - 2 * values.f_xm1h + 2 * values.f_xp1h - values.f_xp2h) / (2 * hh ** 3);
          } else if (order === 4) {
            values.f_x = evaluate(fx, { x: xi });
            values.f_xp1h = evaluate(fx, { x: xi + hh });
            values.f_xp2h = evaluate(fx, { x: xi + 2 * hh });
            values.f_xm1h = evaluate(fx, { x: xi - hh });
            values.f_xm2h = evaluate(fx, { x: xi - 2 * hh });
            approx = (values.f_xm2h - 4 * values.f_xm1h + 6 * values.f_x - 4 * values.f_xp1h + values.f_xp2h) / (hh ** 4);
          }
          break;
      }

      // หา exact derivative
      let d = fx;
      for (let i = 0; i < order; i++) {
        d = derivative(d, "x");
      }
      const trueDiff = d.evaluate({ x: xi });

      const error = Math.abs((approx - trueDiff) / trueDiff) * 100;

      setResult({
        approx,
        exact: trueDiff,
        error,
        values,
      });
    } catch (err) {
      alert("Function parsing error. Please check your expression.");
    }
  };

  const renderFormula = () => {
    const xi = parseFloat(x);
    const hh = parseFloat(h);
    const v = result?.values || {};

    const f = (val) => val?.toFixed(6);

    // You can expand these with more formulas if needed
    if (direction === "central" && order === 4) {
      return (
        <>
          <BlockMath math={`f^{(4)}(x) \\approx \\frac{f(x - 2h) - 4f(x - h) + 6f(x) - 4f(x + h) + f(x + 2h)}{h^4}`} />
          <BlockMath math={`= \\frac{${f(v.f_xm2h)} - 4(${f(v.f_xmh)}) + 6(${f(v.f_x)}) - 4(${f(v.f_xp1h)}) + ${f(v.f_xp2h)}}{${(hh ** 4).toFixed(6)}}`} />
          <BlockMath math={`= ${result.approx.toFixed(6)}`} />
        </>
      );
    }

    // สามารถเพิ่ม case สำหรับแต่ละ direction + order ได้ตามโครงสร้างเดียวกัน

    return (
      <BlockMath math={`\\text{No detailed formula rendered for this case yet.}`}/>
    );
  };
  fetch("http://localhost:5000/api/history", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    method: "NumericalDifferentiation",
    equation: fx,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("History saved:", data);
  });

  return (
    <>
      <Header5 />
      <div style={{ padding: "2rem", maxWidth: 700, margin: "auto" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>Numerical Differentiation</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>f(x): </label>
          <input type="text" value={fx} onChange={(e) => setFx(e.target.value)} style={{ width: "100%" }} />
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
          Calculate Derivative
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
