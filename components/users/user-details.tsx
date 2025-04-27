"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowLeft, Calendar, Clock, Edit, Mail, MapPin, Phone, User } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useEffect, useState } from "react"
import { fetchData } from "@/lib/apiHelper"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { PaginationWithInfo } from "../ui/pagination-with-info"

interface UserDetailsProps {
  userId: string
}

interface UserData {
  id: number
  full_name: string
  full_phone: string
  avatar?: string
  updated_at: string,
  age: string
  gender: string
  phone: string
  email: string
  location: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login: string
  bio?: string
}
interface Salon {
  id: number
  icon_url: string
  name: string

}
interface Service {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  duration_minutes: number;

  final_price: number;
  currency: string;
}
interface BookingService {
  id: number;
  booking_id: number;
  service_id: number;
  service: Service;

}
interface Booking {
  id: number
  avatar: string
  notes: string
  total_price: string
  salon_name: string
  salon: Salon
  service_name: string
  date: string
  time: string
  status: string
  price: number
  booking_services: BookingService[]
}

interface Payment {
  id: number
  amount: number
  status: string
  type: string
  created_at: string
}

interface GiftCard {
  id: number
  code: string
  type: string
  amount: string
  currency: string
  is_used: boolean
  message: string
  phone: string
  full_phone: string
  created_at: string
  updated_at: string
}

interface LoyaltyPoint {
  id: number
  points: number
  salon: {
    id: number
    name: string
    icon_url: string
  }
  taken_at: string | null
  used_at: string | null
}

interface Review {
  id: number
  rating: number
  stars: string
  comment: string
  salon: {
    id: number
    name: string
    icon_url: string
  }
  salon_reply: string | null
  salon_reply_at: string | null
  created_at: string
}

