"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  AlertTriangle,
  Ban,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SalonDetailsProps {
  salonId: string
}

export default function SalonDetails({ salonId }: SalonDetailsProps) {
  const [showSendNotificationDialog, setShowSendNotificationDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)

  // In a real app, you would fetch salon data based on salonId
  const salon = {
    id: salonId,
    name: "صالون الأميرة",
    logo: "/placeholder.svg?height=128&width=128",
    cover: "/placeholder.svg?height=400&width=800",
    description:
      "صالون الأميرة هو صالون متخصص في خدمات التجميل والعناية بالشعر والبشرة للسيدات. نقدم خدمات عالية الجودة بأيدي خبيرات متخصصات في مجال التجميل.",
    category: "نسائي",
    status: "نشط",
    featured: true,
    verified: true,
    owner: "منيرة السعيد",
    email: "princess@salon.com",
    phone: "+966 50 123 4567",
    address: "حي الورود، شارع الأمير سلطان، الرياض",
    city: "الرياض",
    district: "حي الورود",
    postalCode: "12345",
    location: "الرياض، السعودية",
    workingHours: {
      الأحد: { from: "09:00", to: "21:00" },
      الاثنين: { from: "09:00", to: "21:00" },
      الثلاثاء: { from: "09:00", to: "21:00" },
      الأربعاء: { from: "09:00", to: "21:00" },
      الخميس: { from: "09:00", to: "21:00" },
      الجمعة: { from: "16:00", to: "22:00" },
      السبت: { from: "09:00", to: "21:00" },
    },
    socialMedia: {
      instagram: "princess_salon",
      twitter: "princess_salon",
      snapchat: "princess_salon",
      tiktok: "princess_salon",
    },
    rating: 4.8,
    totalReviews: 245,
    totalBookings: 1245,
    revenue: "52,450 د.إ",
    joinDate: "12 يناير 2023",
  }

  const services = [
    { id: "1", name: "قص شعر", duration: "60 دقيقة", price: "150 د.إ", bookings: 320 },
    { id: "2", name: "صبغة شعر", duration: "120 دقيقة", price: "300 د.إ", bookings: 180 },
    { id: "3", name: "تسريحة شعر", duration: "90 دقيقة", price: "200 د.إ", bookings: 210 },
    { id: "4", name: "مكياج", duration: "60 دقيقة", price: "250 د.إ", bookings: 150 },
    { id: "5", name: "مانيكير وباديكير", duration: "90 دقيقة", price: "180 د.إ", bookings: 95 },
  ]

  const reviews = [
    {
      id: "1",
      customerName: "سارة أحمد",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment: "خدمة ممتازة وموظفات محترفات",
      date: "2024-04-01",
    },
    {
      id: "2",
      customerName: "نورة محمد",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      comment: "تجربة جيدة ولكن كان هناك تأخير بسيط",
      date: "2024-03-25",
    },
    {
      id: "3",
      customerName: "عبير علي",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment: "من أفضل الصالونات التي زرتها",
      date: "2024-03-20",
    },
  ]

  const appointments = [
    {
      id: "1",
      customerName: "سارة أحمد",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      service: "قص شعر",
      date: "2024-04-03",
      time: "10:30 صباحاً",
      status: "مؤكد",
    },
    {
      id: "2",
      customerName: "نورة محمد",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      service: "صبغة شعر",
      date: "2024-04-03",
      time: "2:15 مساءً",
      status: "معلق",
    },
    {
      id: "3",
      customerName: "عبير علي",
      customerAvatar: "/placeholder.svg?height=40&width=40",
      service: "تسريحة شعر",
      date: "2024-04-04",
      time: "4:45 مساءً",
      status: "مؤكد",
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
      case "مؤكد":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            مؤكد
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/salons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">تفاصيل الصالون</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3 w-full">
        <Card className="md:col-span-1 w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={salon.logo} alt={salon.name} />
                <AvatarFallback>{salon.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{salon.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(salon.status)}
                {salon.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    موثق
                  </Badge>
                )}
                {salon.featured && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    مميز
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{salon.rating}</span>
                <span className="text-sm text-muted-foreground">({salon.totalReviews} تقييم)</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">عضو منذ {salon.joinDate}</p>
              <div className="flex gap-2 mt-4 w-full">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/salons/${salonId}/edit`}>
                    <Edit className="h-4 w-4 ml-2" />
                    تعديل
                  </Link>
                </Button>
                <Dialog open={showSendNotificationDialog} onOpenChange={setShowSendNotificationDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Bell className="h-4 w-4 ml-2" />
                      إشعار
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إرسال إشعار للصالون</DialogTitle>
                      <DialogDescription>سيتم إرسال هذا الإشعار إلى صالون {salon.name}</DialogDescription>
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
                      <Button variant="outline" onClick={() => setShowSendNotificationDialog(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={() => setShowSendNotificationDialog(false)}>إرسال الإشعار</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-2 mt-2 w-full">
                <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50">
                      <AlertTriangle className="h-4 w-4 ml-2" />
                      تعليق
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>تعليق الصالون</DialogTitle>
                      <DialogDescription>هل أنت متأكد من رغبتك في تعليق صالون {salon.name}؟</DialogDescription>
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
                <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                      <Ban className="h-4 w-4 ml-2" />
                      حظر
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>حظر الصالون</DialogTitle>
                      <DialogDescription>هل أنت متأكد من رغبتك في حظر صالون {salon.name} بشكل دائم؟</DialogDescription>
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
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">المالك</p>
                  <p className="text-sm text-muted-foreground">{salon.owner}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">البريد الإلكتروني</p>
                  <p className="text-sm text-muted-foreground">{salon.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">رقم الهاتف</p>
                  <p className="text-sm text-muted-foreground">{salon.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">العنوان</p>
                  <p className="text-sm text-muted-foreground">{salon.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">ساعات العمل</p>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    {Object.entries(salon.workingHours).map(([day, hours]) => (
                      <p key={day}>
                        {day}: {hours.from} - {hours.to}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">إحصائيات</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>إجمالي الحجوزات</span>
                    <span className="font-medium">{salon.totalBookings}</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>إجمالي الإيرادات</span>
                    <span className="font-medium">{salon.revenue}</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>متوسط التقييم</span>
                    <span className="font-medium">{salon.rating}/5</span>
                  </div>
                  <Progress value={salon.rating * 20} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader className="w-full overflow-x-auto">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="services">الخدمات</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                <TabsTrigger value="appointments">الحجوزات</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="space-y-6">
                <div className="rounded-lg overflow-hidden h-48 md:h-64">
                  <img
                    src={salon.cover || "/placeholder.svg"}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">عن الصالون</h3>
                  <p className="text-muted-foreground">{salon.description}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">الخدمات الأكثر حجزاً</h3>
                  <div className="space-y-3">
                    {services.slice(0, 3).map((service) => (
                      <div key={service.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{service.price}</p>
                          <p className="text-sm text-muted-foreground">{service.bookings} حجز</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">أحدث التقييمات</h3>
                  <div className="space-y-4">
                    {reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.customerAvatar} alt={review.customerName} />
                              <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.customerName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString("ar-SA")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">قائمة الخدمات</h3>
                  <Button size="sm" asChild>
                    <Link href={`/salons/${salonId}/services/add`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 ml-2"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      إضافة خدمة
                    </Link>
                  </Button>
                </div>

                <div className="rounded-md border w-full overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم الخدمة</TableHead>
                        <TableHead>المدة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>عدد الحجوزات</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.duration}</TableCell>
                          <TableCell>{service.price}</TableCell>
                          <TableCell>{service.bookings}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href={`/salons/${salonId}/services/${service.id}/edit`}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                  </svg>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">تقييمات العملاء</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-lg ml-1">{salon.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({salon.totalReviews} تقييم)</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 text-center">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex flex-col items-center">
                      <div className="flex items-center">
                        <span className="font-medium">{rating}</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />
                      </div>
                      <Progress
                        value={rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 7 : rating === 2 ? 2 : 1}
                        className="h-2 w-full mt-2"
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        {rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.customerAvatar} alt={review.customerName} />
                            <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.customerName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.date).toLocaleDateString("ar-SA")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          إخفاء التقييم
                        </Button>
                      </div>
                      <p className="mt-3">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">الحجوزات</h3>
                  <Button size="sm" asChild>
                    <Link href={`/appointments?salon=${salonId}`}>عرض جميع الحجوزات</Link>
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>العميل</TableHead>
                        <TableHead>الخدمة</TableHead>
                        <TableHead>التاريخ والوقت</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
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
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">
                                  {new Date(appointment.date).toLocaleDateString("ar-SA")}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">{appointment.time}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/appointments/${appointment.id}`}>عرض التفاصيل</Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

