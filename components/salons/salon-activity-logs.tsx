import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { PaginationWithInfo } from "@/components/ui/pagination-with-info";

interface ActivityLogUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar: string;
  role: string;
  full_phone: string;
}

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  description: {
    en: string;
    ar: string;
  };
  user: ActivityLogUser;
  created_at: string;
  updated_at: string;
}

interface ActivityLogsProps {
  salonId: string | number;
}

export default function SalonActivityLogs({ salonId }: ActivityLogsProps) {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchActivityLogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `admin/activity-logs?salon_id=${salonId}&page=${currentPage}`
      );
      if (response.success) {
        setActivityLogs(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setPerPage(response.meta.per_page);
        setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب سجلات النشاط",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, [salonId, currentPage]);

  const getActionBadge = (action: string) => {
    const actionType = action.split('.')[0];
    const actionVerb = action.split('.')[1];
    
    switch (actionType) {
      case "bookings":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            الحجوزات
          </Badge>
        );
      case "services":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            الخدمات
          </Badge>
        );
      case "users":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            المستخدمين
          </Badge>
        );
      case "payments":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            المدفوعات
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {actionType}
          </Badge>
        );
    }
  };

  const getActionVerbBadge = (action: string) => {
    const actionVerb = action.split('.')[1];
    
    switch (actionVerb) {
      case "create":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            إضافة
          </Badge>
        );
      case "update":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            تعديل
          </Badge>
        );
      case "delete":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            حذف
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {actionVerb}
          </Badge>
        );
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG",);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">سجل النشاط</h3>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الإجراء</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      <p className="text-sm text-muted-foreground">
                        جاري تحميل سجل النشاط...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : activityLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        لا يوجد سجلات نشاط
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                activityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={log.user.avatar} alt={log.user.full_name} />
                          <AvatarFallback>{log.user.first_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{log.user.full_name}</p>
                          {/* <p className="text-xs text-muted-foreground">
                            {log.user.role === "salon_owner" ? "مالك صالون" : 
                             log.user.role === "admin" ? "مدير نظام" : 
                             log.user.role === "staff" ? "موظف" : log.user.role}
                          </p> */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>{getActionVerbBadge(log.action)}</TableCell>
                    <TableCell>
                      <p className="max-w-md truncate">{log.description.ar}</p>
                    </TableCell>
                    <TableCell className="text-nowrap">{formatDateTime(log.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center p-4">
          <PaginationWithInfo
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={perPage}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
