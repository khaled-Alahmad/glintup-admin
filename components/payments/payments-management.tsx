"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
import { ArrowUpDown, Calendar, Check, Filter, MoreHorizontal, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { fetchData } from "@/lib/apiHelper"
import { useToast } from "../ui/use-toast"
import { PaginationWithInfo } from "../ui/pagination-with-info"


const refunds = [
  {
    id: "1",
    customerName: "هند خالد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون مس بيوتي",
    salonLogo: "/placeholder.svg?height=32&width=32",
    requestDate: "2024-04-02",
    processDate: "2024-04-03",
    amount: "200 د.إ",
    reason: "إلغاء الحجز من قبل الصالون",
    status: "مكتمل",
    bookingId: "B-1237",
  },
  {
    id: "2",
    customerName: "محمد العلي",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    requestDate: "2024-04-03",
    processDate: "",
    amount: "150 د.إ",
    reason: "عدم رضا عن الخدمة",
    status: "قيد المراجعة",
    bookingId: "B-1240",
  },
]
interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  currency: string;
  formatted_amount: string;
  description: {
    en: string;
    ar: string;
  };
  status: 'pending' | 'completed' | 'failed';
  type: 'deposit' | 'withdrawal' | 'ad' | 'booking' | 'gift_card';
  is_refund: boolean;
  transactionable_id: number;
  transactionable_type: string;
  direction: 'in' | 'out';
  created_at: string;
  updated_at: string;
}
export default function PaymentsManagement() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const { toast } = useToast()
  // Add fetch function
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: perPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(dateFilter && {
          created_at: new Date(dateFilter.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }),
      });

      const response = await fetchData(`admin/transactions?${queryParams}`);
      if (response.success) {
        setTransactions(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setTotalItems(response.meta.total);
        setPerPage(response.meta.per_page);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل المعاملات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchQuery, statusFilter, typeFilter, dateFilter]);

  // Add helper function for transaction type
  function getTransactionType(type: string) {
    const types = {
      deposit: 'إيداع',
      withdrawal: 'سحب',
      ad: 'إعلان',
      booking: 'حجز',
      gift_card: 'بطاقة هدية'
    };
    return types[type as keyof typeof types] || type;
  }

  // Update status badge function
  function getStatusBadge(status: string) {
    const badges = {
      completed: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">مكتمل</Badge>,
      pending: <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">معلق</Badge>,
      failed: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">فشل</Badge>
    };
    return badges[status as keyof typeof badges] || <Badge variant="outline">{status}</Badge>;
  }



  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المعاملات المالية
        </h1>
        {/* <div className="flex gap-2">
          <Button asChild>
            <Link href="/payments/add">إضافة عملية دفع</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/payments/refund">إضافة طلب استرجاع</Link>
          </Button>
        </div> */}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22,458 د.إ</div>
            <p className="text-xs text-muted-foreground mt-1">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العمولات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,245 د.إ</div>
            <p className="text-xs text-muted-foreground mt-1">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">عمليات الاسترجاع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450 د.إ</div>
            <p className="text-xs text-muted-foreground mt-1">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">طلبات استرجاع معلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">بحاجة للمراجعة</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="payments">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>المعاملات المالية</CardTitle>
                <CardDescription>إدارة المدفوعات</CardDescription>
              </div>
              {/* <TabsList>
                <TabsTrigger value="payments">المدفوعات</TabsTrigger>
                <TabsTrigger value="refunds">طلبات الاسترجاع</TabsTrigger>
              </TabsList> */}
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payments">
            <TabsContent value="payments" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="بحث عن المدفوعات..."
                    className="pr-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <DatePicker
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    placeholder="تاريخ المعاملة"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="pending">معلق</SelectItem>
                      <SelectItem value="failed">فشل</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="نوع المعاملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="deposit">إيداع</SelectItem>
                      <SelectItem value="withdrawal">سحب</SelectItem>
                      <SelectItem value="ad">إعلان</SelectItem>
                      <SelectItem value="booking">حجز</SelectItem>
                      <SelectItem value="gift_card">بطاقة هدية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم العملية</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الاتجاه</TableHead>
                      <TableHead>استرجاع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`loading-${index}`} className="animate-pulse">
                          <TableCell><div className="h-4 w-16 bg-muted rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-24 bg-muted rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-48 bg-muted rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-24 bg-muted rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-20 bg-muted rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-16 bg-muted rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-16 bg-muted rounded"></div></TableCell>
                          <TableCell><div className="h-6 w-24 bg-muted rounded-full"></div></TableCell>
                          <TableCell><div className="h-8 w-8 bg-muted rounded"></div></TableCell>
                        </TableRow>
                      ))
                    ) : transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>#{transaction.id}</TableCell>
                          <TableCell>{getTransactionType(transaction.type)}</TableCell>
                          <TableCell className="max-w-[200px]">{transaction.description.ar}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(transaction.created_at).toLocaleDateString("en-US")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.formatted_amount} {transaction.currency}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={transaction.direction === 'in' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                              {transaction.direction === 'in' ? 'وارد' : 'صادر'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={transaction.is_refund ? 'bg-amber-50 text-amber-700' : ''}>
                              {transaction.is_refund ? 'استرجاع' : '-'}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setIsDetailsOpen(true);
                                }}>
                                  عرض التفاصيل
                                </DropdownMenuItem>
                                {/* {transaction.type === 'booking' && (
                                  <DropdownMenuItem>عرض الحجز</DropdownMenuItem>
                                )} */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          لا توجد معاملات متطابقة مع معايير البحث
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
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
            </TabsContent>

            {/* <TabsContent value="refunds" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="بحث عن طلبات الاسترجاع..." className="pr-9 w-full" />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="جميع الحالات" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">قيد المراجعة</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>الصالون</TableHead>
                      <TableHead>تاريخ الطلب</TableHead>
                      <TableHead>التكلفة</TableHead>
                      <TableHead>سبب الاسترجاع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refunds.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell>#{refund.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={refund.customerAvatar} alt={refund.customerName} />
                              <AvatarFallback>{refund.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{refund.customerName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={refund.salonLogo} alt={refund.salonName} />
                              <AvatarFallback>{refund.salonName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{refund.salonName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{new Date(refund.requestDate).toLocaleDateString("en-US")}</span>
                          </div>
                        </TableCell>
                        <TableCell>{refund.amount}</TableCell>
                        <TableCell>{refund.reason}</TableCell>
                        <TableCell>{getStatusBadge(refund.status)}</TableCell>
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
                              <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                              <DropdownMenuItem>عرض الحجز</DropdownMenuItem>
                              {refund.status === "قيد المراجعة" && (
                                <>
                                  <DropdownMenuItem className="text-green-600">قبول الاسترجاع</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">رفض الاسترجاع</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent> */}
          </Tabs>
        </CardContent>
      </Card>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل المعاملة #{selectedTransaction?.id}</DialogTitle>
            <DialogDescription>عرض تفاصيل المعاملة المالية</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">رقم العملية</Label>
                <div className="col-span-2 font-medium">#{selectedTransaction.id}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">نوع المعاملة</Label>
                <div className="col-span-2">{getTransactionType(selectedTransaction.type)}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">الوصف</Label>
                <div className="col-span-2">{selectedTransaction.description.ar}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">المبلغ</Label>
                <div className="col-span-2 font-medium">
                  {selectedTransaction.formatted_amount} {selectedTransaction.currency}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">الاتجاه</Label>
                <div className="col-span-2">
                  <Badge variant="outline" className={selectedTransaction.direction === 'in' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                    {selectedTransaction.direction === 'in' ? 'وارد' : 'صادر'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">الحالة</Label>
                <div className="col-span-2">{getStatusBadge(selectedTransaction.status)}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">استرجاع</Label>
                <div className="col-span-2">
                  <Badge variant="outline" className={selectedTransaction.is_refund ? 'bg-amber-50 text-amber-700' : ''}>
                    {selectedTransaction.is_refund ? 'استرجاع' : '-'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">تاريخ المعاملة</Label>
                <div className="col-span-2">
                  {new Date(selectedTransaction.created_at).toLocaleDateString("en-US")}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

