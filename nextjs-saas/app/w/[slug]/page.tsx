"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { getTheme, type ThemeId } from "@/lib/themes"
import { Logo } from "@/components/Logo"

interface Waitlist {
  id: string
  slug: string
  title: string
  description: string | null
  headline: string
  subheadline: string | null
  theme: ThemeId
  primaryColor: string
  backgroundColor: string
  logoUrl: string | null
  collectName: boolean
  collectCompany: boolean
  countdownEnabled: boolean
  countdownDate: string | null
  _count: {
    subscribers: number
  }
}

export default function WaitlistPage() {
  const params = useParams()
  const slug = params.slug as string

  const [waitlist, setWaitlist] = useState<Waitlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
  })

  useEffect(() => {
    fetchWaitlist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    if (!waitlist?.countdownEnabled || !waitlist.countdownDate) {
      return
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(waitlist.countdownDate!).getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeRemaining({ days, hours, minutes, seconds })
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [waitlist?.countdownEnabled, waitlist?.countdownDate])

  const fetchWaitlist = async () => {
    try {
      const response = await fetch(`/api/public/waitlists/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setWaitlist(data)
      } else {
        setError("Waitlist non trouvée")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!waitlist) return

    setError("")
    setSubmitting(true)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waitlistId: waitlist.id,
          email: formData.email,
          name: waitlist.collectName ? formData.name : undefined,
          company: waitlist.collectCompany ? formData.company : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue")
        toast.error("Erreur lors de l'inscription", {
          description: data.error || "Une erreur est survenue lors de votre inscription.",
        })
        return
      }

      setSuccess(true)
      setFormData({ email: "", name: "", company: "" })
      toast.success("Inscription réussie !", {
        description: `Vous êtes #${data.position} sur la liste d'attente. Merci !`,
      })
      fetchWaitlist()
    } catch {
      setError("Une erreur est survenue")
      toast.error("Erreur lors de l'inscription", {
        description: "Une erreur est survenue lors de votre inscription.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">Chargement...</div>
      </div>
    )
  }

  if (error && !waitlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  if (!waitlist) return null

  const theme = getTheme(waitlist.theme || "dark-modern")

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div 
        className="max-w-2xl w-full px-8 py-10 rounded-2xl border"
        style={{
          borderColor: theme.containerBorderColor,
          boxShadow: theme.containerShadow,
          backgroundColor: theme.inputBackground,
        }}
      >
        {/* Logo */}
        {waitlist.logoUrl && (
          <div className="mb-8 flex justify-center animate-fade-in">
            <div className="relative">
              {(() => {
                // Si logoUrl est un nombre, c'est un variant de logo SVG
                const logoVariant = parseInt(waitlist.logoUrl)
                if (!isNaN(logoVariant)) {
                  return <Logo variant={logoVariant} color={theme.primaryColor} size={64} />
                }
                // Sinon, c'est une URL (pour compatibilité avec les anciens logos)
                return null
              })()}
            </div>
          </div>
        )}

        {/* Headline */}
        <h1
          className={`text-3xl md:text-4xl font-bold text-center leading-tight animate-fade-in-up ${
            !waitlist.subheadline && !waitlist.description ? "mb-10" : "mb-4"
          }`}
          style={{ color: theme.textColor }}
        >
          {waitlist.headline}
        </h1>

        {/* Subheadline */}
        {waitlist.subheadline && (
          <p
            className="text-lg md:text-xl mb-6 text-center animate-fade-in-up"
            style={{ color: theme.textSecondaryColor, animationDelay: "0.1s" }}
          >
            {waitlist.subheadline}
          </p>
        )}

        {/* Description */}
        {waitlist.description && (
          <p
            className="text-base mb-8 text-center max-w-xl mx-auto animate-fade-in-up"
            style={{ color: theme.textSecondaryColor, animationDelay: "0.2s" }}
          >
            {waitlist.description}
          </p>
        )}

        {/* Countdown */}
        {waitlist.countdownEnabled && waitlist.countdownDate && timeRemaining && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
              {[
                { value: timeRemaining.days, label: "Jours" },
                { value: timeRemaining.hours, label: "Heures" },
                { value: timeRemaining.minutes, label: "Minutes" },
                { value: timeRemaining.seconds, label: "Secondes" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-md p-2.5 border text-center"
                  style={{
                    backgroundColor: theme.backgroundColor,
                    borderColor: theme.borderColor,
                  }}
                >
                  <div
                    className="text-xl md:text-2xl font-bold mb-0.5"
                    style={{ color: theme.primaryColor }}
                  >
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div
                    className="text-[10px] font-medium uppercase tracking-wider"
                    style={{ color: theme.textSecondaryColor }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {success ? (
          <div
            className="mb-6 p-5 rounded-lg border animate-fade-in"
            style={{
              backgroundColor: theme.backgroundColor,
              borderColor: theme.primaryColor,
            }}
          >
            <p
              className="font-semibold text-base mb-1"
              style={{ color: theme.textColor }}
            >
              Merci pour votre inscription !
            </p>
            <p
              className="text-sm"
              style={{ color: theme.textSecondaryColor }}
            >
              Vous êtes #{waitlist._count.subscribers} sur la liste d&apos;attente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mb-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {error && (
              <div
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderColor: "#EF4444",
                  color: "#FCA5A5",
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-3 max-w-md mx-auto">
              {waitlist.collectName && (
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                  style={{
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.inputBorder,
                    color: theme.textColor,
                    "--tw-ring-color": theme.primaryColor,
                  } as React.CSSProperties}
                />
              )}

              <input
                type="email"
                required
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.textColor,
                  "--tw-ring-color": theme.primaryColor,
                } as React.CSSProperties}
              />

              {waitlist.collectCompany && (
                <input
                  type="text"
                  placeholder="Nom de votre entreprise"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                  style={{
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.inputBorder,
                    color: theme.textColor,
                    "--tw-ring-color": theme.primaryColor,
                  } as React.CSSProperties}
                />
              )}
            </div>

            <div className="max-w-md mx-auto">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-5 py-3 text-sm font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {submitting ? "Inscription..." : "Rejoindre la waitlist"}
              </button>
            </div>
          </form>
        )}

        {/* Subscriber Count */}
        <p
          className="text-xs text-center animate-fade-in-up"
          style={{ color: theme.textSecondaryColor, animationDelay: "0.5s" }}
        >
          {waitlist._count.subscribers} {waitlist._count.subscribers <= 1 ? "personne déjà inscrite" : "personnes déjà inscrites"}
        </p>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
