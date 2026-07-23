import { NextResponse } from "next/server"
import { verifyToken, SESSION_COOKIE } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const cookies = cookieHeader.split(';').reduce((acc: any, c) => {
      const [key, ...rest] = c.trim().split('=')
      acc[key] = rest.join('=')
      return acc
    }, {})
    
    const token = cookies[SESSION_COOKIE]
    const adminId = verifyToken(token)
    
    if (!adminId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ 
      authenticated: true,
      adminId 
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}