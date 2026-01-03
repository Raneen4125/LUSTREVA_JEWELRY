import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));

// Create images directory with absolute path
const imageDir = path.join(process.cwd(), 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Serve images statically
app.use('/images', express.static(imageDir));

// Multer setup with absolute path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
// MySQL connection - SIMPLE VERSION (no reconnection logic)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jewelry",
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database.");
});

// Handle fatal errors (just log and exit for development)
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.fatal) {
    console.error('Fatal database error - please restart the server');
  }
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});


// ======================
// AUTHENTICATION MIDDLEWARE
// ======================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'jewelry_super_secret_key_2025', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'jewelry_super_secret_key_2025', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Check if user is admin
    const q = "SELECT role FROM users WHERE id = ?";
    db.query(q, [user.id], (err, data) => {
      if (err || data.length === 0) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      if (data[0].role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      req.user = user;
      next();
    });
  });
};

app.post("/contact", (req, res) => {
  // Log the incoming request
  console.log('🔍 Contact route hit!');
  console.log('Request body:', req.body);
  
  const { name, email, phone, subject, message } = req.body;
  
  // Validation
  if (!name || !email || !subject || !message) {
    console.log('❌ Validation failed - missing fields');
    return res.status(400).json({ error: "Please fill in all required fields" });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ Invalid email format');
    return res.status(400).json({ error: "Please provide a valid email address" });
  }
  
  const q = "INSERT INTO contact_messages(name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)";
  
  console.log('✅ Validation passed, executing query...');
  
  // Use direct query (single connection)
  db.query(q, [name, email, phone, subject, message], (err, result) => {
    if (err) {
      console.error('❌ DATABASE ERROR:', err);
      console.error('❌ Error code:', err.code);
      console.error('❌ SQL message:', err.sqlMessage);
      
      // Return proper JSON error
      return res.status(500).json({ 
        error: "Failed to save your message. Please try again later." 
      });
    }
    
    console.log('✅ Contact message saved successfully! ID:', result.insertId);
    res.status(201).json({ 
      message: "Thank you for your message! We'll get back to you soon." 
    });
  });
});
// ======================
// AUTH ROUTES
// ======================
app.post("/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: "Password hashing failed" });
    }
    
    // ✅ Include default role 'client' for new users
    const q = "INSERT INTO users(`name`, `email`, `password`, `role`) VALUES (?, ?, ?, 'client')";
    db.query(q, [name, email, hash], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Signup failed" });
      }
      res.status(201).json({ message: "User created successfully" });
    });
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [email], (err, data) => {
    if (err || data.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = data[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role }, // Include role
  process.env.JWT_SECRET || 'jewelry_super_secret_key_2025',
  { expiresIn: "730d"  }
);

res.json({
  token,
  user: { 
    id: user.id, 
    name: user.name, 
    email: user.email,
    role: user.role || 'client' // Default to client if not set
  }
});
    });
  });
});


// ======================
// JEWELRY ROUTES (public)
// ======================
// GET /jewelry - Ensure image_data is returned
app.get("/jewelry", (req, res) => {
  const q = "SELECT id, name, description, price, image_url, stock FROM jewelry_items";
  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch jewelry" });
    }

    const result = data.map(item => {
      if (item.image_url) {
        try {
          const imagePath = path.join(imageDir, item.image_url);
          if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            item.image_data = imageBuffer.toString('base64');
          } else {
            console.warn(`Image not found: ${imagePath}`);
          }
        } catch (e) {
          console.error("Image read error:", e);
        }
        delete item.image_url;
      }
      return item;
    });

    res.json(result);
  });
});

