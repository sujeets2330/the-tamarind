import { NextResponse } from "next/server"
import { 
  createToken, 
  SESSION_COOKIE, 
  SESSION_MAX_AGE,
  checkLoginAttempts,
  recordFailedAttempt,
  clearLoginAttempts,
  verifyAdminCredentials
} from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      )
    }

    // Rate limiting
    const rateCheck = checkLoginAttempts(email)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { message: rateCheck.message },
        { status: 429 }
      )
    }

    // Verify credentials
    const result = await verifyAdminCredentials(email, password)

    if (!result.success) {
      // Record failed attempt
      const failRecord = recordFailedAttempt(email)
      if (failRecord.locked) {
        return NextResponse.json(
          { message: failRecord.message },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { message: result.message },
        { status: 401 }
      )
    }

    // Clear failed attempts on successful login
    clearLoginAttempts(email)

    const token = createToken(result.admin.id)
    const response = NextResponse.json({ 
      success: true, 
      admin: result.admin 
    })
    
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}