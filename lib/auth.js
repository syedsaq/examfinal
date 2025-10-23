// lib/auth.js
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "change_this_secret");

// signJwt(payload, expiresInSeconds)
export async function signJwt(payload = {}, expiresIn = 60 * 60) {
  const alg = "HS256";
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(SECRET);

  return jwt;
}

// verifyJwt(token) -> returns payload or null
export async function verifyJwt(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}
