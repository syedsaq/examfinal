import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import requireAuth from "@/lib/requireAuth";
import Comment from "@/models/Comment";

export async function POST(req) {
  try {
    await connectDB();
    const { user } = await requireAuth(req);
    const { itemId, content } = await req.json();

    if (!itemId || !content) {
      console.error("❌ Missing fields:", { itemId, content });
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const comment = await Comment.create({
      user: user._id,
      item: itemId,
      content,
    });

    console.log("✅ Comment created:", comment);
    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error("💥 Error in POST /api/comments:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    const comments = await Comment.find({ item: itemId })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}