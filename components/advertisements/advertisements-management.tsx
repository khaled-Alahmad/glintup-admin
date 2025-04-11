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
import { Calendar, Filter, MoreHorizontal, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { fetchData, updateData } from "@/lib/apiHelper"
import { useToast } from "@/hooks/use-toast"
import { PaginationWithInfo } from "../ui/pagination-with-info"
interface Advertisement {
  id: number;
  salon_id: number | null;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  image: string;
  image_url: string;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  views: number;
  clicks: number;
  salon: {
    id: number;
    name: string;
    logo_url: string;
  } | null;
  created_at: string;
  updated_at: string;
}

const advertisements = [
  {
    id: "1",
    title: "عروض الصيف المميزة",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون الأميرة",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "نشط",
    views: 1245,
    clicks: 320,
    amount: "1,200 د.إ",
    position: "الصفحة الرئيسية",
  },
  {
    id: "2",
    title: "خصم 30% على جميع الخدمات",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-05-15",
    endDate: "2024-06-15",
    status: "نشط",
    views: 980,
    clicks: 210,
    amount: "800 د.إ",
    position: "صفحة الصالونات",
  },
  {
    id: "3",
    title: "باقات العناية بالشعر",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون جلام",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-05-01",
    endDate: "2024-05-30",
    status: "منتهي",
    views: 750,
    clicks: 180,
    amount: "600 د.إ",
    position: "الصفحة الرئيسية",
  },
  {
    id: "4",
    title: "عروض العناية بالبشرة",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون مس بيوتي",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-06-10",
    endDate: "2024-07-10",
    status: "قيد المراجعة",
    views: 0,
    clicks: 0,
    amount: "900 د.إ",
    position: "صفحة الصالونات",
  },
  {
    id: "5",
    title: "خصومات العيد",
    image: "/placeholder.svg?height=80&width=160",
    salonName: "صالون روز",
    salonLogo: "/placeholder.svg?height=32&width=32",
    startDate: "2024-06-15",
    endDate: "2024-07-15",
    status: "مرفوض",
    views: 0,
    clicks: 0,
    amount: "750 د.إ",
    position: "الصفحة الرئيسية",
  },
]

export default function AdvertisementsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState("")
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Add fetch function
  const fetchAdvertisements = async () => {
    try {
      setIsLoading(true);
      const searchParam = searchQuery ? `&search=${searchQuery}` : '';
      const statusParam = statusFilter != "all" ? `&is_active=${statusFilter}` : '';

      const response = await fetchData(`admin/promotion-ads?page=${currentPage}&limit=${perPage}${searchParam}${statusParam}`);
      if (response.success) {
        setAdvertisements(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Failed to fetch advertisements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect for fetching data
  useEffect(() => {
    fetchAdvertisements();
  }, [currentPage, searchQuery, statusFilter]);

  const handleStatusUpdate = async (adId: number, action: 'approve' | 'reject' | 'stop') => {
    try {
      const response = await updateData(`admin/promotion-ads/${adId}/status`, { status: action });
      if (response.success) {
        await fetchAdvertisements();
        toast({
          title: "تم تحديث الحالة بنجاح",
          description: "تم تحديث حالة الإعلان بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  // const filteredAds = advertisements.filter((ad) => {
  //   const matchesSearch =
  //     ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     ad.salonName.toLowerCase().includes(searchQuery.toLowerCase())

  //   const matchesStatus = statusFilter === "all" || ad.status === statusFilter

  //   return matchesSearch && matchesStatus
  // })

  const getStatusBadge = (status: Boolean) => {
    switch (status) {
      case true:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            نشط
          </Badge>
        )

      case false:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            غير نشط
          </Badge>
        )
      default:
        return <Badge variant="outline">{status === true ? "نشط " : "غير نشط"}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة الإعلانات</h1>
        <Button asChild>
          <Link href="/advertisements/add">إضافة إعلان جديد</Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإعلانات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">في النظام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إعلانات نشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">حالياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إعلانات قيد المراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">بحاجة للمراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,600 د.إ</div>
            <p className="text-xs text-muted-foreground mt-1">من الإعلانات</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>الإعلانات</CardTitle>
                <CardDescription>إدارة الإعلانات المدفوعة في التطبيق</CardDescription>
              </div>
              {/* <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
                <TabsTrigger value="expired">منتهي</TabsTrigger>
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
                  placeholder="بحث عن الإعلانات..."
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

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الإعلان</TableHead>
                    <TableHead>الصالون</TableHead>
                    <TableHead>الفترة</TableHead>
                    <TableHead>المشاهدات</TableHead>
                    <TableHead>النقرات</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : advertisements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-muted-foreground">لا توجد إعلانات متاحة</p>
                          <Button variant="outline" asChild className="mt-2">
                            <Link href="/advertisements/add">إضافة إعلان جديد</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : advertisements.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-24 rounded-md overflow-hidden bg-muted">
                            <img
                              src={ad.image_url}
                              alt={ad.title.ar}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-medium">{ad.title.ar}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {ad.salon && (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={ad.salon.logo_url} alt={ad.salon.name} />
                              <AvatarFallback>{ad.salon.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{ad.salon.name}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <div className="flex items-center">
                            <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span>{new Date(ad.valid_from).toLocaleDateString("en-US")}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span>{new Date(ad.valid_to).toLocaleDateString("en-US")}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{ad.views}</TableCell>
                      <TableCell>{ad.clicks}</TableCell>
                      <TableCell>
                        {getStatusBadge(ad.is_active)}
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
                              <Link href={`/advertisements/${ad.id}`}>عرض التفاصيل</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/advertisements/${ad.id}/edit`}>تعديل الإعلان</Link>
                            </DropdownMenuItem>
                            {!ad.is_active && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(ad.id, 'approve')}>
                                تفعيل الإعلان
                              </DropdownMenuItem>
                            )}
                            {ad.is_active && (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleStatusUpdate(ad.id, 'stop')}
                              >
                                إيقاف الإعلان
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                  ))}
                  <div className="mt-4">
                    {!isLoading && advertisements.length > 0 && totalPages > 1 && (
                      <PaginationWithInfo
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={perPage}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </div>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

