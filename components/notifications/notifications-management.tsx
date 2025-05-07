"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaginationWithInfo } from "@/components/ui/pagination-with-info";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  CheckCircle,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Trash,
  User,
} from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { fetchData, updateData, deleteData, addData } from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notificationable_id: number | null;
  notificationable_type: string | null;
  notificationable: any | null;
  read_at: string | null;
  is_read: boolean;
  metadata: {
    data: any[];
    replace: any[];
    notificationable: {
      id: number;
      type: string;
    } | null;
  };
  user: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string | null;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

interface NotificationResponse {
  success: boolean;
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface NotificationResponse {
  success: boolean;
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// بيانات محاكاة للإشعارات
const mockData: NotificationResponse = {
  success: true,
  data: [
    {
      id: 3,
      user_id: 7,
      title: "حجز موعد جديد",
      message: "تم حجز موعد جديد في صالون الأناقة",
      notificationable_id: null,
      notificationable_type: null,
      notificationable: null,
      read_at: null,
      is_read: false,
      metadata: {
        data: [],
        replace: [],
        notificationable: {
          id: 1,
          type: "App\\Models\\Salons\\Salon",
        },
      },
      user: {
        id: 7,
        first_name: "Admin",
        last_name: "User",
        full_name: "Admin User",
        avatar: null,
        role: "admin",
      },
      created_at: "2025-04-16 18:17:59",
      updated_at: "2025-04-16 18:17:59",
    },
    {
      id: 2,
      user_id: 7,
      title: "تم إضافة مراجعة جديدة",
      message: "تم إضافة تقييم جديد لصالون الجمال الفاخر",
      notificationable_id: 2,
      notificationable_type: "App\\Models\\Reviews\\Review",
      notificationable: null,
      read_at: "2025-04-16 12:00:00",
      is_read: true,
      metadata: {
        data: [],
        replace: [],
        notificationable: {
          id: 2,
          type: "App\\Models\\Reviews\\Review",
        },
      },
      user: {
        id: 7,
        first_name: "Admin",
        last_name: "User",
        full_name: "Admin User",
        avatar: null,
        role: "admin",
      },
      created_at: "2025-04-15 14:30:22",
      updated_at: "2025-04-16 12:00:00",
    },
    {
      id: 1,
      user_id: 5,
      title: "تم تسجيل صالون جديد",
      message: "تم تسجيل صالون جديد بإسم ماسة الجمال ويتطلب المراجعة",
      notificationable_id: 3,
      notificationable_type: "App\\Models\\Salons\\Salon",
      notificationable: null,
      read_at: "2025-04-14 09:15:40",
      is_read: true,
      metadata: {
        data: [],
        replace: [],
        notificationable: {
          id: 3,
          type: "App\\Models\\Salons\\Salon",
        },
      },
      user: {
        id: 5,
        first_name: "Sara",
        last_name: "Ahmed",
        full_name: "Sara Ahmed",
        avatar: null,
        role: "salon_owner",
      },
      created_at: "2025-04-13 22:45:10",
      updated_at: "2025-04-14 09:15:40",
    },
  ],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 3,
  },
};

// إضافة 10 إشعارات أخرى للمحاكاة
for (let i = 4; i <= 15; i++) {
  const isRead = Math.random() > 0.3;
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 10));

  mockData.data.push({
    id: i,
    user_id: 7,
    title: `إشعار رقم ${i}`,
    message: `هذا محتوى الإشعار رقم ${i} للاختبار`,
    notificationable_id: Math.random() > 0.5 ? i : null,
    notificationable_type:
      Math.random() > 0.5 ? "App\\Models\\Salons\\Salon" : null,
    notificationable: null,
    read_at: isRead ? format(new Date(), "yyyy-MM-dd HH:mm:ss") : null,
    is_read: isRead,
    metadata: {
      data: [],
      replace: [],
      notificationable:
        Math.random() > 0.5
          ? {
              id: i,
              type: "App\\Models\\Salons\\Salon",
            }
          : null,
    },
    user: {
      id: 7,
      first_name: "Admin",
      last_name: "User",
      full_name: "Admin User",
      avatar: null,
      role: "admin",
    },
    created_at: format(createdDate, "yyyy-MM-dd HH:mm:ss"),
    updated_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  });
}

