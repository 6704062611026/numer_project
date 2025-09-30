import React, { useState } from "react";
import { evaluate } from "mathjs";
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

function FalsePosition() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(2);
  const [tolerance, setTolerance] = useState(0.000001);
  const [iterations, setIterations] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  const falsePosition = () => {
    let a = parseFloat(x0);
    let b = parseFloat(x1);
    const tol = parseFloat(tolerance);
    const maxIter = 100;
    let iter = 0;
    const results = [];
    const graphPoints = [];

    let fa = evaluate(equation, { x: a });
    let fb = evaluate(equation, { x: b });

    if (fa * fb >= 0) {
      alert("f(a) and f(b) must have opposite signs.");
      return;
    }

    let c, fc, prevC;

    do {
      c = (a * fb - b * fa) / (fb - fa);
      fc = evaluate(equation, { x: c });

      results.push({
        iteration: iter + 1,
        a: a.toFixed(6),
        b: b.toFixed(6),
        c: c.toFixed(6),
        f_c: fc.toFixed(6),
      });

      graphPoints.push({ x: iter + 1, y: c });

      if (fc * fa < 0) {
        b = c;
        fb = fc;
      } else {
        a = c;
        fa = fc;
      }

      if (prevC !== undefined && Math.abs(c - prevC) < tol) break;

      prevC = c;
      iter++;
    } while (iter < maxIter);

    setIterations(results);
    setDataPoints(graphPoints);
  };

  const chartData = {
    labels: dataPoints.map((point) => point.x),
    datasets: [
      {
        label: `Approximate Root per Iteration`,
        data: dataPoints.map((point) => point.y),
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
      legend: {
        position: "top",
        labels: { color: "#1e293b" },
      },
      title: {
        display: true,
        text: "False Position Method: Convergence Graph",
        color: "#1e3a8a",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "x (Approximate Root)",
          color: "#1e3a8a",
        },
      },
      x: {
        title: {
          display: true,
          text: "Iteration",
          color: "#1e3a8a",
        },
      },
    },
  };

  return (
    <>
      <Header />
      <div className="App" style={{ padding: "2rem", backgroundColor: "#f9fafb", color: "#1e293b" }}>
        <h1 style={{ color: "#1e3a8a" }}>False Position Method</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>Equation: </label>
          <input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>x₀:</label>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(e.target.value)}
            style={{ marginLeft: "1rem", marginRight: "2rem", padding: "0.3rem" }}
          />
          <label>x₁:</label>
          <input
            type="number"
            value={x1}
            onChange={(e) => setX1(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Tolerance:</label>
          <input
            type="number"
            step="0.000001"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.3rem" }}
          />
        </div>

        <button
          className="b"
          onClick={falsePosition}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "4px" }}
        >
          Calculate
        </button>

        {iterations.length > 0 && (
          <>
            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
            <div style={{ width: "600px", height: "400px", margin: "0 auto" }}>
              <Line data={chartData} options={chartOptions} />
            </div>

            <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Iterations</h2>
            <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem", backgroundColor: "white" }}>
              <thead style={{ backgroundColor: "#e0e7ff" }}>
                <tr>
                  <th>Iteration</th>
                  <th>a</th>
                  <th>b</th>
                  <th>c</th>
                  <th>f(c)</th>
                </tr>
              </thead>
              <tbody>
                {iterations.map((row, index) => (
                  <tr key={index}>
                    <td>{row.iteration}</td>
                    <td>{row.a}</td>
                    <td>{row.b}</td>
                    <td>{row.c}</td>
                    <td>{row.f_c}</td>
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

export default FalsePosition;
