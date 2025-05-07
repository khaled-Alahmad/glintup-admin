"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { addData } from "@/lib/apiHelper"

export default function AddUser() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: 'male',
    birth_date: '',
    phone_code: '+966',
    phone: '',
    password: '',
    is_active: true,
    avatar: '', // Add this line

    language: 'ar',
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('folder', "salons");

      const response = await addData('general/upload-image', uploadFormData);

      if (response.success) {
        setAvatarPreview(response.data.image_url);
        setFormData(prev => ({
          ...prev,
          avatar: response.data.image_name
        }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "تعذر رفع الصورة، الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      // Prepare user data
      const userData = {
        ...formData,
        phone_code: formData.phone_code,
        phone: formData.phone,
        is_active: formData.is_active,
      };

      // Submit user data
      const response = await addData('admin/users', userData);

      if (response.success) {
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إنشاء المستخدم الجديد",
        });
        window.location.href = '/users' // Redirect to users list
        setFormData({
          first_name: '',
          last_name: '',
          gender: 'male',
          birth_date: '',
          phone_code: '+966',
          phone: '',
          password: '',
          avatar: '',
          is_active: true,
          language: 'ar',
        });
        // Redirect or reset form
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة المستخدم",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إضافة مستخدم جديد</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات المستخدم</CardTitle>
            <CardDescription>أدخل معلومات المستخدم الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">الاسم الأول <span className="text-red-500">*</span></Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">الاسم الأخير <span className="text-red-500">*</span></Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">تاريخ الميلاد <span className="text-red-500">*</span></Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_code">رمز الهاتف <span className="text-red-500">*</span></Label>
                <Input
                  id="phone_code"
                  style={{ unicodeBidi: "plaintext", textAlign: "right", direction: "rtl", paddingRight: "10px" }}
                  value={formData.phone_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_code: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">صورة المستخدم</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                {avatarPreview ? (
                  <div className="relative w-full">
                    <img
                      src={avatarPreview}
                      alt="معاينة الصورة"
                      className="mx-auto max-h-32 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setAvatarPreview(null);
                        setFormData(prev => ({ ...prev, avatar: '' }));
                      }}
                    >
                      حذف
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">اختر صورة المستخدم</p>
                  </div>
                )}
                {!avatarPreview && (
                  <Label htmlFor="avatar" className="mt-4">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('avatar')?.click()}>
                      اختر صورة
                    </Button>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </Label>
                )}
              </div>
            </div>

            <Separator />



            {/* إعدادات الحساب */}
            <h3 className="text-lg font-medium">إعدادات الحساب</h3>
            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">حساب نشط</Label>
                  <p className="text-sm text-muted-foreground">تفعيل حساب المستخدم فوراً</p>
                </div>
                <Switch
                  id="is_active"

                  className="switch-custom"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/users">إلغاء</Link>
            </Button>
            <Button type="submit">حفظ المستخدم</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

