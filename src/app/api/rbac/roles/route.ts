import { NextResponse } from "next/server";
import { getRoles, createRole } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const roles = getRoles();
    return NextResponse.json({ success: true, data: roles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRole = createRole(body);
    return NextResponse.json({ success: true, data: newRole }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
