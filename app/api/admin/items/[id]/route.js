import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Item from "@/models/Item";
import requireAuth from "@/lib/requireAuth";

export async function DELETE(req, { params }) {
  await connectDB();
  const { user, error, status } = await requireAuth(req);

  if (error) return NextResponse.json({ message: error }, { status });
  if (user.role !== "admin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  await Item.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true, message: "Item deleted" });
}
