import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Récupérer toutes les waitlists de l'utilisateur
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = typeof session.user.id === 'string' ? session.user.id : String(session.user.id)
    
    const waitlists = await prisma.waitlist.findMany({
      where: { userId },
      include: {
        _count: {
          select: { subscribers: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(waitlists)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle waitlist
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      slug,
      title,
      description,
      headline,
      subheadline,
      theme,
      primaryColor,
      backgroundColor,
      logoUrl,
      collectName,
      collectCompany,
      countdownEnabled,
      countdownDate,
    } = data

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug et titre requis" },
        { status: 400 }
      )
    }
    
    // Utiliser le titre comme headline si non fourni
    const finalHeadline = headline || title

    // Vérifier si le slug existe déjà
    const existingWaitlist = await prisma.waitlist.findUnique({
      where: { slug }
    })

    if (existingWaitlist) {
      return NextResponse.json(
        { error: "Ce slug est déjà utilisé" },
        { status: 400 }
      )
    }

    const userId = typeof session.user.id === 'string' ? session.user.id : String(session.user.id)

    const waitlist = await prisma.waitlist.create({
      data: {
        userId,
        slug,
        title,
        description: description || null,
        headline: finalHeadline,
        subheadline: subheadline || null,
        theme: theme || "dark-modern",
        primaryColor: primaryColor || "#000000",
        backgroundColor: backgroundColor || "#ffffff",
        logoUrl: logoUrl || null,
        collectName: collectName ?? true,
        collectCompany: collectCompany ?? false,
        countdownEnabled: countdownEnabled ?? false,
        countdownDate: countdownEnabled && countdownDate && countdownDate.trim() !== "" ? new Date(countdownDate) : null,
      }
    })

    return NextResponse.json(waitlist, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la waitlist:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    )
  }
}
