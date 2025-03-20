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
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/components/ui/use-toast"

interface EditAdvertisementProps {
  advertisementId: string
}

export default function EditAdvertisement({ advertisementId }: EditAdvertisementProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date("2024-06-01"))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date("2024-08-31"))
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  // في تطبيق حقيقي، ستقوم بجلب بيانات الإعلان بناءً على advertisementId
  useEffect(() => {
    // محاكاة جلب البيانات
    setImagePreview("/placeholder.svg?height=200&width=400")
  }, [advertisementId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يتم معالجة إرسال البيانات
    toast({
      title: "تم تحديث الإعلان بنجاح",
      description: "تم تحديث بيانات الإعلان في النظام",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/advertisements/${advertisementId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">تعديل الإعلان</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات الإعلان</CardTitle>
            <CardDescription>تعديل معلومات الإعلان</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  عنوان الإعلان <span className="text-red-500">*</span>
                </Label>
                <Input id="title" defaultValue="عروض الصيف المميزة" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salon">
                  الصالون <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="1">
                  <SelectTrigger id="salon">
                    <SelectValue placeholder="اختر الصالون" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">صالون الأميرة</SelectItem>
                    <SelectItem value="2">صالون إليت</SelectItem>
                    <SelectItem value="3">صالون جلام</SelectItem>
                    <SelectItem value="4">صالون مس بيوتي</SelectItem>
                    <SelectItem value="5">صالون روز</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف الإعلان</Label>
              <Textarea
                id="description"
                defaultValue="استمتعي بعروض الصيف المميزة في صالون الأميرة. خصومات تصل إلى 30% على جميع الخدمات."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">صورة الإعلان</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="معاينة الإعلان"
                      className="mx-auto max-h-48 rounded-md object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImagePreview(null)}
                    >
                      حذف
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">اختر صورة الإعلان</p>
                  </div>
                )}
                <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <Label htmlFor="image" className="mt-4">
                  <Button type="button" variant="outline">
                    تغيير الصورة
                  </Button>
                </Label>
              </div>
            </div>

            <Separator />

            {/* تفاصيل العرض */}
            <h3 className="text-lg font-medium">تفاصيل العرض</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>تاريخ البداية</Label>
                <DatePicker selected={startDate} onSelect={setStartDate} placeholder="اختر تاريخ البداية" />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الانتهاء</Label>
                <DatePicker selected={endDate} onSelect={setEndDate} placeholder="اختر تاريخ الانتهاء" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="position">موقع الإعلان</Label>
                <Select defaultValue="home">
                  <SelectTrigger id="position">
                    <SelectValue placeholder="اختر موقع الإعلان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">الصفحة الرئيسية</SelectItem>
                    <SelectItem value="salons">صفحة الصالونات</SelectItem>
                    <SelectItem value="services">صفحة الخدمات</SelectItem>
                    <SelectItem value="offers">صفحة العروض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">التكلفة</Label>
                <Input id="amount" defaultValue="1200" type="number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">حالة الإعلان</Label>
              <Select defaultValue="active">
                <SelectTrigger id="status">
                  <SelectValue placeholder="اختر حالة الإعلان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="expired">منتهي</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/advertisements/${advertisementId}`}>إلغاء</Link>
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

