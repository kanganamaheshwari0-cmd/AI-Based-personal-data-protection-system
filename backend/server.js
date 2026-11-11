
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DataShield AI Backend is running!"
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "Healthy",
    project: "DataShield AI"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DataShield AI server running on port ${PORT}`);
});
