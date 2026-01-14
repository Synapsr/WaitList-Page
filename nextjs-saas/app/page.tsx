import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { List, Users, Settings, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <List className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900">
                Waitlist SaaS
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white">
                <Link href="/register">S'inscrire</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Générateur de pages d'attente
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Créez et personnalisez facilement des pages de waitlist pour votre produit.
            Collectez des emails et gérez vos abonnés depuis un dashboard intuitif.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
              <Link href="/register" className="flex items-center gap-2">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <List className="w-5 h-5 text-gray-900" />
              </div>
              <CardTitle>Création simple</CardTitle>
              <CardDescription>
                Créez une waitlist en quelques minutes avec une interface intuitive
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-5 h-5 text-gray-900" />
              </div>
              <CardTitle>Personnalisation complète</CardTitle>
              <CardDescription>
                Personnalisez les couleurs, logo et contenu selon votre marque
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-gray-900" />
              </div>
              <CardTitle>Gestion des abonnés</CardTitle>
              <CardDescription>
                Visualisez et exportez vos inscriptions en CSV depuis le dashboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gray-900 border-0 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à créer votre première waitlist ?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Inscrivez-vous gratuitement et commencez à collecter des emails dès aujourd'hui
            </p>
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              <Link href="/register" className="flex items-center gap-2">
                Créer un compte
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center">
                <List className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Waitlist SaaS</span>
            </div>
            <p className="text-sm text-gray-500">
              Open source • MIT License
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
