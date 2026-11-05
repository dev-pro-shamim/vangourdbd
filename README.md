# VANGUARD BD — Production-Ready E-Commerce & Advanced CMS / ERP Platform

Reference Design & Standard: Inspired by Commando BD (`https://commandobd.com/`)  
Brand Identity: **VANGUARD BD** — *EXPLORE YOUR FASHION*

---

## 🚀 Overview

A full-stack, enterprise-grade e-commerce ecosystem built with Next.js, React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB/Mongoose, and Redis. Features an advanced 100% dynamic CMS Page Builder, comprehensive ERP-style Admin Management System, real-time inventory tracking, and Bangladesh courier integrations (Steadfast, Pathao, RedX).

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide Icons
- **Backend:** Node.js, Express.js, TypeScript (`backend/src/server.ts`)
- **Database / Data Store:** MongoDB / Mongoose with resilient JSON file fallback (`.cms-data/`)
- **State Management & Context:** React Context API (`CMSContext`, `CartContext`)
- **Authentication & Security:** JWT Authentication, Role-Based Access Control (RBAC), bcrypt
- **Integrations:**
  - Couriers: Steadfast, Pathao, RedX
  - Media & Storage: Multi-image file uploads, Cloudinary support
  - Payment Gateways: bKash, Nagad, Rocket, Cash on Delivery (COD)

---

## 🌟 Key Features

### 1. 1:1 Pixel-Perfect Modern E-Commerce Storefront
- Dynamic Hero Banner Slider with mobile & desktop variants
- 3-Column Promo Feature Grid (Polo, Denim, Cargo Pants)
- New Arrivals & Flash Sale Carousels
- Interactive Category Collection Grid
- Responsive Product Drawer, Quick Cart & Fast Checkout
- Customer Accounts (`/my/orders`, `/my/wishlists`, `/track/order`)

### 2. Advanced CMS & Page Builder (`/admin/page-builder`, `/admin/sections`)
- 100% dynamic content editing for every heading, banner, button, and image
- Visual drag-and-drop section reordering
- Section enable/disable toggle without page reload
- Hero Banner Manager (`/admin/hero-banners`) with live publishing

### 3. Comprehensive Product & Variation Management (`/admin/products`)
- Multi-image upload with gallery ordering and thumbnail selection
- Dynamic cascading category and subcategory selection
- Unlimited variations (Size, Color, Material, Fit) with independent SKUs, prices, and stock

### 4. Category & Subcategory Management (`/admin/categories`)
- Infinite category nesting and parent-child hierarchy
- Dedicated image uploader per category and subcategory
- Quick `+ Subcategory` button on every parent category card

### 5. ERP-Style Order Management (`/admin/orders`)
- 11-stage order lifecycle tracking (`Pending` $\rightarrow$ `Delivered`)
- Inline manual status dropdown per order
- Date-by-Day history view with daily revenue and count aggregation
- Bulk selection with multi-order status change, bulk invoice printing, and CSV export

### 6. Inventory & Warehouse Management (`/admin/inventory`)
- Real-time stock reserve, damage, and return tracking
- Automated inventory transaction logs and stock adjustment reasons
- Low stock and out-of-stock threshold alerts

### 7. Courier & Logistics Management (`/admin/courier`)
- Direct API integration with Steadfast, Pathao, and RedX
- One-click consignment booking, barcode generation, and tracking ID syncing

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dev-pro-shamim/vangourdbd.git
cd vangourdbd

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Next.js development server
npm run dev

# Or run the production dual-port runner (Port 3000 & 3001)
node scripts/run_dual_ports.js

# Start Express Backend API server (Port 5000)
npx tsx backend/src/server.ts
```

- **Live Storefront:** `http://localhost:3000` / `http://localhost:3001`
- **Admin Dashboard:** `http://localhost:3001/admin`
- **Backend API:** `http://localhost:5000/api`

---

## 🔒 Security & RBAC

- Multi-tier administrative roles: Super Admin, Order Manager, Inventory Staff, Support Agent
- Password hashing with bcrypt (10 rounds)
- Full administrative audit log trail for order edits, stock changes, and CMS updates

---

## 📄 License

Proprietary — All rights reserved by **VANGUARD BD**.
