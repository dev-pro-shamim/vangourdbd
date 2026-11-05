// Comprehensive CMS & ERP Type Definitions for VANGUARD / CommandoBD Production System

export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    logoUrl?: string;
    logoWidth: number;
    logoHeight: number;
    faviconUrl?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    title: string;
    paragraph: string;
    border: string;
    alert: string;
    success: string;
    warning: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
    baseFontSize: number;
  };
  layout: {
    containerWidth: number;
    borderRadius: string;
    sectionSpacing: string;
  };
  announcement: {
    isEnabled: boolean;
    text: string;
    link: string;
    bgColor: string;
    textColor: string;
  };
  header: {
    isSticky: boolean;
    showSearch: boolean;
    showCart: boolean;
    showLogin: boolean;
    bgColor: string;
    textColor: string;
  };
  footer: {
    description: string;
    copyrightText: string;
    watermarkText: string;
    bgColor: string;
    textColor: string;
    showNewsletter: boolean;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    linkedin?: string;
    pinterest?: string;
  };
  shipping: ShippingConfig;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogImage: string;
    keywords: string;
  };
}

// ----------------------------------------------------
// Section Types
// ----------------------------------------------------
export type SectionType =
  | "hero_slider"
  | "category_collection"
  | "product_carousel"
  | "video_banner"
  | "banner_grid"
  | "new_arrivals"
  | "bento_grid"
  | "feature_grid"
  | "rich_text"
  | "custom_html"
  | "image_banner";

export interface SectionSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink: string;
  hasBrandOverlay?: boolean;
  isEnabled: boolean;
}

export interface SectionBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  badge?: string;
  colSpan?: number;
}

export interface SectionFeature {
  id: string;
  num: string;
  title: string;
  description: string;
  icon: string;
}

export interface SectionBentoItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  size: "large" | "medium" | "small";
}

export interface SectionData {
  slides?: SectionSlide[];
  autoplaySpeed?: number;
  categoryIds?: string[];
  columns?: number;
  limit?: number;
  categorySlug?: string;
  productIds?: string[];
  showArrows?: boolean;
  videoUrl?: string;
  posterImage?: string;
  discountBadge?: string;
  buttonText?: string;
  buttonLink?: string;
  banners?: SectionBanner[];
  categories?: string[];
  bentoItems?: SectionBentoItem[];
  features?: SectionFeature[];
  htmlContent?: string;
  richText?: string;
}

export interface SectionStyles {
  bgColor?: string;
  textColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  containerMaxWidth?: string;
  customClass?: string;
}

export interface Section {
  id: string;
  name: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  order: number;
  isEnabled: boolean;
  pageSlug: string;
  styles: SectionStyles;
  data: SectionData;
}

// ----------------------------------------------------
// Category & Subcategory Management
// ----------------------------------------------------
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  parentId?: string | null; // null or undefined for top-level categories
  level: number; // 0 = main category, 1 = subcategory, 2 = nested subcategory
  productCount: number;
  description?: string;
  order: number;
  isEnabled: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

// ----------------------------------------------------
// Product & Variations Management
// ----------------------------------------------------
export interface ProductVariationDetailed {
  id: string;
  sku: string;
  name: string;
  attributes: Record<string, string>; // e.g. { Size: "L", Color: "Black", Material: "Cotton" }
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  reservedStock?: number;
  image?: string;
  status: "active" | "inactive";
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  categorySlug: string;
  categoryId?: string;
  subcategoryId?: string;
  brand?: string;
  costPrice?: number;
  price: number;
  compareAtPrice: number;
  discountPercentage?: number;
  isStockOut: boolean;
  isFeatured: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  reservedStock?: number;
  description: string;
  shortDescription?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  variations?: ProductVariationDetailed[];
  relatedProductIds?: string[];
  upsellProductIds?: string[];
  crossSellProductIds?: string[];
  lowStockThreshold?: number;
}

