"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Users as UsersIcon } from "lucide-react"
import { toast } from "sonner"

interface Subscriber {
  id: string
  email: string
  name: string | null
  company: string | null
  position: number
  createdAt: string
}

export default function SubscribersPage() {
  const params = useParams()
  const id = params.id as string

  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [waitlistTitle, setWaitlistTitle] = useState("")

  useEffect(() => {
    fetchSubscribers()
    fetchWaitlistTitle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchWaitlistTitle = async () => {
    try {
      const response = await fetch(`/api/waitlists/${id}`)
      if (response.ok) {
        const data = await response.json()
        setWaitlistTitle(data.title)
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const fetchSubscribers = async () => {
    try {
      const response = await fetch(`/api/waitlists/${id}/subscribers`)
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    try {
      const headers = ["Position", "Email", "Nom", "Entreprise", "Date d'inscription"]
      const rows = subscribers.map((s) => [
        s.position,
        s.email,
        s.name || "",
        s.company || "",
        new Date(s.createdAt).toLocaleDateString("fr-FR"),
      ])

      const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `subscribers-${id}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success("Export réussi", {
        description: `Le fichier CSV avec ${subscribers.length} abonné${subscribers.length > 1 ? "s" : ""} a été téléchargé.`,
      })
    } catch (error) {
      toast.error("Erreur lors de l'export", {
        description: "Une erreur est survenue lors de l'export du fichier CSV.",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header séparé */}
      <div className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Abonnés</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {waitlistTitle && `${waitlistTitle} • `}
              {subscribers.length} {subscribers.length <= 1 ? "inscrit" : "inscrits"}
            </p>
          </div>
          {subscribers.length > 0 && (
            <Button variant="outline" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {subscribers.length === 0 ? (
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <UsersIcon className="h-16 w-16 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Aucun abonné pour le moment</CardTitle>
              <CardDescription>
                Les personnes qui s&apos;inscrivent à votre waitlist apparaîtront ici.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/dashboard/waitlists/${id}`}>
                  Modifier la waitlist
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Liste des abonnés</CardTitle>
              <CardDescription>
                {subscribers.length} {subscribers.length <= 1 ? "personne inscrite" : "personnes inscrites"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Date d&apos;inscription</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>
                          <Badge variant="secondary">
                            #{subscriber.position}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{subscriber.email}</TableCell>
                        <TableCell>{subscriber.name || <span className="text-muted-foreground">—</span>}</TableCell>
                        <TableCell>{subscriber.company || <span className="text-muted-foreground">—</span>}</TableCell>
                        <TableCell>
                          {new Date(subscriber.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
