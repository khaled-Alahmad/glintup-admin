"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ReviewActionDialog } from "./review-action-dialog"
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
import { addData, deleteData, fetchData, updateData } from "@/lib/apiHelper"
import { PaginationWithInfo } from "../ui/pagination-with-info"
import { useToast } from "@/hooks/use-toast"
interface Review {
  id: number;
  user_id: number;
  salon_id: number;
  rating: number;
  stars: string;
  comment: string | null;
  salon_reply: string | null;
  salon_reply_at: string | null;
  salon_report: string | null;
  reason_for_report: string | null;
  salon_reported_at: string | null;
  is_reviewed: number;
  is_visible: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string;
  };
  salon: {
    id: number;
    merchant_commercial_name: string;
    name: string;
    icon_url: string;
    average_rating: number;
    total_reviews: number;
  };
}
// const reviews = [
//   {
//     id: "1",
//     customerName: "سارة أحمد",
//     customerAvatar: "/placeholder.svg?height=32&width=32",
//     salonName: "مزود الأميرة",
//     salonLogo: "/placeholder.svg?height=32&width=32",
//     date: "2024-04-03",
//     rating: 5,
//     comment: "تجربة رائعة، الخدمة ممتازة والموظفات محترفات جداً. سأعود مرة أخرى بالتأكيد.",
//     status: "منشور",
//     serviceType: "قص شعر وصبغة",
//   },
//   {
//     id: "2",
//     customerName: "نورة محمد",
//     customerAvatar: "/placeholder.svg?height=32&width=32",
//     salonName: "مزود إليت",
//     salonLogo: "/placeholder.svg?height=32&width=32",
//     date: "2024-04-02",
//     rating: 4,
//     comment: "خدمة جيدة ولكن كان هناك تأخير بسيط في الموعد. النتيجة النهائية كانت جيدة.",
//     status: "منشور",
//     serviceType: "مكياج",
//   },
//   {
//     id: "3",
//     customerName: "عبير علي",
//     customerAvatar: "/placeholder.svg?height=32&width=32",
//     salonName: "مزود جلام",
//     salonLogo: "/placeholder.svg?height=32&width=32",
//     date: "2024-04-01",
//     rating: 2,
//     comment: "لم أكن راضية عن النتيجة النهائية، وكان هناك تأخير كبير في الموعد.",
//     status: "قيد المراجعة",
//     serviceType: "علاج بالكيراتين",
//   },
//   {
//     id: "4",
//     customerName: "هند خالد",
//     customerAvatar: "/placeholder.svg?height=32&width=32",
//     salonName: "مزود مس بيوتي",
//     salonLogo: "/placeholder.svg?height=32&width=32",
//     date: "2024-03-30",
//     rating: 1,
//     comment: "تجربة سيئة للغاية، الموظفات غير محترفات والمكان غير نظيف.",
//     status: "محجوب",
//     serviceType: "مانيكير وباديكير",
//   },
//   {
//     id: "5",
//     customerName: "ليلى عبدالله",
//     customerAvatar: "/placeholder.svg?height=32&width=32",
//     salonName: "مزود روز",
//     salonLogo: "/placeholder.svg?height=32&width=32",
//     date: "2024-03-29",
//     rating: 5,
//     comment: "أفضل مزود زرته، الخدمة ممتازة والأسعار معقولة. أنصح به بشدة.",
//     status: "منشور",
//     serviceType: "حمام مغربي",
//   },
// ]
interface ReviewsInfo {
  total_reviews: number;
  average_rating: number;
  pending_reviews: number;
  completed_count: number;
  negative_reviews: number;
}

