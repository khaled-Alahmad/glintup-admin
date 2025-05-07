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

export default function AddRefund() {
  const [requestDate, setRequestDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يتم معالجة إرسال البيانات
    toast({
      title: "تم إضافة طلب الاسترجاع بنجاح",
      description: "تمت إضافة طلب الاسترجاع الجديد إلى النظام",
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إضافة طلب استرجاع جديد</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات طلب الاسترجاع</CardTitle>
            <CardDescription>أدخل معلومات طلب الاسترجاع الجديد</CardDescription>
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
              <Label htmlFor="payment">
                عملية الدفع <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger id="payment">
                  <SelectValue placeholder="اختر عملية الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">دفعة #1 - 450 د.إ - 03/04/2024</SelectItem>
                  <SelectItem value="2">دفعة #2 - 350 د.إ - 03/04/2024</SelectItem>
                  <SelectItem value="3">دفعة #3 - 800 د.إ - 03/04/2024</SelectItem>
                  <SelectItem value="4">دفعة #4 - 200 د.إ - 03/04/2024</SelectItem>
                  <SelectItem value="5">دفعة #5 - 300 د.إ - 03/04/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* معلومات الاسترجاع */}
            <h3 className="text-lg font-medium">معلومات الاسترجاع</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  التكلفة المسترجع (د.إ) <span className="text-red-500">*</span>
                </Label>
                <Input id="amount" type="number" placeholder="أدخل التكلفة المسترجع" required />
              </div>
              <div className="space-y-2">
                <Label>
                  تاريخ طلب الاسترجاع <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
                  <DatePicker selected={requestDate} onSelect={setRequestDate} placeholder="اختر تاريخ طلب الاسترجاع" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                سبب الاسترجاع <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="اختر سبب الاسترجاع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cancel">إلغاء الحجز من قبل الصالون</SelectItem>
                  <SelectItem value="customer-cancel">إلغاء الحجز من قبل العميل</SelectItem>
                  <SelectItem value="not-satisfied">عدم رضا عن الخدمة</SelectItem>
                  <SelectItem value="double-payment">دفع مزدوج</SelectItem>
                  <SelectItem value="other">سبب آخر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                حالة طلب الاسترجاع <span className="text-red-500">*</span>
              </Label>
              <Select defaultValue="pending">
                <SelectTrigger id="status">
                  <SelectValue placeholder="اختر حالة طلب الاسترجاع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="approved">موافق عليه</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Textarea id="notes" placeholder="أدخل أي ملاحظات إضافية" rows={4} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/payments">إلغاء</Link>
            </Button>
            <Button type="submit">حفظ طلب الاسترجاع</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

