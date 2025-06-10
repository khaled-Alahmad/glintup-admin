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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData, handleLogout } from "@/lib/apiHelper";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AdminProfile() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // نموذج للأنشطة (سيتم استبداله بـ API لاحقًا)
  const activities = [
    {
      id: 1,
      action: "تسجيل الدخول",
      date: "اليوم، 10:30 صباحًا",
      ip: "192.168.1.1",
    },
    {
      id: 2,
      action: "تعديل بيانات مزود",
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
  ];

  // نموذج لإعدادات الإشعارات (سيتم استبداله بـ API لاحقًا)
  const notifications = {
    email: true,
    push: true,
    sms: false,
  };

  // جلب بيانات الملف الشخصي من API
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("general/profile");
        if (response.success) {
          setProfile(response.data);
        } else {
          toast({
            variant: "destructive",
            title: "خطأ في تحميل البيانات",
            description: response.message || "فشل في تحميل بيانات الملف الشخصي",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل بيانات الملف الشخصي",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);
  // دالة لمعالجة تسجيل الخروج
  const handleLogoutClick = () => {
    handleLogout();
  };

  // دالة للحصول على الأحرف الأولى من الاسم
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  // عرض شاشة التحميل
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="mt-4 text-xl">جاري تحميل البيانات...</h2>
        </div>
      </div>
    );
  }

  // عرض رسالة خطأ إذا لم يتم العثور على بيانات
  if (!profile) {
    return (
      <div className="space-y-6 ">
        <div className="text-center p-6 border rounded-lg">
          <h2 className="text-xl font-bold text-red-500">
            تعذر تحميل البيانات
          </h2>
          <p className="mt-2">
            لم نتمكن من تحميل بيانات الملف الشخصي. الرجاء المحاولة مرة أخرى.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            إعادة التحميل
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" space-y-6">
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
                <AvatarImage
                  src={profile.avatar || "/placeholder-user.jpg"}
                  alt={profile.full_name}
                />
                <AvatarFallback>
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{profile.full_name}</CardTitle>
            <CardDescription className="flex justify-center items-center gap-1">
              <Shield className="h-4 w-4" />
              {profile.role === "admin" ? "مدير النظام" : profile.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span style={{ unicodeBidi: "plaintext" }}>
                {profile.full_phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>تاريخ الانضمام: {profile.register_at}</span>
            </div>
            {profile.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.address}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogoutClick}
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </CardFooter>
        </Card>{" "}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="permissions" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
              {/* <TabsTrigger value="activities">سجل النشاطات</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger> */}
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
                    {profile.admin_permissions &&
                    profile.admin_permissions.length > 0 ? (
                      profile.admin_permissions.map((permission: any) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2 p-2 rounded-md border"
                        >
                          <Shield className="h-4 w-4 text-primary" />
                          <span>{permission.name.ar.ar}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center p-6">
                        <p>لا توجد صلاحيات مخصصة لك حاليًا.</p>
                      </div>
                    )}
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
                    {activities.map((activity) => (
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
                            profile.email_offers ? "default" : "secondary"
                          }
                        >
                          {profile.email_offers ? "مفعل" : "معطل"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>إشعارات الدفع</span>
                        </div>
                        <Badge variant="secondary">معطل</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>إشعارات الرسائل النصية</span>
                        </div>
                        <Badge variant="secondary">معطل</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">أمان الحساب</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/profile/change-password">
                          <Key className="h-4 w-4 ml-2" />
                          تغيير كلمة المرور
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled
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
