"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Edit, Mail, MapPin, Phone, User } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserDetailsProps {
  userId: string
}

export default function UserDetails({ userId }: UserDetailsProps) {
  // In a real app, you would fetch user data based on userId
  const user = {
    id: userId,
    name: "سارة أحمد",
    avatar: "/placeholder.svg?height=128&width=128",
    email: "sarah@example.com",
    phone: "+966 50 123 4567",
    location: "مدينة الكويت، الكويت",
    status: "نشط",
    joinDate: "12 يناير 2023",
    lastLogin: "منذ 2 ساعة",
    bookingsCount: 24,
    totalSpent: "4,250 د.إ",
    bio: "عميلة منتظمة تفضل خدمات العناية بالشعر والمكياج.",
  }

  const bookings = [
    {
      id: "1",
      salonName: "صالون الأميرة",
      salonLogo: "/placeholder.svg?height=32&width=32",
      service: "قص شعر وصبغة",
      date: "2024-04-03",
      time: "10:30 صباحاً",
      status: "مكتمل",
      price: "450 د.إ",
    },
    {
      id: "2",
      salonName: "صالون إليت",
      salonLogo: "/placeholder.svg?height=32&width=32",
      service: "مكياج",
      date: "2024-03-25",
      time: "2:15 مساءً",
      status: "مكتمل",
      price: "350 د.إ",
    },
    {
      id: "3",
      salonName: "صالون جلام",
      salonLogo: "/placeholder.svg?height=32&width=32",
      service: "علاج بالكيراتين",
      date: "2024-04-10",
      time: "4:45 مساءً",
      status: "مؤكد",
      price: "800 د.إ",
    },
  ]

  const payments = [
    {
      id: "1",
      date: "2024-04-03",
      amount: "450 د.إ",
      method: "بطاقة ائتمان",
      status: "مكتمل",
      bookingId: "1",
    },
    {
      id: "2",
      date: "2024-03-25",
      amount: "350 د.إ",
      method: "Apple Pay",
      status: "مكتمل",
      bookingId: "2",
    },
    {
      id: "3",
      date: "2024-04-10",
      amount: "800 د.إ",
      method: "بطاقة ائتمان",
      status: "معلق",
      bookingId: "3",
    },
  ]

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
      case "مؤكد":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            مؤكد
          </Badge>
        )
      case "مكتمل":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            مكتمل
          </Badge>
        )
      case "معلق":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            معلق
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">تفاصيل المستخدم</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="mt-2">{getStatusBadge(user.status)}</div>
              <p className="text-sm text-muted-foreground mt-2">عضو منذ {user.joinDate}</p>
              <Button variant="outline" className="mt-4 w-full">
                <Edit className="h-4 w-4 ml-2" />
                تعديل البيانات
              </Button>
              {user.status === "نشط" ? (
                <Button variant="destructive" className="mt-2 w-full">
                  حظر المستخدم
                </Button>
              ) : (
                <Button variant="default" className="mt-2 w-full">
                  إلغاء الحظر
                </Button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">البريد الإلكتروني</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">رقم الهاتف</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">الموقع</p>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">آخر تسجيل دخول</p>
                  <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">ملاحظات</p>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs defaultValue="bookings">
              <TabsList>
                <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
                <TabsTrigger value="payments">المدفوعات</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bookings">
              <TabsContent value="bookings" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">حجوزات المستخدم</h3>
                    <p className="text-sm text-muted-foreground">إجمالي الحجوزات: {user.bookingsCount}</p>
                  </div>
                  <Button size="sm">عرض الكل</Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصالون</TableHead>
                        <TableHead>الخدمة</TableHead>
                        <TableHead>التاريخ والوقت</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border">
                                <AvatarImage src={booking.salonLogo} alt={booking.salonName} />
                                <AvatarFallback>{booking.salonName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{booking.salonName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{booking.service}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">{new Date(booking.date).toLocaleDateString("ar-SA")}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">{booking.time}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.price}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">مدفوعات المستخدم</h3>
                    <p className="text-sm text-muted-foreground">إجمالي المدفوعات: {user.totalSpent}</p>
                  </div>
                  <Button size="sm">عرض الكل</Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم العملية</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>التكلفة</TableHead>
                        <TableHead>طريقة الدفع</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>#{payment.id}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString("ar-SA")}</TableCell>
                          <TableCell>{payment.amount}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
    </div>
  )
}

