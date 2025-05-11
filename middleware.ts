import { NextResponse, NextRequest } from "next/server";
import { auth } from "./app/api/auth/[...nextauth]/route";


export async function middleware(req: NextRequest) {
  // Get session using the new auth() method (Edge compatible)
  const session = await auth();

  const { pathname } = req.nextUrl;

  // If logged in and trying to visit login or register, redirect to documents
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/documents", req.url));
  }

  // If NOT logged in and trying to access protected routes, redirect to login
  const protectedRoutes = [
    "/documents",
    "/videos",
    "/admin",
    "/videos/watch",
    "/documents/uploader",
  ];

  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except public ones
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
