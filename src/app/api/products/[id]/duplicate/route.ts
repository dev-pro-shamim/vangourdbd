import { NextResponse } from "next/server";
import { duplicateProduct } from "@/lib/cmsDataStore";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const duplicated = duplicateProduct(id);
    if (!duplicated) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: duplicated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
