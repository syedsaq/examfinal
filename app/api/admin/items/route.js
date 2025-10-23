import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import requireAdmin from "@/lib/requireAdmin";
import Item from "@/models/Item";

export async function GET(req) {
  try {
    await connectDB();
    await requireAdmin(req);

    const items = await Item.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
