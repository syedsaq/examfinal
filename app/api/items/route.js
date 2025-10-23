import connectDB from "@/lib/db";
import requireAuth from "@/lib/requireAuth";
import Item from "@/models/Item";
import { NextResponse } from "next/server";  
export async function GET(req) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(req);
    if (error) return NextResponse.json({ success: false, message: error }, { status: 401 });

    const items = await Item.find({ user: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// ✅ POST create new item
export async function POST(req) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(req);
    if (error) return NextResponse.json({ success: false, message: error }, { status: 401 });

    const body = await req.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    const newItem = await Item.create({
      user: user._id, // ✅ fixed key name
      title,
      description,
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}