"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, IndianRupee } from "lucide-react"
import Link from "next/link"

export default function UPIPayment() {
  const [mounted, setMounted] = useState(false)
  const [total, setTotal] = useState(0)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const cartTotal = localStorage.getItem("cartTotal")
    if (!cartTotal) {
      window.location.href = "/shop"
      return
    }

    setTotal(Number.parseFloat(cartTotal))
  }, [])

  const handlePaymentComplete = () => {
    setPaymentCompleted(true)
    setTimeout(() => {
      window.location.href = "/shop/payment/success"
    }, 2000)
  }

  if (!mounted) return null

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-2xl border-2 animate-pulse">
          <CardContent className="pt-12 pb-12">
            <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
            <p className="text-muted-foreground">Redirecting to confirmation page...</p>
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
                UPI Payment
              </h1>
              <p className="text-muted-foreground">Scan QR code to pay</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Scan QR Code to Pay</CardTitle>
            <CardDescription>Use any UPI app to scan and pay</CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            {/* Amount Display */}
            <div className="bg-primary/10 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
              <p className="text-4xl font-bold text-primary flex items-center justify-center">
                <IndianRupee className="h-8 w-8" />
                {total.toFixed(2)}
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-8 rounded-lg shadow-inner mx-auto w-fit border-2 border-gray-200">
              <div className="w-48 h-48 mx-auto bg-white flex items-center justify-center border border-gray-300 rounded">
                <svg width="192" height="192" viewBox="0 0 192 192" className="w-full h-full">
                  {/* QR Code Pattern */}
                  <rect width="192" height="192" fill="white" />

                  {/* Corner squares */}
                  <rect x="0" y="0" width="56" height="56" fill="black" />
                  <rect x="8" y="8" width="40" height="40" fill="white" />
                  <rect x="16" y="16" width="24" height="24" fill="black" />

                  <rect x="136" y="0" width="56" height="56" fill="black" />
                  <rect x="144" y="8" width="40" height="40" fill="white" />
                  <rect x="152" y="16" width="24" height="24" fill="black" />

                  <rect x="0" y="136" width="56" height="56" fill="black" />
                  <rect x="8" y="144" width="40" height="40" fill="white" />
                  <rect x="16" y="152" width="24" height="24" fill="black" />

                  {/* Data pattern */}
                  <rect x="64" y="8" width="8" height="8" fill="black" />
                  <rect x="80" y="8" width="8" height="8" fill="black" />
                  <rect x="96" y="8" width="8" height="8" fill="black" />
                  <rect x="112" y="8" width="8" height="8" fill="black" />

                  <rect x="8" y="64" width="8" height="8" fill="black" />
                  <rect x="24" y="64" width="8" height="8" fill="black" />
                  <rect x="40" y="64" width="8" height="8" fill="black" />

                  <rect x="64" y="64" width="8" height="8" fill="black" />
                  <rect x="72" y="72" width="8" height="8" fill="black" />
                  <rect x="80" y="64" width="8" height="8" fill="black" />
                  <rect x="88" y="72" width="8" height="8" fill="black" />
                  <rect x="96" y="64" width="8" height="8" fill="black" />
                  <rect x="104" y="72" width="8" height="8" fill="black" />
                  <rect x="112" y="64" width="8" height="8" fill="black" />
                  <rect x="120" y="72" width="8" height="8" fill="black" />

                  <rect x="64" y="80" width="8" height="8" fill="black" />
                  <rect x="80" y="80" width="8" height="8" fill="black" />
                  <rect x="96" y="80" width="8" height="8" fill="black" />
                  <rect x="112" y="80" width="8" height="8" fill="black" />

                  <rect x="72" y="88" width="8" height="8" fill="black" />
                  <rect x="88" y="88" width="8" height="8" fill="black" />
                  <rect x="104" y="88" width="8" height="8" fill="black" />
                  <rect x="120" y="88" width="8" height="8" fill="black" />

                  <rect x="64" y="96" width="8" height="8" fill="black" />
                  <rect x="80" y="96" width="8" height="8" fill="black" />
                  <rect x="96" y="96" width="8" height="8" fill="black" />
                  <rect x="112" y="96" width="8" height="8" fill="black" />

                  <rect x="72" y="104" width="8" height="8" fill="black" />
                  <rect x="88" y="104" width="8" height="8" fill="black" />
                  <rect x="104" y="104" width="8" height="8" fill="black" />
                  <rect x="120" y="104" width="8" height="8" fill="black" />

                  <rect x="64" y="112" width="8" height="8" fill="black" />
                  <rect x="80" y="112" width="8" height="8" fill="black" />
                  <rect x="96" y="112" width="8" height="8" fill="black" />
                  <rect x="112" y="112" width="8" height="8" fill="black" />

                  <rect x="72" y="120" width="8" height="8" fill="black" />
                  <rect x="88" y="120" width="8" height="8" fill="black" />
                  <rect x="104" y="120" width="8" height="8" fill="black" />
                  <rect x="120" y="120" width="8" height="8" fill="black" />

                  {/* More data patterns */}
                  <rect x="144" y="64" width="8" height="8" fill="black" />
                  <rect x="152" y="72" width="8" height="8" fill="black" />
                  <rect x="160" y="64" width="8" height="8" fill="black" />
                  <rect x="168" y="72" width="8" height="8" fill="black" />
                  <rect x="176" y="64" width="8" height="8" fill="black" />
                  <rect x="184" y="72" width="8" height="8" fill="black" />

                  <rect x="144" y="80" width="8" height="8" fill="black" />
                  <rect x="160" y="80" width="8" height="8" fill="black" />
                  <rect x="176" y="80" width="8" height="8" fill="black" />

                  <rect x="152" y="88" width="8" height="8" fill="black" />
                  <rect x="168" y="88" width="8" height="8" fill="black" />
                  <rect x="184" y="88" width="8" height="8" fill="black" />

                  <rect x="144" y="96" width="8" height="8" fill="black" />
                  <rect x="160" y="96" width="8" height="8" fill="black" />
                  <rect x="176" y="96" width="8" height="8" fill="black" />

                  <rect x="152" y="104" width="8" height="8" fill="black" />
                  <rect x="168" y="104" width="8" height="8" fill="black" />
                  <rect x="184" y="104" width="8" height="8" fill="black" />

                  <rect x="144" y="112" width="8" height="8" fill="black" />
                  <rect x="160" y="112" width="8" height="8" fill="black" />
                  <rect x="176" y="112" width="8" height="8" fill="black" />

                  <rect x="152" y="120" width="8" height="8" fill="black" />
                  <rect x="168" y="120" width="8" height="8" fill="black" />
                  <rect x="184" y="120" width="8" height="8" fill="black" />

                  {/* Bottom patterns */}
                  <rect x="64" y="144" width="8" height="8" fill="black" />
                  <rect x="72" y="152" width="8" height="8" fill="black" />
                  <rect x="80" y="144" width="8" height="8" fill="black" />
                  <rect x="88" y="152" width="8" height="8" fill="black" />
                  <rect x="96" y="144" width="8" height="8" fill="black" />
                  <rect x="104" y="152" width="8" height="8" fill="black" />
                  <rect x="112" y="144" width="8" height="8" fill="black" />
                  <rect x="120" y="152" width="8" height="8" fill="black" />

                  <rect x="64" y="160" width="8" height="8" fill="black" />
                  <rect x="80" y="160" width="8" height="8" fill="black" />
                  <rect x="96" y="160" width="8" height="8" fill="black" />
                  <rect x="112" y="160" width="8" height="8" fill="black" />

                  <rect x="72" y="168" width="8" height="8" fill="black" />
                  <rect x="88" y="168" width="8" height="8" fill="black" />
                  <rect x="104" y="168" width="8" height="8" fill="black" />
                  <rect x="120" y="168" width="8" height="8" fill="black" />

                  <rect x="64" y="176" width="8" height="8" fill="black" />
                  <rect x="80" y="176" width="8" height="8" fill="black" />
                  <rect x="96" y="176" width="8" height="8" fill="black" />
                  <rect x="112" y="176" width="8" height="8" fill="black" />

                  <rect x="72" y="184" width="8" height="8" fill="black" />
                  <rect x="88" y="184" width="8" height="8" fill="black" />
                  <rect x="104" y="184" width="8" height="8" fill="black" />
                  <rect x="120" y="184" width="8" height="8" fill="black" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-mono">NEO MART UPI Payment</p>
            </div>

            {/* Instructions */}
            <div className="text-left space-y-2">
              <h3 className="font-semibold">How to pay:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open your UPI app (GPay, PhonePe, Paytm, etc.)</li>
                <li>Tap on "Scan QR Code" or "Pay"</li>
                <li>Scan the QR code above</li>
                <li>Enter the amount and complete payment</li>
              </ol>
            </div>

            {/* Demo Payment Button */}
            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                For demo purposes, click below to simulate payment completion
              </p>
              <Button
                onClick={handlePaymentComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Mark Payment as Complete (Demo)
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
