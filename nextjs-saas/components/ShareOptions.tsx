"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Link2, 
  Globe, 
  Code, 
  Copy, 
  Check, 
  ExternalLink,
  Info
} from "lucide-react"

interface ShareOptionsProps {
  slug: string
  waitlistId?: string
  className?: string
}

export function ShareOptions({ slug, waitlistId, className = "" }: ShareOptionsProps) {
  const [activeTab, setActiveTab] = useState("url")
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  
  // Générer l'URL de base (en production, utilisez votre domaine)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const publicUrl = `${baseUrl}/w/${slug}`
  
  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemId)
      toast.success("Copié dans le presse-papier")
      setTimeout(() => setCopiedItem(null), 2000)
    } catch {
      toast.error("Erreur lors de la copie")
    }
  }

  // Code SDK exemple
  const sdkCode = `<!-- Waitlist Widget -->
<script src="${baseUrl}/sdk/waitlist.js"></script>
<script>
  WaitlistWidget.init({
    slug: "${slug}",
    ${waitlistId ? `waitlistId: "${waitlistId}",` : ""}
    container: "#waitlist-container",
    // Options personnalisables
    theme: "auto", // auto, light, dark
    buttonText: "Rejoindre la waitlist",
    onSuccess: function(data) {
      console.log("Inscrit avec succès:", data);
    }
  });
</script>

<!-- Container pour le widget -->
<div id="waitlist-container"></div>`

  const iframeCode = `<iframe 
  src="${publicUrl}?embed=true" 
  width="100%" 
  height="500" 
  frameborder="0"
  style="border-radius: 8px; max-width: 600px;"
></iframe>`

  const reactCode = `import { WaitlistEmbed } from '@yourapp/waitlist-sdk';

function App() {
  return (
    <WaitlistEmbed
      slug="${slug}"
      onSuccess={(data) => {
        console.log('Inscrit:', data);
      }}
    />
  );
}`

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="url" className="flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">URL</span>
          </TabsTrigger>
          <TabsTrigger value="domain" className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Domaine</span>
          </TabsTrigger>
          <TabsTrigger value="sdk" className="flex items-center gap-1.5">
            <Code className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">SDK</span>
          </TabsTrigger>
        </TabsList>

        {/* URL directe */}
        <TabsContent value="url" className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Lien public de votre waitlist
              </Label>
              <div className="flex gap-2">
                <Input 
                  value={publicUrl}
                  readOnly
                  className="font-mono text-sm bg-background"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(publicUrl, "url")}
                  className="shrink-0"
                >
                  {copiedItem === "url" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="shrink-0"
                >
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/50 rounded-md p-2.5">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>
                Partagez ce lien directement sur vos réseaux sociaux, dans vos emails ou sur votre site web.
              </p>
            </div>
          </div>

          {/* QR Code placeholder */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <Label className="text-xs text-muted-foreground mb-2 block">
              QR Code (bientôt disponible)
            </Label>
            <div className="flex items-center justify-center h-32 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">QR Code à venir</p>
            </div>
          </div>
        </TabsContent>

        {/* Domaine personnalisé */}
        <TabsContent value="domain" className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div>
              <Label htmlFor="customDomain" className="text-xs text-muted-foreground mb-1.5 block">
                Votre domaine personnalisé
              </Label>
              <div className="flex gap-2">
                <Input 
                  id="customDomain"
                  placeholder="waitlist.votresite.com"
                  className="font-mono text-sm"
                />
                <Button variant="outline" className="shrink-0">
                  Vérifier
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Configuration DNS requise
              </Label>
              <div className="bg-background rounded-md p-3 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <span className="font-medium text-muted-foreground">Type</span>
                  <span className="font-medium text-muted-foreground">Nom</span>
                  <span className="font-medium text-muted-foreground">Valeur</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <span>CNAME</span>
                  <span>waitlist</span>
                  <span className="truncate">proxy.waitlist.app</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-md p-2.5">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
              <p>
                <span className="font-medium text-amber-600">Fonctionnalité Pro</span> — 
                Les domaines personnalisés sont disponibles sur les plans payants. 
                <a href="#" className="underline ml-1">Mettre à niveau</a>
              </p>
            </div>
          </div>

          {/* SSL Info */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <Label className="text-xs font-medium">SSL automatique</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Un certificat SSL sera automatiquement provisionné pour votre domaine personnalisé.
            </p>
          </div>
        </TabsContent>

        {/* SDK / Embed */}
        <TabsContent value="sdk" className="space-y-4">
          {/* Tabs secondaires pour les différentes méthodes d'intégration */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                JavaScript SDK
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => copyToClipboard(sdkCode, "sdk")}
              >
                {copiedItem === "sdk" ? (
                  <><Check className="h-3 w-3 mr-1 text-green-500" /> Copié</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copier</>
                )}
              </Button>
            </div>
            <pre className="bg-background rounded-md p-3 text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto">
              {sdkCode}
            </pre>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Embed (iFrame)
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => copyToClipboard(iframeCode, "iframe")}
              >
                {copiedItem === "iframe" ? (
                  <><Check className="h-3 w-3 mr-1 text-green-500" /> Copié</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copier</>
                )}
              </Button>
            </div>
            <pre className="bg-background rounded-md p-3 text-xs font-mono overflow-x-auto">
              {iframeCode}
            </pre>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                React / Next.js
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => copyToClipboard(reactCode, "react")}
              >
                {copiedItem === "react" ? (
                  <><Check className="h-3 w-3 mr-1 text-green-500" /> Copié</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copier</>
                )}
              </Button>
            </div>
            <pre className="bg-background rounded-md p-3 text-xs font-mono overflow-x-auto">
              {reactCode}
            </pre>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/50 rounded-md p-2.5 border">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <p>
              Le SDK permet une intégration native dans votre application. Consultez la 
              <a href="#" className="underline ml-1">documentation complète</a> pour plus d'options.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
