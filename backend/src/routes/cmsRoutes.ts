import { Router, Request, Response } from "express";
import {
  getSiteSettings,
  updateSiteSettings,
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  duplicateSection,
  reorderSections,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPages,
  createPage,
  updatePage,
  deletePage,
  getMedia,
  addMedia,
  deleteMedia,
  getMenus,
  updateMenu,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  addOrderInternalNote,
  getInventoryOverview,
  getStockTransactions,
  adjustStock,
  getSuppliers,
  createSupplier,
  getCourierSettings,
  updateCourierSettings,
  getCourierBookings,
  bookCourierConsignment,
  checkCustomerPhoneFraud,
  getTrackingSettings,
  updateTrackingSettings,
  getPaymentSettings,
  updatePaymentSettings,
  getPaymentTransactions,
  getFloatingContactSettings,
  updateFloatingContactSettings,
  getSupportTickets,
  createSupportTicket,
  getRoles,
  createRole,
  getStaffUsers,
  createStaffUser,
  getAuditLogs,
  getCustomers,
  updateCustomerNotes,
  getReviews,
  createReview,
  updateReviewStatus,
  getInvoices,
  getInvoiceByOrderNumber,
  getBlockedIPs,
  blockIP,
  unblockIP,
  getSecurityLogs,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getWebsiteTexts,
  saveWebsiteText,
  bulkUpdateWebsiteTexts,
} from "../../../src/lib/cmsDataStore";

const router = Router();

// Settings
router.get("/settings", (_req: Request, res: Response) => {
  res.json({ success: true, data: getSiteSettings() });
});
router.put("/settings", (req: Request, res: Response) => {
  res.json({ success: true, data: updateSiteSettings(req.body) });
});

// Sections
router.get("/sections", (req: Request, res: Response) => {
  const pageSlug = (req.query.pageSlug as string) || "home";
  res.json({ success: true, data: getSections(pageSlug) });
});
router.post("/sections", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createSection(req.body) });
});
router.post("/sections/reorder", (req: Request, res: Response) => {
  res.json({ success: true, data: reorderSections(req.body.sectionIds || []) });
});
router.get("/sections/:id", (req: Request, res: Response) => {
  const section = getSectionById(req.params.id);
  if (!section) return res.status(404).json({ success: false, error: "Section not found" });
  res.json({ success: true, data: section });
});
router.put("/sections/:id", (req: Request, res: Response) => {
  const updated = updateSection(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: "Section not found" });
  res.json({ success: true, data: updated });
});
router.delete("/sections/:id", (req: Request, res: Response) => {
  const success = deleteSection(req.params.id);
  res.json({ success });
});
router.post("/sections/:id/duplicate", (req: Request, res: Response) => {
  const clone = duplicateSection(req.params.id);
  if (!clone) return res.status(404).json({ success: false, error: "Section not found" });
  res.json({ success: true, data: clone });
});

// Products
router.get("/products", (req: Request, res: Response) => {
  const products = getProducts({
    categorySlug: req.query.categorySlug as string,
    search: req.query.search as string,
    featuredOnly: req.query.featured === "true",
  });
  res.json({ success: true, data: products });
});
router.get("/products/:id", (req: Request, res: Response) => {
  const product = getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: "Product not found" });
  res.json({ success: true, data: product });
});
router.post("/products", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createProduct(req.body) });
});
router.put("/products/:id", (req: Request, res: Response) => {
  const updated = updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: "Product not found" });
  res.json({ success: true, data: updated });
});
router.delete("/products/:id", (req: Request, res: Response) => {
  const success = deleteProduct(req.params.id);
  res.json({ success });
});
router.post("/products/:id/duplicate", (req: Request, res: Response) => {
  const clone = duplicateProduct(req.params.id);
  if (!clone) return res.status(404).json({ success: false, error: "Product not found" });
  res.json({ success: true, data: clone });
});

// Categories
router.get("/categories", (_req: Request, res: Response) => {
  res.json({ success: true, data: getCategories() });
});
router.post("/categories", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createCategory(req.body) });
});
router.put("/categories/:id", (req: Request, res: Response) => {
  const updated = updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: "Category not found" });
  res.json({ success: true, data: updated });
});
router.delete("/categories/:id", (req: Request, res: Response) => {
  const reassignToId = req.query.reassignToId as string | undefined;
  const result = deleteCategory(req.params.id, reassignToId);
  if (!result.success) return res.status(400).json({ success: false, error: result.error });
  res.json({ success: true });
});

