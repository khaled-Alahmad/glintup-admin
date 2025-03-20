"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface EditSalonProps {
  salonId: string;
}

export default function EditSalon({ salonId }: EditSalonProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // In a real app, you would fetch salon data based on salonId
  useEffect(() => {
    // Simulating data fetching
    setLogoPreview("/placeholder.svg?height=128&width=128");
    setCoverPreview("/placeholder.svg?height=400&width=800");
    setGalleryPreviews([
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ]);
  }, [salonId]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setGalleryPreviews([...galleryPreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/salons/${salonId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          تعديل بيانات الصالون
        </h1>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">معلومات أساسية</TabsTrigger>
          <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
          <TabsTrigger value="media">الصور والوسائط</TabsTrigger>
          <TabsTrigger value="services">الخدمات والأسعار</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // هنا يتم معالجة إرسال البيانات
              console.log("تم حفظ التغييرات");
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>تعديل بيانات الصالون</CardTitle>
                <CardDescription>قم بتعديل معلومات الصالون</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* المعلومات الأساسية */}
                <h3 className="text-lg font-medium">المعلومات الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      اسم الصالون <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" defaultValue="صالون الأميرة" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner">
                      اسم المالك <span className="text-red-500">*</span>
                    </Label>
                    <Input id="owner" defaultValue="منيرة السعيد" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">وصف الصالون</Label>
                  <Textarea
                    id="description"
                    defaultValue="صالون الأميرة هو صالون متخصص في خدمات التجميل والعناية بالشعر والبشرة للسيدات. نقدم خدمات عالية الجودة بأيدي خبيرات متخصصات في مجال التجميل."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">فئة الصالون</Label>
                    <Select defaultValue="women">
                      <SelectTrigger id="category">
                        <SelectValue placeholder="اختر فئة الصالون" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="women">صالون نسائي</SelectItem>
                        <SelectItem value="men">صالون رجالي</SelectItem>
                        <SelectItem value="both">صالون مشترك</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">حالة الصالون</Label>
                    <Select defaultValue="active">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="اختر حالة الصالون" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="pending">معلق</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">إعدادات متقدمة</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="featured">صالون مميز</Label>
                        <p className="text-sm text-muted-foreground">
                          عرض الصالون في قسم الصالونات المميزة
                        </p>
                      </div>
                      <Switch id="featured" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="verified">صالون موثق</Label>
                        <p className="text-sm text-muted-foreground">
                          إضافة علامة التوثيق إلى الصالون
                        </p>
                      </div>
                      <Switch id="verified" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/salons/${salonId}`}>إلغاء</Link>
                </Button>
                <Button type="submit">حفظ التغييرات</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الاتصال</CardTitle>
              <CardDescription>
                تعديل معلومات الاتصال والموقع للصالون
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      defaultValue="princess@salon.com"
                      className="pr-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      defaultValue="+966 50 123 4567"
                      className="pr-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    defaultValue="حي الورود، شارع الأمير سلطان، الرياض"
                    className="pr-9 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Select defaultValue="riyadh">
                    <SelectTrigger id="city">
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riyadh">الرياض</SelectItem>
                      <SelectItem value="jeddah">جدة</SelectItem>
                      <SelectItem value="dammam">الدمام</SelectItem>
                      <SelectItem value="makkah">مكة المكرمة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">الحي</Label>
                  <Input id="district" defaultValue="حي الورود" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">الرمز البريدي</Label>
                  <Input id="postal-code" defaultValue="12345" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">ساعات العمل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { day: "الأحد", from: "09:00", to: "21:00" },
                    { day: "الاثنين", from: "09:00", to: "21:00" },
                    { day: "الثلاثاء", from: "09:00", to: "21:00" },
                    { day: "الأربعاء", from: "09:00", to: "21:00" },
                    { day: "الخميس", from: "09:00", to: "21:00" },
                    { day: "الجمعة", from: "16:00", to: "22:00" },
                    { day: "السبت", from: "09:00", to: "21:00" },
                  ].map((workDay) => (
                    <div
                      key={workDay.day}
                      className="flex items-center justify-between gap-4 p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{workDay.day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={workDay.from}>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="من" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem
                                key={i}
                                value={`${String(i).padStart(2, "0")}:00`}
                              >
                                {`${String(i).padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span>-</span>
                        <Select defaultValue={workDay.to}>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="إلى" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem
                                key={i}
                                value={`${String(i).padStart(2, "0")}:00`}
                              >
                                {`${String(i).padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">وسائل التواصل الاجتماعي</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" defaultValue="princess_salon" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" defaultValue="princess_salon" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="snapchat">Snapchat</Label>
                    <Input id="snapchat" defaultValue="princess_salon" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input id="tiktok" defaultValue="princess_salon" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الصور والوسائط</CardTitle>
              <CardDescription>تعديل صور وشعار الصالون</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">شعار الصالون</h3>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  {logoPreview ? (
                    <div className="relative w-full">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="معاينة الشعار"
                        className="mx-auto max-h-48 rounded-md object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setLogoPreview(null)}
                      >
                        حذف
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت شعار الصالون هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG حتى 2MB</p>
                    </div>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <Label htmlFor="logo" className="mt-4">
                    <Button type="button" variant="outline">
                      تغيير الشعار
                    </Button>
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">صورة الغلاف</h3>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  {coverPreview ? (
                    <div className="relative w-full">
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="معاينة صورة الغلاف"
                        className="mx-auto max-h-48 rounded-md object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setCoverPreview(null)}
                      >
                        حذف
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت صورة الغلاف هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG حتى 5MB</p>
                    </div>
                  )}
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                  <Label htmlFor="cover" className="mt-4">
                    <Button type="button" variant="outline">
                      تغيير صورة الغلاف
                    </Button>
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">معرض الصور</h3>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      اسحب وأفلت صور الصالون هنا أو انقر للتصفح
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG حتى 5MB لكل صورة
                    </p>
                  </div>
                  <Input
                    id="gallery"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryChange}
                  />
                  <Label htmlFor="gallery" className="mt-4">
                    <Button type="button" variant="outline">
                      إضافة صور جديدة
                    </Button>
                  </Label>
                </div>

                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {galleryPreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative rounded-md overflow-hidden h-40"
                      >
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <span className="sr-only">حذف</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الخدمات والأسعار</CardTitle>
              <CardDescription>تعديل خدمات الصالون وأسعارها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">قائمة الخدمات</h3>
                <Button
                  size="sm"
                  onClick={() => {
                    document
                      .getElementById("service-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 ml-2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  إضافة خدمة
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    name: "قص الشعر",
                    duration: "60",
                    price: "150",
                    description: "قص الشعر بأحدث التقنيات والموضات",
                  },
                  {
                    id: 2,
                    name: "صبغة شعر",
                    duration: "120",
                    price: "300",
                    description: "صبغة شعر بألوان عالمية وتقنيات حديثة",
                  },
                  {
                    id: 3,
                    name: "تسريحة شعر",
                    duration: "90",
                    price: "200",
                    description: "تسريحات متنوعة للمناسبات والحفلات",
                  },
                  {
                    id: 4,
                    name: "مكياج",
                    duration: "60",
                    price: "250",
                    description: "مكياج احترافي للمناسبات والسهرات",
                  },
                  {
                    id: 5,
                    name: "مانيكير وباديكير",
                    duration: "90",
                    price: "180",
                    description: "عناية كاملة بالأظافر",
                  },
                ].map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{service.name}</p>
                        <Badge variant="outline">
                          {service.duration} دقيقة
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">{service.price} ر.س</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div id="service-form" className="space-y-4">
                <h3 className="text-lg font-medium">إضافة خدمة جديدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-name">اسم الخدمة</Label>
                    <Input id="service-name" placeholder="اسم الخدمة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-duration">المدة (بالدقائق)</Label>
                    <Input
                      id="service-duration"
                      placeholder="المدة"
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-price">السعر (ر.س)</Label>
                    <Input
                      id="service-price"
                      placeholder="السعر"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-description">وصف الخدمة</Label>
                  <Textarea id="service-description" placeholder="وصف الخدمة" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-category">فئة الخدمة</Label>
                  <Select>
                    <SelectTrigger id="service-category">
                      <SelectValue placeholder="اختر فئة الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hair">خدمات الشعر</SelectItem>
                      <SelectItem value="skin">خدمات البشرة</SelectItem>
                      <SelectItem value="nails">خدمات الأظافر</SelectItem>
                      <SelectItem value="makeup">خدمات المكياج</SelectItem>
                      <SelectItem value="other">خدمات أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button>إضافة الخدمة</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/salons/${salonId}`}>إلغاء</Link>
        </Button>
        <Button>حفظ التغييرات</Button>
      </div>
    </div>
  );
}
