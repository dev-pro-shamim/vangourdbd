import { NextResponse } from "next/server";
import { checkCustomerPhoneFraud } from "@/lib/cmsDataStore";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const phone = url.searchParams.get("phone");
    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number parameter is required" }, { status: 400 });
    }

    const report = checkCustomerPhoneFraud(phone);
    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = body.phone;
    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    const report = checkCustomerPhoneFraud(phone);
    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
