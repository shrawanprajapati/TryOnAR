CREATE DATABASE IF NOT EXISTS tryonar_v2;
USE tryonar_v2;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  model_slug VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS tryon_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  image_url TEXT,
  result_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO categories (name)
SELECT * FROM (
  SELECT 'Aviators' AS name
  UNION ALL SELECT 'Minimal'
  UNION ALL SELECT 'Sport'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM categories LIMIT 1);

INSERT INTO products (name, description, image_url, model_slug, price, category_id)
SELECT * FROM (
  SELECT 'Ray-Ban Aviator', 'Classic gold frame designed for everyday wear.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80', 'glasses-01', 165.00, 1
  UNION ALL
  SELECT 'Zenith Tech Frames', 'Lightweight futuristic glasses with a matte finish.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'glasses-02', 260.00, 2
  UNION ALL
  SELECT 'Oakley Frogskins', 'Sporty design built for active lifestyles.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80', 'glasses-03', 150.00, 3
  UNION ALL
  SELECT 'Titanium Minimalist', 'Sleek titanium frame for a premium look.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', 'glasses-04', 380.00, 2
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);
