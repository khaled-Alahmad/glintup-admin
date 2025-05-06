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
import { Calendar, Filter, MoreHorizontal, Percent, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const offers = [
  {
    id: "1",
    title: "خصم 25% على جميع الخدمات",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون الأميرة",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    status: "نشط",
    discount: "25%",
    usageCount: 45,
    maxUsage: 100,
    code: "SUMMER25",
  },
  {
    id: "2",
    title: "خصم 50% على الباقات",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-05-15",
    endDate: "2024-06-15",
    status: "نشط",
    discount: "50%",
    usageCount: 32,
    maxUsage: 50,
    code: "ELITE50",
  },
  {
    id: "3",
    title: "خصم 15% للعملاء الجدد",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون جلام",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-05-01",
    endDate: "2024-05-30",
    status: "منتهي",
    discount: "15%",
    usageCount: 28,
    maxUsage: 50,
    code: "NEW15",
  },
  {
    id: "4",
    title: "خصم 30% على خدمات العناية بالبشرة",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون مس بيوتي",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-06-10",
    endDate: "2024-07-10",
    status: "قيد المراجعة",
    discount: "30%",
    usageCount: 0,
    maxUsage: 75,
    code: "SKIN30",
  },
  {
    id: "5",
    title: "خصم 20% بمناسبة العيد",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون روز",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-06-15",
    endDate: "2024-07-15",
    status: "نشط",
    discount: "20%",
    usageCount: 12,
    maxUsage: 100,
    code: "EID20",
  },
]

export default function OffersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.code.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || offer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            نشط
          </Badge>
        )
      case "منتهي":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            منتهي
          </Badge>
        )
      case "قيد المراجعة":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            قيد المراجعة
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة العروض</h1>
        <Button asChild>
          <Link href="/offers/add">إضافة عرض جديد</Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العروض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground mt-1">في النظام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">عروض نشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">حالياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">عروض قيد المراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">بحاجة للمراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط الخصم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground mt-1">لجميع العروض</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>العروض</CardTitle>
                <CardDescription>إدارة العروض والخصومات في التطبيق</CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
                <TabsTrigger value="expired">منتهي</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث عن العروض..."
                  className="pr-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="جميع الحالات" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                    <SelectItem value="منتهي">منتهي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العرض</TableHead>
                    <TableHead>الصالون</TableHead>
                    <TableHead>الفترة</TableHead>
                    <TableHead>كود الخصم</TableHead>
                    <TableHead>نسبة الخصم</TableHead>
                    <TableHead>الاستخدام</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-24 rounded-md overflow-hidden bg-muted">
                            <img
                              src={offer.image || "/placeholder.svg"}
                              alt={offer.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-medium">{offer.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={offer.salonLogo} alt={offer.salonName} />
                            <AvatarFallback>{offer.salonName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{offer.salonName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <div className="flex items-center">
                            <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span>{new Date(offer.startDate).toLocaleDateString("ar-EG")}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span>{new Date(offer.endDate).toLocaleDateString("ar-EG")}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {offer.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Percent className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                          <span>{offer.discount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{offer.usageCount}</span>
                          <span className="text-muted-foreground">/</span>
                          <span>{offer.maxUsage}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(offer.status)}</TableCell>
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
                              <Link href={`/offers/${offer.id}`} className="cursor-pointer w-full">
                                عرض التفاصيل
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/offers/${offer.id}/edit`} className="cursor-pointer w-full">
                                تعديل العرض
                              </Link>
                            </DropdownMenuItem>
                            {offer.status === "قيد المراجعة" && (
                              <>
                                <DropdownMenuItem className="text-green-600">قبول العرض</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">رفض العرض</DropdownMenuItem>
                              </>
                            )}
                            {offer.status === "نشط" && (
                              <DropdownMenuItem className="text-red-600">إيقاف العرض</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

