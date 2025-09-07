"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Smartphone, Banknote, IndianRupee } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  sellPrice: number
  cartQuantity: number
}

export default function PaymentPage() {
  const [mounted, setMounted] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setMounted(true)

    // Get customer data
    const name = localStorage.getItem("customerName")
    const cartData = localStorage.getItem("currentCart")
    const cartTotal = localStorage.getItem("cartTotal")

    if (!name || !cartData || !cartTotal) {
      window.location.href = "/shop"
      return
    }

    setCustomerName(name)
    setCart(JSON.parse(cartData))
    setTotal(Number.parseFloat(cartTotal))
  }, [])

  const handlePaymentMethod = (method: string) => {
    localStorage.setItem("paymentMethod", method)

    switch (method) {
      case "upi":
        window.location.href = "/shop/payment/upi"
        break
      case "card":
        window.location.href = "/shop/payment/card"
        break
      case "cash":
        window.location.href = "/shop/payment/success"
        break
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/shop/cart">
              <Button variant="ghost" className="group hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Cart
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Payment Options
              </h1>
              <p className="text-muted-foreground">Choose your preferred payment method</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Order Summary */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm">
                    {item.name} × {item.cartQuantity}
                  </span>
                  <span className="font-semibold flex items-center">
                    <IndianRupee className="h-3 w-3" />
                    {(item.sellPrice * item.cartQuantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-primary flex items-center">
                  <IndianRupee className="h-5 w-5" />
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* UPI Payment */}
          <Card className="group cursor-pointer border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div onClick={() => handlePaymentMethod("upi")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors duration-300">
                  <Smartphone className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl font-bold">UPI Payment</CardTitle>
                <CardDescription>Pay using UPI apps like GPay, PhonePe, Paytm</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Quick and secure payment via QR code</p>
                <Button className="w-full bg-primary hover:bg-primary/90">Pay with UPI</Button>
              </CardContent>
            </div>
          </Card>

          {/* Card Payment */}
          <Card className="group cursor-pointer border-2 hover:border-accent/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div onClick={() => handlePaymentMethod("card")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit group-hover:bg-accent/20 transition-colors duration-300">
                  <CreditCard className="h-8 w-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl font-bold">Card Payment</CardTitle>
                <CardDescription>Pay using Credit or Debit Card</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Secure payment with your bank card</p>
                <Button className="w-full bg-accent hover:bg-accent/90">Pay with Card</Button>
              </CardContent>
            </div>
          </Card>

          {/* Cash Payment */}
          <Card className="group cursor-pointer border-2 hover:border-green-500/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div onClick={() => handlePaymentMethod("cash")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors duration-300">
                  <Banknote className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl font-bold">Cash Payment</CardTitle>
                <CardDescription>Pay with cash at the store</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Pay when you collect your order</p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Pay with Cash</Button>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              🔒 Your payment information is secure and encrypted. NEO MART uses industry-standard security measures to
              protect your data.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
