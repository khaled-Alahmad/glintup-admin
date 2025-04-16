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
import { MoreVertical, MessageSquare, Flag, CheckCheck, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  AlertTriangle,
  Ban,
  Bell,
  Plus,
  X,
  Trash2,
  Search,
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addData, deleteData, fetchData, updateData } from "@/lib/apiHelper";
import { useToast } from "../ui/use-toast";
import { PaginationWithInfo } from "../ui/pagination-with-info";

interface SalonDetailsProps {
  salonId: string;
}
interface Appointment {
  id: number;
  code: string;
  date: string;
  time: string;
  end_time: string;
  status: string;
  total_price: number;
  user: {
    id: number;
    full_name: string;
    avatar: string | null;
  };
  booking_services: any[];
}
const DAYS_IN_ARABIC: Record<string, string> = {
  'sunday': 'الأحد',
  'monday': 'الإثنين',
  'tuesday': 'الثلاثاء',
  'wednesday': 'الأربعاء',
  'thursday': 'الخميس',
  'friday': 'الجمعة',
  'saturday': 'السبت'
};
interface SalonData {
  id: number;
  name: string;
  icon_url: string;
  description: string;
  is_active: boolean;
  is_approved: boolean;
  average_rating: number;
  total_reviews: number;
  bookings_count: number;
  total_revenue: number;
  created_at: Date;
  updated_at: Date;
  owner: {
    full_name: string;
    avatar: string;
    full_phone: string;
  };
  email: string;
  full_phone: string;
  location: string;
  working_hours: Array<{
    day_of_week: string;
    opening_time: string | null;
    closing_time: string | null;
    is_closed: boolean;
    break_start: string | null;
    break_end: string | null;
  }>;
  working_status: string;
  rating_percentage: Array<{
    rating: number;
    percentage: number;
  }>;
}


interface Service {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  icon: string;
  duration_minutes: number;
  price: number;
  icon_url: string;
  gender: 'male' | 'female' | 'both';
  is_active: number;
  salon_id: number;
}
interface SalonService {
  id: string;
  serviceId: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  category: string;
}
interface Collection {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  discount: number;
}
interface Review {
  id: number;
  user_id: number;
  salon_id: number;
  rating: number;
  stars: string;
  comment: string;
  salon_reply: string | null;
  salon_reply_at: string | null;
  salon_report: string | null;
  reason_for_report: string | null;
  salon_reported_at: string | null;
  created_at: Date,
  updated_at: Date,
  user: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string;
  };
}

