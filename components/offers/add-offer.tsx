"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Percent } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/hooks/use-toast"

export default function AddOffer() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

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
      title: "تم إضافة العرض بنجاح",
      description: "تمت إضافة العرض الجديد إلى النظام",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/offers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إضافة عرض جديد</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات العرض</CardTitle>
            <CardDescription>أدخل معلومات العرض الجديد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  عنوان العرض <span className="text-red-500">*</span>
                </Label>
                <Input id="title" placeholder="أدخل عنوان العرض" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salon">
                  الصالون <span className="text-red-500">*</span>
                </Label>
                <Select required>
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
              <Label htmlFor="description">وصف العرض</Label>
              <Textarea id="description" placeholder="أدخل وصف العرض" rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">صورة العرض</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="معاينة العرض"
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
                    <p className="text-sm text-gray-600">اختر صورة العرض</p>
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
                <Label htmlFor="discount">
                  نسبة الخصم (%) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="discount" type="number" placeholder="أدخل نسبة الخصم" className="pr-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">
                  كود الخصم <span className="text-red-500">*</span>
                </Label>
                <Input id="code" placeholder="أدخل كود الخصم" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="max-usage">
                  الحد الأقصى للاستخدام <span className="text-red-500">*</span>
                </Label>
                <Input id="max-usage" type="number" placeholder="أدخل الحد الأقصى للاستخدام" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  حالة العرض <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="active">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر حالة العرض" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                    <SelectItem value="expired">منتهي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/offers">إلغاء</Link>
            </Button>
            <Button type="submit">حفظ العرض</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

