import React, { useState } from "react";
import { derivative, evaluate } from "mathjs";
import Plot from 'react-plotly.js';
import '../App.css';
import Header from '../components/Header';

function TaylorSeries() {
  const [equation, setEquation] = useState("sin(x)");
  const [a, setA] = useState(0);
  const [xValue, setXValue] = useState(1);
  const [order, setOrder] = useState(5);
  const [terms, setTerms] = useState([]);
  const [approxValue, setApproxValue] = useState(null);
  const [trueValue, setTrueValue] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);

  const factorial = (num) => {
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) result *= i;
    return result;
  };

  const calculateTaylor = () => {
    const fx = equation;
    const aNum = parseFloat(a);
    const xNum = parseFloat(xValue);
    const n = parseInt(order);

    let taylorSum = 0;
    const termList = [];

    for (let i = 0; i <= n; i++) {
      const derivedFn = i === 0 ? fx : derivative(fx, 'x', { simplify: true, order: i }).toString();
      const f_i_a = evaluate(derivedFn, { x: aNum });
      const term = (f_i_a * Math.pow(xNum - aNum, i)) / factorial(i);
      taylorSum += term;

      termList.push({
        order: i,
        derivative: derivedFn,
        f_i_a: f_i_a.toFixed(6),
        term: term.toFixed(6),
      });
    }

    const actualValue = evaluate(fx, { x: xNum });

    // Prepare graph data (Taylor vs Actual)
    const graph = [];
    for (let x = aNum - 1; x <= aNum + 1; x += 0.1) {
      let yTaylor = 0;
      for (let i = 0; i <= n; i++) {
        const derivedFn = i === 0 ? fx : derivative(fx, 'x', { simplify: true, order: i }).toString();
        const f_i_a = evaluate(derivedFn, { x: aNum });
        const term = (f_i_a * Math.pow(x - aNum, i)) / factorial(i);
        yTaylor += term;
      }
      const yTrue = evaluate(fx, { x: x });
      graph.push({
        x: parseFloat(x.toFixed(2)),
        yTaylor: yTaylor,
        yTrue: yTrue,
      });
    }

    setApproxValue(taylorSum);
    setTrueValue(actualValue);
    setTerms(termList);
    setDataPoints(graph);
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "2rem", backgroundColor: "#f9fafb", color: "#1e293b" }}>
        <h1 style={{ color: "#1e3a8a" }}>Taylor Series Method</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>f(x) = </label>
          <input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem", width: "300px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Approximate at x = </label>
          <input
            type="number"
            value={xValue}
            onChange={(e) => setXValue(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />

          <label style={{ marginLeft: "2rem" }}>Center a = </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Order (n):</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />
        </div>

        <button
          className="b"
          onClick={calculateTaylor}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "4px" }}
        >
          Calculate
        </button>

        {terms.length > 0 && (
          <>
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
            <div style={{ width: "600px", height: "400px", margin: "0 auto" }}>
              <Plot
                data={[
                  {
                    x: dataPoints.map((p) => p.x),
                    y: dataPoints.map((p) => p.yTrue),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Actual f(x)',
                    line: { color: '#ef4444', width: 2 },
                  },
                  {
                    x: dataPoints.map((p) => p.x),
                    y: dataPoints.map((p) => p.yTaylor),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: `Taylor Approx (n=${order})`,
                    line: { color: '#1e3a8a', width: 2, dash: 'dot' },
                  },
                ]}
                layout={{
                  title: {
                    text: `Taylor Series Approximation`,
                    font: { color: '#1e3a8a' },
                  },
                  xaxis: {
                    title: { text: 'x', font: { color: '#1e3a8a' } },
                  },
                  yaxis: {
                    title: { text: 'f(x)', font: { color: '#1e3a8a' } },
                  },
                  plot_bgcolor: '#f9fafb',
                  paper_bgcolor: '#f9fafb',
                  font: { color: '#1e293b' },
                  height: 400,
                  width: 600,
                }}
              />
            </div>

            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Result</h2>
            <p>
              Approximated f({xValue}) ≈ <strong>{approxValue?.toFixed(6)}</strong><br />
              Actual f({xValue}) = <strong>{trueValue?.toFixed(6)}</strong><br />
              Error = <strong>{Math.abs(trueValue - approxValue).toExponential(2)}</strong>
            </p>

            <h2 style={{ color: "#1e3a8a" }}>Terms</h2>
            <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem", backgroundColor: "white" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>Order (n)</th>
                  <th>f⁽ⁿ⁾(a)</th>
                  <th>Term</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term, index) => (
                  <tr key={index}>
                    <td>{term.order}</td>
                    <td>{term.f_i_a}</td>
                    <td>{term.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}

export default TaylorSeries;