export default function ReviewsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [reviewsInfo, setReviewsInfo] = useState<ReviewsInfo>({
    total_reviews: 0,
    average_rating: 0,
    pending_reviews: 0,
    completed_count: 0,
    negative_reviews: 0,
  });
  const [reviews, setReviews] = useState<Review[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: perPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(ratingFilter !== 'all' && { rating: ratingFilter }),
      });

      const response = await fetchData(`admin/reviews?${queryParams}`);
      if (response.success) {
        setReviews(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setPerPage(response.meta.per_page);
        setTotalItems(response.meta.total);
        setReviewsInfo(response.info);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, ratingFilter, searchQuery]);

  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const handleReplyReview = async (review: Review) => {
    setSelectedReview(review)
    setIsReplyDialogOpen(true)
  };

  const handleReplySubmit = async (reply: string) => {
    if (!selectedReview) return;

    try {
      const response = await addData(`admin/reviews/${selectedReview.id}/reply`, { salon_reply: reply });
      if (response.success) {
        toast({
          title: "نجاح",
          description: "تم إضافة الرد بنجاح",
        });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error replying to review:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الرد",
        variant: "destructive",
      });
    }
  };

  const handleToggleReviewStatus = async (review: Review, field: 'is_reviewed' | 'is_visible') => {
    try {
      const response = await updateData(`admin/reviews/${review.id}`, {
        [field]: review[field] === 1 ? 0 : 1
      });
      if (response.success) {
        toast({
          title: "نجاح",
          description: `تم تحديث حالة التقييم بنجاح`,
        });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة التقييم",
        variant: "destructive",
      });
    }
  };

  const handleReportReview = async (review: Review) => {
    setSelectedReview(review)
    setIsReportDialogOpen(true)
  };

  const handleReportSubmit = async (reason: string) => {
    if (!selectedReview) return;

    try {
      const response = await addData(`admin/reviews/${selectedReview.id}/report`, { salon_report: reason, reason_for_report: "other" });
      if (response.success) {
        toast({
          title: "نجاح",
          description: "تم الإبلاغ عن التقييم بنجاح",
        });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error reporting review:', error);
      toast({
        title: "خطأ",
        description: "فشل في الإبلاغ عن التقييم",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await deleteData(`admin/reviews/${reviewId}`);
      if (response.success) {
        toast({
          title: "Success",
          description: "Review deleted successfully",
        });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  // const filteredReviews = reviews.filter((review) => {
  //   const matchesSearch =
  //     review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     review.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     review.comment.toLowerCase().includes(searchQuery.toLowerCase())

  //   const matchesStatus = statusFilter === "all" || review.status === statusFilter
  //   const matchesRating = ratingFilter === "all" || review.rating === Number.parseInt(ratingFilter)

  //   return matchesSearch && matchesStatus && matchesRating
  // })

  const getStatusBadge = (review: Review) => {
    if (!review.is_reviewed) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          قيد المراجعة
        </Badge>
      )
    }
    if (!review.is_visible) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          محجوب
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        منشور
      </Badge>
    )
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
      <ReviewActionDialog
        isOpen={isReplyDialogOpen}
        onClose={() => setIsReplyDialogOpen(false)}
        onSubmit={handleReplySubmit}
        title="الرد على التقييم"
        description="أدخل ردك على تقييم العميل"
        submitLabel="إرسال الرد"
        placeholder="اكتب ردك هنا..."
      />
      <ReviewActionDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onSubmit={handleReportSubmit}
        title="الإبلاغ عن التقييم"
        description="أدخل سبب الإبلاغ عن هذا التقييم"
        submitLabel="إرسال البلاغ"
        placeholder="اكتب سبب الإبلاغ هنا..."
      />
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
            <div className="text-2xl font-bold">
              {reviewsInfo.total_reviews}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تقييم</p>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium ml-1">
                {reviewsInfo.average_rating ? reviewsInfo.average_rating.toFixed(1) : "0.0"}
              </span>
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
            <div className="text-2xl font-bold">
              {reviewsInfo.pending_reviews}
            </div>
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
            <div className="text-2xl font-bold">
              {reviewsInfo.negative_reviews}
            </div>
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
                <CardDescription>إدارة تقييمات العملاء للمزودات</CardDescription>
              </div>
              {/* <TabsList className="bg-secondary/50">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="published">منشور</TabsTrigger>
                <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
                <TabsTrigger value="hidden">محجوب</TabsTrigger>
              </TabsList> */}
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
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={`loading-${index}`} className="overflow-hidden animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted"></div>
                            <div>
                              <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-24 bg-muted rounded"></div>
                                <div className="h-3 w-20 bg-muted rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-16 bg-muted rounded"></div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-muted"></div>
                            <div className="h-4 w-24 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="h-20 bg-muted/30 rounded-lg"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">لا توجد تقييمات متاحة</p>
                </div>
              ) : reviews.map((review) => (
                <Card key={review.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                            <AvatarImage src={review.user.avatar} alt={review.user.full_name} />
                            <AvatarFallback>{review.user.full_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.user.full_name}</p>
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString("ar-EG")}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="text-yellow-500">{review.stars}</div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="checkbox"
                                    color="primary"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={review.is_reviewed === 1}
                                    onChange={() => handleToggleReviewStatus(review, 'is_reviewed')}
                                  />
                                  <span className="text-sm text-muted-foreground">{review.is_reviewed ? 'تمت المراجعة' : 'قيد المراجعة'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(review)}
                          {/* {review.is_visible ? "مخفي" : "مفعل"} */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {/* <DropdownMenuItem onClick={() => handleToggleReviewStatus(review, 'is_reviewed')}>
                                {!review.is_reviewed ? 'تمت المراجعة' : 'إلغاء المراجعة'}
                              </DropdownMenuItem> */}
                              <DropdownMenuItem onClick={() => handleToggleReviewStatus(review, 'is_visible')}>
                                {!review.is_visible ? 'إظهار التقييم' : 'إخفاء التقييم'}
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem onClick={() => handleReplyReview(review)}>
                                الرد على التقييم
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReportReview(review)}>
                                الإبلاغ عن التقييم
                              </DropdownMenuItem> */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteReview(review.id)}>
                                حذف التقييم
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {/* <div className="flex items-center gap-2">
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
                        </div> */}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">المزود:</span>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border">
                            <AvatarImage src={review.salon.icon_url} alt={review.salon.merchant_commercial_name} />
                            <AvatarFallback>{review.salon.merchant_commercial_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{review.salon.merchant_commercial_name}</span>
                        </div>
                        {/* <span className="mx-2">•</span>
                        <span className="font-medium">الخدمة:</span>
                        <span>{review.serviceType}</span> */}
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm">{review.comment}</p>
                      </div>
                      {/* {review.status === "منشور" && (
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="rounded-full">
                            إضافة رد
                          </Button>
                        </div>
                      )} */}
                      {review.salon_reply && (
                        <div className="mt-3 bg-muted/50 p-3 rounded-md">
                          <p className="text-sm font-medium">Salon Reply:</p>
                          <p className="text-sm mt-1">{review.salon_reply}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!isLoading && reviews.length > 0 && totalPages > 1 && (
                <div className="mt-6">
                  <PaginationWithInfo
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={perPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

