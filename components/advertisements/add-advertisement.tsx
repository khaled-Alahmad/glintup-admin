"use client";

import type React from "react";
import { Search } from "lucide-react";
import { SelectGroup } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";

// Add these imports at the top
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addData, fetchData } from "@/lib/apiHelper";

export default function AddAdvertisement() {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [salons, setSalons] = useState([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Add fetch salons function
  const [salonSearchTerm, setSalonSearchTerm] = useState("");

  // Update the fetchSalons function
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

  useEffect(() => {
    fetchSalons();
  }, []);
  const [uploadedImageName, setUploadedImageName] = useState<string>("");

  // Update handleImageChange function
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload image
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadedImageName) {
      toast({
        title: "خطأ في الصورة",
        description: "يرجى رفع صورة للإعلان",
        variant: "destructive",
      });
      return;
    }
    // const formData = new FormData(e.currentTarget);
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
      const formData = new FormData(e.currentTarget);

      formData.set('valid_from', startDate.toISOString().split('T')[0]);
      formData.set('valid_to', endDate.toISOString().split('T')[0]);

      // Set multilingual content
      formData.set('title[ar]', formData.get('title_ar') as string);
      formData.set('title[en]', formData.get('title_en') as string);
      formData.set('description[ar]', formData.get('description_ar') as string);
      formData.set('description[en]', formData.get('title_en') as string);
      formData.set('is_active', isActive ? '1' : '0');
      if (uploadedImageName) {
        formData.set('image', uploadedImageName);
      }

      const response = await addData('admin/promotion-ads', formData);
      if (response.success) {
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة الإعلان بنجاح",
          variant: "default",
        });
        router.push('/advertisements');
      }
    } catch (error) {
      console.error('Failed to add advertisement:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة الإعلان",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update the return JSX
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/advertisements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          إضافة إعلان جديد
        </h1>
      </div>

      <Card className="w-full"></Card>
      <CardHeader>
        <CardTitle>معلومات الإعلان</CardTitle>
        <CardDescription>أدخل تفاصيل الإعلان الجديد</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        {/* <Card> */}
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title_ar">عنوان الإعلان (عربي)</Label>
              <Input
                id="title_ar"
                name="title_ar"
                placeholder="أدخل عنوان الإعلان بالعربية"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">Advertisement Title (English)</Label>
              <Input
                id="title_en"
                name="title_en"
                placeholder="Enter advertisement title in English"
                required
              />
            </div>
          </div>

          {/* Update salon select */}
          <div className="space-y-2">
            <Label htmlFor="salon_id">الصالون</Label>
            <Select name="salon_id" required>
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

          {/* Update description fields */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="description_ar">وصف الإعلان (عربي)</Label>
              <Textarea
                id="description_ar"
                name="description_ar"
                placeholder="أدخل وصف الإعلان بالعربية"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">Advertisement Description (English)</Label>
              <Textarea
                id="description_en"
                name="description_en"
                placeholder="Enter advertisement description in English"
                rows={4}
                required
              />
            </div>
          </div> */}
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
                // required
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">صورة الإعلان</h3>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="معاينة الإعلان"
                    className="mx-auto max-h-48 rounded-md object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setUploadedImageName("");
                    }}
                  >
                    حذف
                  </Button>
                </div>
              ) : (
                <Label htmlFor="image" className="w-full cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      اسحب وأفلت الصورة هنا أو انقر للتصفح
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</p>
                  </div>
                </Label>
              )}
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="is_active" className="me-2">حالة الإعلان</Label>
            <Select
              value={isActive ? "1" : "0"}
              onValueChange={(value) => setIsActive(value === "1")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">نشط</SelectItem>
                <SelectItem value="0">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Keep existing date pickers */}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/advertisements">إلغاء</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : "حفظ الإعلان"}
          </Button>
        </CardFooter>
        {/* </Card> */}
      </form>
    </div>
  );
}
