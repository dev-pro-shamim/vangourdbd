import { NextResponse } from "next/server";
import { getStaffUsers, createStaffUser } from "@/lib/cmsDataStore";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const users = getStaffUsers().map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, roleId, roleName } = body;

    if (!name || !email || !password || !roleId) {
      return NextResponse.json({ success: false, error: "Missing required user fields" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = createStaffUser({
      name,
      email,
      passwordHash,
      roleId,
      roleName: roleName || "Staff",
      isActive: true,
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, data: safeUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
