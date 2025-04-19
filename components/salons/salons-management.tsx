"use client"

import { useEffect, useState } from "react"
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
import { Filter, Loader2, MoreHorizontal, Search, Star } from "lucide-react"
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
import { addData, fetchData, updateData } from "@/lib/apiHelper"
import { useToast } from "../ui/use-toast"
import { PaginationWithInfo } from "../ui/pagination-with-info"
import { Skeleton } from "../ui/skeleton"

// const salons = [
//   {
//     id: "1",
//     name: "صالون الأميرة",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "مدينة الكويت، الكويت",
//     owner: "منيرة السعيد",
//     phone: "+966 50 123 4567",
//     email: "princess@salon.com",
//     status: "نشط",
//     totalBookings: 1245,
//     revenue: "52,450 د.إ",
//     joinDate: "12 يناير 2023",
//     rating: 4.8,
//   },
//   {
//     id: "2",
//     name: "صالون إليت",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "جدة، السعودية",
//     owner: "سارة الأحمد",
//     phone: "+966 55 987 6543",
//     email: "elite@salon.com",
//     status: "نشط",
//     totalBookings: 968,
//     revenue: "41,250 د.إ",
//     joinDate: "23 فبراير 2023",
//     rating: 4.5,
//   },
//   {
//     id: "3",
//     name: "صالون جلام",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "الدمام، السعودية",
//     owner: "نورة المطيري",
//     phone: "+966 54 456 7890",
//     email: "glam@salon.com",
//     status: "نشط",
//     totalBookings: 756,
//     revenue: "32,800 د.إ",
//     joinDate: "5 مارس 2023",
//     rating: 4.7,
//   },
//   {
//     id: "4",
//     name: "صالون مس بيوتي",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "مدينة الكويت، الكويت",
//     owner: "لمياء القحطاني",
//     phone: "+966 56 234 5678",
//     email: "missbeauty@salon.com",
//     status: "معلق",
//     totalBookings: 532,
//     revenue: "22,150 د.إ",
//     joinDate: "17 أبريل 2023",
//     rating: 4.2,
//   },
//   {
//     id: "5",
//     name: "صالون روز",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "جدة، السعودية",
//     owner: "دانة الشهري",
//     phone: "+966 58 345 6789",
//     email: "rose@salon.com",
//     status: "نشط",
//     totalBookings: 425,
//     revenue: "18,600 د.إ",
//     joinDate: "30 مايو 2023",
//     rating: 4.6,
//   },
// ]

