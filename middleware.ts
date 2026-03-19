// middleware.ts - DISABLE TEMPORARILY
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true;
      }
    },
  }
);

export const config = {
  matcher: ['/user/:path*', '/admin/:path*']
};

// Empty middleware - kuch mat karo
export function middleware() {
  return;
}