app.get("/jewelry/:id", (req, res) => {
  const q = `
    SELECT ji.id, ji.name, ji.description, ji.price, ji.image_url, ji.stock,
           c.name as category_name, c.id as category_id
    FROM jewelry_items ji
    LEFT JOIN categories c ON ji.category_id = c.id
    WHERE ji.id = ?
  `;
  db.query(q, [req.params.id], (err, data) => {
    if (err || data.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const item = data[0];
    if (item.image_url) {
      try {
        const imagePath = path.join(imageDir, item.image_url);
        if (fs.existsSync(imagePath)) {
          item.image_data = fs.readFileSync(imagePath).toString('base64');
        }
      } catch (e) { /* ignore */ }
      delete item.image_url;
    }
    res.json(item);
  });
});

app.post("/jewelry", upload.single('image'), (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const image = req.file?.filename || null;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const q = "INSERT INTO jewelry_items(name, description, price, image_url, stock, category_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(q, [name, description, parseFloat(price), image, parseInt(stock) || 0, category_id || null], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add item" });
    }
    res.status(201).json({ id: result.insertId, message: "Jewelry item added" });
  });
});

// Add these routes in your server.js AFTER your existing /jewelry routes

// Admin routes - protected
app.get("/admin/jewelry", checkAdmin, (req, res) => {
  const q = "SELECT * FROM jewelry_items";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch items" });
    res.json(data);
  });
});

app.post("/admin/jewelry", checkAdmin, upload.single('image'), (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const image = req.file?.filename || null;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const q = "INSERT INTO jewelry_items(name, description, price, image_url, stock, category_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(q, [name, description, parseFloat(price), image, parseInt(stock) || 0, category_id || null], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add item" });
    }
    res.status(201).json({ id: result.insertId, message: "Jewelry item added successfully" });
  });
});

app.put("/admin/jewelry/:id", checkAdmin, upload.single('image'), (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const image = req.file?.filename || null;
  
  let q, params;
  
  if (image) {
    q = "UPDATE jewelry_items SET name = ?, description = ?, price = ?, image_url = ?, stock = ?, category_id = ? WHERE id = ?";
    params = [name, description, parseFloat(price), image, parseInt(stock) || 0, category_id || null, req.params.id];
  } else {
    q = "UPDATE jewelry_items SET name = ?, description = ?, price = ?, stock = ?, category_id = ? WHERE id = ?";
    params = [name, description, parseFloat(price), parseInt(stock) || 0, category_id || null, req.params.id];
  }
  
  db.query(q, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update item" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Jewelry item updated successfully" });
  });
});

app.delete("/admin/jewelry/:id", checkAdmin, (req, res) => {
  const getQ = "SELECT image_url FROM jewelry_items WHERE id = ?";
  db.query(getQ, [req.params.id], (err, data) => {
    if (err || data.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    const image_url = data[0].image_url;
    const deleteQ = "DELETE FROM jewelry_items WHERE id = ?";
    
    db.query(deleteQ, [req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete item" });
      }
      
      if (image_url) {
        const imagePath = path.join(imageDir, image_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      res.json({ message: "Jewelry item deleted successfully" });
    });
  });
});
// ======================
// CATEGORIES ROUTES
// ======================
app.get("/categories", (req, res) => {
  const q = "SELECT id, name FROM categories";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch categories" });
    res.json(data);
  });
});

// ======================
// CART ROUTES (protected)
// ======================
app.get("/cart", authenticateToken, (req, res) => {
  const q = "SELECT items FROM cart WHERE user_id = ?";
  db.query(q, [req.user.id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Cart fetch failed" });
    }
    const items = data.length > 0 ? JSON.parse(data[0].items) : [];
    res.json({ items });
  });
});

