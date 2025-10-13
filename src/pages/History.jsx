import React, { useEffect, useState } from "react";
import Header from "../components/Header";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      try {
        const res = await fetch("http://localhost:5000/api/history", {
          method: "DELETE",
        });
        if (res.ok) {
          alert("History cleared successfully!");
          fetchHistory();
        } else {
          alert("Failed to clear history.");
        }
      } catch (error) {
        console.error("Error deleting history:", error);
        alert("Error connecting to server.");
      }
    }
  };

const renderMatrix = (matrix) => {
  if (!matrix) return null;
  let parsedMatrix;

  try {
    parsedMatrix = JSON.parse(matrix);

    // 🔁 ถ้ายังเป็น string อีกชั้น ให้ parse ซ้ำ
    if (typeof parsedMatrix === "string") {
      parsedMatrix = JSON.parse(parsedMatrix);
    }
  } catch (e) {
    return <span>❌ JSON parse failed: {String(matrix)}</span>;
  }

  // ตรวจสอบว่าเป็น array 2 มิติจริงไหม
  if (!Array.isArray(parsedMatrix) || !Array.isArray(parsedMatrix[0])) {
    return (
      <div style={{ color: "black" }}>
        {JSON.stringify(parsedMatrix)}
      </div>
    );
  }

  return (
    <table
      border="1"
      cellPadding="5"
      style={{ borderCollapse: "collapse", margin: "0 auto" }}
    >
      <tbody>
        {parsedMatrix.map((row, i) => (
          <tr key={i}>
            {row.map((val, j) => (
              <td key={j} style={{ textAlign: "center" }}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};




  return (
    <>
      <Header />
      <div
        style={{
          padding: "2rem",
          maxWidth: "900px",
          margin: "auto",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h1 style={{ color: "#1e3a8a" }}>Search History</h1>
          <button
            onClick={handleClearHistory}
            style={{
              marginTop: "1rem",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Clear History
          </button>
        </div>

        {loading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              textAlign: "center",
            }}
          >
            <thead style={{ backgroundColor: "#e0e7ff" }}>
              <tr>
                <th>ID</th>
                <th>Method</th>
                <th>Equation / Matrices</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.method}</td>
                  <td>
  {item.equation && (
    <div>
      <strong>Equation:</strong> {item.equation}
    </div>
  )}

  {item.matrixA && (
    <div style={{ marginTop: "0.5rem" }}>
      <strong>Matrix A:</strong>
      {renderMatrix(item.matrixA)}
    </div>
  )}

  {item.matrixB && (
    <div style={{ marginTop: "0.5rem" }}>
      <strong>Matrix B:</strong>
      {renderMatrix(item.matrixB)}
    </div>
  )}

  {!item.equation && !item.matrixA && !item.matrixB && <span>-</span>}
</td>

                  <td>
                    {new Date(item.created_at).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default History;
