import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const session = await auth()
    
    // Format attendu par next-auth/react SessionProvider
    if (!session) {
      return NextResponse.json(null)
    }

    // Handle expires - it might be a Date object or a string
    let expires: string | null = null
    if (session.expires) {
      if (session.expires instanceof Date) {
        expires = session.expires.toISOString()
      } else if (typeof session.expires === 'string') {
        expires = session.expires
      }
    }

    return NextResponse.json({
      user: session.user,
      expires,
    })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json(null)
  }
}
