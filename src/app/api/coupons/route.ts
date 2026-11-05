import { NextResponse } from "next/server";
import { getCoupons, createCoupon } from "@/lib/cmsDataStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const coupons = getCoupons(status, search);
    return NextResponse.json({ success: true, data: coupons, total: coupons.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }
    const newCoupon = createCoupon(body);
    return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
