import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export function isOwnerApiRoute(pathname: string): boolean {
  return (
    /^\/api\/projects(\/|$)/.test(pathname) ||
    /^\/api\/knowledge(\/|$)/.test(pathname) ||
    /^\/api\/conversations(\/|$)/.test(pathname)
  );
}

export function isDashboardRoute(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated } = await auth();
  const { pathname } = req.nextUrl;

  if (!isAuthenticated && isOwnerApiRoute(pathname)) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Authentication required" } },
      { status: 401 }
    );
  }

  if (!isAuthenticated && isDashboardRoute(pathname)) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
