"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Package, TrendingUp, LogOut, Plus, Eye, IndianRupee, Clock, User, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState("")
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [salesData, setSalesData] = useState({
    today: { revenue: 0, profit: 0, orders: 0 },
    monthly: { revenue: 0, profit: 0, orders: 0 },
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    setMounted(true)
    // Check authentication
    const isAuth = localStorage.getItem("adminAuth")
    const user = localStorage.getItem("adminUser")

    if (!isAuth || isAuth !== "true") {
      window.location.href = "/admin"
      return
    }

    if (user) {
      setAdminUser(user)
    }

    loadSalesData()
    loadRecentOrders()
  }, [])

  const loadSalesData = () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const today = new Date().toDateString()
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    let todayRevenue = 0,
      todayProfit = 0,
      todayOrders = 0
    let monthlyRevenue = 0,
      monthlyProfit = 0,
      monthlyOrders = 0

    orders.forEach((order: any) => {
      const orderDate = new Date(order.date || order.timestamp)
      const orderTotal = order.total || 0
      const orderProfit = orderTotal * 0.3 // Assuming 30% profit margin

      // Today's data
      if (orderDate.toDateString() === today) {
        todayRevenue += orderTotal
        todayProfit += orderProfit
        todayOrders += 1
      }

      // Monthly data
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        monthlyRevenue += orderTotal
        monthlyProfit += orderProfit
        monthlyOrders += 1
      }
    })

    setSalesData({
      today: { revenue: todayRevenue, profit: todayProfit, orders: todayOrders },
      monthly: { revenue: monthlyRevenue, profit: monthlyProfit, orders: monthlyOrders },
    })
  }

  const loadRecentOrders = () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const sortedOrders = orders
      .sort((a: any, b: any) => {
        const timeA = new Date(a.date || a.timestamp).getTime()
        const timeB = new Date(b.date || b.timestamp).getTime()
        return timeB - timeA
      })
      .slice(0, 10)

    setRecentOrders(sortedOrders)
  }

  const handleResetAllValues = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      localStorage.removeItem("products")
      localStorage.removeItem("orders")
      setSalesData({
        today: { revenue: 0, profit: 0, orders: 0 },
        monthly: { revenue: 0, profit: 0, orders: 0 },
      })
      setRecentOrders([])
      alert("All data has been reset successfully!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")
    window.location.href = "/admin"
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">NEO MART Admin</h1>
              <p className="text-muted-foreground dark:text-gray-300">Welcome back, {adminUser}</p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleResetAllValues}
                className="hover:bg-orange-500 hover:text-white transition-colors duration-200 bg-transparent text-orange-600 border-orange-300 text-xs px-3 py-1 h-8"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset All
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Recent Orders
          </Button>
        </div>

        {/* Conditional Rendering based on active tab */}
        {activeTab === "overview" && (
          <>
            {/* Sales Overview */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Today's Sales */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl dark:text-gray-200">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Today's Sales
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Sales performance for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground dark:text-gray-400">Revenue</span>
                    <span className="text-2xl font-bold flex items-center dark:text-gray-200">
                      <IndianRupee className="h-5 w-5" />
                      {salesData.today.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground dark:text-gray-400">Profit</span>
                    <span className="text-xl font-semibold text-green-600 flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {salesData.today.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground dark:text-gray-400">Orders</span>
                    <span className="text-lg font-medium dark:text-gray-200">{salesData.today.orders}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Sales */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl dark:text-gray-200">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Monthly Sales
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Sales performance for this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground dark:text-gray-400">Revenue</span>
                    <span className="text-2xl font-bold flex items-center dark:text-gray-200">
                      <IndianRupee className="h-5 w-5" />
                      {salesData.monthly.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground dark:text-gray-400">Profit</span>
                    <span className="text-xl font-semibold text-blue-600 flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {salesData.monthly.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground dark:text-gray-400">Orders</span>
                    <span className="text-lg font-medium dark:text-gray-200">{salesData.monthly.orders}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Actions */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Add Product */}
              <Card className="group cursor-pointer border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <Link href="/admin/add-product">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors duration-300">
                      <Plus className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-2xl font-bold dark:text-gray-200">Add Product</CardTitle>
                    <CardDescription className="text-lg dark:text-gray-400">
                      Add new products to your inventory
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground dark:text-gray-400">
                      Manage product details, pricing, and stock levels
                    </p>
                  </CardContent>
                </Link>
              </Card>

              {/* View Products */}
              <Card className="group cursor-pointer border-2 hover:border-accent/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <Link href="/admin/view-products">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit group-hover:bg-accent/20 transition-colors duration-300">
                      <Eye className="h-8 w-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-2xl font-bold dark:text-gray-200">View Products</CardTitle>
                    <CardDescription className="text-lg dark:text-gray-400">
                      Manage your product inventory
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground dark:text-gray-400">
                      View, edit, and remove products from your store
                    </p>
                  </CardContent>
                </Link>
              </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="text-center p-4">
                <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold dark:text-gray-200">
                  {JSON.parse(localStorage.getItem("products") || "[]").length}
                </p>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Total Products</p>
              </Card>

              <Card className="text-center p-4">
                <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold dark:text-gray-200">{salesData.today.orders}</p>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Today's Orders</p>
              </Card>
            </div>
          </>
        )}

        {/* Recent Orders tab content */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                  <ShoppingCart className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Latest customer orders and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground dark:text-gray-400">No orders yet</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-500 mt-2">
                      Orders will appear here after customers make purchases
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order: any, index: number) => (
                      <Card key={order.id || index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium dark:text-gray-200">{order.customerName}</span>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                #{order.id}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-lg font-bold dark:text-gray-200">
                                <IndianRupee className="h-4 w-4" />
                                {order.total?.toFixed(2) || "0.00"}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
                                <Clock className="h-3 w-3" />
                                {new Date(order.date || order.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground dark:text-gray-400">Items purchased:</p>
                            <div className="grid gap-2">
                              {order.items?.map((item: any, itemIndex: number) => (
                                <div
                                  key={itemIndex}
                                  className="flex justify-between items-center bg-muted/50 dark:bg-gray-800/50 p-2 rounded"
                                >
                                  <span className="text-sm dark:text-gray-200">{item.name}</span>
                                  <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                                    <span>Qty: {item.cartQuantity || item.quantity}</span>
                                    <span className="flex items-center">
                                      <IndianRupee className="h-3 w-3" />
                                      {((item.sellPrice || item.price) * (item.cartQuantity || item.quantity)).toFixed(
                                        2,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between items-center text-sm">
                              <span className="dark:text-gray-400">Payment Method:</span>
                              <span className="capitalize font-medium dark:text-gray-200">
                                {order.paymentMethod || "N/A"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
