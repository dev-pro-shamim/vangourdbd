import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, addOrderInternalNote } from "@/lib/cmsDataStore";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = getOrderById(id);
    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.status) {
      const updated = updateOrderStatus(
        id,
        body.status,
        body.note || `Status changed to ${body.status}`,
        body.performedBy || "Admin"
      );
      if (!updated) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "No recognized update payload" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === "add_note" && body.text) {
      const updated = addOrderInternalNote(id, body.text, body.author || "Admin");
      if (!updated) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