app.post("/cart/add", authenticateToken, (req, res) => {
  const { item_id, quantity = 1 } = req.body;
  if (!item_id || quantity < 1) {
    return res.status(400).json({ error: "Valid item_id and quantity required" });
  }

  // Fetch existing cart
  db.query("SELECT items FROM cart WHERE user_id = ?", [req.user.id], (err, cartData) => {
    if (err) {
      return res.status(500).json({ error: "Cart fetch failed" });
    }

    let cartItems = [];
    if (cartData.length > 0) {
      try {
        cartItems = JSON.parse(cartData[0].items);
      } catch (e) {
        console.error("Cart JSON parse error:", e);
      }
    }

    // Fetch item details and check stock
    db.query("SELECT price, stock FROM jewelry_items WHERE id = ?", [item_id], (err, itemData) => {
      if (err || itemData.length === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      const item = itemData[0];
      if (quantity > item.stock) {
        return res.status(400).json({ error: "Not enough stock available" });
      }

      const price = item.price;
      
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(cartItem => cartItem.item_id == item_id);
      if (existingItemIndex >= 0) {
        // Update quantity
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cartItems.push({ item_id, quantity, price });
      }

      // Save updated cart
      db.query(
        "INSERT INTO cart (user_id, items) VALUES (?, ?) ON DUPLICATE KEY UPDATE items = ?",
        [req.user.id, JSON.stringify(cartItems), JSON.stringify(cartItems)],
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to update cart" });
          }
          res.json({ message: "Added to cart", items: cartItems });
        }
      );
    });
  });
});

// DELETE cart item by item_id
app.delete("/cart/:item_id", authenticateToken, (req, res) => {
  const { item_id } = req.params;
  const user_id = req.user.id;

  db.query("SELECT items FROM cart WHERE user_id = ?", [user_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Cart fetch failed" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }

    try {
      let items = JSON.parse(data[0].items);
      // Remove item with matching item_id
      items = items.filter(item => item.item_id != item_id);
      
      if (items.length === 0) {
        // If cart is empty, delete the cart record
        db.query("DELETE FROM cart WHERE user_id = ?", [user_id], (err) => {
          if (err) {
            return res.status(500).json({ error: "Cart clear failed" });
          }
          res.json({ message: "Item removed from cart" });
        });
      } else {
        // Update cart with remaining items
        db.query(
          "UPDATE cart SET items = ? WHERE user_id = ?",
          [JSON.stringify(items), user_id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: "Cart update failed" });
            }
            res.json({ message: "Item removed from cart" });
          }
        );
      }
    } catch (e) {
      console.error("Cart JSON parse error:", e);
      return res.status(500).json({ error: "Invalid cart data" });
    }
  });
});

// Clear entire cart
app.delete("/cart", authenticateToken, (req, res) => {
  db.query("DELETE FROM cart WHERE user_id = ?", [req.user.id], (err) => {
    if (err) {
      return res.status(500).json({ error: "Cart clear failed" });
    }
    res.json({ message: "Cart cleared" });
  });
});

// ======================
// ORDERS ROUTES (protected)
// ======================

