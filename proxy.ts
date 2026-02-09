import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/auth"

export async function proxy(request: NextRequest) {
  const session = await auth();

  if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|slug|auth|terms|privacy|pricing|favicon.ico).*)',
  ],
}