import { NextResponse } from "next/server";
import { adjustStock } from "@/lib/cmsDataStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = adjustStock({
      productId: body.productId,
      variationId: body.variationId,
      type: body.type,
      quantityDelta: Number(body.quantityDelta),
      reason: body.reason,
      referenceId: body.referenceId,
      performedBy: body.performedBy || "Admin",
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