export default function SalonDetails({ salonId }: SalonDetailsProps) {
  const [showSendNotificationDialog, setShowSendNotificationDialog] =
    useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [salonSearchTerm, setSalonSearchTerm] = useState("");
  const [uploadedIcon, setUploadedIcon] = useState<string>("");
  const [iconPreview, setIconPreview] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(2);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("both");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Add new state for salons
  const [salons, setSalons] = useState<{ id: number; name: string }[]>([]);
  const fetchServices = async () => {
    try {
      // setIsLoading(true);
      const activeFilter = selectedStatus !== 'all' ? `&is_active=${selectedStatus === 'active' ? 1 : 0}` : '';
      const categoryFilter = selectedCategory ? `&gender=${selectedCategory}` : '';

      const response = await fetchData(`admin/services?page=${currentPage}&limit=${perPage}&salon_id=${salonId}`);
      if (response.success) {
        setServices(response.data || []);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setPerPage(response.meta.per_page);
        setTotalItems(response.meta.total);
        setActiveTab("services"); // Ensure we stay on services tab

      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Update the state declaration with the type
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<Record<number, number>>({});

  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(5);
  const [reviewsTotalItems, setReviewsTotalItems] = useState(0);

  const fetchReviews = async () => {
    try {
      const response = await fetchData(`admin/reviews?salon_id=${salonId}&page=${reviewsCurrentPage}&limit=${reviewsPerPage}`);
      if (response.success) {
        setReviews(response.data);
        calculateReviewStats(response.data);
        setReviewsTotalPages(response.meta.last_page);
        setReviewsCurrentPage(response.meta.current_page);
        setReviewsPerPage(response.meta.per_page);
        setReviewsTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsCurrentPage, setAppointmentsCurrentPage] = useState(1);
  const [appointmentsTotalPages, setAppointmentsTotalPages] = useState(1);
  const [appointmentsPerPage, setAppointmentsPerPage] = useState(10);
  const [appointmentsTotalItems, setAppointmentsTotalItems] = useState(0);
  const [appointmentsStats, setAppointmentsStats] = useState({
    all_count: 0,
    pending_count: 0,
    confirmed_count: 0,
    completed_count: 0,
    cancelled_count: 0,
  });
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  // Add this function to fetch appointments
  const fetchAppointments = async () => {
    try {
      setIsLoadingAppointments(true);
      const response = await fetchData(`admin/bookings?salon_id=${salonId}&page=${appointmentsCurrentPage}&limit=${appointmentsPerPage}`);
      if (response.success) {
        setAppointments(response.data);
        setAppointmentsTotalPages(response.meta.last_page);
        setAppointmentsCurrentPage(response.meta.current_page);
        setAppointmentsPerPage(response.meta.per_page);
        setAppointmentsTotalItems(response.meta.total);
        setAppointmentsStats(response.info);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  // Add this useEffect
  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab, appointmentsCurrentPage]);

  // Add useEffect to refetch when page changes
  useEffect(() => {
    fetchReviews();
  }, [salonId, reviewsCurrentPage]);

  const calculateReviewStats = (reviewsData: Review[]) => {
    const total = reviewsData.length;
    const stats = reviewsData.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Convert to percentages
    const percentages: Record<number, number> = {};
    Object.keys(stats).forEach(rating => {
      percentages[Number(rating)] = Math.round((stats[Number(rating)] / total) * 100);
    });

    setReviewStats(percentages);
  };
  const handleReplyReview = async (review: Review) => {
    const reply = await prompt('أدخل ردك على التقييم:');
    if (!reply) return;

    try {
      const response = await addData(`admin/reviews/${review.id}/reply`, { reply });
      if (response.success) {
        toast({
          title: "تم بنجاح",
          description: "تم إضافة الرد بنجاح",
        });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error replying to review:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الرد",
        variant: "destructive",
      });
    }
  };

  const handleReportReview = async (review: Review) => {
    const reason = await prompt('أدخل سبب الإبلاغ عن التقييم:');
    if (!reason) return;

    try {
      const response = await addData(`admin/reviews/${review.id}/report`, { reason });
      if (response.success) {
        toast({
          title: "تم بنجاح",
          description: "تم الإبلاغ عن التقييم بنجاح",
        });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error reporting review:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الإبلاغ عن التقييم",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: Review) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;

    try {
      const response = await deleteData(`admin/reviews/${reviewId}`);
      if (response.success) {
        toast({
          title: "تم بنجاح",
          description: "تم حذف التقييم بنجاح",
        });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف التقييم",
        variant: "destructive",
      });
    }
  };

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newService = {
      salon_id: salonId, // Get selected salon_id
      name: {
        en: formData.get("name_en") as string,
        ar: formData.get("name_ar") as string,
      },
      description: {
        en: formData.get("description_en") as string,
        ar: formData.get("description_ar") as string,
      },
      icon: uploadedIcon,
      duration_minutes: Number(formData.get("duration_minutes")),
      price: Number(formData.get("price")),
      gender: formData.get("gender") as 'male' | 'female' | 'both',
      is_active: 1,
      currency: "AED"
    };

    try {
      const response = await addData("admin/services", newService);
      if (response.success) {
        await fetchServices();
        setIsAddDialogOpen(false);
        // e.currentTarget.reset();
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تمت إضافة الخدمة بنجاح",
          variant: "default",
        });
        setUploadedIcon('');
        setIconPreview('');
      }
    } catch (error) {
      console.error("Failed to add service:", error);
    }
  };

  const handleIconUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'services');
    try {
      const response = await addData('general/upload-image', formData);
      // const data = await response.json();
      if (response.success) {
        console.log(response);
        setUploadedIcon(response.data.image_name);
        setIconPreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };
  // تعديل خدمة
  const handleEditService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService) return;

    const formData = new FormData(e.currentTarget);
    const updatedService = {
      salon_id: salonId, // Get selected salon_id
      name: {
        en: formData.get("name_en") as string,
        ar: formData.get("name_ar") as string,
      },
      description: {
        en: formData.get("description_en") as string,
        ar: formData.get("description_ar") as string,
      },
      icon: uploadedIcon || editingService.icon,
      duration_minutes: Number(formData.get("duration_minutes")),
      price: Number(formData.get("price")),
      gender: formData.get("gender") as 'male' | 'female' | 'both',
      is_active: Number(formData.get("is_active")),
    };
    console.log("updatedService", updatedService);

    try {
      const response = await updateData(`admin/services/${editingService.id}`, updatedService);
      if (response.success) {
        await fetchServices();
        setIsEditDialogOpen(false);
        setEditingService(null);
        toast({
          title: "تم التعديل بنجاح",
          description: "تم تعديل الخدمة بنجاح",
          variant: "default",
        });
        setUploadedIcon('');
        setIconPreview('');
      }
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };
  const handleDeleteService = async () => {
    if (!editingService) return;

    try {
      const response = await deleteData(`admin/services/${editingService.id}`);
      if (response.success) {
        await fetchServices();
        setIsDeleteDialogOpen(false);
        setEditingService(null);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الخدمة بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء محاولة حذف الخدمة",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    // if (activeTab == "services") {

    fetchServices();
    // }
  }, [salonId]);
  // إضافة خدمة إلى الصالون
  // interface Service {
  //   id: string;
  //   name: string;
  //   duration: number;
  //   price: number;
  //   description: string;
  //   category: string;
  // }
  const [salonData, setSalonData] = useState<SalonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData(`admin/salons/${salonId}`);
        if (response.success) {
          setSalonData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch salon data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalonData();
  }, [salonId]);
  // console.log("salonData", salonData);

  // const [availableServices, setAvailableServices] = useState<Service[]>([
  //   {
  //     id: "1",
  //     name: "قص الشعر",
  //     duration: 60,
  //     price: 150,
  //     description: "قص الشعر بأحدث التقنيات والموضات",
  //     category: "hair",
  //   },
  //   {
  //     id: "2",
  //     name: "صبغة شعر",
  //     duration: 120,
  //     price: 300,
  //     description: "صبغة شعر بألوان عالمية وتقنيات حديثة",
  //     category: "hair",
  //   },
  //   {
  //     id: "3",
  //     name: "تسريحة شعر",
  //     duration: 90,
  //     price: 200,
  //     description: "تسريحات متنوعة للمناسبات والحفلات",
  //     category: "hair",
  //   },
  //   {
  //     id: "4",
  //     name: "مكياج",
  //     duration: 60,
  //     price: 250,
  //     description: "مكياج احترافي للمناسبات والسهرات",
  //     category: "makeup",
  //   },
  //   {
  //     id: "5",
  //     name: "مانيكير",
  //     duration: 45,
  //     price: 100,
  //     description: "عناية كاملة بالأظافر",
  //     category: "nails",
  //   },
  //   {
  //     id: "6",
  //     name: "باديكير",
  //     duration: 45,
  //     price: 120,
  //     description: "عناية كاملة بأظافر القدم",
  //     category: "nails",
  //   },
  //   {
  //     id: "7",
  //     name: "تنظيف بشرة",
  //     duration: 60,
  //     price: 200,
  //     description: "تنظيف عميق للبشرة",
  //     category: "skin",
  //   },
  //   {
  //     id: "8",
  //     name: "ماسك للوجه",
  //     duration: 30,
  //     price: 100,
  //     description: "ماسكات طبيعية للوجه",
  //     category: "skin",
  //   },
  // ]);

  // قائمة المجموعات المتاحة
  // const [availableCollections, setAvailableCollections] = useState<
  //   Collection[]
  // >([
  //   {
  //     id: "1",
  //     name: "باقة العروس",
  //     description: "باقة متكاملة لتجهيز العروس",
  //     services: ["1", "3", "4"],
  //     price: 550,
  //     discount: 50,
  //   },
  //   {
  //     id: "2",
  //     name: "باقة العناية الكاملة",
  //     description: "باقة للعناية الكاملة بالجسم",
  //     services: ["5", "6", "7", "8"],
  //     price: 450,
  //     discount: 70,
  //   },
  // ]);



  // In a real app, you would fetch salon data based on salonId
  const salon = {
    id: salonId,
    name: "صالون الأميرة",
    logo: "/placeholder.svg?height=128&width=128",
    cover: "/placeholder.svg?height=400&width=800",
    description:
      "صالون الأميرة هو صالون متخصص في خدمات التجميل والعناية بالشعر والبشرة للسيدات. نقدم خدمات عالية الجودة بأيدي خبيرات متخصصات في مجال التجميل.",
    category: "نسائي",
    status: "نشط",
    featured: true,
    verified: true,
    owner: "منيرة السعيد",
    email: "princess@salon.com",
    phone: "+966 50 123 4567",
    address: "منطقة السالمية، شارع الخليج العربي، مدينة الكويت",
    city: "مدينة الكويت",
    district: "السالمية",
    postalCode: "20001",
    location: "مدينة الكويت، الكويت",

    workingHours: {
      الأحد: { from: "09:00", to: "21:00" },
      الاثنين: { from: "09:00", to: "21:00" },
      الثلاثاء: { from: "09:00", to: "21:00" },
      الأربعاء: { from: "09:00", to: "21:00" },
      الخميس: { from: "09:00", to: "21:00" },
      الجمعة: { from: "16:00", to: "22:00" },
      السبت: { from: "09:00", to: "21:00" },
    },
    socialMedia: {
      instagram: "princess_salon",
      twitter: "princess_salon",
      snapchat: "princess_salon",
      tiktok: "princess_salon",
    },
    rating: 4.8,
    totalReviews: 245,
    totalBookings: 1245,
    revenue: "52,450 د.إ",
    joinDate: "12 يناير 2023",
  };

  // const services = [
  //   {
  //     id: "1",
  //     name: "قص شعر",
  //     duration: "60 دقيقة",
  //     price: "150 د.إ",
  //     bookings: 320,
  //   },
  //   {
  //     id: "2",
  //     name: "صبغة شعر",
  //     duration: "120 دقيقة",
  //     price: "300 د.إ",
  //     bookings: 180,
  //   },
  //   {
  //     id: "3",
  //     name: "تسريحة شعر",
  //     duration: "90 دقيقة",
  //     price: "200 د.إ",
  //     bookings: 210,
  //   },
  //   {
  //     id: "4",
  //     name: "مكياج",
  //     duration: "60 دقيقة",
  //     price: "250 د.إ",
  //     bookings: 150,
  //   },
  //   {
  //     id: "5",
  //     name: "مانيكير وباديكير",
  //     duration: "90 دقيقة",
  //     price: "180 د.إ",
  //     bookings: 95,
  //   },
  // ];

  // const reviews = [
  //   {
  //     id: "1",
  //     customerName: "سارة أحمد",
  //     customerAvatar: "/placeholder.svg?height=40&width=40",
  //     rating: 5,
  //     comment: "خدمة ممتازة وموظفات محترفات",
  //     date: "2024-04-01",
  //   },
  //   {
  //     id: "2",
  //     customerName: "نورة محمد",
  //     customerAvatar: "/placeholder.svg?height=40&width=40",
  //     rating: 4,
  //     comment: "تجربة جيدة ولكن كان هناك تأخير بسيط",
  //     date: "2024-03-25",
  //   },
  //   {
  //     id: "3",
  //     customerName: "عبير علي",
  //     customerAvatar: "/placeholder.svg?height=40&width=40",
  //     rating: 5,
  //     comment: "من أفضل الصالونات التي زرتها",
  //     date: "2024-03-20",
  //   },
  // ];
  const getAppointmentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            قيد الانتظار
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            مؤكد
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            مكتمل
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            ملغي
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  // const appointments = [
  //   {
  //     id: "1",
  //     customerName: "سارة أحمد",
  //     customerAvatar: "/placeholder.svg?height=40&width=40",
  //     service: "قص شعر",
  //     date: "2024-04-03",
  //     time: "10:30 صباحاً",
  //     status: "مؤكد",
  //   },
  //   {
  //     id: "2",
  //     customerName: "نورة محمد",
  //     customerAvatar: "/placeholder.svg?height=40&width=40",
  //     service: "صبغة شعر",
  //     date: "2024-04-03",
  //     time: "2:15 مساءً",
  //     status: "معلق",
  //   },
  //   {
  //     id: "3",
  //     customerName: "عبير علي",
  //     customerAvatar: "/placeholder.svg?height=40&width=40",
  //     service: "تسريحة شعر",
  //     date: "2024-04-04",
  //     time: "4:45 مساءً",
  //     status: "مؤكد",
  //   },
  // ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            نشط
          </Badge>
        );
      case "معلق":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            معلق
          </Badge>
        );
      case "محظور":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            محظور
          </Badge>
        );
      case "مؤكد":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            مؤكد
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300 fill-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };
  // const handleServiceSelection = (serviceId: string) => {
  //   setSelectedServiceId(serviceId);
  //   const service = availableServices.find((s) => s.id === serviceId);
  //   if (service) {
  //     setCustomPrice(service.price);
  //     setCustomDuration(service.duration);
  //   }
  // };
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3 w-full">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 w-full">
                  <div className="h-6 w-2/3 mx-auto bg-muted animate-pulse rounded" />
                  <div className="flex justify-center gap-2">
                    <div className="h-5 w-16 bg-muted/50 animate-pulse rounded-full" />
                    <div className="h-5 w-16 bg-muted/50 animate-pulse rounded-full" />
                  </div>
                </div>
                <div className="w-full space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-muted animate-pulse" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-32 bg-muted/50 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48 w-full bg-muted animate-pulse rounded-lg" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-full bg-muted/50 animate-pulse rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!salonData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-medium">لا توجد بيانات</h3>
          <p className="text-sm text-muted-foreground">لم يتم العثور على بيانات الصالون</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/salons">العودة للصالونات</Link>
        </Button>
      </div>
    );
  }
  // console.log(salonData);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/salons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          تفاصيل الصالون
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3 w-full">
        <Card className="md:col-span-1 w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage className="object-contain" src={salonData.icon_url} alt={salonData.name} />
                <AvatarFallback>{salonData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{salonData.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={
                  salonData.is_active
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }>
                  {salonData.is_active ? "نشط" : "غير نشط"}
                </Badge>
                {salonData.is_approved && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    موثق
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{salonData.average_rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({salonData.total_reviews} تقييم)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                عضو منذ {new Date(salonData.created_at).toLocaleDateString('ar-EG', {})}
              </p>
              <div className="flex gap-2 mt-4 w-full">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/salons/${salonId}/edit`}>
                    <Edit className="h-4 w-4 ml-2" />
                    تعديل
                  </Link>
                </Button>
                <Dialog
                  open={showSendNotificationDialog}
                  onOpenChange={setShowSendNotificationDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Bell className="h-4 w-4 ml-2" />
                      إشعار
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);

                      try {
                        const response = await addData(`admin/salons/${salonId}/send-notification`, {
                          title: formData.get('title'),
                          message: formData.get('message')
                        });

                        if (response.success) {
                          toast({
                            title: "تم بنجاح",
                            description: "تم إرسال الإشعار بنجاح",
                          });
                          setShowSendNotificationDialog(false);
                        }
                      } catch (error) {
                        console.error('Failed to send notification:', error);
                        toast({
                          title: "خطأ",
                          description: "حدث خطأ أثناء إرسال الإشعار",
                          variant: "destructive",
                        });
                      }
                    }}>
                      <DialogHeader>
                        <DialogTitle>إرسال إشعار للصالون</DialogTitle>
                        <DialogDescription>
                          سيتم إرسال هذا الإشعار إلى صالون {salonData.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">عنوان الإشعار</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="أدخل عنوان الإشعار"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">نص الإشعار</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="أدخل نص الإشعار"
                            rows={4}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSendNotificationDialog(false)}
                        >
                          إلغاء
                        </Button>
                        <Button type="submit">
                          إرسال الإشعار
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              {/* <div className="flex gap-2 mt-2 w-full">
                <Dialog
                  open={showSuspendDialog}
                  onOpenChange={setShowSuspendDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50"
                    >
                      <AlertTriangle className="h-4 w-4 ml-2" />
                      تعليق
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>تعليق الصالون</DialogTitle>
                      <DialogDescription>
                        هل أنت متأكد من رغبتك في تعليق صالون {salon.name}؟
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="suspend-reason">سبب التعليق</Label>
                        <Textarea
                          id="suspend-reason"
                          placeholder="أدخل سبب تعليق الصالون"
                          rows={4}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="suspend-duration">مدة التعليق</Label>
                        <Select>
                          <SelectTrigger id="suspend-duration">
                            <SelectValue placeholder="اختر مدة التعليق" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">يوم واحد</SelectItem>
                            <SelectItem value="3">3 أيام</SelectItem>
                            <SelectItem value="7">أسبوع</SelectItem>
                            <SelectItem value="30">شهر</SelectItem>
                            <SelectItem value="indefinite">غير محدد</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowSuspendDialog(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setShowSuspendDialog(false)}
                      >
                        تعليق الصالون
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Ban className="h-4 w-4 ml-2" />
                      حظر
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>حظر الصالون</DialogTitle>
                      <DialogDescription>
                        هل أنت متأكد من رغبتك في حظر صالون {salon.name} بشكل
                        دائم؟
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ban-reason">سبب الحظر</Label>
                        <Textarea
                          id="ban-reason"
                          placeholder="أدخل سبب حظر الصالون"
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowBanDialog(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setShowBanDialog(false)}
                      >
                        حظر الصالون
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div> */}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">المالك</p>
                  <p className="text-sm text-muted-foreground">{salonData.owner?.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">رقم الهاتف</p>
                  <p className="text-sm text-muted-foreground">{salonData.owner?.full_phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">العنوان</p>
                  <p className="text-sm text-muted-foreground">
                    {salonData.location}
                  </p>
                </div>
              </div>
              {/* <div className="flex items-start gap-3"> */}
              {/* <Clock className="h-5 w-5 text-muted-foreground mt-0.5" /> */}
              {/* <div>
                  <p className="text-sm font-medium">ساعات العمل</p> */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">ساعات العمل</p>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    {salonData.working_hours.map((hours, idx) => (
                      <p key={idx}>
                        {DAYS_IN_ARABIC[hours.day_of_week.toLowerCase()]}: {" "}
                        {hours.is_closed ? (
                          <span className="text-red-500">مغلق</span>
                        ) : (
                          <>
                            {hours.opening_time} - {hours.closing_time}
                            {hours.break_start && hours.break_end && (
                              <span className="text-amber-600">
                                {" "}(استراحة: {hours.break_start} - {hours.break_end})
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              {/* </div> */}
              {/* </div> */}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">إحصائيات</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>إجمالي الحجوزات</span>
                    <span className="font-medium">{salonData.bookings_count}</span>
                  </div>
                  <Progress value={salonData.bookings_count} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>إجمالي الإيرادات</span>
                    <span className="font-medium">{salonData.total_revenue}</span>
                  </div>
                  <Progress value={salonData.total_revenue} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>متوسط التقييم</span>
                    <span className="font-medium">{salonData.average_rating}/5</span>
                  </div>
                  <Progress value={salonData.average_rating * 20} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab} >
            <CardHeader className="w-full overflow-x-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="services">الخدمات</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                <TabsTrigger value="appointments">الحجوزات</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="space-y-6">
                <div className="rounded-lg overflow-hidden h-48 md:h-64">
                  <img
                    src={salonData.icon_url || "/placeholder.svg"}
                    alt={salonData.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">عن الصالون</h3>
                  <p className="text-muted-foreground">{salonData.description}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">الخدمات الأكثر حجزاً</h3>
                  <div className="space-y-3">
                    {services.slice(0, 3).map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{service.name.ar}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.duration_minutes}  دقيقة
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium"> {service.price + " د.إ"}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.duration_minutes} حجز
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">أحدث التقييمات</h3>
                  <div className="space-y-4">
                    {reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={review.user.avatar}
                                alt={review.user.full_name}
                              />
                              <AvatarFallback>
                                {review.user.first_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {review.user.full_name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString(
                                    "en-US"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="services" className="space-y-6">
                <Button

                  className="text-left"
                  onClick={() => setIsAddDialogOpen(true)
                  }
                >
                  <Plus className="h-4 w-4 ml-2" />
                  {"إضافة خدمة"}
                </Button>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">جاري تحميل الخدمات...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">لا توجد خدمات متاحة</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة خدمة جديدة
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onEdit={() => {
                          console.log(service);

                          setEditingService(service);
                          setIsEditDialogOpen(true);
                        }}
                        onDelete={() => {
                          setEditingService(service);
                          setIsDeleteDialogOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}
                {!isLoading && services.length > 0 && totalPages > 1 && (
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
              </TabsContent>
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">تقييمات العملاء</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-lg ml-1">
                        {salonData.average_rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({salonData.total_reviews} تقييم)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 text-center">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex flex-col items-center">
                      <div className="flex items-center">
                        <span className="font-medium">{rating}</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />
                      </div>
                      <Progress
                        value={reviewStats[rating] || 0}
                        className="h-2 w-full mt-2"
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        {reviewStats[rating] || 0}%
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.user.avatar}
                              alt={review.user.full_name}
                            />
                            <AvatarFallback>
                              {review.user.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.user.full_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-yellow-500">{review.stars}</div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString("en-US")}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReplyReview(review)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <span>الرد على التقييم</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReportReview(review)}>
                              <Flag className="mr-2 h-4 w-4" />
                              <span>الإبلاغ عن التقييم</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteReview(review)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>حذف التقييم</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                      </div>
                      <p className="mt-3">{review.comment}</p>
                      {review.salon_reply && (
                        <div className="mt-3 bg-muted/50 p-3 rounded-md">
                          <p className="text-sm font-medium">رد الصالون:</p>
                          <p className="text-sm mt-1">{review.salon_reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Add pagination component */}
                  {reviewsTotalPages > 1 && (
                    <div className="mt-4">
                      <PaginationWithInfo
                        currentPage={reviewsCurrentPage}
                        totalPages={reviewsTotalPages}
                        totalItems={reviewsTotalItems}
                        itemsPerPage={reviewsPerPage}
                        onPageChange={setReviewsCurrentPage}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">الحجوزات</h3>
                    <Button size="sm" asChild>
                      <Link href={`/appointments?salon=${salonId}`}>
                        عرض جميع الحجوزات
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="stats-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{appointmentsStats.all_count}</div>
                        <p className="text-xs text-muted-foreground">حجز</p>
                      </CardContent>
                    </Card>

                    <Card className="stats-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{appointmentsStats.pending_count}</div>
                        <p className="text-xs text-muted-foreground">حجز</p>
                      </CardContent>
                    </Card>

                    <Card className="stats-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">مؤكد</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{appointmentsStats.confirmed_count}</div>
                        <p className="text-xs text-muted-foreground">حجز</p>
                      </CardContent>
                    </Card>

                    <Card className="stats-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">مكتمل</CardTitle>
                        <CheckCheck className="h-4 w-4 text-blue-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{appointmentsStats.completed_count}</div>
                        <p className="text-xs text-muted-foreground">حجز</p>
                      </CardContent>
                    </Card>

                    <Card className="stats-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">ملغي</CardTitle>
                        <X className="h-4 w-4 text-red-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{appointmentsStats.cancelled_count}</div>
                        <p className="text-xs text-muted-foreground">حجز</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {isLoadingAppointments ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">جاري تحميل الحجوزات...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">لا توجد حجوزات</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>رقم الحجز</TableHead>
                            <TableHead>العميل</TableHead>
                            <TableHead>التاريخ والوقت</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>السعر</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                              <TableCell>{appointment.code}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={appointment.user.avatar || ""} alt={appointment.user.full_name} />
                                    <AvatarFallback>{appointment.user.full_name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{appointment.user.full_name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <Calendar className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm">{new Date(appointment.date).toLocaleDateString("ar-SA")}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm">{appointment.time} - {appointment.end_time}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getAppointmentStatusBadge(appointment.status)}</TableCell>
                              <TableCell>{appointment.total_price} د.إ</TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/appointments/${appointment.id}`}>
                                      عرض التفاصيل
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {appointmentsTotalPages > 1 && (
                      <div className="mt-4">
                        <PaginationWithInfo
                          currentPage={appointmentsCurrentPage}
                          totalPages={appointmentsTotalPages}
                          totalItems={appointmentsTotalItems}
                          itemsPerPage={appointmentsPerPage}
                          onPageChange={setAppointmentsCurrentPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      {/* مربع حوار إضافة خدمة جديدة */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة خدمة جديدة</DialogTitle>
            <DialogDescription>أدخل تفاصيل الخدمة الجديدة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddService}>
            <div className="grid gap-4 py-4">
              {/* <div className="space-y-2">
                <Label htmlFor="salon_id">الصالون</Label>
                <Select name="salon_id" defaultValue="5">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الصالون" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="flex items-center px-3 pb-2">
                      <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        className="h-8"
                        placeholder="ابحث عن صالون..."
                        value={salonSearchTerm}
                        onChange={(e) => {
                          setSalonSearchTerm(e.target.value);
                          fetchSalons(e.target.value);
                        }}
                      />
                    </div>
                    <SelectGroup>
                      {salons.map((salon) => (
                        <SelectItem key={salon.id} value={salon.id.toString()}>
                          {salon.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div> */}


              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="name_ar">اسم الخدمة (عربي)</Label>
                  <Input id="name_ar" name="name_ar" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">Service Name (English)</Label>
                  <Input id="name_en" name="name_en" required />
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description_ar">وصف الخدمة (عربي)</Label>
                  <Textarea id="description_ar" name="description_ar" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea id="description_en" name="description_en" required />
                </div>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="icon">أيقونة الخدمة</Label>
                <Input id="icon" name="icon" required />
              </div> */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">المدة (بالدقائق)</Label>
                  <Input
                    id="duration_minutes"
                    name="duration_minutes"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (د.إ)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">الفئة المستهدفة</Label>
                <Select name="gender" defaultValue="both">
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="اختر الفئة المستهدفة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">رجال</SelectItem>
                    <SelectItem value="female">نساء</SelectItem>
                    <SelectItem value="both">الجميع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">أيقونة الخدمة</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="icon"
                    name="icon"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleIconUpload(file);
                    }}
                    className="flex-1"
                  />
                  {iconPreview && (
                    <div className="relative w-12 h-12">
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                <Input
                  type="hidden"
                  name="icon"
                  value={uploadedIcon}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">إضافة الخدمة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* مربع حوار تعديل خدمة */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل الخدمة</DialogTitle>
            <DialogDescription>تعديل تفاصيل الخدمة</DialogDescription>
          </DialogHeader>
          {editingService && (
            <form onSubmit={handleEditService}>
              <div className="grid gap-4 py-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="salon_id">الصالون</Label>
                  <Select name="salon_id" defaultValue={editingService.salon_id.toString()}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الصالون" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="flex items-center px-3 pb-2">
                        <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          className="h-8"
                          placeholder="ابحث عن صالون..."
                          value={salonSearchTerm}
                          onChange={(e) => {
                            setSalonSearchTerm(e.target.value);
                            fetchSalons(e.target.value);
                          }}
                        />
                      </div>
                      <SelectGroup>
                        {salons.map((salon) => (
                          <SelectItem key={salon.id} value={salon.id.toString()}>
                            {salon.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div> */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_ar">اسم الخدمة (عربي)</Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      defaultValue={editingService.name.ar}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en">Service Name (English)</Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      defaultValue={editingService.name.en}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description_ar">وصف الخدمة (عربي)</Label>
                    <Textarea
                      id="description_ar"
                      name="description_ar"
                      defaultValue={editingService.description.ar}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_en">Description (English)</Label>
                    <Textarea
                      id="description_en"
                      name="description_en"
                      defaultValue={editingService.description.en}
                      required
                    />
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="icon">أيقونة الخدمة</Label>
                  <Input
                    id="icon"
                    name="icon"
                    defaultValue={editingService.icon}
                    required
                  />
                </div> */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration_minutes">المدة (بالدقائق)</Label>
                    <Input
                      id="duration_minutes"
                      name="duration_minutes"
                      type="number"
                      min="1"
                      defaultValue={editingService.duration_minutes}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (د.إ)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={editingService.price}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">الفئة المستهدفة</Label>
                    <Select name="gender" defaultValue={editingService.gender}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="اختر الفئة المستهدفة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">رجال</SelectItem>
                        <SelectItem value="female">نساء</SelectItem>
                        <SelectItem value="both">الجميع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="is_active">حالة الخدمة</Label>
                    <Select name="is_active" defaultValue={editingService.is_active ? "1" : "0"}>
                      <SelectTrigger id="is_active" >
                        <SelectValue placeholder="اختر حالة الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">نشط</SelectItem>
                        <SelectItem value="0">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">أيقونة الخدمة</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="icon"
                      name="icon_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleIconUpload(file);
                      }}
                      className="flex-1"
                    />
                    {(iconPreview || editingService.icon_url) && (
                      <div className="relative w-12 h-12">
                        <img
                          src={iconPreview || editingService.icon_url}
                          alt="Icon preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <Input
                    type="hidden"
                    name="icon"
                    value={uploadedIcon || editingService.icon}
                  />
                </div>

              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* مربع حوار حذف خدمة */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف الخدمة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذه الخدمة؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {editingService && (
              <p className="text-center">
                أنت على وشك حذف خدمة &quot;{editingService.name.ar}&quot;. هذا
                الإجراء لا يمكن التراجع عنه.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  showSalonId?: boolean;

}


function ServiceCard({ service, onEdit, onDelete, showSalonId = false }: ServiceCardProps) {
  const renderIcon = () => {
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden">
        {service.icon_url ? (
          <img
            src={service.icon_url}
            alt={service.name.ar}
            className="w-full h-full object-cover"
          />
        ) : (
          service.icon
        )}
      </div>
    );
  };

  // تحويل قيمة الجنس إلى نص عربي
  const getGenderText = (gender: "male" | "female" | "both") => {
    switch (gender) {
      case "male":
        return "رجال"
      case "female":
        return "نساء"
      case "both":
        return "الجميع"
      default:
        return ""
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {renderIcon()}
            <div>
              <CardTitle className="text-lg">{service.name.ar}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">{service.name.en}</CardDescription>
            </div>
          </div>
          <Badge variant={service.is_active ? "default" : "secondary"}>{service.is_active ? "نشط" : "غير نشط"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">الوصف:</p>
            <p className="text-sm text-muted-foreground">{service.description.ar}</p>
            <p className="text-xs text-muted-foreground mt-1 opacity-70">{service.description.en}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-xs font-medium">المدة:</p>
              <Badge variant="outline">{service.duration_minutes} دقيقة</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">السعر:</p>
              <span className="font-medium text-sm">{service.price} د.إ</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">الفئة:</p>
              <Badge variant="outline">{getGenderText(service.gender)}</Badge>
            </div>
            {showSalonId && (
              <div className="space-y-1">
                <p className="text-xs font-medium">معرف الصالون:</p>
                <Badge variant="secondary">{service.salon_id}</Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 ml-1" />
          تعديل
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 ml-1" />
          حذف
        </Button>
      </CardFooter>
    </Card>
  )
}