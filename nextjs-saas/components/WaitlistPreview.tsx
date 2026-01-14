"use client"

import { useState, useEffect } from "react"
import { getTheme, type ThemeId } from "@/lib/themes"
import { Logo } from "@/components/Logo"

interface WaitlistPreviewProps {
  title: string
  description?: string | null
  theme: ThemeId
  logoUrl?: string | null
  collectName?: boolean
  collectCompany?: boolean
  countdownEnabled?: boolean
  countdownDate?: string | null
  subscriberCount?: number
  className?: string
  isMobile?: boolean
}

export function WaitlistPreview({
  title,
  description,
  theme: themeId,
  logoUrl,
  collectName = true,
  collectCompany = false,
  countdownEnabled = false,
  countdownDate,
  subscriberCount = 0,
  className = "",
  isMobile = false,
}: WaitlistPreviewProps) {
  const theme = getTheme(themeId)
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    if (!countdownEnabled || !countdownDate) {
      setTimeRemaining(null)
      return
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(countdownDate).getTime()
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
  }, [countdownEnabled, countdownDate])

  // Tailles adaptatives selon le mode mobile ou desktop
  const sizes = isMobile ? {
    containerPadding: "px-4 py-6",
    cardPadding: "px-5 py-6",
    logoSize: 48,
    titleSize: "text-xl",
    descSize: "text-sm",
    inputPadding: "px-3 py-2",
    buttonPadding: "px-4 py-2.5",
    countdownPadding: "p-2",
    countdownValue: "text-lg",
    countdownLabel: "text-[8px]",
    gap: "gap-1.5",
    marginBottom: "mb-4",
  } : {
    containerPadding: "px-6 py-8",
    cardPadding: "px-8 py-8",
    logoSize: 56,
    titleSize: "text-2xl lg:text-3xl",
    descSize: "text-sm",
    inputPadding: "px-4 py-2.5",
    buttonPadding: "px-5 py-3",
    countdownPadding: "p-2",
    countdownValue: "text-xl",
    countdownLabel: "text-[9px]",
    gap: "gap-2",
    marginBottom: "mb-6",
  }

  return (
    <div 
      className={`w-full h-full overflow-auto ${className}`}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className={`min-h-full flex items-center justify-center ${sizes.containerPadding}`}>
        <div 
          className={`w-full max-w-lg ${sizes.cardPadding} rounded-xl border`}
          style={{
            borderColor: theme.containerBorderColor,
            boxShadow: theme.containerShadow,
            backgroundColor: theme.inputBackground,
          }}
        >
          {/* Logo */}
          {logoUrl && (
            <div className={`${sizes.marginBottom} flex justify-center`}>
              <div className="relative">
                {(() => {
                  const logoVariant = parseInt(logoUrl)
                  if (!isNaN(logoVariant)) {
                    return <Logo variant={logoVariant} color={theme.primaryColor} size={sizes.logoSize} />
                  }
                  return (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="object-contain"
                      style={{ height: sizes.logoSize, width: sizes.logoSize }}
                    />
                  )
                })()}
              </div>
            </div>
          )}

          {/* Headline (title) */}
          <h1
            className={`${sizes.titleSize} font-bold text-center leading-tight ${
              !description ? sizes.marginBottom : "mb-2"
            }`}
            style={{ color: theme.textColor }}
          >
            {title || "Votre titre ici"}
          </h1>

          {/* Description */}
          {description && (
            <p
              className={`${sizes.descSize} ${sizes.marginBottom} text-center max-w-md mx-auto leading-relaxed`}
              style={{ color: theme.textSecondaryColor }}
            >
              {description}
            </p>
          )}

          {/* Countdown */}
          {countdownEnabled && countdownDate && timeRemaining && (
            <div className={sizes.marginBottom}>
              <div className={`grid grid-cols-4 ${sizes.gap} max-w-xs mx-auto`}>
                {[
                  { value: timeRemaining.days, label: "Jours" },
                  { value: timeRemaining.hours, label: "Heures" },
                  { value: timeRemaining.minutes, label: "Min" },
                  { value: timeRemaining.seconds, label: "Sec" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-md ${sizes.countdownPadding} border text-center`}
                    style={{
                      backgroundColor: theme.backgroundColor,
                      borderColor: theme.borderColor,
                    }}
                  >
                    <div
                      className={`${sizes.countdownValue} font-bold`}
                      style={{ color: theme.primaryColor }}
                    >
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div
                      className={`${sizes.countdownLabel} font-medium uppercase tracking-wider`}
                      style={{ color: theme.textSecondaryColor }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form (Preview - non-interactive) */}
          <div className={`space-y-2 ${isMobile ? "mb-4" : "mb-5"}`}>
            <div className={`space-y-2 max-w-sm mx-auto`}>
              {collectName && (
                <div
                  className={`w-full ${sizes.inputPadding} rounded-lg border text-sm`}
                  style={{
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.inputBorder,
                    color: theme.textSecondaryColor,
                  }}
                >
                  Votre nom
                </div>
              )}

              <div
                className={`w-full ${sizes.inputPadding} rounded-lg border text-sm`}
                style={{
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.textSecondaryColor,
                }}
              >
                Votre email
              </div>

              {collectCompany && (
                <div
                  className={`w-full ${sizes.inputPadding} rounded-lg border text-sm`}
                  style={{
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.inputBorder,
                    color: theme.textSecondaryColor,
                  }}
                >
                  Nom de votre entreprise
                </div>
              )}
            </div>

            <div className="max-w-sm mx-auto">
              <div
                className={`w-full ${sizes.buttonPadding} text-sm font-semibold rounded-lg text-center text-white`}
                style={{ backgroundColor: theme.primaryColor }}
              >
                Rejoindre la waitlist
              </div>
            </div>
          </div>

          {/* Subscriber Count */}
          <p
            className="text-xs text-center"
            style={{ color: theme.textSecondaryColor }}
          >
            {subscriberCount} {subscriberCount <= 1 ? "personne déjà inscrite" : "personnes déjà inscrites"}
          </p>
        </div>
      </div>
    </div>
  )
}

// Mini preview for theme selection (more compact)
export function WaitlistPreviewMini({
  theme: themeId,
  className = "",
}: {
  theme: ThemeId
  className?: string
}) {
  const theme = getTheme(themeId)

  return (
    <div
      className={`relative h-full rounded overflow-hidden border ${className}`}
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
      }}
    >
      <div className="absolute inset-0 p-2 flex flex-col gap-1">
        <div className="h-1.5 rounded" style={{ backgroundColor: theme.primaryColor, width: "60%" }} />
        <div className="h-1 rounded" style={{ backgroundColor: theme.textSecondaryColor, width: "80%", opacity: 0.5 }} />
        <div className="mt-2 flex gap-1">
          <div
            className="h-4 flex-1 rounded border"
            style={{
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
            }}
          />
          <div className="h-4 w-10 rounded" style={{ backgroundColor: theme.primaryColor }} />
        </div>
      </div>
    </div>
  )
}
