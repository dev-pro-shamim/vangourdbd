import { NextResponse } from "next/server";
import { getReviews, createReview, updateReviewStatus } from "@/lib/cmsDataStore";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId") || undefined;
    const reviews = getReviews(productId);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, productName, customerName, customerEmail, rating, reviewText } = body;

    if (!productId || !customerName || !rating || !reviewText) {
      return NextResponse.json({ success: false, error: "Missing required review fields" }, { status: 400 });
    }

    const newReview = createReview({
      productId,
      productName: productName || "Product",
      customerName,
      customerEmail,
      rating: Number(rating),
      reviewText,
      isVerifiedPurchase: true,
    });

    return NextResponse.json({
      success: true,
      data: newReview,
      message: "Thank you! Your review has been submitted for verification.",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status, adminReply } = await request.json();
    const updated = updateReviewStatus(id, status, adminReply);
    if (!updated) return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
