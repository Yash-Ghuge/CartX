"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Package, ShoppingCart, IndianRupee, Plus, Minus, Trash2, CreditCard } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

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

interface CartItem extends Product {
  cartQuantity: number
}

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    setMounted(true)

    // Get customer name
    const name = localStorage.getItem("customerName")
    if (!name) {
      window.location.href = "/shop"
      return
    }
    setCustomerName(name)

    // Load products
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]")
    const availableProducts = savedProducts.filter((product: Product) => product.quantity > 0)
    setProducts(availableProducts)
  }, [])

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [products, searchTerm])

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      if (existingItem.cartQuantity < product.quantity) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item)))
      }
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }])
    }
  }

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (product && newQuantity <= product.quantity) {
      setCart(cart.map((item) => (item.id === productId ? { ...item, cartQuantity: newQuantity } : item)))
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.sellPrice * item.cartQuantity, 0)
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.sellPrice * item.cartQuantity, 0)
  }

  const getTaxAmount = () => {
    return getSubtotal() * 0.05 // 5% tax
  }

  const getFinalTotal = () => {
    return getSubtotal() + getTaxAmount()
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0)
  }

  const handleProceedToPayment = () => {
    if (cart.length === 0) return

    // Store cart data for payment
    localStorage.setItem("currentCart", JSON.stringify(cart))
    localStorage.setItem("cartTotal", getFinalTotal().toString())
    localStorage.setItem("cartSubtotal", getSubtotal().toString())
    localStorage.setItem("cartTax", getTaxAmount().toString())

    // Redirect to payment
    window.location.href = "/shop/payment"
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/shop">
                <Button variant="ghost" className="group hover:bg-primary/10">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  NEO MART Shopping
                </h1>
                <p className="text-muted-foreground">Hello, {customerName}!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Badge variant="secondary" className="px-3 py-2">
                <ShoppingCart className="mr-1 h-3 w-3" />
                {getTotalItems()} items
              </Badge>
              <Badge variant="default" className="px-3 py-2">
                <IndianRupee className="mr-1 h-3 w-3" />
                {getFinalTotal().toFixed(2)}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {products.length === 0 ? "No Products Available" : "No Products Found"}
                  </h3>
                  <p className="text-muted-foreground">
                    {products.length === 0
                      ? "Please check back later for new products"
                      : "Try adjusting your search terms"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const cartItem = cart.find((item) => item.id === product.id)
                  const inCart = !!cartItem
                  const canAddMore = !cartItem || cartItem.cartQuantity < product.quantity

                  return (
                    <Card
                      key={product.id}
                      className="transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/50"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                            <CardDescription className="font-mono text-xs">ID: {product.id}</CardDescription>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {product.weight}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary flex items-center">
                            <IndianRupee className="h-5 w-5" />
                            {product.sellPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">{product.quantity} in stock</span>
                        </div>

                        {inCart ? (
                          <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(product.id, cartItem!.cartQuantity - 1)}
                              className="h-10 w-10 p-0 border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <span className="font-bold text-xl px-6 min-w-[60px] text-center">
                              {cartItem!.cartQuantity}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(product.id, cartItem!.cartQuantity + 1)}
                              disabled={!canAddMore}
                              className="h-10 w-10 p-0 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => addToCart(product)}
                            className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                            disabled={product.quantity === 0}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Your Cart
                </CardTitle>
                <CardDescription>{getTotalItems()} item(s) selected</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground mt-2">Add some products to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <IndianRupee className="h-3 w-3" />
                              {item.sellPrice.toFixed(2)} × {item.cartQuantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm flex items-center">
                              <IndianRupee className="h-3 w-3" />
                              {(item.sellPrice * item.cartQuantity).toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {getSubtotal().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Tax (5%):</span>
                        <span className="flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {getTaxAmount().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span className="flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {getFinalTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleProceedToPayment}
                      className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        Proceed to Payment
                      </span>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
