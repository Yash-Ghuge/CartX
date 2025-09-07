"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Package, Search, Trash2, AlertTriangle, IndianRupee, Edit, Weight } from "lucide-react"
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

export default function ViewProducts() {
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    buyPrice: "",
    sellPrice: "",
    weight: "",
    quantity: "",
    lowQuantityAlert: "",
  })
  const [editProfit, setEditProfit] = useState({ amount: 0, percentage: 0 })
  const [showLowStockSection, setShowLowStockSection] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check authentication
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth || isAuth !== "true") {
      window.location.href = "/admin"
      return
    }

    loadProducts()
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

  useEffect(() => {
    if (editingProduct) {
      const buyPrice = Number.parseFloat(editForm.buyPrice) || 0
      const sellPrice = Number.parseFloat(editForm.sellPrice) || 0
      const quantity = Number.parseInt(editForm.quantity) || 0

      if (buyPrice > 0 && sellPrice > 0) {
        const profitPerUnit = sellPrice - buyPrice
        const totalProfit = profitPerUnit * quantity
        const profitPercentage = (profitPerUnit / buyPrice) * 100

        setEditProfit({
          amount: totalProfit,
          percentage: profitPercentage,
        })
      } else {
        setEditProfit({ amount: 0, percentage: 0 })
      }
    }
  }, [editForm.buyPrice, editForm.sellPrice, editForm.quantity, editingProduct])

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]")
    setProducts(savedProducts)
  }

  const removeProduct = (productId: string) => {
    const updatedProducts = products.filter((product) => product.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }

  const startEdit = (product: Product) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name,
      buyPrice: product.buyPrice.toString(),
      sellPrice: product.sellPrice.toString(),
      weight: product.weight,
      quantity: product.quantity.toString(),
      lowQuantityAlert: product.lowQuantityAlert.toString(),
    })
  }

  const saveEdit = () => {
    if (!editingProduct) return

    const buyPrice = Number.parseFloat(editForm.buyPrice)
    const sellPrice = Number.parseFloat(editForm.sellPrice)

    if (sellPrice <= buyPrice) {
      alert("Sell price must be greater than buy price")
      return
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: editForm.name,
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      weight: editForm.weight,
      quantity: Number.parseInt(editForm.quantity),
      lowQuantityAlert: Number.parseInt(editForm.lowQuantityAlert),
      profit: editProfit.amount,
      profitPercentage: editProfit.percentage,
    }

    const updatedProducts = products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))

    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
    setEditingProduct(null)
  }

  const lowStockProducts = products.filter((product) => product.quantity <= product.lowQuantityAlert)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="group hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Product Inventory</h1>
              <p className="text-muted-foreground">Manage your NEO MART products</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="mb-6 space-y-3">
            <Alert className="border-red-500/50 bg-red-50 dark:bg-red-950/20 animate-pulse">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>🚨 URGENT INVENTORY ALERT: {lowStockProducts.length} product(s)</strong> are running critically
                low on stock and need immediate restocking!
              </AlertDescription>
            </Alert>

            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-red-800 dark:text-red-200 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Low Quantity Products ({lowStockProducts.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLowStockSection(!showLowStockSection)}
                  className="text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/20"
                >
                  {showLowStockSection ? "Hide Details" : "View All"}
                </Button>
              </div>

              {showLowStockSection && (
                <div className="space-y-3">
                  <div className="text-sm text-red-700 dark:text-red-300 mb-3">
                    Products that have fallen below their alert threshold and need immediate attention:
                  </div>

                  <div className="grid gap-3">
                    {lowStockProducts.map((product) => (
                      <Card key={product.id} className="border-red-300 dark:border-red-700 bg-white dark:bg-red-900/10">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-red-800 dark:text-red-200">{product.name}</h4>
                              <p className="text-xs text-red-600 dark:text-red-400 font-mono">ID: {product.id}</p>
                            </div>
                            <div className="flex gap-2">
                              {product.quantity === 0 ? (
                                <Badge variant="destructive" className="bg-red-600 text-white">
                                  OUT OF STOCK
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="animate-pulse">
                                  CRITICAL: {product.quantity} left
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-red-600 dark:text-red-400">Current Stock:</span>
                              <p className="font-bold text-red-800 dark:text-red-200">{product.quantity} units</p>
                            </div>
                            <div>
                              <span className="text-red-600 dark:text-red-400">Alert Level:</span>
                              <p className="font-bold text-red-800 dark:text-red-200">
                                {product.lowQuantityAlert} units
                              </p>
                            </div>
                            <div>
                              <span className="text-red-600 dark:text-red-400">Sell Price:</span>
                              <p className="font-bold text-red-800 dark:text-red-200 flex items-center">
                                <IndianRupee className="h-3 w-3" />
                                {product.sellPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEdit(product)}
                                  className="flex-1 text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/20"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Restock/Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                {/* Same edit dialog content as before */}
                                <DialogHeader>
                                  <DialogTitle>Edit Product - Low Stock Alert</DialogTitle>
                                  <DialogDescription>
                                    This product is running low. Update stock levels and other details below.
                                  </DialogDescription>
                                </DialogHeader>

                                {editingProduct && (
                                  <div className="space-y-4">
                                    {/* Same form fields as in the main edit dialog */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="editName">Product Name</Label>
                                        <Input
                                          id="editName"
                                          value={editForm.name}
                                          onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="editWeight">Weight/Size</Label>
                                        <div className="relative">
                                          <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input
                                            id="editWeight"
                                            value={editForm.weight}
                                            onChange={(e) =>
                                              setEditForm((prev) => ({ ...prev, weight: e.target.value }))
                                            }
                                            className="pl-10"
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="editBuyPrice">Buy Price (₹)</Label>
                                        <div className="relative">
                                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input
                                            id="editBuyPrice"
                                            type="number"
                                            value={editForm.buyPrice}
                                            onChange={(e) =>
                                              setEditForm((prev) => ({ ...prev, buyPrice: e.target.value }))
                                            }
                                            className="pl-10"
                                            step="0.01"
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="editSellPrice">Sell Price (₹)</Label>
                                        <div className="relative">
                                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input
                                            id="editSellPrice"
                                            type="number"
                                            value={editForm.sellPrice}
                                            onChange={(e) =>
                                              setEditForm((prev) => ({ ...prev, sellPrice: e.target.value }))
                                            }
                                            className="pl-10"
                                            step="0.01"
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="editQuantity"
                                          className="text-red-700 dark:text-red-300 font-semibold"
                                        >
                                          Quantity (Currently Low!)
                                        </Label>
                                        <Input
                                          id="editQuantity"
                                          type="number"
                                          value={editForm.quantity}
                                          onChange={(e) =>
                                            setEditForm((prev) => ({ ...prev, quantity: e.target.value }))
                                          }
                                          className="border-red-300 focus:border-red-500"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="editLowAlert">Low Quantity Alert</Label>
                                        <div className="relative">
                                          <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                                          <Input
                                            id="editLowAlert"
                                            type="number"
                                            value={editForm.lowQuantityAlert}
                                            onChange={(e) =>
                                              setEditForm((prev) => ({ ...prev, lowQuantityAlert: e.target.value }))
                                            }
                                            className="pl-10"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Profit Preview */}
                                    {editForm.buyPrice && editForm.sellPrice && editForm.quantity && (
                                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                                        <CardContent className="pt-4">
                                          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                            Updated Profit
                                          </h4>
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="text-center">
                                              <p className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center justify-center">
                                                <IndianRupee className="h-4 w-4" />
                                                {editProfit.amount.toFixed(2)}
                                              </p>
                                              <p className="text-green-700 dark:text-green-300">Total Profit</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                {editProfit.percentage.toFixed(1)}%
                                              </p>
                                              <p className="text-green-700 dark:text-green-300">Profit Margin</p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    <div className="flex gap-2 pt-4">
                                      <Button onClick={saveEdit} className="flex-1">
                                        Save Changes
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => setEditingProduct(null)}
                                        className="flex-1"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to remove "${product.name}" from inventory? This action cannot be undone.`,
                                  )
                                ) {
                                  removeProduct(product.id)
                                }
                              }}
                              className="flex-1"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Package className="h-4 w-4 mr-2" />
              {products.length} Total Products
            </Badge>
            {lowStockProducts.length > 0 && (
              <Badge variant="destructive" className="px-4 py-2 animate-pulse">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {lowStockProducts.length} Low Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {products.length === 0 ? "No Products Added" : "No Products Found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {products.length === 0
                  ? "Start by adding your first product to the inventory"
                  : "Try adjusting your search terms"}
              </p>
              {products.length === 0 && (
                <Link href="/admin/add-product">
                  <Button className="bg-primary hover:bg-primary/90">Add Your First Product</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`transition-all duration-300 hover:shadow-xl border-2 ${
                  product.quantity <= product.lowQuantityAlert
                    ? "border-red-500 bg-red-50/50 dark:bg-red-950/20 shadow-red-200 animate-pulse ring-2 ring-red-300 dark:ring-red-700"
                    : "hover:border-primary/50"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">ID: {product.id}</CardDescription>
                    </div>
                    {product.quantity <= product.lowQuantityAlert && (
                      <div className="flex flex-col gap-1">
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          CRITICAL LOW!
                        </Badge>
                        {product.quantity === 0 && (
                          <Badge variant="destructive" className="text-xs bg-red-600">
                            OUT OF STOCK
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pricing Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Buy Price</p>
                      <p className="font-semibold flex items-center">
                        <IndianRupee className="h-3 w-3" />
                        {product.buyPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sell Price</p>
                      <p className="font-semibold flex items-center">
                        <IndianRupee className="h-3 w-3" />
                        {product.sellPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Stock</p>
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-semibold ${
                            product.quantity <= product.lowQuantityAlert
                              ? product.quantity === 0
                                ? "text-red-700 font-bold"
                                : "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {product.quantity} units
                          {product.quantity <= product.lowQuantityAlert && " ⚠️"}
                        </p>
                        {product.quantity <= product.lowQuantityAlert && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            {product.quantity === 0 ? "EMPTY!" : "LOW!"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weight/Size</p>
                      <p className="font-semibold">{product.weight}</p>
                    </div>
                  </div>

                  {/* Profit Info */}
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700 dark:text-green-300">Total Profit</span>
                      <span className="font-bold text-green-600 dark:text-green-400 flex items-center">
                        <IndianRupee className="h-3 w-3" />
                        {product.profit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-green-700 dark:text-green-300">Margin</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {product.profitPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(product)}
                          className="flex-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>Update the product information below</DialogDescription>
                        </DialogHeader>

                        {editingProduct && (
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="editName">Product Name</Label>
                                <Input
                                  id="editName"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editWeight">Weight/Size</Label>
                                <div className="relative">
                                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="editWeight"
                                    value={editForm.weight}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, weight: e.target.value }))}
                                    className="pl-10"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editBuyPrice">Buy Price (₹)</Label>
                                <div className="relative">
                                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="editBuyPrice"
                                    type="number"
                                    value={editForm.buyPrice}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, buyPrice: e.target.value }))}
                                    className="pl-10"
                                    step="0.01"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editSellPrice">Sell Price (₹)</Label>
                                <div className="relative">
                                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="editSellPrice"
                                    type="number"
                                    value={editForm.sellPrice}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, sellPrice: e.target.value }))}
                                    className="pl-10"
                                    step="0.01"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editQuantity">Quantity</Label>
                                <Input
                                  id="editQuantity"
                                  type="number"
                                  value={editForm.quantity}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, quantity: e.target.value }))}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editLowAlert">Low Quantity Alert</Label>
                                <div className="relative">
                                  <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                                  <Input
                                    id="editLowAlert"
                                    type="number"
                                    value={editForm.lowQuantityAlert}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({ ...prev, lowQuantityAlert: e.target.value }))
                                    }
                                    className="pl-10"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Profit Preview */}
                            {editForm.buyPrice && editForm.sellPrice && editForm.quantity && (
                              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                                <CardContent className="pt-4">
                                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                    Updated Profit
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-center">
                                      <p className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center justify-center">
                                        <IndianRupee className="h-4 w-4" />
                                        {editProfit.amount.toFixed(2)}
                                      </p>
                                      <p className="text-green-700 dark:text-green-300">Total Profit</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {editProfit.percentage.toFixed(1)}%
                                      </p>
                                      <p className="text-green-700 dark:text-green-300">Profit Margin</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            <div className="flex gap-2 pt-4">
                              <Button onClick={saveEdit} className="flex-1">
                                Save Changes
                              </Button>
                              <Button variant="outline" onClick={() => setEditingProduct(null)} className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="flex-1 hover:scale-105 transition-transform duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  {/* Date Added */}
                  <p className="text-xs text-muted-foreground text-center">
                    Added: {new Date(product.dateAdded).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Product Button */}
        <div className="fixed bottom-6 right-6">
          <Link href="/admin/add-product">
            <Button
              size="lg"
              className="rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
            >
              <Package className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