// Inventory
router.get("/inventory", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      overview: getInventoryOverview(),
      transactions: getStockTransactions(),
    },
  });
});
router.post("/inventory/adjust", (req: Request, res: Response) => {
  const result = adjustStock(req.body);
  if (!result.success) return res.status(400).json({ success: false, error: result.error });
  res.json({ success: true, data: result.product });
});
router.get("/inventory/suppliers", (_req: Request, res: Response) => {
  res.json({ success: true, data: getSuppliers() });
});
router.post("/inventory/suppliers", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createSupplier(req.body) });
});

// Orders
router.get("/orders", (req: Request, res: Response) => {
  res.json({ success: true, data: getOrders(req.query.status as string) });
});
router.get("/orders/:id", (req: Request, res: Response) => {
  const order = getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });
  res.json({ success: true, data: order });
});
router.post("/orders", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createOrder(req.body) });
});
router.put("/orders/:id", (req: Request, res: Response) => {
  const { status, note, performedBy } = req.body;
  const updated = updateOrderStatus(req.params.id, status, note, performedBy || "Admin");
  if (!updated) return res.status(404).json({ success: false, error: "Order not found" });
  res.json({ success: true, data: updated });
});
router.post("/orders/:id/notes", (req: Request, res: Response) => {
  const { text, author } = req.body;
  const updated = addOrderInternalNote(req.params.id, text, author || "Admin");
  if (!updated) return res.status(404).json({ success: false, error: "Order not found" });
  res.json({ success: true, data: updated });
});

// Courier
router.get("/courier/settings", (_req: Request, res: Response) => {
  res.json({ success: true, data: getCourierSettings() });
});
router.put("/courier/settings", (req: Request, res: Response) => {
  res.json({ success: true, data: updateCourierSettings(req.body) });
});
router.get("/courier/bookings", (_req: Request, res: Response) => {
  res.json({ success: true, data: getCourierBookings() });
});
router.post("/courier/book", (req: Request, res: Response) => {
  const { orderId, courierName } = req.body;
  const result = bookCourierConsignment(orderId, courierName);
  if (!result.success) return res.status(400).json({ success: false, error: result.error });
  res.json({ success: true, data: result.booking });
});

// Phone Fraud Checker
router.get("/fraud-checker", (req: Request, res: Response) => {
  const phone = req.query.phone as string;
  if (!phone) return res.status(400).json({ success: false, error: "Phone number required" });
  res.json({ success: true, data: checkCustomerPhoneFraud(phone) });
});

// Tracking & Marketing
router.get("/tracking", (_req: Request, res: Response) => {
  res.json({ success: true, data: getTrackingSettings() });
});
router.put("/tracking", (req: Request, res: Response) => {
  res.json({ success: true, data: updateTrackingSettings(req.body) });
});

// Payments
router.get("/payments/settings", (_req: Request, res: Response) => {
  res.json({ success: true, data: getPaymentSettings() });
});
router.put("/payments/settings", (req: Request, res: Response) => {
  res.json({ success: true, data: updatePaymentSettings(req.body) });
});
router.get("/payments/transactions", (_req: Request, res: Response) => {
  res.json({ success: true, data: getPaymentTransactions() });
});

// Floating Contact
router.get("/floating-contact", (_req: Request, res: Response) => {
  res.json({ success: true, data: getFloatingContactSettings() });
});
router.put("/floating-contact", (req: Request, res: Response) => {
  res.json({ success: true, data: updateFloatingContactSettings(req.body) });
});

// Support
router.get("/support", (_req: Request, res: Response) => {
  res.json({ success: true, data: getSupportTickets() });
});
router.post("/support", (req: Request, res: Response) => {
  const ticket = createSupportTicket(req.body);
  res.status(201).json({
    success: true,
    data: ticket,
    message: "Support request dispatched to shamimjkrworld@gmail.com",
  });
});