// POST /orders - Create order from cart (no request body needed)
app.post("/orders", authenticateToken, (req, res) => {
  console.log('🔍 ORDER REQUEST RECEIVED');
  const user_id = req.user.id;
  const { shippingAddress, paymentMethod, items, totalAmount } = req.body;
  
  // Validate required fields
  if (!shippingAddress || !paymentMethod || !items || !totalAmount) {
    return res.status(400).json({ error: "Missing required order information" });
  }
  
  // Validate payment method
  if (!['cod', 'card'].includes(paymentMethod)) {
    return res.status(400).json({ error: "Invalid payment method" });
  }
  
  // Validate location
  if (!['showroom', 'delivery'].includes(shippingAddress.location)) {
    return res.status(400).json({ error: "Invalid location" });
  }
  
  // If delivery, validate address fields
  if (shippingAddress.location === 'delivery') {
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ error: "Delivery address is incomplete" });
    }
  }

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('❌ Transaction begin error:', err);
      return res.status(500).json({ error: "Transaction failed" });
    }

    // Insert order header with address and payment method
    const orderQuery = `
      INSERT INTO orders(user_id, total_amount, payment_method, location, 
        full_name, phone, address, city, postal_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const orderParams = [
      user_id, 
      totalAmount, 
      paymentMethod,
      shippingAddress.location,
      shippingAddress.fullName,
      shippingAddress.phone,
      shippingAddress.location === 'delivery' ? shippingAddress.address : null,
      shippingAddress.location === 'delivery' ? shippingAddress.city : null,
      shippingAddress.location === 'delivery' ? shippingAddress.postalCode : null
    ];

    db.query(orderQuery, orderParams, (err, orderResult) => {
      if (err) {
        console.error('❌ Order header insert error:', err);
        return db.rollback(() => {
          res.status(500).json({ error: "Order creation failed" });
        });
      }

      const order_id = orderResult.insertId;
      let completedItems = 0;
      let hasError = false;

      // Insert each order item and update stock
      items.forEach((item) => {
        db.query(
          "INSERT INTO order_items(order_id, item_id, quantity, price_at_time) VALUES (?, ?, ?, ?)",
          [order_id, item.item_id, item.quantity || 1, item.price],
          (itemErr) => {
            if (itemErr && !hasError) {
              hasError = true;
              console.error('❌ Order item insert error:', itemErr);
              return db.rollback(() => {
                res.status(500).json({ error: "Order items failed" });
              });
            }

            // Reduce stock only for delivery orders (showroom pickup doesn't affect stock immediately)
            const stockReduction = shippingAddress.location === 'delivery' ? item.quantity || 1 : 0;
            if (stockReduction > 0) {
              db.query(
                "UPDATE jewelry_items SET stock = stock - ? WHERE id = ?",
                [stockReduction, item.item_id],
                (stockErr) => {
                  if (stockErr && !hasError) {
                    hasError = true;
                    console.error('❌ Stock update error:', stockErr);
                    return db.rollback(() => {
                      res.status(500).json({ error: "Stock update failed" });
                    });
                  }

                  completedItems++;
                  checkCompletion();
                }
              );
            } else {
              completedItems++;
              checkCompletion();
            }
          }
        );
      });

      const checkCompletion = () => {
        if (completedItems === items.length && !hasError) {
          // Clear cart
          db.query("DELETE FROM cart WHERE user_id = ?", [user_id], (cartErr) => {
            if (cartErr) {
              console.error("⚠️ Cart clear error (non-fatal):", cartErr);
            }
            db.commit((commitErr) => {
              if (commitErr) {
                console.error('❌ Commit error:', commitErr);
                return db.rollback(() => {
                  res.status(500).json({ error: "Order commit failed" });
                });
              }
              console.log('✅ Order placed successfully, order ID:', order_id);
              res.status(201).json({ message: "Order placed", orderId: order_id });
            });
          });
        }
      };
    });
  });
});
// PUT /orders/:id/status - Update order status
app.put("/orders/:id/status", authenticateToken, (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;
  const userId = req.user.id;

  // Validate status
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  // Verify user owns this order
  db.query("SELECT user_id FROM orders WHERE id = ?", [orderId], (err, data) => {
    if (err || data.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (data[0].user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update status
    db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update status" });
      }
      res.json({ message: "Order status updated", status });
    });
  });
});
// GET /orders - Get user's order history with details
app.get("/orders", authenticateToken, (req, res) => {
  const q = `
    SELECT o.id, o.total_amount, o.status, o.created_at,
           oi.quantity, oi.price_at_time,
           ji.name as item_name, ji.image_url
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN jewelry_items ji ON oi.item_id = ji.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(q, [req.user.id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    // Group by order
    const orders = {};
    data.forEach(row => {
      if (!orders[row.id]) {
        orders[row.id] = {
          id: row.id,
          total_amount: row.total_amount,
          status: row.status,
          created_at: row.created_at,
          items: []
        };
      }
      
      // ✅ Define item object FIRST
      const item = {
        item_name: row.item_name,
        quantity: row.quantity,
        price_at_time: row.price_at_time
      };
      
      
      // ✅ Add image data if exists
     if (row.image_url) {
  item.image_data = fs.readFileSync(path.join(imageDir, row.image_url)).toString('base64');
}
      // ✅ Push complete item
      orders[row.id].items.push(item);
    });

    res.json(Object.values(orders));
  });
});



