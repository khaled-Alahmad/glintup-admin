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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trash2, Copy, Eye } from "lucide-react";
import { fetchData } from "@/lib/apiHelper";
import { useToast } from "../ui/use-toast";
import { PaginationWithInfo } from "../ui/pagination-with-info";
interface GiftCard {
  id: number;
  code: string;
  sender_id: number;
  recipient_id: number | null;
  phone_code: string;
  phone: string;
  full_phone: string;
  type: string;
  amount: string;
  currency: string | null;
  services: number[];
  services_data: {
    id: number;
    name: {
      en: string;
      ar: string;
    };
    duration_minutes: number;
    final_price: number;
  }[];
  message: string;
  is_used: boolean;
  sender: {

    id: number;
    full_phone: string;
    full_name: string;
    avatar: string | null;
  };
  recipient: {
    id: number;
    email: string;
    full_name: string;
    avatar: string | null;
  } | null;
  created_at: string;
  updated_at: string;
}

export default function GiftCardsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentGiftCard, setCurrentGiftCard] = useState<GiftCard | null>(null);
  // Add these state variables
  const [isLoading, setIsLoading] = useState(false);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(20);

  // Update the fetchGiftCards function
  const fetchGiftCards = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: perPage.toString(),
        search: searchQuery,
        ...(statusFilter === 'used' ? { is_used: '1' } : {}),
        ...(statusFilter === 'active' ? { is_used: '0' } : {})
      });

      const response = await fetchData(`admin/gift-cards?${queryParams}`);
      if (response.success) {
        setGiftCards(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setTotalItems(response.meta.total);
        setPerPage(response.meta.per_page);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل بطاقات الهدايا",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to include dependencies
  useEffect(() => {
    fetchGiftCards();
  }, [currentPage, searchQuery, statusFilter]);

  const copyGiftCardCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("تم نسخ الكود: " + code);
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: Boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800";

      case false:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // الحصول على اسم الحالة بالعربية
  const getStatusName = (status: Boolean) => {
    switch (status) {
      case true:
        return "مستخدمة";

      case false:
        return "غير مستخدمة";
      default:
        return "غير معروف";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة بطاقات الهدايا</h1>
        {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}> */}
        {/* <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة بطاقة هدية جديدة
            </Button>
          </DialogTrigger> */}
        {/* <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة بطاقة هدية جديدة</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل بطاقة الهدية الجديدة. اضغط على حفظ عند الانتهاء.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                addGiftCard({
                  amount: Number.parseFloat(formData.get("amount") as string),
                  expiryDate: formData.get("expiryDate") as string,
                  name: formData.get("name") as string,

                  recipientName: formData.get("recipientName") as string,
                  recipientEmail: formData.get("recipientEmail") as string,
                  senderName: formData.get("senderName") as string,
                  senderEmail: formData.get("senderEmail") as string,
                  message: formData.get("message") as string,
                });
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipientName" className="text-right">
                    اسم المناسبة
                  </Label>
                  <Input id="name" name="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    المبلغ (د.إ)
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiryDate" className="text-right">
                    تاريخ الانتهاء
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipientName" className="text-right">
                    اسم المستلم
                  </Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipientEmail" className="text-right">
                    بريد المستلم
                  </Label>
                  <Input
                    id="recipientEmail"
                    name="recipientEmail"
                    type="email"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="senderName" className="text-right">
                    اسم المرسل
                  </Label>
                  <Input
                    id="senderName"
                    name="senderName"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="senderEmail" className="text-right">
                    بريد المرسل
                  </Label>
                  <Input
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="message" className="text-right">
                    رسالة
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">إنشاء بطاقة الهدية</Button>
              </DialogFooter>
            </form>
          </DialogContent> */}
        {/* </Dialog> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة بطاقات الهدايا</CardTitle>
          <CardDescription>
            عرض وإدارة جميع بطاقات الهدايا في التطبيق
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث عن بطاقة هدية..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter || "all"}
              onValueChange={(value) =>
                setStatusFilter(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشطة</SelectItem>
                <SelectItem value="used">مستخدمة</SelectItem>
                <SelectItem value="expired">منتهية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>كود البطاقة</TableHead>
                  <TableHead>نوع البطاقة</TableHead>

                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الانشاء</TableHead>
                  <TableHead>المستلم</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              {/* ... existing table header ... */}
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`loading-${index}`} className="animate-pulse">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-32 bg-muted rounded"></div>
                          <div className="h-6 w-6 bg-muted rounded"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-20 bg-muted rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 bg-muted rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-24 bg-muted rounded-full"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-muted rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-28 bg-muted rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-muted rounded"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : giftCards.length > 0 ? (
                  giftCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {card.code}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyGiftCardCode(card.code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{card.type == "services" ? "خدمات" : card.type == "amount" ? "مبلغ مالي " : ""} </TableCell>

                      <TableCell>{card.amount} د.إ</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(card.is_used)}>
                          {getStatusName(card.is_used)}
                        </Badge>
                      </TableCell>
                      <TableCell>{card.created_at}</TableCell>
                      <TableCell>{card.recipient?.full_name || "غير محدد"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentGiftCard(card);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      لا توجد بطاقات هدايا متطابقة مع معايير البحث
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
        </CardContent>
      </Card>

      {/* مربع حوار عرض تفاصيل بطاقة الهدية */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل بطاقة الهدية</DialogTitle>
            <DialogDescription>عرض جميع تفاصيل بطاقة الهدية</DialogDescription>
          </DialogHeader>
          {currentGiftCard && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    كود البطاقة
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{currentGiftCard.code}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyGiftCardCode(currentGiftCard.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    نوع البطاقة
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{currentGiftCard.type == "services" ? "خدمات" : currentGiftCard.type == "amount" ? "مبلغ مالي " : ""}</p>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      //   onClick={() => copyGiftCardCode(currentGiftCard.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    المبلغ
                  </h3>
                  <p className="font-medium">{currentGiftCard.amount} د.إ</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    الحالة
                  </h3>
                  <Badge className={getStatusColor(currentGiftCard.is_used)}>
                    {getStatusName(currentGiftCard.is_used)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    تاريخ الإنشاء
                  </h3>
                  <p>{currentGiftCard.created_at}</p>
                </div>
                {/* <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    تاريخ الانتهاء
                  </h3>
                  <p>{currentGiftCard.expiryDate}</p>
                </div> */}
                {/* {currentGiftCard.usedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      تاريخ الاستخدام
                    </h3>
                    <p>{currentGiftCard.usedAt}</p>
                  </div>
                )} */}
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium mb-2">معلومات المستلم والمرسل</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      اسم المستلم
                    </h3>
                    <p>{currentGiftCard.recipient?.full_name || "غير محدد"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      رقم المستلم
                    </h3>
                    <p style={{ unicodeBidi: "plaintext", textAlign: 'right' }}>{currentGiftCard.recipient?.email || "غير محدد"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      اسم المرسل
                    </h3>
                    <p>{currentGiftCard.sender.full_name || "غير محدد"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      رقم المرسل
                    </h3>
                    <p style={{ unicodeBidi: "plaintext", textAlign: "right" }}>{currentGiftCard.sender.full_phone || "غير محدد"}</p>
                  </div>
                </div>
              </div>

              {currentGiftCard.message && (
                <div className="border-t pt-4 mt-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    الرسالة
                  </h3>
                  <p className="p-3 bg-muted rounded-md">
                    {currentGiftCard.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
