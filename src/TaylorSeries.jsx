import React, { useState } from "react";
import { derivative, evaluate } from "mathjs";
import { Line } from "react-chartjs-2";
import './App.css';
import Header from './components/Header';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

function TaylorSeries() {
  const [equation, setEquation] = useState("sin(x)");
  const [a, setA] = useState(0);
  const [xValue, setXValue] = useState(1);
  const [order, setOrder] = useState(5);
  const [terms, setTerms] = useState([]);
  const [approxValue, setApproxValue] = useState(null);
  const [trueValue, setTrueValue] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);

  const calculateTaylor = () => {
    const fx = equation;
    const aNum = parseFloat(a);
    const xNum = parseFloat(xValue);
    const n = parseInt(order);

    let taylorSum = 0;
    const termList = [];

    for (let i = 0; i <= n; i++) {
      const derivativeExpr = i === 0 ? fx : derivative(fx, 'x', { simplify: true }).toString();
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

    // For graph: show actual vs taylor approx from a-1 to a+1
    const graph = [];
    for (let x = aNum - 1; x <= aNum + 1; x += 0.1) {
      let y = 0;
      for (let i = 0; i <= n; i++) {
        const f_i_a = evaluate(derivative(fx, 'x', { simplify: true, order: i }).toString(), { x: aNum });
        const term = (f_i_a * Math.pow(x - aNum, i)) / factorial(i);
        y += term;
      }
      graph.push({ x: x.toFixed(2), y: y });
    }

    setApproxValue(taylorSum);
    setTrueValue(actualValue);
    setTerms(termList);
    setDataPoints(graph);
  };

  const factorial = (num) => {
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) result *= i;
    return result;
  };

  const chartData = {
    labels: dataPoints.map((p) => p.x),
    datasets: [
      {
        label: `Taylor Approximation`,
        data: dataPoints.map((p) => p.y),
        borderColor: "#1e3a8a",
        backgroundColor: "#93c5fd",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1e293b" } },
      title: {
        display: true,
        text: `Taylor Series Approximation`,
        color: "#1e3a8a",
      },
    },
    scales: {
      y: { title: { display: true, text: "f(x)", color: "#1e3a8a" } },
      x: { title: { display: true, text: "x", color: "#1e3a8a" } },
    },
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
              <Line data={chartData} options={chartOptions} />
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
