"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Filter,
  Plus,
  Search,
  Shield,
  Sliders,
  UserCog,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { PaginationWithInfo } from "@/components/ui/pagination-with-info";
import { useToast } from "@/hooks/use-toast";
import { fetchData, deleteData, updateData } from "@/lib/apiHelper";
import { AdminUsersSkeleton } from "./admin-users-skeleton";
import { se } from "date-fns/locale";

// نموذج بيانات المشرفين
// const mockAdminUsers = [
//   {
//     id: 1,
//     first_name: "أحمد",
//     last_name: "محمد",
//     full_name: "أحمد محمد",
//     phone_code: "+971",
//     phone: "562455477",
//     full_phone: "+971 562455477",
//     email: "ahmed@glintup.com",
//     role: "admin",
//     gender: "male",
//     birth_date: "1990-01-01",
//     is_active: true,
//     is_verified: true,
//     avatar: null,
//     admin_permissions: [
//       { id: 1, name: { ar: { ar: "لوحة المعلومات" } }, key: "dashboard" },
//       { id: 2, name: { ar: { ar: "المزودين" } }, key: "salons" },
//       { id: 3, name: { ar: { ar: "المستخدمين" } }, key: "users" },
//     ],
//     created_at: "2025-04-09 16:29:37",
//   },
//   {
//     id: 2,
//     first_name: "سارة",
//     last_name: "أحمد",
//     full_name: "سارة أحمد",
//     phone_code: "+971",
//     phone: "501234567",
//     full_phone: "+971 501234567",
//     email: "sara@glintup.com",
//     role: "admin",
//     gender: "female",
//     birth_date: "1992-05-15",
//     is_active: true,
//     is_verified: true,
//     avatar: null,
//     admin_permissions: [
//       { id: 1, name: { ar: { ar: "لوحة المعلومات" } }, key: "dashboard" },
//       { id: 4, name: { ar: { ar: "الحجوزات" } }, key: "appointments" },
//       { id: 5, name: { ar: { ar: "المدفوعات" } }, key: "payments" },
//     ],
//     created_at: "2025-04-15 10:20:30",
//   },
//   {
//     id: 3,
//     first_name: "محمد",
//     last_name: "علي",
//     full_name: "محمد علي",
//     phone_code: "+971",
//     phone: "551122334",
//     full_phone: "+971 551122334",
//     email: "mohamed@glintup.com",
//     role: "admin",
//     gender: "male",
//     birth_date: "1988-11-20",
//     is_active: false,
//     is_verified: true,
//     avatar: null,
//     admin_permissions: [
//       { id: 2, name: { ar: { ar: "المزودين" } }, key: "salons" },
//       { id: 6, name: { ar: { ar: "الإعلانات" } }, key: "advertisements" },
//       { id: 7, name: { ar: { ar: "العروض" } }, key: "offers" },
//     ],
//     created_at: "2025-04-20 14:45:10",
//   },
// ];
interface AdminPermission {
  id: number;
  name: {
    ar: {
      ar: string;
    };
  };
  key: string;
}
// نموذج بيانات المشرفين

// نموذج بيانات الصلاحيات
const mockPermissions = [
  { id: 1, name: { ar: { ar: "لوحة المعلومات" } }, key: "dashboard" },
  { id: 2, name: { ar: { ar: "المزودين" } }, key: "salons" },
  { id: 3, name: { ar: { ar: "المستخدمين" } }, key: "users" },
  { id: 4, name: { ar: { ar: "الحجوزات" } }, key: "appointments" },
  { id: 5, name: { ar: { ar: "المدفوعات" } }, key: "payments" },
  { id: 6, name: { ar: { ar: "الإعلانات" } }, key: "advertisements" },
  { id: 7, name: { ar: { ar: "العروض" } }, key: "offers" },
  { id: 8, name: { ar: { ar: "التقييمات" } }, key: "reviews" },
  { id: 9, name: { ar: { ar: "الشكاوى" } }, key: "complaints" },
  { id: 10, name: { ar: { ar: "الإعدادات" } }, key: "settings" },
];

interface AdminPermission {
  id: number;
  name: {
    ar: {
      ar: string;
    };
  };
  key: string;
}

interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_code: string;
  phone: string;
  full_phone: string;
  email: string | null;
  role: string;
  gender: string;
  birth_date: string;
  is_active: boolean;
  is_verified: boolean;
  avatar: string | null;
  admin_permissions: AdminPermission[];
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  limit: number;
  to: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    admins: AdminUser[];
    meta: PaginationMeta;
  };
}

export default function AdminUsersManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  //   permissions
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);

  // New state for API integration
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const [permissionsToUpdate, setPermissionsToUpdate] = useState<number[]>([]);

  // تصفية المشرفين حسب البحث والحالة والصلاحيات
  const filteredAdmins = admins;

  useEffect(() => {
    // Fetch permissions from API
    const fetchPermissions = async () => {
      try {
        const response = await fetchData("admin/permissions");
        if (response.success) {
          setPermissions(response.data);
        } else {
          toast({
            title: "خطأ في جلب الصلاحيات",
            description: response.message || "حدث خطأ أثناء جلب الصلاحيات",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast({
          title: "خطأ في جلب الصلاحيات",
          description: "حدث خطأ أثناء جلب الصلاحيات",
          variant: "destructive",
        });
      }
    };

    fetchPermissions();
  }, []);
  // Fetch admin users data from API
  useEffect(() => {
    fetchAdminUsers();
  }, [currentPage]);

  // Function to fetch admin users with filters
  const fetchAdminUsers = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await fetchData("admin/admin-users", {
        page: currentPage,
        limit: 9,
        search: searchQuery,
        is_active:
          selectedStatus == "active"
            ? 1
            : selectedStatus == "inactive"
            ? 0
            : undefined,
        permissions:
          selectedPermissions.length > 0 ? selectedPermissions : undefined,
        ...filters,
      });

      if (response.success) {
        setAdmins(response.data);
        setPaginationMeta(response.meta);
      } else {
        toast({
          title: "خطأ في جلب البيانات",
          description: response.message || "حدث خطأ أثناء جلب بيانات المشرفين",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب بيانات المشرفين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when search, status, or permissions change
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when changing filters
    fetchAdminUsers({
      search: searchQuery,
      is_active:
        selectedStatus == "active"
          ? 1
          : selectedStatus == "inactive"
          ? 0
          : undefined,
      permissions:
        selectedPermissions.length > 0 ? selectedPermissions : undefined,
    });
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Apply filters when status or permissions change
  useEffect(() => {
    applyFilters();
  }, [selectedStatus, selectedPermissions]);

  // Delete admin user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      const response = await deleteData(`admin/admin-users/${selectedUser.id}`);

      if (response.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف المشرف بنجاح",
          variant: "default",
        });

        // Refresh the admin users list
        fetchAdminUsers();
      } else {
        toast({
          title: "خطأ في حذف المشرف",
          description: response.message || "حدث خطأ أثناء حذف المشرف",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting admin user:", error);
      toast({
        title: "خطأ في حذف المشرف",
        description: "حدث خطأ أثناء حذف المشرف",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Update permissions
  const handleUpdatePermissions = async () => {
    if (!selectedUser) return;

    setIsSavingPermissions(true);
    // console.log(permissionsToUpdate);

    try {
      const response = await updateData(
        `admin/admin-users/${selectedUser.id}`,
        {
          admin_id: selectedUser.id,
          permissions: permissionsToUpdate,
        }
      );

      if (response.success) {
        toast({
          title: "تم تحديث الصلاحيات",
          description: "تم تحديث صلاحيات المشرف بنجاح",
          variant: "default",
        });

        // Update the local user data
        setSelectedUser({
          ...selectedUser,
          admin_permissions: permissions
            .filter((p) => permissionsToUpdate.includes(p.id))
            .map((p) => ({
              id: p.id,
              name: p.name,
              key: p.key,
            })),
        });

        // Refresh the admin users list
        fetchAdminUsers();
      } else {
        toast({
          title: "خطأ في تحديث الصلاحيات",
          description: response.message || "حدث خطأ أثناء تحديث الصلاحيات",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast({
        title: "خطأ في تحديث الصلاحيات",
        description: "حدث خطأ أثناء تحديث الصلاحيات",
        variant: "destructive",
      });
    } finally {
      setIsSavingPermissions(false);
      setIsPermissionsDialogOpen(false);
    }
  };

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
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "اليوم";
    } else if (diffInDays === 1) {
      return "الأمس";
    } else if (diffInDays < 30) {
      return `منذ ${diffInDays} يوم`;
    } else {
      return date.toLocaleDateString("ar-AE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="">
      <div className="flex flex-col space-y-8">
        {/* رأس الصفحة */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              إدارة طاقم العمل
            </h1>
            <p className="text-muted-foreground">
              إدارة المشرفين وصلاحياتهم في النظام
            </p>
          </div>
          <Link href="/admin-users/add">
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مشرف جديد
            </Button>
          </Link>
        </div>
        {/* شريط البحث والتصفية */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 md:space-x-reverse">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="البحث عن مشرف..."
              className="pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>الحالة</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
                  الكل
                  {selectedStatus === null && (
                    <Check className="mr-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("active")}>
                  نشط
                  {selectedStatus === "active" && (
                    <Check className="mr-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("inactive")}>
                  غير نشط
                  {selectedStatus === "inactive" && (
                    <Check className="mr-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  <span>الصلاحيات</span>
                  {selectedPermissions.length > 0 && (
                    <Badge variant="secondary" className="mr-1">
                      {selectedPermissions.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">تصفية حسب الصلاحيات</h4>
                    {selectedPermissions.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPermissions([])}
                        className="h-auto p-0 text-xs text-muted-foreground"
                      >
                        مسح الكل
                      </Button>
                    )}
                  </div>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2 space-x-reverse"
                      >
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPermissions([
                                ...selectedPermissions,
                                permission.id,
                              ]);
                            } else {
                              setSelectedPermissions(
                                selectedPermissions.filter(
                                  (id) => id !== permission.id
                                )
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name.ar.ar}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                      تطبيق
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>{" "}
        {/* عرض المشرفين */}
        {loading ? (
          <AdminUsersSkeleton />
        ) : (
          <>
            {admins.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {admins.map((admin) => (
                  <Card
                    key={admin.id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage
                              src={admin.avatar || ""}
                              alt={admin.full_name}
                            />
                            <AvatarFallback className="text-lg">
                              {getInitials(admin.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">
                              {admin.full_name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <UserCog className="h-3.5 w-3.5" />
                              <span>مشرف</span>
                              <Badge
                                variant={
                                  admin.is_active ? "default" : "secondary"
                                }
                                className="mr-2 px-1 py-0 text-[10px]"
                              >
                                {admin.is_active ? "نشط" : "غير نشط"}
                              </Badge>
                            </CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">فتح القائمة</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(admin);
                                setIsDetailsOpen(true);
                              }}
                            >
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/admin-users/${admin.id}/edit`}
                                className="flex w-full"
                              >
                                تعديل البيانات
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(admin);
                                setPermissionsToUpdate(
                                  admin.admin_permissions.map((p) => p.id)
                                );
                                setIsPermissionsDialogOpen(true);
                              }}
                            >
                              إدارة الصلاحيات
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setSelectedUser(admin);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              حذف المشرف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            البريد الإلكتروني:
                          </span>
                          <span className="font-medium">
                            {admin.email || "غير متوفر"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            رقم الهاتف:
                          </span>
                          <span
                            className="font-medium"
                            style={{ unicodeBidi: "plaintext" }}
                          >
                            {admin.full_phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            تاريخ الإضافة:
                          </span>
                          <span className="font-medium">
                            {formatDate(admin.created_at)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="w-full">
                        <div className="mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            الصلاحيات:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {admin.admin_permissions.length == 0 ? (
                            <Badge variant="outline" className="rounded-md">
                              لا توجد صلاحيات
                            </Badge>
                          ) : (
                            admin.admin_permissions
                              .slice(0, 3)
                              .map((permission) => (
                                <Badge
                                  key={permission.id}
                                  variant="outline"
                                  className="rounded-md"
                                >
                                  {permission.name.ar.ar}
                                </Badge>
                              ))
                          )}
                          {admin.admin_permissions.length > 3 && (
                            <Badge variant="outline" className="rounded-md">
                              +{admin.admin_permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <UserCog className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">لا توجد نتائج</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  لم يتم العثور على أي مشرفين مطابقين لمعايير البحث الخاصة بك
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus(null);
                    setSelectedPermissions([]);
                  }}
                >
                  مسح عوامل التصفية
                </Button>
              </div>
            )}
          </>
        )}
        {/* ترقيم الصفحات */}
        {!loading && admins.length > 0 && paginationMeta && (
          <PaginationWithInfo
            currentPage={paginationMeta.current_page}
            totalPages={paginationMeta.last_page}
            totalItems={paginationMeta.total}
            itemsPerPage={paginationMeta.limit}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
      {/* مربع حوار تفاصيل المشرف */}
      {selectedUser && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">تفاصيل المشرف</DialogTitle>
              <DialogDescription>
                عرض كافة معلومات المشرف وصلاحياته
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage
                      src={selectedUser.avatar || ""}
                      alt={selectedUser.full_name}
                    />
                    <AvatarFallback className="text-xl">
                      {getInitials(selectedUser.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedUser.full_name}
                    </h3>
                    <p className="text-muted-foreground">
                      <Badge
                        variant={
                          selectedUser.is_active ? "default" : "secondary"
                        }
                      >
                        {selectedUser.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">المعلومات الشخصية</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        الاسم الأول:
                      </span>
                      <span className="font-medium">
                        {selectedUser.first_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        الاسم الأخير:
                      </span>
                      <span className="font-medium">
                        {selectedUser.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        البريد الإلكتروني:
                      </span>
                      <span className="font-medium">
                        {selectedUser.email || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">رقم الهاتف:</span>
                      <span className="font-medium" dir="ltr">
                        {selectedUser.full_phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الجنس:</span>
                      <span className="font-medium">
                        {selectedUser.gender === "male" ? "ذكر" : "أنثى"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        تاريخ الميلاد:
                      </span>
                      <span className="font-medium">
                        {selectedUser.birth_date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">معلومات الحساب</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الدور:</span>
                      <span className="font-medium">مشرف</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        حالة الحساب:
                      </span>
                      <span className="font-medium">
                        {selectedUser.is_active ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        حالة التحقق:
                      </span>
                      <span className="font-medium">
                        {selectedUser.is_verified
                          ? "تم التحقق"
                          : "لم يتم التحقق"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        تاريخ الإنشاء:
                      </span>
                      <span className="font-medium">
                        {selectedUser.created_at}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">الصلاحيات</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        setIsPermissionsDialogOpen(true);
                      }}
                    >
                      إدارة الصلاحيات
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.admin_permissions.map(
                      (permission: AdminPermission) => (
                        <Badge key={permission.id} variant="outline">
                          {permission.name.ar.ar}
                        </Badge>
                      )
                    )}
                    {selectedUser.admin_permissions.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        لا توجد صلاحيات محددة
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                إغلاق
              </Button>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-x-reverse sm:space-y-0">
                <Link href={`/admin-users/${selectedUser.id}/edit`}>
                  <Button variant="outline">تعديل البيانات</Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  حذف المشرف
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}{" "}
      {/* مربع حوار حذف المشرف */}
      {selectedUser && (
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
                  src={selectedUser.avatar || ""}
                  alt={selectedUser.full_name}
                />
                <AvatarFallback>
                  {getInitials(selectedUser.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email || selectedUser.full_phone}
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
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
      )}
      {/* مربع حوار إدارة الصلاحيات */}
      {selectedUser && (
        <Dialog
          open={isPermissionsDialogOpen}
          onOpenChange={(open) => {
            if (!isSavingPermissions) {
              setIsPermissionsDialogOpen(open);
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إدارة صلاحيات المشرف</DialogTitle>
              <DialogDescription>
                تحديد الصلاحيات المتاحة للمشرف {selectedUser.full_name}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-2 space-x-reverse rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`perm-${permission.id}`}
                      checked={permissionsToUpdate.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPermissionsToUpdate([
                            ...permissionsToUpdate,
                            permission.id,
                          ]);
                        } else {
                          setPermissionsToUpdate(
                            permissionsToUpdate.filter(
                              (id) => id !== permission.id
                            )
                          );
                        }
                      }}
                      disabled={isSavingPermissions}
                    />
                    <label
                      htmlFor={`perm-${permission.id}`}
                      className="flex flex-1 cursor-pointer items-center gap-2"
                    >
                      <span className="font-medium">
                        {permission.name.ar.ar}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({permission.key})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setIsPermissionsDialogOpen(false)}
                disabled={isSavingPermissions}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleUpdatePermissions}
                disabled={isSavingPermissions}
              >
                {isSavingPermissions ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Check className="ml-2 h-4 w-4" />
                    حفظ الصلاحيات
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
