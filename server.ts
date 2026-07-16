import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import { initialDatabase } from "./server-db-init";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit to allow Base64 images in media upload
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY environment variable is not defined. The Vee Bite Assistant will operate in rich-predefined fallback mode.");
}

// VEE BITE prompt context for the model system instruction
const SYSTEM_INSTRUCTION = `
You are the "VEE BITE Assistant", an elite, hospitable, and friendly AI chatbot representing VEE BITE, a premium fast-food brand in Gujranwala, Pakistan.
Your tone should be warm, luxury, energetic, and highly respectful (using words like "Ji", "Aap", "Sir", "Madam", "Pyare").
You speak fluently in English, Urdu, and Roman Urdu (Urdu written in English script).

RESTAURANT DETAILS:
- Restaurant Name: VEE BITE
- Tagline: Eat Good, Feel Good
- Founded: 2023, by Muhammad Haris. Built through dedication, hard work, and struggle to serve premium-quality fast food with authentic Pakistani taste.
- Location: Near Rizwan Book Depot, Main Market, Model Town, Gujranwala.
- Phone / WhatsApp: 0307 655 3100
- Socials: @veebite.pk (Facebook, Instagram, WhatsApp)
- Operational Timings: 12:00 PM (Noon) to 2:00 AM (Midnight) everyday.
- Delivery: Yes, we deliver across Model Town and main Gujranwala areas. Orders can be placed via WhatsApp (0307 655 3100).

PROMOTION / HOW TO ORDER:
- To order, customers select items from the website or ask you, which generates a pre-filled WhatsApp link (+92 307 655 3100) or they can just WhatsApp directly.
- We offer Pizzas, Special Vee Bite Pizzas (stuffed crusts, Malai Boti, etc.), Burgers, Chicken, Wraps, Fries, and Special Money-Saving Combos.

MENU HIGHLIGHTS:
1. Regular Pizza (Small: 500 Rs, Medium: 850 Rs, Large: 1400 Rs): Chicken Tikka, Fajita, Hot & Spicy, Creamy Melt, Cheese Lover, Vegi Lover, Supreme.
2. Special Vee Bite Pizza (Small: 600 Rs, Medium: 1000 Rs, Large: 1550 Rs): Chicken Creamy, Chicken Malai Boti, Chicken Kababish, Chicken Vee Bite Special (luxurious dual-stuffed crust).
3. Burgers: patty burger (250 Rs), Regular Zinger (300 Rs), Chicken Chapli Burger (350 Rs), Zinger (350 Rs), Mighty Zinger (600 Rs, double patty & double cheese), Chicken Cheese Lava Burger (750 Rs - extremely cheesy), Shami Burger (180 Rs - traditional Haris' favorite!).
4. Wraps: Chicken Paratha Roll (320 Rs), Zinger Paratha Roll (350 Rs), Chicken Shawarma (300 Rs), Tortilla Wrap (450 Rs / 650 Rs).
5. Fries: Loaded Fries (550 Rs), Pizza Fries (650 Rs).
6. Cheese Sticks: Small (700 Rs), Medium (1000 Rs).

POPULAR DEALS:
- Student Deal: 1 Patty Burger + 1 Fries = 300 Rs (Super saver!)
- Deal 2: 1 Large Pizza + 2 Zingers + 1L Drink = 2000 Rs (Perfect for groups)
- Deal 3: 2 Medium Pizzas + 1L Drink = 1700 Rs
- Deal 1: 2 Small Pizzas + 1L Drink = 1100 Rs
- Zinger Deal: 2 Zinger Burgers = 650 Rs
- Chapli Deal: 1 Chapli Burger + 1 Regular Fries + 1 Regular Drink = 500 Rs
- Special Deal 6: 2 Shami Burgers + 2 Regular Drinks + Fries = 550 Rs

BEHAVIOR GUIDE:
- Be precise when customers ask about prices, sizes, or locations. Keep answers clear and digestible.
- Direct customers to use the buttons on the menu or click WhatsApp to order.
- Recommend best sellers: Chicken Tikka Pizza, Chicken Malai Boti Pizza, Mighty Zinger Burger, Loaded Fries, Shami Burger, and Deal 2.
- Always include an inviting signature signoff like "Enjoy the premium taste of Vee Bite!" or "Vee Bite, Eat Good, Feel Good!".
- If a query is unrelated to VEE BITE, politely steer the conversation back to our delicious menu.
`;

