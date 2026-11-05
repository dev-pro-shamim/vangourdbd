"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SiteSettings,
  Section,
  ProductItem,
  CategoryItem,
  Menu,
  PageItem,
} from "@/types/cms";
import {
  DEFAULT_SETTINGS,
  DEFAULT_SECTIONS,
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_MENUS,
  DEFAULT_PAGES,
  DEFAULT_ORDERS,
} from "@/data/cmsDefaults";
import { Order } from "@/types/cms";

interface CMSContextType {
  settings: SiteSettings;
  sections: Section[];
  products: ProductItem[];
  categories: CategoryItem[];
  menus: Menu[];
  pages: PageItem[];
  orders: Order[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  reorderSections: (sectionIds: string[]) => Promise<boolean>;
  toggleSectionStatus: (id: string, isEnabled: boolean) => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [menus, setMenus] = useState<Menu[]>(DEFAULT_MENUS);
  const [pages, setPages] = useState<PageItem[]>(DEFAULT_PAGES);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [isLoading, setIsLoading] = useState(true);

  const applyCSSVariables = (s: SiteSettings) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", s.colors.primary);
    root.style.setProperty("--secondary-color", s.colors.secondary);
    root.style.setProperty("--off-white-color", s.colors.background);
    root.style.setProperty("--title-color", s.colors.title);
    root.style.setProperty("--paragraph-color", s.colors.paragraph);
    root.style.setProperty("--border-color", s.colors.border);
    root.style.setProperty("--border-radius", s.layout.borderRadius);
  };

  const refreshData = async () => {
    try {
      const [resSettings, resSections, resProducts, resCategories, resMenus, resPages] =
        await Promise.all([
          fetch("/api/settings", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/sections", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/products", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/categories", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/menus", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/pages", { cache: "no-store" }).then((r) => r.json()),
        ]);

      if (resSettings?.success && resSettings.data) {
        setSettings(resSettings.data);
        applyCSSVariables(resSettings.data);
      }
      if (resSections?.success && resSections.data) {
        setSections(resSections.data);
      }
      if (resProducts?.success && resProducts.data) {
        setProducts(resProducts.data);
      }
      if (resCategories?.success && resCategories.data) {
        setCategories(resCategories.data);
      }
      if (resMenus?.success && resMenus.data) {
        setMenus(resMenus.data);
      }
      if (resPages?.success && resPages.data) {
        setPages(resPages.data);
      }
    } catch (err) {
      console.warn("CMS: Falling back to built-in cache:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        applyCSSVariables(data.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const reorderSections = async (sectionIds: string[]): Promise<boolean> => {
    try {
      const res = await fetch("/api/sections/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionIds }),
      });
      const data = await res.json();
      if (data.success) {
        setSections(data.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const toggleSectionStatus = async (id: string, isEnabled: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`/api/sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled }),
      });
      const data = await res.json();
      if (data.success) {
        setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isEnabled } : s)));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CMSContext.Provider
      value={{
        settings,
        sections,
        products,
        categories,
        menus,
        pages,
        orders,
        isLoading,
        refreshData,
        updateSettings,
        reorderSections,
        toggleSectionStatus,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}
