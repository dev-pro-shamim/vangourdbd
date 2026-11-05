import { NextResponse } from "next/server";
import { getBlockedIPs, blockIP, unblockIP, getSecurityLogs } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const blockedIps = getBlockedIPs();
    const logs = getSecurityLogs();
    return NextResponse.json({ success: true, data: { blockedIps, logs } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ip, reason } = body;

    if (action === "block" && ip) {
      const blocked = blockIP(ip, reason || "Blocked by administrator", true);
      return NextResponse.json({ success: true, data: blocked });
    }

    if (action === "unblock" && ip) {
      const unblocked = unblockIP(ip);
      return NextResponse.json({ success: true, unblocked });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
