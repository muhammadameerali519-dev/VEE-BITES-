import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
