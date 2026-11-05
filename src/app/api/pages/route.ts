import { NextResponse } from "next/server";
import { getPages, createPage } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const pages = getPages();
    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page = createPage(body);
    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
