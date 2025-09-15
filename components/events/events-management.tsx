"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Users,
} from "lucide-react";

// تعريف نوع البيانات للمناسبة
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  price: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  imageUrl: string;
  createdAt: string;
  category: string;
  registeredUsers: number;
}

export default function EventsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  // فئات المناسبات
  const eventCategories = [
    { id: "workshop", name: "ورشة عمل" },
    { id: "seminar", name: "ندوة" },
    { id: "competition", name: "مسابقة" },
    { id: "promotion", name: "عرض ترويجي" },
    { id: "other", name: "أخرى" },
  ];

  // بيانات المناسبات (في تطبيق حقيقي، ستأتي من قاعدة البيانات)
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "ورشة تعلم تسريحات الشعر",
      description: "ورشة عمل لتعلم أحدث تسريحات الشعر للمناسبات والأعراس",
      date: "2023-08-15",
      time: "16:00",
      location: "مزود الأميرة - الرياض",
      capacity: 20,
      price: 150,
      status: "upcoming",
      imageUrl: "/placeholder.svg?height=200&width=300",
      createdAt: "2023-07-01",
      category: "workshop",
      registeredUsers: 12,
    },
    {
      id: "2",
      title: "عروض اليوم الوطني",
      description: "خصومات خاصة بمناسبة اليوم الوطني على جميع الخدمات",
      date: "2023-09-23",
      time: "10:00",
      location: "جميع الفروع",
      capacity: 0,
      price: 0,
      status: "upcoming",
      imageUrl: "/placeholder.svg?height=200&width=300",
      createdAt: "2023-08-15",
      category: "promotion",
      registeredUsers: 0,
    },
    {
      id: "3",
      title: "مسابقة أفضل تسريحة",
      description: "مسابقة لاختيار أفضل تسريحة شعر مع جوائز قيمة",
      date: "2023-07-10",
      time: "18:00",
      location: "مزود الأميرة - جدة",
      capacity: 30,
      price: 50,
      status: "completed",
      imageUrl: "/placeholder.svg?height=200&width=300",
      createdAt: "2023-06-01",
      category: "competition",
      registeredUsers: 28,
    },
  ]);

  // إضافة مناسبة جديدة
  const addEvent = (
    event: Omit<Event, "id" | "createdAt" | "registeredUsers">
  ) => {
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substring(2, 9), // توليد معرف عشوائي
      createdAt: new Date().toISOString().split("T")[0], // تاريخ اليوم
      registeredUsers: 0,
    };
    setEvents([...events, newEvent]);
    setIsAddDialogOpen(false);
  };

  // تعديل مناسبة
  const editEvent = (updatedEvent: Event) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setIsEditDialogOpen(false);
    setCurrentEvent(null);
  };

  // حذف مناسبة
  const deleteEvent = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المناسبة؟")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  // تصفية المناسبات حسب البحث والحالة والفئة
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.includes(searchQuery) ||
      event.description.includes(searchQuery) ||
      event.location.includes(searchQuery);
    const matchesStatus = statusFilter ? event.status === statusFilter : true;
    const matchesCategory = categoryFilter
      ? event.category === categoryFilter
      : true;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // الحصول على اسم الحالة بالعربية
  const getStatusName = (status: string) => {
    switch (status) {
      case "upcoming":
        return "قادمة";
      case "ongoing":
        return "جارية";
      case "completed":
        return "مكتملة";
      case "cancelled":
        return "ملغية";
      default:
        return status;
    }
  };

  // الحصول على اسم الفئة من المعرف
  const getCategoryName = (categoryId: string) => {
    return (
      eventCategories.find((cat) => cat.id === categoryId)?.name || categoryId
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة المناسبات</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مناسبة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة مناسبة جديدة</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل المناسبة الجديدة. اضغط على حفظ عند الانتهاء.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                addEvent({
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  date: formData.get("date") as string,
                  time: formData.get("time") as string,
                  location: formData.get("location") as string,
                  capacity: Number.parseInt(formData.get("capacity") as string),
                  price: Number.parseFloat(formData.get("price") as string),
                  status: formData.get("status") as
                    | "upcoming"
                    | "ongoing"
                    | "completed"
                    | "cancelled",
                  imageUrl: "/placeholder.svg?height=200&width=300", // في تطبيق حقيقي، سيتم رفع الصورة
                  category: formData.get("category") as string,
                });
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    عنوان المناسبة
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    الوصف
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    الفئة
                  </Label>
                  <Select name="category" defaultValue="workshop">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر فئة المناسبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    التاريخ
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    الوقت
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    المكان
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    السعة
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="0"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    السعر (AED)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    الحالة
                  </Label>
                  <Select name="status" defaultValue="upcoming">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر حالة المناسبة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">قادمة</SelectItem>
                      <SelectItem value="ongoing">جارية</SelectItem>
                      <SelectItem value="completed">مكتملة</SelectItem>
                      <SelectItem value="cancelled">ملغية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">إنشاء المناسبة</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المناسبات</CardTitle>
          <CardDescription>
            عرض وإدارة جميع المناسبات في التطبيق
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث عن مناسبة..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter || "all"}
              onValueChange={(value) =>
                setStatusFilter(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="upcoming">قادمة</SelectItem>
                <SelectItem value="ongoing">جارية</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter || "all"}
              onValueChange={(value) =>
                setCategoryFilter(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {eventCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المناسبة</TableHead>
                  <TableHead>التاريخ والوقت</TableHead>
                  <TableHead>المكان</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المشاركون</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.description.substring(0, 50)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryName(event.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusName(event.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.registeredUsers}
                            {event.capacity > 0 && ` / ${event.capacity}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentEvent(event);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      لا توجد مناسبات متطابقة مع معايير البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* مربع حوار تعديل المناسبة */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل المناسبة</DialogTitle>
            <DialogDescription>
              قم بتعديل تفاصيل المناسبة. اضغط على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          {currentEvent && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                editEvent({
                  ...currentEvent,
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  date: formData.get("date") as string,
                  time: formData.get("time") as string,
                  location: formData.get("location") as string,
                  capacity: Number.parseInt(formData.get("capacity") as string),
                  price: Number.parseFloat(formData.get("price") as string),
                  status: formData.get("status") as
                    | "upcoming"
                    | "ongoing"
                    | "completed"
                    | "cancelled",
                  category: formData.get("category") as string,
                });
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    عنوان المناسبة
                  </Label>
                  <Input
                    id="edit-title"
                    name="title"
                    className="col-span-3"
                    defaultValue={currentEvent.title}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    الوصف
                  </Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    className="col-span-3"
                    defaultValue={currentEvent.description}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    الفئة
                  </Label>
                  <Select name="category" defaultValue={currentEvent.category}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر فئة المناسبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-date" className="text-right">
                    التاريخ
                  </Label>
                  <Input
                    id="edit-date"
                    name="date"
                    type="date"
                    className="col-span-3"
                    defaultValue={currentEvent.date}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-time" className="text-right">
                    الوقت
                  </Label>
                  <Input
                    id="edit-time"
                    name="time"
                    type="time"
                    className="col-span-3"
                    defaultValue={currentEvent.time}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-location" className="text-right">
                    المكان
                  </Label>
                  <Input
                    id="edit-location"
                    name="location"
                    className="col-span-3"
                    defaultValue={currentEvent.location}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-capacity" className="text-right">
                    السعة
                  </Label>
                  <Input
                    id="edit-capacity"
                    name="capacity"
                    type="number"
                    min="0"
                    className="col-span-3"
                    defaultValue={currentEvent.capacity}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">
                    السعر (AED)
                  </Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="col-span-3"
                    defaultValue={currentEvent.price}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    الحالة
                  </Label>
                  <Select name="status" defaultValue={currentEvent.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر حالة المناسبة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">قادمة</SelectItem>
                      <SelectItem value="ongoing">جارية</SelectItem>
                      <SelectItem value="completed">مكتملة</SelectItem>
                      <SelectItem value="cancelled">ملغية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
