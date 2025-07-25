"use client";

import type React from "react";
import "react-international-phone/style.css";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Shield, X } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { addData, fetchData } from "@/lib/apiHelper";
import { PhoneInput } from "react-international-phone";
import { isValidPhone } from "@/lib/phone-utils";
import { useToast } from "@/hooks/use-toast";

// نموذج بيانات الصلاحيات
// const mockPermissions = [
//   { id: 1, name: { ar: { ar: "لوحة المعلومات" } }, key: "dashboard" },
//   { id: 2, name: { ar: { ar: "المزودين" } }, key: "salons" },
//   { id: 3, name: { ar: { ar: "المستخدمين" } }, key: "users" },
//   { id: 4, name: { ar: { ar: "الحجوزات" } }, key: "appointments" },
//   { id: 5, name: { ar: { ar: "المدفوعات" } }, key: "payments" },
//   { id: 6, name: { ar: { ar: "الإعلانات" } }, key: "advertisements" },
//   { id: 7, name: { ar: { ar: "العروض" } }, key: "offers" },
//   { id: 8, name: { ar: { ar: "التقييمات" } }, key: "reviews" },
//   { id: 9, name: { ar: { ar: "الشكاوى" } }, key: "complaints" },
//   { id: 10, name: { ar: { ar: "الإعدادات" } }, key: "settings" },
// ];

export default function AddAdminUser() {
  const router = useRouter();
  const { toast } = useToast();
  //   mockPermissions
  const [permissions, setPermissions] = useState([] as any[]);
  useEffect(() => {
    const fetchedPermissions = async () => {
      const response = await fetchData("admin/permissions");
      if (response.success) {
      }
      //   console.log(response);

      setPermissions(response.data);
    };
    fetchedPermissions();
  }, []);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    birth_date: "",
    gender: "male",
    is_active: true,
    permissions: [] as number[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // مسح رسالة الخطأ عند تغيير القيمة
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((id) => id !== permissionId),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "الاسم الأول مطلوب";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "الاسم الأخير مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "كلمات المرور غير متطابقة";
    }

    if (!formData.birth_date) {
      newErrors.birth_date = "تاريخ الميلاد مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //  log errors validateForm
    console.log("Errors before validation:", errors);
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // هنا يتم إرسال البيانات إلى API
      console.log("Submitting form data:", formData);
      const response = await addData("admin/admin-users", formData);
      if (response.success) {
        toast({
          title: "تمت الإضافة بنجاح",
          description: response.message,
        });
        router.push("/admin-users");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "فشلت عملية إضافة المشرف، يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (permissions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin-users">
            <ChevronRight className="ml-1 h-4 w-4" />
            العودة إلى قائمة المشرفين
          </Link>
        </Button>
      </div>

      <div className="">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">إضافة مشرف جديد</CardTitle>
            <CardDescription>
              إضافة مشرف جديد إلى النظام مع تحديد الصلاحيات المناسبة
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* المعلومات الشخصية */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">المعلومات الشخصية</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      الاسم الأول <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={errors.first_name ? "border-red-500" : ""}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-500">
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      الاسم الأخير <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={errors.last_name ? "border-red-500" : ""}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-500">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
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
                        value={formData.phone}
                        onChange={(phone) => {
                          setFormData((prev) => ({ ...prev, phone }));
                          // تحقق من صحة الرقم باستخدام isValidPhone
                          const isValid = isValidPhone(phone);
                          if (!isValid && phone.length > 4) {
                            setPhoneError("رقم الهاتف غير صحيح");
                          } else {
                            setPhoneError(null);
                          }
                          // امسح رسالة الخطأ من errors عند التغيير
                          if (errors.phone) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.phone;
                              return newErrors;
                            });
                          }
                        }}
                        inputProps={{
                          placeholder: "أدخل رقم الهاتف",
                          required: true,
                        }}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="phone">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="مثال: +971501234567"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div> */}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">
                      تاريخ الميلاد <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="birth_date"
                      name="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      className={errors.birth_date ? "border-red-500" : ""}
                    />
                    {errors.birth_date && (
                      <p className="text-xs text-red-500">
                        {errors.birth_date}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>الجنس</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={handleGenderChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">
                          ذكر
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">
                          أنثى
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* معلومات الحساب */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">معلومات الحساب</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      كلمة المرور <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">
                      تأكيد كلمة المرور <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className={
                        errors.confirm_password ? "border-red-500" : ""
                      }
                    />
                    {errors.confirm_password && (
                      <p className="text-xs text-red-500">
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="is_active"
                    className="switch-custom"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    حساب نشط
                  </Label>
                </div>
              </div>

              {/* الصلاحيات */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">الصلاحيات</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, permissions: [] }))
                      }
                    >
                      <X className="ml-1 h-4 w-4" />
                      إلغاء الكل
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          permissions: permissions.map((p) => p.id),
                        }))
                      }
                    >
                      <Check className="ml-1 h-4 w-4" />
                      تحديد الكل
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 space-x-reverse rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          handlePermissionChange(
                            permission.id,
                            checked === true
                          );
                        }}
                      />
                      <label
                        htmlFor={`permission-${permission.id}`}
                        className="flex flex-1 cursor-pointer items-center gap-2"
                      >
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>{permission.name.ar}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin-users">إلغاء</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإضافة..." : "إضافة المشرف"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
