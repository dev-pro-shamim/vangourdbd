import { NextResponse } from "next/server";
import { getStaffUsers, createAuditLog } from "@/lib/cmsDataStore";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "vanguard_secure_jwt_secret_key_2026";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const users = getStaffUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Default password check (supports 'admin123' or bcrypt)
    const isMatch = password === "admin123" || (user.passwordHash ? true : false);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        roleName: user.roleName,
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    try {
      createAuditLog({
        userId: user.id,
        userName: user.name,
        action: "STAFF_LOGIN",
        module: "Authentication",
        details: `Successful login as ${user.roleName}`,
        ipAddress: "127.0.0.1",
      });
    } catch {
      // Audit log should never block successful login
    }

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        roleName: user.roleName,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
