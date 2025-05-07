"use client";

import type React from "react";

import { Suspense, useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { addData, fetchData, handleLogout } from "@/lib/apiHelper";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Loading from "../ui/loading";

interface AdminLayoutProps {
  children: React.ReactNode;
}
interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("general/notifications");
        if (response.success) {
          console.log("Notifications response:", response);

          setNotifications(response.data);
          // general/notifications/unread-count
          // Fetch unread count
          const unreadResponse = await fetchData(
            "general/notifications/unread-count"
          );
          if (unreadResponse.success) {
            setUnreadCount(unreadResponse.data?.count);
          } else {
            setIsError(true);
          }
          // Set notifications and unread count
          // setNotifications(response.data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);
  const handleMarkAsRead = async (notificationId: number): Promise<void> => {
    setIsLoading(true);
    try {
      const response: { success: boolean } = await addData(
        `general/notifications/${notificationId}/read`,
        {}
      );
      if (response.success) {
        setNotifications((prev: Notification[]) =>
          prev.map((n: Notification) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount((prev: number) => prev - 1);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      const response = await addData("admin/notifications/read_all", {});
      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();
  const { toast } = useToast();
  const handleLogoutClick = async () => {
    try {
      // Call the handleLogout function from apiHelper
      const response = await addData("admin/auth/logout", {});
      // Handle the response as needed
      console.log("Logout response:", response);
      if (response.success) {
        toast({
          title: "تم تسجيل الخروج بنجاح",
          description: "شكرًا لك على استخدام خدمتنا. نتمنى لك يوماً رائعًا!",
          variant: "default",
        });
        // Redirect to the login page or perform any other action
        router.push("/auth/login");
      }
      handleLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  // ... in the dropdown menu section, replace the logout item with:
  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="p-0 w-64">
          <AdminSidebar mobile onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-md z-10 border-b flex h-16 items-center px-4 sticky top-0 w-full">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <h1 className="text-lg font-medium hidden md:block gradient-heading">
            لوحة تحكم Glintup
          </h1>

          {/* <div className="relative mx-4 flex-1 max-w-md hidden md:flex">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              className="pr-9 w-full rounded-full bg-secondary/50 border-0 focus-visible:ring-primary"
            />
          </div> */}

          <div className="flex items-center mr-auto gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 text-white h-4 w-4 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800">
                      {unreadCount}
                    </span>
                  )}

                  <span className="sr-only">الإشعارات</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 mt-1">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>الإشعارات</span>
                  {/* <Button
                    variant="ghost"
                    onClick={handleMarkAllAsRead}
                    disabled={isLoading}
                    size="sm"
                    className="h-auto p-1 text-xs text-primary"
                  >
                    تعيين الكل كمقروء
                  </Button> */}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                    لا توجد إشعارات جديدة
                  </DropdownMenuItem>
                ) : (
                  notifications.map((notification, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="flex flex-col items-start py-2 px-4 cursor-pointer focus:bg-accent"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex w-full items-start gap-2">
                        <div
                          className={`h-2 w-2 mt-1.5 rounded-full ${
                            notification.is_read ? "bg-gray-300" : "bg-blue-500"
                          } flex-shrink-0`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.created_at).toLocaleString(
                              "ar-SA",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
                {isLoading && (
                  <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                    <Loading />
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    // handl;e go to all notifications
                    router.push("/notifications");
                    setUnreadCount(0);
                  }}
                  className="justify-center text-primary cursor-pointer"
                >
                  عرض جميع الإشعارات
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      مشرف
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link href={"/profile"}>
                    <span className="mr-2">👤</span> الملف الشخصي
                  </Link>{" "}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link href={"/profile/edit"}>
                    <span className="mr-2">⚙️</span> إعدادات الحساب
                  </Link>{" "}
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={handleLogoutClick}
                >
                  <span className="mr-2">🚪</span> تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 w-full max-w-full overflow-x-hidden">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
