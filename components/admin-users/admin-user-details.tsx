"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Edit,
  Shield,
  Trash2,
  UserCog,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { fetchData, deleteData } from "@/lib/apiHelper";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface AdminUserDetailsProps {
  id: string;
}

// تعريف واجهة البيانات للمشرف
interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_code?: string;
  phone?: string;
  full_phone: string;
  email: string;
  role: string;
  gender: string;
  birth_date: string;
  age?: string;
  is_active: boolean;
  is_verified: boolean;
  avatar: string | null;
  admin_permissions: AdminPermission[];
  created_at: string;
  updated_at: string;
  last_login: string;
  activity_logs?: ActivityLog[];
}

interface AdminPermission {
  id: number;
  name: {
    ar: {
      ar: string;
    };
  };
  key: string;
}

interface ActivityLog {
  id: number;
  action: string;
  timestamp: string;
  details: string;
}

export default function AdminUserDetails({ id }: AdminUserDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // جلب بيانات المشرف من API
    const fetchAdminUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData(`admin/admin-users/${id}`);
        if (response.success) {
          setAdminUser(response.data);
        } else {
          toast({
            variant: "destructive",
            title: "حدث خطأ",
            description: response.message || "فشل في جلب بيانات المشرف",
          });
        }
      } catch (error) {
        console.error("Error fetching admin user:", error);
        toast({
          variant: "destructive",
          title: "حدث خطأ",
          description: "فشل في جلب بيانات المشرف",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminUser();
  }, [id, toast]);

  // الحصول على الأحرف الأولى من الاسم لعرضها في الصورة الرمزية
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  // تنسيق التاريخ بشكل نسبي
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);

      // استدعاء API لحذف المشرف
      const response = await deleteData(`admin/admin-users/${id}`);

      if (response.success) {
        setIsDeleteDialogOpen(false);
        toast({
          title: "تم الحذف بنجاح",
          description: response.message || "تم حذف المشرف بنجاح",
        });
        router.push("/admin-users");
      } else {
        toast({
          variant: "destructive",
          title: "حدث خطأ",
          description: response.message || "فشل في حذف المشرف",
        });
      }
    } catch (error) {
      console.error("Error deleting admin user:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "فشل في حذف المشرف",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center p-6">
        <div className="text-center">
          <UserCog className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <p className="mt-4">جاري تحميل بيانات المشرف...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">المشرف غير موجود</h2>
          <p className="mt-2 text-muted-foreground">
            لم يتم العثور على المشرف المطلوب
          </p>
          <Button className="mt-4" asChild>
            <Link href="/admin-users">العودة إلى قائمة المشرفين</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin-users">
            <ChevronRight className="ml-1 h-4 w-4" />
            العودة إلى قائمة المشرفين
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* بطاقة المعلومات الشخصية */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24 border">
              <AvatarImage
                src={adminUser.avatar || ""}
                alt={adminUser.full_name}
              />
              <AvatarFallback className="text-2xl">
                {getInitials(adminUser.full_name)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-2 text-2xl">
              {adminUser.full_name}
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-1">
              <UserCog className="h-4 w-4" />
              <span>مشرف</span>
              <Badge
                variant={adminUser.is_active ? "default" : "secondary"}
                className="mr-2"
              >
                {adminUser.is_active ? "نشط" : "غير نشط"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  البريد الإلكتروني
                </p>
                <p className="font-medium">{adminUser.email || "غير متوفر"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                <p className="font-medium" style={{ unicodeBidi: "plaintext" }}>
                  {adminUser.full_phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الميلاد</p>
                <p className="font-medium">{adminUser.birth_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الإضافة</p>
                <p className="font-medium">
                  {formatDate(adminUser.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">آخر تسجيل دخول</p>
                <p className="font-medium">
                  {formatDate(adminUser.last_login)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href={`/admin-users/${adminUser.id}/edit`}>
                <Edit className="ml-2 h-4 w-4" />
                تعديل البيانات
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="ml-2 h-4 w-4" />
              حذف المشرف
            </Button>
          </CardFooter>
        </Card>

        {/* تفاصيل المشرف */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="permissions">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="permissions" className="flex-1">
                الصلاحيات
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">
                سجل النشاط
              </TabsTrigger>
              <TabsTrigger value="account" className="flex-1">
                معلومات الحساب
              </TabsTrigger>
            </TabsList>

            {/* تبويب الصلاحيات */}
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">صلاحيات المشرف</CardTitle>
                  <CardDescription>
                    الصلاحيات الممنوحة للمشرف في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {adminUser.admin_permissions &&
                    adminUser.admin_permissions.length > 0 ? (
                      adminUser.admin_permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <Shield className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">
                              {permission.name.ar.ar}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {permission.key}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <Shield className="h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">
                          لا توجد صلاحيات
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          لم يتم منح أي صلاحيات لهذا المشرف بعد
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={`/admin-users/${adminUser.id}/edit`}>
                      إدارة الصلاحيات
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* تبويب سجل النشاط */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">سجل النشاط</CardTitle>
                  <CardDescription>آخر نشاطات المشرف في النظام</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminUser.activity_logs &&
                    adminUser.activity_logs.length > 0 ? (
                      adminUser.activity_logs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
                            {log.action.includes("تسجيل") ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{log.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(log.timestamp)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {log.details}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <Clock className="h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">
                          لا يوجد نشاط
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          لم يتم تسجيل أي نشاط لهذا المشرف بعد
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* تبويب معلومات الحساب */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">معلومات الحساب</CardTitle>
                  <CardDescription>
                    تفاصيل حساب المشرف في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                          حالة الحساب
                        </p>
                        <div className="flex items-center gap-2">
                          {adminUser.is_active ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="font-medium">نشط</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="font-medium">غير نشط</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                          حالة التحقق
                        </p>
                        <div className="flex items-center gap-2">
                          {adminUser.is_verified ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="font-medium">تم التحقق</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="font-medium">لم يتم التحقق</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        معلومات إضافية
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الجنس:</span>
                          <span className="font-medium">
                            {adminUser.gender === "male" ? "ذكر" : "أنثى"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">العمر:</span>
                          <span className="font-medium">{adminUser.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            تاريخ آخر تحديث:
                          </span>
                          <span className="font-medium">
                            {formatDate(adminUser.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* مربع حوار حذف المشرف */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>حذف المشرف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المشرف؟ هذا الإجراء لا يمكن
              التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={adminUser.avatar || ""}
                alt={adminUser.full_name}
              />
              <AvatarFallback>
                {getInitials(adminUser.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{adminUser.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {adminUser.email || adminUser.full_phone}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="ml-2 h-4 w-4" />
                  تأكيد الحذف
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
