import connectDB from "@/lib/db";
import Item from "@/models/Item";
import Comment from "@/models/Comment";
import requireAuth from "@/lib/requireAuth";

export async function GET(req, { params }) {
  await connectDB();
  const auth = await requireAuth(req);
  if (auth.error) return Response.json({ message: auth.error }, { status: auth.status });

  const item = await Item.findById(params.id).populate("user", "name email");
  if (!item) return Response.json({ message: "Item not found" }, { status: 404 });

  const comments = await Comment.find({ item: params.id }).sort({ createdAt: -1 });
  return Response.json({ item, comments });
}
