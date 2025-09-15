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
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  MessageCircle,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { deleteData, fetchData, updateData } from "@/lib/apiHelper";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import ComplaintDetails from "./complaint-details";

const complaints = [
  {
    id: "1",
    customerName: "سارة أحمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "مزود الأميرة",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-03",
    title: "تأخير في الموعد",
    description:
      "كان لدي موعد في الساعة 10 صباحاً ولكن تم تأخيري لمدة ساعة كاملة دون إخطار مسبق.",
    status: "جديد",
    priority: "متوسطة",
    category: "مواعيد",
  },
  {
    id: "2",
    customerName: "نورة محمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "مزود إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-02",
    title: "مشكلة في الدفع",
    description:
      "تم خصم تكلفة أكبر من المتفق عليه عند الدفع، وأريد استرداد الفرق.",
    status: "قيد المعالجة",
    priority: "عالية",
    category: "مدفوعات",
  },
  {
    id: "3",
    customerName: "عبير علي",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "مزود جلام",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-01",
    title: "جودة الخدمة سيئة",
    description:
      "لم أكن راضية عن جودة الخدمة المقدمة، النتيجة النهائية كانت مختلفة تماماً عما طلبت.",
    status: "مغلق",
    priority: "متوسطة",
    category: "جودة الخدمة",
  },
  {
    id: "4",
    customerName: "هند خالد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "مزود مس بيوتي",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-03-30",
    title: "سوء معاملة من الموظفات",
    description:
      "تعرضت لسوء معاملة من إحدى الموظفات في المزود وأريد تقديم شكوى رسمية.",
    status: "جديد",
    priority: "عالية",
    category: "سلوك الموظفين",
  },
  {
    id: "5",
    customerName: "ليلى عبدالله",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "مزود روز",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-03-29",
    title: "مشكلة في التطبيق",
    description:
      "لا يمكنني حجز موعد عبر التطبيق، تظهر رسالة خطأ في كل مرة أحاول فيها.",
    status: "قيد المعالجة",
    priority: "منخفضة",
    category: "تقني",
  },
];

const supportTickets = [
  {
    id: "1",
    salonName: "مزود الأميرة",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-03",
    title: "مشكلة في تسجيل الدخول",
    description: "لا يمكنني تسجيل الدخول إلى حساب المزود، تظهر رسالة خطأ.",
    status: "جديد",
    priority: "عالية",
    category: "تقني",
  },
  {
    id: "2",
    salonName: "مزود إليت",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-02",
    title: "طلب إضافة خدمة جديدة",
    description:
      "أرغب في إضافة خدمة جديدة غير موجودة في قائمة الخدمات الحالية.",
    status: "قيد المعالجة",
    priority: "متوسطة",
    category: "طلب ميزة",
  },
  {
    id: "3",
    salonName: "مزود جلام",
    salonLogo: "/placeholder.svg?height=32&width=32",
    date: "2024-04-01",
    title: "مشكلة في استلام الإشعارات",
    description:
      "لا تصلني إشعارات الحجوزات الجديدة، رغم أنني فعلت الإشعارات في الإعدادات.",
    status: "مغلق",
    priority: "منخفضة",
    category: "تقني",
  },
];

interface ComplaintInfo {
  all_count: number;
  active_count: number;
  pending_count: number;
  closed_count: number;
  average_response_time: number;
}