// ----------------------------------------------------
// Inventory & ERP System
// ----------------------------------------------------
export interface StockTransaction {
  id: string;
  sku: string;
  productId: string;
  productName: string;
  variationId?: string;
  type: "PURCHASE" | "SALE" | "ADJUSTMENT" | "RETURN" | "DAMAGE" | "RESERVATION" | "RELEASE";
  quantityDelta: number; // positive or negative
  newStockLevel: number;
  reason: string;
  referenceId?: string; // Order #, PO #, etc.
  performedBy: string;
  timestamp: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryValuation {
  totalSkus: number;
  totalQuantity: number;
  totalCostValue: number;
  totalRetailValue: number;
  potentialProfit: number;
}

// ----------------------------------------------------
// Order Management (11 Comprehensive Statuses)
// ----------------------------------------------------
export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Ready to Ship"
  | "Shipped"
  | "In Transit"
  | "Delivered"
  | "Cancelled"
  | "Returned"
  | "Refunded"
  | "On Hold";

export interface OrderItem {
  productId: string;
  variationId?: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  sku?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  note: string;
  timestamp: string;
  updatedBy: string;
}

export interface OrderInternalNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface OrderAuditEntry {
  field: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  changedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: "Dhaka" | "Outside Dhaka";
  district?: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "Cash on Delivery" | "bKash" | "Nagad" | "Rocket" | "Upay" | "SSLCommerz" | "Bank Transfer";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  courierName?: "Steadfast" | "Pathao" | "RedX" | "Custom";
  consignmentId?: string;
  trackingCode?: string;
  courierStatus?: string;
  timeline: OrderTimelineEvent[];
  internalNotes: OrderInternalNote[];
  auditHistory: OrderAuditEntry[];
  createdAt: string;
  updatedAt?: string;
}

// ----------------------------------------------------
// Courier Integration (Bangladesh Logistics)
// ----------------------------------------------------
export interface CourierSettings {
  steadfast: {
    enabled: boolean;
    apiKey: string;
    secretKey: string;
    baseUrl: string;
  };
  pathao: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
    storeId: string;
    baseUrl: string;
  };
  redx: {
    enabled: boolean;
    apiKey: string;
    baseUrl: string;
  };
  defaultCourier: "Steadfast" | "Pathao" | "RedX";
  senderInfo: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface CourierBooking {
  id: string;
  orderId: string;
  orderNumber: string;
  courierName: "Steadfast" | "Pathao" | "RedX";
  consignmentId: string;
  trackingCode: string;
  codAmount: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  status: string;
  createdAt: string;
}

// ----------------------------------------------------
// Customer Phone Fraud Checker
// ----------------------------------------------------
export interface FraudCheckResult {
  phone: string;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  deliverySuccessRate: number; // e.g. 85.5%
  cancellationRate: number;
  riskScore: "Low Risk" | "Medium Risk" | "High Risk";
  reasons: string[];
  externalCourierReport?: {
    totalParcels: number;
    successParcels: number;
    cancelledParcels: number;
    successRatio: number;
  };
  checkedAt: string;
}

// ----------------------------------------------------
// Tracking & Marketing (Meta Pixel, CAPI, GTM)
// ----------------------------------------------------
export interface TrackingSettings {
  metaPixel: {
    isEnabled: boolean;
    pixelId: string;
    capiToken: string;
    testEventCode?: string;
    enabledEvents: {
      pageView: boolean;
      viewContent: boolean;
      search: boolean;
      addToCart: boolean;
      initiateCheckout: boolean;
      purchase: boolean;
    };
  };
  gtm: {
    isEnabled: boolean;
    containerId: string;
    trackEcommerce: boolean;
  };
}

// ----------------------------------------------------
// Payment Gateway Settings
// ----------------------------------------------------
export interface PaymentGatewaySettings {
  bkash: {
    enabled: boolean;
    appKey: string;
    appSecret: string;
    username: string;
    password: string;
    isSandbox: boolean;
    instructions?: string;
  };
  nagad: {
    enabled: boolean;
    merchantId: string;
    publicKey: string;
    privateKey: string;
    isSandbox: boolean;
    instructions?: string;
  };
  rocket: {
    enabled: boolean;
    accountType: "Personal" | "Merchant";
    number: string;
    instructions?: string;
  };
  upay: {
    enabled: boolean;
    accountType: "Personal" | "Merchant";
    number: string;
    instructions?: string;
  };
  sslcommerz: {
    enabled: boolean;
    storeId: string;
    storePassword: string;
    isSandbox: boolean;
  };
  cod: {
    enabled: boolean;
    extraCharge: number;
    instructions?: string;
  };
  bankTransfer: {
    enabled: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    routingNumber?: string;
  };
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  gateway: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: "Pending" | "Success" | "Failed" | "Refunded";
  verifiedServerSide: boolean;
  rawResponse?: any;
  createdAt: string;
}

// ----------------------------------------------------
// Shipping Configuration
// ----------------------------------------------------
export interface ShippingDistrictRate {
  district: string;
  rate: number;
}

export interface ShippingConfig {
  insideDhaka: number;
  outsideDhaka: number;
  subDhaka?: number;
  freeShippingThreshold: number;
  codFee: number;
  currency: string;
  districtRates: ShippingDistrictRate[];
}

// ----------------------------------------------------
// Floating Contact Widgets
// ----------------------------------------------------
export interface FloatingContactButton {
  id: string;
  type: "whatsapp" | "call" | "messenger" | "livechat" | "custom";
  label: string;
  value: string; // phone number or URL
  color: string;
  icon: string;
  enabled: boolean;
  showOnDesktop: boolean;
  showOnMobile: boolean;
}

export interface FloatingContactSettings {
  isEnabled: boolean;
  position: "bottom-left" | "bottom-right";
  buttons: FloatingContactButton[];
}

// ----------------------------------------------------
// Support System (Email recipient: shamimjkrworld@gmail.com)
// ----------------------------------------------------
export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  senderEmail: string;
  senderName: string;
  recipientEmail: string; // shamimjkrworld@gmail.com
  attachments?: string[];
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
}

