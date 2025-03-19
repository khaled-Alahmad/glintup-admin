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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface EditUserProps {
  userId: string
}

export default function EditUser({ userId }: EditUserProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { toast } = useToast()

  // في تطبيق حقيقي، ستقوم بجلب بيانات المستخدم بناءً على userId
  useEffect(() => {
    // محاكاة جلب البيانات
    setAvatarPreview("/placeholder.svg?height=128&width=128")
  }, [userId])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يتم معالجة إرسال البيانات
    toast({
      title: "تم تحديث بيانات المستخدم بنجاح",
      description: "تم تحديث بيانات المستخدم في النظام",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/users/${userId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">تعديل بيانات المستخدم</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات المستخدم</CardTitle>
            <CardDescription>تعديل معلومات المستخدم الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  الاسم الكامل <span className="text-red-500">*</span>
                </Label>
                <Input id="name" defaultValue="سارة أحمد" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </Label>
                <Input id="email" type="email" defaultValue="sarah@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  رقم الهاتف <span className="text-red-500">*</span>
                </Label>
                <Input id="phone" defaultValue="+966 50 123 4567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" placeholder="اترك فارغاً للاحتفاظ بكلمة المرور الحالية" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">صورة المستخدم</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                {avatarPreview ? (
                  <div className="relative w-full">
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="معاينة الصورة"
                      className="mx-auto max-h-32 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setAvatarPreview(null)}
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
                <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <Label htmlFor="avatar" className="mt-4">
                  <Button type="button" variant="outline">
                    تغيير الصورة
                  </Button>
                </Label>
              </div>
            </div>

            <Separator />

            {/* معلومات إضافية */}
            <h3 className="text-lg font-medium">معلومات إضافية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">الموقع</Label>
                <Input id="location" defaultValue="الرياض، السعودية" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">
                  نوع المستخدم <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="user">
                  <SelectTrigger id="role">
                    <SelectValue placeholder="اختر نوع المستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم عادي</SelectItem>
                    <SelectItem value="admin">مشرف</SelectItem>
                    <SelectItem value="moderator">مراقب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">نبذة تعريفية</Label>
              <Textarea id="bio" defaultValue="عميلة منتظمة تفضل خدمات العناية بالشعر والمكياج." rows={4} />
            </div>

            <Separator />

            {/* إعدادات الحساب */}
            <h3 className="text-lg font-medium">إعدادات الحساب</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">حساب نشط</Label>
                  <p className="text-sm text-muted-foreground">السماح للمستخدم بتسجيل الدخول واستخدام النظام</p>
                </div>
                <Switch id="active" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="verified">حساب موثق</Label>
                  <p className="text-sm text-muted-foreground">تأكيد هوية المستخدم وتوثيق حسابه</p>
                </div>
                <Switch id="verified" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">إشعارات البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني للمستخدم</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/users/${userId}`}>إلغاء</Link>
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

