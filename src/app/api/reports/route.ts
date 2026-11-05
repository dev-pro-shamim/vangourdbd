import { NextResponse } from "next/server";
import { getOrders, getProducts, getCourierBookings, getCustomers } from "@/lib/cmsDataStore";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "sales";
    const format = url.searchParams.get("format"); // "csv" or "json"

    const orders = getOrders();
    const products = getProducts();
    const courierBookings = getCourierBookings();
    const customers = getCustomers();

    if (type === "sales") {
      const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
      const grossRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);
      const shippingRevenue = orders.reduce((sum, o) => sum + o.shippingFee, 0);
      const discounts = orders.reduce((sum, o) => sum + (o.discount || 0), 0);
      const codOrders = orders.filter((o) => o.paymentMethod === "Cash on Delivery");
      const onlineOrders = orders.filter((o) => o.paymentMethod !== "Cash on Delivery");

      if (format === "csv") {
        const csvHeader = "OrderNumber,Customer,Phone,City,Total,PaymentMethod,Status,Date\n";
        const csvRows = orders
          .map(
            (o) =>
              `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.city}",${o.total},"${o.paymentMethod}","${o.status}","${o.createdAt}"`
          )
          .join("\n");

        return new NextResponse(csvHeader + csvRows, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="sales_report.csv"',
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          totalSales,
          grossRevenue,
          shippingRevenue,
          discounts,
          codRevenue: codOrders.reduce((sum, o) => sum + o.total, 0),
          onlineRevenue: onlineOrders.reduce((sum, o) => sum + o.total, 0),
          totalOrdersCount: orders.length,
          deliveredCount: orders.filter((o) => o.status === "Delivered").length,
          cancelledCount: orders.filter((o) => o.status === "Cancelled").length,
        },
      });
    }

    if (type === "inventory") {
      if (format === "csv") {
        const csvHeader = "SKU,Product Name,Category,Price,CostPrice,StockQuantity,Status\n";
        const csvRows = products
          .map(
            (p) =>
              `"${p.sku}","${p.name.replace(/"/g, '""')}","${p.category}",${p.price},${p.costPrice || 0},${p.stockQuantity},"${p.stockQuantity <= 0 ? "Out of Stock" : "In Stock"}"`
          )
          .join("\n");

        return new NextResponse(csvHeader + csvRows, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="inventory_report.csv"',
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          totalProducts: products.length,
          totalUnits: products.reduce((acc, p) => acc + p.stockQuantity, 0),
          lowStock: products.filter((p) => p.stockQuantity <= 5 && p.stockQuantity > 0).length,
          outOfStock: products.filter((p) => p.stockQuantity <= 0).length,
        },
      });
    }

    if (type === "courier") {
      return NextResponse.json({
        success: true,
        data: {
          totalBookings: courierBookings.length,
          steadfastBookings: courierBookings.filter((b) => b.courierName === "Steadfast").length,
          pathaoBookings: courierBookings.filter((b) => b.courierName === "Pathao").length,
          redxBookings: courierBookings.filter((b) => b.courierName === "RedX").length,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Report generated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