// AI Assistant chat proxy route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      // Predefined smart responses fallback if API key is not present
      const lowercaseMsg = message.toLowerCase();
      let reply = "Thank you for reaching out to VEE BITE! Eat Good, Feel Good. 😊 For immediate queries or customized orders, please tap the WhatsApp icon to message Muhammad Haris directly at 0307 655 3100 or visit us near Rizwan Book Depot, Main Market, Model Town, Gujranwala!";
      
      if (lowercaseMsg.includes("deal") || lowercaseMsg.includes("offer")) {
        reply = "Looking for yummy deals? 🍕 We recommend **Deal 2** (1 Large Pizza + 2 Zingers + 1L Drink for Rs. 2000) or our **Student Deal** (1 Patty Burger + 1 Fries for Rs. 300)! Check out the 'Deals' section above for all options.";
      } else if (lowercaseMsg.includes("best") || lowercaseMsg.includes("popular") || lowercaseMsg.includes("special")) {
        reply = "Our crowd favorites are the **Chicken Tikka Pizza**, **Chicken Malai Boti Pizza**, **Mighty Zinger Burger** (double patty and cheese for Rs. 600), and our iconic **Loaded Fries** (Rs. 550)! What would you like to try?";
      } else if (lowercaseMsg.includes("timing") || lowercaseMsg.includes("open") || lowercaseMsg.includes("close")) {
        reply = "We are open daily from **12:00 PM (Noon) to 2:00 AM (Midnight)**! We are ready to serve you freshly baked hot pizzas and crispy zingers late into the night!";
      } else if (lowercaseMsg.includes("order") || lowercaseMsg.includes("delivery")) {
        reply = "Ordering is simple! Simply browse our menu above, click **'Add to Order'**, or directly tap the **pulsing WhatsApp button** to text our kitchen at **0307 655 3100**. We deliver straight to your doorstep in Gujranwala!";
      } else if (lowercaseMsg.includes("location") || lowercaseMsg.includes("address") || lowercaseMsg.includes("where")) {
        reply = "You can find our luxury outlet located **Near Rizwan Book Depot, Main Market, Model Town, Gujranwala**. Check our embedded map on the website for real-time directions!";
      }

      return res.json({ text: reply });
    }

    // Format chat history for @google/genai SDK
    // The history parameter is an array of { role: 'user'|'model', text: string }
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.text }]
        });
      }
    }

    // Append the new message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    const replyText = response.text || "I am here to help you taste the best food in town! Ask me anything about VEE BITE.";
    return res.json({ text: replyText });

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Failed to process chat conversation." });
  }
});

// ==========================================
// VEE BITE SECURE FILE-SYSTEM DATABASE
// ==========================================
const DB_PATH = path.join(process.cwd(), "server-db.json");

// Load or seed the database
function getDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDatabase, null, 2), "utf8");
      return initialDatabase;
    }
    const content = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Database error, falling back to initial seed:", error);
    return initialDatabase;
  }
}

function updateDB(dbData: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Failed to write to database file:", error);
    return false;
  }
}

// Ensure DB is initialized immediately
getDB();

// ==========================================
// ADMIN AUTHENTICATION & SECURITY CONTROLS
// ==========================================
const sessions = new Map<string, { username: string; expires: number }>();

// Rate limiting on login: Max 5 attempts in 15 minutes
const loginAttempts = new Map<string, { count: number; lockUntil?: number }>();
function rateLimitLogin(req: any, res: any, next: any) {
  const rawIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const ip = Array.isArray(rawIp) ? rawIp[0] : String(rawIp);
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (record && record.lockUntil && record.lockUntil > now) {
    const waitMin = Math.ceil((record.lockUntil - now) / 60000);
    return res.status(429).json({ error: `Too many login attempts. Please try again in ${waitMin} minutes.` });
  }
  next();
}

