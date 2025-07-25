"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addData } from "@/lib/apiHelper";
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
import { ArrowLeft, ArrowRight, FileText, Upload, X } from "lucide-react";
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
import dynamic from "next/dynamic";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhone } from "@/lib/phone-utils";
import { useToast } from "@/hooks/use-toast";

// Import the MapComponent dynamically with SSR disabled
const MapComponent = dynamic(
  () => import("@/components/map/map-component"),
  { ssr: false } // This is important for Leaflet which needs window access
);

export default function AddSalon() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  //  error phone for business_contact_number and contact_number
  const [businessContactPhoneError, setBusinessContactPhoneError] = useState<
    string | null
  >(null);
  const [contactPhoneError, setContactPhoneError] = useState<string | null>(
    null
  );
  // loading
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    user: {
      first_name: "",
      last_name: "",
      password: "",
      password_confirmation: "",
      phone: "",
      gender: "male",
      birth_date: "",
    },
    merchant_legal_name: "",
    merchant_commercial_name: "",
    address: "",
    city_street_name: "",
    contact_name: "",
    contact_number: "",
    contact_email: "",
    business_contact_name: "",
    business_contact_number: "",
    business_contact_email: "",
    description: "",
    bio: "",
    type: "salon",
    icon: "",
    types: ["salon"],
    latitude: "",
    longitude: "",
    service_location: "in_center",
    bank_name: "",
    bank_account_number: "",
    bank_account_holder_name: "",
    bank_account_iban: "",
    services_list: "",
    trade_license: "",
    vat_certificate: "",
    bank_account_certificate: "",
    vat_number: "",
  });

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);
      uploadFormData.append("folder", "salons");

      const response = await addData("general/upload-image", uploadFormData);

      if (response.success) {
        setLogoPreview(response.data.image_url);
        setFormData((prev) => ({
          ...prev,
          icon: response.data.image_name,
        }));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "تعذر رفع الصورة، الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
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
  const [newImages, setNewImages] = useState<File[]>([]);
  const [salonImages, setSalonImages] = useState<{ id: number; url: string }[]>(
    []
  );

  const handleGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      try {
        setIsLoading(true);
        const files = Array.from(e.target.files);
        setNewImages((prev) => [...prev, ...files]);

        // Upload each image and store their names and URLs
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("folder", "salons");

          const response = await addData("general/upload-image", formData);
          if (response.success) {
            return {
              name: response.data.image_name,
              url: response.data.image_url,
            };
          }
          return null;
        });

        const imageResults = await Promise.all(uploadPromises);
        const validResults = imageResults.filter(
          (result): result is { name: string; url: string } => result !== null
        );

        setSalonImages((prev) => [
          ...prev,
          ...validResults.map((r, index) => ({
            id: Date.now() + index, // Convert to number
            url: r.url,
          })),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading images:", error);
        toast({
          title: "خطأ في رفع الصور",
          description: "حدث خطأ أثناء رفع الصور",
          variant: "destructive",
        });
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setSalonImages(salonImages.filter((_, i) => i !== index));
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const [servicesListFile, setServicesListFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [vatCertificateFile, setVatCertificateFile] = useState<File | null>(null);
  const [bankAccountCertificateFile, setBankAccountCertificateFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar el número de teléfono antes de enviar
    if (!isValidPhone(formData.user.phone)) {
      setPhoneError("يرجى إدخال رقم هاتف صحيح");
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال رقم هاتف صحيح للمالك",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const uploadedImages = await Promise.all(
        newImages.map(async (file) => {
          const imageFormData = new FormData();
          imageFormData.append("image", file);
          imageFormData.append("folder", "salons");

          const response = await addData("general/upload-image", imageFormData);
          return response.data.image_name;
        })
      );
      const updateDataToSend = {
        ...formData,
        images: uploadedImages,
        // images_remove: imagesToRemove,
        // icon: logoText
      };

      // formData.images = uploadedImages
      const response = await addData("admin/salons/register", updateDataToSend);

      if (response.success) {
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إنشاء المزود الجديد",
        });
        window.location.href = "/salons";
        setIsLoading(false);
      } else {
        console.log("Error response:", response);

        toast({
          title: "خطأ في الإضافة",
          description: response.message || "حدث خطأ أثناء إضافة المزود",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error adding salon:", error);
      toast({
        title: "خطأ",
        description: error.response.message,
        variant: "destructive",
      });
    }
  };
  //gulfPhoneCodes
  const gulfPhoneCodes = [
    { id: 1, code: "+965", name: "الكويت" }, // Kuwait
    { id: 2, code: "+971", name: "الإمارات" }, // UAE
    { id: 3, code: "+973", name: "البحرين" }, // Bahrain
    { id: 4, code: "+966", name: "السعودية" }, // Saudi Arabia
    { id: 5, code: "+968", name: "عمان" }, // Oman
    { id: 6, code: "+974", name: "قطر" }, // Qatar
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/salons">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          إضافة مزود جديد
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات المزود</CardTitle>
            <CardDescription>أدخل معلومات المزود الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* المعلومات الأساسية */}
            {/* معلومات المالك */}
            <h3 className="text-lg font-medium">معلومات المالك</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  الاسم الأول <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  value={formData.user.first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      user: { ...prev.user, first_name: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">
                  الاسم الأخير <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last_name"
                  value={formData.user.last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      user: { ...prev.user, last_name: e.target.value },
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password">
                  كلمة المرور <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.user.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      user: { ...prev.user, password: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  تأكيد كلمة المرور <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={formData.user.password_confirmation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      user: {
                        ...prev.user,
                        password_confirmation: e.target.value,
                      },
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  رقم الهاتف <span className="text-red-500">*</span>
                </Label>
                <div className="phone-input-container">
                  <PhoneInput
                    defaultCountry="ae"
                    style={{
                      width: "100%",
                      height: "40px",
                      fontSize: "0.875rem",
                      borderRadius: "0.375rem",
                    }}
                    value={formData.user.phone}
                    onChange={(phone) => {
                      setFormData((prev) => ({
                        ...prev,
                        user: { ...prev.user, phone },
                      }));

                      // Verificar validez usando libphonenumber-js
                      const isValid = isValidPhone(phone);
                      if (!isValid && phone.length > 4) {
                        setPhoneError("رقم الهاتف غير صحيح");
                      } else {
                        setPhoneError(null);
                      }
                    }}
                    inputProps={{
                      placeholder: "أدخل رقم الهاتف",
                      required: true,
                    }}
                  />
                  {phoneError && (
                    <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                  )}
                </div>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="phone_code">
                  رمز الهاتف <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.user.phone_code}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      user: { ...prev.user, phone_code: value },
                    }))
                  }
                  required
                >
                  <SelectTrigger id="phone_code">
                    <SelectValue placeholder="اختر رمز الهاتف" />
                  </SelectTrigger>
                  <SelectContent>
                    {gulfPhoneCodes.map((code) => (
                      <SelectItem
                        key={code.id}
                        value={code.code}
                        style={{ unicodeBidi: "plaintext" }}
                      >
                        {code.code} {code.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>*/}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender">
                  الجنس <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.user.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      user: { ...prev.user, gender: value },
                    }))
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">
                  تاريخ الميلاد <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.user.birth_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      user: { ...prev.user, birth_date: e.target.value },
                    }))
                  }
                  required
                />
              </div>
            </div>

            <Separator />

            {/* معلومات المزود */}
            <h3 className="text-lg font-medium">معلومات المزود</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="merchant_legal_name">
                  الاسم القانوني <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="merchant_legal_name"
                  value={formData.merchant_legal_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      merchant_legal_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchant_commercial_name">
                  الاسم التجاري <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="merchant_commercial_name"
                  value={formData.merchant_commercial_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      merchant_commercial_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف المزود</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="أدخل وصف المزود"
                rows={4}
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="bio">نبذة عن المزود</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="أدخل نبذة عن المزود"
                rows={4}
              />
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">
                  نوع المزود <span className="text-red-500">*</span>
                </Label>
                <Select
                  required
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: value,
                    }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="اختر نوع المزود" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salon">صالون</SelectItem>
                    <SelectItem value="home_service">خدمة منزلية</SelectItem>
                    <SelectItem value="beautician">خبيرة تجميل</SelectItem>
                    <SelectItem value="clinic">عيادة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  حالة المزود <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="active" required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر حالة المزود" />
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

            {/* معلومات الاتصال */}
            <h3 className="text-lg font-medium">معلومات الاتصال</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_email">
                  البريد الإلكتروني للتواصل{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact_email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">
                  رقم هاتف التواصل <span className="text-red-500">*</span>
                </Label>
                <div className="phone-input-container">
                  <PhoneInput
                    defaultCountry="ae"
                    style={{
                      width: "100%",
                      height: "40px",
                      fontSize: "0.875rem",
                      borderRadius: "0.375rem",
                    }}
                    value={formData.contact_number}
                    onChange={(phone) => {
                      setFormData((prev) => ({
                        ...prev,
                        contact_number: phone,
                      }));
                      const isValid = isValidPhone(phone);
                      if (!isValid && phone.length > 4) {
                        setContactPhoneError("رقم الهاتف غير صحيح");
                      } else {
                        setContactPhoneError(null);
                      }
                    }}
                    inputProps={{
                      placeholder: "أدخل رقم هاتف التواصل",
                      required: true,
                    }}
                  />
                  {contactPhoneError && (
                    <p className="text-sm text-red-500 mt-1">
                      {contactPhoneError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business_contact_email">
                  البريد الإلكتروني للأعمال{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="business_contact_email"
                  type="email"
                  value={formData.business_contact_email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      business_contact_email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_contact_number">
                  رقم هاتف الأعمال <span className="text-red-500">*</span>
                </Label>
                <div className="phone-input-container">
                  <PhoneInput
                    defaultCountry="ae"
                    style={{
                      width: "100%",
                      height: "40px",
                      fontSize: "0.875rem",
                      borderRadius: "0.375rem",
                    }}
                    value={formData.business_contact_number}
                    onChange={(phone) => {
                      setFormData((prev) => ({
                        ...prev,
                        business_contact_number: phone,
                      }));
                      const isValid = isValidPhone(phone);
                      if (!isValid && phone.length > 4) {
                        setBusinessContactPhoneError("رقم الهاتف غير صحيح");
                      } else {
                        setBusinessContactPhoneError(null);
                      }
                    }}
                    inputProps={{
                      placeholder: "أدخل رقم هاتف الأعمال",
                      required: true,
                    }}
                  />
                  {businessContactPhoneError && (
                    <p className="text-sm text-red-500 mt-1">
                      {businessContactPhoneError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_name">
                  اسم جهة الاتصال <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_contact_name">
                  اسم جهة الاتصال للأعمال{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="business_contact_name"
                  value={formData.business_contact_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      business_contact_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                العنوان <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="العنوان التفصيلي"
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city_street_name">
                اسم الشارع والمدينة <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city_street_name"
                value={formData.city_street_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    city_street_name: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="latitude">
                  خط العرض <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      latitude: e.target.value,
                    }))
                  }
                  placeholder="مثال: 24.431126"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">
                  خط الطول <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      longitude: e.target.value,
                    }))
                  }
                  placeholder="مثال: 54.649244"
                  required
                />
              </div>
            </div>

            <div className="my-4">
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setFormData((prev) => ({
                            ...prev,
                            latitude: position.coords.latitude.toString(),
                            longitude: position.coords.longitude.toString(),
                          }));
                        },
                        (error) => {
                          toast({
                            title: "تعذر الحصول على الموقع",
                            description:
                              "يرجى السماح بالوصول إلى الموقع أو المحاولة لاحقًا.",
                            variant: "destructive",
                          });
                        }
                      );
                    } else {
                      toast({
                        title: "المتصفح لا يدعم تحديد الموقع",
                        description: "يرجى استخدام متصفح أحدث.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  الحصول على موقعي الحالي
                </Button>
              </div>
              <div style={{ height: 300, width: "100%" }}>
                {/* Lazy load map only on client side */}
                {typeof window !== "undefined" && (
                  <MapComponent
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onMapClick={(lat, lng) => {
                      setFormData((prev) => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                      }));
                    }}
                  />
                )}
              </div>
            </div>
            {/* </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">
                  المدينة <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kuwait-city">مدينة الكويت</SelectItem>
                    <SelectItem value="hawalli">حولي</SelectItem>
                    <SelectItem value="farwaniya">الفروانية</SelectItem>
                    <SelectItem value="ahmadi">الأحمدي</SelectItem>
                    <SelectItem value="jahra">الجهراء</SelectItem>
                    <SelectItem value="mubarak-al-kabeer">
                      مبارك الكبير
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">الحي</Label>
                <Input id="district" placeholder="الحي" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">الرمز البريدي</Label>
                <Input id="postal-code" placeholder="الرمز البريدي" />
              </div>
            </div>

            <Separator /> */}

            {/* الصور */}
            <h3 className="text-lg font-medium">صور المزود</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="logo">
                  شعار المزود <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  {logoPreview ? (
                    <div className="relative w-full">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="معاينة الشعار"
                        className="mx-auto max-h-32 rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setLogoPreview(null)}
                      >
                        حذف
                      </Button>
                    </div>
                  ) : (
                    !logoPreview && (
                      <Label htmlFor="logo" className="mt-4">
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            اختر شعار المزود
                          </p>
                        </div>
                        {/* <Button type="button" variant="outline">
                          اختر شعار
                        </Button> */}
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                          required
                        />
                      </Label>
                    )
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {/* <h3 className="text-lg font-medium"</h3> */}
                <Label htmlFor="logo">
                  عدة صور للغلاف<span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Label htmlFor="gallery" className="mt-4">
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت صور المزود هنا أو انقر للتصفح
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
                    {/* s */}
                  </Label>
                </div>

                {salonImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {salonImages.map((preview, index) => (
                      <div
                        key={index}
                        className="relative rounded-md overflow-hidden h-40"
                      >
                        <img
                          src={preview.url || "/placeholder.svg"}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          type="button"
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
              {/* <div className="space-y-2">
                <Label htmlFor="cover">صورة الغلاف</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  {coverPreview ? (
                    <div className="relative w-full">
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="معاينة صورة الغلاف"
                        className="mx-auto max-h-32 rounded-md object-contain"
                      />
                      <Button
                        type="button"
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
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">اختر صورة الغلاف</p>
                    </div>
                  )}
                  <Input id="cover" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                  {!coverPreview && (
                    <Label htmlFor="cover" className="mt-4">
                      <Button type="button" variant="outline">
                        اختر صورة الغلاف
                      </Button>
                    </Label>
                  )}
                </div>
              </div> */}
            </div>

            <Separator />

            {/* معلومات الخدمة والبنك */}
            <h3 className="text-lg font-medium">معلومات الخدمة والبنك</h3>
            <div className="space-y-6">
              {formData.type === "beautician" && (
                <div className="space-y-2">
                  <Label htmlFor="service_location">
                    موقع تقديم الخدمة <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    required
                    value={formData.service_location}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        service_location: value,
                      }))
                    }
                  >
                    <SelectTrigger id="service_location">
                      <SelectValue placeholder="اختر موقع تقديم الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_center">في المركز</SelectItem>
                      <SelectItem value="in_house">في المنزل</SelectItem>
                      <SelectItem value="in_house_and_center">في المركز والمنزل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">
                    اسم البنك <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bank_name"
                    value={formData.bank_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bank_name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">
                    رقم الحساب البنكي <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bank_account_number: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_account_holder_name">
                    اسم صاحب الحساب البنكي <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bank_account_holder_name"
                    value={formData.bank_account_holder_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bank_account_holder_name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_account_iban">
                    رقم الآيبان <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bank_account_iban"
                    value={formData.bank_account_iban}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bank_account_iban: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vat_number">
                    الرقم الضريبي <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vat_number"
                    value={formData.vat_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vat_number: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {/* قائمة الخدمات PDF */}
              <div className="space-y-4">
                <Label htmlFor="services_list">
                  قائمة الخدمات (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Label htmlFor="services_list" className="mt-4 w-full">
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت ملف PDF هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF حتى 10MB
                      </p>
                    </div>
                    <Input
                      id="services_list"
                      type="file"
                      accept="application/pdf"
                      className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadFormData = new FormData();
                            uploadFormData.append("file", file);
                            uploadFormData.append("folder", "salons");

                            const response = await addData("general/upload-file", uploadFormData);

                            if (response.success) {
                              setServicesListFile(file);
                              setFormData((prev) => ({
                                ...prev,
                                services_list: response.data.file_name,
                              }));
                            }
                          } catch (error) {
                            console.error("File upload failed:", error);
                            toast({
                              title: "خطأ في رفع الملف",
                              description: "تعذر رفع الملف، الرجاء المحاولة مرة أخرى",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                      required
                    />
                  </Label>
                  {servicesListFile && (
                    <div className="flex items-center mt-2">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        {servicesListFile.name}
                      </span>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="ml-2"
                        onClick={() => {
                          setServicesListFile(null);
                          setFormData((prev) => ({
                            ...prev,
                            services_list: "",
                          }));
                        }}
                      >
                        <span className="sr-only">حذف</span>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* الرخصة التجارية PDF */}
              <div className="space-y-4">
                <Label htmlFor="trade_license">
                  الرخصة التجارية (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Label htmlFor="trade_license" className="mt-4 w-full">
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت ملف PDF هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF حتى 10MB
                      </p>
                    </div>
                    <Input
                      id="trade_license"
                      type="file"
                      accept="application/pdf"
                      className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadFormData = new FormData();
                            uploadFormData.append("file", file);
                            uploadFormData.append("folder", "salons");

                            const response = await addData("general/upload-file", uploadFormData);

                            if (response.success) {
                              setTradeLicenseFile(file);
                              setFormData((prev) => ({
                                ...prev,
                                trade_license: response.data.file_name,
                              }));
                            }
                          } catch (error) {
                            console.error("File upload failed:", error);
                            toast({
                              title: "خطأ في رفع الملف",
                              description: "تعذر رفع الملف، الرجاء المحاولة مرة أخرى",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                      required
                    />
                  </Label>
                  {tradeLicenseFile && (
                    <div className="flex items-center mt-2">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        {tradeLicenseFile.name}
                      </span>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="ml-2"
                        onClick={() => {
                          setTradeLicenseFile(null);
                          setFormData((prev) => ({
                            ...prev,
                            trade_license: "",
                          }));
                        }}
                      >
                        <span className="sr-only">حذف</span>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* شهادة ضريبة القيمة المضافة PDF */}
              <div className="space-y-4">
                <Label htmlFor="vat_certificate">
                  شهادة ضريبة القيمة المضافة (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Label htmlFor="vat_certificate" className="mt-4 w-full">
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت ملف PDF هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF حتى 10MB
                      </p>
                    </div>
                    <Input
                      id="vat_certificate"
                      type="file"
                      accept="application/pdf"
                      className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadFormData = new FormData();
                            uploadFormData.append("file", file);
                            uploadFormData.append("folder", "salons");

                            const response = await addData("general/upload-file", uploadFormData);

                            if (response.success) {
                              setVatCertificateFile(file);
                              setFormData((prev) => ({
                                ...prev,
                                vat_certificate: response.data.file_name,
                              }));
                            }
                          } catch (error) {
                            console.error("File upload failed:", error);
                            toast({
                              title: "خطأ في رفع الملف",
                              description: "تعذر رفع الملف، الرجاء المحاولة مرة أخرى",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                      required
                    />
                  </Label>
                  {vatCertificateFile && (
                    <div className="flex items-center mt-2">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        {vatCertificateFile.name}
                      </span>
                      <Button
                        variant="destructive"
                        size="icon"

                        className="ml-2"
                        onClick={() => {
                          setVatCertificateFile(null);
                          setFormData((prev) => ({
                            ...prev,
                            vat_certificate: "",
                          }));
                        }}
                      >
                        <span className="sr-only">حذف</span>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* شهادة الحساب البنكي PDF */}
              <div className="space-y-4">
                <Label htmlFor="bank_account_certificate">
                  شهادة الحساب البنكي (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Label htmlFor="bank_account_certificate" className="mt-4 w-full">
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت ملف PDF هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF حتى 10MB
                      </p>
                    </div>
                    <Input
                      id="bank_account_certificate"
                      type="file"
                      accept="application/pdf"
                      className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadFormData = new FormData();
                            uploadFormData.append("file", file);
                            uploadFormData.append("folder", "salons");

                            const response = await addData("general/upload-file", uploadFormData);

                            if (response.success) {
                              setBankAccountCertificateFile(file);
                              setFormData((prev) => ({
                                ...prev,
                                bank_account_certificate: response.data.file_name,
                              }));
                            }
                          } catch (error) {
                            console.error("File upload failed:", error);
                            toast({
                              title: "خطأ في رفع الملف",
                              description: "تعذر رفع الملف، الرجاء المحاولة مرة أخرى",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                      required
                    />
                  </Label>
                  {bankAccountCertificateFile && (
                    <div className="flex items-center mt-2">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        {bankAccountCertificateFile.name}
                      </span>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="ml-2"
                        onClick={() => {
                          setBankAccountCertificateFile(null);
                          setFormData((prev) => ({
                            ...prev,
                            bank_account_certificate: "",
                          }));
                        }}
                      >
                        <span className="sr-only">حذف</span>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* إعدادات متقدمة */}
            <h3 className="text-lg font-medium">إعدادات متقدمة</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">مزود مميز</Label>
                  <p className="text-sm text-muted-foreground">
                    عرض المزود في قسم المزودات المميزة
                  </p>
                </div>
                <Switch id="featured" className="switch-custom " />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="verified">مزود موثق</Label>
                  <p className="text-sm text-muted-foreground">
                    إضافة علامة التوثيق إلى المزود
                  </p>
                </div>
                <Switch id="verified" className="switch-custom " />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/salons">إلغاء</Link>
            </Button>
            <Button type="submit" >
              {isLoading ? "جاري الحفظ..." : "حفظ المزود"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
