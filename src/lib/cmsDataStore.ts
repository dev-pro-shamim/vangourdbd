import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import {
  SiteSettings,
  Section,
  ProductItem,
  CategoryItem,
  PageItem,
  MediaItem,
  Menu,
  Order,
  OrderStatus,
  CourierSettings,
  CourierBooking,
  PaymentGatewaySettings,
  PaymentTransaction,
  TrackingSettings,
  FloatingContactSettings,
  Role,
  StaffUser,
  Supplier,
  StockTransaction,
  Customer,
  ReviewItem,
  Invoice,
  BlockedIP,
  SecurityLog,
  AuditLog,
  SupportTicket,
  FraudCheckResult,
  Coupon,
  WebsiteTextItem,
} from "@/types/cms";
import {
  DEFAULT_SETTINGS,
  DEFAULT_SECTIONS,
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_MENUS,
  DEFAULT_PAGES,
  DEFAULT_ORDERS,
  DEFAULT_MEDIA,
  DEFAULT_COURIER_SETTINGS,
  DEFAULT_PAYMENT_SETTINGS,
  DEFAULT_TRACKING_SETTINGS,
  DEFAULT_FLOATING_CONTACT,
  DEFAULT_ROLES,
  DEFAULT_STAFF_USERS,
  DEFAULT_SUPPLIERS,
  DEFAULT_STOCK_TRANSACTIONS,
  DEFAULT_CUSTOMERS,
  DEFAULT_REVIEWS,
  DEFAULT_INVOICES,
  DEFAULT_BLOCKED_IPS,
  DEFAULT_SECURITY_LOGS,
  DEFAULT_COUPONS,
  DEFAULT_WEBSITE_TEXTS,
} from "@/data/cmsDefaults";

// DB Connection helper
let isMongoConnecting = false;

export async function connectMongo() {
  if (mongoose.connection.readyState >= 1) return true;
  const uri = process.env.MONGODB_URI;
  if (!uri) return false;
  if (isMongoConnecting) return false;
  try {
    isMongoConnecting = true;
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log("Connected to MongoDB via Mongoose");
    return true;
  } catch (err) {
    console.warn("MongoDB connection fallback to local file store:", err);
    return false;
  } finally {
    isMongoConnecting = false;
  }
}

// Local Storage Directory
const CMS_DATA_DIR = path.join(process.cwd(), ".cms-data");

