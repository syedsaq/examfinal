import { jwtVerify } from "jose";
import User from "@/models/User";
import connectDB from "./db";

export default async function requireAuth(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  console.log("Authorization Header:", authHeader); // 👈 check this in your server logs

  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    console.log("Decoded payload:", payload); // 👈 confirm payload.userId

const userId = payload.userId || payload.sub;
const user = await User.findById(userId).select("-password");
    if (!user) return { error: "User not found", status: 404 };

    return { user };
  } catch (err) {
    console.error("Auth error:", err);
    return { error: "Invalid or expired token", status: 401 };
  }
}

// // lib/requireAuth.js
// import { verifyJwt } from "./auth";

// export async function requireAuth(req) {
//   const auth = req.headers.get("authorization") || "";
//   const parts = auth.split(" ");
//   if (parts.length !== 2 || parts[0] !== "Bearer") {
//     const err = new Error("Unauthorized");
//     err.status = 401;
//     throw err;
//   }
//   const token = parts[1];
//   const payload = await verifyJwt(token);
//   if (!payload) {
//     const err = new Error("Invalid token");
//     err.status = 401;
//     throw err;
//   }
//   return payload; // { sub, role, ... }
// }