export default function SalonsManagement() {
  const [salons, setSalons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSalon, setSelectedSalon] = useState<any>(null)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [perPage, setPerPage] = useState(10)

  const [statusFilter, setStatusFilter] = useState("all")
  // Add fetch function
  const fetchSalons = async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: perPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { is_active: statusFilter === 'نشط' ? '1' : '0' }),
      });

      const response = await fetchData(`admin/salons?${queryParams.toString()}`)
      if (response.success) {
        setSalons(response.data)
        setTotalItems(response.data.total)
        setPerPage(response.meta.per_page);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
      }
    } catch (error) {
      console.error('Failed to fetch salons:', error)
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب بيانات الصالونات",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add status update function
  const updateSalonStatus = async (salonId: number, status: string, reason?: string) => {
    try {
      const response = await updateData(`admin/salons/${salonId}/status`, {
        status,
        reason,
      })
      if (response.success) {
        toast({
          title: "تم تحديث الحالة",
          description: "تم تحديث حالة الصالون بنجاح",
        })
        fetchSalons()
      }
    } catch (error) {
      console.error('Failed to update salon status:', error)
      toast({
        title: "خطأ في تحديث الحالة",
        description: "حدث خطأ أثناء تحديث حالة الصالون",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchSalons()
  }, [page])

  // Update search and filter handlers
  useEffect(() => {
    // const timer = setTimeout(() => {
    fetchSalons()
    // }, 500)
    // return () => clearTimeout(timer)
  }, [searchQuery, statusFilter])


  // const filteredSalons = salons.filter((salon) => {
  //   const matchesSearch =
  //     salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     salon.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     salon.owner.toLowerCase().includes(searchQuery.toLowerCase())

  //   const matchesStatus = statusFilter === "all" || salon.status === statusFilter

  //   return matchesSearch && matchesStatus
  // })

  const getStatusBadge = (status: boolean, isApproved: boolean) => {
    if (!isApproved) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          قيد المراجعة
        </Badge>
      )
    }
    switch (status) {
      case true:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            نشط
          </Badge>
        )
      case false:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            غير نشط
          </Badge>
        )
      default:
        return <Badge variant="outline">{status ? "نشط" : "غير نشط"}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة الصالونات</h1>
        {/* <Button asChild>
          <Link href="/salons/add">إضافة صالون جديد</Link>
        </Button> */}
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
                    <SelectItem value="1">نشط</SelectItem>
                    <SelectItem value="0">غير نشط</SelectItem>
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
                  {isLoading ? (
                    Array.from({ length: perPage }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 8 }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : salons && salons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-muted-foreground">لا توجد صالونات مسجلة</p>
                          <Button asChild variant="link" className="gap-1">
                            <Link href="/salons/add">
                              إضافة صالون جديد
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : salons.map((salon) => (
                    <TableRow key={salon.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarImage src={salon.icon_url} alt={salon.merchant_commercial_name} />
                            <AvatarFallback>{salon.merchant_commercial_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{salon.merchant_commercial_name}</span>
                            <span className="text-xs text-muted-foreground">{salon.owner?.full_name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{salon.city_street_name || salon.address}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-right" style={{ unicodeBidi: 'plaintext' }}>{salon.contact_number}</span>
                          <span className="text-xs text-muted-foreground">{salon.contact_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(salon.is_active, salon.is_approved)}</TableCell>
                      <TableCell>{salon.bookings_count}</TableCell>
                      <TableCell style={{ unicodeBidi: 'plaintext' }} className=" text-right">{salon.total_revenue + " د.إ"}</TableCell>
                      <TableCell>
                        <div className="flex items-center align-items-center ">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />
                          <span>{salon.average_rating || 0}</span>
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
                            {/* {salon.status === "نشط" ? (
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
                            )} */}
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
                  {!isLoading && salons.length > 0 && totalPages > 1 && (
                    <div className="mt-4">
                      <PaginationWithInfo
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={perPage}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نافذة إرسال إشعار */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            try {
              const response = await addData(`admin/salons/${selectedSalon.id}/send-notification`, {
                title: formData.get('title'),
                message: formData.get('message')
              });

              if (response.success) {
                toast({
                  title: "تم بنجاح",
                  description: "تم إرسال الإشعار بنجاح",
                });
                setShowNotificationDialog(false);
              }
            } catch (error) {
              console.error('Failed to send notification:', error);
              toast({
                title: "خطأ",
                description: "حدث خطأ أثناء إرسال الإشعار",
                variant: "destructive",
              });
            }
          }}>
            <DialogHeader>
              <DialogTitle>إرسال إشعار للصالون</DialogTitle>
              <DialogDescription>
                {/* سيتم إرسال هذا الإشعار إلى صالون {selectedSalon.merchant_legal_name} */}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان الإشعار</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="أدخل عنوان الإشعار"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">نص الإشعار</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="أدخل نص الإشعار"
                  rows={4}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNotificationDialog(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">
                إرسال الإشعار
              </Button>
            </DialogFooter>
          </form>
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
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            try {
              const response = await updateData(`admin/salons/${selectedSalon.id}`, {
                is_active: 0,
                message: formData.get('ban-reason')
              });

              if (response.success) {
                toast({
                  title: "تم بنجاح",
                  description: "تم إرسال الإشعار بنجاح",
                });
                setShowBanDialog(false);
              }
            } catch (error) {
              console.error('Failed to send notification:', error);
              toast({
                title: "خطأ",
                description: "حدث خطأ أثناء إرسال الإشعار",
                variant: "destructive",
              });
            }
          }}>
            <DialogHeader>
              <DialogTitle>حظر الصالون</DialogTitle>
              <DialogDescription>
                {selectedSalon && `هل أنت متأكد من رغبتك في حظر صالون ${selectedSalon.name} بشكل دائم؟`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ban-reason">سبب الحظر</Label>
                <Textarea id="ban-reason" name="ban-reason" placeholder="أدخل سبب حظر الصالون" rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBanDialog(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" type="submit" >
                حظر الصالون
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

