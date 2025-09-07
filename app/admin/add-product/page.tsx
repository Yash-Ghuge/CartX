"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Package, IndianRupee, Weight, AlertTriangle, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  buyPrice: number
  sellPrice: number
  weight: string
  quantity: number
  lowQuantityAlert: number
  profit: number
  profitPercentage: number
  dateAdded: string
}

export default function AddProduct() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    buyPrice: "",
    sellPrice: "",
    weight: "",
    quantity: "",
    lowQuantityAlert: "",
  })
  const [profit, setProfit] = useState({ amount: 0, percentage: 0 })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
    // Check authentication
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth || isAuth !== "true") {
      window.location.href = "/admin"
      return
    }
  }, [])

  useEffect(() => {
    // Calculate profit when buy/sell prices change
    const buyPrice = Number.parseFloat(formData.buyPrice) || 0
    const sellPrice = Number.parseFloat(formData.sellPrice) || 0
    const quantity = Number.parseInt(formData.quantity) || 0

    if (buyPrice > 0 && sellPrice > 0) {
      const profitPerUnit = sellPrice - buyPrice
      const totalProfit = profitPerUnit * quantity
      const profitPercentage = (profitPerUnit / buyPrice) * 100

      setProfit({
        amount: totalProfit,
        percentage: profitPercentage,
      })
    } else {
      setProfit({ amount: 0, percentage: 0 })
    }
  }, [formData.buyPrice, formData.sellPrice, formData.quantity])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !formData.id ||
      !formData.name ||
      !formData.buyPrice ||
      !formData.sellPrice ||
      !formData.weight ||
      !formData.quantity ||
      !formData.lowQuantityAlert
    ) {
      setError("Please fill in all fields")
      return
    }

    const existingProducts = JSON.parse(localStorage.getItem("products") || "[]")
    if (existingProducts.some((product: Product) => product.id === formData.id)) {
      setError("Product ID already exists. Please use a unique ID.")
      return
    }

    const buyPrice = Number.parseFloat(formData.buyPrice)
    const sellPrice = Number.parseFloat(formData.sellPrice)

    if (sellPrice <= buyPrice) {
      setError("Sell price must be greater than buy price")
      return
    }

    // Create product object
    const product: Product = {
      id: formData.id,
      name: formData.name,
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      weight: formData.weight,
      quantity: Number.parseInt(formData.quantity),
      lowQuantityAlert: Number.parseInt(formData.lowQuantityAlert),
      profit: profit.amount,
      profitPercentage: profit.percentage,
      dateAdded: new Date().toISOString(),
    }

    // Save to localStorage
    existingProducts.push(product)
    localStorage.setItem("products", JSON.stringify(existingProducts))

    setSuccess("Product added successfully!")

    // Reset form
    setTimeout(() => {
      setFormData({
        id: "",
        name: "",
        buyPrice: "",
        sellPrice: "",
        weight: "",
        quantity: "",
        lowQuantityAlert: "",
      })
      setSuccess("")
    }, 2000)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="group hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p className="text-muted-foreground">Add products to your NEO MART inventory</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-2xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Package className="h-6 w-6 mr-3 text-primary" />
              Product Information
            </CardTitle>
            <CardDescription>Fill in the details below to add a new product to your inventory</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product ID */}
                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID *</Label>
                  <Input
                    id="productId"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    placeholder="Enter unique product ID (e.g., NM001)"
                    className="font-mono transition-all duration-200 focus:scale-[1.02]"
                  />
                  <p className="text-xs text-muted-foreground">Enter a unique product identifier</p>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Samsung Galaxy S24"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>

                {/* Buy Price */}
                <div className="space-y-2">
                  <Label htmlFor="buyPrice">Buy Price (₹) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="buyPrice"
                      type="number"
                      placeholder="0.00"
                      value={formData.buyPrice}
                      onChange={(e) => handleInputChange("buyPrice", e.target.value)}
                      className="pl-10 transition-all duration-200 focus:scale-[1.02]"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Sell Price */}
                <div className="space-y-2">
                  <Label htmlFor="sellPrice">Sell Price (₹) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="sellPrice"
                      type="number"
                      placeholder="0.00"
                      value={formData.sellPrice}
                      onChange={(e) => handleInputChange("sellPrice", e.target.value)}
                      className="pl-10 transition-all duration-200 focus:scale-[1.02]"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight/Size *</Label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="weight"
                      placeholder="e.g., 200g, 1kg, Large"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      className="pl-10 transition-all duration-200 focus:scale-[1.02]"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Buy Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    className="transition-all duration-200 focus:scale-[1.02]"
                    min="0"
                  />
                </div>

                {/* Low Quantity Alert */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="lowQuantityAlert">Low Quantity Alert *</Label>
                  <div className="relative">
                    <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                    <Input
                      id="lowQuantityAlert"
                      type="number"
                      placeholder="Alert when quantity falls below this number"
                      value={formData.lowQuantityAlert}
                      onChange={(e) => handleInputChange("lowQuantityAlert", e.target.value)}
                      className="pl-10 transition-all duration-200 focus:scale-[1.02]"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">You'll be notified when stock falls below this level</p>
                </div>
              </div>

              {/* Profit Calculation */}
              {formData.buyPrice && formData.sellPrice && formData.quantity && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Profit Calculation
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center">
                          <IndianRupee className="h-5 w-5" />
                          {profit.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">Total Profit</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {profit.percentage.toFixed(1)}%
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">Profit Margin</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Messages */}
              {error && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                  <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Product to Inventory
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
