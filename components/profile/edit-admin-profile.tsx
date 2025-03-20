"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, User, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function EditAdminProfile() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    "/placeholder.svg?height=128&width=128"
  );

  // بيانات نموذجية للمسؤول
  const admin = {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@glintup.com",
    phone: "+971 50 123 4567",
    role: "مدير النظام",
    joinDate: "15 يناير 2023",
    lastLogin: "اليوم، 10:30 صباحًا",
    address: "دبي، الإمارات العربية المتحدة",
    avatar: "/placeholder.svg?height=128&width=128",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          تعديل الملف الشخصي
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // هنا يتم معالجة إرسال البيانات
          console.log("تم حفظ التغييرات");
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>الصورة الشخصية</CardTitle>
              <CardDescription>تغيير صورتك الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={avatarPreview || admin.avatar}
                      alt={admin.name}
                    />
                    <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0">
                    <Label
                      htmlFor="avatar-upload"
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  يفضل استخدام صورة بأبعاد 256×256 بكسل بتنسيق JPG أو PNG
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>تعديل معلوماتك الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    الاسم <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      defaultValue={admin.name}
                      className="pr-9"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue={admin.email}
                      className="pr-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      defaultValue={admin.phone}
                      className="pr-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">الدور الوظيفي</Label>
                  <Input
                    id="role"
                    defaultValue={admin.role}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    defaultValue={admin.address}
                    className="pr-9 min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تخصيص إعدادات الإشعارات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">
                      إشعارات البريد الإلكتروني
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      استلام إشعارات عبر البريد الإلكتروني عند وجود تحديثات مهمة
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    defaultChecked={admin.notifications.email}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">إشعارات الدفع</Label>
                    <p className="text-sm text-muted-foreground">
                      استلام إشعارات عند إتمام عمليات الدفع
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    defaultChecked={admin.notifications.push}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">
                      إشعارات الرسائل النصية
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      استلام إشعارات عبر الرسائل النصية للتنبيهات العاجلة
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    defaultChecked={admin.notifications.sms}
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" asChild>
            <Link href="/profile">إلغاء</Link>
          </Button>
          <Button type="submit">حفظ التغييرات</Button>
        </div>
      </form>
    </div>
  );
}
