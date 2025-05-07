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
import { MoreVertical, MessageSquare, Flag, CheckCheck, CheckCircle, CalendarIcon, Eye, Pencil } from 'lucide-react';
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
  DialogOverlay,
  DialogPortal,
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
import { Checkbox } from "../ui/checkbox";
interface SalonPermission {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  key: string;
}

interface StaffMember {
  id: number;
  salon_id: number;
  user_id: number;
  position: string;
  is_active: boolean;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    full_phone: string;
    gender: string;
    birth_date: string;
    phone_code: string;
    phone: string;
    salon_permissions: Array<{
      permission: SalonPermission;
    }>;
  };
}

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
interface GiftCard {
  id: number;
  code: string;
  sender_id: number;
  recipient_id: number | null;
  phone_code: string;
  phone: string;
  full_phone: string;
  type: string;
  amount: string;
  received_at: string;
  currency: string | null;
  services: number[];
  services_data: {
    id: number;
    name: {
      en: string;
      ar: string;
    };
    duration_minutes: number;
    final_price: number;
  }[];
  message: string;
  is_used: boolean;
  sender: {

    id: number;
    full_phone: string;
    full_name: string;
    avatar: string | null;
  };
  recipient: {
    id: number;
    email: string;
    full_name: string;
    avatar: string | null;
  } | null;
  created_at: string;
  updated_at: string;
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
  icon_url: string;
}

interface Booking {
  id: number;
  code: string;
  date: string;
  total_price: number;
  time: string;
  end_time: string;
  total_service_time_in_minutes: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "paid" | "unpaid";
  user: User;
  salon: Salon;
  booking_services: BookingService[];
}

interface Payment {
  id: number;
  amount: string;
  currency: string;
  method: string;
  status: string;
  is_refund: boolean;
  system_percentage: string;
  paymentable_id: number;
  paymentable_type: string;
  booking?: Booking;
  gift_card?: GiftCard;
  created_at: string;
  updated_at: string;
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
  type: string;
  id: number;
  name: string;
  icon_url: string;
  description: string;
  is_active: boolean;
  merchant_legal_name: "",
  merchant_commercial_name: "",
  address: "",
  city_street_name: "",
  contact_name: "",
  contact_number: "",
  contact_email: "",
  business_contact_name: "",
  business_contact_number: "",
  business_contact_email: "",
  bio: "",
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
  final_price: number;
  currency: string;
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
interface Holiday {
  id: number;
  salon_id: number;
  holiday_date: string;
  reason: string;
  is_full_day: boolean;
  is_partial: boolean;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
  updated_at: string;
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
  const [perPage, setPerPage] = useState(4);
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
  // Add these state variables in your component
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidaysCurrentPage, setHolidaysCurrentPage] = useState(1);
  const [holidaysTotalPages, setHolidaysTotalPages] = useState(1);
  const [holidaysPerPage, setHolidaysPerPage] = useState(10);
  const [holidaysTotalItems, setHolidaysTotalItems] = useState(0);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  // Add these state variables
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const [staffTotalPages, setStaffTotalPages] = useState(1);
  const [staffPerPage, setStaffPerPage] = useState(10);
  const [staffTotalItems, setStaffTotalItems] = useState(0);
  const [permissions, setPermissions] = useState<SalonPermission[]>([]);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [isDeleteStaffDialogOpen, setIsDeleteStaffDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  // Add these state variables in your component
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsCurrentPage, setPaymentsCurrentPage] = useState(1);
  const [paymentsTotalPages, setPaymentsTotalPages] = useState(1);
  const [paymentsPerPage, setPaymentsPerPage] = useState(10);
  const [paymentsTotalItems, setPaymentsTotalItems] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const fetchStaff = async () => {
    try {
      const response = await fetchData(`admin/salon-staff?salon_id=${salonId}&page=${staffCurrentPage}`);
      if (response.success) {
        setStaff(response.data);
        setStaffTotalPages(response.meta.last_page);
        setStaffCurrentPage(response.meta.current_page);
        setStaffPerPage(response.meta.per_page);
        setStaffTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب الموظفين",
        variant: "destructive",
      });
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetchData('admin/salon-permissions');
      if (response.success) {
        setPermissions(response.data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  // Add useEffect for staff
  useEffect(() => {
    if (activeTab === 'staff') {
      fetchStaff();
      fetchPermissions();
    }
  }, [activeTab, staffCurrentPage, salonId]);
  const StaffTab = () => {
    const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      try {
        const response = await addData('admin/salon-staff',
          {
            salon_id: salonId,
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            phone_code: formData.get('phone_code'),
            phone: formData.get('phone'),
            gender: formData.get('gender'),
            birth_date: formData.get('birth_date'),
            password: formData.get('password'),
            position: formData.get('position'),
            is_active: formData.get('is_active') === '1',
            permissions: Array.from(formData.getAll('permissions')).map(Number),
          }
        );

        if (response.success) {
          toast({
            title: "تم",
            description: "تمت إضافة الموظف بنجاح",
          });
          setIsAddStaffDialogOpen(false);
          fetchStaff();
        }
      } catch (error) {
        console.error('Error adding staff:', error);
        toast({
          title: "خطأ",
          description: "فشل في إضافة الموظف",
          variant: "destructive",
        });
      }
    };

    const handleEditStaff = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingStaff) return;

      const formData = new FormData(e.currentTarget);

      try {
        const response = await updateData(`admin/salon-staff/${editingStaff.id}`, {
          salon_id: salonId,
          first_name: formData.get('first_name'),
          last_name: formData.get('last_name'),
          phone_code: formData.get('phone_code'),
          phone: formData.get('phone'),
          gender: formData.get('gender'),
          birth_date: formData.get('birth_date'),
          position: formData.get('position'),
          is_active: formData.get('is_active') === '1',
          permissions: Array.from(formData.getAll('permissions')).map(Number),
        });

        if (response.success) {
          toast({
            title: "تم",
            description: "تم تحديث بيانات الموظف بنجاح",
          });
          setIsEditStaffDialogOpen(false);
          fetchStaff();
        }
      } catch (error) {
        console.error('Error updating staff:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحديث بيانات الموظف",
          variant: "destructive",
        });
      }
    };

