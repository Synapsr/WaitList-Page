import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Récupérer une waitlist publique par son slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const waitlist = await prisma.waitlist.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        headline: true,
        subheadline: true,
        theme: true,
        primaryColor: true,
        backgroundColor: true,
        logoUrl: true,
        collectName: true,
        collectCompany: true,
        countdownEnabled: true,
        countdownDate: true,
        _count: {
          select: { subscribers: true }
        }
      }
    })

    if (!waitlist) {
      return NextResponse.json(
        { error: "Waitlist non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json(waitlist)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
