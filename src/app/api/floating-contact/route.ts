import { NextResponse } from "next/server";
import { getFloatingContactSettings, updateFloatingContactSettings } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const settings = getFloatingContactSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = updateFloatingContactSettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
