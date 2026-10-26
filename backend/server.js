const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/database");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

testConnection();

app.use("/api/products", productRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   GET    /api/health`);
  console.log(`   GET    /api/products`);
  console.log(`   GET    /api/products/:id`);
  console.log(`   POST   /api/products`);
  console.log(`   PUT    /api/products/:id`);
  console.log(`   DELETE /api/products/:id`);
});
