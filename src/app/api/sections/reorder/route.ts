import { NextResponse } from "next/server";
import { reorderSections } from "@/lib/cmsDataStore";

export async function POST(request: Request) {
  try {
    const { sectionIds } = await request.json();
    if (!Array.isArray(sectionIds)) {
      return NextResponse.json({ success: false, error: "sectionIds must be an array" }, { status: 400 });
    }
    const updated = reorderSections(sectionIds);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
