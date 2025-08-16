"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Gift as GiftIcon, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { addData } from "@/lib/apiHelper";
import { useToast } from "../ui/use-toast";

export default function AddGift() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    is_active: true,
    order: 1,
  });
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [uploadedIconName, setUploadedIconName] = useState<string | null>(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "حجم الملف كبير جداً",
          description: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "نوع ملف غير صحيح",
          description: "يجب أن يكون الملف صورة",
        });
        return;
      }

      setSelectedIcon(file);
      setIsUploadingIcon(true);

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        console.log("رفع الصورة:", file.name, "حجم:", file.size);

        const imageFormData = new FormData();
        imageFormData.append("folder", "gifts");
        imageFormData.append("image", file);

        console.log("إرسال طلب رفع الصورة إلى: general/upload-image");
        const imageResponse = await addData("general/upload-image", imageFormData, {}, true);

        console.log("استجابة رفع الصورة:", imageResponse);

        if (imageResponse.success) {
          setUploadedIconName(imageResponse.data.image_name);
          setIconPreview(imageResponse.data.image_url);
          console.log("تم رفع الصورة بنجاح:", imageResponse.data.image_name);
          toast({
            title: "تم رفع الصورة بنجاح",
            description: "تم رفع صورة الهدية بنجاح",
          });
        } else {
          console.error("خطأ في رفع الصورة:", imageResponse);
          toast({
            variant: "destructive",
            title: "خطأ في رفع الصورة",
            description: imageResponse.message || "فشل في رفع صورة الهدية",
          });
          // Reset on error
          setSelectedIcon(null);
          setIconPreview(null);
          setUploadedIconName(null);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          variant: "destructive",
          title: "خطأ في رفع الصورة",
          description: "حدث خطأ أثناء رفع صورة الهدية",
        });
        // Reset on error
        setSelectedIcon(null);
        setIconPreview(null);
        setUploadedIconName(null);
      } finally {
        setIsUploadingIcon(false);
      }
    }
  };

  const removeIcon = () => {
    setSelectedIcon(null);
    setIconPreview(null);
    setUploadedIconName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_ar.trim() || !formData.name_en.trim()) {
      toast({
        variant: "destructive",
        title: "خطأ في البيانات",
        description: "يجب ملء جميع الحقول المطلوبة",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Submit gift data (image already uploaded)
      const submitData = new FormData();
      submitData.append("name[ar]", formData.name_ar);
      submitData.append("name[en]", formData.name_en);
      submitData.append("is_active", formData.is_active ? "1" : "0");
      submitData.append("order", formData.order.toString());

      if (uploadedIconName) {
        submitData.append("icon", uploadedIconName);
      }

      const response = await addData("admin/gifts", submitData, {}, true);

      if (response.success) {
        toast({
          title: "تم الحفظ بنجاح",
          description: "تم إضافة الهدية بنجاح",
        });
        router.push("/gifts");
      } else {
        toast({
          variant: "destructive",
          title: "خطأ في الحفظ",
          description: response.message || "فشل في إضافة الهدية",
        });
      }
    } catch (error) {
      console.error("Error adding gift:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء إضافة الهدية",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/gifts">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إضافة هدية جديدة</h1>
          <p className="text-muted-foreground">
            أضف هدية جديدة إلى النظام
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GiftIcon className="h-5 w-5" />
                المعلومات الأساسية
              </CardTitle>
              <CardDescription>
                أدخل البيانات الأساسية للهدية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => handleInputChange("name_ar", e.target.value)}
                  placeholder="أدخل اسم الهدية بالعربية"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_en">الاسم بالإنجليزية *</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => handleInputChange("name_en", e.target.value)}
                  placeholder="أدخل اسم الهدية بالإنجليزية"
                  required
                  className="w-full"
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="order">ترتيب العرض</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 1)}
                  placeholder="ترتيب عرض الهدية"
                  className="w-full"
                />
              </div> */}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">الحالة</Label>
                  <p className="text-sm text-muted-foreground">
                    تفعيل أو إلغاء تفعيل الهدية
                  </p>
                </div>
                <Switch
                  id="is_active"
                  className="switch-custom"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Icon Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                أيقونة الهدية
              </CardTitle>
              <CardDescription>
                اختر أيقونة تمثل الهدية (اختياري)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {iconPreview ? (
                <div className="space-y-4">
                  <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden border-2 border-dashed border-muted">
                    <Image
                      src={iconPreview}
                      alt="معاينة الأيقونة"
                      fill
                      className="object-cover"
                    />
                    {isUploadingIcon && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                    {!isUploadingIcon && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={removeIcon}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="text-center">
                    {isUploadingIcon ? (
                      <p className="text-sm text-muted-foreground">جاري رفع الصورة...</p>
                    ) : uploadedIconName ? (
                      <p className="text-sm text-green-600">تم رفع الصورة بنجاح ✓</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">{selectedIcon?.name}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* <div className="w-32 h-32 mx-auto rounded-xl border-2 border-dashed border-muted flex items-center justify-center bg-muted/10">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div> */}
                  <div className="text-center">
                    <div className="flex flex-col items-center mb-2">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت صور المزود هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        PNG, JPG حتى 5MB لكل صورة
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        📐 قياسات الصورة المطلوبة: نسبة 2:1 (العرض ضعفي الطول)
                      </p>
                      <p className="text-xs text-gray-400">
                        مثال: 1200x600 بكسل أو 1600x800 بكسل
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleIconChange}
                      className="hidden"
                      id="icon-upload"
                    />
                    <Label
                      htmlFor="icon-upload"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      اختيار صورة
                    </Label>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    PNG, JPG, GIF حتى 5MB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Link href="/gifts">
            <Button type="button" variant="outline">
              إلغاء
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading || isUploadingIcon}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                جاري الحفظ...
              </>
            ) : isUploadingIcon ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                جاري رفع الصورة...
              </>
            ) : (
              <>
                <GiftIcon className="mr-2 h-4 w-4" />
                إضافة الهدية
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
