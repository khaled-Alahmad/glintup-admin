"use client";

import { useState } from "react";
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

// تعريف نوع البيانات لبطاقة الهدية
interface GiftCard {
  id: string;
  code: string;
  name: string;

  amount: number;
  status: "active" | "used" | "expired";
  expiryDate: string;
  createdAt: string;
  usedAt?: string;
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  senderEmail?: string;
  message?: string;
}

export default function GiftCardsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentGiftCard, setCurrentGiftCard] = useState<GiftCard | null>(null);

  // بيانات بطاقات الهدايا (في تطبيق حقيقي، ستأتي من قاعدة البيانات)
  const [giftCards, setGiftCards] = useState<GiftCard[]>([
    {
      id: "1",
      name: "شهر رمضان",
      code: "GIFT-1234-5678",
      amount: 200,
      status: "active",
      expiryDate: "2023-12-31",
      createdAt: "2023-01-15",
      recipientName: "سارة أحمد",
      recipientEmail: "sara@example.com",
      senderName: "محمد علي",
      senderEmail: "mohamed@example.com",
      message: "عيد ميلاد سعيد!",
    },
    {
      id: "2",
      code: "GIFT-8765-4321",
      name: "عيد الفطر",

      amount: 500,
      status: "used",
      expiryDate: "2023-10-15",
      createdAt: "2023-01-20",
      usedAt: "2023-02-10",
      recipientName: "نورة خالد",
      recipientEmail: "noura@example.com",
      senderName: "فهد سعد",
      senderEmail: "fahad@example.com",
      message: "مبروك التخرج!",
    },
    {
      id: "3",
      code: "GIFT-9876-5432",
      amount: 300,
      name: "عيد الاضحى",

      status: "expired",
      expiryDate: "2023-06-30",
      createdAt: "2023-01-25",
      recipientName: "ليلى محمد",
      recipientEmail: "layla@example.com",
      senderName: "عبدالله ناصر",
      senderEmail: "abdullah@example.com",
    },
  ]);

  // إضافة بطاقة هدية جديدة
  const addGiftCard = (
    giftCard: Omit<GiftCard, "id" | "code" | "createdAt" | "status">
  ) => {
    const newGiftCard: GiftCard = {
      ...giftCard,
      id: Math.random().toString(36).substring(2, 9), // توليد معرف عشوائي
      code: generateGiftCardCode(), // توليد كود عشوائي
      createdAt: new Date().toISOString().split("T")[0], // تاريخ اليوم
      status: "active",
    };
    setGiftCards([...giftCards, newGiftCard]);
    setIsAddDialogOpen(false);
  };

  // توليد كود عشوائي لبطاقة الهدية
  const generateGiftCardCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "GIFT-";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code += "-";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // حذف بطاقة هدية
  const deleteGiftCard = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف بطاقة الهدية هذه؟")) {
      setGiftCards(giftCards.filter((card) => card.id !== id));
    }
  };

  // نسخ كود بطاقة الهدية
  const copyGiftCardCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("تم نسخ الكود: " + code);
  };

  // تصفية بطاقات الهدايا حسب البحث والحالة
  const filteredGiftCards = giftCards.filter((card) => {
    const matchesSearch =
      card.code.includes(searchQuery) ||
      (card.recipientName && card.recipientName.includes(searchQuery)) ||
      (card.recipientEmail && card.recipientEmail.includes(searchQuery));
    const matchesStatus = statusFilter ? card.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // الحصول على اسم الحالة بالعربية
  const getStatusName = (status: string) => {
    switch (status) {
      case "active":
        return "نشطة";
      case "used":
        return "مستخدمة";
      case "expired":
        return "منتهية";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة بطاقات الهدايا</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة بطاقة هدية جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
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
          </DialogContent>
        </Dialog>
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
                  <TableHead>اسم المناسبة</TableHead>

                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>المستلم</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGiftCards.length > 0 ? (
                  filteredGiftCards.map((card) => (
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
                      <TableCell>{card.name} </TableCell>

                      <TableCell>{card.amount} د.إ</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(card.status)}>
                          {getStatusName(card.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{card.expiryDate}</TableCell>
                      <TableCell>{card.recipientName || "غير محدد"}</TableCell>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => deleteGiftCard(card.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
                    اسم المناسبة
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{currentGiftCard.name}</p>
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
                  <Badge className={getStatusColor(currentGiftCard.status)}>
                    {getStatusName(currentGiftCard.status)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    تاريخ الإنشاء
                  </h3>
                  <p>{currentGiftCard.createdAt}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    تاريخ الانتهاء
                  </h3>
                  <p>{currentGiftCard.expiryDate}</p>
                </div>
                {currentGiftCard.usedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      تاريخ الاستخدام
                    </h3>
                    <p>{currentGiftCard.usedAt}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium mb-2">معلومات المستلم والمرسل</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      اسم المستلم
                    </h3>
                    <p>{currentGiftCard.recipientName || "غير محدد"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      بريد المستلم
                    </h3>
                    <p>{currentGiftCard.recipientEmail || "غير محدد"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      اسم المرسل
                    </h3>
                    <p>{currentGiftCard.senderName || "غير محدد"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      بريد المرسل
                    </h3>
                    <p>{currentGiftCard.senderEmail || "غير محدد"}</p>
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
