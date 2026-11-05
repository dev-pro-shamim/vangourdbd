"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  FileText,
  Navigation,
  Footprints,
  ShoppingBag,
  FolderTree,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  Menu as MenuIcon,
  Palette,
  Search,
  Settings,
  ExternalLink,
  ChevronRight,
  Database,
  Bell,
  CheckCircle2,
  Menu,
  X,
  Package,
  Truck,
  ShieldCheck,
  CreditCard,
  BarChart3,
  ShieldAlert,
  LifeBuoy,
  MessageSquare,
  FileSpreadsheet,
  Tag,
  Star,
  Send,
  Boxes,
  Lock,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, products, orders } = useCMS();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSending, setSupportSending] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  React.useEffect(() => {
    if (pathname === "/admin/login") {
      setIsCheckingAuth(false);
      return;
    }

    try {
      const stored = localStorage.getItem("vanguard_admin_auth");
      if (!stored) {
        window.location.href = "/admin/login";
        return;
      }
      const parsed = JSON.parse(stored);
      if (!parsed?.token) {
        window.location.href = "/admin/login";
        return;
      }
      setCurrentUser(parsed.user || { name: "Shahnawaz Shamim", roleName: "Super Admin", email: "admin@vanguardbd.com" });
    } catch {
      window.location.href = "/admin/login";
    } finally {
      setIsCheckingAuth(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out from Vanguard BD Admin?")) {
      localStorage.removeItem("vanguard_admin_auth");
      document.cookie = "vanguard_admin_token=; path=/; max-age=0";
      window.location.href = "/admin/login";
    }
  };

  const navGroups = [
    {
      group: "DASHBOARD",
      items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
      ],
    },
    {
      group: "CATALOG & INVENTORY",
      items: [
        { label: "All Products", href: "/admin/products", icon: ShoppingBag, badge: `${products?.length || 0}` },
        { label: "Categories & Subcategories", href: "/admin/categories", icon: FolderTree },
        { label: "Inventory ERP", href: "/admin/inventory", icon: Boxes },
        { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
      ],
    },
    {
      group: "ORDERS & CUSTOMERS",
      items: [
        { label: "All Orders", href: "/admin/orders", icon: ShoppingCart, badge: `${orders?.length || 0}` },
        { label: "Tax Invoices", href: "/admin/invoices", icon: FileSpreadsheet },
        { label: "Customers CRM", href: "/admin/customers", icon: Users },
      ],
    },
    {
      group: "MARKETING",
      items: [
        { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag, badge: "PROMO" },
        { label: "Pixel & CAPI / GTM", href: "/admin/marketing", icon: Sparkles },
      ],
    },
    {
      group: "WEBSITE CMS & CONTENT",
      items: [
        { label: "Hero Banners", href: "/admin/hero-banners", icon: ImageIcon, badge: "Hero" },
        { label: "Website Text CMS", href: "/admin/text-cms", icon: FileText, badge: "Text" },
        { label: "Visual Page Builder", href: "/admin/page-builder", icon: Sparkles, badge: "Live" },
        { label: "Homepage Builder", href: "/admin/sections", icon: Layers, badge: "9" },
        { label: "Website Pages", href: "/admin/pages", icon: FileText },
        { label: "Header & Announcement", href: "/admin/header", icon: Navigation },
        { label: "Footer & Watermark", href: "/admin/footer", icon: Footprints },
        { label: "Navigation Menus", href: "/admin/menus", icon: MenuIcon },
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
        { label: "Global Design Tokens", href: "/admin/design", icon: Palette },
      ],
    },
    {
      group: "COURIER & OPERATIONS",
      items: [
        { label: "Courier Integration", href: "/admin/courier", icon: Truck },
        { label: "Phone Fraud Checker", href: "/admin/fraud-checker", icon: ShieldCheck, badge: "AI" },
        { label: "Shipping Rates", href: "/admin/shipping", icon: Package },
        { label: "Payment Gateways", href: "/admin/payments", icon: CreditCard },
        { label: "Floating Widgets", href: "/admin/floating-widgets", icon: MessageSquare },
      ],
    },
    {
      group: "SECURITY & SETTINGS",
      items: [
        { label: "Staff Users & RBAC", href: "/admin/users", icon: Lock },
        { label: "Fraud & Bot Security", href: "/admin/security", icon: ShieldAlert },
        { label: "SEO Settings", href: "/admin/seo", icon: Search },
        { label: "General Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) return;
    setSupportSending(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: supportSubject,
          message: supportMessage,
          senderName: "Administrator",
          senderEmail: "admin@vanguardbd.com",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSupportSuccess(true);
        setTimeout(() => {
          setSupportSuccess(false);
          setSupportModalOpen(false);
          setSupportSubject("");
          setSupportMessage("");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSupportSending(false);
    }
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-neutral-100 flex font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0f172a] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-slate-800/80 px-5 flex items-center justify-between shrink-0 bg-slate-900/60 backdrop-blur-md">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-black text-base shadow-lg shadow-amber-500/20">
              V
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wider text-white">
                {settings?.brand?.name || "VANGUARD"} <span className="text-amber-400 font-semibold text-xs">ERP</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">ENTERPRISE CMS & MANAGEMENT</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Nav Item Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400/90 tracking-wider uppercase mb-1.5">
                {grp.group}
              </div>
              {grp.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/25"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive ? "text-black" : "text-slate-400"} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-black/20 text-black"
                            : item.badge === "Live" || item.badge === "AI"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Permanent Support & Status Section */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 shrink-0 space-y-2">
          {/* User Profile Card in Sidebar */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
                {currentUser?.name?.slice(0, 2).toUpperCase() || "AD"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name || "Super Admin"}</p>
                <p className="text-[10px] text-amber-400 font-mono leading-none truncate">{currentUser?.roleName || "Super Admin"}</p>
              </div>
            </div>
          </div>

          {/* Explicit Logout Button in Sidebar */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 font-bold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          {/* Permanent Support Button */}
          <button
            onClick={() => setSupportModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs py-2.5 px-3 rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            <LifeBuoy size={15} className="animate-spin-slow" />
            <span>Support (shamimjkrworld@gmail.com)</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={13} className="text-amber-400" />
              <span>View Live Store</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-300">Admin</span>
              <ChevronRight size={13} />
              <span className="text-white capitalize font-medium">
                {pathname.replace("/admin", "").replace("/", "") || "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Support Trigger in topbar */}
            <button
              onClick={() => setSupportModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg font-semibold transition"
            >
              <LifeBuoy size={14} />
              <span>Help & Support</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono">Live</span>
            </div>

            {/* Admin Profile Pill & Logout in Topbar */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px] shrink-0">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || "AD"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white font-bold text-xs leading-none">{currentUser?.name || "Super Admin"}</p>
                  <p className="text-[10px] text-amber-400 font-mono leading-none mt-0.5">{currentUser?.roleName || "Super Admin"}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Logout from Admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 bg-[#0b0f19]">{children}</main>
      </div>

      {/* Permanent Support Ticket Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="text-indigo-400" size={20} />
                <div>
                  <h3 className="font-bold text-white text-base">Direct Enterprise Support</h3>
                  <p className="text-slate-400 text-xs">Recipient: <span className="text-indigo-400 font-mono">shamimjkrworld@gmail.com</span></p>
                </div>
              </div>
              <button
                onClick={() => setSupportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {supportSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-lg text-white">Support Request Sent!</h4>
                <p className="text-slate-300 text-sm">
                  Your ticket has been recorded and transmitted to <strong>shamimjkrworld@gmail.com</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendSupport} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Courier booking inquiry or payment issue"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message & Details</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the issue, include order numbers, or paste error details..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                  ⚡ All support tickets are logged with audit metadata and dispatched securely via server-side mailer.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSupportModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={supportSending}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{supportSending ? "Sending..." : "Submit Ticket"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
