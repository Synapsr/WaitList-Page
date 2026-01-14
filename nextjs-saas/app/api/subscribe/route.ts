import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { waitlistId, email, name, company, customData } = await request.json()

    if (!waitlistId || !email) {
      return NextResponse.json(
        { error: "ID de waitlist et email requis" },
        { status: 400 }
      )
    }

    // Vérifier que la waitlist existe
    const waitlist = await prisma.waitlist.findUnique({
      where: { id: waitlistId }
    })

    if (!waitlist) {
      return NextResponse.json(
        { error: "Waitlist non trouvée" },
        { status: 404 }
      )
    }

    // Vérifier si l'email est déjà inscrit
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: {
        waitlistId_email: {
          waitlistId,
          email
        }
      }
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Cet email est déjà inscrit à cette waitlist" },
        { status: 400 }
      )
    }

    // Compter le nombre d'inscrits pour déterminer la position
    const subscriberCount = await prisma.subscriber.count({
      where: { waitlistId }
    })

    const subscriber = await prisma.subscriber.create({
      data: {
        waitlistId,
        email,
        name: name || null,
        company: company || null,
        customData: customData ? JSON.stringify(customData) : null,
        position: subscriberCount + 1
      }
    })

    return NextResponse.json(
      {
        message: "Inscription réussie",
        position: subscriber.position
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
