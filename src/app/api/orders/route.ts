import { NextResponse } from "next/server";
import { getOrders, createOrder, updateOrderStatus, recordCouponUsage } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = createOrder(body);

    // Record coupon usage if coupon was applied
    if (body.couponCode) {
      try {
        recordCouponUsage(body.couponCode, {
          orderId: order.id || order.orderNumber,
          customerPhone: body.customer?.phone || body.phone,
          customerEmail: body.customer?.email,
          discountAmount: body.couponDiscount || body.discount || 0,
        });
      } catch (couponErr) {
        console.warn("Failed to record coupon usage:", couponErr);
      }
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // 1. Bulk Status Update
    if (Array.isArray(body.orderIds) && body.status) {
      const results = [];
      for (const id of body.orderIds) {
        try {
          const updated = updateOrderStatus(
            id,
            body.status,
            body.note || `Bulk status update to ${body.status}`,
            body.performedBy || "Admin Staff"
          );
          if (updated) results.push(updated);
        } catch (err) {
          console.warn("Failed to bulk update order", id, err);
        }
      }
      return NextResponse.json({
        success: true,
        count: results.length,
        data: results,
        message: `Successfully updated ${results.length} orders to ${body.status}`,
      });
    }

    // 2. Single Order Update
    const { id, status, note, performedBy } = body;
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }
    const updated = updateOrderStatus(id, status, note, performedBy || "Admin Staff");
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
