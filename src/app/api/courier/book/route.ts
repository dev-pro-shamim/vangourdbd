import { NextResponse } from "next/server";
import { bookCourierConsignment } from "@/lib/cmsDataStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, courierName } = body;

    if (!orderId || !courierName) {
      return NextResponse.json({ success: false, error: "orderId and courierName are required" }, { status: 400 });
    }

    const result = bookCourierConsignment(orderId, courierName);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.booking });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
