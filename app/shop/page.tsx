"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, ShoppingCart, Sparkles } from "lucide-react"
import Link from "next/link"

export default function ShopEntry() {
  const [userName, setUserName] = useState("")
  const [showWelcome, setShowWelcome] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleStartShopping = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) return

    // Store user name
    localStorage.setItem("customerName", userName.trim())

    // Show welcome message
    setShowWelcome(true)

    // Redirect to shopping cart after 2.5 seconds
    setTimeout(() => {
      window.location.href = "/shop/cart"
    }, 2500)
  }

  if (!mounted) return null

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-2xl border-2 animate-pulse">
          <CardContent className="pt-12 pb-12">
            <div className="mb-6">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-primary to-accent rounded-full w-fit animate-bounce">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Welcome, {userName}!
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Get ready for an amazing shopping experience at NEO MART
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              <span className="text-sm">Loading your shopping cart...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="group hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-2 hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-primary to-accent rounded-full w-fit">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to NEO MART
            </CardTitle>
            <CardDescription className="text-lg">Please enter your name to start shopping</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleStartShopping} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg text-center text-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                disabled={!userName.trim()}
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                Start Shopping
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">Discover amazing products at unbeatable prices</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