const SALT = "veebite-salt-987";
function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SALT).update(password).digest("hex");
}

function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token missing." });
  }
  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid session token." });
  }
  if (session.expires < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
  // Refresh session on use
  session.expires = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
  next();
}

// ==========================================
// PUBLIC CONTENT & INTERACTION API ROUTES
// ==========================================

// Get dynamic menu items
app.get("/api/menu", (req, res) => {
  const db = getDB();
  res.json(db.menuItems);
});

// Get dynamic deals
app.get("/api/deals", (req, res) => {
  const db = getDB();
  res.json(db.deals);
});

// Get dynamic blog posts
app.get("/api/blog", (req, res) => {
  const db = getDB();
  res.json(db.blogPosts || []);
});

// Get dynamic pages setup (e.g. Hero title, tagline, announcement)
app.get("/api/pages", (req, res) => {
  const db = getDB();
  res.json(db.pages || []);
});

// Submit contact inquiries
app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: "Name, phone number, and message are required." });
  }

  // Input validation & sanitization (XSS protection)
  const cleanName = String(name).replace(/<[^>]*>/g, "").trim().substring(0, 100);
  const cleanEmail = String(email || "").replace(/<[^>]*>/g, "").trim().substring(0, 100);
  const cleanPhone = String(phone).replace(/<[^>]*>/g, "").trim().substring(0, 50);
  const cleanMessage = String(message).replace(/<[^>]*>/g, "").trim().substring(0, 1000);

  const db = getDB();
  const newInquiry = {
    id: "inq-" + Date.now(),
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  if (!db.inquiries) db.inquiries = [];
  db.inquiries.unshift(newInquiry);
  
  // Track inquiry in analytics
  if (!db.analytics) db.analytics = { visitorCount: 1240, ordersPlaced: 87, revenue: 94850, clicks: {} };
  if (!db.analytics.clicks) db.analytics.clicks = {};
  db.analytics.clicks.contact_sub = (db.analytics.clicks.contact_sub || 0) + 1;

  updateDB(db);
  res.json({ success: true, inquiry: newInquiry });
});

// Create/Place trackable order
app.post("/api/orders", (req, res) => {
  const { items, customerName, customerPhone, deliveryAddress, distance, deliveryCharge, total, orderType } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order items are required." });
  }

  const db = getDB();
  if (!db.orders) db.orders = [];

  // Generate a random but easy-to-read order ID, like VB-1024 or sequential
  let nextSeq = 1001;
  if (db.orders.length > 0) {
    const ids = db.orders.map((o: any) => {
      const match = String(o.orderId).match(/VB-(\d+)/);
      return match ? parseInt(match[1], 10) : 1000;
    });
    nextSeq = Math.max(...ids) + 1;
  }
  const orderId = `VB-${nextSeq}`;

  const newOrder = {
    id: "ord-" + Date.now(),
    orderId,
    customerName: customerName || "Guest Customer",
    customerPhone: customerPhone || "N/A",
    deliveryAddress: deliveryAddress || "",
    distance: Number(distance) || 0,
    deliveryCharge: Number(deliveryCharge) || 0,
    total: Number(total) || 0,
    orderType: orderType || "delivery", // 'delivery' or 'pickup'
    status: "pending", // pending, confirmed, preparing, ready_for_pickup / out_for_delivery, delivered, cancelled
    items: items.map((it: any) => ({
      name: it.name,
      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 1,
      sizeLabel: it.sizeLabel || ""
    })),
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Update analytics ordersPlaced and revenue
  if (!db.analytics) db.analytics = { visitorCount: 1240, ordersPlaced: 87, revenue: 94850, clicks: {} };
  db.analytics.ordersPlaced = (db.analytics.ordersPlaced || 0) + 1;
  db.analytics.revenue = (db.analytics.revenue || 0) + newOrder.total;

  updateDB(db);
  res.json({ success: true, order: newOrder });
});

// Track/Fetch an order by orderId
app.get("/api/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  const db = getDB();
  if (!db.orders) db.orders = [];

  const cleanId = String(orderId).trim().toUpperCase();
  const order = db.orders.find((o: any) => o.orderId.toUpperCase() === cleanId || o.id === orderId || String(o.id).toUpperCase() === cleanId);

  if (!order) {
    return res.status(404).json({ error: "Order not found. Please verify the Order ID (e.g., VB-1001)." });
  }

  res.json(order);
});

