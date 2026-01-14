"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Check, 
  X, 
  Loader2, 
  Sparkles,
  Palette,
  Settings,
  Timer,
  Monitor,
  Smartphone
} from "lucide-react"
import { themes, type ThemeId } from "@/lib/themes"
import { Logo } from "@/components/Logo"
import { WaitlistPreview } from "@/components/WaitlistPreview"

// Fonction pour générer un slug à partir d'un titre
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface SlugStatus {
  checking: boolean
  available: boolean | null
  message: string
}

export default function NewWaitlistPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("general")
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop")
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    theme: "dark-modern" as ThemeId,
    logoUrl: "",
    countdownEnabled: false,
    countdownDate: "",
    collectName: true,
    collectCompany: false,
  })
  
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [slugStatus, setSlugStatus] = useState<SlugStatus>({
    checking: false,
    available: null,
    message: "",
  })
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [uploadingLogo, setUploadingLogo] = useState(false)
  
  const debouncedSlug = useDebounce(formData.slug, 500)
  
  // Générer automatiquement le slug quand le titre change
  useEffect(() => {
    if (formData.title && !slugManuallyEdited) {
      const generatedSlug = generateSlug(formData.title)
      if (generatedSlug) {
        setFormData(prev => ({ ...prev, slug: generatedSlug }))
      }
    }
  }, [formData.title, slugManuallyEdited])

  // Vérifier la disponibilité du slug
  const checkSlugAvailability = useCallback(async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugStatus({
        checking: false,
        available: null,
        message: slug.length > 0 ? "Minimum 3 caractères" : "",
      })
      return
    }

    setSlugStatus(prev => ({ ...prev, checking: true }))

    try {
      const response = await fetch(`/api/waitlists/check-slug?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      
      setSlugStatus({
        checking: false,
        available: data.available,
        message: data.message,
      })
    } catch {
      setSlugStatus({
        checking: false,
        available: null,
        message: "Erreur de vérification",
      })
    }
  }, [])

  // Vérifier le slug après debounce
  useEffect(() => {
    if (debouncedSlug) {
      checkSlugAvailability(debouncedSlug)
    }
  }, [debouncedSlug, checkSlugAvailability])

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Type de fichier non autorisé", {
        description: "Utilisez PNG, JPEG, GIF, WebP ou SVG",
      })
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error("Fichier trop volumineux", {
        description: "Taille maximale : 5MB",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploadingLogo(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload/logo", {
        method: "POST",
        body: uploadFormData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de l'upload")
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, logoUrl: data.url }))
      toast.success("Logo uploadé avec succès")
    } catch (error) {
      console.error("Erreur upload:", error)
      toast.error("Erreur lors de l'upload du logo")
      setLogoPreview("")
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.title || !formData.slug) {
      setError("Le titre et l'URL sont requis")
      setLoading(false)
      return
    }

    if (slugStatus.available === false) {
      setError("L'URL n'est pas disponible")
      setLoading(false)
      return
    }

    try {
      const submitData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || null,
        headline: formData.title.trim(),
        subheadline: null,
        theme: formData.theme,
        primaryColor: themes[formData.theme].primaryColor,
        backgroundColor: themes[formData.theme].backgroundColor,
        logoUrl: formData.logoUrl || null,
        collectName: formData.collectName,
        collectCompany: formData.collectCompany,
        countdownEnabled: formData.countdownEnabled,
        countdownDate: formData.countdownEnabled && formData.countdownDate && formData.countdownDate.trim() !== "" 
          ? formData.countdownDate 
          : null,
      }

      const response = await fetch("/api/waitlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue")
        toast.error("Erreur lors de la création", {
          description: data.error || "Une erreur est survenue",
        })
        return
      }

      toast.success("Waitlist créée avec succès !", {
        description: `"${formData.title}" a été créée.`,
      })
      
      router.push(`/dashboard/waitlists/${data.id}`)
    } catch {
      setError("Une erreur est survenue")
      toast.error("Erreur lors de la création")
    } finally {
      setLoading(false)
    }
  }

  const getSlugIcon = () => {
    if (slugStatus.checking) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    }
    if (slugStatus.available === true) {
      return <Check className="h-4 w-4 text-green-500" />
    }
    if (slugStatus.available === false) {
      return <X className="h-4 w-4 text-destructive" />
    }
    return null
  }

  return (
    <div className="h-[calc(100vh-1px)] flex flex-col overflow-hidden">
      {/* Header compact */}
      <div className="bg-background border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">
              {formData.title || "Nouvelle waitlist"}
            </h1>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={loading || slugStatus.available === false || !formData.title || !formData.slug}
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Créer la waitlist
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main content - Split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-[400px] xl:w-[440px] border-r border-border flex flex-col overflow-hidden shrink-0">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Tabs Navigation */}
            <div className="px-4 pt-3 pb-2 shrink-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 h-9">
                  <TabsTrigger value="general" className="text-xs">
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Général
                  </TabsTrigger>
                  <TabsTrigger value="design" className="text-xs">
                    <Palette className="h-3.5 w-3.5 mr-1.5" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="options" className="text-xs">
                    <Timer className="h-3.5 w-3.5 mr-1.5" />
                    Options
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Tab: Général */}
                <TabsContent value="general" className="mt-0 space-y-4">
                  {/* Titre */}
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-sm">
                      Titre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Mon super produit"
                      className="h-9"
                    />
                  </div>

                  {/* URL / Slug */}
                  <div className="space-y-1.5">
                    <Label htmlFor="slug" className="text-sm">
                      URL <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-2 border border-r-0 border-input rounded-l-md">
                          /w/
                        </span>
                        <Input
                          id="slug"
                          required
                          value={formData.slug}
                          onChange={(e) => {
                            setSlugManuallyEdited(true)
                            setFormData({ 
                              ...formData, 
                              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") 
                            })
                          }}
                          placeholder="mon-super-produit"
                          className="rounded-l-none h-9 pr-9"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {getSlugIcon()}
                        </div>
                      </div>
                    </div>
                    {slugStatus.message && (
                      <p className={`text-xs ${slugStatus.available === false ? "text-destructive" : slugStatus.available === true ? "text-green-600" : "text-muted-foreground"}`}>
                        {slugStatus.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm">
                      Description <span className="text-muted-foreground text-xs">(optionnel)</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      placeholder="Décrivez brièvement votre produit..."
                      className="resize-none text-sm"
                    />
                  </div>
                </TabsContent>

                {/* Tab: Design */}
                <TabsContent value="design" className="mt-0 space-y-4">
                  {/* Thème */}
                  <div className="space-y-2">
                    <Label className="text-sm">Thème</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(themes) as ThemeId[]).map((themeId) => {
                        const theme = themes[themeId]
                        const isSelected = formData.theme === themeId
                        return (
                          <button
                            key={themeId}
                            type="button"
                            onClick={() => setFormData({ ...formData, theme: themeId })}
                            className={`group relative p-2 rounded-lg border transition-all text-left ${
                              isSelected
                                ? "border-primary ring-1 ring-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div 
                              className="h-10 rounded mb-1.5 overflow-hidden border"
                              style={{ 
                                backgroundColor: theme.backgroundColor,
                                borderColor: theme.borderColor,
                              }}
                            >
                              <div className="p-1.5 flex flex-col gap-0.5">
                                <div className="h-1 rounded" style={{ backgroundColor: theme.primaryColor, width: "50%" }} />
                                <div className="h-0.5 rounded opacity-50" style={{ backgroundColor: theme.textSecondaryColor, width: "70%" }} />
                                <div className="mt-0.5 flex gap-0.5">
                                  <div className="h-2.5 flex-1 rounded border" style={{ backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }} />
                                  <div className="h-2.5 w-6 rounded" style={{ backgroundColor: theme.primaryColor }} />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                              <span className="text-xs font-medium truncate">{theme.name}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-primary ml-auto shrink-0" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="space-y-2">
                    <Label htmlFor="logoFile" className="text-sm">
                      Logo <span className="text-muted-foreground text-xs">(optionnel)</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      {(logoPreview || formData.logoUrl) ? (
                        <div className="relative">
                          <div className="h-12 w-12 flex items-center justify-center rounded-lg border border-border bg-muted">
                            {(() => {
                              const logoUrl = logoPreview || formData.logoUrl
                              if (!logoUrl) return null
                              const logoVariant = parseInt(logoUrl)
                              if (!isNaN(logoVariant)) {
                                return <Logo variant={logoVariant} color={themes[formData.theme].primaryColor} size={32} />
                              }
                              return <img src={logoUrl} alt="Logo" className="h-full w-full object-contain rounded-lg" />
                            })()}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview("")
                              setFormData({ ...formData, logoUrl: "" })
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="h-12 w-12 flex items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/50">
                          <Input
                            id="logoFile"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                            onChange={handleLogoChange}
                            disabled={uploadingLogo}
                            className="hidden"
                          />
                          {uploadingLogo ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <span className="text-lg text-muted-foreground">+</span>
                          )}
                        </label>
                      )}
                      <div className="flex-1 text-xs text-muted-foreground">
                        PNG, JPEG, GIF, WebP ou SVG (max 5MB)
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab: Options */}
                <TabsContent value="options" className="mt-0 space-y-4">
                  {/* Données à collecter */}
                  <div className="space-y-2">
                    <Label className="text-sm">Données à collecter</Label>
                    <div className="space-y-1 bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2.5 py-1">
                        <Checkbox id="collectEmail" checked={true} disabled />
                        <Label htmlFor="collectEmail" className="text-sm font-normal text-muted-foreground">
                          Email <span className="text-xs">(obligatoire)</span>
                        </Label>
                      </div>
                      <div className="flex items-center gap-2.5 py-1">
                        <Checkbox
                          id="collectName"
                          checked={formData.collectName}
                          onCheckedChange={(checked) => setFormData({ ...formData, collectName: checked as boolean })}
                        />
                        <Label htmlFor="collectName" className="text-sm font-normal cursor-pointer">
                          Nom
                        </Label>
                      </div>
                      <div className="flex items-center gap-2.5 py-1">
                        <Checkbox
                          id="collectCompany"
                          checked={formData.collectCompany}
                          onCheckedChange={(checked) => setFormData({ ...formData, collectCompany: checked as boolean })}
                        />
                        <Label htmlFor="collectCompany" className="text-sm font-normal cursor-pointer">
                          Entreprise
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Compte à rebours */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        id="countdownEnabled"
                        checked={formData.countdownEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, countdownEnabled: checked as boolean })}
                      />
                      <Label htmlFor="countdownEnabled" className="text-sm font-medium cursor-pointer">
                        Compte à rebours
                      </Label>
                    </div>
                    {formData.countdownEnabled && (
                      <div className="pl-6 space-y-1.5">
                        <Label htmlFor="countdownDate" className="text-xs text-muted-foreground">
                          Date de lancement
                        </Label>
                        <Input
                          id="countdownDate"
                          type="datetime-local"
                          required={formData.countdownEnabled}
                          value={formData.countdownDate}
                          onChange={(e) => setFormData({ ...formData, countdownDate: e.target.value })}
                          className="h-9"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </form>
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden lg:flex flex-1 flex-col bg-muted/30 overflow-hidden">
          {/* Preview Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50 shrink-0">
            <span className="text-xs font-medium text-muted-foreground">Aperçu en temps réel</span>
            <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded transition-colors ${previewDevice === "desktop" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded transition-colors ${previewDevice === "mobile" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Preview Content - Responsive container */}
          <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
            {previewDevice === "mobile" ? (
              /* Mobile Preview */
              <div className="relative w-[320px] h-[580px] rounded-[2.5rem] border-[12px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10" />
                {/* Screen */}
                <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
                  <WaitlistPreview
                    title={formData.title}
                    description={formData.description || null}
                    theme={formData.theme}
                    logoUrl={logoPreview || formData.logoUrl || null}
                    collectName={formData.collectName}
                    collectCompany={formData.collectCompany}
                    countdownEnabled={formData.countdownEnabled}
                    countdownDate={formData.countdownDate || null}
                    subscriberCount={0}
                    isMobile={true}
                  />
                </div>
              </div>
            ) : (
              /* Desktop Preview */
              <div className="w-full h-full max-w-4xl rounded-lg overflow-hidden border border-border shadow-sm">
                <WaitlistPreview
                  title={formData.title}
                  description={formData.description || null}
                  theme={formData.theme}
                  logoUrl={logoPreview || formData.logoUrl || null}
                  collectName={formData.collectName}
                  collectCompany={formData.collectCompany}
                  countdownEnabled={formData.countdownEnabled}
                  countdownDate={formData.countdownDate || null}
                  subscriberCount={0}
                  isMobile={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
