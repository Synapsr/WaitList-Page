import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Récupérer tous les abonnés d'une waitlist
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
    
    // Vérifier que la waitlist appartient à l'utilisateur
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

    const subscribers = await prisma.subscriber.findMany({
      where: { waitlistId: id },
      orderBy: { createdAt: "asc" }
    })

    return NextResponse.json(subscribers)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
