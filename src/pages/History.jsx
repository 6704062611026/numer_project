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
      parsedMatrix = JSON.parse(matrix); // แปลงจาก JSON string
    } catch {
      return <span>Invalid matrix</span>;
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
                    {/* ถ้าเป็น Cholesky หรือ method ที่มี matrixA */}
                    {item.matrixA ? (
                      <div>
                        <strong>Matrix A:</strong>
                        {renderMatrix(item.matrixA)}
                        {item.matrixB && (
                          <>
                            <strong>Matrix B:</strong>
                            {renderMatrix(item.matrixB)}
                          </>
                        )}
                      </div>
                    ) : (
                      item.equation // สำหรับ method ที่ใช้ equation
                    )}
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
