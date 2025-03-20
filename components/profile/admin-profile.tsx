"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Key,
  LogOut,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function AdminProfile() {
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
    permissions: [
      "إدارة المستخدمين",
      "إدارة الصالونات",
      "إدارة الحجوزات",
      "إدارة المدفوعات",
      "إدارة الإعلانات",
      "إدارة العروض",
      "إدارة التقييمات",
      "إدارة الشكاوى",
      "إدارة إعدادات النظام",
    ],
    activities: [
      {
        id: 1,
        action: "تسجيل الدخول",
        date: "اليوم، 10:30 صباحًا",
        ip: "192.168.1.1",
      },
      {
        id: 2,
        action: "تعديل بيانات صالون",
        date: "اليوم، 09:45 صباحًا",
        ip: "192.168.1.1",
      },
      {
        id: 3,
        action: "إضافة مستخدم جديد",
        date: "أمس، 03:20 مساءً",
        ip: "192.168.1.1",
      },
      {
        id: 4,
        action: "تعديل إعدادات النظام",
        date: "أمس، 11:15 صباحًا",
        ip: "192.168.1.1",
      },
      {
        id: 5,
        action: "تسجيل الدخول",
        date: "أمس، 09:00 صباحًا",
        ip: "192.168.1.1",
      },
    ],
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          الملف الشخصي
        </h1>
        <Button asChild>
          <Link href="/profile/edit">
            <Edit className="h-4 w-4 ml-2" />
            تعديل الملف الشخصي
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={admin.avatar} alt={admin.name} />
                <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{admin.name}</CardTitle>
            <CardDescription className="flex justify-center items-center gap-1">
              <Shield className="h-4 w-4" />
              {admin.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{admin.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{admin.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>تاريخ الانضمام: {admin.joinDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{admin.address}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" className="w-full">
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="permissions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
              <TabsTrigger value="activities">سجل النشاطات</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="permissions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>صلاحيات المستخدم</CardTitle>
                  <CardDescription>
                    قائمة بالصلاحيات الممنوحة لك في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {admin.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-md border"
                      >
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>سجل النشاطات</CardTitle>
                  <CardDescription>
                    آخر النشاطات التي قمت بها في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {admin.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex justify-between items-center p-3 rounded-md border"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                        <Badge variant="outline">{activity.ip}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    عرض المزيد من النشاطات
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الحساب</CardTitle>
                  <CardDescription>تخصيص إعدادات حسابك</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">إعدادات الإشعارات</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>إشعارات البريد الإلكتروني</span>
                        </div>
                        <Badge
                          variant={
                            admin.notifications.email ? "default" : "secondary"
                          }
                        >
                          {admin.notifications.email ? "مفعل" : "معطل"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>إشعارات الدفع</span>
                        </div>
                        <Badge
                          variant={
                            admin.notifications.push ? "default" : "secondary"
                          }
                        >
                          {admin.notifications.push ? "مفعل" : "معطل"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>إشعارات الرسائل النصية</span>
                        </div>
                        <Badge
                          variant={
                            admin.notifications.sms ? "default" : "secondary"
                          }
                        >
                          {admin.notifications.sms ? "مفعل" : "معطل"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">أمان الحساب</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Key className="h-4 w-4 ml-2" />
                        تغيير كلمة المرور
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Shield className="h-4 w-4 ml-2" />
                        تفعيل المصادقة الثنائية
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
