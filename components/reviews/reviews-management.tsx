"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, MoreHorizontal, Search, Star, ThumbsDown, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const reviews = [
  {
    id: "1",
    customerName: "سارة أحمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون الأميرة",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-03",
    rating: 5,
    comment: "تجربة رائعة، الخدمة ممتازة والموظفات محترفات جداً. سأعود مرة أخرى بالتأكيد.",
    status: "منشور",
    serviceType: "قص شعر وصبغة",
  },
  {
    id: "2",
    customerName: "نورة محمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-02",
    rating: 4,
    comment: "خدمة جيدة ولكن كان هناك تأخير بسيط في الموعد. النتيجة النهائية كانت جيدة.",
    status: "منشور",
    serviceType: "مكياج",
  },
  {
    id: "3",
    customerName: "عبير علي",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون جلام",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-01",
    rating: 2,
    comment: "لم أكن راضية عن النتيجة النهائية، وكان هناك تأخير كبير في الموعد.",
    status: "قيد المراجعة",
    serviceType: "علاج بالكيراتين",
  },
  {
    id: "4",
    customerName: "هند خالد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون مس بيوتي",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-03-30",
    rating: 1,
    comment: "تجربة سيئة للغاية، الموظفات غير محترفات والمكان غير نظيف.",
    status: "محجوب",
    serviceType: "مانيكير وباديكير",
  },
  {
    id: "5",
    customerName: "ليلى عبدالله",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون روز",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-03-29",
    rating: 5,
    comment: "أفضل صالون زرته، الخدمة ممتازة والأسعار معقولة. أنصح به بشدة.",
    status: "منشور",
    serviceType: "حمام مغربي",
  },
]

export default function ReviewsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesRating = ratingFilter === "all" || review.rating === Number.parseInt(ratingFilter)

    return matchesSearch && matchesStatus && matchesRating
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "منشور":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            منشور
          </Badge>
        )
      case "قيد المراجعة":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            قيد المراجعة
          </Badge>
        )
      case "محجوب":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            محجوب
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-heading">إدارة التقييمات</h1>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-yellow-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التقييمات</CardTitle>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground mt-1">تقييم</p>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium ml-1">4.2</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">من 5</span>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-amber-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تقييمات قيد المراجعة</CardTitle>
            <ThumbsUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">بحاجة للمراجعة</p>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-red-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تقييمات سلبية</CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground mt-1">أقل من 3 نجوم</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardHeader>
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>التقييمات</CardTitle>
                <CardDescription>إدارة تقييمات العملاء للصالونات</CardDescription>
              </div>
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="published">منشور</TabsTrigger>
                <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
                <TabsTrigger value="hidden">محجوب</TabsTrigger>
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
                  placeholder="بحث عن التقييمات..."
                  className="pr-9 w-full rounded-full bg-secondary/50 border-0 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="جميع الحالات" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="منشور">منشور</SelectItem>
                    <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                    <SelectItem value="محجوب">محجوب</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <SelectValue placeholder="جميع التقييمات" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التقييمات</SelectItem>
                    <SelectItem value="5">5 نجوم</SelectItem>
                    <SelectItem value="4">4 نجوم</SelectItem>
                    <SelectItem value="3">3 نجوم</SelectItem>
                    <SelectItem value="2">2 نجوم</SelectItem>
                    <SelectItem value="1">1 نجمة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
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
                        <div className="flex items-center gap-2">
                          {getStatusBadge(review.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {review.status === "قيد المراجعة" && (
                                <DropdownMenuItem className="text-green-600 cursor-pointer">
                                  نشر التقييم
                                </DropdownMenuItem>
                              )}
                              {review.status === "منشور" && (
                                <DropdownMenuItem className="text-amber-600 cursor-pointer">
                                  حجب التقييم
                                </DropdownMenuItem>
                              )}
                              {review.status === "محجوب" && (
                                <DropdownMenuItem className="text-green-600 cursor-pointer">
                                  إعادة نشر التقييم
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="cursor-pointer">إضافة رد</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 cursor-pointer">حذف التقييم</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">الصالون:</span>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border">
                            <AvatarImage src={review.salonLogo} alt={review.salonName} />
                            <AvatarFallback>{review.salonName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{review.salonName}</span>
                        </div>
                        {/* <span className="mx-2">•</span>
                        <span className="font-medium">الخدمة:</span>
                        <span>{review.serviceType}</span> */}
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm">{review.comment}</p>
                      </div>
                      {review.status === "منشور" && (
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="rounded-full">
                            إضافة رد
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

