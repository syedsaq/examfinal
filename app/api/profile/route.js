import connectDB from "@/lib/db";
import requireAuth from "@/lib/requireAuth";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();
  const auth = await requireAuth(req);
  if (auth.error) return Response.json({ message: auth.error }, { status: auth.status });
  return Response.json({ user: auth.user });
}

export async function PUT(req) {
  await connectDB();
  const auth = await requireAuth(req);
  if (auth.error) return Response.json({ message: auth.error }, { status: auth.status });

  const { name, email } = await req.json();
  const updated = await User.findByIdAndUpdate(auth.user._id, { name, email }, { new: true });
  return Response.json({ user: updated, message: "Profile updated" });
}
