"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Check,
  Clock,
  Filter,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import Link from "next/link";
import { fetchData, updateData } from "@/lib/apiHelper";
import { Skeleton } from "../ui/skeleton";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Service {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  duration_minutes: number;

  final_price: number;
  currency: string;
}

interface BookingService {
  id: number;
  booking_id: number;
  service_id: number;
  service: Service;

}

interface User {
  id: number;
  full_name: string;
  avatar: string | null;
  full_phone: string;
}

interface Salon {
  id: number;
  name: string;
  merchant_commercial_name: string;
  icon_url: string;
}

interface BookingInfo {
  all_count: number;
  pending_count: number;
  confirmed_count: number;
  completed_count: number;
  cancelled_count: number;
}

interface Booking {
  id: number;
  code: string;
  date: string;
  time: string;
  end_time: string;
  total_service_time_in_minutes: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "paid" | "unpaid";
  user: User;
  salon: Salon;
  booking_services: BookingService[];
}

export default function AppointmentsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, dateFilter, selectedDate]); // Add dependencies

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: perPage.toString(),
        ...(selectedDate && {
          date_from: new Date(selectedDate.getTime() + 86400000).toISOString().split('T')[0],
          date_to: new Date(selectedDate.getTime() + 86400000).toISOString().split('T')[0]
        }),
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetchData(`admin/bookings?${queryParams}`);
      if (response.success) {
        setBookings(response.data);
        setTotal(response.meta?.total);
        
        // استخراج معلومات الإحصائيات من الاستجابة
        if (response.info) {
          setBookingInfo(response.info);
        }
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      const response = await updateData(`admin/bookings/${bookingId}`, {
        status: newStatus
      });
      console.log(response);

      if (response.success) {
        toast({
          title: "تم",
          description: "تم تحديث حالة الحجز بنجاح",
        });
        fetchBookings();
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الحجز",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      if (page === 1) {
        fetchBookings();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);
  const statusOptions = [
    { value: "all", label: "جميع الحالات" },
    { value: "pending", label: "معلق" },
    { value: "confirmed", label: "مؤكد" },
    { value: "completed", label: "مكتمل" },
    { value: "cancelled", label: "ملغي" },
  ];
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            مؤكد
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            معلق
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            ملغي
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            مكتمل
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة الحجوزات</h1>
        {/* <Button asChild>
          <Link href="/appointments/add">إضافة حجز جديد</Link>
        </Button> */}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingInfo?.all_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">في النظام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات معلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingInfo?.pending_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">بانتظار التأكيد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات مؤكدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingInfo?.confirmed_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">تم تأكيدها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات مكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingInfo?.completed_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">تم إكمالها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات ملغية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingInfo?.cancelled_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">تم إلغاؤها</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الحجوزات</CardTitle>
          <CardDescription>إدارة حجوزات الصالونات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {/* Update status filter */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="بحث عن الحجوزات..."
                    className="pr-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <DatePicker
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setPage(1);
                    }}
                    placeholder="تاريخ الحجز"
                  // mode="single"
                  />
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="جميع الحالات" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العميل</TableHead>
                    <TableHead>الصالون</TableHead>
                    <TableHead>الخدمة</TableHead>
                    <TableHead>التاريخ والوقت</TableHead>
                    {/* <TableHead>حالة الدفع</TableHead> */}
                    <TableHead>الحالة</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: perPage }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 7 }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        لا توجد حجوزات
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={booking.user.avatar || "/placeholder.svg"}
                                alt={booking.user.full_name}
                              />
                              <AvatarFallback>
                                {booking.user.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span>{booking.user.full_name}</span>
                              <span className="text-sm text-muted-foreground">
                                {booking.user.full_phone}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage
                                src={booking.salon.icon_url}
                                alt={booking.salon.merchant_commercial_name}
                              />
                              <AvatarFallback>
                                {booking.salon.merchant_commercial_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{booking.salon.merchant_commercial_name}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            {booking.booking_services.length > 0 && (
                              <>
                                <span className="text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary inline-flex">
                                  {booking.booking_services[0].service.name.ar}
                                </span>
                                {booking.booking_services.length > 1 && (
                                  <Popover>
                                    <PopoverTrigger className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                      +{booking.booking_services.length - 1} more
                                    </PopoverTrigger>
                                    <PopoverContent className="w-60">
                                      <div className="flex flex-col gap-2">
                                        {booking.booking_services.slice(1).map((service) => (
                                          <div key={service.id} className="flex flex-col">
                                            <span className="text-sm font-medium">
                                              {service.service.name.ar}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              {service.service.final_price} {service.service.currency} • {service.service.duration_minutes} minutes
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(booking.date).toLocaleDateString("en-US")}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">
                                {booking.time} - {booking.end_time}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex flex-col">
                            <Badge variant="outline" className={`w-fit ${booking.payment_status === "paid"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                              }`}>
                              {booking.payment_status === "paid" ? "مدفوع" : "غير مدفوع"}
                            </Badge>
                          </div>
                        </TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* {getStatusIcon(booking.status)} */}
                            {getStatusBadge(booking.status)}
                          </div>
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
                                <Link href={`/appointments/${booking.id}`} className="cursor-pointer w-full">
                                  عرض التفاصيل
                                </Link>
                              </DropdownMenuItem>
                              {booking.status === "pending" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(booking.id, "confirmed")}
                                  className="text-green-600"
                                >
                                  تأكيد الحجز
                                </DropdownMenuItem>
                              )}
                              {(booking.status === "pending" || booking.status === "confirmed") && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(booking.id, "cancelled")}
                                  className="text-red-600"
                                >
                                  إلغاء الحجز
                                </DropdownMenuItem>
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
          </div>
          {!isLoading && bookings.length > 0 && total > perPage && (
            <div className="mt-4">
              <PaginationWithInfo
                currentPage={page}
                totalPages={Math.ceil(total / perPage)}
                totalItems={total}
                itemsPerPage={perPage}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
