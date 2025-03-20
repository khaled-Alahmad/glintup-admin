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
import { Filter, MoreHorizontal, Search, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const salons = [
  {
    id: "1",
    name: "صالون الأميرة",
    logo: "/placeholder.svg?height=40&width=40",
    location: "الرياض، السعودية",
    owner: "منيرة السعيد",
    phone: "+966 50 123 4567",
    email: "princess@salon.com",
    status: "نشط",
    totalBookings: 1245,
    revenue: "52,450 د.إ",
    joinDate: "12 يناير 2023",
    rating: 4.8,
  },
  {
    id: "2",
    name: "صالون إليت",
    logo: "/placeholder.svg?height=40&width=40",
    location: "جدة، السعودية",
    owner: "سارة الأحمد",
    phone: "+966 55 987 6543",
    email: "elite@salon.com",
    status: "نشط",
    totalBookings: 968,
    revenue: "41,250 د.إ",
    joinDate: "23 فبراير 2023",
    rating: 4.5,
  },
  {
    id: "3",
    name: "صالون جلام",
    logo: "/placeholder.svg?height=40&width=40",
    location: "الدمام، السعودية",
    owner: "نورة المطيري",
    phone: "+966 54 456 7890",
    email: "glam@salon.com",
    status: "نشط",
    totalBookings: 756,
    revenue: "32,800 د.إ",
    joinDate: "5 مارس 2023",
    rating: 4.7,
  },
  {
    id: "4",
    name: "صالون مس بيوتي",
    logo: "/placeholder.svg?height=40&width=40",
    location: "الرياض، السعودية",
    owner: "لمياء القحطاني",
    phone: "+966 56 234 5678",
    email: "missbeauty@salon.com",
    status: "معلق",
    totalBookings: 532,
    revenue: "22,150 د.إ",
    joinDate: "17 أبريل 2023",
    rating: 4.2,
  },
  {
    id: "5",
    name: "صالون روز",
    logo: "/placeholder.svg?height=40&width=40",
    location: "جدة، السعودية",
    owner: "دانة الشهري",
    phone: "+966 58 345 6789",
    email: "rose@salon.com",
    status: "نشط",
    totalBookings: 425,
    revenue: "18,600 د.إ",
    joinDate: "30 مايو 2023",
    rating: 4.6,
  },
]

export default function SalonsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSalon, setSelectedSalon] = useState<any>(null)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)

  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.owner.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || salon.status === statusFilter

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
      case "معلق":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            معلق
          </Badge>
        )
      case "محظور":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            محظور
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة الصالونات</h1>
        <Button asChild>
          <Link href="/salons/add">إضافة صالون جديد</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الصالونات المسجلة</CardTitle>
          <CardDescription>قائمة بجميع الصالونات المسجلة في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث عن الصالونات..."
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
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="محظور">محظور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border w-full overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>الصالون</TableHead>
                    <TableHead>الموقع</TableHead>
                    <TableHead>التواصل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>حجوزات</TableHead>
                    <TableHead>إيرادات</TableHead>
                    <TableHead>تقييم</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalons.map((salon) => (
                    <TableRow key={salon.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarImage src={salon.logo} alt={salon.name} />
                            <AvatarFallback>{salon.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{salon.name}</span>
                            <span className="text-xs text-muted-foreground">{salon.owner}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{salon.location}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">{salon.phone}</span>
                          <span className="text-xs text-muted-foreground">{salon.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(salon.status)}</TableCell>
                      <TableCell>{salon.totalBookings}</TableCell>
                      <TableCell>{salon.revenue}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />
                          <span>{salon.rating}</span>
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
                              <Link href={`/salons/${salon.id}`} className="cursor-pointer w-full">
                                عرض التفاصيل
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/salons/${salon.id}/edit`} className="cursor-pointer w-full">
                                تعديل البيانات
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedSalon(salon)
                                setShowNotificationDialog(true)
                              }}
                            >
                              إرسال إشعار
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {salon.status === "نشط" ? (
                              <DropdownMenuItem
                                className="text-amber-600 cursor-pointer"
                                onClick={() => {
                                  setSelectedSalon(salon)
                                  setShowSuspendDialog(true)
                                }}
                              >
                                تعليق الصالون
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600 cursor-pointer">
                                تفعيل الصالون
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                setSelectedSalon(salon)
                                setShowBanDialog(true)
                              }}
                            >
                              حظر الصالون
                            </DropdownMenuItem>
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

      {/* نافذة إرسال إشعار */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إرسال إشعار للصالون</DialogTitle>
            <DialogDescription>
              {selectedSalon && `سيتم إرسال هذا الإشعار إلى صالون ${selectedSalon.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notification-title">عنوان الإشعار</Label>
              <Input id="notification-title" placeholder="أدخل عنوان الإشعار" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notification-message">نص الإشعار</Label>
              <Textarea id="notification-message" placeholder="أدخل نص الإشعار" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={() => setShowNotificationDialog(false)}>إرسال الإشعار</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تعليق الصالون */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعليق الصالون</DialogTitle>
            <DialogDescription>
              {selectedSalon && `هل أنت متأكد من رغبتك في تعليق صالون ${selectedSalon.name}؟`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="suspend-reason">سبب التعليق</Label>
              <Textarea id="suspend-reason" placeholder="أدخل سبب تعليق الصالون" rows={4} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="suspend-duration">مدة التعليق</Label>
              <Select>
                <SelectTrigger id="suspend-duration">
                  <SelectValue placeholder="اختر مدة التعليق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">يوم واحد</SelectItem>
                  <SelectItem value="3">3 أيام</SelectItem>
                  <SelectItem value="7">أسبوع</SelectItem>
                  <SelectItem value="30">شهر</SelectItem>
                  <SelectItem value="indefinite">غير محدد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={() => setShowSuspendDialog(false)}>
              تعليق الصالون
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة حظر الصالون */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حظر الصالون</DialogTitle>
            <DialogDescription>
              {selectedSalon && `هل أنت متأكد من رغبتك في حظر صالون ${selectedSalon.name} بشكل دائم؟`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ban-reason">سبب الحظر</Label>
              <Textarea id="ban-reason" placeholder="أدخل سبب حظر الصالون" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={() => setShowBanDialog(false)}>
              حظر الصالون
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

