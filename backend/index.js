require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// POST - เพิ่มประวัติ
app.post("/api/history", (req, res) => {
  const { method, matrixA, result } = req.body;

  const sql = "INSERT INTO search_history (method, matrixA, result) VALUES (?, ?, ?)";

  db.query(
    sql,
    [method, JSON.stringify(matrixA), JSON.stringify(result)],
    (err, resultDb) => {
      if (err) {
        console.error("Error inserting:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res.json({ id: resultDb.insertId, method });
    }
  );
});

// GET - ดึงประวัติทั้งหมด
app.get("/api/history", (req, res) => {
  const sql = "SELECT * FROM search_history ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});


// ✅ DELETE - ลบประวัติทั้งหมด
app.delete("/api/history", (req, res) => {
  console.log("DELETE /api/history called"); // <-- เพิ่มบรรทัดนี้
  const sql = "DELETE FROM search_history";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error deleting history:", err);
      return res.status(500).json({ error: "Database delete failed" });
    }
    console.log("Rows affected:", result.affectedRows); // <-- เพิ่มบรรทัดนี้
    res.json({ message: "History cleared successfully" });
  });
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
