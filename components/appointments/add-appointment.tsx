"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function AddAppointment() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يتم معالجة إرسال البيانات
    toast({
      title: "تم إضافة الحجز بنجاح",
      description: "تمت إضافة الحجز الجديد إلى النظام",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/appointments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إضافة حجز جديد</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات الحجز</CardTitle>
            <CardDescription>أدخل معلومات الحجز الجديد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* معلومات العميل والصالون */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer">
                  العميل <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">سارة أحمد</SelectItem>
                    <SelectItem value="2">نورة محمد</SelectItem>
                    <SelectItem value="3">عبير علي</SelectItem>
                    <SelectItem value="4">هند خالد</SelectItem>
                    <SelectItem value="5">ليلى عبدالله</SelectItem>
                  </SelectContent>
                </Select>
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

            <Separator />

            {/* معلومات الخدمة */}
            <h3 className="text-lg font-medium">معلومات الخدمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="service">
                  الخدمة <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">قص شعر</SelectItem>
                    <SelectItem value="2">صبغة شعر</SelectItem>
                    <SelectItem value="3">تسريحة شعر</SelectItem>
                    <SelectItem value="4">مكياج</SelectItem>
                    <SelectItem value="5">مانيكير وباديكير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">
                  السعر (ر.س) <span className="text-red-500">*</span>
                </Label>
                <Input id="price" type="number" placeholder="أدخل السعر" required />
              </div>
            </div>

            <Separator />

            {/* معلومات الموعد */}
            <h3 className="text-lg font-medium">معلومات الموعد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  التاريخ <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
                  <DatePicker selected={date} onSelect={setDate} placeholder="اختر تاريخ الحجز" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">
                  الوقت <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Select required>
                    <SelectTrigger id="time" className="pr-9">
                      <SelectValue placeholder="اختر وقت الحجز" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 صباحاً</SelectItem>
                      <SelectItem value="10:00">10:00 صباحاً</SelectItem>
                      <SelectItem value="11:00">11:00 صباحاً</SelectItem>
                      <SelectItem value="12:00">12:00 ظهراً</SelectItem>
                      <SelectItem value="13:00">01:00 مساءً</SelectItem>
                      <SelectItem value="14:00">02:00 مساءً</SelectItem>
                      <SelectItem value="15:00">03:00 مساءً</SelectItem>
                      <SelectItem value="16:00">04:00 مساءً</SelectItem>
                      <SelectItem value="17:00">05:00 مساءً</SelectItem>
                      <SelectItem value="18:00">06:00 مساءً</SelectItem>
                      <SelectItem value="19:00">07:00 مساءً</SelectItem>
                      <SelectItem value="20:00">08:00 مساءً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration">
                  المدة (بالدقائق) <span className="text-red-500">*</span>
                </Label>
                <Input id="duration" type="number" placeholder="أدخل مدة الخدمة" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  حالة الحجز <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="pending">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر حالة الحجز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">معلق</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" placeholder="أدخل أي ملاحظات إضافية" rows={4} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/appointments">إلغاء</Link>
            </Button>
            <Button type="submit">حفظ الحجز</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

