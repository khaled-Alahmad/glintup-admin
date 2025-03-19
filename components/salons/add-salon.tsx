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

export default function AddSalon() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPreviews: string[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === files.length) {
            setGalleryPreviews([...galleryPreviews, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يتم معالجة إرسال البيانات
    console.log("تم إرسال النموذج")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/salons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إضافة صالون جديد</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات الصالون</CardTitle>
            <CardDescription>أدخل معلومات الصالون الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  اسم الصالون <span className="text-red-500">*</span>
                </Label>
                <Input id="name" placeholder="أدخل اسم الصالون" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">
                  اسم المالك <span className="text-red-500">*</span>
                </Label>
                <Input id="owner" placeholder="أدخل اسم مالك الصالون" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف الصالون</Label>
              <Textarea id="description" placeholder="أدخل وصف الصالون" rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">
                  فئة الصالون <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="اختر فئة الصالون" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="women">صالون نسائي</SelectItem>
                    <SelectItem value="men">صالون رجالي</SelectItem>
                    <SelectItem value="both">صالون مشترك</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  حالة الصالون <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="active" required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر حالة الصالون" />
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
                <Label htmlFor="email">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </Label>
                <Input id="email" type="email" placeholder="البريد الإلكتروني" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  رقم الهاتف <span className="text-red-500">*</span>
                </Label>
                <Input id="phone" placeholder="رقم الهاتف" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                العنوان <span className="text-red-500">*</span>
              </Label>
              <Textarea id="address" placeholder="العنوان التفصيلي" className="min-h-[80px]" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">
                  المدينة <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="riyadh">الرياض</SelectItem>
                    <SelectItem value="jeddah">جدة</SelectItem>
                    <SelectItem value="dammam">الدمام</SelectItem>
                    <SelectItem value="makkah">مكة المكرمة</SelectItem>
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

            <Separator />

            {/* الصور */}
            <h3 className="text-lg font-medium">صور الصالون</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="logo">
                  شعار الصالون <span className="text-red-500">*</span>
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
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">اختر شعار الصالون</p>
                    </div>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                    required
                  />
                  {!logoPreview && (
                    <Label htmlFor="logo" className="mt-4">
                      <Button type="button" variant="outline">
                        اختر شعار
                      </Button>
                    </Label>
                  )}
                </div>
              </div>
              <div className="space-y-2">
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
              </div>
            </div>

            <Separator />

            {/* إعدادات متقدمة */}
            <h3 className="text-lg font-medium">إعدادات متقدمة</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">صالون مميز</Label>
                  <p className="text-sm text-muted-foreground">عرض الصالون في قسم الصالونات المميزة</p>
                </div>
                <Switch id="featured" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="verified">صالون موثق</Label>
                  <p className="text-sm text-muted-foreground">إضافة علامة التوثيق إلى الصالون</p>
                </div>
                <Switch id="verified" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/salons">إلغاء</Link>
            </Button>
            <Button type="submit">حفظ الصالون</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

