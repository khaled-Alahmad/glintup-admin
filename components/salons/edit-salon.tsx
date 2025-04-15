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
import {
  ArrowLeft,
  Upload,
  MapPin,
  Phone,
  Mail,
  Clock,
  Plus,
  X,
  Edit,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditSalonProps {
  salonId: string;
}

// تعريف نوع البيانات للخدمة
interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  category: string;
}

// تعريف نوع البيانات للخدمة في الصالون
interface SalonService {
  id: string;
  serviceId: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  category: string;
}

// تعريف نوع البيانات للمجموعة
interface Collection {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  discount: number;
}

export default function EditSalon({ salonId }: EditSalonProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // خدمات الصالون المحددة
  const [salonServices, setSalonServices] = useState<SalonService[]>([]);

  // المجموعات المحددة
  const [selectedCollections, setSelectedCollections] = useState<Collection[]>(
    []
  );

  // قائمة الخدمات المتاحة
  const [availableServices, setAvailableServices] = useState<Service[]>([
    {
      id: "1",
      name: "قص الشعر",
      duration: 60,
      price: 150,
      description: "قص الشعر بأحدث التقنيات والموضات",
      category: "hair",
    },
    {
      id: "2",
      name: "صبغة شعر",
      duration: 120,
      price: 300,
      description: "صبغة شعر بألوان عالمية وتقنيات حديثة",
      category: "hair",
    },
    {
      id: "3",
      name: "تسريحة شعر",
      duration: 90,
      price: 200,
      description: "تسريحات متنوعة للمناسبات والحفلات",
      category: "hair",
    },
    {
      id: "4",
      name: "مكياج",
      duration: 60,
      price: 250,
      description: "مكياج احترافي للمناسبات والسهرات",
      category: "makeup",
    },
    {
      id: "5",
      name: "مانيكير",
      duration: 45,
      price: 100,
      description: "عناية كاملة بالأظافر",
      category: "nails",
    },
    {
      id: "6",
      name: "باديكير",
      duration: 45,
      price: 120,
      description: "عناية كاملة بأظافر القدم",
      category: "nails",
    },
    {
      id: "7",
      name: "تنظيف بشرة",
      duration: 60,
      price: 200,
      description: "تنظيف عميق للبشرة",
      category: "skin",
    },
    {
      id: "8",
      name: "ماسك للوجه",
      duration: 30,
      price: 100,
      description: "ماسكات طبيعية للوجه",
      category: "skin",
    },
  ]);

  // قائمة المجموعات المتاحة
  const [availableCollections, setAvailableCollections] = useState<
    Collection[]
  >([
    {
      id: "1",
      name: "باقة العروس",
      description: "باقة متكاملة لتجهيز العروس",
      services: ["1", "3", "4"],
      price: 550,
      discount: 50,
    },
    {
      id: "2",
      name: "باقة العناية الكاملة",
      description: "باقة للعناية الكاملة بالجسم",
      services: ["5", "6", "7", "8"],
      price: 450,
      discount: 70,
    },
  ]);

  // حالة مربع حوار إضافة خدمة
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);

  // حالة مربع حوار تعديل خدمة
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);

  // الخدمة الحالية للتعديل
  const [currentService, setCurrentService] = useState<SalonService | null>(
    null
  );

  // الخدمة المختارة للإضافة
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  // السعر المخصص للخدمة المختارة
  const [customPrice, setCustomPrice] = useState<number>(0);

  // المدة المخصصة للخدمة المختارة
  const [customDuration, setCustomDuration] = useState<number>(0);

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

    // تحميل الخدمات المحددة مسبقاً للصالون
    setSalonServices([
      {
        id: "salon-service-1",
        serviceId: "1",
        name: "قص الشعر",
        duration: 60,
        price: 180,
        description: "قص الشعر بأحدث التقنيات والموضات",
        category: "hair",
      },
      {
        id: "salon-service-2",
        serviceId: "4",
        name: "مكياج",
        duration: 75,
        price: 300,
        description: "مكياج احترافي للمناسبات والسهرات",
        category: "makeup",
      },
    ]);

    // تحميل المجموعات المحددة مسبقاً للصالون
    setSelectedCollections([availableCollections[0]]);
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

  // إضافة خدمة إلى الصالون
  const addServiceToSalon = () => {
    if (!selectedServiceId) return;

    const service = availableServices.find((s) => s.id === selectedServiceId);
    if (!service) return;

    // التحقق من عدم وجود الخدمة مسبقاً في الصالون
    if (salonServices.some((s) => s.serviceId === selectedServiceId)) {
      alert("هذه الخدمة موجودة بالفعل في الصالون");
      return;
    }

    const price = customPrice > 0 ? customPrice : service.price;
    const duration = customDuration > 0 ? customDuration : service.duration;

    const newSalonService: SalonService = {
      id: `salon-service-${Date.now()}`,
      serviceId: service.id,
      name: service.name,
      duration: duration,
      price: price,
      description: service.description,
      category: service.category,
    };

    setSalonServices([...salonServices, newSalonService]);
    setIsAddServiceDialogOpen(false);
    setSelectedServiceId("");
    setCustomPrice(0);
    setCustomDuration(0);
  };

  // تعديل خدمة في الصالون
  const editSalonService = () => {
    if (!currentService) return;

    setSalonServices(
      salonServices.map((service) =>
        service.id === currentService.id ? currentService : service
      )
    );

    setIsEditServiceDialogOpen(false);
    setCurrentService(null);
  };

  // حذف خدمة من الصالون
  const removeSalonService = (serviceId: string) => {
    setSalonServices(
      salonServices.filter((service) => service.id !== serviceId)
    );
  };

  // إضافة مجموعة إلى الصالون
  const addCollection = (collectionId: string) => {
    const collection = availableCollections.find((c) => c.id === collectionId);
    if (collection && !selectedCollections.some((c) => c.id === collectionId)) {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  // إزالة مجموعة من الصالون
  const removeCollection = (collectionId: string) => {
    setSelectedCollections(
      selectedCollections.filter((c) => c.id !== collectionId)
    );
  };

  // تحديث الخدمة المختارة للإضافة
  const handleServiceSelection = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const service = availableServices.find((s) => s.id === serviceId);
    if (service) {
      setCustomPrice(service.price);
      setCustomDuration(service.duration);
    }
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">معلومات أساسية</TabsTrigger>
          <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
          <TabsTrigger value="media">الصور والوسائط</TabsTrigger>
          <TabsTrigger value="services">الخدمات</TabsTrigger>
          <TabsTrigger value="collections">المجموعات</TabsTrigger>
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
                    <Label htmlFor="category">
                      نوع الصالون <span className="text-red-500">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="اختر نوع الصالون" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="women">صالون نسائي</SelectItem>
                                     <SelectItem value="men">صالون رجالي</SelectItem>
                                     <SelectItem value="both">صالون مشترك</SelectItem> */}
                        <SelectItem value="home-service">
                          صالونات الخدمات المنزلية
                        </SelectItem>
                        <SelectItem value="beauty-expert">
                          خبيرات التجميل
                        </SelectItem>
                        <SelectItem value="clinic">العيادات</SelectItem>
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
                      <Switch id="featured" defaultChecked className="switch-custom " />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="verified">صالون موثق</Label>
                        <p className="text-sm text-muted-foreground">
                          إضافة علامة التوثيق إلى الصالون
                        </p>
                      </div>
                      <Switch id="verified" defaultChecked className="switch-custom " />
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
                          <X className="h-4 w-4" />
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
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">خدمات الصالون</h3>
                  <Dialog
                    open={isAddServiceDialogOpen}
                    onOpenChange={setIsAddServiceDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة خدمة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>إضافة خدمة للصالون</DialogTitle>
                        <DialogDescription>
                          اختر خدمة من القائمة وحدد السعر والمدة المناسبة
                          للصالون
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="service-select"
                            className="text-right"
                          >
                            الخدمة
                          </Label>
                          <Select
                            value={selectedServiceId}
                            onValueChange={handleServiceSelection}
                          >
                            <SelectTrigger
                              id="service-select"
                              className="col-span-3"
                            >
                              <SelectValue placeholder="اختر خدمة" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableServices.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="service-price" className="text-right">
                            السعر (د.إ)
                          </Label>
                          <Input
                            id="service-price"
                            type="number"
                            min="0"
                            step="0.01"
                            className="col-span-3"
                            value={customPrice}
                            onChange={(e) =>
                              setCustomPrice(Number(e.target.value))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="service-duration"
                            className="text-right"
                          >
                            المدة (دقيقة)
                          </Label>
                          <Input
                            id="service-duration"
                            type="number"
                            min="1"
                            className="col-span-3"
                            value={customDuration}
                            onChange={(e) =>
                              setCustomDuration(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddServiceDialogOpen(false)}
                        >
                          إلغاء
                        </Button>
                        <Button
                          onClick={addServiceToSalon}
                          disabled={!selectedServiceId}
                        >
                          إضافة الخدمة
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {salonServices.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الخدمة</TableHead>
                          <TableHead>الفئة</TableHead>
                          <TableHead>المدة</TableHead>
                          <TableHead>السعر</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salonServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div>{service.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {service.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {service.category === "hair" && "خدمات الشعر"}
                                {service.category === "skin" && "خدمات البشرة"}
                                {service.category === "nails" &&
                                  "خدمات الأظافر"}
                                {service.category === "makeup" &&
                                  "خدمات المكياج"}
                                {service.category === "other" && "خدمات أخرى"}
                              </Badge>
                            </TableCell>
                            <TableCell>{service.duration} دقيقة</TableCell>
                            <TableCell>{service.price} د.إ</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentService(service);
                                    setIsEditServiceDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500"
                                  onClick={() => removeSalonService(service.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      لم يتم إضافة أي خدمات بعد
                    </p>
                    <p className="text-sm text-muted-foreground">
                      اضغط على زر "إضافة خدمة" لإضافة خدمات للصالون
                    </p>
                  </div>
                )}
              </div>

              {/* مربع حوار تعديل الخدمة */}
              <Dialog
                open={isEditServiceDialogOpen}
                onOpenChange={setIsEditServiceDialogOpen}
              >
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>تعديل خدمة الصالون</DialogTitle>
                    <DialogDescription>
                      قم بتعديل تفاصيل الخدمة في الصالون
                    </DialogDescription>
                  </DialogHeader>
                  {currentService && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="edit-service-name"
                          className="text-right"
                        >
                          الخدمة
                        </Label>
                        <Input
                          id="edit-service-name"
                          className="col-span-3"
                          value={currentService.name}
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="edit-service-price"
                          className="text-right"
                        >
                          السعر (د.إ)
                        </Label>
                        <Input
                          id="edit-service-price"
                          type="number"
                          min="0"
                          step="0.01"
                          className="col-span-3"
                          value={currentService.price}
                          onChange={(e) =>
                            setCurrentService({
                              ...currentService,
                              price: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="edit-service-duration"
                          className="text-right"
                        >
                          المدة (دقيقة)
                        </Label>
                        <Input
                          id="edit-service-duration"
                          type="number"
                          min="1"
                          className="col-span-3"
                          value={currentService.duration}
                          onChange={(e) =>
                            setCurrentService({
                              ...currentService,
                              duration: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditServiceDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={editSalonService}>حفظ التغييرات</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>المجموعات</CardTitle>
              <CardDescription>إدارة مجموعات الخدمات للصالون</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">اختيار المجموعات</h3>
                  <Select onValueChange={(value) => addCollection(value)}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="اختر مجموعة لإضافتها" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCollections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.name} - {collection.price} د.إ
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCollections.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>المجموعة</TableHead>
                          <TableHead>الخدمات</TableHead>
                          <TableHead>السعر</TableHead>
                          <TableHead>الخصم</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCollections.map((collection) => (
                          <TableRow key={collection.id}>
                            <TableCell className="font-medium">
                              {collection.name}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {collection.services.map((serviceId) => {
                                  const service = availableServices.find(
                                    (s) => s.id === serviceId
                                  );
                                  return service ? (
                                    <Badge
                                      key={serviceId}
                                      variant="outline"
                                      className="mr-1"
                                    >
                                      {service.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </TableCell>
                            <TableCell>{collection.price} د.إ</TableCell>
                            <TableCell>{collection.discount} د.إ</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => removeCollection(collection.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      لم يتم إضافة أي مجموعات بعد
                    </p>
                    <p className="text-sm text-muted-foreground">
                      اختر مجموعة من القائمة المنسدلة لإضافتها
                    </p>
                  </div>
                )}
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
