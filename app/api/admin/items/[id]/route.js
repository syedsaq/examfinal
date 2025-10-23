import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import requireAdmin from "@/lib/requireAdmin";
import Item from "@/models/Item";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await requireAdmin(req);

    await Item.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
