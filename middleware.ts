import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function middleware(req: NextRequest) { 
  const session = await auth(); // Get session

  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/documents", req.url));
  }
  
  if(!session && (
    req.nextUrl.pathname === "/documents" ||
    req.nextUrl.pathname === "/videos" ||
    req.nextUrl.pathname === "/admin" || 
    req.nextUrl.pathname === "/videos/watch" || 
    req.nextUrl.pathname === "/documents/uploader"
  )){
  return NextResponse.redirect(new URL("/login", req.url));
  
  }

  return NextResponse.next(); // Allow request to proceed
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Protect only dashboard and signIn pages
};