    const handleDeleteStaff = async () => {
      if (!editingStaff) return;

      try {
        const response = await deleteData(`admin/salon-staff/${editingStaff.id}`);

        if (response.success) {
          toast({
            title: "تم",
            description: "تم حذف الموظف بنجاح",
          });
          setIsDeleteStaffDialogOpen(false);
          fetchStaff();
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast({
          title: "خطأ",
          description: "فشل في حذف الموظف",
          variant: "destructive",
        });
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">الموظفين</h3>
          <Button onClick={() => setIsAddStaffDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة موظف
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>المنصب</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>الصلاحيات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{member.user.first_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.user.full_name}</p>
                          <p className="text-sm text-muted-foreground">{member.user.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell style={{ unicodeBidi: "plaintext" }}>{member.user.full_phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {member.user.salon_permissions.map((p) => (
                          <Badge key={p.permission.id} variant="secondary">
                            {p.permission.name.ar}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.is_active ? 'success' : 'secondary'}>
                        {member.is_active ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingStaff(member);
                            setIsEditStaffDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingStaff(member);
                            setIsDeleteStaffDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-center p-4">
            <PaginationWithInfo
              currentPage={staffCurrentPage}
              totalPages={staffTotalPages}
              totalItems={staffTotalItems}
              itemsPerPage={staffPerPage}
              onPageChange={setStaffCurrentPage}
            />
          </CardFooter>
        </Card>

        {/* Add Staff Dialog */}
        <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen} >
          <DialogPortal>
            {/* <DialogOverlay /> */}
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة موظف جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStaff}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">الاسم الأول</Label>
                      <Input id="first_name" name="first_name" required />
                    </div>
                    <div>
                      <Label htmlFor="last_name">الاسم الأخير</Label>
                      <Input id="last_name" name="last_name" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone_code">رمز الدولة</Label>
                      <Input id="phone_code" name="phone_code" defaultValue="+961" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input id="phone" name="phone" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">الجنس</Label>
                      <Select name="gender">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">ذكر</SelectItem>
                          <SelectItem value="female">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="birth_date">تاريخ الميلاد</Label>
                      <Input id="birth_date" name="birth_date" type="date" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>

                  <div>
                    <Label htmlFor="position">المنصب</Label>
                    <Input id="position" name="position" required />
                  </div>

                  <div>
                    <Label htmlFor="permissions">الصلاحيات</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center gap-2">
                          <Checkbox name="permissions" value={permission.id} />
                          <span>{permission.name.ar}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="is_active">الحالة</Label>
                    <Select name="is_active" defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">نشط</SelectItem>
                        <SelectItem value="0">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">إضافة</Button>
                </DialogFooter>
              </form>
            </DialogContent>

          </DialogPortal>
        </Dialog>

        {/* Edit Staff Dialog */}
        <Dialog open={isEditStaffDialogOpen} onOpenChange={setIsEditStaffDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>تعديل بيانات الموظف</DialogTitle>
            </DialogHeader>
            {editingStaff && (
              <form onSubmit={handleEditStaff}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">الاسم الأول</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        defaultValue={editingStaff.user.first_name}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">الاسم الأخير</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        defaultValue={editingStaff.user.last_name}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone_code">رمز الدولة</Label>
                      <Input
                        id="phone_code"
                        name="phone_code"
                        defaultValue={editingStaff.user.phone_code}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={editingStaff.user.phone}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">الجنس</Label>
                      <Select name="gender" defaultValue={editingStaff.user.gender}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">ذكر</SelectItem>
                          <SelectItem value="female">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="birth_date">تاريخ الميلاد</Label>
                      <Input
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        defaultValue={editingStaff.user.birth_date}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="position">المنصب</Label>
                    <Input
                      id="position"
                      name="position"
                      defaultValue={editingStaff.position}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="permissions">الصلاحيات</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center gap-2">
                          <Checkbox
                            name="permissions"
                            value={permission.id}
                            defaultChecked={editingStaff.user.salon_permissions.some(
                              p => p.permission.id === permission.id
                            )}
                          />
                          <span>{permission.name.ar}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="is_active">الحالة</Label>
                    <Select name="is_active" defaultValue={editingStaff.is_active ? "1" : "0"}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">نشط</SelectItem>
                        <SelectItem value="0">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditStaffDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">حفظ التغييرات</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Staff Dialog */}
        <Dialog open={isDeleteStaffDialogOpen} onOpenChange={setIsDeleteStaffDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>حذف موظف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من رغبتك في حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteStaffDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleDeleteStaff}>
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };
  // Add this function to fetch payments
  const fetchPayments = async () => {
    try {
      setIsLoadingPayments(true);
      const response = await fetchData(`admin/salon-payments?salon_id=${salonId}&page=${paymentsCurrentPage}`);
      if (response.success) {
        setPayments(response.data);
        setPaymentsTotalPages(response.meta.last_page);
        setPaymentsCurrentPage(response.meta.current_page);
        setPaymentsPerPage(response.meta.per_page);
        setPaymentsTotalItems(response.meta.total);
        setIsLoadingPayments(false);

      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب المدفوعات",
        variant: "destructive",
      });
    }
  };

  // Add useEffect for payments
  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab, paymentsCurrentPage, salonId]);

  // Add the PaymentsTab component
  const PaymentsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">المدفوعات</h3>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم العملية</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>طريقة الدفع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingReviews ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      <p className="text-sm text-muted-foreground">جاري تحميل المدفوعات...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-sm text-muted-foreground">لا توجد مدفوعات</p>
                  </TableCell>
                </TableRow>
              ) : payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>#{payment.id}</TableCell>
                  <TableCell>{payment.amount} {payment.currency}</TableCell>
                  <TableCell>
                    {payment.method === 'wallet' ? 'المحفظة' :
                      payment.method === 'stripe' ? 'بطاقة ائتمان' :
                        payment.method === 'cash' ? 'نقداً' :
                          payment.method}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${payment.status === 'confirm' ? 'bg-green-50 text-green-700' :
                      payment.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        payment.status === 'canceled' ? 'bg-red-50 text-red-700' :
                          payment.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-gray-50 text-gray-700'
                      }`}>
                      {payment.status === 'confirm' ? 'مؤكد' :
                        payment.status === 'pending' ? 'قيد الانتظار' :
                          payment.status === 'canceled' ? 'ملغي' :
                            payment.status === 'rejected' ? 'مرفوض' :
                              payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.paymentable_type.includes('Booking') ? 'حجز' : 'بطاقة هدية'}
                  </TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>
                    {payment.paymentable_type.includes('Booking') && (
                      <>
                        <Link href={`/appointments/${payment.paymentable_id}`}>
                          <Button variant="ghost" size="icon">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </Link>

                      </>)}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowPaymentDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center p-4">
          <PaginationWithInfo
            currentPage={paymentsCurrentPage}
            totalPages={paymentsTotalPages}
            totalItems={paymentsTotalItems}
            itemsPerPage={paymentsPerPage}
            onPageChange={setPaymentsCurrentPage}
          />
        </CardFooter>
      </Card>

      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل العملية #{selectedPayment?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>المبلغ</Label>
                <p className="text-lg font-medium">{selectedPayment?.amount} {selectedPayment?.currency}</p>
              </div>
              <div>
                <Label>طريقة الدفع</Label>
                <p className="text-lg font-medium">{selectedPayment?.method}</p>
              </div>
              <div>
                <Label>الحالة</Label>
                <Badge variant={selectedPayment?.status === 'confirm' ? 'success' : 'secondary'}>
                  {selectedPayment?.status}
                </Badge>
              </div>
              <div>
                <Label>نسبة النظام</Label>
                <p className="text-lg font-medium">{selectedPayment?.system_percentage}%</p>
              </div>
            </div>

            {selectedPayment?.paymentable_type.includes('Booking') && selectedPayment?.booking && (
              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium">تفاصيل الحجز</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>رقم الحجز</Label>
                    <p className="text-lg font-medium">{selectedPayment.booking.code}</p>
                  </div>
                  <div>
                    <Label>التاريخ والوقت</Label>
                    <p className="text-lg font-medium">
                      {new Date(selectedPayment.booking.date).toLocaleDateString('ar-EG')} - {selectedPayment.booking.time}
                    </p>
                  </div>
                  <div>
                    <Label>الحالة</Label>
                    <div className="mt-1">
                      {getAppointmentStatusBadge(selectedPayment.booking.status)}
                    </div>
                  </div>
                  <div>
                    <Label>المبلغ الإجمالي</Label>
                    <p className="text-lg font-medium">{selectedPayment.booking.total_price} {selectedPayment.currency}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الخدمات</Label>
                  {selectedPayment.booking.booking_services.map((bookingService) => (
                    <div key={bookingService.id} className="flex justify-between items-center p-2 border rounded">
                      <span>{bookingService.service.name.ar}</span>
                      <span>{bookingService.service.final_price} {bookingService.service.currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPayment?.paymentable_type.includes('GiftCard') && selectedPayment?.gift_card && (
              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium">تفاصيل بطاقة الهدية</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>الكود</Label>
                    <p className="text-lg font-medium">{selectedPayment.gift_card.code}</p>
                  </div>
                  <div>
                    <Label>القيمة</Label>
                    <p className="text-lg font-medium">{selectedPayment.gift_card.amount} {selectedPayment.currency}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );





  // Add this function to fetch holidays
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);

  const fetchHolidays = async () => {
    try {
      setIsLoadingHolidays(true);
      const response = await fetchData(`admin/salon-holidays?salon_id=${salonId}&page=${holidaysCurrentPage}`);
      if (response.success) {
        setHolidays(response.data);
        setHolidaysTotalPages(response.meta.last_page);
        setHolidaysCurrentPage(response.meta.current_page);
        setHolidaysPerPage(response.meta.per_page);
        setHolidaysTotalItems(response.meta.total);
        setIsLoadingHolidays(false);

      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب العطلات",
        variant: "destructive",
      });
    }
  };

  // Add useEffect for holidays
  useEffect(() => {
    if (activeTab === 'holidays') {
      fetchHolidays();
    }
  }, [activeTab, holidaysCurrentPage, salonId]);

  const HolidaysTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">العطلات والإجازات</h3>
        <Button onClick={() => {
          setEditingHoliday(null);
          setIsHolidayDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة عطلة
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>السبب</TableHead>
                <TableHead>نوع العطلة</TableHead>
                <TableHead>التوقيت</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingHolidays ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      <p className="text-sm text-muted-foreground">جاري تحميل العطلات...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : holidays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-sm text-muted-foreground">لا توجد عطلات</p>
                  </TableCell>
                </TableRow>
              ) : holidays.map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell>{new Date(holiday.holiday_date).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>{holiday.reason}</TableCell>
                  <TableCell>
                    {holiday.is_full_day ? 'يوم كامل' : 'جزئي'}
                  </TableCell>
                  <TableCell>
                    {holiday.is_partial ? `${holiday.start_time} - ${holiday.end_time}` : 'طوال اليوم'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingHoliday(holiday);
                          setIsHolidayDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                          if (confirm('هل أنت متأكد من حذف هذه العطلة؟')) {
                            try {
                              await deleteData(`admin/salon-holidays/${holiday.id}`);
                              toast({
                                title: "تم بنجاح",
                                description: "تم حذف العطلة بنجاح",
                              });
                              fetchHolidays();
                            } catch (error) {
                              console.error('Error deleting holiday:', error);
                              toast({
                                title: "خطأ",
                                description: "فشل في حذف العطلة",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center p-4">
          <PaginationWithInfo
            currentPage={holidaysCurrentPage}
            totalPages={holidaysTotalPages}
            totalItems={holidaysTotalItems}
            itemsPerPage={holidaysPerPage}
            onPageChange={setHolidaysCurrentPage}
          />
        </CardFooter>
      </Card>

      <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHoliday ? 'تعديل عطلة' : 'إضافة عطلة جديدة'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const isPartial = formData.get('is_partial') === 'true';

            const holidayData = {
              salon_id: Number(salonId),
              holiday_date: formData.get('holiday_date'),
              reason: formData.get('reason'),
              is_full_day: !isPartial,
              is_partial: isPartial,
              ...(isPartial && {
                start_time: formData.get('start_time'),
                end_time: formData.get('end_time')
              })
            };


            try {
              if (editingHoliday) {
                await updateData(`admin/salon-holidays/${editingHoliday.id}`, holidayData);
              } else {
                await addData('admin/salon-holidays', holidayData);
              }
              toast({
                title: "تم بنجاح",
                description: editingHoliday ? "تم تعديل العطلة بنجاح" : "تمت إضافة العطلة بنجاح",
              });
              setIsHolidayDialogOpen(false);
              fetchHolidays();
            } catch (error) {
              console.error('Error saving holiday:', error);
              toast({
                title: "خطأ",
                description: "فشل في حفظ العطلة",
                variant: "destructive",
              });
            }
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="holiday_date">التاريخ</Label>
                <Input
                  id="holiday_date"
                  name="holiday_date"
                  type="date"
                  defaultValue={editingHoliday?.holiday_date}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">السبب</Label>
                <Input
                  id="reason"
                  name="reason"
                  defaultValue={editingHoliday?.reason}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>نوع العطلة</Label>
                <Select
                  name="is_partial"
                  defaultValue={editingHoliday?.is_partial ? 'true' : 'false'}
                  onValueChange={(value) => {
                    const form = document.querySelector('form');
                    const timeInputs = form?.querySelector('.time-inputs');
                    if (timeInputs) {
                      (timeInputs as HTMLElement).style.display = value === 'true' ? 'grid' : 'none';
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع العطلة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">يوم كامل</SelectItem>
                    <SelectItem value="true">فترة محددة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="time-inputs grid gap-4" style={{ display: editingHoliday?.is_partial ? 'grid' : 'none' }}>
                <div className="grid gap-2">
                  <Label htmlFor="start_time">وقت البداية</Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    defaultValue={editingHoliday?.start_time || ''}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_time">وقت النهاية</Label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    defaultValue={editingHoliday?.end_time || ''}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsHolidayDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {editingHoliday ? 'تعديل' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );


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
        // setActiveTab("services"); // Ensure we stay on services tab

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
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await fetchData(`admin/reviews?salon_id=${salonId}&page=${reviewsCurrentPage}&limit=${reviewsPerPage}`);
      if (response.success) {
        setReviews(response.data);
        calculateReviewStats(response.data);
        setReviewsTotalPages(response.meta.last_page);
        setReviewsCurrentPage(response.meta.current_page);
        setReviewsPerPage(response.meta.per_page);
        setReviewsTotalItems(response.meta.total);
        setIsLoadingReviews(false);

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
  }, [salonId, currentPage, perPage, selectedCategory, selectedStatus]);

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
                {/* type */}
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {salonData.type === "clinic" ? "عيادة" :
                    salonData.type === "salon" ? "صالون" :
                      salonData.type === "home_service" ? "خدمة منزلية" :
                        salonData.type}
                </Badge>
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
                        هل أنت متأكد من رغبتك في تعليق صالون {salon.merchant_commercial_name}؟
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
                        هل أنت متأكد من رغبتك في حظر صالون {salon.merchant_commercial_name} بشكل
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
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="services">الخدمات</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                <TabsTrigger value="appointments">الحجوزات</TabsTrigger>
                <TabsTrigger value="holidays">
                  {/* <CalendarIcon className="h-4 w-4 ml-2" /> */}
                  العطلات
                </TabsTrigger>

                <TabsTrigger value="payments">
                  {/* <CreditCard className="h-4 w-4 ml-2" /> */}
                  المدفوعات
                </TabsTrigger>
                <TabsTrigger value="staff">الموظفين</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="staff" className="space-y-6">
                <StaffTab />
              </TabsContent>
              <TabsContent className="space-y-6" value="payments">
                <PaymentsTab />
              </TabsContent>
              <TabsContent value="holidays" className="space-y-6">
                <HolidaysTab />
              </TabsContent>
              <TabsContent value="overview" className="space-y-6">
                <div className="rounded-lg overflow-hidden h-48 md:h-64">
                  <img
                    src={salonData.icon_url || "/placeholder.svg"}
                    alt={salonData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* type */}

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">عن الصالون</h3>
                  <p className="text-muted-foreground">{salonData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">الاسم القانوني للتاجر</h3>
                    <p>{salonData.merchant_legal_name}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">الاسم التجاري للتاجر</h3>
                    <p>{salonData.merchant_commercial_name}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">العنوان</h3>
                    <p>{salonData.address}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">الشارع والمدينة</h3>
                    <p>{salonData.city_street_name}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">اسم جهة الاتصال</h3>
                    <p>{salonData.contact_name}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">رقم جهة الاتصال</h3>
                    <p>{salonData.contact_number}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">البريد الإلكتروني لجهة الاتصال</h3>
                    <p>{salonData.contact_email}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">الاسم التجاري لجهة الأعمال</h3>
                    <p>{salonData.business_contact_name}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">رقم جهة الأعمال</h3>
                    <p>{salonData.business_contact_number}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">البريد الإلكتروني لجهة الأعمال</h3>
                    <p>{salonData.business_contact_email}</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">الوصف</h3>
                    <p>{salonData.description}</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">نبذة</h3>
                    <p>{salonData.bio}</p>
                  </div>
                </div>
                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">الخدمات الأكثر حجزاً</h3>
                  <div className="space-y-3">
                    {
                      services.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">لا توجد خدمات</p>
                        </div>
                      ) :
                        services.slice(0, 3).map((service) => (
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
                    {
                      reviews.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">لا توجد تقييمات</p>
                        </div>
                      ) :

                        reviews.slice(0, 2).map((review) => (
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
                  {isLoadingReviews
                    ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground">جاري تحميل التقييمات...</p>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">لا توجد تقييمات</p>
                      </div>
                    ) : reviews.map((review) => (
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
                                    <span className="text-sm">{new Date(appointment.date).toLocaleDateString("ar-EG")}</span>
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
                          {salon.merchant_commercial_name}
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
                            {salon.merchant_commercial_name}
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