// RBAC
router.get("/rbac/roles", (_req: Request, res: Response) => {
  res.json({ success: true, data: getRoles() });
});
router.post("/rbac/roles", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createRole(req.body) });
});
router.get("/rbac/users", (_req: Request, res: Response) => {
  res.json({ success: true, data: getStaffUsers() });
});
router.post("/rbac/users", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createStaffUser(req.body) });
});
router.get("/rbac/audit-logs", (_req: Request, res: Response) => {
  res.json({ success: true, data: getAuditLogs() });
});

// Customers & Reviews
router.get("/customers", (_req: Request, res: Response) => {
  res.json({ success: true, data: getCustomers() });
});
router.put("/customers/:id/notes", (req: Request, res: Response) => {
  const updated = updateCustomerNotes(req.params.id, req.body.notes);
  res.json({ success: true, data: updated });
});
router.get("/reviews", (req: Request, res: Response) => {
  res.json({ success: true, data: getReviews(req.query.productId as string) });
});
router.post("/reviews", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createReview(req.body) });
});
router.put("/reviews/:id", (req: Request, res: Response) => {
  const updated = updateReviewStatus(req.params.id, req.body.status, req.body.adminReply);
  res.json({ success: true, data: updated });
});

// Invoices
router.get("/invoices", (_req: Request, res: Response) => {
  res.json({ success: true, data: getInvoices() });
});
router.get("/invoices/:id", (req: Request, res: Response) => {
  const invoice = getInvoiceByOrderNumber(req.params.id);
  if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found" });
  res.json({ success: true, data: invoice });
});

// Security & Blocked IPs
router.get("/security", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      blockedIps: getBlockedIPs(),
      logs: getSecurityLogs(),
    },
  });
});
router.post("/security/block", (req: Request, res: Response) => {
  res.json({ success: true, data: blockIP(req.body.ip, req.body.reason, true) });
});
router.post("/security/unblock", (req: Request, res: Response) => {
  res.json({ success: true, unblocked: unblockIP(req.body.ip) });
});

// Pages & Media & Menus
router.get("/pages", (_req: Request, res: Response) => {
  res.json({ success: true, data: getPages() });
});
router.post("/pages", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createPage(req.body) });
});
router.put("/pages/:id", (req: Request, res: Response) => {
  res.json({ success: true, data: updatePage(req.params.id, req.body) });
});
router.delete("/pages/:id", (req: Request, res: Response) => {
  res.json({ success: deletePage(req.params.id) });
});
router.get("/menus", (_req: Request, res: Response) => {
  res.json({ success: true, data: getMenus() });
});
router.put("/menus/:id", (req: Request, res: Response) => {
  res.json({ success: true, data: updateMenu(req.params.id, req.body) });
});
router.get("/media", (_req: Request, res: Response) => {
  res.json({ success: true, data: getMedia() });
});
router.post("/media", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: addMedia(req.body) });
});
router.delete("/media/:id", (req: Request, res: Response) => {
  res.json({ success: deleteMedia(req.params.id) });
});

// Coupons & Discounts
router.get("/coupons", (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;
  res.json({ success: true, data: getCoupons(status, search) });
});

router.post("/coupons", (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: createCoupon(req.body) });
});

router.get("/coupons/:id", (req: Request, res: Response) => {
  const coupon = getCouponById(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, error: "Coupon not found" });
  res.json({ success: true, data: coupon });
});

router.put("/coupons/:id", (req: Request, res: Response) => {
  const updated = updateCoupon(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: "Coupon not found" });
  res.json({ success: true, data: updated });
});

router.delete("/coupons/:id", (req: Request, res: Response) => {
  res.json({ success: deleteCoupon(req.params.id) });
});

router.post("/coupons/validate", (req: Request, res: Response) => {
  const { code, subtotal, customerPhone, customerEmail } = req.body;
  const result = validateCoupon(code, Number(subtotal) || 0, customerPhone, customerEmail);
  if (!result.valid) {
    return res.status(400).json({ success: false, error: result.message, data: result });
  }
  res.json({ success: true, message: result.message, data: result });
});

// Website Text CMS
router.get("/text-content", (req: Request, res: Response) => {
  const group = req.query.group as string | undefined;
  res.json({ success: true, data: getWebsiteTexts(group) });
});

router.post("/text-content", (req: Request, res: Response) => {
  if (Array.isArray(req.body)) {
    res.json({ success: true, data: bulkUpdateWebsiteTexts(req.body) });
  } else {
    res.json({ success: true, data: saveWebsiteText(req.body) });
  }
});

export default router;
