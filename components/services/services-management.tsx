"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react";

// نموذج بيانات الخدمة
interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  status: "active" | "inactive";
}

// تحويل فئة الخدمة إلى نص عربي
const getCategoryName = (category: string): string => {
  const categories: Record<string, string> = {
    hair: "خدمات الشعر",
    skin: "خدمات البشرة",
    nails: "خدمات الأظافر",
    makeup: "خدمات المكياج",
    other: "خدمات أخرى",
  };
  return categories[category] || category;
};

export default function ServicesManagement() {
  // بيانات نموذجية للخدمات
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "قص الشعر",
      description: "قص الشعر بأحدث التقنيات والموضات",
      duration: 60,
      price: 150,
      category: "hair",
      status: "active",
    },
    {
      id: 2,
      name: "صبغة شعر",
      description: "صبغة شعر بألوان عالمية وتقنيات حديثة",
      duration: 120,
      price: 300,
      category: "hair",
      status: "active",
    },
    {
      id: 3,
      name: "تسريحة شعر",
      description: "تسريحات متنوعة للمناسبات والحفلات",
      duration: 90,
      price: 200,
      category: "hair",
      status: "active",
    },
    {
      id: 4,
      name: "مكياج",
      description: "مكياج احترافي للمناسبات والسهرات",
      duration: 60,
      price: 250,
      category: "makeup",
      status: "active",
    },
    {
      id: 5,
      name: "مانيكير وباديكير",
      description: "عناية كاملة بالأظافر",
      duration: 90,
      price: 180,
      category: "nails",
      status: "active",
    },
    {
      id: 6,
      name: "تنظيف البشرة",
      description: "تنظيف عميق للبشرة وإزالة الرؤوس السوداء",
      duration: 60,
      price: 200,
      category: "skin",
      status: "active",
    },
    {
      id: 7,
      name: "ماسك الوجه",
      description: "ماسكات طبيعية للوجه لتغذية البشرة",
      duration: 30,
      price: 120,
      category: "skin",
      status: "inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // تصفية الخدمات حسب البحث والفئة والحالة
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.includes(searchTerm) ||
      service.description.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || service.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // إضافة خدمة جديدة
  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newService: Service = {
      id: services.length + 1,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      duration: Number.parseInt(formData.get("duration") as string),
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      status: "active",
    };
    setServices([...services, newService]);
    setIsAddDialogOpen(false);
    e.currentTarget.reset();
  };

  // تعديل خدمة
  const handleEditService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService) return;

    const formData = new FormData(e.currentTarget);
    const updatedService: Service = {
      ...editingService,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      duration: Number.parseInt(formData.get("duration") as string),
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      status: formData.get("status") as "active" | "inactive",
    };

    setServices(
      services.map((service) =>
        service.id === editingService.id ? updatedService : service
      )
    );
    setIsEditDialogOpen(false);
    setEditingService(null);
  };

  // حذف خدمة
  const handleDeleteService = () => {
    if (!editingService) return;
    setServices(services.filter((service) => service.id !== editingService.id));
    setIsDeleteDialogOpen(false);
    setEditingService(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          إدارة الخدمات
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة خدمة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="البحث عن خدمة..."
            className="pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="تصفية حسب الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              <SelectItem value="hair">خدمات الشعر</SelectItem>
              <SelectItem value="skin">خدمات البشرة</SelectItem>
              <SelectItem value="nails">خدمات الأظافر</SelectItem>
              <SelectItem value="makeup">خدمات المكياج</SelectItem>
              <SelectItem value="other">خدمات أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            جميع الخدمات ({services.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            الخدمات النشطة (
            {services.filter((s) => s.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            الخدمات غير النشطة (
            {services.filter((s) => s.status === "inactive").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => {
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
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                لا توجد خدمات مطابقة للبحث
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices
              .filter((service) => service.status === "active")
              .map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={() => {
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
          {filteredServices.filter((service) => service.status === "active")
            .length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                لا توجد خدمات نشطة مطابقة للبحث
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices
              .filter((service) => service.status === "inactive")
              .map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={() => {
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
          {filteredServices.filter((service) => service.status === "inactive")
            .length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                لا توجد خدمات غير نشطة مطابقة للبحث
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* مربع حوار إضافة خدمة جديدة */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة خدمة جديدة</DialogTitle>
            <DialogDescription>أدخل تفاصيل الخدمة الجديدة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddService}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الخدمة</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">وصف الخدمة</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة (بالدقائق)</Label>
                  <Input
                    id="duration"
                    name="duration"
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
                <Label htmlFor="category">فئة الخدمة</Label>
                <Select name="category" defaultValue="hair">
                  <SelectTrigger id="category">
                    <SelectValue placeholder="اختر فئة الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hair">خدمات الشعر</SelectItem>
                    <SelectItem value="skin">خدمات البشرة</SelectItem>
                    <SelectItem value="nails">خدمات الأظافر</SelectItem>
                    <SelectItem value="makeup">خدمات المكياج</SelectItem>
                    <SelectItem value="other">خدمات أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
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
                <div className="space-y-2">
                  <Label htmlFor="edit-name">اسم الخدمة</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingService.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">وصف الخدمة</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingService.description}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">المدة (بالدقائق)</Label>
                    <Input
                      id="edit-duration"
                      name="duration"
                      type="number"
                      min="1"
                      defaultValue={editingService.duration}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">السعر (د.إ)</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={editingService.price}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">فئة الخدمة</Label>
                  <Select
                    name="category"
                    defaultValue={editingService.category}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="اختر فئة الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hair">خدمات الشعر</SelectItem>
                      <SelectItem value="skin">خدمات البشرة</SelectItem>
                      <SelectItem value="nails">خدمات الأظافر</SelectItem>
                      <SelectItem value="makeup">خدمات المكياج</SelectItem>
                      <SelectItem value="other">خدمات أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">حالة الخدمة</Label>
                  <Select name="status" defaultValue={editingService.status}>
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="اختر حالة الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
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
                أنت على وشك حذف خدمة &quot;{editingService.name}&quot;. هذا
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

// مكون بطاقة الخدمة
interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}

function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <Badge
            variant={service.status === "active" ? "default" : "secondary"}
          >
            {service.status === "active" ? "نشط" : "غير نشط"}
          </Badge>
        </div>
        <CardDescription>{getCategoryName(service.category)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {service.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{service.duration} دقيقة</Badge>
            <span className="font-medium">{service.price} د.إ</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 ml-1" />
          تعديل
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 ml-1" />
          حذف
        </Button>
      </CardFooter>
    </Card>
  );
}
