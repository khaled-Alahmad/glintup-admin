"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Calendar, Check, Filter, MoreHorizontal, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const payments = [
  {
    id: "1",
    customerName: "سارة أحمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون الأميرة",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-03",
    amount: "450 ر.س",
    method: "بطاقة ائتمان",
    status: "مكتمل",
    bookingId: "B-1234",
    commission: "45 ر.س",
  },
  {
    id: "2",
    customerName: "نورة محمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-03",
    amount: "350 ر.س",
    method: "Apple Pay",
    status: "مكتمل",
    bookingId: "B-1235",
    commission: "35 ر.س",
  },
  {
    id: "3",
    customerName: "عبير علي",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون جلام",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-03",
    amount: "800 ر.س",
    method: "بطاقة ائتمان",
    status: "معلق",
    bookingId: "B-1236",
    commission: "80 ر.س",
  },
  {
    id: "4",
    customerName: "هند خالد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون مس بيوتي",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-03",
    amount: "200 ر.س",
    method: "محفظة إلكترونية",
    status: "مسترجع",
    bookingId: "B-1237",
    commission: "0 ر.س",
  },
  {
    id: "5",
    customerName: "ليلى عبدالله",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون روز",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-03",
    amount: "300 ر.س",
    method: "بطاقة ائتمان",
    status: "مكتمل",
    bookingId: "B-1238",
    commission: "30 ر.س",
  },
]

const refunds = [
  {
    id: "1",
    customerName: "هند خالد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون مس بيوتي",
    salonLogo: "/placeholder.svg?height=32&width=32",
    requestDate: "2024-04-02",
    processDate: "2024-04-03",
    amount: "200 ر.س",
    reason: "إلغاء الحجز من قبل الصالون",
    status: "مكتمل",
    bookingId: "B-1237",
  },
  {
    id: "2",
    customerName: "محمد العلي",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    requestDate: "2024-04-03",
    processDate: "",
    amount: "150 ر.س",
    reason: "عدم رضا عن الخدمة",
    status: "قيد المراجعة",
    bookingId: "B-1240",
  },
]

export default function PaymentsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    let matchesDate = true
    if (dateFilter) {
      const paymentDate = new Date(payment.date)
      const filterDate = new Date(dateFilter)
      matchesDate =
        paymentDate.getDate() === filterDate.getDate() &&
        paymentDate.getMonth() === filterDate.getMonth() &&
        paymentDate.getFullYear() === filterDate.getFullYear()
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مكتمل":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            مكتمل
          </Badge>
        )
      case "معلق":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            معلق
          </Badge>
        )
      case "مسترجع":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            مسترجع
          </Badge>
        )
      case "قيد المراجعة":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            قيد المراجعة
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مكتمل":
        return <Check className="h-4 w-4 text-green-500" />
      case "معلق":
        return <ArrowUpDown className="h-4 w-4 text-amber-500" />
      case "مسترجع":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المدفوعات والاسترجاع</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/payments/add">إضافة عملية دفع</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/payments/refund">إضافة طلب استرجاع</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22,458 ر.س</div>
            <p className="text-xs text-muted-foreground mt-1">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العمولات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,245 ر.س</div>
            <p className="text-xs text-muted-foreground mt-1">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">عمليات الاسترجاع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450 ر.س</div>
            <p className="text-xs text-muted-foreground mt-1">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">طلبات استرجاع معلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">بحاجة للمراجعة</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="payments">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>المعاملات المالية</CardTitle>
                <CardDescription>إدارة المدفوعات وعمليات الاسترجاع</CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value="payments">المدفوعات</TabsTrigger>
                <TabsTrigger value="refunds">طلبات الاسترجاع</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payments">
            <TabsContent value="payments" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="بحث عن المدفوعات..."
                    className="pr-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <DatePicker selected={dateFilter} onSelect={setDateFilter} placeholder="تاريخ الدفع" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="جميع الحالات" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="مكتمل">مكتمل</SelectItem>
                      <SelectItem value="معلق">معلق</SelectItem>
                      <SelectItem value="مسترجع">مسترجع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم العملية</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>الصالون</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>طريقة الدفع</TableHead>
                      <TableHead>العمولة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>#{payment.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={payment.customerAvatar} alt={payment.customerName} />
                              <AvatarFallback>{payment.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{payment.customerName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={payment.salonLogo} alt={payment.salonName} />
                              <AvatarFallback>{payment.salonName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{payment.salonName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{new Date(payment.date).toLocaleDateString("ar-SA")}</span>
                          </div>
                        </TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{payment.commission}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            {getStatusBadge(payment.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/payments/${payment.id}`} className="cursor-pointer w-full">
                                  عرض التفاصيل
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>عرض الحجز</DropdownMenuItem>
                              {payment.status === "معلق" && (
                                <DropdownMenuItem className="text-green-600">تأكيد الدفع</DropdownMenuItem>
                              )}
                              {payment.status === "مكتمل" && (
                                <DropdownMenuItem className="text-red-600">استرجاع المبلغ</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="refunds" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="بحث عن طلبات الاسترجاع..." className="pr-9 w-full" />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="جميع الحالات" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">قيد المراجعة</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>الصالون</TableHead>
                      <TableHead>تاريخ الطلب</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>سبب الاسترجاع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refunds.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell>#{refund.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={refund.customerAvatar} alt={refund.customerName} />
                              <AvatarFallback>{refund.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{refund.customerName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={refund.salonLogo} alt={refund.salonName} />
                              <AvatarFallback>{refund.salonName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{refund.salonName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{new Date(refund.requestDate).toLocaleDateString("ar-SA")}</span>
                          </div>
                        </TableCell>
                        <TableCell>{refund.amount}</TableCell>
                        <TableCell>{refund.reason}</TableCell>
                        <TableCell>{getStatusBadge(refund.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                              <DropdownMenuItem>عرض الحجز</DropdownMenuItem>
                              {refund.status === "قيد المراجعة" && (
                                <>
                                  <DropdownMenuItem className="text-green-600">قبول الاسترجاع</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">رفض الاسترجاع</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

