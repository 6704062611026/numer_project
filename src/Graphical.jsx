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

function Graphical() {
  const [equation, setEquation] = useState("x^3 - x - 2");
  const [xStart, setXStart] = useState(-5);
  const [xEnd, setXEnd] = useState(5);
  const [dataPoints, setDataPoints] = useState([]);

  const calculateGraphical = () => {
    const points = [];
    const step = 0.1;

    for (let x = parseFloat(xStart); x <= parseFloat(xEnd); x += step) {
      const y = evaluate(equation, { x });
      points.push({ x: x.toFixed(2), y: y.toFixed(6) });
    }

    setDataPoints(points);
  };

  const chartData = {
    labels: dataPoints.map((point) => point.x),
    datasets: [
      {
        label: `f(x) = ${equation}`,
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
        text: "Graphical Method: f(x) vs x",
        color: "#1e3a8a",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "f(x)",
          color: "#1e3a8a",
        },
      },
      x: {
        title: {
          display: true,
          text: "x",
          color: "#1e3a8a",
        },
      },
    },
  };

  return (
    <><Header/>
    <div className ="App" style={{ padding: "2rem", backgroundColor: "#f9fafb", color: "#1e293b" }}>
      <h1 style={{ color: "#1e3a8a" }}>Graphical Method</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Equation: </label>
        <input
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          style={{ marginLeft: "1rem", padding: "0.3rem" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>X Start:</label>
        <input
          type="number"
          value={xStart}
          onChange={(e) => setXStart(e.target.value)}
          style={{ marginLeft: "1rem", marginRight: "2rem", padding: "0.3rem" }}
        />
        <label>X End:</label>
        <input
          type="number"
          value={xEnd}
          onChange={(e) => setXEnd(e.target.value)}
          style={{ marginLeft: "1rem", padding: "0.3rem" }}
        />
      </div>

      <button className="b" onClick={calculateGraphical} style={{ padding: "0.5rem 1rem", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "4px" }}>
        Calculate
      </button>

      {dataPoints.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
          <div style={{ width: "600px", height: "400px", margin: "0 auto" }}>
            <Line data={chartData} options={chartOptions} />
          </div>

          <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Results</h2>
          <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem", backgroundColor: "white" }}>
            <thead style={{ backgroundColor: "#e0e7ff" }}>
              <tr>
                <th>X</th>
                <th>f(X)</th>
              </tr>
            </thead>
            <tbody>
              {dataPoints.map((point, index) => (
                <tr key={index}>
                  <td>{point.x}</td>
                  <td>{point.y}</td>
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

export default Graphical;