import { NextResponse } from "next/server";
import { getCouponById, createCoupon } from "@/lib/cmsDataStore";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const existing = getCouponById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    const duplicated = createCoupon({
      ...existing,
      code: `${existing.code}-COPY`,
      description: `Copy of ${existing.description}`,
      usedCount: 0,
      usages: [],
    });

    return NextResponse.json({ success: true, data: duplicated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
