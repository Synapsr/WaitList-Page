export type ThemeId = "dark-modern" | "light-minimal" | "light-gray" | "vibrant-purple"

export interface Theme {
  id: ThemeId
  name: string
  description: string
  backgroundColor: string
  primaryColor: string
  textColor: string
  textSecondaryColor: string
  accentColor: string
  borderColor: string
  inputBackground: string
  inputBorder: string
  containerBorderColor: string
  containerShadow: string
}

export const themes: Record<ThemeId, Theme> = {
  "dark-modern": {
    id: "dark-modern",
    name: "Dark Modern",
    description: "Fond sombre avec accent bleu moderne",
    backgroundColor: "#111827",
    primaryColor: "#3B82F6",
    textColor: "#FFFFFF",
    textSecondaryColor: "#9CA3AF",
    accentColor: "#60A5FA",
    borderColor: "#374151",
    inputBackground: "#1F2937",
    inputBorder: "#374151",
    containerBorderColor: "#374151",
    containerShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
  },
  "light-minimal": {
    id: "light-minimal",
    name: "Light Minimal",
    description: "Minimaliste noir et blanc",
    backgroundColor: "#FFFFFF",
    primaryColor: "#000000",
    textColor: "#000000",
    textSecondaryColor: "#666666",
    accentColor: "#333333",
    borderColor: "#E5E5E5",
    inputBackground: "#FAFAFA",
    inputBorder: "#E5E5E5",
    containerBorderColor: "#000000",
    containerShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  "light-gray": {
    id: "light-gray",
    name: "Light Gray",
    description: "Clair et moderne dans les tons gris",
    backgroundColor: "#F5F5F5",
    primaryColor: "#6366F1",
    textColor: "#1F2937",
    textSecondaryColor: "#6B7280",
    accentColor: "#818CF8",
    borderColor: "#E5E7EB",
    inputBackground: "#FFFFFF",
    inputBorder: "#D1D5DB",
    containerBorderColor: "#D1D5DB",
    containerShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
  },
  "vibrant-purple": {
    id: "vibrant-purple",
    name: "Vibrant Purple",
    description: "Sombre avec accents violet et magenta vibrants",
    backgroundColor: "#0F0F1E",
    primaryColor: "#A855F7",
    textColor: "#FFFFFF",
    textSecondaryColor: "#C4B5FD",
    accentColor: "#EC4899",
    borderColor: "#4C1D95",
    inputBackground: "#1E1B2E",
    inputBorder: "#6D28D9",
    containerBorderColor: "#7C3AED",
    containerShadow: "0 8px 16px -4px rgba(168, 85, 247, 0.3), 0 4px 8px -2px rgba(168, 85, 247, 0.2)",
  },
}

export function getTheme(themeId: ThemeId): Theme {
  return themes[themeId] || themes["dark-modern"]
}
