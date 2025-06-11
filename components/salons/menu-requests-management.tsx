"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { fetchData, updateData } from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface MenuRequest {
    id: number;
    salon_id: number;
    notes: string;
    cost: string;
    status: "pending" | "approved" | "rejected";
    approved_at: string | null;
    rejected_at: string | null;
    admin_note: string | null;
    created_at: string;
    updated_at: string;
    salon: {
        id: number;
        merchant_commercial_name: string;
        icon_url: string;
        contact_name: string;
        contact_number: string;
    };
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

export default function MenuRequestsTab() {
    const [menuRequests, setMenuRequests] = useState<MenuRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage, setPerPage] = useState(20);
    const [selectedRequest, setSelectedRequest] = useState<MenuRequest | null>(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [adminNote, setAdminNote] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchMenuRequests();
    }, [currentPage]);

    const fetchMenuRequests = async () => {
        try {
            const response = await fetchData(
                `admin/salon-menu-requests?page=${currentPage}&per_page=${perPage}}`
            );
            setMenuRequests(response.data);
            setTotalPages(response.meta.last_page);
            setTotalItems(response.meta.total);
            setPerPage(response.meta.per_page);
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
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;

        try {
            await updateData(`admin/salon-menu-requests/${selectedRequest.id}`, {
                admin_note: adminNote,
                status: "approved",
            });

            toast({
                title: "تم",
                description: "تم قبول طلب القائمة بنجاح",
            });

            fetchMenuRequests();
            setShowApproveDialog(false);
            setAdminNote("");
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

    const handleReject = async () => {
        if (!selectedRequest) return;

        try {
            await updateData(`admin/salon-menu-requests/${selectedRequest.id}`, {
                admin_note: adminNote,
                status: "rejected",
            });

            toast({
                title: "تم",
                description: "تم رفض طلب القائمة بنجاح",
            });

            fetchMenuRequests();
            setShowRejectDialog(false);
            setAdminNote("");
            setSelectedRequest(null);
        } catch (error) {
            console.error("Error rejecting menu request:", error);
            toast({
                title: "خطأ",
                description: "حدث خطأ أثناء رفض طلب القائمة",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: { label: string; variant: "default" | "success" | "destructive" | "outline" } } = {
            pending: { label: "قيد المراجعة", variant: "outline" },
            approved: { label: "مقبول", variant: "success" },
            rejected: { label: "مرفوض", variant: "destructive" },
        };

        const { label, variant } = statusMap[status] || { label: status, variant: "default" };
        return <Badge variant={variant}>{label}</Badge>;
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>طلبات القوائم</CardTitle>
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-full" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : menuRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            لا توجد طلبات قوائم
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    menuRequests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8 border">
                                                        <AvatarImage src={request.salon.icon_url} alt={request.salon.merchant_commercial_name} />
                                                        <AvatarFallback>{request.salon.merchant_commercial_name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{request.salon.merchant_commercial_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{request.salon.contact_name}</TableCell>
                                            <TableCell dir="ltr">{request.salon.contact_number}</TableCell>
                                            <TableCell>{request.cost} د.إ</TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px] truncate" title={request.notes}>
                                                    {request.notes}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                                            <TableCell>
                                                {new Date(request.created_at).toLocaleDateString("ar-AE")}
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
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedRequest(request);
                                                                        setShowApproveDialog(true);
                                                                    }}
                                                                    className="text-green-600"
                                                                >
                                                                    قبول الطلب
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedRequest(request);
                                                                        setShowRejectDialog(true);
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
                    </div>
                    {!isLoading && menuRequests.length > 0 && totalPages > 1 && (
                        <div className="mt-4">
                            <PaginationWithInfo
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={perPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Approve Dialog */}
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>قبول طلب القائمة</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من قبول طلب القائمة لـ {selectedRequest?.salon.merchant_commercial_name}؟
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="adminNote">ملاحظات الإدارة</Label>
                            <Textarea
                                id="adminNote"
                                placeholder="أدخل ملاحظاتك هنا..."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowApproveDialog(false);
                                setAdminNote("");
                            }}
                        >
                            إلغاء
                        </Button>
                        <Button onClick={handleApprove}>قبول</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>رفض طلب القائمة</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رفض طلب القائمة لـ {selectedRequest?.salon.merchant_commercial_name}؟
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="adminNote">ملاحظات الإدارة</Label>
                            <Textarea
                                id="adminNote"
                                placeholder="أدخل سبب الرفض هنا..."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRejectDialog(false);
                                setAdminNote("");
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
        </div >
    );
}
