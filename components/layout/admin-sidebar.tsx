"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobile, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const links = [
    {
      name: "لوحة المعلومات",
      href: "/",
      icon: BarChart3,
      active: pathname === "/",
    },
    {
      name: "الصالونات",
      href: "/salons",
      icon: Store,
      active: pathname.startsWith("/salons"),
    },
    {
      name: "المستخدمين",
      href: "/users",
      icon: Users,
      active: pathname.startsWith("/users"),
    },
    {
      name: "الخدمات",
      href: "/services",
      icon: HandHeart,
      active: pathname.startsWith("/services"),
    },
    {
      name: "الحجوزات",
      href: "/appointments",
      icon: CalendarCheck2,
      active: pathname.startsWith("/appointments"),
    },
    {
      name: "المدفوعات والاسترجاع",
      href: "/payments",
      icon: Wallet,
      active: pathname.startsWith("/payments"),
    },
    {
      name: "الإعلانات",
      href: "/advertisements",
      icon: ShoppingBag,
      active: pathname.startsWith("/advertisements"),
    },
    // {
    //   name: "العروض والمحتوى",
    //   href: "/offers",
    //   icon: FileText,
    //   active: pathname.startsWith("/offers"),
    // },
    {
      name: "التقييمات",
      href: "/reviews",
      icon: Star,
      active: pathname.startsWith("/reviews"),
    },
    {
      name: "الشكاوى والدعم",
      href: "/complaints",
      icon: MessageSquare,
      active: pathname.startsWith("/complaints"),
    },
    {
      name: "الإعدادات",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ];

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
          <span className="text-sidebar-foreground">Glintup</span>
          <span className="text-sidebar-foreground/70 text-sm">
            لوحة التحكم
          </span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {links.map((link) => (
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
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/70">
          نسخة 1.0.0 - جميع الحقوق محفوظة © 2023
        </p>
      </div>
    </div>
  );
}
