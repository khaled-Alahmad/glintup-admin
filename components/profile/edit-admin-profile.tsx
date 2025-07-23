"use client";

import type React from "react";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhone } from "@/lib/phone-utils";
import { fetchData, addData, updateData } from "@/lib/apiHelper";
import { useToast } from "@/components/ui/use-toast";

export default function EditAdminProfile() {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
    phone: "",
    phone_code: "",
    full_phone: "",
    gender: "",
    birth_date: "",
    role: "",
    address: "",
    image_name: "",
    email_offers: false
  });

  // Cargar datos del perfil desde la API
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("general/profile");
        if (response.success) {
          const profileData = response.data;
          setProfile(profileData);          setFormData({
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            full_name: profileData.full_name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            phone_code: profileData.phone_code || "",
            full_phone: profileData.full_phone || "",
            gender: profileData.gender || "",
            birth_date: profileData.birth_date || "",
            role: profileData.role || "",
            address: profileData.address || "",
            image_name: profileData.avatar || "",
            email_offers: profileData.email_offers || false
          });
          setAvatarPreview(
            profileData.avatar || "/placeholder.svg?height=128&width=128"
          );
        } else {
          toast({
            variant: "destructive",
            title: "خطأ في تحميل البيانات",
            description: response.message || "فشل في تحميل بيانات الملف الشخصي",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل بيانات الملف الشخصي",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/profile">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          تعديل الملف الشخصي
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h2 className="mt-4 text-xl">جاري تحميل البيانات...</h2>
          </div>
        </div>
      ) : (
        <form
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();

            if (phoneError) {
              toast({
                variant: "destructive",
                title: "خطأ في النموذج",
                description: "رقم الهاتف غير صحيح، يرجى التصحيح قبل الإرسال",
              });
              return;
            }

            setIsSubmitting(true);

            try {
              // رفع الصورة أولاً إذا كانت موجودة
              if (avatarFile) {
                const formDataImage = new FormData();
                formDataImage.append("image", avatarFile);
                formDataImage.append("folder", "salons");

                const imageResponse = await addData(
                  "general/upload-image",
                  formDataImage,
                  {},
                  true
                );
                if (imageResponse.success && imageResponse.data?.image_name) {
                  formData.image_name = imageResponse.data.image_name;
                } else {
                  throw new Error(imageResponse.message || "فشل في رفع الصورة");
                }
              }

              // تحديث البيانات الشخصية
              const response = await updateData("general/profile", formData);

              if (response.success) {
                toast({
                  title: "تم التحديث",
                  description: "تم تحديث بيانات الملف الشخصي بنجاح",
                });
                router.push("/profile");
              } else {
                throw new Error(
                  response.message || "فشل في تحديث الملف الشخصي"
                );
              }
            } catch (error: any) {
              console.error("Error updating profile:", error);
              toast({
                variant: "destructive",
                title: "خطأ في تحديث البيانات",
                description:
                  error.message || "حدث خطأ أثناء تحديث بيانات الملف الشخصي",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>الصورة الشخصية</CardTitle>
                <CardDescription>تغيير صورتك الشخصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={avatarPreview || "/placeholder-user.jpg"}
                        alt={formData.full_name}
                      />
                      <AvatarFallback>
                        {formData.full_name
                          ? formData.full_name.charAt(0)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      <Label
                        htmlFor="avatar-upload"
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    يفضل استخدام صورة بأبعاد 256×256 بكسل بتنسيق JPG أو PNG
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
                <CardDescription>تعديل معلوماتك الشخصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      الاسم الأول <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="pr-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      الاسم الأخير <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="pr-9"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pr-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">
                      تاريخ الميلاد
                    </Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      className="pr-9"
                    />
                  </div>
                </div>                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="phone-input-container">
                      <PhoneInput
                        defaultCountry="ae"
                        style={{
                          width: "100%",
                          height: "40px",
                          fontSize: "0.875rem",
                          borderRadius: "0.375rem",
                        }}
                        value={formData.full_phone}
                        onChange={(phone) => {
                          // Verificar validez usando libphonenumber-js
                          const isValid = isValidPhone(phone);
                          if (!isValid && phone.length > 4) {
                            setPhoneError("رقم الهاتف غير صحيح");
                          } else {
                            setPhoneError(null);
                          }

                          // Actualizar el estado
                          setFormData({
                            ...formData,
                            full_phone: phone,
                          });
                        }}
                        inputProps={{
                          placeholder: "أدخل رقم الهاتف",
                          name: "phone_display",
                        }}
                      />
                      {phoneError && (
                        <p className="text-sm text-red-500 mt-1">
                          {phoneError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">الجنس</Label>
                    <select 
                      id="gender" 
                      value={formData.gender}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="">اختر الجنس</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="role">الدور الوظيفي</Label>
                    <Input id="role" value={formData.role === 'admin' ? 'مدير النظام' : formData.role} readOnly disabled />
                  </div>
                  {/* <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch 
                      id="email_offers" 
                      checked={formData.email_offers} 
                      onCheckedChange={(checked) => setFormData({...formData, email_offers: checked})}
                    />
                    <Label htmlFor="email_offers">استلام إشعارات البريد الإلكتروني</Label>
                  </div> */}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="pr-9 min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" asChild>
              <Link href="/profile">إلغاء</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
