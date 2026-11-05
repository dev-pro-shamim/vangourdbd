import { NextResponse } from "next/server";
import { getSuppliers, createSupplier } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const suppliers = getSuppliers();
    return NextResponse.json({ success: true, data: suppliers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSupplier = createSupplier(body);
    return NextResponse.json({ success: true, data: newSupplier }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
