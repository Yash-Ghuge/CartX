"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Home, Sparkles, Gift, Star, IndianRupee } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  sellPrice: number
  cartQuantity: number
}

export default function PaymentSuccess() {
  const [mounted, setMounted] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Get order data
    const name = localStorage.getItem("customerName")
    const cartData = localStorage.getItem("currentCart")
    const cartTotal = localStorage.getItem("cartTotal")
    const method = localStorage.getItem("paymentMethod")

    if (!name || !cartData || !cartTotal) {
      window.location.href = "/shop"
      return
    }

    setCustomerName(name)
    const cartItems = JSON.parse(cartData)
    setCart(cartItems)
    setTotal(Number.parseFloat(cartTotal))
    setPaymentMethod(method || "cash")

    const existingProducts = JSON.parse(localStorage.getItem("products") || "[]")
    const updatedProducts = existingProducts.map((product: any) => {
      const purchasedItem = cartItems.find((item: CartItem) => item.id === product.id)
      if (purchasedItem) {
        return {
          ...product,
          quantity: Math.max(0, product.quantity - purchasedItem.cartQuantity), // Fixed: use 'quantity' instead of 'buyQuantity'
        }
      }
      return product
    })
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Generate order number
    const orderNum = `NM${Date.now().toString().slice(-8)}`
    setOrderNumber(orderNum)

    const orderData = {
      id: orderNum,
      customerName: name,
      items: cartItems,
      total: Number.parseFloat(cartTotal),
      paymentMethod: method || "cash",
      date: new Date().toISOString(),
      timestamp: Date.now(),
    }

    // Save to orders history
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    existingOrders.push(orderData)
    localStorage.setItem("orders", JSON.stringify(existingOrders))

    // Show confetti animation
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)

    // Clear cart data
    localStorage.removeItem("currentCart")
    localStorage.removeItem("cartTotal")
    localStorage.removeItem("paymentMethod")
  }, [])

  const generatePDF = async () => {
    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import("jspdf")

      const doc = new jsPDF()

      // Set font
      doc.setFont("helvetica")

      // Header
      doc.setFontSize(24)
      doc.setTextColor(22, 78, 99) // NEO MART blue
      doc.text("NEO MART", 105, 30, { align: "center" })

      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text("Powered by CartX", 105, 40, { align: "center" })

      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text("PURCHASE RECEIPT", 105, 55, { align: "center" })

      // Order Info Box
      doc.setDrawColor(22, 78, 99)
      doc.setLineWidth(0.5)
      doc.rect(20, 70, 170, 40)

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`Order Number: ${orderNumber}`, 25, 80)
      doc.text(`Customer: ${customerName}`, 25, 90)
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 25, 100)
      doc.text(`Time: ${new Date().toLocaleTimeString()}`, 120, 80)
      doc.text(`Payment Method: ${paymentMethod.toUpperCase()}`, 120, 90)
      doc.text(`Status: CONFIRMED`, 120, 100)

      // Items Header
      doc.setFontSize(14)
      doc.setTextColor(22, 78, 99)
      doc.text("Items Purchased:", 20, 130)

      // Items Table Header
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text("Item", 25, 145)
      doc.text("Qty", 120, 145)
      doc.text("Price", 140, 145)
      doc.text("Total", 165, 145)

      // Draw line under header
      doc.line(20, 148, 190, 148)

      // Items
      let yPos = 160
      cart.forEach((item) => {
        doc.text(item.name, 25, yPos)
        doc.text(item.cartQuantity.toString(), 120, yPos)
        doc.text(`₹${item.sellPrice.toFixed(2)}`, 140, yPos)
        doc.text(`₹${(item.sellPrice * item.cartQuantity).toFixed(2)}`, 165, yPos)
        yPos += 10
      })

      // Total line
      doc.setLineWidth(1)
      doc.line(20, yPos + 5, 190, yPos + 5)

      // Total Amount
      doc.setFontSize(14)
      doc.setTextColor(22, 78, 99)
      doc.text(`Total Amount: ₹${total.toFixed(2)}`, 165, yPos + 20, { align: "right" })

      // Footer
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text("Thank you for shopping with NEO MART!", 105, yPos + 40, { align: "center" })
      doc.text("Visit us at Vimannagar, Pune | Open 8 AM to 10 PM", 105, yPos + 50, { align: "center" })
      doc.text("For support, contact us at support@neomart.com", 105, yPos + 60, { align: "center" })

      // Save PDF
      doc.save(`NEO_MART_Receipt_${orderNumber}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      // Fallback to HTML download if PDF fails
      const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>NEO MART Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); }
            .receipt { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #164e63, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
            .tagline { color: #666; font-size: 14px; }
            .order-info { background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .items { margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #164e63; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="logo">NEO MART</div>
              <div class="tagline">Powered by CartX</div>
              <div style="margin-top: 15px; color: #164e63; font-weight: bold;">PURCHASE RECEIPT</div>
            </div>
            
            <div class="order-info">
              <div><strong>Order Number:</strong> ${orderNumber}</div>
              <div><strong>Customer:</strong> ${customerName}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
              <div><strong>Time:</strong> ${new Date().toLocaleTimeString()}</div>
              <div><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</div>
            </div>
            
            <div class="items">
              <h3>Items Purchased:</h3>
              ${cart
                .map(
                  (item) => `
                <div class="item">
                  <span>${item.name} × ${item.cartQuantity}</span>
                  <span>₹${(item.sellPrice * item.cartQuantity).toFixed(2)}</span>
                </div>
              `,
                )
                .join("")}
            </div>
            
            <div class="total">
              Total Amount: ₹${total.toFixed(2)}
            </div>
            
            <div class="footer">
              <p>Thank you for shopping with NEO MART!</p>
              <p>Visit us at Vimannagar, Pune | Open 8 AM to 10 PM</p>
              <p>For support, contact us at support@neomart.com</p>
            </div>
          </div>
        </body>
        </html>
      `

      const blob = new Blob([receiptContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `NEO_MART_Receipt_${orderNumber}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {i % 4 === 0 && <Sparkles className="h-4 w-4 text-yellow-500" />}
              {i % 4 === 1 && <Star className="h-4 w-4 text-blue-500" />}
              {i % 4 === 2 && <Gift className="h-4 w-4 text-green-500" />}
              {i % 4 === 3 && <CheckCircle className="h-4 w-4 text-purple-500" />}
            </div>
          ))}
        </div>
      )}

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-pulse">
          <Sparkles className="h-8 w-8 text-primary/30" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce">
          <Star className="h-6 w-6 text-accent/40" />
        </div>
        <div className="absolute bottom-40 left-20 animate-pulse">
          <Gift className="h-7 w-7 text-green-500/30" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full w-fit animate-bounce">
            <CheckCircle className="h-16 w-16 text-green-600 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent animate-pulse mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground dark:text-gray-300 animate-fade-in">
            Thank you for shopping with NEO MART, {customerName}!
          </p>
        </div>

        {/* Order Details */}
        <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800 mb-8 animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">Order Confirmation</CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Your order has been successfully processed
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-400">Order Number:</span>
                  <span className="font-mono font-bold dark:text-gray-200">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-400">Customer:</span>
                  <span className="font-semibold dark:text-gray-200">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-400">Payment Method:</span>
                  <span className="font-semibold capitalize dark:text-gray-200">{paymentMethod}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-400">Date:</span>
                  <span className="font-semibold dark:text-gray-200">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-400">Time:</span>
                  <span className="font-semibold dark:text-gray-200">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-400">Status:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Confirmed</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 dark:text-gray-200">Items Purchased:</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-muted/50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <span className="font-medium dark:text-gray-200">
                      {item.name} × {item.cartQuantity}
                    </span>
                    <span className="font-bold flex items-center dark:text-gray-200">
                      <IndianRupee className="h-4 w-4" />
                      {(item.sellPrice * item.cartQuantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span className="dark:text-gray-200">Total Paid:</span>
                  <span className="text-green-600 dark:text-green-400 flex items-center">
                    <IndianRupee className="h-6 w-6" />
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            onClick={generatePDF}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
          >
            <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Download Receipt (PDF)
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="font-semibold py-3 px-8 transition-all duration-300 hover:scale-105 hover:shadow-xl group bg-transparent"
            >
              <Home className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Thank You Message */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-bold mb-2 dark:text-gray-200">Thank You for Choosing NEO MART!</h3>
            <p className="text-muted-foreground dark:text-gray-300">
              We hope you enjoy your purchase. Visit us again at Vimannagar, Pune!
            </p>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">
              Store Hours: 8 AM to 10 PM | 7 Days a Week
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
