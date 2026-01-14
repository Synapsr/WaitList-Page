import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Vérifier si un slug est disponible
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    const excludeId = searchParams.get("excludeId") // Pour exclure la waitlist en cours d'édition

    if (!slug) {
      return NextResponse.json(
        { error: "Slug requis" },
        { status: 400 }
      )
    }

    // Valider le format du slug
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json({
        available: false,
        reason: "format",
        message: "L'URL ne peut contenir que des lettres minuscules, des chiffres et des tirets"
      })
    }

    // Vérifier la longueur
    if (slug.length < 3) {
      return NextResponse.json({
        available: false,
        reason: "length",
        message: "L'URL doit contenir au moins 3 caractères"
      })
    }

    if (slug.length > 50) {
      return NextResponse.json({
        available: false,
        reason: "length",
        message: "L'URL ne peut pas dépasser 50 caractères"
      })
    }

    // Vérifier si le slug existe déjà
    const existingWaitlist = await prisma.waitlist.findUnique({
      where: { slug },
      select: { id: true }
    })

    // Si le slug existe mais c'est la même waitlist (en édition), c'est OK
    if (existingWaitlist && excludeId && existingWaitlist.id === excludeId) {
      return NextResponse.json({
        available: true,
        message: "URL disponible"
      })
    }

    if (existingWaitlist) {
      return NextResponse.json({
        available: false,
        reason: "taken",
        message: "Cette URL est déjà utilisée"
      })
    }

    return NextResponse.json({
      available: true,
      message: "URL disponible"
    })
  } catch (error) {
    console.error("Erreur vérification slug:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
