"use client";

import type React from "react";

import { useState } from "react";
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

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                  <span className="sr-only">الإشعارات</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 mt-1">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>الإشعارات</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs text-primary"
                  >
                    تعيين الكل كمقروء
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* إشعار جديد */}
                <DropdownMenuItem className="flex flex-col items-start py-2 px-4 cursor-pointer focus:bg-accent">
                  <div className="flex w-full items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">حجز جديد</p>
                      <p className="text-xs text-muted-foreground">
                        تم حجز موعد جديد في صالون الأناقة
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        منذ 5 دقائق
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>

                {/* إشعار مقروء */}
                <DropdownMenuItem className="flex flex-col items-start py-2 px-4 cursor-pointer focus:bg-accent">
                  <div className="flex w-full items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">تقييم جديد</p>
                      <p className="text-xs text-muted-foreground">
                        قام مستخدم بتقييم صالون الجمال
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        منذ ساعتين
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>

                {/* إشعار مقروء */}
                <DropdownMenuItem className="flex flex-col items-start py-2 px-4 cursor-pointer focus:bg-accent">
                  <div className="flex w-full items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">دفع جديد</p>
                      <p className="text-xs text-muted-foreground">
                        تم استلام دفعة جديدة بقيمة 150 ريال
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        أمس، 14:30
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary cursor-pointer">
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
                <DropdownMenuItem className="cursor-pointer text-red-500">
                  <span className="mr-2">🚪</span> تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
