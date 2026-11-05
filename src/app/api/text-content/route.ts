import { NextResponse } from "next/server";
import {
  getWebsiteTexts,
  saveWebsiteText,
  bulkUpdateWebsiteTexts,
} from "@/lib/cmsDataStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group") || undefined;
    const texts = getWebsiteTexts(group);
    return NextResponse.json({ success: true, data: texts, total: texts.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      const updated = bulkUpdateWebsiteTexts(body);
      return NextResponse.json({ success: true, count: updated.length, data: updated });
    } else {
      if (!body.key) {
        return NextResponse.json({ success: false, error: "Text key is required" }, { status: 400 });
      }
      const saved = saveWebsiteText(body);
      return NextResponse.json({ success: true, data: saved });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      const updated = bulkUpdateWebsiteTexts(body);
      return NextResponse.json({ success: true, count: updated.length, data: updated });
    } else {
      if (!body.key) {
        return NextResponse.json({ success: false, error: "Text key is required" }, { status: 400 });
      }
      const saved = saveWebsiteText(body);
      return NextResponse.json({ success: true, data: saved });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
