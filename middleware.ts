import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware to check for authentication
export async function middleware(req: NextRequest) {
  // Get the token (or session) from the cookie using NextAuth's helper function
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is logged in and trying to visit login or register pages, redirect them to the dashboard
  if (token && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/documents", req.url));
  }

  // If the user is not logged in and trying to visit protected routes, redirect them to login
  if (!token && (
    req.nextUrl.pathname === "/documents" ||
    req.nextUrl.pathname === "/videos" ||
    req.nextUrl.pathname === "/admin" || 
    req.nextUrl.pathname === "/videos/watch" || 
    req.nextUrl.pathname === "/documents/uploader"
  )) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow request to proceed if no condition is met
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Protect only dashboard and signIn pages
};
