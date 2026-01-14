"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, List } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const navigation = [
    { name: "Mes Waitlists", href: "/dashboard" },
  ]

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex flex-col w-full relative h-full">
          <div className="flex flex-col h-full border-r border-gray-800 pt-5 pb-4 bg-gray-900">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <Link href="/dashboard" className="flex items-center">
                {!sidebarCollapsed && (
                  <span className="text-2xl font-bold text-white">
                    Waitlist SaaS
                  </span>
                )}
                {sidebarCollapsed && (
                  <span className="text-2xl font-bold text-white">
                    W
                  </span>
                )}
              </Link>
            </div>
            
            {/* Toggle button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute top-4 -right-3 z-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-1 border border-gray-700 shadow-lg transition-colors"
              aria-label={sidebarCollapsed ? "Étendre la sidebar" : "Rétracter la sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            {/* Navigation */}
            <div className="flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href === "/dashboard" && pathname?.startsWith("/dashboard/waitlists"))
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }
                        ${sidebarCollapsed ? 'justify-center' : ''}
                      `}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      {sidebarCollapsed ? (
                        <List className="h-5 w-5" />
                      ) : (
                        item.name
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* User section */}
            {!sidebarCollapsed && (
              <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {session.user?.name || "Utilisateur"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="mt-2 w-full text-left text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Fermer la sidebar</span>
                <span className="text-white text-2xl">×</span>
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-8">
                <span className="text-xl font-bold text-white">
                  Waitlist SaaS
                </span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href === "/dashboard" && pathname?.startsWith("/dashboard/waitlists"))
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        group flex items-center px-3 py-2 text-base font-medium rounded-lg
                        ${
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
              <div className="flex items-center w-full">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user?.name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut({ callbackUrl: "/login" })
                }}
                className="ml-4 text-xs text-gray-400 hover:text-white"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="text-2xl">☰</span>
            </button>
            <Link href="/dashboard" className="text-lg font-bold text-primary">
              Waitlist SaaS
            </Link>
            <div className="w-8" />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
