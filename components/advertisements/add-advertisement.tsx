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
import { DatePicker } from "@/components/ui/date-picker"
import { Separator } from "@/components/ui/separator"

export default function AddAdvertisement() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/advertisements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إضافة إعلان جديد</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات الإعلان</CardTitle>
          <CardDescription>أدخل تفاصيل الإعلان الجديد</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الإعلان</Label>
              <Input id="title" placeholder="أدخل عنوان الإعلان" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salon">الصالون</Label>
              <Select>
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
            <Textarea id="description" placeholder="أدخل وصف الإعلان" rows={4} />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">صورة الإعلان</h3>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="معاينة الإعلان"
                    className="mx-auto max-h-48 rounded-md object-contain"
                  />
                  <Button
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
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">اسحب وأفلت الصورة هنا أو انقر للتصفح</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</p>
                </div>
              )}
              <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {!imagePreview && (
                <Label htmlFor="image" className="mt-4">
                  <Button type="button" variant="outline">
                    اختر صورة
                  </Button>
                </Label>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
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
                <Select>
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
                <Label htmlFor="amount">المبلغ</Label>
                <Input id="amount" placeholder="أدخل مبلغ الإعلان" type="number" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/advertisements">إلغاء</Link>
          </Button>
          <Button>حفظ الإعلان</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