// Record visitor session
app.post("/api/analytics/visit", (req, res) => {
  const db = getDB();
  if (!db.analytics) db.analytics = { visitorCount: 1240, ordersPlaced: 87, revenue: 94850, clicks: {} };
  db.analytics.visitorCount = (db.analytics.visitorCount || 0) + 1;
  updateDB(db);
  res.json({ success: true, count: db.analytics.visitorCount });
});

// Record action click (WhatsApp, Cart checkout, etc.)
app.post("/api/analytics/click", (req, res) => {
  const { action } = req.body;
  if (!action) return res.status(400).json({ error: "Action is required." });
  
  const db = getDB();
  if (!db.analytics) db.analytics = { visitorCount: 1240, ordersPlaced: 87, revenue: 94850, clicks: {} };
  if (!db.analytics.clicks) db.analytics.clicks = {};
  
  db.analytics.clicks[action] = (db.analytics.clicks[action] || 0) + 1;
  updateDB(db);
  res.json({ success: true });
});

// Record order placement (Sales volume & Revenue)
app.post("/api/analytics/order", (req, res) => {
  const { totalItems, revenue } = req.body;
  const db = getDB();
  if (!db.analytics) db.analytics = { visitorCount: 1240, ordersPlaced: 87, revenue: 94850, clicks: {} };
  db.analytics.ordersPlaced = (db.analytics.ordersPlaced || 0) + 1;
  db.analytics.revenue = (db.analytics.revenue || 0) + Number(revenue || 0);

  // Log to secure admin audit logs
  if (!db.activityLogs) db.activityLogs = [];
  db.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Order processed: ${totalItems} items. Total Sale: Rs. ${revenue}`,
    ip: req.ip || "customer"
  });

  updateDB(db);
  res.json({ success: true });
});

// ==========================================
// SECURE ADMIN DASHBOARD & CONTROLS (PROTECTED)
// ==========================================

// Handle Admin Login
app.post("/api/admin/login", rateLimitLogin, (req, res) => {
  const { username, password } = req.body;
  const rawIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const ip = Array.isArray(rawIp) ? rawIp[0] : String(rawIp);
  const now = Date.now();

  let attempt = loginAttempts.get(ip) || { count: 0 };
  if (attempt.lockUntil && attempt.lockUntil > now) {
    return res.status(429).json({ error: "Too many login attempts. Locked." });
  }

  const db = getDB();
  const isCorrectUsername = username === db.admin.username;
  const isCorrectPassword = hashPassword(password) === db.admin.passwordHash;

  if (!isCorrectUsername || !isCorrectPassword) {
    attempt.count += 1;
    if (attempt.count >= 5) {
      attempt.lockUntil = now + 15 * 60 * 1000; // Lock out for 15 minutes
      loginAttempts.set(ip, attempt);
      return res.status(429).json({ error: "Too many login attempts. Blocked for 15 minutes." });
    }
    loginAttempts.set(ip, attempt);
    return res.status(401).json({ error: "Invalid username or password." });
  }

  // Clear attempts on success
  loginAttempts.delete(ip);

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    username: username,
    expires: now + 2 * 60 * 60 * 1000 // 2 hours
  });

  // Audit Log
  if (!db.activityLogs) db.activityLogs = [];
  db.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Admin logged in successfully`,
    ip: ip
  });
  updateDB(db);

  res.json({ token, username });
});

// Verify Admin token
app.get("/api/admin/verify", authMiddleware, (req, res) => {
  res.json({ authenticated: true });
});

// Handle Admin Logout
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    sessions.delete(token);
  }
  res.json({ success: true });
});

// Change Admin Password
app.post("/api/admin/change-password", authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters." });
  }

  const db = getDB();
  if (hashPassword(currentPassword) !== db.admin.passwordHash) {
    return res.status(400).json({ error: "Incorrect current password." });
  }

  db.admin.passwordHash = hashPassword(newPassword);
  
  if (!db.activityLogs) db.activityLogs = [];
  db.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: "Admin changed password",
    ip: req.ip || "internal"
  });
  updateDB(db);

  res.json({ success: true, message: "Password updated successfully!" });
});

