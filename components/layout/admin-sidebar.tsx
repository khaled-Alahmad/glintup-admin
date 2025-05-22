"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarCheck2,
  MessageSquare,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Users,
  Wallet,
  HandHeart,
  X,
  FileText,
  Gift,
  Bell,
  UserCog,
  Loader2,
} from "lucide-react";
import { CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "../ui/logo";
import { fetchData } from "@/lib/apiHelper";
import { useToast } from "@/components/ui/use-toast";

interface AdminSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobile, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user permissions from API
  useEffect(() => {
    const fetchUserPermissions = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("admin/permissions");
        if (response.success) {
          // Extract permission keys from API response
          const permissionKeys = response.data.map(
            (permission: any) => permission.key
          );
          setUserPermissions(permissionKeys);
        } else {
          console.error("Failed to fetch permissions:", response.message);
          toast({
            variant: "destructive",
            title: "خطأ في تحميل الصلاحيات",
            description: response.message || "فشل في تحميل صلاحيات المستخدم",
          });
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل الصلاحيات",
          description: "حدث خطأ أثناء تحميل صلاحيات المستخدم",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [toast]);

  // Define all possible sidebar links with their required permissions
  const allLinks = [
    {
      name: "لوحة المعلومات",
      href: "/",
      icon: BarChart3,
      active: pathname === "/",
      requiredPermission: "dashboard",
    },
    {
      name: "الصالونات",
      href: "/salons",
      icon: Store,
      active: pathname.startsWith("/salons"),
      requiredPermission: "salons",
    },
    {
      name: "المستخدمين",
      href: "/users",
      icon: Users,
      active: pathname.startsWith("/users"),
      requiredPermission: "users",
    },
    {
      name: "طاقم العمل",
      href: "/admin-users",
      icon: UserCog,
      active: pathname.startsWith("/admin-users"),
      requiredPermission: "admin_users",
    },
    {
      name: "المجموعات",
      href: "/services",
      icon: HandHeart,
      active: pathname.startsWith("/services"),
      requiredPermission: "services",
    },
    {
      name: "بطاقات الهدايا",
      href: "/gift-cards",
      icon: Gift,
      active: pathname.startsWith("/gift-cards"),
      requiredPermission: "gift_cards",
    },
    // {
    //   name: "الأحداث",
    //   href: "/events",
    //   icon: CalendarClock,
    //   active: pathname.startsWith("/events"),
    //   requiredPermission: "events",
    // },
    {
      name: "الحجوزات",
      href: "/appointments",
      icon: CalendarCheck2,
      active: pathname.startsWith("/appointments"),
      requiredPermission: "appointments",
    },
    {
      name: "المعاملات المالية",
      href: "/payments",
      icon: Wallet,
      active: pathname.startsWith("/payments"),
      requiredPermission: "payments",
    },
    {
      name: "الإعلانات",
      href: "/advertisements",
      icon: ShoppingBag,
      active: pathname.startsWith("/advertisements"),
      requiredPermission: "advertisements",
    },
    // {
    //   name: "العروض والمحتوى",
    //   href: "/offers",
    //   icon: FileText,
    //   active: pathname.startsWith("/offers"),
    //   requiredPermission: "offers",
    // },
    {
      name: "التقييمات",
      href: "/reviews",
      icon: Star,
      active: pathname.startsWith("/reviews"),
      requiredPermission: "reviews",
    },
    {
      name: "الشكاوى والدعم",
      href: "/complaints",
      icon: MessageSquare,
      active: pathname.startsWith("/complaints"),
      requiredPermission: "complaints",
    },
    {
      name: "الإشعارات",
      href: "/notifications",
      icon: Bell,
      active: pathname.startsWith("/notifications"),
      requiredPermission: "notifications",
    },
    {
      name: "الإعدادات",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
      requiredPermission: "settings",
    },
  ];

  // Filter links based on user permissions
  // Show all links if user has no permissions data loaded yet or during loading
  const links =
    isLoading || userPermissions.length === 0
      ? allLinks
      : allLinks.filter(
          (link) =>
            userPermissions.includes(link.requiredPermission) ||
            link.requiredPermission === "dashboard" // Always show dashboard
        );

  return (
    <div className="flex h-full w-full flex-col bg-sidebar overflow-y-auto">
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-6">
        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="mr-auto text-sidebar-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </Button>
        )}
        <div className="flex items-center gap-2 font-semibold text-xl">
          <Logo />
          {/* <span className="text-sidebar-foreground">Glintup</span> */}
          <span className="text-sidebar-foreground/70 text-sm">
            لوحة التحكم
          </span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-sidebar-foreground/70" />
            <p className="mt-4 text-sm text-sidebar-foreground/70">
              جاري تحميل القائمة...
            </p>
          </div>
        ) : (
          links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                link.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                  : "text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
              onClick={mobile ? onClose : undefined}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {link.name}
            </Link>
          ))
        )}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/70">
          نسخة 1.0.0 - جميع الحقوق محفوظة © 2025
        </p>
      </div>
    </div>
  );
}
