// import requireAuth from "./requireAuth";

// export default async function requireAdmin(req) {
//   const user = await requireAuth(req);
//   if (user.role !== "admin") {
//     throw new Error("Access denied — Admins only");
//   }
//   return user;
// }
import { jwtVerify } from "jose";
import User from "@/models/User";
import connectDB from "./db";

export default async function requireAdmin(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  const user = await User.findById(payload.sub).select("-password");
  if (!user || user.role !== "admin") {
    throw new Error("Access denied — Admins only");
  }

  return user;
}
