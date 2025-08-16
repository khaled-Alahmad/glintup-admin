"use client";

import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Gift as GiftIcon, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchData, updateData, addData } from "@/lib/apiHelper";
import { useToast } from "../ui/use-toast";
import { Gift } from "@/types/gift";

interface EditGiftProps {
  giftId: string;
}

export default function EditGift({ giftId }: EditGiftProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [gift, setGift] = useState<Gift | null>(null);
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

  // Fetch gift data
  useEffect(() => {
    const fetchGift = async () => {
      try {
        const response = await fetchData(`admin/gifts/${giftId}`);

        if (response.success) {
          const giftData = response.data;
          setGift(giftData);
          setFormData({
            name_ar: giftData.name.ar,
            name_en: giftData.name.en,
            is_active: giftData.is_active,
            order: giftData.order,
          });
          setIconPreview(giftData.icon_url);
        } else {
          toast({
            variant: "destructive",
            title: "خطأ في تحميل البيانات",
            description: response.message || "فشل في تحميل بيانات الهدية",
          });
          router.push("/gifts");
        }
      } catch (error) {
        console.error("Error fetching gift:", error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل بيانات الهدية",
        });
        router.push("/gifts");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchGift();
  }, [giftId, router, toast]);

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
        console.log("رفع الصورة الجديدة:", file.name, "حجم:", file.size);

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
          setIconPreview(gift?.icon_url || null);
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
        setIconPreview(gift?.icon_url || null);
        setUploadedIconName(null);
      } finally {
        setIsUploadingIcon(false);
      }
    }
  };

  const removeIcon = () => {
    if (selectedIcon) {
      // إذا كان هناك صورة مختارة جديدة، امحيها واستعد الأصلية
      setSelectedIcon(null);
      setIconPreview(gift?.icon_url || null);
      setUploadedIconName(null);
    } else {
      // إذا كان يريد حذف الصورة الحالية نهائياً
      setIconPreview(null);
      setUploadedIconName("remove");
    }
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
      // Submit gift data as JSON object
      const submitData: any = {
        name: {
          ar: formData.name_ar,
          en: formData.name_en,
        },
        is_active: formData.is_active,
        order: formData.order,
      };

      // Add icon data only if there are changes
      if (uploadedIconName) {
        if (uploadedIconName === "remove") {
          submitData.icon = "";
        } else {
          submitData.icon = uploadedIconName;
        }
      }
      // If no uploadedIconName, don't include icon field to preserve existing image

      const response = await updateData(`admin/gifts/${giftId}`, submitData);

      if (response.success) {
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الهدية بنجاح",
        });
        router.push("/gifts");
      } else {
        toast({
          variant: "destructive",
          title: "خطأ في التحديث",
          description: response.message || "فشل في تحديث الهدية",
        });
      }
    } catch (error) {
      console.error("Error updating gift:", error);
      toast({
        variant: "destructive",
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الهدية",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/gifts">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">تعديل الهدية</h1>
            <p className="text-muted-foreground">جاري تحميل بيانات الهدية...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/gifts">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">تعديل الهدية</h1>
            <p className="text-muted-foreground">الهدية غير موجودة</p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold tracking-tight">تعديل الهدية</h1>
          <p className="text-muted-foreground">
            تعديل بيانات الهدية #{gift.id}
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
                تعديل البيانات الأساسية للهدية
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
                تغيير أيقونة الهدية (اختياري)
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
                      <>
                        {selectedIcon && (
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
                        {!selectedIcon && gift?.icon_url && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => {
                              setIconPreview(null);
                              setUploadedIconName("remove");
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-center">
                    {isUploadingIcon ? (
                      <p className="text-sm text-muted-foreground">جاري رفع الصورة...</p>
                    ) : uploadedIconName === "remove" ? (
                      <p className="text-sm text-red-600">سيتم حذف الصورة الحالية ✓</p>
                    ) : uploadedIconName ? (
                      <p className="text-sm text-green-600">تم رفع الصورة الجديدة بنجاح ✓</p>
                    ) : selectedIcon ? (
                      <p className="text-sm text-muted-foreground">{selectedIcon.name}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">الأيقونة الحالية</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-xl border-2 border-dashed border-muted flex items-center justify-center bg-muted/10">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  {uploadedIconName === "remove" && (
                    <div className="text-center">
                      <p className="text-sm text-red-600">سيتم حذف الصورة الحالية</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setIconPreview(gift?.icon_url || null);
                          setUploadedIconName(null);
                        }}
                      >
                        التراجع
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center">
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
                  {iconPreview ? "تغيير الصورة" : "اختيار صورة"}
                </Label>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                PNG, JPG, GIF حتى 5MB
              </p>
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
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                جاري التحديث...
              </>
            ) : isUploadingIcon ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                جاري رفع الصورة...
              </>
            ) : (
              <>
                <GiftIcon className="mr-2 h-4 w-4" />
                تحديث الهدية
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
