import { NextResponse } from "next/server";
import { getPaymentTransactions } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const transactions = getPaymentTransactions();
    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
