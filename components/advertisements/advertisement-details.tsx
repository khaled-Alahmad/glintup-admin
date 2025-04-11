"use client";

import { useEffect, useState } from "react";
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
import { deleteData, fetchData } from "@/lib/apiHelper";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AdvertisementDetailsProps {
  advertisementId: string;
}

export default function AdvertisementDetails({
  advertisementId,
}: AdvertisementDetailsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [advertisement, setAdvertisement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchAdvertisement = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(`admin/promotion-ads/${advertisementId}`);
      if (response.success) {
        setAdvertisement(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch advertisement:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب بيانات الإعلان",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteData(`admin/promotion-ads/${advertisementId}`);
      if (response.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الإعلان بنجاح",
          variant: "default",
        });
        router.push('/advertisements');
      }
    } catch (error) {
      console.error('Failed to delete advertisement:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الإعلان",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchAdvertisement();
  }, [advertisementId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!advertisement) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">لا يوجد بيانات للإعلان</p>
      </div>
    );
  }
  const calculateRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
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
                    {advertisement.title.ar}
                  </CardTitle>
                  <CardDescription>
                    تم الإنشاء في {advertisement.created_at} | آخر تحديث{" "}
                    {advertisement.updated_at}
                  </CardDescription>

                </div>
                <Badge variant={advertisement.is_active ? "default" : "secondary"}>
                  {advertisement.is_active ? "نشط" : "غير نشط"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="rounded-md overflow-hidden">
                <img
                  src={advertisement.image_url || "/placeholder.svg"}
                  alt={advertisement.title.ar}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">وصف الإعلان</h3>
                  <p>{advertisement.description.ar}</p>
                  <p className="text-muted-foreground">{advertisement.description.en}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">فترة العرض</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ البداية:</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{advertisement.valid_from}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{advertisement.valid_to}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الأيام المتبقية:</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{calculateRemainingDays(advertisement.valid_to)} يوم</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <Separator /> */}



              {/* <Separator /> */}

              {/* <div className="space-y-2">
                <h3 className="text-lg font-medium">الاستهداف</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
              {/* <div className="p-3 border rounded-md">
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
                  </div> */}
              {/* <div className="p-3 border rounded-md">
                    <p className="text-sm text-muted-foreground">
                      المناطق المستهدفة
                    </p>
                    <p className="font-medium">
                      {advertisement.target.locations.join(", ")}
                    </p>
                  </div> */}
              {/* </div>
              </div> */}
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
                  <span className="font-bold">{advertisement.views}</span>
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
              {/* <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>معدل النقر إلى الظهور</span>
                  </div>
                  <span className="font-bold">{advertisement.ctr}</span>
                </div>
              </div> */}
            </CardContent>
            {/* <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 ml-2" />
                عرض التقرير الكامل
              </Button>
            </CardFooter> */}
          </Card>

          {/* <Card>
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
          </Card> */}
        </div>
      </div>

      {/* مربع حوار حذف الإعلان */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف الإعلان</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا الإعلان؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">
              أنت على وشك حذف إعلان &quot;{advertisement.title.ar}&quot;. هذا
              الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