interface Complaint {
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
}

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintInfo, setComplaintInfo] = useState<ComplaintInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("complaints");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: perPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(priorityFilter !== "all" && { priority: priorityFilter }),
      });

      const response = await fetchData(`admin/complaints?${queryParams}`);
      if (response.success) {
        console.log(response.data);

        setComplaints(response.data);
        setComplaintInfo(response.info);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setTotalItems(response.meta.total);
        setPerPage(response.meta.per_page);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: "Failed to fetch complaints",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, statusFilter, priorityFilter, searchQuery]);

  const handleStatusUpdate = async (complaintId: number) => {
    try {
      const response = await updateData(`admin/complaints/${complaintId}`);
      if (response.success) {
        toast({
          title: "Success",
          description: `Complaint status updated successfully`,
        });
        fetchComplaints();
      }
    } catch (error) {
      console.error("Error updating complaint status:", error);
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (complaintId: number) => {
    try {
      const response = await deleteData(`admin/complaints/${complaintId}`);
      if (response.success) {
        toast({
          title: "Success",
          description: "Complaint deleted successfully",
        });
        fetchComplaints();
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast({
        title: "Error",
        description: "Failed to delete complaint",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "جديد":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            جديد
          </Badge>
        );
      case "قيد المعالجة":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            قيد المعالجة
          </Badge>
        );
      case "مغلق":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-heading">
          إدارة الشكاوى والدعم
        </h1>
      </div>

      {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-red-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الشكاوى
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complaintInfo?.all_count || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">شكوى</p>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-amber-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              شكاوى قيد المعالجة
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complaintInfo?.pending_count || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">شكوى</p>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تذاكر الدعم</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complaintInfo?.active_count || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تذكرة</p>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              معدل الاستجابة
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complaintInfo?.average_response_time || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ساعة</p>
          </CardContent>
        </Card>
      </div> */}

      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardHeader>
          <Tabs defaultValue="complaints" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>الشكاوى وطلبات الدعم</CardTitle>
                <CardDescription>
                  إدارة شكاوى العملاء وطلبات الدعم الفني
                </CardDescription>
              </div>
              {/* <TabsList className="bg-secondary/50">
                <TabsTrigger value="complaints">شكاوى العملاء</TabsTrigger>
                <TabsTrigger value="support">طلبات الدعم</TabsTrigger>
              </TabsList> */}
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث..."
                  className="pr-9 w-full rounded-full bg-secondary/50 border-0 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="جميع الحالات" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="جديد">جديد</SelectItem>
                    <SelectItem value="قيد المعالجة">قيد المعالجة</SelectItem>
                    <SelectItem value="مغلق">مغلق</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <SelectValue placeholder="جميع الأولويات" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="عالية">عالية</SelectItem>
                    <SelectItem value="متوسطة">متوسطة</SelectItem>
                    <SelectItem value="منخفضة">منخفضة</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد شكاوى
                </div>
              ) : (
                complaints.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          {!item.hide_identity ? (
                            <>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                                  <AvatarImage
                                    src={item.user?.avatar || ""}
                                    alt={item.user?.full_name}
                                  />
                                  <AvatarFallback>
                                    {item.user?.full_name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {item.user?.full_name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(
                                        item.created_at
                                      ).toLocaleDateString("ar-EG")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {/*عرض كمجهول  */}
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                                  <AvatarFallback>م</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">مجهول</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(
                                        item.created_at
                                      ).toLocaleDateString("ar-EG")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-2">
                            {/* if reviewed_by null لم تتم المراجعة والا تمت مراجعته */}
                            {item.reviewed_by ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                تمت المراجعة
                              </Badge>
                            ) : (
                              <Badge className="bg-red-50 text-red-700 border-red-200">
                                لم تتم المراجعة
                              </Badge>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setSelectedComplaint(item);
                                    setShowDetails(true);
                                  }}
                                >
                                  عرض التفاصيل
                                </DropdownMenuItem>

                                {/* {item.status === "مغلق" && (
                                  <DropdownMenuItem
                                    className="text-blue-600 cursor-pointer"
                                    onClick={() => handleStatusUpdate(item.id, "قيد المعالجة")}
                                  >
                                    إعادة فتح الشكوى
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="cursor-pointer">إضافة رد</DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => handleDelete(item.id)}
                                >
                                 حذف الشكوى / الدعم
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">{item.title}</h4>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <p className="text-sm">{item.content}</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          {!item.reviewed_by && (
                            <>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className="rounded-full bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                  >
                                    <CheckCircle2 className="h-4 w-4 ml-2" />
                                    تمت المراجعة
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>تأكيد المراجعة</DialogTitle>
                                    <DialogDescription>
                                      هل أنت متأكد من أنك تريد تأكيد مراجعة هذه الشكوى؟
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        const dialogTrigger = document.querySelector('[data-state="open"]');
                                        if (dialogTrigger instanceof HTMLElement) {
                                          dialogTrigger.click();
                                        }
                                      }}
                                    >
                                      إلغاء
                                    </Button>
                                    <Button
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => {
                                        handleStatusUpdate(item.id);
                                        const dialogTrigger = document.querySelector('[data-state="open"]');
                                        if (dialogTrigger instanceof HTMLElement) {
                                          dialogTrigger.click();
                                        }
                                      }}
                                    >
                                      تأكيد
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              {/* <DialogTrigger asChild>
                                  </DialogTrigger> */}
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>تفاصيل الشكوى</DialogTitle>
                </DialogHeader>
                {selectedComplaint && (
                  <ComplaintDetails complaint={selectedComplaint} />
                )}
              </DialogContent>
            </Dialog>
            {!isLoading && complaints.length > 0 && (
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