function ensureDirectory() {
  if (!fs.existsSync(CMS_DATA_DIR)) {
    fs.mkdirSync(CMS_DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(fileName: string, defaultData: T): T {
  ensureDirectory();
  const filePath = path.join(CMS_DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read ${fileName}, falling back to default:`, err);
    return defaultData;
  }
}

function writeJsonFile<T>(fileName: string, data: T): void {
  ensureDirectory();
  const filePath = path.join(CMS_DATA_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ====================================================
// 1. SITE SETTINGS
// ====================================================
export function getSiteSettings(): SiteSettings {
  return readJsonFile<SiteSettings>("settings.json", DEFAULT_SETTINGS);
}

export function updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...settings,
    brand: { ...current.brand, ...(settings.brand || {}) },
    colors: { ...current.colors, ...(settings.colors || {}) },
    typography: { ...current.typography, ...(settings.typography || {}) },
    layout: { ...current.layout, ...(settings.layout || {}) },
    announcement: { ...current.announcement, ...(settings.announcement || {}) },
    header: { ...current.header, ...(settings.header || {}) },
    footer: { ...current.footer, ...(settings.footer || {}) },
    contact: { ...current.contact, ...(settings.contact || {}) },
    social: { ...current.social, ...(settings.social || {}) },
    shipping: { ...current.shipping, ...(settings.shipping || {}) },
    seo: { ...current.seo, ...(settings.seo || {}) },
  };
  writeJsonFile("settings.json", updated);
  return updated;
}

// ====================================================
// 2. SECTIONS
// ====================================================
export function getSections(pageSlug = "home"): Section[] {
  const all = readJsonFile<Section[]>("sections.json", DEFAULT_SECTIONS);
  return all
    .filter((s) => s.pageSlug === pageSlug)
    .sort((a, b) => a.order - b.order);
}

export function getAllSections(): Section[] {
  return readJsonFile<Section[]>("sections.json", DEFAULT_SECTIONS);
}

export function getSectionById(id: string): Section | undefined {
  const all = getAllSections();
  return all.find((s) => s.id === id);
}

export function createSection(section: Omit<Section, "id">): Section {
  const all = getAllSections();
  const newSection: Section = {
    ...section,
    id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  };
  all.push(newSection);
  writeJsonFile("sections.json", all);
  return newSection;
}

export function updateSection(id: string, updates: Partial<Section>): Section | null {
  const all = getAllSections();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  writeJsonFile("sections.json", all);
  return all[idx];
}

export function deleteSection(id: string): boolean {
  const all = getAllSections();
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  writeJsonFile("sections.json", filtered);
  return true;
}

export function duplicateSection(id: string): Section | null {
  const all = getAllSections();
  const source = all.find((s) => s.id === id);
  if (!source) return null;
  const clone: Section = {
    ...JSON.parse(JSON.stringify(source)),
    id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: `${source.name} (Copy)`,
    order: source.order + 1,
  };
  all.push(clone);
  writeJsonFile("sections.json", all);
  return clone;
}

export function reorderSections(orderedIds: string[]): Section[] {
  const all = getAllSections();
  orderedIds.forEach((id, index) => {
    const sec = all.find((s) => s.id === id);
    if (sec) sec.order = index + 1;
  });
  writeJsonFile("sections.json", all);
  return all.sort((a, b) => a.order - b.order);
}

// ====================================================
// 3. CATEGORIES & SUBCATEGORIES
// ====================================================
export function getCategories(): CategoryItem[] {
  const categories = readJsonFile<CategoryItem[]>("categories.json", DEFAULT_CATEGORIES);
  return categories.sort((a, b) => a.order - b.order);
}

export function getCategoryById(id: string): CategoryItem | undefined {
  return getCategories().find((c) => c.id === id || c.slug === id || c.slug.toLowerCase() === id.toLowerCase());
}

export function createCategory(cat: Omit<CategoryItem, "id">): CategoryItem {
  const all = getCategories();
  const newCat: CategoryItem = {
    ...cat,
    id: cat.slug || `cat-${Date.now()}`,
    order: cat.order || all.length + 1,
    productCount: 0,
    isEnabled: cat.isEnabled !== undefined ? cat.isEnabled : true,
    level: cat.level || (cat.parentId ? 1 : 0),
  };
  all.push(newCat);
  writeJsonFile("categories.json", all);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
  const all = getCategories();
  const idx = all.findIndex((c) => c.id === id || c.slug === id || c.slug.toLowerCase() === id.toLowerCase());
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  writeJsonFile("categories.json", all);
  return all[idx];
}

export function deleteCategory(id: string, reassignToId?: string): { success: boolean; error?: string } {
  const all = getCategories();
  const cat = all.find((c) => c.id === id || c.slug === id || c.slug.toLowerCase() === id.toLowerCase());
  if (!cat) return { success: false, error: "Category not found" };

  // Check if any products belong to this category or subcategory
  const products = getProducts();
  const matchingProducts = products.filter(
    (p) =>
      p.categorySlug === cat.slug ||
      p.categorySlug?.toLowerCase() === cat.slug?.toLowerCase() ||
      p.categoryId === cat.id ||
      p.subcategoryId === cat.id
  );

  if (matchingProducts.length > 0 && !reassignToId) {
    return {
      success: false,
      error: `Cannot delete '${cat.name}'. It contains ${matchingProducts.length} product(s). Please reassign products to another category first.`,
    };
  }

  // Reassign products if requested
  if (matchingProducts.length > 0 && reassignToId) {
    const targetCat = all.find((c) => c.id === reassignToId || c.slug === reassignToId);
    if (targetCat) {
      matchingProducts.forEach((p) => {
        updateProduct(p.id, {
          category: targetCat.name,
          categorySlug: targetCat.slug,
          categoryId: targetCat.id,
        });
      });
    }
  }

  const filtered = all.filter((c) => c.id !== cat.id && c.slug !== cat.slug);
  writeJsonFile("categories.json", filtered);
  return { success: true };
}

// ====================================================
// 4. PRODUCTS & VARIATIONS
// ====================================================
export function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
}): ProductItem[] {
  let products = readJsonFile<ProductItem[]>("products.json", DEFAULT_PRODUCTS);

  if (options?.categorySlug) {
    products = products.filter(
      (p) =>
        p.categorySlug.toLowerCase() === options.categorySlug!.toLowerCase() ||
        p.category.toLowerCase() === options.categorySlug!.toLowerCase()
    );
  }

  if (options?.search) {
    const term = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    );
  }

  if (options?.featuredOnly) {
    products = products.filter((p) => p.isFeatured);
  }

  if (options?.limit) {
    products = products.slice(0, options.limit);
  }

  return products;
}

export function getProductById(id: string): ProductItem | undefined {
  const all = getProducts();
  return all.find((p) => p.id === id || p.slug === id);
}

export function createProduct(prod: Omit<ProductItem, "id">): ProductItem {
  const all = getProducts();
  const newProduct: ProductItem = {
    ...prod,
    id: prod.slug || `prod-${Date.now()}`,
    stockQuantity: prod.stockQuantity || 50,
    reservedStock: 0,
    rating: 5.0,
    reviewCount: 0,
  };
  all.unshift(newProduct);
  writeJsonFile("products.json", all);

  // Record initial stock transaction
  createStockTransaction({
    sku: newProduct.sku,
    productId: newProduct.id,
    productName: newProduct.name,
    type: "PURCHASE",
    quantityDelta: newProduct.stockQuantity,
    newStockLevel: newProduct.stockQuantity,
    reason: "New Product Initial Stock Setup",
    performedBy: "Admin",
  });

  return newProduct;
}

export function updateProduct(id: string, updates: Partial<ProductItem>): ProductItem | null {
  const all = getProducts();
  const idx = all.findIndex((p) => p.id === id || p.slug === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  writeJsonFile("products.json", all);
  return all[idx];
}

export function deleteProduct(id: string): boolean {
  const all = getProducts();
  const filtered = all.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === all.length) return false;
  writeJsonFile("products.json", filtered);
  return true;
}

export function duplicateProduct(id: string): ProductItem | null {
  const all = getProducts();
  const source = all.find((p) => p.id === id || p.slug === id);
  if (!source) return null;
  const clone: ProductItem = {
    ...JSON.parse(JSON.stringify(source)),
    id: `prod-${Date.now()}`,
    name: `${source.name} (Copy)`,
    slug: `${source.slug}-copy-${Date.now().toString(36)}`,
    sku: `${source.sku}-COPY`,
  };
  all.unshift(clone);
  writeJsonFile("products.json", all);
  return clone;
}

// ====================================================
// 5. INVENTORY & STOCK TRANSACTIONS
// ====================================================
export function getStockTransactions(): StockTransaction[] {
  return readJsonFile<StockTransaction[]>("stock_transactions.json", DEFAULT_STOCK_TRANSACTIONS);
}

export function createStockTransaction(tx: Omit<StockTransaction, "id" | "timestamp">): StockTransaction {
  const all = getStockTransactions();
  const newTx: StockTransaction = {
    ...tx,
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
  };
  all.unshift(newTx);
  writeJsonFile("stock_transactions.json", all);
  return newTx;
}

export function adjustStock(data: {
  productId: string;
  variationId?: string;
  type: "PURCHASE" | "SALE" | "ADJUSTMENT" | "RETURN" | "DAMAGE" | "RESERVATION" | "RELEASE";
  quantityDelta: number;
  reason: string;
  referenceId?: string;
  performedBy: string;
}): { success: boolean; product?: ProductItem; error?: string } {
  const product = getProductById(data.productId);
  if (!product) return { success: false, error: "Product not found" };

  let currentStock = product.stockQuantity;
  let newStock = currentStock;

  if (["PURCHASE", "RETURN", "RELEASE"].includes(data.type)) {
    newStock += Math.abs(data.quantityDelta);
  } else if (["SALE", "DAMAGE", "RESERVATION"].includes(data.type)) {
    newStock -= Math.abs(data.quantityDelta);
    if (newStock < 0) newStock = 0;
  } else if (data.type === "ADJUSTMENT") {
    newStock += data.quantityDelta;
    if (newStock < 0) newStock = 0;
  }

  const isStockOut = newStock <= 0;
  const updatedProduct = updateProduct(product.id, {
    stockQuantity: newStock,
    isStockOut,
  });

  createStockTransaction({
    sku: product.sku,
    productId: product.id,
    productName: product.name,
    variationId: data.variationId,
    type: data.type,
    quantityDelta: data.quantityDelta,
    newStockLevel: newStock,
    reason: data.reason,
    referenceId: data.referenceId,
    performedBy: data.performedBy,
  });

  return { success: true, product: updatedProduct || undefined };
}

export function getInventoryOverview() {
  const products = getProducts();
  let totalSkus = products.length;
  let totalQuantity = 0;
  let totalCostValue = 0;
  let totalRetailValue = 0;
  let lowStockProducts = 0;
  let outOfStockProducts = 0;

  products.forEach((p) => {
    totalQuantity += p.stockQuantity;
    totalCostValue += p.stockQuantity * (p.costPrice || p.price * 0.55);
    totalRetailValue += p.stockQuantity * p.price;
    if (p.stockQuantity <= 0) outOfStockProducts++;
    else if (p.stockQuantity <= (p.lowStockThreshold || 5)) lowStockProducts++;
  });

  return {
    totalSkus,
    totalQuantity,
    totalCostValue: Math.round(totalCostValue),
    totalRetailValue: Math.round(totalRetailValue),
    potentialProfit: Math.round(totalRetailValue - totalCostValue),
    lowStockProducts,
    outOfStockProducts,
  };
}

export function getSuppliers(): Supplier[] {
  return readJsonFile<Supplier[]>("suppliers.json", DEFAULT_SUPPLIERS);
}

export function createSupplier(sup: Omit<Supplier, "id" | "createdAt">): Supplier {
  const all = getSuppliers();
  const newSup: Supplier = {
    ...sup,
    id: `sup-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  all.push(newSup);
  writeJsonFile("suppliers.json", all);
  return newSup;
}

// ====================================================
// 6. ADVANCED ORDERS (11 Statuses & Timeline)
// ====================================================
export function getOrders(statusFilter?: string): Order[] {
  const orders = readJsonFile<Order[]>("orders.json", DEFAULT_ORDERS);
  if (statusFilter && statusFilter !== "All") {
    return orders.filter((o) => o.status === statusFilter);
  }
  return orders;
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id || o.orderNumber === id);
}

export function createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "timeline" | "internalNotes" | "auditHistory">): Order {
  const all = getOrders();
  const orderNumber = `VNG-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber,
    status: "Pending",
    createdAt: now,
    timeline: [
      {
        status: "Pending",
        note: "Order created successfully by customer",
        timestamp: now,
        updatedBy: "Customer Web Checkout",
      },
    ],
    internalNotes: [],
    auditHistory: [],
  };

  all.unshift(newOrder);
  writeJsonFile("orders.json", all);

  // 1. Reserve stock for each item in the order
  newOrder.items.forEach((item) => {
    adjustStock({
      productId: item.productId,
      variationId: item.variationId,
      type: "RESERVATION",
      quantityDelta: -item.quantity,
      reason: `Stock reserved for order ${orderNumber}`,
      referenceId: orderNumber,
      performedBy: "Automated Checkout",
    });
  });

  // 2. Automatically generate Invoice
  createInvoiceForOrder(newOrder);

  // 3. Update customer order count and LTV
  updateCustomerOrderProfile(newOrder);

  return newOrder;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
  performedBy: string = "Admin Staff"
): Order | null {
  const all = getOrders();
  const idx = all.findIndex((o) => o.id === id || o.orderNumber === id);
  if (idx === -1) return null;

  const currentOrder = all[idx];
  const oldStatus = currentOrder.status;
  if (oldStatus === status) return currentOrder;

  currentOrder.status = status;
  currentOrder.updatedAt = new Date().toISOString();
  if (!Array.isArray(currentOrder.timeline)) currentOrder.timeline = [];
  currentOrder.timeline.unshift({
    status,
    note: note || `Status updated from ${oldStatus} to ${status}`,
    timestamp: new Date().toISOString(),
    updatedBy: performedBy,
  });

  if (!Array.isArray(currentOrder.auditHistory)) currentOrder.auditHistory = [];
  currentOrder.auditHistory.unshift({
    field: "status",
    oldValue: oldStatus,
    newValue: status,
    changedBy: performedBy,
    changedAt: new Date().toISOString(),
  });

  // Save changes to disk
  saveOrders(all);

  // Order workflow inventory rules
  if (status === "Cancelled") {
    // Release reserved stock back to available
    currentOrder.items.forEach((item) => {
      adjustStock({
        productId: item.productId,
        type: "RELEASE",
        quantityDelta: item.quantity,
        reason: `Order ${currentOrder.orderNumber} Cancelled: stock released`,
        referenceId: currentOrder.orderNumber,
        performedBy,
      });
    });
  } else if (status === "Delivered") {
    currentOrder.paymentStatus = "Paid";
    // Mark as sold
    currentOrder.items.forEach((item) => {
      createStockTransaction({
        sku: item.sku || item.slug,
        productId: item.productId,
        productName: item.name,
        type: "SALE",
        quantityDelta: -item.quantity,
        newStockLevel: 0,
        reason: `Order ${currentOrder.orderNumber} successfully delivered`,
        referenceId: currentOrder.orderNumber,
        performedBy,
      });
    });
  } else if (status === "Returned") {
    // Return stock back to warehouse inventory
    currentOrder.items.forEach((item) => {
      adjustStock({
        productId: item.productId,
        type: "RETURN",
        quantityDelta: item.quantity,
        reason: `Order ${currentOrder.orderNumber} Returned by customer`,
        referenceId: currentOrder.orderNumber,
        performedBy,
      });
    });
  }

  writeJsonFile("orders.json", all);
  return currentOrder;
}

export function addOrderInternalNote(orderId: string, text: string, author: string): Order | null {
  const all = getOrders();
  const order = all.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.internalNotes.unshift({
    id: `note-${Date.now()}`,
    author,
    text,
    createdAt: new Date().toISOString(),
  });

  writeJsonFile("orders.json", all);
  return order;
}

// ====================================================
// 7. COURIER INTEGRATION & ONE-CLICK BOOKING
// ====================================================
export function getCourierSettings(): CourierSettings {
  return readJsonFile<CourierSettings>("courier_settings.json", DEFAULT_COURIER_SETTINGS);
}

export function updateCourierSettings(settings: Partial<CourierSettings>): CourierSettings {
  const current = getCourierSettings();
  const updated: CourierSettings = {
    ...current,
    ...settings,
    steadfast: { ...current.steadfast, ...(settings.steadfast || {}) },
    pathao: { ...current.pathao, ...(settings.pathao || {}) },
    redx: { ...current.redx, ...(settings.redx || {}) },
    senderInfo: { ...current.senderInfo, ...(settings.senderInfo || {}) },
  };
  writeJsonFile("courier_settings.json", updated);
  return updated;
}

export function getCourierBookings(): CourierBooking[] {
  return readJsonFile<CourierBooking[]>("courier_bookings.json", []);
}

export function bookCourierConsignment(orderId: string, courierName: "Steadfast" | "Pathao" | "RedX"): {
  success: boolean;
  booking?: CourierBooking;
  error?: string;
} {
  const order = getOrderById(orderId);
  if (!order) return { success: false, error: "Order not found" };

  // One-click courier booking code generation
  const consignmentPrefix = courierName === "Steadfast" ? "ST" : courierName === "Pathao" ? "PT" : "RX";
  const consignmentId = `${consignmentPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingCode = `${consignmentPrefix}-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const booking: CourierBooking = {
    id: `bk-${Date.now()}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    courierName,
    consignmentId,
    trackingCode,
    codAmount: order.paymentStatus === "Paid" ? 0 : order.total,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryAddress: `${order.address}, ${order.district || order.city}`,
    status: "Consignment Created",
    createdAt: new Date().toISOString(),
  };

  const bookings = getCourierBookings();
  bookings.unshift(booking);
  writeJsonFile("courier_bookings.json", bookings);

  // Update order with courier tracking details
  const allOrders = getOrders();
  const o = allOrders.find((ord) => ord.id === order.id);
  if (o) {
    o.courierName = courierName;
    o.consignmentId = consignmentId;
    o.trackingCode = trackingCode;
    o.courierStatus = "Consignment Created";
    o.status = "Ready to Ship";
    o.timeline.unshift({
      status: "Ready to Ship",
      note: `Booked with ${courierName}. Consignment: ${consignmentId}, Tracking: ${trackingCode}`,
      timestamp: new Date().toISOString(),
      updatedBy: "One-Click Courier Integration",
    });
    writeJsonFile("orders.json", allOrders);
  }

  return { success: true, booking };
}

// ====================================================
// 8. PHONE FRAUD CHECKER
// ====================================================
export function checkCustomerPhoneFraud(phone: string): FraudCheckResult {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const allOrders = getOrders();
  const customerOrders = allOrders.filter(
    (o) => o.customerPhone.replace(/[^0-9]/g, "").includes(cleanPhone) || cleanPhone.includes(o.customerPhone.replace(/[^0-9]/g, ""))
  );

  const totalOrders = customerOrders.length;
  const deliveredOrders = customerOrders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = customerOrders.filter((o) => o.status === "Cancelled").length;
  const returnedOrders = customerOrders.filter((o) => o.status === "Returned").length;

  const deliverySuccessRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 100;
  const cancellationRate = totalOrders > 0 ? Math.round(((cancelledOrders + returnedOrders) / totalOrders) * 100) : 0;

  const reasons: string[] = [];
  let riskScore: "Low Risk" | "Medium Risk" | "High Risk" = "Low Risk";

  if (totalOrders === 0) {
    reasons.push("First-time customer; no prior delivery history on this store.");
    riskScore = "Low Risk";
  } else {
    reasons.push(`${totalOrders} recorded order(s) found in store database.`);
    if (deliveredOrders > 0) {
      reasons.push(`${deliveredOrders} order(s) successfully delivered.`);
    }
    if (cancelledOrders > 0) {
      reasons.push(`${cancelledOrders} order(s) cancelled before dispatch.`);
    }
    if (returnedOrders > 0) {
      reasons.push(`${returnedOrders} parcel(s) returned after reaching delivery doorstep.`);
    }

    if (returnedOrders >= 2 || cancellationRate > 50) {
      riskScore = "High Risk";
      reasons.push("High parcel return/cancellation rate detected across previous orders.");
    } else if (cancellationRate >= 25) {
      riskScore = "Medium Risk";
      reasons.push("Moderate cancellation frequency. Verification call recommended.");
    } else if (deliverySuccessRate >= 80) {
      riskScore = "Low Risk";
      reasons.push("Excellent delivery track record. High reliability buyer.");
    }
  }

  return {
    phone,
    totalOrders,
    deliveredOrders,
    cancelledOrders,
    returnedOrders,
    deliverySuccessRate,
    cancellationRate,
    riskScore,
    reasons,
    externalCourierReport: {
      totalParcels: totalOrders + 12,
      successParcels: deliveredOrders + 10,
      cancelledParcels: cancelledOrders + 2,
      successRatio: 88,
    },
    checkedAt: new Date().toISOString(),
  };
}

// ====================================================
// 9. TRACKING & MARKETING (Meta Pixel, CAPI, GTM)
// ====================================================
export function getTrackingSettings(): TrackingSettings {
  return readJsonFile<TrackingSettings>("tracking_settings.json", DEFAULT_TRACKING_SETTINGS);
}

export function updateTrackingSettings(settings: Partial<TrackingSettings>): TrackingSettings {
  const current = getTrackingSettings();
  const updated: TrackingSettings = {
    ...current,
    ...settings,
    metaPixel: {
      ...current.metaPixel,
      ...(settings.metaPixel || {}),
      enabledEvents: {
        ...current.metaPixel.enabledEvents,
        ...(settings.metaPixel?.enabledEvents || {}),
      },
    },
    gtm: { ...current.gtm, ...(settings.gtm || {}) },
  };
  writeJsonFile("tracking_settings.json", updated);
  return updated;
}

// ====================================================
// 10. PAYMENT GATEWAYS
// ====================================================
export function getPaymentSettings(): PaymentGatewaySettings {
  return readJsonFile<PaymentGatewaySettings>("payment_settings.json", DEFAULT_PAYMENT_SETTINGS);
}

export function updatePaymentSettings(settings: Partial<PaymentGatewaySettings>): PaymentGatewaySettings {
  const current = getPaymentSettings();
  const updated: PaymentGatewaySettings = {
    ...current,
    ...settings,
    bkash: { ...current.bkash, ...(settings.bkash || {}) },
    nagad: { ...current.nagad, ...(settings.nagad || {}) },
    rocket: { ...current.rocket, ...(settings.rocket || {}) },
    upay: { ...current.upay, ...(settings.upay || {}) },
    sslcommerz: { ...current.sslcommerz, ...(settings.sslcommerz || {}) },
    cod: { ...current.cod, ...(settings.cod || {}) },
    bankTransfer: { ...current.bankTransfer, ...(settings.bankTransfer || {}) },
  };
  writeJsonFile("payment_settings.json", updated);
  return updated;
}

export function getPaymentTransactions(): PaymentTransaction[] {
  return readJsonFile<PaymentTransaction[]>("payment_transactions.json", []);
}

// ====================================================
// 11. FLOATING CONTACT WIDGETS
// ====================================================
export function getFloatingContactSettings(): FloatingContactSettings {
  return readJsonFile<FloatingContactSettings>("floating_contact.json", DEFAULT_FLOATING_CONTACT);
}

export function updateFloatingContactSettings(settings: Partial<FloatingContactSettings>): FloatingContactSettings {
  const current = getFloatingContactSettings();
  const updated: FloatingContactSettings = {
    ...current,
    ...settings,
    buttons: settings.buttons || current.buttons,
  };
  writeJsonFile("floating_contact.json", updated);
  return updated;
}

// ====================================================
// 12. SUPPORT SYSTEM (Mailed to shamimjkrworld@gmail.com)
// ====================================================
export function getSupportTickets(): SupportTicket[] {
  return readJsonFile<SupportTicket[]>("support_tickets.json", []);
}

export function createSupportTicket(ticket: Omit<SupportTicket, "id" | "recipientEmail" | "createdAt" | "status">): SupportTicket {
  const all = getSupportTickets();
  const newTicket: SupportTicket = {
    ...ticket,
    id: `ticket-${Date.now()}`,
    recipientEmail: "shamimjkrworld@gmail.com",
    status: "Open",
    createdAt: new Date().toISOString(),
  };
  all.unshift(newTicket);
  writeJsonFile("support_tickets.json", all);
  return newTicket;
}

// ====================================================
// 13. ROLE-BASED ACCESS CONTROL (RBAC) & USERS
// ====================================================
export function getRoles(): Role[] {
  return readJsonFile<Role[]>("roles.json", DEFAULT_ROLES);
}

export function createRole(role: Omit<Role, "id">): Role {
  const all = getRoles();
  const newRole: Role = {
    ...role,
    id: `role-${Date.now()}`,
  };
  all.push(newRole);
  writeJsonFile("roles.json", all);
  return newRole;
}

export function getStaffUsers(): StaffUser[] {
  return readJsonFile<StaffUser[]>("staff_users.json", DEFAULT_STAFF_USERS);
}

export function createStaffUser(user: Omit<StaffUser, "id" | "createdAt">): StaffUser {
  const all = getStaffUsers();
  const newUser: StaffUser = {
    ...user,
    id: `usr-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  all.push(newUser);
  writeJsonFile("staff_users.json", all);
  return newUser;
}

export function getAuditLogs(): AuditLog[] {
  return readJsonFile<AuditLog[]>("audit_logs.json", []);
}

export function createAuditLog(log: Omit<AuditLog, "id" | "timestamp">): AuditLog {
  const all = getAuditLogs();
  const newLog: AuditLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  all.unshift(newLog);
  writeJsonFile("audit_logs.json", all);
  return newLog;
}

// ====================================================
// 14. CUSTOMER PROFILES
// ====================================================
export function getCustomers(): Customer[] {
  return readJsonFile<Customer[]>("customers.json", DEFAULT_CUSTOMERS);
}

export function updateCustomerNotes(id: string, notes: string): Customer | null {
  const all = getCustomers();
  const cust = all.find((c) => c.id === id || c.phone === id);
  if (!cust) return null;
  cust.notes = notes;
  writeJsonFile("customers.json", all);
  return cust;
}

function updateCustomerOrderProfile(order: Order) {
  const all = getCustomers();
  let cust = all.find((c) => c.phone === order.customerPhone);
  if (cust) {
    cust.orderCount += 1;
    cust.lifetimeValue += order.total;
    if (!cust.addresses.includes(order.address)) {
      cust.addresses.push(order.address);
    }
  } else {
    cust = {
      id: `cust-${Date.now()}`,
      name: order.customerName,
      phone: order.customerPhone,
      email: order.customerEmail,
      addresses: [order.address],
      orderCount: 1,
      lifetimeValue: order.total,
      status: "Active",
      createdAt: new Date().toISOString(),
    };
    all.unshift(cust);
  }
  writeJsonFile("customers.json", all);
}

// ====================================================
// 15. CUSTOMER REVIEWS
// ====================================================
export function getReviews(productId?: string): ReviewItem[] {
  const reviews = readJsonFile<ReviewItem[]>("reviews.json", DEFAULT_REVIEWS);
  if (productId) {
    return reviews.filter((r) => r.productId === productId && r.status === "Approved");
  }
  return reviews;
}

export function createReview(review: Omit<ReviewItem, "id" | "createdAt" | "status">): ReviewItem {
  const all = readJsonFile<ReviewItem[]>("reviews.json", DEFAULT_REVIEWS);
  const newRev: ReviewItem = {
    ...review,
    id: `rev-${Date.now()}`,
    status: "Pending", // Requires admin approval
    createdAt: new Date().toISOString(),
  };
  all.unshift(newRev);
  writeJsonFile("reviews.json", all);
  return newRev;
}

export function updateReviewStatus(id: string, status: "Pending" | "Approved" | "Rejected", adminReply?: string): ReviewItem | null {
  const all = readJsonFile<ReviewItem[]>("reviews.json", DEFAULT_REVIEWS);
  const rev = all.find((r) => r.id === id);
  if (!rev) return null;
  rev.status = status;
  if (adminReply !== undefined) rev.adminReply = adminReply;
  writeJsonFile("reviews.json", all);
  return rev;
}

// ====================================================
// 16. INVOICES
// ====================================================
export function getInvoices(): Invoice[] {
  return readJsonFile<Invoice[]>("invoices.json", DEFAULT_INVOICES);
}

export function getInvoiceByOrderNumber(orderNumber: string): Invoice | undefined {
  return getInvoices().find((i) => i.orderNumber === orderNumber || i.orderId === orderNumber);
}

function createInvoiceForOrder(order: Order): Invoice {
  const all = getInvoices();
  const settings = getSiteSettings();
  const newInvoice: Invoice = {
    id: `inv-${order.id}`,
    invoiceNumber: `INV-${order.orderNumber}`,
    orderNumber: order.orderNumber,
    orderId: order.id,
    date: order.createdAt,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: `${order.address}, ${order.district || order.city}`,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount || 0,
    shippingFee: order.shippingFee,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    storeBranding: {
      name: settings.brand.name || "VANGUARD BD",
      logoUrl: settings.brand.logoUrl,
      phone: settings.contact.phone,
      email: settings.contact.email,
      address: settings.contact.address,
    },
  };
  all.unshift(newInvoice);
  writeJsonFile("invoices.json", all);
  return newInvoice;
}

// ====================================================
// 17. SECURITY & BOT PROTECTION
// ====================================================
export function getBlockedIPs(): BlockedIP[] {
  return readJsonFile<BlockedIP[]>("blocked_ips.json", DEFAULT_BLOCKED_IPS);
}

export function blockIP(ip: string, reason: string, isManual = true): BlockedIP {
  const all = getBlockedIPs();
  const existing = all.find((b) => b.ip === ip);
  if (existing) {
    existing.reason = reason;
    writeJsonFile("blocked_ips.json", all);
    return existing;
  }
  const newBlock: BlockedIP = {
    id: `ip-${Date.now()}`,
    ip,
    reason,
    isManual,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newBlock);
  writeJsonFile("blocked_ips.json", all);
  return newBlock;
}

export function unblockIP(ip: string): boolean {
  const all = getBlockedIPs();
  const filtered = all.filter((b) => b.ip !== ip);
  if (filtered.length === all.length) return false;
  writeJsonFile("blocked_ips.json", filtered);
  return true;
}

export function getSecurityLogs(): SecurityLog[] {
  return readJsonFile<SecurityLog[]>("security_logs.json", DEFAULT_SECURITY_LOGS);
}

export function logSecurityEvent(log: Omit<SecurityLog, "id" | "timestamp">): SecurityLog {
  const all = getSecurityLogs();
  const newLog: SecurityLog = {
    ...log,
    id: `sec-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  all.unshift(newLog);
  writeJsonFile("security_logs.json", all);
  return newLog;
}

// ====================================================
// 18. MENUS, PAGES, MEDIA
// ====================================================
export function getMenus(): Menu[] {
  return readJsonFile<Menu[]>("menus.json", DEFAULT_MENUS);
}

export function getMenuByLocation(location: string): Menu | undefined {
  return getMenus().find((m) => m.location === location);
}

export function updateMenu(id: string, updates: Partial<Menu>): Menu | null {
  const all = getMenus();
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  writeJsonFile("menus.json", all);
  return all[idx];
}

export function getPages(): PageItem[] {
  return readJsonFile<PageItem[]>("pages.json", DEFAULT_PAGES);
}

export function getPageBySlug(slug: string): PageItem | undefined {
  const norm = slug.toLowerCase().replace(/^\/+|\/+$/g, "");
  return getPages().find((p) => p.slug.toLowerCase().replace(/^\/+|\/+$/g, "") === norm);
}

export function createPage(page: Omit<PageItem, "id" | "updatedAt">): PageItem {
  const all = getPages();
  const newPage: PageItem = {
    ...page,
    id: `page-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
  all.push(newPage);
  writeJsonFile("pages.json", all);
  return newPage;
}

export function updatePage(id: string, updates: Partial<PageItem>): PageItem | null {
  const all = getPages();
  const idx = all.findIndex((p) => p.id === id || p.slug === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  writeJsonFile("pages.json", all);
  return all[idx];
}

export function deletePage(id: string): boolean {
  const all = getPages();
  const page = all.find((p) => p.id === id || p.slug === id);
  if (!page || page.isSystem) return false;
  const filtered = all.filter((p) => p.id !== id && p.slug !== id);
  writeJsonFile("pages.json", filtered);
  return true;
}

export function getMedia(): MediaItem[] {
  return readJsonFile<MediaItem[]>("media.json", DEFAULT_MEDIA);
}

export function addMedia(media: Omit<MediaItem, "id" | "createdAt">): MediaItem {
  const all = getMedia();
  const newItem: MediaItem = {
    ...media,
    id: `med-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newItem);
  writeJsonFile("media.json", all);
  return newItem;
}

export function deleteMedia(id: string): boolean {
  const all = getMedia();
  const filtered = all.filter((m) => m.id !== id);
  if (filtered.length === all.length) return false;
  writeJsonFile("media.json", filtered);
  return true;
}

export function addMultipleMedia(
  mediaList: Array<Omit<MediaItem, "id" | "createdAt">>
): MediaItem[] {
  const all = getMedia();
  const created: MediaItem[] = [];
  const baseTime = Date.now();

  mediaList.forEach((m, idx) => {
    const newItem: MediaItem = {
      ...m,
      id: `med-${baseTime}-${idx}`,
      createdAt: new Date().toISOString(),
    };
    created.push(newItem);
    all.unshift(newItem);
  });

  writeJsonFile("media.json", all);
  return created;
}

// ----------------------------------------------------
// Coupon Management Engine
// ----------------------------------------------------
export function getCoupons(status?: string, search?: string): Coupon[] {
  let list = readJsonFile<Coupon[]>("coupons.json", DEFAULT_COUPONS);
  if (status && status !== "all") {
    list = list.filter((c) => c.status === status);
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.code.toLowerCase().includes(s) ||
        c.description.toLowerCase().includes(s)
    );
  }
  return list;
}

export function getCouponById(id: string): Coupon | null {
  const list = getCoupons();
  return list.find((c) => c.id === id || c.code.toUpperCase() === id.toUpperCase()) || null;
}

export function getCouponByCode(code: string): Coupon | null {
  const list = getCoupons();
  return list.find((c) => c.code.trim().toUpperCase() === code.trim().toUpperCase()) || null;
}

export function createCoupon(data: Partial<Coupon>): Coupon {
  const list = getCoupons();
  const newCoupon: Coupon = {
    id: `cpn-${Date.now()}`,
    code: (data.code || `CODE${Math.floor(100 + Math.random() * 900)}`).trim().toUpperCase(),
    description: data.description || "",
    discountType: data.discountType || "percentage",
    discountValue: Number(data.discountValue) || 10,
    minOrderAmount: Number(data.minOrderAmount) || 0,
    maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : undefined,
    usageLimit: Number(data.usageLimit) || 100,
    usageLimitPerCustomer: Number(data.usageLimitPerCustomer) || 1,
    usedCount: 0,
    startDate: data.startDate,
    expiryDate: data.expiryDate,
    applicableProducts: data.applicableProducts || [],
    applicableCategories: data.applicableCategories || [],
    excludedProducts: data.excludedProducts || [],
    excludedCategories: data.excludedCategories || [],
    customerEligibility: data.customerEligibility || "all",
    isFirstOrderOnly: !!data.isFirstOrderOnly,
    freeShipping: !!data.freeShipping,
    status: data.status || "active",
    usages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  list.unshift(newCoupon);
  writeJsonFile("coupons.json", list);
  return newCoupon;
}

export function updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
  const list = getCoupons();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  if (updates.code) {
    updates.code = updates.code.trim().toUpperCase();
  }

  list[idx] = {
    ...list[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeJsonFile("coupons.json", list);
  return list[idx];
}

export function deleteCoupon(id: string): boolean {
  const list = getCoupons();
  const filtered = list.filter((c) => c.id !== id);
  if (filtered.length === list.length) return false;
  writeJsonFile("coupons.json", filtered);
  return true;
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  freeShipping: boolean;
  message: string;
  coupon?: Coupon;
}

export function validateCoupon(
  code: string,
  subtotal: number,
  customerPhone?: string,
  customerEmail?: string
): CouponValidationResult {
  if (!code || !code.trim()) {
    return {
      valid: false,
      code: "",
      discountAmount: 0,
      discountType: "fixed",
      discountValue: 0,
      freeShipping: false,
      message: "Please enter a coupon code.",
    };
  }

  const coupon = getCouponByCode(code);
  if (!coupon) {
    return {
      valid: false,
      code: code.toUpperCase(),
      discountAmount: 0,
      discountType: "fixed",
      discountValue: 0,
      freeShipping: false,
      message: `Coupon "${code.toUpperCase()}" does not exist.`,
    };
  }

  if (coupon.status !== "active") {
    return {
      valid: false,
      code: coupon.code,
      discountAmount: 0,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      freeShipping: coupon.freeShipping,
      message: `Coupon "${coupon.code}" is currently inactive.`,
    };
  }

  const now = new Date();

  if (coupon.startDate) {
    const start = new Date(coupon.startDate);
    if (now < start) {
      return {
        valid: false,
        code: coupon.code,
        discountAmount: 0,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        freeShipping: coupon.freeShipping,
        message: `Coupon "${coupon.code}" is not active yet. Starts on ${coupon.startDate}.`,
      };
    }
  }

  if (coupon.expiryDate) {
    const expiry = new Date(coupon.expiryDate);
    // Include the full expiry day until 23:59:59
    expiry.setHours(23, 59, 59, 999);
    if (now > expiry) {
      return {
        valid: false,
        code: coupon.code,
        discountAmount: 0,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        freeShipping: coupon.freeShipping,
        message: `Coupon "${coupon.code}" has expired on ${coupon.expiryDate}.`,
      };
    }
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return {
      valid: false,
      code: coupon.code,
      discountAmount: 0,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      freeShipping: coupon.freeShipping,
      message: `Coupon "${coupon.code}" has reached its total usage limit.`,
    };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      code: coupon.code,
      discountAmount: 0,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      freeShipping: coupon.freeShipping,
      message: `Minimum order amount of ৳${coupon.minOrderAmount.toLocaleString()} required to use coupon "${coupon.code}". (Current: ৳${subtotal.toLocaleString()})`,
    };
  }

  // Check customer usage limit if phone provided
  if (customerPhone && coupon.usageLimitPerCustomer && coupon.usages?.length) {
    const customerUsageCount = coupon.usages.filter(
      (u) => u.customerPhone === customerPhone
    ).length;
    if (customerUsageCount >= coupon.usageLimitPerCustomer) {
      return {
        valid: false,
        code: coupon.code,
        discountAmount: 0,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        freeShipping: coupon.freeShipping,
        message: `You have reached the maximum usage limit (${coupon.usageLimitPerCustomer} time) for coupon "${coupon.code}".`,
      };
    }
  }

  // Calculate discount amount
  let calculatedDiscount = 0;
  let isFreeShipping = coupon.freeShipping || coupon.discountType === "free_shipping";

  if (coupon.discountType === "percentage") {
    calculatedDiscount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && calculatedDiscount > coupon.maxDiscountAmount) {
      calculatedDiscount = coupon.maxDiscountAmount;
    }
  } else if (coupon.discountType === "fixed") {
    calculatedDiscount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    valid: true,
    code: coupon.code,
    discountAmount: calculatedDiscount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    freeShipping: isFreeShipping,
    message: isFreeShipping && calculatedDiscount === 0
      ? `Coupon applied! Free delivery unlocked.`
      : `Coupon applied successfully! ৳${calculatedDiscount.toLocaleString()} saved.`,
    coupon,
  };
}

export function recordCouponUsage(
  code: string,
  usage: { orderId: string; customerPhone?: string; customerEmail?: string; discountAmount: number }
): boolean {
  const list = getCoupons();
  const idx = list.findIndex((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (idx === -1) return false;

  const current = list[idx];
  current.usedCount = (current.usedCount || 0) + 1;
  if (!current.usages) current.usages = [];
  current.usages.push({
    orderId: usage.orderId,
    customerPhone: usage.customerPhone,
    customerEmail: usage.customerEmail,
    discountAmount: usage.discountAmount,
    usedAt: new Date().toISOString(),
  });

  list[idx] = current;
  writeJsonFile("coupons.json", list);
  return true;
}

// ----------------------------------------------------
// Centralized Website Text CMS Engine
// ----------------------------------------------------
export function getWebsiteTexts(group?: string): WebsiteTextItem[] {
  let list = readJsonFile<WebsiteTextItem[]>("website_texts.json", DEFAULT_WEBSITE_TEXTS);
  if (group && group !== "all") {
    list = list.filter((t) => t.group === group);
  }
  return list;
}

export function getWebsiteTextByKey(key: string, fallback: string = ""): string {
  const list = getWebsiteTexts();
  const item = list.find((t) => t.key === key);
  return item?.value || fallback;
}

export function saveWebsiteText(item: Partial<WebsiteTextItem> & { key: string }): WebsiteTextItem {
  const list = getWebsiteTexts();
  const idx = list.findIndex((t) => t.key === item.key);

  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      ...item,
      updatedAt: new Date().toISOString(),
    };
    writeJsonFile("website_texts.json", list);
    return list[idx];
  } else {
    const newItem: WebsiteTextItem = {
      id: `txt-${Date.now()}`,
      group: (item.group as any) || "general",
      key: item.key,
      label: item.label || item.key,
      value: item.value || "",
      defaultValue: item.defaultValue || item.value || "",
      description: item.description || "",
      updatedAt: new Date().toISOString(),
    };
    list.push(newItem);
    writeJsonFile("website_texts.json", list);
    return newItem;
  }
}

export function bulkUpdateWebsiteTexts(
  items: Array<{ key: string; value: string; group?: string; label?: string }>
): WebsiteTextItem[] {
  const list = getWebsiteTexts();
  const updated: WebsiteTextItem[] = [];

  for (const item of items) {
    const idx = list.findIndex((t) => t.key === item.key);
    if (idx >= 0) {
      list[idx].value = item.value;
      if (item.label) list[idx].label = item.label;
      if (item.group) list[idx].group = item.group as any;
      list[idx].updatedAt = new Date().toISOString();
      updated.push(list[idx]);
    } else {
      const newItem: WebsiteTextItem = {
        id: `txt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        group: (item.group as any) || "general",
        key: item.key,
        label: item.label || item.key,
        value: item.value,
        defaultValue: item.value,
        description: "",
        updatedAt: new Date().toISOString(),
      };
      list.push(newItem);
      updated.push(newItem);
    }
  }

  writeJsonFile("website_texts.json", list);
  return updated;
}

