"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, Lock, IndianRupee } from "lucide-react"
import Link from "next/link"

export default function CardPayment() {
  const [mounted, setMounted] = useState(false)
  const [total, setTotal] = useState(0)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setMounted(true)

    const cartTotal = localStorage.getItem("cartTotal")
    if (!cartTotal) {
      window.location.href = "/shop"
      return
    }

    setTotal(Number.parseFloat(cartTotal))
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      window.location.href = "/shop/payment/success"
    }, 3000)
  }

  if (!mounted) return null

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-2xl border-2">
          <CardContent className="pt-12 pb-12">
            <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Processing Payment...</h2>
            <p className="text-muted-foreground mb-4">Please wait while we process your card payment</p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Secure Transaction</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/shop/payment">
              <Button variant="ghost" className="group hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Payment Options
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Card Payment
              </h1>
              <p className="text-muted-foreground">Enter your card details</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <CreditCard className="mr-3 h-6 w-6" />
              Card Details
            </CardTitle>
            <CardDescription>Enter your credit or debit card information</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Amount Display */}
            <div className="bg-accent/10 p-4 rounded-lg mb-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
              <p className="text-2xl font-bold text-accent flex items-center justify-center">
                <IndianRupee className="h-5 w-5" />
                {total.toFixed(2)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  maxLength={19}
                  required
                  className="font-mono"
                />
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    maxLength={5}
                    required
                    className="font-mono"
                  />
                </div>

                {/* CVV */}
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    maxLength={4}
                    required
                    className="font-mono"
                  />
                </div>
              </div>

              {/* Security Notice */}
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <Lock className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Your card information is encrypted and secure. We never store your card details.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName}
              >
                <Lock className="mr-2 h-5 w-5" />
                Pay Securely
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
