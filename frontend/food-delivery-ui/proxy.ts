import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (!token) {
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard") {
      url.pathname = "/dashboard/menu";
      return NextResponse.redirect(url);
    }

    if (token.role !== "RESTAURANT") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (token.role !== "ADMIN") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
