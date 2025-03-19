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
import { Filter, MoreHorizontal, Search, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const users = [
  {
    id: "1",
    name: "سارة أحمد",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "sarah@example.com",
    phone: "+966 50 123 4567",
    location: "الرياض، السعودية",
    status: "نشط",
    joinDate: "12 يناير 2023",
    lastLogin: "منذ 2 ساعة",
    bookingsCount: 24,
    totalSpent: "4,250 ر.س",
  },
  {
    id: "2",
    name: "محمد العلي",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "mohammed@example.com",
    phone: "+966 55 987 6543",
    location: "جدة، السعودية",
    status: "نشط",
    joinDate: "23 فبراير 2023",
    lastLogin: "منذ 5 أيام",
    bookingsCount: 18,
    totalSpent: "3,120 ر.س",
  },
  {
    id: "3",
    name: "نورة المطيري",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "noura@example.com",
    phone: "+966 54 456 7890",
    location: "الدمام، السعودية",
    status: "نشط",
    joinDate: "5 مارس 2023",
    lastLogin: "منذ 1 يوم",
    bookingsCount: 32,
    totalSpent: "5,680 ر.س",
  },
  {
    id: "4",
    name: "خالد السعيد",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "khaled@example.com",
    phone: "+966 56 234 5678",
    location: "الرياض، السعودية",
    status: "محظور",
    joinDate: "17 أبريل 2023",
    lastLogin: "منذ 30 يوم",
    bookingsCount: 7,
    totalSpent: "1,150 ر.س",
  },
  {
    id: "5",
    name: "منى الشهري",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "mona@example.com",
    phone: "+966 58 345 6789",
    location: "جدة، السعودية",
    status: "نشط",
    joinDate: "30 مايو 2023",
    lastLogin: "منذ 12 ساعة",
    bookingsCount: 15,
    totalSpent: "2,600 ر.س",
  },
]

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
        <Button asChild>
          <Link href="/users/add">
            <UserPlus className="h-4 w-4 ml-2" />
            إضافة مستخدم
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,532</div>
            <p className="text-xs text-muted-foreground mt-1">زيادة 125 مستخدم هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مستخدمين نشطين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,498</div>
            <p className="text-xs text-muted-foreground mt-1">98% من إجمالي المستخدمين</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مستخدمين محظورين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground mt-1">2% من إجمالي المستخدمين</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط الإنفاق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320 ر.س</div>
            <p className="text-xs text-muted-foreground mt-1">لكل مستخدم شهرياً</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>المستخدمين</CardTitle>
                <CardDescription>قائمة بجميع المستخدمين المسجلين في النظام</CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="blocked">محظور</TabsTrigger>
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
                  placeholder="بحث عن المستخدمين..."
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
                    <SelectItem value="محظور">محظور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>التواصل</TableHead>
                    <TableHead>الموقع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>آخر تسجيل دخول</TableHead>
                    <TableHead>الحجوزات</TableHead>
                    <TableHead>الإنفاق</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.joinDate}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">{user.phone}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{user.bookingsCount}</TableCell>
                      <TableCell>{user.totalSpent}</TableCell>
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
                              <Link href={`/users/${user.id}`} className="cursor-pointer w-full">
                                عرض التفاصيل
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/users/${user.id}/edit`} className="cursor-pointer w-full">
                                تعديل البيانات
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>عرض الحجوزات</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "نشط" ? (
                              <DropdownMenuItem className="text-red-600">حظر المستخدم</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">إلغاء الحظر</DropdownMenuItem>
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

