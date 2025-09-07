"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20"
        style={{
          backgroundImage: "url('/modern-shopping-mall-interior-with-elegant-lightin.jpg')",
        }}
      />
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-background/80 via-card/70 to-background/80">
        {/* Header */}
        <header className="text-center py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-foreground drop-shadow-lg">NEO MART</h1>
            <p className="text-muted-foreground mt-4 text-lg drop-shadow-md">Powered By CartX</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 pb-12">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-16">
            <Button
              size="lg"
              className="group relative overflow-hidden px-12 py-6 text-xl font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground backdrop-blur-sm"
              onClick={() => (window.location.href = "/admin")}
            >
              <span className="mr-3 text-2xl">👨🏻‍💼</span>
              Admin Panel
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>

            <Button
              size="lg"
              className="group relative overflow-hidden px-12 py-6 text-xl font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground backdrop-blur-sm"
              onClick={() => (window.location.href = "/shop")}
            >
              <span className="mr-3 text-2xl">🛍️</span>
              Start Shopping
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/50 rounded-lg backdrop-blur-sm bg-card/90">
              <CardContent className="p-8 text-center">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-16 w-16 mx-auto text-primary mb-4" />
                  <span className="text-4xl">🕗</span>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Mall Timing</h3>
                <p className="text-xl text-muted-foreground font-semibold">8 AM to 10 PM</p>
                <p className="text-sm text-muted-foreground mt-2">Open 7 days a week</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-accent/50 rounded-lg backdrop-blur-sm bg-card/90">
              <CardContent className="p-8 text-center">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-16 w-16 mx-auto text-accent mb-4" />
                  <span className="text-4xl">📍</span>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Location</h3>
                <p className="text-xl text-muted-foreground font-semibold">Vimannagar, Pune</p>
                <p className="text-sm text-muted-foreground mt-2">Easy parking available</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center drop-shadow-md">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-xl p-6 text-center backdrop-blur-sm border border-border">
                  <span className="text-4xl mb-2 block">👕</span>
                  <p className="font-semibold text-foreground">Fashion</p>
                </div>
              </div>
              <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl p-6 text-center backdrop-blur-sm border border-border">
                  <span className="text-4xl mb-2 block">📱</span>
                  <p className="font-semibold text-foreground">Electronics</p>
                </div>
              </div>
              <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-xl p-6 text-center backdrop-blur-sm border border-border">
                  <span className="text-4xl mb-2 block">🥗</span>
                  <p className="font-semibold text-foreground">Food</p>
                </div>
              </div>
              <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl p-6 text-center backdrop-blur-sm border border-border">
                  <span className="text-4xl mb-2 block">📚</span>
                  <p className="font-semibold text-foreground">Books</p>
                </div>
              </div>
              <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-xl p-6 text-center backdrop-blur-sm border border-border">
                  <span className="text-4xl mb-2 block">🏠</span>
                  <p className="font-semibold text-foreground">Home</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shopping Mall Image Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8 drop-shadow-md">
              Your Premium Shopping Destination
            </h2>
            <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border">
              <img
                src="/modern-shopping-mall-interior-with-elegant-lightin.jpg"
                alt="NEO MART Shopping Mall Interior"
                className="w-full h-96 object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">Experience Premium Shopping</h3>
                <p className="text-lg opacity-90">Modern • Convenient • Luxurious</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center py-8 border-t border-border backdrop-blur-sm">
          <p className="text-muted-foreground">Made with ❣️ by CartX</p>
        </footer>

        <div className="fixed bottom-6 right-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
