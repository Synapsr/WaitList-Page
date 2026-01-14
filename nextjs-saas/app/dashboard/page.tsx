"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Users } from "lucide-react"
import { toast } from "sonner"

interface Waitlist {
  id: string
  slug: string
  title: string
  description: string | null
  headline: string
  _count: {
    subscribers: number
  }
  createdAt: string
}

export default function DashboardPage() {
  const [waitlists, setWaitlists] = useState<Waitlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWaitlists()
  }, [])

  const fetchWaitlists = async () => {
    try {
      const response = await fetch("/api/waitlists")
      if (response.ok) {
        const data = await response.json()
        setWaitlists(data)
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const waitlist = waitlists.find(w => w.id === id)
    const waitlistTitle = waitlist?.title || "cette waitlist"
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${waitlistTitle}" ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/waitlists/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Waitlist supprimée", {
          description: `"${waitlistTitle}" a été supprimée avec succès.`,
        })
        fetchWaitlists()
      } else {
        const data = await response.json()
        toast.error("Erreur lors de la suppression", {
          description: data.error || "Une erreur est survenue.",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la suppression", {
        description: "Une erreur est survenue lors de la suppression de la waitlist.",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Chargement de vos waitlists...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header séparé */}
      <div className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mes Waitlists</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gérez toutes vos waitlists produit en un seul endroit
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/waitlists/new">
              <span className="mr-2">+</span>
              Créer une waitlist
            </Link>
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {waitlists.length === 0 ? (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-xl">Aucune waitlist pour le moment</CardTitle>
              <CardDescription>
                Créez votre première page d&apos;attente pour commencer à collecter des inscriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg">
                <Link href="/dashboard/waitlists/new">
                  <span className="mr-2">+</span>
                  Créer votre première waitlist
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {waitlists.map((waitlist) => (
              <Card key={waitlist.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{waitlist.title}</CardTitle>
                  {waitlist.description && (
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                      {waitlist.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {waitlist._count.subscribers} {waitlist._count.subscribers <= 1 ? "inscrit" : "inscrits"}
                    </Badge>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">URL publique</p>
                    <a
                      href={`/w/${waitlist.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline font-mono break-all block"
                    >
                      /w/{waitlist.slug}
                    </a>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild variant="default" className="flex-1">
                    <Link href={`/dashboard/waitlists/${waitlist.id}`}>
                      Modifier
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/dashboard/waitlists/${waitlist.id}/subscribers`}>
                      Abonnés
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(waitlist.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
