import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/cmsDataStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal, customerPhone, customerEmail } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Please provide a coupon code." },
        { status: 400 }
      );
    }

    const orderSubtotal = Number(subtotal) || 0;
    const result = validateCoupon(code, orderSubtotal, customerPhone, customerEmail);

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          data: result,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        code: result.code,
        discountAmount: result.discountAmount,
        discountType: result.discountType,
        discountValue: result.discountValue,
        freeShipping: result.freeShipping,
        description: result.coupon?.description || "",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