// ======================
// REVIEWS ROUTES
// ======================
app.post("/reviews", authenticateToken, (req, res) => {
  const { item_id, rating, comment } = req.body;
  const user_id = req.user.id;

  if (!item_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Valid item_id and rating (1-5) required" });
  }

  const q = "INSERT INTO reviews(user_id, item_id, rating, comment) VALUES (?, ?, ?, ?)";
  db.query(q, [user_id, item_id, rating, comment], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "You already reviewed this item" });
      }
      return res.status(500).json({ error: "Review failed" });
    }
    res.status(201).json({ message: "Review added" });
  });
});

app.get("/reviews/:item_id", (req, res) => {
  const q = `
    SELECT r.rating, r.comment, r.created_at, u.name as user_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.item_id = ?
    ORDER BY r.created_at DESC
  `;
  db.query(q, [req.params.item_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch reviews" });
    res.json(data);
  });
});
// Newsletter subscription route
app.post("/newsletter/subscribe", (req, res) => {
  const { email } = req.body;
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }
  
  // Check if already subscribed
  const checkQuery = "SELECT id FROM newsletter_subscribers WHERE email = ?";
  db.query(checkQuery, [email], (err, data) => {
    if (err) {
      console.error("Newsletter check error:", err);
      return res.status(500).json({ error: "Subscription failed" });
    }
    
    if (data.length > 0) {
      return res.status(409).json({ error: "Email already subscribed" });
    }
    
    // Insert new subscriber
    const insertQuery = "INSERT INTO newsletter_subscribers(email) VALUES (?)";
    db.query(insertQuery, [email], (err, result) => {
      if (err) {
        console.error("Newsletter insert error:", err);
        return res.status(500).json({ error: "Subscription failed" });
      }
      
      console.log(`✅ New newsletter subscriber: ${email}`);
      res.status(201).json({ message: "Thank you for subscribing to our newsletter!" });
    });
  });
});
// Get user's wishlist
app.get("/wishlist", authenticateToken, (req, res) => {
  const q = `
    SELECT ji.id, ji.name, ji.description, ji.price, ji.image_url, ji.stock
    FROM wishlist w
    JOIN jewelry_items ji ON w.item_id = ji.id
    WHERE w.user_id = ?
  `;
  db.query(q, [req.user.id], (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch wishlist" });
    
    const result = data.map(item => {
      if (item.image_url) {
        try {
          const imagePath = path.join(imageDir, item.image_url);
          if (fs.existsSync(imagePath)) {
            item.image_data = fs.readFileSync(imagePath).toString('base64');
          }
        } catch (e) {}
        delete item.image_url;
      }
      return item;
    });
    res.json(result);
  });
});

// Add to wishlist
app.post("/wishlist", authenticateToken, (req, res) => {
  const { item_id } = req.body;
  if (!item_id) return res.status(400).json({ error: "Item ID required" });
  
  const q = "INSERT INTO wishlist(user_id, item_id) VALUES (?, ?)";
  db.query(q, [req.user.id, item_id], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Already in wishlist" });
      }
      return res.status(500).json({ error: "Failed to add" });
    }
    res.status(201).json({ message: "Added to wishlist" });
  });
});

// Remove from wishlist
app.delete("/wishlist/:item_id", authenticateToken, (req, res) => {
  const q = "DELETE FROM wishlist WHERE user_id = ? AND item_id = ?";
  db.query(q, [req.user.id, req.params.item_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to remove" });
    res.json({ message: "Removed from wishlist" });
  });
});

// Check if item is in wishlist
app.get("/wishlist/check/:item_id", authenticateToken, (req, res) => {
  const q = "SELECT id FROM wishlist WHERE user_id = ? AND item_id = ?";
  db.query(q, [req.user.id, req.params.item_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Check failed" });
    res.json({ in_wishlist: data.length > 0 });
  });
});
// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`💎 Jewelry backend running on port ${PORT}`);
  console.log(`📸 Images directory: ${imageDir}`);
});