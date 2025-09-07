"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function AdminLogin() {
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetMessage, setResetMessage] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Demo authentication
    if (loginId === "yashghuge" && password === "yash123") {
      // Store auth state
      localStorage.setItem("adminAuth", "true")
      localStorage.setItem("adminUser", loginId)

      // Redirect to dashboard
      window.location.href = "/admin/dashboard"
    } else {
      setError("Invalid login credentials. Please try again.")
    }

    setIsLoading(false)
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setResetMessage("Password reset instructions have been sent to your email.")
    setTimeout(() => {
      setShowForgotPassword(false)
      setResetMessage("")
      setResetEmail("")
    }, 3000)
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <div className="fixed top-6 right-6">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-md shadow-2xl border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your email to receive reset instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="admin@neomart.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              {resetMessage && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{resetMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#007BFF] to-[#00C6FF] text-[#222222] dark:from-[#1A1A1A] dark:to-[#555555] dark:text-[#F0F0F0] dark:border-2 dark:border-white transition-all duration-300 hover:scale-105"
                  disabled={!resetEmail}
                >
                  Send Reset Instructions
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowForgotPassword(false)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="fixed top-6 right-6">
        <ThemeToggle />
      </div>

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
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit animate-pulse">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">Admin Panel</CardTitle>
            <CardDescription className="text-lg">Sign in to manage NEO MART</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="loginId" className="text-sm font-medium">
                  Login ID
                </Label>
                <Input
                  id="loginId"
                  type="text"
                  placeholder="Enter your login ID"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#007BFF] to-[#00C6FF] text-[#222222] dark:from-[#1A1A1A] dark:to-[#555555] dark:text-[#F0F0F0] dark:border-2 dark:border-white font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  disabled={isLoading || !loginId || !password}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="w-full text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
