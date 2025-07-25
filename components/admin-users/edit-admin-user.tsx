"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addData, fetchData, updateData } from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";
import { PhoneInput } from "react-international-phone";
import { isValidPhone } from "@/lib/phone-utils";
import { set } from "date-fns";
import "react-international-phone/style.css";

interface EditAdminUserProps {
  id: string;
}

// نموذج بيانات المشرف
// const mockAdminUser = {
//   id: 1,
//   first_name: "أحمد",
//   last_name: "محمد",
//   full_name: "أحمد محمد",
//   phone_code: "+971",
//   phone: "562455477",
//   full_phone: "+971 562455477",
//   email: "ahmed@glintup.com",
//   role: "admin",
//   gender: "male",
//   birth_date: "1990-01-01",
//   is_active: true,
//   is_verified: true,
//   avatar: null,
//   admin_permissions: [1, 2, 3],
//   created_at: "2025-04-09 16:29:37",
// };

// نموذج بيانات الصلاحيات
const mockPermissions = [
  { id: 1, name: { ar: { ar: "لوحة المعلومات" } }, key: "dashboard" },
  { id: 2, name: { ar: { ar: "المزودين" } }, key: "salons" },
  { id: 3, name: { ar: { ar: "المستخدمين" } }, key: "users" },
  { id: 4, name: { ar: { ar: "الحجوزات" } }, key: "appointments" },
  { id: 5, name: { ar: { ar: "المدفوعات" } }, key: "payments" },
  { id: 6, name: { ar: { ar: "الإعلانات" } }, key: "advertisements" },
  { id: 7, name: { ar: { ar: "العروض" } }, key: "offers" },
  { id: 8, name: { ar: { ar: "التقييمات" } }, key: "reviews" },
  { id: 9, name: { ar: { ar: "الشكاوى" } }, key: "complaints" },
  { id: 10, name: { ar: { ar: "الإعدادات" } }, key: "settings" },
];

export default function EditAdminUser({ id }: EditAdminUserProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
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
    admin_permissions: [] as number[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([]);
  useEffect(() => {
    // محاكاة جلب بيانات المشرف
    const fetchAdminUser = async () => {
      try {
        const response = await fetchData(`admin/admin-users/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        const mockAdminUser = response.data;
        // Extract permission IDs from the permission objects
        const permissionIds = Array.isArray(mockAdminUser.admin_permissions)
          ? mockAdminUser.admin_permissions.map(
              (permission: any) => permission.id
            )
          : [];

        setFormData({
          first_name: mockAdminUser.first_name,
          last_name: mockAdminUser.last_name,
          email: mockAdminUser.email || "",
          phone: mockAdminUser.full_phone,
          password: "",
          confirm_password: "",
          birth_date: mockAdminUser.birth_date,
          gender: mockAdminUser.gender,
          is_active: mockAdminUser.is_active,
          admin_permissions: permissionIds,
        });
      } catch (error) {
        console.error("Error fetching admin user:", error);
        toast({
          variant: "destructive",
          title: "حدث خطأ",
          description: "فشل في جلب بيانات المشرف",
        });
      } finally {
        setIsLoading(false);
      }
    };
    const fetchPermissions = async () => {
      try {
        const response = await fetchData("admin/permissions");
        if (!response.success) {
          throw new Error(response.message);
        }
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetchingadmin_permissions:", error);
        toast({
          variant: "destructive",
          title: "حدث خطأ",
          description: "فشل في جلب بيانات الصلاحيات",
        });
      }
    };
    fetchPermissions();

    fetchAdminUser();
  }, [id, toast]);

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
      admin_permissions: checked
        ? [...prev.admin_permissions, permissionId]
        : prev.admin_permissions.filter((id) => id !== permissionId),
    }));
  };

  const handlePermissionsUpdate = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await addData(
        `admin/admin-users/${id}/update-permissions`,
        {
          permissions: formData.admin_permissions,
        }
      );

      if (response.success) {
        toast({
          title: "تم تحديث الصلاحيات بنجاح",
          description: response.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "حدث خطأ",
          description: response.message || "فشل في تحديث الصلاحيات",
        });
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "فشل في تحديث الصلاحيات، يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsSubmitting(false);
    }
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

    if (formData.password && formData.password.length < 6) {
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
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API submission (excluding permissions)
      const dataToSubmit: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        full_phone: formData.phone,
        birth_date: formData.birth_date,
        gender: formData.gender,
        is_active: formData.is_active,
      };

      // Only include password if it's provided
      if (formData.password) {
        dataToSubmit.password = formData.password;
      }

      console.log("Submitting form data:", dataToSubmit);

      const response = await updateData(
        `admin/admin-users/${id}`,
        dataToSubmit
      );
      if (response.success) {
        toast({
          title: "تم التحديث بنجاح",
          description: response.message,
        });
        router.push(`/admin-users/${id}`);
      } else {
        // If API returns an error response
        toast({
          variant: "destructive",
          title: "حدث خطأ",
          description: response.message || "فشلت عملية تحديث بيانات المشرف",
        });
      }
    } catch (error) {
      console.error("Error updating admin user:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "فشلت عملية تحديث بيانات المشرف، يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center p-6">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <p className="mt-4">جاري تحميل بيانات المشرف...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex flex-1 items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin-users/${id}`}>
            <ChevronRight className="ml-1 h-4 w-4" />
            العودة إلى تفاصيل المشرف
          </Link>
        </Button>
      </div>

      <div className="">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">تعديل بيانات المشرف</CardTitle>
            <CardDescription>
              تعديل بيانات المشرف وصلاحياته في النظام
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="personal" className="flex-1">
                    المعلومات الشخصية
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex-1">
                    معلومات الحساب
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="flex-1">
                    الصلاحيات
                  </TabsTrigger>
                </TabsList>

                {/* تبويب المعلومات الشخصية */}
                <TabsContent value="personal" className="space-y-4">
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
                        <p className="text-xs text-red-500">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        البريد الإلكتروني{" "}
                        <span className="text-red-500">*</span>
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
                              setErrors((prev) => ({
                                ...prev,
                                phone: "رقم الهاتف غير صحيح",
                              }));
                            } else {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.phone;
                                return newErrors;
                              });
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
                </TabsContent>

                {/* تبويب معلومات الحساب */}
                <TabsContent value="account" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-sm font-medium">
                      تغيير كلمة المرور
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">كلمة المرور الجديدة</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="اتركها فارغة إذا لم ترغب في تغييرها"
                          className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                          <p className="text-xs text-red-500">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">
                          تأكيد كلمة المرور
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
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-sm font-medium">حالة الحساب</h3>
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
                </TabsContent>

                {/* تبويب الصلاحيات */}
                <TabsContent value="permissions" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">صلاحيات المشرف</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            admin_permissions: [],
                          }))
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
                            admin_permissions: permissions.map((p) => p.id),
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
                          checked={formData.admin_permissions.includes(
                            permission.id
                          )}
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

                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      onClick={handlePermissionsUpdate}
                      disabled={isSubmitting}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? "جاري الحفظ..." : "حفظ الصلاحيات"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href={`/admin-users/${id}`}>إلغاء</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
