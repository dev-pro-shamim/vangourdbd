import { NextResponse } from "next/server";
import { getInvoices, getInvoiceByOrderNumber } from "@/lib/cmsDataStore";

export async function GET(request: Request) {
  try {
    const invoices = getInvoices();
    return NextResponse.json({ success: true, data: invoices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
