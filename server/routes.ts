import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertAppointmentSchema, insertCartItemSchema, loginSchema, registerSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

// Debug: Log environment variables
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'exists (length: ' + process.env.STRIPE_SECRET_KEY.length + ')' : 'not found');
console.log('TESTING_STRIPE_SECRET_KEY:', process.env.TESTING_STRIPE_SECRET_KEY ? 'exists (length: ' + process.env.TESTING_STRIPE_SECRET_KEY.length + ')' : 'not found');

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.head("/api", (req, res) => {
    res.status(200).end();
  });

  app.get("/api", (req, res) => {
    res.json({ status: "ok", message: "API is healthy" });
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, search } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else {
        products = await storage.getProducts(
          category as string | undefined,
          featured === 'true' ? true : undefined
        );
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Appointment routes
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating appointment: " + error.message });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching appointments: " + error.message });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const appointment = await storage.updateAppointmentStatus(req.params.id, status);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating appointment: " + error.message });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword
      });
      
      // Create session
      const sessionToken = randomBytes(32).toString('hex');
      const session = await storage.createUserSession({
        userId: user.id,
        sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        sessionToken: session.sessionToken
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Error creating account: " + error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Create session
      const sessionToken = randomBytes(32).toString('hex');
      const session = await storage.createUserSession({
        userId: user.id,
        sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        sessionToken: session.sessionToken
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Error logging in: " + error.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { sessionToken } = req.body;
      if (sessionToken) {
        await storage.deleteUserSession(sessionToken);
      }
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error logging out: " + error.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
      }
      
      const sessionToken = authHeader.replace('Bearer ', '');
      const session = await storage.getUserSession(sessionToken);
      
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }
      
      const user = await storage.getUser(session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email
      });
    } catch (error: any) {
      res.status(401).json({ message: "Authentication failed: " + error.message });
    }
  });

  // User-specific routes
  app.get("/api/user/orders", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const sessionToken = authHeader.replace('Bearer ', '');
      const session = await storage.getUserSession(sessionToken);
      
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }
      
      const orders = await storage.getUserOrders(session.userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.get("/api/user/appointments", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const sessionToken = authHeader.replace('Bearer ', '');
      const session = await storage.getUserSession(sessionToken);
      
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }
      
      const appointments = await storage.getUserAppointments(session.userId);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching appointments: " + error.message });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.sessionId);
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      res.json(cartWithProducts);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching cart: " + error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding to cart: " + error.message });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItemQuantity(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating cart item: " + error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Error removing from cart: " + error.message });
    }
  });

  app.delete("/api/cart/clear/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Error clearing cart: " + error.message });
    }
  });

  // Stripe payment route for cart-based payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Payment processing is unavailable. Stripe configuration is missing." });
      }
      
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }

      // Get cart items and calculate total
      const cartItems = await storage.getCartItems(sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      let total = 0;
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }
          const itemTotal = parseFloat(String(product.price)) * item.quantity;
          total += itemTotal;
          return { ...item, product, itemTotal };
        })
      );

      // Create payment intent with calculated total
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to paisa (INR subunit)
        currency: "inr",
        metadata: {
          sessionId,
          items: JSON.stringify(cartWithProducts.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          })))
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount: total,
        items: cartWithProducts
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
