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
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Printer,
  Trash,
  XCircle,
} from "lucide-react";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchData, updateData } from "@/lib/apiHelper";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface AppointmentDetailsProps {
  appointmentId: string;
}
interface Service {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  icon_url: string | null;
  duration_minutes: number;
  price: string;
  final_price: number;
  currency: string;
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

interface BookingService {
  id: number;
  booking_id: number;
  service: Service;

  service_id: number;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  full_name: string;
  avatar: string | null;
  full_phone: string;
  email?: string;
}

interface Salon {
  id: number;
  name: string;
  merchant_commercial_name: string;
  icon_url: string;
  full_phone: string;
  email: string;
  location: string;
}

interface Booking {
  id: number;
  code: string;
  date: string;
  time: string;
  end_time: string;
  total_service_time_in_minutes: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "paid" | "unpaid";
  notes: string | null;
  salon_notes: string | null;
  user: User;
  salon: Salon;
  booking_services: BookingService[];
  created_at: string;
  updated_at: string;
}

export default function AppointmentDetails({
  appointmentId,
}: AppointmentDetailsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<string | null>(
    null
  );

  // Add the handleStatusChange function
  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await updateData(`admin/bookings/${appointmentId}`, {
        status: newStatus,
      });

      if (response.success) {
        toast({
          title: "تم",
          description: "تم تحديث حالة الحجز بنجاح",
        });
        fetchBooking();
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الحجز",
        variant: "destructive",
      });
    } finally {
      setIsStatusDialogOpen(false);
      setPendingStatusChange(null);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [appointmentId]);

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(`admin/bookings/${appointmentId}`);
      if (response.success) {
        setBooking(response.data);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب بيانات الحجز",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // حساب إجمالي السعر والمدة
  const totalPrice = booking?.booking_services.reduce(
    (sum, service) => sum + service.service.final_price,
    0
  );
  const totalDuration = booking?.booking_services.reduce(
    (sum, service) => sum + service.service.duration_minutes,
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
      case "confirmed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            مؤكد
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            معلق
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            ملغي
          </Badge>
        );
      case "completed":
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
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <XCircle className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">الحجز غير موجود</h3>
        <Button variant="outline" asChild>
          <Link href="/appointments">العودة إلى الحجوزات</Link>
        </Button>
      </div>
    );
  }

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
        {/* <div className="flex gap-2 print:hidden">
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
        </div> */}
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
                      src={booking.user.avatar || "/placeholder.svg"}
                      alt={booking.user.full_name}
                    />
                    <AvatarFallback>
                      {booking.user.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">
                      {booking.user.full_name}
                    </p>
                    <p
                      className="text-muted-foreground"
                      style={{ unicodeBidi: "plaintext" }}
                    >
                      {booking.user.full_phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">معلومات الصالون</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage
                      src={booking.salon.icon_url || "/placeholder.svg"}
                      alt={booking.salon.merchant_commercial_name}
                    />
                    <AvatarFallback>
                      {booking.salon.merchant_commercial_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">
                      {booking.salon.merchant_commercial_name}
                    </p>
                    <p className="text-muted-foreground">
                      {booking.salon.location}
                    </p>
                    <p
                      className="text-muted-foreground"
                      style={{ unicodeBidi: "plaintext" }}
                    >
                      {booking.salon.full_phone}
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
                    <p>{new Date(booking.date).toLocaleDateString("en-US")}</p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">الوقت</p>
                    <p>
                      {booking.time} - {booking.end_time}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            <Separator />

            {/* الخدمات */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">الخدمات</h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-right p-3 font-semibold whitespace-nowrap">
                        الخدمة
                      </th>
                      <th className="text-center p-3 font-semibold whitespace-nowrap">
                        المدة (دقيقة)
                      </th>
                      <th className="text-center p-3 font-semibold whitespace-nowrap">
                        السعر
                      </th>
                      <th className="text-center p-3 font-semibold whitespace-nowrap">
                        الإجمالي
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.booking_services.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-center text-muted-foreground"
                        >
                          لا توجد خدمات لهذا الحجز
                        </td>
                      </tr>
                    ) : (
                      booking.booking_services.map((bookingService) => (
                        <tr
                          key={bookingService.id}
                          className="border-t hover:bg-muted/10 transition"
                        >
                          <td className="p-3">
                            {/* i need add service img  */}
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    bookingService.service.icon_url ||
                                    "/placeholder.svg"
                                  }
                                  alt={bookingService.service.name.en}
                                />
                                <AvatarFallback>
                                  {bookingService.service.name.en.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{bookingService.service.name.en}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {bookingService.service.duration_minutes}
                          </td>
                          <td className="p-3 text-center">
                            {bookingService.service.final_price}{" "}
                            {bookingService.service.currency}
                          </td>
                          <td className="p-3 text-center font-medium">
                            {bookingService.service.final_price}{" "}
                            {bookingService.service.currency}
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="border-t bg-muted/20">
                      <td className="p-3 font-bold">الإجمالي</td>
                      <td className="p-3 text-center font-bold">
                        {totalDuration} دقيقة
                      </td>
                      <td className="p-3"></td>
                      <td className="p-3 text-center font-bold">
                        {totalPrice}{" "}
                        {booking.booking_services[0]?.service.currency || "د.إ"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ملاحظات */}
            {/* Notes */}
            {(booking.notes || booking.salon_notes) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">ملاحظات</h3>
                  {booking.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        ملاحظات العميل
                      </p>
                      <p className="p-3 bg-muted/20 rounded-md">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                  {booking.salon_notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        ملاحظات الصالون
                      </p>
                      <p className="p-3 bg-muted/20 rounded-md">
                        {booking.salon_notes}
                      </p>
                    </div>
                  )}
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
                <span className="font-medium">{booking.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">حالة الحجز</span>
                <span>{getStatusBadge(booking.status)}</span>
              </div>
              {/* <div className="flex justify-between items-center">
                <span className="text-muted-foreground">حالة الدفع</span>
                <Badge
                  variant="outline"
                  className={`
                    ${booking.payment_status === "paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
                    `}
                >
                  {booking.payment_status === "paid" ? "مدفوع" : "غير مدفوع"}
                </Badge>
              </div> */}
              {/* <div className="flex justify-between items-center">
                <span className="text-muted-foreground">طريقة الدفع</span>
                <span>{appointmentData.paymentMethod}</span>
              </div> */}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">تاريخ الإنشاء</span>
                <span>
                  {new Date(booking.created_at).toLocaleDateString("en-US")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">آخر تحديث</span>
                <span>
                  {new Date(booking.updated_at).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Dialog
              open={isStatusDialogOpen}
              onOpenChange={setIsStatusDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تأكيد تغيير الحالة</DialogTitle>
                  <DialogDescription>
                    {pendingStatusChange === "cancelled" &&
                      "هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟"}
                    {pendingStatusChange === "confirmed" &&
                      "هل تريد تأكيد هذا الحجز؟"}
                    {pendingStatusChange === "completed" &&
                      "هل تريد تحديد هذا الحجز كمكتمل؟"}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsStatusDialogOpen(false);
                      setPendingStatusChange(null);
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant={
                      pendingStatusChange === "cancelled"
                        ? "destructive"
                        : "default"
                    }
                    onClick={() => handleStatusChange(pendingStatusChange!)}
                  >
                    تأكيد
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {booking.status === "pending" && (
              <Button
                className="w-full"
                variant="default"
                onClick={() => {
                  setPendingStatusChange("confirmed");
                  setIsStatusDialogOpen(true);
                }}
              >
                تأكيد الحجز
              </Button>
            )}
            {(booking.status === "pending" ||
              booking.status === "confirmed") && (
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => {
                  setPendingStatusChange("cancelled");
                  setIsStatusDialogOpen(true);
                }}
              >
                إلغاء الحجز
              </Button>
            )}
            {/* {booking.status === "confirmed" && (
              <Button
                className="w-full"
                variant="default"
                onClick={() => {
                  setPendingStatusChange("completed");
                  setIsStatusDialogOpen(true);
                }}
              >
                تحديد كمكتمل
              </Button>
            )} */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
