import { NextResponse } from "next/server";
import { getMenus, getMenuByLocation, updateMenu } from "@/lib/cmsDataStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    if (location) {
      const menu = getMenuByLocation(location);
      return NextResponse.json({ success: true, data: menu });
    }
    const menus = getMenus();
    return NextResponse.json({ success: true, data: menus });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, items } = await request.json();
    if (!id || !items) {
      return NextResponse.json({ success: false, error: "id and items are required" }, { status: 400 });
    }
    const updated = updateMenu(id, items);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
