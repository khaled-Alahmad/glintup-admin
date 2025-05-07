"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { addData, fetchData, updateData } from "@/lib/apiHelper";
import { Search } from "lucide-react";
import { SelectGroup } from "@/components/ui/select";
interface EditAdvertisementProps {
  advertisementId: string
}

export default function EditAdvertisement({ advertisementId }: EditAdvertisementProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date("2024-06-01"))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date("2024-08-31"))
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: { ar: '', en: '' },
    status: 'draft',
    button_text: { ar: '', en: '' },
    salon_id: '',
  });
  const [uploadedImageName, setUploadedImageName] = useState<string>("");
  const [salons, setSalons] = useState([]);
  const [salonSearchTerm, setSalonSearchTerm] = useState("");
  const [isActive, setIsActive] = useState(true);
  // Add fetch functions
  const fetchSalons = async (searchTerm = "") => {
    try {
      const response = await fetchData(`admin/salons${searchTerm ? `?search=${searchTerm}` : ''}`);
      if (response.success) {
        setSalons(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch salons:', error);
    }
  };
  // في تطبيق حقيقي، ستقوم بجلب بيانات الإعلان بناءً على advertisementId
  useEffect(() => {
    // محاكاة جلب البيانات
    setImagePreview("/placeholder.svg?height=200&width=400")
  }, [advertisementId])
  const fetchAdvertisement = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(`admin/promotion-ads/${advertisementId}`);
      if (response.success) {
        const ad = response.data;
        setStartDate(new Date(ad.valid_from));
        setEndDate(new Date(ad.valid_to));
        setImagePreview(ad.image_url);
        setUploadedImageName(ad.image);
        setIsActive(ad.is_active);
        setFormData({
          title: ad.title,
          button_text: ad.button_text,
          status: ad.status,
          salon_id: ad.salon_id ? String(ad.salon_id) : '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch advertisement:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب بيانات الإعلان",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSalons();
    fetchAdvertisement();
  }, [advertisementId]);

  // Update handleImageChange function
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'ads');

        const response = await addData('general/upload-image', formData);
        if (response.success) {
          setUploadedImageName(response.data.image_name);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
        toast({
          title: "خطأ في رفع الصورة",
          description: "حدث خطأ أثناء رفع الصورة",
          variant: "destructive",
        });
      }
    }
  };

  // Update handleSubmit function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!startDate || !endDate || (startDate > endDate)) {
      toast({
        title: "خطأ في التواريخ",
        description: "يرجى تحديد تاريخ البداية والانتهاء",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const submitData = {
        valid_from: startDate.toISOString().split('T')[0],
        valid_to: endDate.toISOString().split('T')[0],
        title: {
          ar: formData.title.ar,
          en: formData.title.en,
        },
        button_text: {
          ar: formData.button_text.ar,
          en: formData.button_text.en,
        },
        salon_id: formData.salon_id ? Number(formData.salon_id) : null,
        is_active: isActive ? 1 : 0,
        image: uploadedImageName || null,
        status: formData.status,
      };
      console.log(submitData);

      // if (uploadedImageName) {
      //   submitData.set('image', uploadedImageName);
      // }


      const response = await updateData(`admin/promotion-ads/${advertisementId}`, submitData);
      if (response.success) {
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الإعلان بنجاح",
          variant: "default",
        });
        router.push('/advertisements');
      }
    } catch (error) {
      console.error('Failed to update advertisement:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الإعلان",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/advertisements/${advertisementId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">تعديل الإعلان</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات الإعلان</CardTitle>
            <CardDescription>تعديل معلومات الإعلان</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="text-muted-foreground mt-2">جاري تحميل البيانات...</p>
              </div>
            ) : (<>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title_ar">عنوان الإعلان (عربي)</Label>
                  <Input
                    id="title_ar"
                    name="title_ar"
                    value={formData.title.ar}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, ar: e.target.value }
                    }))}
                    placeholder="أدخل عنوان الإعلان بالعربية"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_en">Advertisement Title (English)</Label>
                  <Input
                    id="title_en"
                    name="title_en"
                    value={formData.title.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, en: e.target.value }
                    }))}
                    placeholder="Enter advertisement title in English"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salon_id">الصالون</Label>
                <Select name="salon_id" value={formData.salon_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, salon_id: value }))}
                  required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الصالون" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="flex items-center px-3 pb-2">
                      <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        className="h-8"
                        placeholder="ابحث عن صالون..."
                        value={salonSearchTerm}
                        onChange={(e) => {
                          setSalonSearchTerm(e.target.value);
                          fetchSalons(e.target.value);
                        }}
                      />
                    </div>
                    <SelectGroup>
                      {salons.map((salon: any) => (
                        <SelectItem key={salon.id} value={String(salon.id)}>
                          {salon.merchant_commercial_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="description_ar">نص زر الإعلان (عربي)</Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    value={formData.button_text?.ar || " "}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      button_text: { ...prev.button_text, ar: e.target.value }
                    }))}
                    placeholder="أدخل نص زر الإعلان بالعربية"
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Advertisement  Text Button (English)</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    value={formData.button_text?.en || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      button_text: { ...prev.button_text, en: e.target.value }
                    }))}
                    placeholder="Enter advertisement  Text Button in English"
                    rows={4}
                    required
                  />

                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">صورة الإعلان</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="معاينة الإعلان"
                        className="mx-auto max-h-48 rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImagePreview(null)}
                      >
                        حذف
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">اختر صورة الإعلان</p>
                    </div>
                  )}
                  <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <Label htmlFor="image" className="mt-4">
                    <Button type="button" variant="outline">
                      تغيير الصورة
                    </Button>
                  </Label>
                </div>
              </div>

              <Separator />

              {/* تفاصيل العرض */}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">تفاصيل العرض</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="me-2">تاريخ البداية</Label>
                    <DatePicker
                      selected={startDate}
                      onSelect={setStartDate}
                      minDate={new Date()}
                      placeholder="اختر تاريخ البداية"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="me-2">تاريخ الانتهاء</Label>
                    <DatePicker
                      selected={endDate}
                      onSelect={setEndDate}
                      minDate={startDate || new Date()}
                      disabled={!startDate}
                      placeholder="اختر تاريخ الانتهاء"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="is_active" className="me-2">تفعيل الإعلان</Label>
                  <Select
                    value={isActive ? "1" : "0"}
                    onValueChange={(value) => setIsActive(value === "1")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="اختر التفعيل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">نشط</SelectItem>
                      <SelectItem value="0">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="status" className="me-2">حالة الإعلان</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      status: value,
                    })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="in_review">قيد المراجعة</SelectItem>
                      <SelectItem value="approved">موافق عليه</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>)}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/advertisements/${advertisementId}`}>إلغاء</Link>
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