// Update/Reset Dashboard Analytics
app.post("/api/admin/analytics/reset", authMiddleware, (req, res) => {
  const { visitorCount, ordersPlaced, revenue, clicks } = req.body;
  const db = getDB();
  
  db.analytics = {
    visitorCount: typeof visitorCount === "number" ? visitorCount : 0,
    ordersPlaced: typeof ordersPlaced === "number" ? ordersPlaced : 0,
    revenue: typeof revenue === "number" ? revenue : 0,
    clicks: clicks || {
      whatsapp: 0,
      cart_view: 0,
      menu_add: 0,
      cart_add: 0,
      contact_sub: 0
    }
  };

  if (!db.activityLogs) db.activityLogs = [];
  db.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: "Admin manually updated dashboard analytics",
    ip: req.ip || "internal"
  });

  updateDB(db);
  res.json({ success: true, analytics: db.analytics });
});

// Get Dashboard Analytics, Logs and Settings
app.get("/api/admin/analytics", authMiddleware, (req, res) => {
  const db = getDB();
  res.json({
    analytics: db.analytics,
    activityLogs: db.activityLogs || [],
    users: [{ id: "u-1", username: db.admin.username, role: "Super Admin" }]
  });
});

// Get customer inquiries
app.get("/api/admin/inquiries", authMiddleware, (req, res) => {
  const db = getDB();
  res.json(db.inquiries || []);
});

// Mark inquiry as Read/Processed
app.put("/api/admin/inquiries/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDB();
  if (!db.inquiries) db.inquiries = [];
  const inq = db.inquiries.find((x: any) => x.id === id);
  if (inq) {
    inq.status = status || "read";
    updateDB(db);
    return res.json({ success: true, inquiry: inq });
  }
  res.status(404).json({ error: "Inquiry not found" });
});

// Delete customer inquiry
app.delete("/api/admin/inquiries/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  if (!db.inquiries) db.inquiries = [];
  db.inquiries = db.inquiries.filter((x: any) => x.id !== id);
  updateDB(db);
  res.json({ success: true });
});

// Get all orders for Admin Portal
app.get("/api/admin/orders", authMiddleware, (req, res) => {
  const db = getDB();
  res.json(db.orders || []);
});

// Update order status
app.put("/api/admin/orders/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDB();
  if (!db.orders) db.orders = [];

  const order = db.orders.find((x: any) => x.id === id || x.orderId === id);
  if (order) {
    const oldStatus = order.status;
    order.status = status || "pending";
    
    // Add activity log
    if (!db.activityLogs) db.activityLogs = [];
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Updated order ${order.orderId} status from '${oldStatus}' to '${status}'`,
      ip: req.ip || "admin"
    });

    updateDB(db);
    return res.json({ success: true, order });
  }
  res.status(404).json({ error: "Order not found" });
});

// Delete/Archive order
app.delete("/api/admin/orders/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  if (!db.orders) db.orders = [];

  const order = db.orders.find((x: any) => x.id === id || x.orderId === id);
  const orderIdStr = order ? order.orderId : id;

  db.orders = db.orders.filter((x: any) => x.id !== id && x.orderId !== id);

  if (order) {
    if (!db.activityLogs) db.activityLogs = [];
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Deleted order ${orderIdStr}`,
      ip: req.ip || "admin"
    });
  }

  updateDB(db);
  res.json({ success: true });
});

