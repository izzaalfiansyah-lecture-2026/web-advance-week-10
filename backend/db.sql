CREATE DATABASE react_products_db;

USE react_products_db;

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO products (name, price, category, stok, description) VALUES 
('Laptop Gaming', 15000000.00, 'Electronics', 15, 'High-performance gaming laptop'),
('Smartphone', 5000000.00, 'Electronics', 15, 'Latest smartphone with great camera')
('Headphones', 800000.00, 'Electronics', 50, 'Wireless noise-cancelling headphones'),
('Coffee Maker', 1200000.00, 'Home', 10, 'Automatic coffee maker with timer'),
('Running Shoes', 800000.00, 'Sports', 25, 'Comfortable running shoes for athletes');
