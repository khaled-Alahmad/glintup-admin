"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  MoreHorizontal, 
  Gift as GiftIcon,
  Eye,
  ArrowUpDown
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchData, deleteData } from "@/lib/apiHelper";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import { Gift } from "@/types/gift";
import { useToast } from "@/hooks/use-toast";

export default function GiftsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch gifts data
  const fetchGifts = async (page = 1) => {
    setIsLoading(true);
    try {
      const filters = {
        page: page.toString(),
        per_page: "10",
        search: searchQuery || "",
        sort_by: "order",
        sort_order: sortOrder,
      };

      const response = await fetchData("admin/gifts", filters);
      
      if (response.success) {
        setGifts(response.data);
        setTotalPages(response.pagination?.last_page || 1);
        setTotalItems(response.pagination?.total || 0);
      } else {
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: response.message || "فشل في تحميلقائمة التصاميم",
        });
      }
    } catch (error) {
      console.error("Error fetching gifts:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميلقائمة التصاميم",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete gift
  const deleteGift = async (id: number) => {
    try {
      const response = await deleteData(`admin/gifts/${id}`);
      
      if (response.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الهدية بنجاح",
        });
        fetchGifts(currentPage);
      } else {
        toast({
          variant: "destructive",
          title: "خطأ في الحذف",
          description: response.message || "فشل في حذف الهدية",
        });
      }
    } catch (error) {
      console.error("Error deleting gift:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الهدية",
      });
    }
    setIsDeleteDialogOpen(false);
    setCurrentGift(null);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchGifts(1);
  };

  // Handle sort
  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchGifts(currentPage);
  }, [currentPage, sortOrder]);

  const filteredGifts = gifts.filter((gift) =>
    (gift.name?.ar?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (gift.name?.en?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة تصاميم بطاقات الهدايا</h1>
          <p className="text-muted-foreground">
            إدارة وتنظيم الهدايا المتاحة في النظام
          </p>
        </div>
        <Link href="/gifts/add">
          <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            إضافة هدية جديدة
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GiftIcon className="h-5 w-5" />
            البحث والفلاتر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="البحث في الهدايا..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSearch} 
                variant="outline"
                className="min-w-[100px]"
              >
                <Search className="mr-2 h-4 w-4" />
                بحث
              </Button>
              <Button 
                onClick={handleSort} 
                variant="outline"
                className="min-w-[100px]"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                ترتيب
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gifts Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الهدايا ({totalItems})</CardTitle>
          <CardDescription>
            إدارة جميع الهدايا المتاحة في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredGifts.length === 0 ? (
            <div className="text-center py-12">
              <GiftIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">لا توجد هدايا</h3>
              <p className="mt-2 text-muted-foreground">
                لم يتم العثور على أي هدايا. ابدأ بإضافة هدية جديدة.
              </p>
              <Link href="/gifts/add">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة هدية جديدة
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16">#</TableHead>
                    <TableHead className="w-20">الأيقونة</TableHead>
                    <TableHead>الاسم (عربي)</TableHead>
                    <TableHead>الاسم (إنجليزي)</TableHead>
                    {/* <TableHead className="w-24">الترتيب</TableHead> */}
                    <TableHead className="w-24">الحالة</TableHead>
                    <TableHead className="w-32">تاريخ الإنشاء</TableHead>
                    <TableHead className="w-24 text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGifts.map((gift) => (
                    <TableRow key={gift.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{gift.id}</TableCell>
                      <TableCell>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border">
                          <Image
                            src={gift.icon_url || "/placeholder.jpg"}
                            alt={gift.name?.ar || "هدية"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{gift.name?.ar || "غير محدد"}</TableCell>
                      <TableCell className="text-muted-foreground">{gift.name?.en || "غير محدد"}</TableCell>
                      {/* <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {gift.order}
                        </Badge>
                      </TableCell> */}
                      <TableCell>
                        <Badge
                          variant={gift.is_active ? "default" : "secondary"}
                          className={gift.is_active ? "bg-green-600" : ""}
                        >
                          {gift.is_active ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(gift.created_at).toLocaleDateString("ar-SY")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentGift(gift);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <Link href={`/gifts/${gift.id}`}>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                تعديل
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentGift(gift);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationWithInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Gift Dialog */}
      {currentGift && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GiftIcon className="h-5 w-5" />
                تفاصيل الهدية
              </DialogTitle>
              <DialogDescription>
                عرض تفاصيل الهدية #{currentGift.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-muted">
                  <Image
                    src={currentGift.icon_url || "/placeholder.jpg"}
                    alt={currentGift.name?.ar || "هدية"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    الاسم بالعربية
                  </label>
                  <p className="mt-1 font-medium">{currentGift.name?.ar || "غير محدد"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    الاسم بالإنجليزية
                  </label>
                  <p className="mt-1 font-medium">{currentGift.name?.en || "غير محدد"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    الترتيب
                  </label>
                  <p className="mt-1 font-medium">{currentGift.order}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    الحالة
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={currentGift.is_active ? "default" : "secondary"}
                      className={currentGift.is_active ? "bg-green-600" : ""}
                    >
                      {currentGift.is_active ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ الإنشاء
                  </label>
                  <p className="mt-1 font-medium">
                    {new Date(currentGift.created_at).toLocaleDateString("ar-SY")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    آخر تحديث
                  </label>
                  <p className="mt-1 font-medium">
                    {new Date(currentGift.updated_at).toLocaleDateString("ar-SY")}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Link href={`/gifts/${currentGift.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  تعديل
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => setIsViewDialogOpen(false)}
              >
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف الهدية "{currentGift?.name?.ar || "غير محدد"}"؟ 
              هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentGift && deleteGift(currentGift.id)}
              className="bg-red-600 hover:bg-red-700 ml-2"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
