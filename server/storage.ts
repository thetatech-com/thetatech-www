import { type User, type InsertUser, type Product, type InsertProduct, type Appointment, type InsertAppointment, type CartItem, type InsertCartItem, type Order, type InsertOrder, type UserSession, type InsertUserSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getProducts(category?: string, featured?: boolean): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Appointment methods
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;

  // Cart methods
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Session methods
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSession(sessionToken: string): Promise<UserSession | undefined>;
  deleteUserSession(sessionToken: string): Promise<boolean>;

  // Auth helper methods
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserAppointments(userId: string): Promise<Appointment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private appointments: Map<string, Appointment>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;
  private sessions: Map<string, UserSession>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.appointments = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.sessions = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "iPhone 15 Pro Max",
        description: "Latest flagship iPhone with titanium design and advanced camera system",
        price: "134900",
        originalPrice: "159900",
        category: "smartphones",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: "4.8",
        reviewCount: 256,
        inStock: true,
        featured: true,
        tags: ["best-seller", "flagship"],
        specifications: {
          display: "6.7-inch Super Retina XDR",
          processor: "A17 Pro chip",
          storage: "256GB",
          camera: "48MP Pro camera system"
        }
      },
      {
        id: "2",
        name: "MacBook Pro M3",
        description: "Professional laptop with M3 chip for ultimate performance",
        price: "199900",
        originalPrice: "219900",
        category: "laptops",
        imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: "4.9",
        reviewCount: 189,
        inStock: true,
        featured: true,
        tags: ["editor-choice", "professional"],
        specifications: {
          processor: "Apple M3 chip",
          memory: "16GB unified memory",
          storage: "512GB SSD",
          display: "14-inch Liquid Retina XDR"
        }
      },
      {
        id: "3",
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling wireless headphones",
        price: "29990",
        originalPrice: "34990",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: "4.7",
        reviewCount: 421,
        inStock: true,
        featured: true,
        tags: ["trending", "audio"],
        specifications: {
          driver: "30mm drivers",
          battery: "30 hours playback",
          connectivity: "Bluetooth 5.2",
          features: "Industry-leading noise canceling"
        }
      },
      {
        id: "4",
        name: "Samsung Galaxy S24",
        description: "Latest Samsung flagship with AI-powered photography",
        price: "74999",
        originalPrice: "79999",
        category: "smartphones",
        imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: "4.6",
        reviewCount: 334,
        inStock: true,
        featured: true,
        tags: ["new-arrival", "android"],
        specifications: {
          display: "6.2-inch Dynamic AMOLED 2X",
          processor: "Snapdragon 8 Gen 3",
          storage: "256GB",
          camera: "50MP triple camera system"
        }
      },
      {
        id: "5",
        name: "iPad Air M2",
        description: "Powerful and versatile iPad with M2 chip",
        price: "59900",
        originalPrice: "69900",
        category: "tablets",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: "4.8",
        reviewCount: 167,
        inStock: true,
        featured: false,
        tags: ["deal-of-the-day"],
        specifications: {
          display: "10.9-inch Liquid Retina",
          processor: "Apple M2 chip",
          storage: "256GB",
          camera: "12MP Wide camera"
        }
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(category?: string, featured?: boolean): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    if (featured !== undefined) {
      products = products.filter(p => p.featured === featured);
    }
    
    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      originalPrice: insertProduct.originalPrice || null,
      rating: insertProduct.rating || null,
      reviewCount: insertProduct.reviewCount || null,
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : null,
      featured: insertProduct.featured !== undefined ? insertProduct.featured : null,
      tags: insertProduct.tags || null,
      specifications: insertProduct.specifications || null
    };
    this.products.set(id, product);
    return product;
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      userId: insertAppointment.userId || null,
      status: "pending",
      appointmentDate: null,
      estimatedCost: null,
      actualCost: null,
      technicianNotes: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      const updated = { ...appointment, status };
      this.appointments.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity
      const updated = { ...existingItem, quantity: existingItem.quantity + (insertItem.quantity || 1) };
      this.cartItems.set(existingItem.id, updated);
      return updated;
    } else {
      // Create new cart item
      const id = randomUUID();
      const cartItem: CartItem = {
        ...insertItem,
        id,
        quantity: insertItem.quantity || 1,
        addedAt: new Date()
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      const updated = { ...item, quantity };
      this.cartItems.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id, _]) => id);

    itemsToRemove.forEach(id => this.cartItems.delete(id));
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      userId: insertOrder.userId || null,
      sessionId: insertOrder.sessionId || null,
      paymentIntentId: insertOrder.paymentIntentId || null,
      shippingAddress: insertOrder.shippingAddress || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updated = { ...order, status, updatedAt: new Date() };
      this.orders.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Session methods
  async createUserSession(insertSession: InsertUserSession): Promise<UserSession> {
    const id = randomUUID();
    const session: UserSession = {
      ...insertSession,
      id,
      createdAt: new Date()
    };
    this.sessions.set(session.sessionToken, session);
    return session;
  }

  async getUserSession(sessionToken: string): Promise<UserSession | undefined> {
    return this.sessions.get(sessionToken);
  }

  async deleteUserSession(sessionToken: string): Promise<boolean> {
    return this.sessions.delete(sessionToken);
  }

  // Auth helper methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appt => appt.userId === userId);
  }
}

export const storage = new MemStorage();
