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
import { Calendar, Check, Clock, Filter, MoreHorizontal, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DatePicker } from "@/components/ui/date-picker"
import Link from "next/link"

const appointments = [
  {
    id: "1",
    customerName: "سارة أحمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون الأميرة",
    salonLogo: "/placeholder.svg?height=32&width=32",
    time: "10:30 صباحاً",
    date: "2024-04-03",
    service: "قص شعر وصبغة",
    duration: "120 دقيقة",
    price: "450 د.إ",
    status: "مؤكد",
  },
  {
    id: "2",
    customerName: "نورة محمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    time: "2:15 مساءً",
    date: "2024-04-03",
    service: "مكياج",
    duration: "60 دقيقة",
    price: "350 د.إ",
    status: "معلق",
  },
  {
    id: "3",
    customerName: "عبير علي",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون جلام",
    salonLogo: "/placeholder.svg?height=32&width=32",
    time: "4:45 مساءً",
    date: "2024-04-03",
    service: "علاج بالكيراتين",
    duration: "180 دقيقة",
    price: "800 د.إ",
    status: "مؤكد",
  },
  {
    id: "4",
    customerName: "هند خالد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون مس بيوتي",
    salonLogo: "/placeholder.svg?height=32&width=32",
    time: "11:00 صباحاً",
    date: "2024-04-03",
    service: "مانيكير وباديكير",
    duration: "90 دقيقة",
    price: "200 د.إ",
    status: "ملغي",
  },
  {
    id: "5",
    customerName: "ليلى عبدالله",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون روز",
    salonLogo: "/placeholder.svg?height=32&width=32",
    time: "3:30 مساءً",
    date: "2024-04-03",
    service: "حمام مغربي",
    duration: "120 دقيقة",
    price: "300 د.إ",
    status: "مكتمل",
  },
]

export default function AppointmentsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    let matchesDate = true
    if (dateFilter) {
      const appointmentDate = new Date(appointment.date)
      const filterDate = new Date(dateFilter)
      matchesDate =
        appointmentDate.getDate() === filterDate.getDate() &&
        appointmentDate.getMonth() === filterDate.getMonth() &&
        appointmentDate.getFullYear() === filterDate.getFullYear()
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مؤكد":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            مؤكد
          </Badge>
        )
      case "معلق":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            معلق
          </Badge>
        )
      case "ملغي":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            ملغي
          </Badge>
        )
      case "مكتمل":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            مكتمل
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مؤكد":
        return <Check className="h-4 w-4 text-green-500" />
      case "معلق":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "ملغي":
        return <X className="h-4 w-4 text-red-500" />
      case "مكتمل":
        return <Check className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة الحجوزات</h1>
        <Button asChild>
          <Link href="/appointments/add">إضافة حجز جديد</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الحجوزات</CardTitle>
          <CardDescription>إدارة حجوزات الصالونات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث عن الحجوزات..."
                  className="pr-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <DatePicker selected={dateFilter} onSelect={setDateFilter} placeholder="تاريخ الحجز" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="جميع الحالات" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="مؤكد">مؤكد</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                    <SelectItem value="ملغي">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العميل</TableHead>
                    <TableHead>الصالون</TableHead>
                    <TableHead>الخدمة</TableHead>
                    <TableHead>التاريخ والوقت</TableHead>
                    <TableHead>المدة والسعر</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={appointment.customerAvatar} alt={appointment.customerName} />
                            <AvatarFallback>{appointment.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{appointment.customerName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={appointment.salonLogo} alt={appointment.salonName} />
                            <AvatarFallback>{appointment.salonName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{appointment.salonName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{new Date(appointment.date).toLocaleDateString("ar-SA")}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{appointment.duration}</span>
                          <span className="text-sm font-medium">{appointment.price}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(appointment.status)}
                          {getStatusBadge(appointment.status)}
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
                              <Link href={`/appointments/${appointment.id}`} className="cursor-pointer w-full">
                                عرض التفاصيل
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/appointments/${appointment.id}/edit`} className="cursor-pointer w-full">
                                تعديل الحجز
                              </Link>
                            </DropdownMenuItem>
                            {appointment.status === "معلق" && (
                              <DropdownMenuItem className="text-green-600">تأكيد الحجز</DropdownMenuItem>
                            )}
                            {(appointment.status === "معلق" || appointment.status === "مؤكد") && (
                              <DropdownMenuItem className="text-red-600">إلغاء الحجز</DropdownMenuItem>
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