mockData.meta.total = mockData.data.length;

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
  });

  // Add send notification function
  const handleSendNotification = async () => {
    try {
      setIsSending(true);
      const response = await addData(
        "admin/users/send-notification",
        notificationForm
      );

      if (response.success) {
        toast({
          title: "نجاح",
          description: "تم إرسال الإشعار بنجاح",
        });
        setIsDialogOpen(false);
        setNotificationForm({ title: "", message: "" });
        fetchNotifications();
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال الإشعار",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // جلب البيانات من الخادم
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(activeTab !== "all" && {
          is_read: activeTab === "read" ? "1" : "0",
        }),
      });

      const response = await fetchData(`general/notifications?${queryParams}`);
      if (response.success) {
        setNotifications(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setTotalItems(response.meta.total);
        setItemsPerPage(response.meta.per_page);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الإشعارات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, itemsPerPage, searchTerm, activeTab]);

  // تعيين الإشعار كمقروء
  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await updateData(`admin/notifications/${id}/read`, {});
      if (response.success) {
        toast({
          title: "نجاح",
          description: "تم تعيين الإشعار كمقروء",
        });
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "خطأ",
        description: "فشل في تعيين الإشعار كمقروء",
        variant: "destructive",
      });
    }
  };

  // تعيين جميع الإشعارات كمقروءة
  const handleMarkAllAsRead = async () => {
    try {
      const response = await updateData("admin/notifications/read-all", {});
      if (response.success) {
        toast({
          title: "نجاح",
          description: "تم تعيين جميع الإشعارات كمقروءة",
        });
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "خطأ",
        description: "فشل في تعيين جميع الإشعارات كمقروءة",
        variant: "destructive",
      });
    }
  };

  // حذف الإشعار
  const handleDeleteNotification = async (id: number) => {
    try {
      const response = await deleteData(`admin/notifications/${id}`);
      if (response.success) {
        toast({
          title: "نجاح",
          description: "تم حذف الإشعار بنجاح",
        });
        if (notifications.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchNotifications();
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الإشعار",
        variant: "destructive",
      });
    }
  };

  // عرض تفاصيل الإشعار
  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);

    // تعيين الإشعار كمقروء إذا لم يكن مقروءًا
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
  };

  // تنسيق التاريخ بشكل نسبي (منذ...)
  const formatRelativeDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  // الحصول على نوع الكيان المرتبط بصيغة أكثر وضوحًا
  const getNotificationableTypeLabel = (type: string | null) => {
    if (!type) return "";

    const typeMap: Record<string, string> = {
      "App\\Models\\Salons\\Salon": "صالون",
      "App\\Models\\Reviews\\Review": "تقييم",
      "App\\Models\\Appointments\\Appointment": "موعد",
      "App\\Models\\Users\\User": "مستخدم",
    };

    return typeMap[type] || type.split("\\").pop() || "";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <CardTitle>الإشعارات</CardTitle>
              <CardDescription>عرض وإدارة إشعارات النظام</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    <Bell className="ml-2 h-4 w-4" />
                    إرسال إشعار للجميع
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إرسال إشعار لجميع المستخدمين</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">عنوان الإشعار</Label>
                      <Input
                        id="title"
                        value={notificationForm.title}
                        onChange={(e) =>
                          setNotificationForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="أدخل عنوان الإشعار"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">محتوى الإشعار</Label>
                      <Textarea
                        id="message"
                        value={notificationForm.message}
                        onChange={(e) =>
                          setNotificationForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        placeholder="أدخل محتوى الإشعار"
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSending}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleSendNotification}
                      disabled={
                        !notificationForm.title ||
                        !notificationForm.message ||
                        isSending
                      }
                    >
                      {isSending ? (
                        <>
                          <span className="animate-spin ml-2">⏳</span>
                          جاري الإرسال...
                        </>
                      ) : (
                        "إرسال"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={!notifications.some((n) => !n.is_read)}
              >
                <CheckCircle2 className="ml-2 h-4 w-4" />
                تعيين الكل كمقروء
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="بحث في الإشعارات..."
                    className="pl-3 pr-9"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="unread">غير مقروء</TabsTrigger>
                    <TabsTrigger value="read">مقروء</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number.parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="عدد العناصر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 عناصر</SelectItem>
                    <SelectItem value="10">10 عناصر</SelectItem>
                    <SelectItem value="20">20 عنصر</SelectItem>
                    <SelectItem value="50">50 عنصر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-20 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">لا توجد إشعارات</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm
                    ? "لا توجد إشعارات تطابق بحثك"
                    : activeTab === "unread"
                    ? "ليس لديك إشعارات غير مقروءة"
                    : activeTab === "read"
                    ? "ليس لديك إشعارات مقروءة"
                    : "ليس لديك أي إشعارات"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border relative transition-colors ${
                      notification.is_read
                        ? "bg-background"
                        : "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-800"
                    }`}
                  >
                    {!notification.is_read && (
                      <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-500" />
                    )}

                    <div className="flex gap-3">
                      <div className="pt-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Bell className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="flex gap-2 shrink-0">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                              >
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                <span className="sr-only">تعيين كمقروء</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleViewDetails(notification)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">عرض التفاصيل</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() =>
                                handleDeleteNotification(notification.id)
                              }
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">حذف</span>
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                            <span>
                              {formatRelativeDate(notification.created_at)}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                            <span>{notification.user.full_name}</span>
                          </div>

                          {notification.notificationable_type && (
                            <Badge
                              variant="outline"
                              className="h-5 text-xs rounded-md"
                            >
                              {getNotificationableTypeLabel(
                                notification.notificationable_type
                              )}
                            </Badge>
                          )}

                          {notification.is_read && (
                            <Badge
                              variant="outline"
                              className="h-5 text-xs rounded-md bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                            >
                              مقروء
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {!isLoading && notifications.length > 0 && (
            <PaginationWithInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              className="mx-auto"
            />
          )}
        </CardFooter>
      </Card>

      {/* مربع حوار تفاصيل الإشعار */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-xl w-full max-h-[80vh] overflow-auto">
            <div className="p-5 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {selectedNotification.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNotification(null)}
                >
                  إغلاق
                </Button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  المحتوى
                </h4>
                <p>{selectedNotification.message}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    معلومات المرسل
                  </h4>
                  <div className="rounded-md border p-3 bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedNotification.user.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedNotification.user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    معلومات الإشعار
                  </h4>
                  <div className="rounded-md border p-3 bg-muted/50">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          تاريخ الإنشاء:
                        </span>
                        <p>
                          {format(
                            parseISO(selectedNotification.created_at),
                            "yyyy/MM/dd",
                            { locale: ar }
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            parseISO(selectedNotification.created_at),
                            "HH:mm:ss",
                            { locale: ar }
                          )}
                        </p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">
                          حالة القراءة:
                        </span>
                        <p>
                          {selectedNotification.is_read ? "مقروء" : "غير مقروء"}
                        </p>
                        {selectedNotification.read_at && (
                          <p className="text-xs text-muted-foreground">
                            تمت القراءة:{" "}
                            {format(
                              parseISO(selectedNotification.read_at),
                              "yyyy/MM/dd HH:mm",
                              { locale: ar }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedNotification.metadata?.notificationable && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    معلومات الكيان المرتبط
                  </h4>
                  <div className="rounded-md border p-3 bg-muted/50">
                    <div className="flex justify-between">
                      <div>
                        <span className="text-muted-foreground">النوع:</span>
                        <p>
                          {getNotificationableTypeLabel(
                            selectedNotification.metadata.notificationable.type
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">المعرف:</span>
                        <p>
                          {selectedNotification.metadata.notificationable.id}
                        </p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 ml-1" />
                          عرض الكيان المرتبط
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-muted/20 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNotification(null)}
              >
                إغلاق
              </Button>

              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleDeleteNotification(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                >
                  <Trash className="h-4 w-4 ml-1" />
                  حذف
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
