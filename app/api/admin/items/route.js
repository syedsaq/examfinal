import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Item from "@/models/Item";
import requireAuth from "@/lib/requireAuth";

export async function GET(req) {
  await connectDB();
  const { user, error, status } = await requireAuth(req);

  if (error) return NextResponse.json({ message: error }, { status });
  if (user.role !== "admin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const items = await Item.find().populate("user", "fullName email");
  return NextResponse.json({ success: true, data: items });
}
