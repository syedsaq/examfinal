import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import requireAdmin from "@/lib/requireAdmin";

export async function GET(req) {
  try {
    await connectDB();
    await requireAdmin(req);

    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 403 });
  }
}
