"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ComplaintDetailsProps {
  complaint: {
    id: number;
    user_id: number;
    salon_id: number;
    title: string;
    content: string;
    status: string;
    priority: string;
    category: string;
    hide_identity: boolean;
    reviewed_by: number | null;
    reviewed_at: string | null;
    user: {
      id: number;
      full_name: string;
      avatar: string | null;
      full_phone: string;
      gender: string;
      birth_date: string;
      age: string;
      address: string;
      is_active: boolean;
      is_verified: boolean;
    };
    reviewer: {
      id: number;
      full_name: string;
      avatar: string | null;
    } | null;
    created_at: string;
    updated_at: string;
  };
}

export default function ComplaintDetails({ complaint }: ComplaintDetailsProps) {
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "جديد":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <AlertCircle className="h-3 w-3 ml-1" />
            جديد
          </Badge>
        );
      case "قيد المعالجة":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            <Clock className="h-3 w-3 ml-1" />
            قيد المعالجة
          </Badge>
        );
      case "مغلق":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="h-3 w-3 ml-1" />
            مغلق
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "عالية":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            عالية
          </Badge>
        );
      case "متوسطة":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            متوسطة
          </Badge>
        );
      case "منخفضة":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            منخفضة
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {complaint.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                تم الإنشاء في{" "}
                {new Date(complaint.created_at).toLocaleDateString("ar-EG")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(complaint.status)}
              {getPriorityBadge(complaint.priority)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-1">
              {!complaint.hide_identity ? (
                <>
                  {" "}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">معلومات العميل</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                          <AvatarImage
                            src={complaint.user?.avatar || ""}
                            alt={complaint.user?.full_name}
                          />
                          <AvatarFallback>
                            {complaint.user?.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {complaint.user.full_name}
                          </h3>
                          <div className="mt-2 space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {complaint.user.full_phone}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              {complaint.user.gender === "male"
                                ? "ذكر"
                                : "أنثى"}{" "}
                              • {complaint.user.age}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {complaint.user.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">هوية مخفية</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                      تم إخفاء هوية العميل بناءً على طلبه.
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* تفاصيل الشكوى */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تفاصيل الشكوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm">{complaint.content}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {complaint.hide_identity ? "هوية مخفية" : "هوية ظاهرة"}
                    </div>
                    {complaint.reviewed_by && (
                      <div className="text-sm text-muted-foreground">
                        تمت المراجعة بواسطة {complaint.reviewer?.full_name} في{" "}
                        {new Date(complaint.reviewed_at!).toLocaleDateString(
                          "ar-EG"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
