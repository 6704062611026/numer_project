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
  const { method, equation } = req.body;

  const sql = "INSERT INTO search_history (method, equation) VALUES (?, ?)";

  console.log("Inserting to DB..."); // ✅ วางตรงนี้

  db.query(sql, [method, equation], (err, result) => {
    if (err) {
      console.error("Error inserting:", err); // ✅ log error ด้วย
      res.status(500).json({ error: "Database insert failed" });
      return;
    }

    res.json({
      id: result.insertId,
      method,
      equation,
    });
  });
});

// GET - ดึงประวัติทั้งหมด
app.get("/api/history", (req, res) => {
  const sql = "SELECT * FROM search_history ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
