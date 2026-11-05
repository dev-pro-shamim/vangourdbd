import { NextResponse } from "next/server";
import { getCustomers, updateCustomerNotes } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const customers = getCustomers();
    return NextResponse.json({ success: true, data: customers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, notes } = await request.json();
    const updated = updateCustomerNotes(id, notes);
    if (!updated) return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
