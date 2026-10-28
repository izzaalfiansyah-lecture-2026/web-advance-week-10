const express = require("express");
const { pool } = require("../config/database");

const router = express.Router();

const query = {
  getAll: `SELECT * FROM products ORDER BY created_at DESC`,
  getById: `SELECT * FROM products WHERE id = ?`,
  insertOne: `INSERT INTO products (name, price, category, stock, description) VALUES (?, ?, ?, ?, ?)`,
  updateOne: `UPDATE products SET name = ?, price = ?, category = ?, stock = ?, description = ? WHERE id = ?`,
  deleteOne: `DELETE FROM products WHERE id = ?`,
};

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(query.getAll);

    res.json({
      success: true,
      data: rows,
      total: rows.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(query.getById, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: "Name, price, and category are required",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        error: "Price must be greater than 0",
      });
    }

    const [result] = await pool.execute(query.insertOne, [
      name,
      parseFloat(price),
      category,
      parseInt(stock) || 0,
      description || "",
    ]);

    const [newProduct] = await pool.execute(query.getById, [result.insertId]);

    res.status(201).json({
      success: true,
      data: newProduct[0],
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create product",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;
    const productId = req.params.id;

    const [existing] = await pool.execute(query.getById, [productId]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    if (price && price <= 0) {
      return res.status(400).json({
        success: false,
        error: "Price must be greater than 0",
      });
    }

    await pool.execute(query.updateOne, [
      name || existing[0].name,
      price ? parseFloat(price) : existing[0].price,
      category || existing[0].category,
      stock ? parseInt(stock) : existing[0].stock,
      description || existing[0].description,
      productId,
    ]);

    const [updated] = await pool.execute(query.getById, [productId]);

    res.json({
      success: true,
      data: updated[0],
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update product",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const [existing] = await pool.execute(query.getById, [productId]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    await pool.execute(query.deleteOne, [productId]);

    res.json({
      success: true,
      data: existing[0],
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete product",
    });
  }
});

module.exports = router;
