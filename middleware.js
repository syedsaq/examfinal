import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/admin") && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