// ----------------------------------------------------
// Role-Based Access Control (RBAC) & Users
// ----------------------------------------------------
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// ----------------------------------------------------
// Customer Management
// ----------------------------------------------------
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: string[];
  orderCount: number;
  lifetimeValue: number;
  status: "Active" | "Blocked" | "VIP";
  notes?: string;
  createdAt: string;
}

// ----------------------------------------------------
// Customer Reviews
// ----------------------------------------------------
export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1 to 5
  reviewText: string;
  status: "Pending" | "Approved" | "Rejected";
  isVerifiedPurchase: boolean;
  adminReply?: string;
  createdAt: string;
}

// ----------------------------------------------------
// Invoices
// ----------------------------------------------------
export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  orderId: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  storeBranding: {
    name: string;
    logoUrl?: string;
    phone: string;
    email: string;
    address: string;
  };
}

// ----------------------------------------------------
// Security & Bot Protection
// ----------------------------------------------------
export interface SecurityLog {
  id: string;
  ip: string;
  userAgent: string;
  action: string;
  reason?: string;
  riskScore: number;
  status: "ALLOWED" | "BLOCKED" | "FLAGGED";
  timestamp: string;
}

export interface BlockedIP {
  id: string;
  ip: string;
  reason: string;
  isManual: boolean;
  expiresAt?: string;
  createdAt: string;
}

// ----------------------------------------------------
// Menus, Pages, Media
// ----------------------------------------------------
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  isHighlight?: boolean;
  target?: string;
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  location: "header_main" | "footer_company" | "footer_policies" | "footer_quick" | "mobile_drawer";
  items: MenuItem[];
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  isSystem: boolean;
  isPublished: boolean;
  template: "default" | "builder" | "policy" | "contact";
  content?: string;
  sections?: Section[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  publicId?: string;
  size: number;
  mimeType: string;
  folder: "banners" | "products" | "categories" | "general";
  altText: string;
  createdAt: string;
}

// ----------------------------------------------------
// Coupons & Promotions
// ----------------------------------------------------
export type DiscountType = "percentage" | "fixed" | "free_shipping";

export interface CouponUsageRecord {
  orderId: string;
  customerPhone?: string;
  customerEmail?: string;
  discountAmount: number;
  usedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usageLimitPerCustomer: number;
  usedCount: number;
  startDate?: string;
  expiryDate?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  customerEligibility: "all" | "logged_in" | "first_order_only";
  isFirstOrderOnly: boolean;
  freeShipping: boolean;
  status: "active" | "inactive";
  usages: CouponUsageRecord[];
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// Centralized Website Text CMS
// ----------------------------------------------------
export type TextGroup =
  | "homepage"
  | "banners"
  | "products"
  | "categories"
  | "about"
  | "contact"
  | "footer"
  | "announcement"
  | "newsletter"
  | "policy"
  | "general";

export interface WebsiteTextItem {
  id: string;
  group: TextGroup;
  key: string;
  label: string;
  value: string;
  defaultValue?: string;
  description?: string;
  updatedAt: string;
}

