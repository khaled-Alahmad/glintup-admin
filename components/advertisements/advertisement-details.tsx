"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Eye,
  Trash2,
  LinkIcon,
  Share2,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

interface AdvertisementDetailsProps {
  advertisementId: string;
}

export default function AdvertisementDetails({
  advertisementId,
}: AdvertisementDetailsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // بيانات نموذجية للإعلان
  const advertisement = {
    id: advertisementId,
    title: "عروض الصيف المميزة",
    description:
      "استمتعي بعروض الصيف المميزة في صالونات Glintup. خصومات تصل إلى 50% على جميع الخدمات. العرض ساري حتى نهاية الشهر.",
    image: "/placeholder.svg?height=400&width=800",
    status: "active",
    type: "banner",
    position: "home_page",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    clicks: 1245,
    impressions: 5678,
    ctr: "21.9%",
    target: {
      url: "https://glintup.com/summer-offers",
      salon: "جميع الصالونات",
      audience: "جميع المستخدمين",
      locations: ["دبي", "أبو ظبي", "الشارقة"],
    },
    createdAt: "2023-05-25",
    updatedAt: "2023-05-28",
  };

  // حساب الأيام المتبقية للإعلان
  const calculateRemainingDays = () => {
    const endDate = new Date(advertisement.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = calculateRemainingDays();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/advertisements">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            تفاصيل الإعلان
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/advertisements/${advertisementId}/edit`}>
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 ml-2" />
            حذف
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {advertisement.title}
                  </CardTitle>
                  <CardDescription>
                    تم الإنشاء في {advertisement.createdAt} | آخر تحديث{" "}
                    {advertisement.updatedAt}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    advertisement.status === "active" ? "default" : "secondary"
                  }
                >
                  {advertisement.status === "active" ? "نشط" : "غير نشط"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md overflow-hidden">
                <img
                  src={advertisement.image || "/placeholder.svg"}
                  alt={advertisement.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">وصف الإعلان</h3>
                <p>{advertisement.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">معلومات الإعلان</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        نوع الإعلان:
                      </span>
                      <span>
                        {advertisement.type === "banner"
                          ? "بانر"
                          : "إعلان جانبي"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        موقع الظهور:
                      </span>
                      <span>
                        {advertisement.position === "home_page"
                          ? "الصفحة الرئيسية"
                          : "صفحة البحث"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        الرابط المستهدف:
                      </span>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-4 w-4" />
                        <a
                          href={advertisement.target.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          فتح الرابط
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">فترة العرض</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        تاريخ البداية:
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{advertisement.startDate}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        تاريخ الانتهاء:
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{advertisement.endDate}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        الأيام المتبقية:
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{remainingDays} يوم</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">الاستهداف</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-md">
                    <p className="text-sm text-muted-foreground">
                      الصالون المستهدف
                    </p>
                    <p className="font-medium">{advertisement.target.salon}</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-sm text-muted-foreground">
                      الجمهور المستهدف
                    </p>
                    <p className="font-medium">
                      {advertisement.target.audience}
                    </p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-sm text-muted-foreground">
                      المناطق المستهدفة
                    </p>
                    <p className="font-medium">
                      {advertisement.target.locations.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء الإعلان</CardTitle>
              <CardDescription>إحصائيات أداء الإعلان</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>المشاهدات</span>
                  </div>
                  <span className="font-bold">{advertisement.impressions}</span>
                </div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <span>النقرات</span>
                  </div>
                  <span className="font-bold">{advertisement.clicks}</span>
                </div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>معدل النقر إلى الظهور</span>
                  </div>
                  <span className="font-bold">{advertisement.ctr}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 ml-2" />
                عرض التقرير الكامل
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="h-4 w-4 ml-2" />
                مشاركة الإعلان
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 ml-2" />
                معاينة الإعلان
              </Button>
              {advertisement.status === "active" ? (
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 ml-2" />
                  إيقاف مؤقت
                </Button>
              ) : (
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 ml-2" />
                  تنشيط
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* مربع حوار حذف الإعلان */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف الإعلان</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا الإعلان؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">
              أنت على وشك حذف إعلان &quot;{advertisement.title}&quot;. هذا
              الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => console.log("تم حذف الإعلان")}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
