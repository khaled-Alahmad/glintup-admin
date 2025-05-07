"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Clock, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// قائمة الخدمات المتاحة مع الأسعار والمدد
const availableServices = [
  { id: "1", name: "قص شعر", price: 150, duration: 60 },
  { id: "2", name: "صبغة شعر", price: 350, duration: 120 },
  { id: "3", name: "تسريحة شعر", price: 200, duration: 90 },
  { id: "4", name: "مكياج", price: 300, duration: 60 },
  { id: "5", name: "مانيكير وباديكير", price: 180, duration: 90 },
  { id: "6", name: "علاج بالكيراتين", price: 500, duration: 150 },
  { id: "7", name: "حمام مغربي", price: 250, duration: 120 },
  { id: "8", name: "تنظيف بشرة", price: 220, duration: 60 },
];

interface SelectedService {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
}

interface EditAppointmentProps {
  appointmentId: string;
}

export default function EditAppointment({
  appointmentId,
}: EditAppointmentProps) {
  const [date, setDate] = useState<Date | undefined>(new Date("2024-04-03"));
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    []
  );
  const [currentServiceId, setCurrentServiceId] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  // حساب إجمالي السعر والمدة
  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price * service.quantity,
    0
  );
  const totalDuration = selectedServices.reduce(
    (sum, service) => sum + service.duration * service.quantity,
    0
  );

  // في تطبيق حقيقي، ستقوم بجلب بيانات الحجز بناءً على appointmentId
  useEffect(() => {
    // محاكاة جلب البيانات
    // في هذا المثال، نقوم بتعيين بعض الخدمات الافتراضية
    setSelectedServices([
      { ...availableServices[0], quantity: 1 },
      { ...availableServices[1], quantity: 1 },
    ]);
  }, [appointmentId]);

  const handleAddService = () => {
    if (!currentServiceId) return;

    const serviceExists = selectedServices.find(
      (s) => s.id === currentServiceId
    );

    if (serviceExists) {
      // زيادة الكمية إذا كانت الخدمة موجودة بالفعل
      setSelectedServices((prev) =>
        prev.map((service) =>
          service.id === currentServiceId
            ? { ...service, quantity: service.quantity + 1 }
            : service
        )
      );
    } else {
      // إضافة خدمة جديدة
      const serviceToAdd = availableServices.find(
        (s) => s.id === currentServiceId
      );
      if (serviceToAdd) {
        setSelectedServices((prev) => [
          ...prev,
          { ...serviceToAdd, quantity: 1 },
        ]);
      }
    }

    setCurrentServiceId("");
  };

  const handleRemoveService = (id: string) => {
    setSelectedServices((prev) => prev.filter((service) => service.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectedServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, quantity } : service
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      toast({
        title: "خطأ في تحديث الحجز",
        description: "يجب إضافة خدمة واحدة على الأقل",
        variant: "destructive",
      });
      return;
    }

    // هنا يتم معالجة إرسال البيانات
    toast({
      title: "تم تحديث الحجز بنجاح",
      description: "تم تحديث بيانات الحجز في النظام",
    });

    // التوجيه إلى صفحة تفاصيل الحجز
    router.push(`/appointments/${appointmentId}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/appointments/${appointmentId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          تعديل الحجز
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات الحجز</CardTitle>
            <CardDescription>تعديل معلومات الحجز</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* معلومات العميل والصالون */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer">
                  العميل <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="1">
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">سارة أحمد</SelectItem>
                    <SelectItem value="2">نورة محمد</SelectItem>
                    <SelectItem value="3">عبير علي</SelectItem>
                    <SelectItem value="4">هند خالد</SelectItem>
                    <SelectItem value="5">ليلى عبدالله</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salon">
                  الصالون <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="1">
                  <SelectTrigger id="salon">
                    <SelectValue placeholder="اختر الصالون" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">صالون الأميرة</SelectItem>
                    <SelectItem value="2">صالون إليت</SelectItem>
                    <SelectItem value="3">صالون جلام</SelectItem>
                    <SelectItem value="4">صالون مس بيوتي</SelectItem>
                    <SelectItem value="5">صالون روز</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* معلومات الخدمات */}
            <h3 className="text-lg font-medium">معلومات الخدمات</h3>

            {/* إضافة خدمة جديدة */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor="service">
                  إضافة خدمة <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentServiceId}
                  onValueChange={setCurrentServiceId}
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} ({service.price} د.إ - {service.duration}{" "}
                        دقيقة)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={handleAddService}
                disabled={!currentServiceId}
                className="mb-0.5"
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة
              </Button>
            </div>

            {/* قائمة الخدمات المختارة */}
            {selectedServices.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-right p-3">الخدمة</th>
                      <th className="text-center p-3">المدة (دقيقة)</th>
                      <th className="text-center p-3">السعر (د.إ)</th>
                      <th className="text-center p-3">الكمية</th>
                      <th className="text-center p-3">الإجمالي (د.إ)</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServices.map((service) => (
                      <tr key={service.id} className="border-t">
                        <td className="p-3">{service.name}</td>
                        <td className="p-3 text-center">{service.duration}</td>
                        <td className="p-3 text-center">{service.price}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleUpdateQuantity(
                                  service.id,
                                  service.quantity - 1
                                )
                              }
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">
                              {service.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleUpdateQuantity(
                                  service.id,
                                  service.quantity + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="p-3 text-center font-medium">
                          {service.price * service.quantity}
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveService(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                      <td className="p-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  لم يتم إضافة أي خدمات بعد
                </p>
              </div>
            )}

            <Separator />

            {/* معلومات الموعد */}
            <h3 className="text-lg font-medium">معلومات الموعد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  التاريخ <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
                  <DatePicker
                    selected={date}
                    onSelect={setDate}
                    placeholder="اختر تاريخ الحجز"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">
                  الوقت <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Select defaultValue="10:30">
                    <SelectTrigger id="time" className="pr-9">
                      <SelectValue placeholder="اختر وقت الحجز" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 صباحاً</SelectItem>
                      <SelectItem value="10:00">10:00 صباحاً</SelectItem>
                      <SelectItem value="10:30">10:30 صباحاً</SelectItem>
                      <SelectItem value="11:00">11:00 صباحاً</SelectItem>
                      <SelectItem value="12:00">12:00 ظهراً</SelectItem>
                      <SelectItem value="13:00">01:00 مساءً</SelectItem>
                      <SelectItem value="14:00">02:00 مساءً</SelectItem>
                      <SelectItem value="15:00">03:00 مساءً</SelectItem>
                      <SelectItem value="16:00">04:00 مساءً</SelectItem>
                      <SelectItem value="17:00">05:00 مساءً</SelectItem>
                      <SelectItem value="18:00">06:00 مساءً</SelectItem>
                      <SelectItem value="19:00">07:00 مساءً</SelectItem>
                      <SelectItem value="20:00">08:00 مساءً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                حالة الحجز <span className="text-red-500">*</span>
              </Label>
              <Select defaultValue="confirmed">
                <SelectTrigger id="status">
                  <SelectValue placeholder="اختر حالة الحجز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="confirmed">مؤكد</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                defaultValue="العميلة تفضل الصبغة باللون البني الفاتح"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/appointments/${appointmentId}`}>إلغاء</Link>
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
