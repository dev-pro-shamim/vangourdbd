import { NextResponse } from "next/server";
import { getInvoiceByOrderNumber } from "@/lib/cmsDataStore";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const invoice = getInvoiceByOrderNumber(id);
    if (!invoice) return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