// Create menu item
app.post("/api/admin/menu", authMiddleware, (req, res) => {
  const item = req.body;
  if (!item.name || !item.category || item.price === undefined) {
    return res.status(400).json({ error: "Name, category, and price are required." });
  }
  const db = getDB();
  const newItem = {
    id: "menu-" + Date.now(),
    name: item.name,
    description: item.description || "",
    category: item.category,
    price: item.price,
    image: item.image || "",
    badge: item.badge || ""
  };
  db.menuItems.push(newItem);
  db.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Created menu item: ${newItem.name}`,
    ip: req.ip || "admin"
  });
  updateDB(db);
  res.json({ success: true, item: newItem });
});

// Update menu item
app.put("/api/admin/menu/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const item = req.body;
  const db = getDB();
  const idx = db.menuItems.findIndex((x: any) => x.id === id);
  if (idx !== -1) {
    db.menuItems[idx] = {
      ...db.menuItems[idx],
      name: item.name !== undefined ? item.name : db.menuItems[idx].name,
      description: item.description !== undefined ? item.description : db.menuItems[idx].description,
      category: item.category !== undefined ? item.category : db.menuItems[idx].category,
      price: item.price !== undefined ? item.price : db.menuItems[idx].price,
      image: item.image !== undefined ? item.image : db.menuItems[idx].image,
      badge: item.badge !== undefined ? item.badge : db.menuItems[idx].badge
    };
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Updated menu item: ${db.menuItems[idx].name}`,
      ip: req.ip || "admin"
    });
    updateDB(db);
    return res.json({ success: true, item: db.menuItems[idx] });
  }
  res.status(404).json({ error: "Menu item not found" });
});

// Delete menu item
app.delete("/api/admin/menu/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const item = db.menuItems.find((x: any) => x.id === id);
  if (item) {
    db.menuItems = db.menuItems.filter((x: any) => x.id !== id);
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Deleted menu item: ${item.name}`,
      ip: req.ip || "admin"
    });
    updateDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Menu item not found" });
});

// Create Special Deal
app.post("/api/admin/deals", authMiddleware, (req, res) => {
  const deal = req.body;
  if (!deal.name || !deal.price || !deal.tag) {
    return res.status(400).json({ error: "Name, price, and tag are required." });
  }
  const db = getDB();
  const newDeal = {
    id: "deal-" + Date.now(),
    name: deal.name,
    description: deal.description || "",
    price: deal.price,
    tag: deal.tag,
    badge: deal.badge || "",
    image: deal.image || ""
  };
  db.deals.push(newDeal);
  db.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Created special deal: ${newDeal.name}`,
    ip: req.ip || "admin"
  });
  updateDB(db);
  res.json({ success: true, deal: newDeal });
});

// Update Special Deal
app.put("/api/admin/deals/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const deal = req.body;
  const db = getDB();
  const idx = db.deals.findIndex((x: any) => x.id === id);
  if (idx !== -1) {
    db.deals[idx] = {
      ...db.deals[idx],
      name: deal.name !== undefined ? deal.name : db.deals[idx].name,
      description: deal.description !== undefined ? deal.description : db.deals[idx].description,
      price: deal.price !== undefined ? deal.price : db.deals[idx].price,
      tag: deal.tag !== undefined ? deal.tag : db.deals[idx].tag,
      badge: deal.badge !== undefined ? deal.badge : db.deals[idx].badge,
      image: deal.image !== undefined ? deal.image : db.deals[idx].image
    };
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Updated special deal: ${db.deals[idx].name}`,
      ip: req.ip || "admin"
    });
    updateDB(db);
    return res.json({ success: true, deal: db.deals[idx] });
  }
  res.status(404).json({ error: "Deal not found" });
});

// Delete Special Deal
app.delete("/api/admin/deals/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const deal = db.deals.find((x: any) => x.id === id);
  if (deal) {
    db.deals = db.deals.filter((x: any) => x.id !== id);
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Deleted special deal: ${deal.name}`,
      ip: req.ip || "admin"
    });
    updateDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Deal not found" });
});

