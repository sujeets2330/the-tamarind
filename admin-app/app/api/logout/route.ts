import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth"

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear the session cookie
  response.cookies.set(SESSION_COOKIE, '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  
  return response
}