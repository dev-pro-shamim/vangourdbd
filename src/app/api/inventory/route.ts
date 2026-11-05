import { NextResponse } from "next/server";
import { getInventoryOverview, getStockTransactions } from "@/lib/cmsDataStore";

export async function GET() {
  try {
    const overview = getInventoryOverview();
    const transactions = getStockTransactions();
    return NextResponse.json({ success: true, data: { overview, transactions } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
