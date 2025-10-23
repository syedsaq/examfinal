import connectDB from "@/lib/db";
import Comment from "@/models/Comment";

export async function POST(req) {
  await connectDB();
  const { itemId, author, text } = await req.json();

  if (!itemId || !author || !text)
    return Response.json({ message: "Missing fields" }, { status: 400 });

  const comment = await Comment.create({ item: itemId, author, text });
  return Response.json({ comment, message: "Comment added" });
}
