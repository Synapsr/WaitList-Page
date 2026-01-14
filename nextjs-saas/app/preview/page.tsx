"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getTheme, type ThemeId } from "@/lib/themes"
import { Logo } from "@/components/Logo"

interface PreviewData {
  slug: string
  title: string
  description: string | null
  headline: string
  subheadline: string | null
  theme?: ThemeId
  primaryColor: string
  backgroundColor: string
  logoUrl: string | null
  collectName: boolean
  collectCompany: boolean
  countdownEnabled: boolean
  countdownDate: string | null
}

function PreviewContent() {
  const searchParams = useSearchParams()
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    // Récupérer les données depuis les query params ou localStorage
    const dataParam = searchParams.get("data")
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(dataParam)
        const data = JSON.parse(decoded)
        setPreviewData(data)
      } catch (error) {
        console.error("Erreur lors du parsing des données:", error)
      }
    } else {
      // Essayer depuis localStorage comme fallback
      const stored = localStorage.getItem("waitlistPreview")
      if (stored) {
        try {
          const data = JSON.parse(stored)
          setPreviewData(data)
        } catch (error) {
          console.error("Erreur lors du parsing des données:", error)
        }
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (!previewData?.countdownEnabled || !previewData.countdownDate) {
      return
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(previewData.countdownDate!).getTime()
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
  }, [previewData?.countdownEnabled, previewData?.countdownDate])

  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">Chargement de l&apos;aperçu...</div>
      </div>
    )
  }

  const theme = getTheme(previewData.theme || "dark-modern")

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Bandeau d'aperçu */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium py-2.5 px-4 text-center shadow-md">
        <span>🔍 Aperçu de votre page publique - Cette page n'est pas accessible publiquement</span>
      </div>

      {/* Contenu principal centré */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 transition-colors duration-300">
        <div 
          className="max-w-2xl w-full px-8 py-10 rounded-2xl border"
          style={{
            borderColor: theme.containerBorderColor,
            boxShadow: theme.containerShadow,
            backgroundColor: theme.inputBackground,
          }}
        >
          {previewData.logoUrl && (
            <div className="mb-8 flex justify-center">
              <div className="relative">
                {(() => {
                  // Si logoUrl est un nombre, c'est un variant de logo SVG
                  const logoVariant = parseInt(previewData.logoUrl)
                  if (!isNaN(logoVariant)) {
                    return <Logo variant={logoVariant} color={theme.primaryColor} size={64} />
                  }
                  // Sinon, c'est une URL (pour compatibilité avec les anciens logos)
                  return null
                })()}
              </div>
            </div>
          )}

          <h1
            className={`text-3xl md:text-4xl font-bold text-center leading-tight ${
              !previewData.subheadline && !previewData.description ? "mb-10" : "mb-4"
            }`}
            style={{ color: theme.textColor }}
          >
            {previewData.headline}
          </h1>

          {previewData.subheadline && (
            <p
              className="text-lg md:text-xl mb-6 text-center"
              style={{ color: theme.textSecondaryColor }}
            >
              {previewData.subheadline}
            </p>
          )}

          {previewData.description && (
            <p
              className="text-base mb-8 text-center max-w-xl mx-auto"
              style={{ color: theme.textSecondaryColor }}
            >
              {previewData.description}
            </p>
          )}

          {/* Countdown */}
          {previewData.countdownEnabled && previewData.countdownDate && timeRemaining && (
            <div className="mb-8">
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

        <form className="space-y-3 mb-6">
          <div className="space-y-3 max-w-md mx-auto">
            {previewData.collectName && (
              <input
                type="text"
                placeholder="Votre nom"
                disabled
                className="w-full px-4 py-3 rounded-lg border text-sm cursor-not-allowed"
                style={{
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.textSecondaryColor,
                }}
              />
            )}

            <input
              type="email"
              placeholder="Votre email"
              disabled
              className="w-full px-4 py-3 rounded-lg border text-sm cursor-not-allowed"
              style={{
                backgroundColor: theme.inputBackground,
                borderColor: theme.inputBorder,
                color: theme.textSecondaryColor,
              }}
            />

            {previewData.collectCompany && (
              <input
                type="text"
                placeholder="Nom de votre entreprise"
                disabled
                className="w-full px-4 py-3 rounded-lg border text-sm cursor-not-allowed"
                style={{
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.textSecondaryColor,
                }}
              />
            )}
          </div>

          <div className="max-w-md mx-auto">
            <button
              type="button"
              disabled
              className="w-full px-5 py-3 text-sm font-semibold rounded-lg opacity-50 cursor-not-allowed text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Rejoindre la waitlist
            </button>
          </div>
        </form>

        <p
          className="text-xs text-center"
          style={{ color: theme.textSecondaryColor }}
        >
          X personnes déjà inscrites
        </p>
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Chargement de l&apos;aperçu...</div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
