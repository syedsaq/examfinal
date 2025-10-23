import { NextResponse } from "next/server";
import requireAuth from "@/lib/requireAuth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const { user } = await requireAuth(req);
    const dbUser = await User.findById(user._id).select("-password");
    return NextResponse.json({ success: true, data: dbUser });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
