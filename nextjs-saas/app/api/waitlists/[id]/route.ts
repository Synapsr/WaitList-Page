import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Récupérer une waitlist spécifique
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = typeof session.user.id === 'string' ? session.user.id : String(session.user.id)
    
    const waitlist = await prisma.waitlist.findFirst({
      where: {
        id,
        userId
      },
      include: {
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

// PUT - Mettre à jour une waitlist
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const data = await request.json()

    const userId = typeof session.user.id === 'string' ? session.user.id : String(session.user.id)
    
    // Vérifier que la waitlist appartient à l'utilisateur
    const existingWaitlist = await prisma.waitlist.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!existingWaitlist) {
      return NextResponse.json(
        { error: "Waitlist non trouvée" },
        { status: 404 }
      )
    }

    // Si le slug change, vérifier qu'il n'existe pas déjà
    if (data.slug && data.slug !== existingWaitlist.slug) {
      const slugExists = await prisma.waitlist.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: "Ce slug est déjà utilisé" },
          { status: 400 }
        )
      }
    }

    // Préparer les données avec gestion spéciale pour countdownDate
    const updateData: any = {
      slug: data.slug,
      title: data.title,
      description: data.description || null,
      headline: data.headline,
      subheadline: data.subheadline || null,
      theme: data.theme || existingWaitlist.theme,
      primaryColor: data.primaryColor || existingWaitlist.primaryColor,
      backgroundColor: data.backgroundColor || existingWaitlist.backgroundColor,
      logoUrl: data.logoUrl || null,
      collectName: data.collectName ?? existingWaitlist.collectName,
      collectCompany: data.collectCompany ?? existingWaitlist.collectCompany,
      countdownEnabled: data.countdownEnabled ?? existingWaitlist.countdownEnabled,
      updatedAt: new Date()
    }
    
    // Gérer countdownDate si countdownEnabled est modifié
    if (data.countdownEnabled) {
      if (data.countdownDate) {
        // Si c'est une string datetime-local, la convertir en Date
        updateData.countdownDate = new Date(data.countdownDate)
      } else if (existingWaitlist.countdownDate) {
        // Garder la date existante si pas de nouvelle date fournie
        updateData.countdownDate = existingWaitlist.countdownDate
      } else {
        updateData.countdownDate = null
      }
    } else {
      updateData.countdownDate = null
    }

    const waitlist = await prisma.waitlist.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(waitlist)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une waitlist
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = typeof session.user.id === 'string' ? session.user.id : String(session.user.id)
    
    const waitlist = await prisma.waitlist.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!waitlist) {
      return NextResponse.json(
        { error: "Waitlist non trouvée" },
        { status: 404 }
      )
    }

    await prisma.waitlist.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Waitlist supprimée" })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