export default function UserDetails({ userId }: UserDetailsProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [bookingsData, setBookingsData] = useState<Booking[]>([])
  const [paymentsData, setPaymentsData] = useState<Payment[]>([])
  const [giftCardsData, setGiftCardsData] = useState<GiftCard[]>([])
  const [loyaltyPointsData, setLoyaltyPointsData] = useState<LoyaltyPoint[]>([])
  const [reviewsData, setReviewsData] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("bookings");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(20);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const [userRes, bookingsRes, paymentsRes, giftCardsRes, loyaltyPointsRes, reviewsRes] = await Promise.all([
          fetchData(`admin/users/${userId}`),
          fetchData(`admin/bookings?user_id=${userId}&page=${currentPage}&limit=${perPage}`),
          fetchData(`admin/transactions?user_id=${userId}&page=${currentPage}&limit=${perPage}`),
          fetchData(`admin/gift-cards?sender_id=${userId}&page=${currentPage}&limit=${perPage}`),
          fetchData(`admin/loyalty-points?user_id=${userId}&page=${currentPage}&limit=${perPage}`),
          fetchData(`admin/reviews?user_id=${userId}&page=${currentPage}&limit=${perPage}`)
        ])

        if (userRes.success) setUserData(userRes.data)
        if (bookingsRes.success) {
          setBookingsData(bookingsRes.data)
          setTotalPages(bookingsRes.meta.last_page)
          setCurrentPage(bookingsRes.meta.current_page)
          setTotalItems(bookingsRes.meta.total)
          setPerPage(bookingsRes.meta.per_page)
        }
        if (paymentsRes.success) {
          setPaymentsData(paymentsRes.data)
          if (activeTab === 'payments') {
            setTotalPages(paymentsRes.meta.last_page)
            setCurrentPage(paymentsRes.meta.current_page)
            setTotalItems(paymentsRes.meta.total)
            setPerPage(paymentsRes.meta.per_page)
          }
        }

        if (giftCardsRes.success) {
          setGiftCardsData(giftCardsRes.data)
          if (activeTab === 'gift-cards') {
            setTotalPages(giftCardsRes.meta.last_page)
            setCurrentPage(giftCardsRes.meta.current_page)
            setTotalItems(giftCardsRes.meta.total)
            setPerPage(giftCardsRes.meta.per_page)
          }
        }

        if (loyaltyPointsRes.success) {
          setLoyaltyPointsData(loyaltyPointsRes.data)
          if (activeTab === 'loyalty-points') {
            setTotalPages(loyaltyPointsRes.meta.last_page)
            setCurrentPage(loyaltyPointsRes.meta.current_page)
            setTotalItems(loyaltyPointsRes.meta.total)
            setPerPage(loyaltyPointsRes.meta.per_page)
          }
        }

        if (reviewsRes.success) {
          setReviewsData(reviewsRes.data)
          if (activeTab === 'reviews') {
            setTotalPages(reviewsRes.meta.last_page)
            setCurrentPage(reviewsRes.meta.current_page)
            setTotalItems(reviewsRes.meta.total)
            setPerPage(reviewsRes.meta.per_page)
          }
        }

        setLoading(false)
      } catch (err) {
        setError('فشل في تحميل بيانات المستخدم')
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userId, currentPage, activeTab])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full md:col-span-2" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] gap-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-red-500 text-lg">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </div>
    )
  }

  if (!userData) return null


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
  console.log(paymentsData);

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
                <AvatarImage src={userData.avatar} alt={userData.full_name} />
                <AvatarFallback>{userData.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{userData.full_name}</h2>
              <div className="mt-2">{getStatusBadge(userData.is_active ? "نشط" : "غير نشط")}</div>
              <p className="text-sm text-muted-foreground mt-2">عضو منذ {userData.created_at}</p>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={`/users/${userId}/edit`}>
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </Link>
              </Button>
              {/* {user.status === "نشط" ? (
                <Button variant="destructive" className="mt-2 w-full">
                  حظر المستخدم
                </Button>
              ) : (
                <Button variant="default" className="mt-2 w-full">
                  إلغاء الحظر
                </Button>
              )} */}
            </div>

            <div className="mt-6 space-y-4">
              {/* <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">البريد الإلكتروني</p>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
              </div> */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">رقم الهاتف</p>
                  <p className="text-sm text-muted-foreground" style={{ unicodeBidi: "plaintext", textAlign: "right" }}>{userData.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">العمر</p>
                  <p className="text-sm text-muted-foreground">{userData.age}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">آخر تسجيل دخول</p>
                  <p className="text-sm text-muted-foreground">{userData.updated_at}</p>
                </div>
              </div>
              {/* <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">ملاحظات</p>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="bookings" className="w-full" value={activeTab} onValueChange={setActiveTab} >
            <CardHeader className="w-full overflow-x-auto" >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
                <TabsTrigger value="payments">المدفوعات</TabsTrigger>
                <TabsTrigger value="gift-cards">بطاقات الهدايا المرسلة</TabsTrigger>
                <TabsTrigger value="loyalty-points">نقاط الولاء</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>

              <TabsContent value="bookings" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">حجوزات المستخدم</h3>
                    {/* <p className="text-sm text-muted-foreground">إجمالي الحجوزات: {user.bookingsCount}</p> */}
                  </div>
                  <Button size="sm">
                    <Link href={"/appointments"} className="text-sm">
                      عرض الكل

                    </Link>
                  </Button>
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
                      {
                        bookingsData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">لا يوجد حجوزات</TableCell>
                          </TableRow>
                        ) :
                          bookingsData.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 border">
                                    <AvatarImage src={booking.avatar} alt={booking.salon.name} />
                                    <AvatarFallback>{booking.salon.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{booking.salon.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {booking.booking_services.length > 0 && (
                                  <>
                                    <span className="text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary inline-flex">
                                      {booking.booking_services[0].service.name.ar}
                                    </span>
                                    {booking.booking_services.length > 1 && (
                                      <Popover>
                                        <PopoverTrigger className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                          +{booking.booking_services.length - 1} more
                                        </PopoverTrigger>
                                        <PopoverContent className="w-60">
                                          <div className="flex flex-col gap-2">
                                            {booking.booking_services.slice(1).map((service) => (
                                              <div key={service.id} className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                  {service.service.name.ar}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {service.service.final_price} {service.service.currency} • {service.service.duration_minutes} minutes
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    )}
                                  </>
                                )}

                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm">{new Date(booking.date).toLocaleDateString("en-US")}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm">{booking.time}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{booking.total_price} د.إ</TableCell>
                              <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
                <PaginationWithInfo
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={perPage}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">مدفوعات المستخدم</h3>
                    {/* <p className="text-sm text-muted-foreground">إجمالي المدفوعات: {user.totalSpent}</p> */}
                  </div>
                  <Button size="sm">
                    <Link href={"/payments"} className="text-sm">
                      عرض الكل
                    </Link>
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم العملية</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>التكلفة</TableHead>
                        <TableHead> النوع</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        paymentsData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">لا يوجد مدفوعات</TableCell>
                          </TableRow>
                        ) :


                          paymentsData.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>#{payment.id}</TableCell>
                              <TableCell>{new Date(payment.created_at).toLocaleDateString("en-US")}</TableCell>
                              <TableCell>{payment.amount}</TableCell>
                              <TableCell>{payment.type}</TableCell>
                              <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
                <PaginationWithInfo
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={perPage}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="gift-cards" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">بطاقات الهدايا المرسلة</h3>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم البطاقة</TableHead>
                        <TableHead>القيمة</TableHead>
                        <TableHead>رقم الهاتف</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {giftCardsData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">لا يوجد بطاقات هدايا</TableCell>
                        </TableRow>
                      ) : (
                        giftCardsData.map((giftCard) => (
                          <TableRow key={giftCard.id}>
                            <TableCell>{giftCard.code}</TableCell>
                            <TableCell>{giftCard.amount} {giftCard.currency}</TableCell>
                            <TableCell>{giftCard.full_phone}</TableCell>
                            <TableCell>{new Date(giftCard.created_at).toLocaleDateString("en-US")}</TableCell>
                            <TableCell>{getStatusBadge(giftCard.is_used ? "مستخدمة" : "غير مستخدمة")}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <PaginationWithInfo
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={perPage}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="loyalty-points" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">نقاط الولاء</h3>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصالون</TableHead>
                        <TableHead>النقاط</TableHead>
                        <TableHead>تاريخ الاكتساب</TableHead>
                        <TableHead>تاريخ الاستخدام</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loyaltyPointsData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">لا يوجد نقاط ولاء</TableCell>
                        </TableRow>
                      ) : (
                        loyaltyPointsData.map((point) => (
                          <TableRow key={point.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border">
                                  <AvatarImage src={point.salon.icon_url} alt={point.salon.name} />
                                  <AvatarFallback>{point.salon.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{point.salon.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{point.points}</TableCell>
                            <TableCell>{point.taken_at ? new Date(point.taken_at).toLocaleDateString("en-US") : "-"}</TableCell>
                            <TableCell>{point.used_at ? new Date(point.used_at).toLocaleDateString("en-US") : "-"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <PaginationWithInfo
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={perPage}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">التقييمات</h3>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصالون</TableHead>
                        <TableHead>التقييم</TableHead>
                        <TableHead>التعليق</TableHead>
                        <TableHead>رد الصالون</TableHead>
                        <TableHead>التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewsData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">لا يوجد تقييمات</TableCell>
                        </TableRow>
                      ) : (
                        reviewsData.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border">
                                  <AvatarImage src={review.salon.icon_url} alt={review.salon.name} />
                                  <AvatarFallback>{review.salon.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{review.salon.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{review.stars}</TableCell>
                            <TableCell>{review.comment}</TableCell>
                            <TableCell>{review.salon_reply || "-"}</TableCell>
                            <TableCell>{new Date(review.created_at).toLocaleDateString("en-US")}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <PaginationWithInfo
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={perPage}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
          <CardContent>
          </CardContent>
        </Card>
      </div>
    </div >
  )
}

