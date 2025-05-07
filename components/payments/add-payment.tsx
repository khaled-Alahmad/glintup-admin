"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function AddPayment() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يتم معالجة إرسال البيانات
    toast({
      title: "تم إضافة عملية الدفع بنجاح",
      description: "تمت إضافة عملية الدفع الجديدة إلى النظام",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إضافة عملية دفع جديدة</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات عملية الدفع</CardTitle>
            <CardDescription>أدخل معلومات عملية الدفع الجديدة</CardDescription>
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

            <div className="space-y-2">
              <Label htmlFor="booking">
                الحجز <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger id="booking">
                  <SelectValue placeholder="اختر الحجز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">حجز #1234 - قص شعر وصبغة - 03/04/2024</SelectItem>
                  <SelectItem value="2">حجز #1235 - مكياج - 03/04/2024</SelectItem>
                  <SelectItem value="3">حجز #1236 - علاج بالكيراتين - 04/04/2024</SelectItem>
                  <SelectItem value="4">حجز #1237 - مانيكير وباديكير - 03/04/2024</SelectItem>
                  <SelectItem value="5">حجز #1238 - حمام مغربي - 03/04/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* معلومات الدفع */}
            <h3 className="text-lg font-medium">معلومات الدفع</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  التكلفة (د.إ) <span className="text-red-500">*</span>
                </Label>
                <Input id="amount" type="number" placeholder="أدخل التكلفة" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">
                  طريقة الدفع <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">بطاقة ائتمان</SelectItem>
                    <SelectItem value="apple-pay">Apple Pay</SelectItem>
                    <SelectItem value="mada">مدى</SelectItem>
                    <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  تاريخ الدفع <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
                  <DatePicker selected={date} onSelect={setDate} placeholder="اختر تاريخ الدفع" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  حالة الدفع <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="completed">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر حالة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">معلق</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="refunded">مسترجع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">
                العمولة (د.إ) <span className="text-red-500">*</span>
              </Label>
              <Input id="commission" type="number" placeholder="أدخل قيمة العمولة" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" placeholder="أدخل أي ملاحظات إضافية" rows={4} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/payments">إلغاء</Link>
            </Button>
            <Button type="submit">حفظ عملية الدفع</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

