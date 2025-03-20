"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Edit, Printer, Trash } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface AppointmentDetailsProps {
  appointmentId: string;
}

// بيانات الحجز (في تطبيق حقيقي ستأتي من API)
const appointmentData = {
  id: "1",
  customerName: "سارة أحمد",
  customerAvatar: "/placeholder.svg?height=64&width=64",
  customerPhone: "050-1234567",
  customerEmail: "sara@example.com",
  salonName: "صالون الأميرة",
  salonLogo: "/placeholder.svg?height=64&width=64",
  salonAddress: "شارع الشيخ زايد، دبي",
  salonPhone: "04-1234567",
  date: "2024-04-03",
  time: "10:30 صباحاً",
  status: "مؤكد",
  notes: "العميلة تفضل الصبغة باللون البني الفاتح",
  services: [
    { id: "1", name: "قص شعر", price: 150, duration: 60, quantity: 1 },
    { id: "2", name: "صبغة شعر", price: 350, duration: 120, quantity: 1 },
  ],
  paymentStatus: "مدفوع",
  paymentMethod: "بطاقة ائتمان",
  createdAt: "2024-03-30",
  updatedAt: "2024-04-01",
};

export default function AppointmentDetails({
  appointmentId,
}: AppointmentDetailsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // حساب إجمالي السعر والمدة
  const totalPrice = appointmentData.services.reduce(
    (sum, service) => sum + service.price * service.quantity,
    0
  );
  const totalDuration = appointmentData.services.reduce(
    (sum, service) => sum + service.duration * service.quantity,
    0
  );

  const handleDelete = () => {
    // هنا يتم معالجة حذف الحجز
    toast({
      title: "تم حذف الحجز بنجاح",
      description: "تم حذف الحجز من النظام",
    });

    // التوجيه إلى صفحة الحجوزات
    router.push("/appointments");
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مؤكد":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            مؤكد
          </Badge>
        );
      case "معلق":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            معلق
          </Badge>
        );
      case "ملغي":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            ملغي
          </Badge>
        );
      case "مكتمل":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            مكتمل
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/appointments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            تفاصيل الحجز
          </h1>
          {getStatusBadge(appointmentData.status)}
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 ml-1" />
            طباعة
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/appointments/${appointmentId}/edit`}>
              <Edit className="h-4 w-4 ml-1" />
              تعديل
            </Link>
          </Button>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 ml-1" />
                حذف
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تأكيد حذف الحجز</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد من رغبتك في حذف هذا الحجز؟ لا يمكن التراجع عن هذا
                  الإجراء.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  حذف
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* معلومات الحجز الأساسية */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>معلومات الحجز</CardTitle>
            <CardDescription>تفاصيل الحجز الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* معلومات العميل والصالون */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">معلومات العميل</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={appointmentData.customerAvatar}
                      alt={appointmentData.customerName}
                    />
                    <AvatarFallback>
                      {appointmentData.customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">
                      {appointmentData.customerName}
                    </p>
                    <p className="text-muted-foreground">
                      {appointmentData.customerPhone}
                    </p>
                    <p className="text-muted-foreground">
                      {appointmentData.customerEmail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">معلومات الصالون</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage
                      src={appointmentData.salonLogo}
                      alt={appointmentData.salonName}
                    />
                    <AvatarFallback>
                      {appointmentData.salonName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">
                      {appointmentData.salonName}
                    </p>
                    <p className="text-muted-foreground">
                      {appointmentData.salonAddress}
                    </p>
                    <p className="text-muted-foreground">
                      {appointmentData.salonPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* معلومات الموعد */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">معلومات الموعد</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">التاريخ</p>
                    <p>
                      {new Date(appointmentData.date).toLocaleDateString(
                        "ar-SA"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">الوقت</p>
                    <p>{appointmentData.time}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* الخدمات */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">الخدمات</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-right p-3">الخدمة</th>
                      <th className="text-center p-3">المدة (دقيقة)</th>
                      <th className="text-center p-3">السعر (د.إ)</th>
                      <th className="text-center p-3">الكمية</th>
                      <th className="text-center p-3">الإجمالي (د.إ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentData.services.map((service) => (
                      <tr key={service.id} className="border-t">
                        <td className="p-3">{service.name}</td>
                        <td className="p-3 text-center">{service.duration}</td>
                        <td className="p-3 text-center">{service.price}</td>
                        <td className="p-3 text-center">{service.quantity}</td>
                        <td className="p-3 text-center font-medium">
                          {service.price * service.quantity}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-muted/30">
                      <td className="p-3 font-bold">الإجمالي</td>
                      <td className="p-3 text-center font-bold">
                        {totalDuration} دقيقة
                      </td>
                      <td className="p-3"></td>
                      <td className="p-3"></td>
                      <td className="p-3 text-center font-bold">
                        {totalPrice} د.إ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ملاحظات */}
            {appointmentData.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">ملاحظات</h3>
                  <p className="p-3 bg-muted/20 rounded-md">
                    {appointmentData.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">رقم الحجز</span>
                <span className="font-medium">{appointmentData.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">حالة الحجز</span>
                <span>{getStatusBadge(appointmentData.status)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">حالة الدفع</span>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {appointmentData.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">طريقة الدفع</span>
                <span>{appointmentData.paymentMethod}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">تاريخ الإنشاء</span>
                <span>
                  {new Date(appointmentData.createdAt).toLocaleDateString(
                    "ar-SA"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">آخر تحديث</span>
                <span>
                  {new Date(appointmentData.updatedAt).toLocaleDateString(
                    "ar-SA"
                  )}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {appointmentData.status === "معلق" && (
              <Button className="w-full" variant="default">
                تأكيد الحجز
              </Button>
            )}
            {(appointmentData.status === "معلق" ||
              appointmentData.status === "مؤكد") && (
              <Button className="w-full" variant="destructive">
                إلغاء الحجز
              </Button>
            )}
            {appointmentData.status === "مؤكد" && (
              <Button className="w-full" variant="default">
                تحديد كمكتمل
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
