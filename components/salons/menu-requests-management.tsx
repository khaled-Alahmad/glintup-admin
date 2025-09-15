"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { fetchData, updateData } from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RequestStatus = "pending" | "approved" | "rejected";

interface Salon {
  id: number;
  merchant_commercial_name: string;
  icon_url: string;
  contact_name: string;
  contact_number: string;
}

interface MenuRequest {
  id: number;
  salon_id: number;
  notes: string;
  cost: string;
  status: RequestStatus;
  approved_at: string | null;
  rejected_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  salon: Salon;
}

interface MenuRequestsInfo {
  data: MenuRequest[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface StatusInfo {
  label: string;
  className: string;
}

export default function MenuRequestsTab() {
  const { toast } = useToast();

  // State management
  const [menuRequests, setMenuRequests] = useState<MenuRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  });
  const [selectedRequest, setSelectedRequest] = useState<MenuRequest | null>(
    null
  );
  const [dialogState, setDialogState] = useState({
    showApprove: false,
    showReject: false,
    adminNote: "",
  });
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when search term or status filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearchTerm, statusFilter]);
  const fetchMenuRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        per_page: pagination.perPage.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim());
      }

      const response = await fetchData(
        `admin/salon-menu-requests?${params.toString()}`
      );
      setMenuRequests(response.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.meta.last_page,
        totalItems: response.meta.total,
        perPage: response.meta.per_page,
      }));
    } catch (error) {
      console.error("Error fetching menu requests:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب طلبات القوائم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.perPage,
    statusFilter,
    debouncedSearchTerm,
    toast,
  ]);

  useEffect(() => {
    fetchMenuRequests();
  }, [fetchMenuRequests]); // Handle request approval
  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      await updateData(`admin/salon-menu-requests/${selectedRequest.id}`, {
        admin_note: dialogState.adminNote,
        status: "approved",
      });

      toast({
        title: "تم",
        description: "تم قبول طلب القائمة بنجاح",
      });

      fetchMenuRequests();
      setDialogState((prev) => ({
        ...prev,
        showApprove: false,
        adminNote: "",
      }));
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error approving menu request:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء قبول طلب القائمة",
        variant: "destructive",
      });
    }
  };

  // Handle request rejection
  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      await updateData(`admin/salon-menu-requests/${selectedRequest.id}`, {
        admin_note: dialogState.adminNote,
        status: "rejected",
      });

      toast({
        title: "تم",
        description: "تم رفض طلب القائمة بنجاح",
      });

      fetchMenuRequests();
      setDialogState((prev) => ({
        ...prev,
        showReject: false,
        adminNote: "",
      }));
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error rejecting menu request:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفض طلب القائمة",
        variant: "destructive",
      });
    }
  }; // Memoize status badge information to prevent unnecessary re-renders
  const statusMap = useMemo<Record<string, StatusInfo>>(
    () => ({
      pending: {
        label: "قيد المراجعة",
        className: "bg-gray-100 text-gray-800 border border-gray-200",
      },
      approved: { label: "مقبول", className: "bg-green-100 text-green-800" },
      rejected: { label: "مرفوض", className: "bg-red-100 text-red-800" },
    }),
    []
  );

  // Get status badge for a request
  const getStatusBadge = useCallback(
    (status: string) => {
      const { label, className } = statusMap[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      };
      return (
        <span
          className={`px-2 py-1 text-xs text-nowrap font-medium rounded-md ${className}`}
        >
          {label}
        </span>
      );
    },
    [statusMap]
  );

  // Helper function to render salon title with avatar
  const renderSalonTitle = useCallback(
    (salon: Salon) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 border">
          <AvatarImage
            src={salon.icon_url}
            alt={salon.merchant_commercial_name}
          />
          <AvatarFallback>
            {salon.merchant_commercial_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{salon.merchant_commercial_name}</span>
      </div>
    ),
    []
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader className="space-y-2 ">
          <CardTitle className="text-lg font-semibold">
            إدارة طلبات القوائم
          </CardTitle>{" "}
          <div className="flex  flex-col items-start justify-between gap-4">
            <p className="text-sm text-gray-500">إدارة طلبات قوائم الصالونات</p>
            <div className="flex items-stretch justify-between gap-4 mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 w-[250px]"
                  dir="rtl"
                />
              </div>
              <div className="flex items-center justify-between">
                <Select
                  value={statusFilter}
                  onValueChange={(value: string) => {
                    setStatusFilter(
                      value as "pending" | "approved" | "rejected" | "all"
                    );
                  }}
                  defaultValue="all"
                  dir="rtl"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                    <SelectItem value="approved">مقبول</SelectItem>
                    <SelectItem value="rejected">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="text-sm items-end flex  text-gray-500">
                {pagination.totalItems} طلبات - الصفحة {pagination.currentPage}{" "}
                من {pagination.totalPages}
              </div> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المزود</TableHead>
                  <TableHead>مسؤول التواصل</TableHead>
                  <TableHead>رقم التواصل</TableHead>
                  <TableHead>التكلفة</TableHead>
                  <TableHead>الملاحظات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الطلب</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {" "}
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell colSpan={8}>
                          <LoadingSkeleton />
                        </TableCell>
                      </TableRow>
                    ))
                ) : menuRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      لا توجد طلبات قوائم
                    </TableCell>
                  </TableRow>
                ) : (
                  menuRequests.map((request) => (
                    <TableRow key={request.id}>
                      {" "}
                      <TableCell>
                        {/* Using memoized render function for better performance */}
                        {renderSalonTitle(request.salon)}
                      </TableCell>
                      <TableCell>{request.salon.contact_name}</TableCell>
                      <TableCell dir="ltr">
                        {request.salon.contact_number}
                      </TableCell>
                      <TableCell>{request.cost} AED</TableCell>
                      <TableCell>
                        <div
                          className="max-w-[200px] truncate"
                          title={request.notes}
                        >
                          {request.notes}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString(
                          "ar-AE"
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/salons/${request.salon_id}`}
                                className="cursor-pointer w-full"
                              >
                                عرض المزود
                              </Link>
                            </DropdownMenuItem>
                            {request.status === "pending" && (
                              <>
                                {" "}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setDialogState((prev) => ({
                                      ...prev,
                                      showApprove: true,
                                    }));
                                  }}
                                  className="text-green-600"
                                >
                                  قبول الطلب
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setDialogState((prev) => ({
                                      ...prev,
                                      showReject: true,
                                    }));
                                  }}
                                  className="text-red-600"
                                >
                                  رفض الطلب
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>{" "}
          {!isLoading &&
            menuRequests.length > 0 &&
            pagination.totalPages > 1 && (
              <div className="mt-4">
                <PaginationWithInfo
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.perPage}
                  onPageChange={(page) =>
                    setPagination((prev) => ({ ...prev, currentPage: page }))
                  }
                />
              </div>
            )}
        </CardContent>
      </Card>{" "}
      {/* Approve Dialog */}
      <Dialog
        open={dialogState.showApprove}
        onOpenChange={(open) =>
          setDialogState((prev) => ({ ...prev, showApprove: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>قبول طلب القائمة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من قبول طلب القائمة لـ{" "}
              {selectedRequest?.salon.merchant_commercial_name}؟
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminNote">ملاحظات الإدارة</Label>
              <Textarea
                id="adminNote"
                placeholder="أدخل ملاحظاتك هنا..."
                value={dialogState.adminNote}
                onChange={(e) =>
                  setDialogState((prev) => ({
                    ...prev,
                    adminNote: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogState((prev) => ({
                  ...prev,
                  showApprove: false,
                  adminNote: "",
                }));
              }}
            >
              إلغاء
            </Button>
            <Button onClick={handleApprove}>قبول</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Reject Dialog */}
      <Dialog
        open={dialogState.showReject}
        onOpenChange={(open) =>
          setDialogState((prev) => ({ ...prev, showReject: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض طلب القائمة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رفض طلب القائمة لـ{" "}
              {selectedRequest?.salon.merchant_commercial_name}؟
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminNoteReject">ملاحظات الإدارة</Label>
              <Textarea
                id="adminNoteReject"
                placeholder="أدخل سبب الرفض هنا..."
                value={dialogState.adminNote}
                onChange={(e) =>
                  setDialogState((prev) => ({
                    ...prev,
                    adminNote: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogState((prev) => ({
                  ...prev,
                  showReject: false,
                  adminNote: "",
                }));
              }}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              رفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