// Create Blog Post
app.post("/api/admin/blog", authMiddleware, (req, res) => {
  const post = req.body;
  if (!post.title || !post.content) {
    return res.status(400).json({ error: "Title and content are required." });
  }
  const db = getDB();
  if (!db.blogPosts) db.blogPosts = [];
  const newPost = {
    id: "blog-" + Date.now(),
    title: post.title,
    content: post.content,
    author: post.author || "Muhammad Haris",
    date: new Date().toISOString().split("T")[0],
    image: post.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  };
  db.blogPosts.push(newPost);
  db.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Created blog post: ${newPost.title}`,
    ip: req.ip || "admin"
  });
  updateDB(db);
  res.json({ success: true, post: newPost });
});

// Update Blog Post
app.put("/api/admin/blog/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const post = req.body;
  const db = getDB();
  if (!db.blogPosts) db.blogPosts = [];
  const idx = db.blogPosts.findIndex((x: any) => x.id === id);
  if (idx !== -1) {
    db.blogPosts[idx] = {
      ...db.blogPosts[idx],
      title: post.title !== undefined ? post.title : db.blogPosts[idx].title,
      content: post.content !== undefined ? post.content : db.blogPosts[idx].content,
      author: post.author !== undefined ? post.author : db.blogPosts[idx].author,
      image: post.image !== undefined ? post.image : db.blogPosts[idx].image
    };
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Updated blog post: ${db.blogPosts[idx].title}`,
      ip: req.ip || "admin"
    });
    updateDB(db);
    return res.json({ success: true, post: db.blogPosts[idx] });
  }
  res.status(404).json({ error: "Blog post not found" });
});

// Delete Blog Post
app.delete("/api/admin/blog/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  if (!db.blogPosts) db.blogPosts = [];
  const post = db.blogPosts.find((x: any) => x.id === id);
  if (post) {
    db.blogPosts = db.blogPosts.filter((x: any) => x.id !== id);
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Deleted blog post: ${post.title}`,
      ip: req.ip || "admin"
    });
    updateDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Blog post not found" });
});

// Update template page content (e.g. Hero title, About/Story)
app.put("/api/admin/pages/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const db = getDB();
  if (!db.pages) db.pages = [];
  const idx = db.pages.findIndex((x: any) => x.id === id);
  if (idx !== -1) {
    db.pages[idx] = {
      ...db.pages[idx],
      ...fields
    };
    db.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Updated page settings: ${db.pages[idx].title}`,
      ip: req.ip || "admin"
    });
    updateDB(db);
    return res.json({ success: true, page: db.pages[idx] });
  }
  res.status(404).json({ error: "Page template not found" });
});

// Get Media Library files
app.get("/api/admin/media", authMiddleware, (req, res) => {
  const db = getDB();
  const staticMedia = [
    { id: "sm-1", url: "https://static.tossdown.com/images/93f1dd31-edd7-450a-9165-90d175674e80.webp", name: "Chicken Tikka Pizza" },
    { id: "sm-2", url: "https://rkpizza.com/wp-content/uploads/2025/08/zinger.webp", name: "Zinger Burger" },
    { id: "sm-3", url: "https://greenvalley.pk/cdn/shop/files/pizza-chicken-fajita_9f9b8488-4732-4396-ac52-b3699a87651e.webp?v=1739451209", name: "Chicken Fajita Pizza" },
    { id: "sm-4", url: "https://static.tossdown.com/images/d3360ae1-bc13-4b00-9909-99a0ddf78a9d.webp", name: "Mighty Zinger" },
    { id: "sm-5", url: "https://graficsea.com/wp-content/uploads/2021/12/Pakistani-Burger-.png", name: "Shami Burger" }
  ];
  const userMedia = db.mediaLibrary || [];
  res.json([...staticMedia, ...userMedia]);
});

// Upload media file (as base64 in mediaLibrary state)
app.post("/api/admin/media/upload", authMiddleware, (req, res) => {
  const { name, base64 } = req.body;
  if (!name || !base64) {
    return res.status(400).json({ error: "Image name and content are required." });
  }
  const db = getDB();
  if (!db.mediaLibrary) db.mediaLibrary = [];
  const newMedia = {
    id: "media-" + Date.now(),
    name: name.replace(/<[^>]*>/g, "").trim(),
    url: base64,
    createdAt: new Date().toISOString()
  };
  db.mediaLibrary.unshift(newMedia);
  
  if (!db.activityLogs) db.activityLogs = [];
  db.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Uploaded custom media file: ${newMedia.name}`,
    ip: req.ip || "admin"
  });
  
  updateDB(db);
  res.json({ success: true, media: newMedia });
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode serving built static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VEE BITE Server] Full-stack application running on http://localhost:${PORT}`);
  });
}

startServer();
