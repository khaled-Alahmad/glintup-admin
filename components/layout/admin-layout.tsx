"use client";

import type React from "react";

import { Suspense, useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Bell, DoorClosed, DoorOpen, LogOutIcon, Menu, Search, Settings, User } from "lucide-react";
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

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  avatar: string | null;
  role: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchData("general/profile");
        if (response.success) {
          setUserProfile({
            id: response.data.id,
            full_name: response.data.full_name,
            email: response.data.email,
            avatar: response.data.avatar,
            role: response.data.role
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
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
      // Call logout API
      const response = await addData("admin/auth/logout", {});
      console.log("Logout response:", response);

      // Show success message
      if (response.success) {
        toast({
          title: "تم تسجيل الخروج بنجاح",
          description: "شكرًا لك على استخدام خدمتنا. نتمنى لك يوماً رائعًا!",
          variant: "default",
        });
      }

      // Always call handleLogout regardless of API response
      // This function will clear localStorage and cookies, and redirect to login
      handleLogout();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, attempt to log out locally
      handleLogout();
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
                          className={`h-2 w-2 mt-1.5 rounded-full ${notification.is_read ? "bg-gray-300" : "bg-blue-500"
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

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 border cursor-pointer">
                  <AvatarImage src={userProfile?.avatar || "/placeholder-user.jpg"} alt={userProfile?.full_name || "User"} />
                  <AvatarFallback>{userProfile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                {/* <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{userProfile?.full_name || "Loading..."}</span>
                    <span className="text-xs text-muted-foreground">{userProfile?.email || ""}</span>
                  </div> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="flex flex-col gap-1 pt-2 pb-3">
                  <span>{userProfile?.full_name}</span>
                  <span className="font-normal text-xs text-muted-foreground">{userProfile?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="ml-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center">
                    <Settings className="ml-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowLogoutModal(true)}
                  className="cursor-pointer text-red-500 focus:text-red-500 flex items-center"
                >
                  <LogOutIcon className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Logout button moved to user dropdown */}
            {/* Confirm Logout Modal */}
            {showLogoutModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-xs">
                  <h2 className="text-lg font-semibold mb-2 text-center">تأكيد تسجيل الخروج</h2>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    هل أنت متأكد أنك تريد تسجيل الخروج؟
                  </p>
                  <div className="flex justify-between gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowLogoutModal(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setShowLogoutModal(false);
                        handleLogoutClick();
                      }}
                    >
                      تسجيل الخروج
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 w-full max-w-full overflow-x-hidden">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
