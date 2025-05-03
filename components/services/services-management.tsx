"use client";

import type React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
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
  SelectGroup,
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
import { addData, deleteData, fetchData, updateData } from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import { Pagination } from "../ui/pagination";

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
interface ServiceGroup {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  salon_id: number;
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
  const [services, setServices] = useState<Service[]>([]);
  const [salonSearchTerm, setSalonSearchTerm] = useState("");
  const [uploadedIcon, setUploadedIcon] = useState<string>("");
  const [iconPreview, setIconPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("both");
  const [selectedStatus, setSelectedStatus] = useState<string>("groups");
  const [activeTab, setActiveTab] = useState("groups");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Add new state for salons
  const [salons, setSalons] = useState<{ id: number; name: string }[]>([]);
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ServiceGroup | null>(null);
  const [groupCurrentPage, setGroupCurrentPage] = useState(1);
  const [groupTotalPages, setGroupTotalPages] = useState(1);
  const [groupTotalItems, setGroupTotalItems] = useState(0);


  // Add this function to fetch groups
  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(`admin/groups?page=${groupCurrentPage}&limit=${perPage}&search=${searchTerm}`);
      if (response.success) {
        setGroups(response.data || []);
        setGroupTotalPages(response.meta.last_page);
        setGroupCurrentPage(response.meta.current_page);
        setGroupTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add group management functions
  const handleAddGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newGroup = {
      // salon_id: Number(formData.get("salon_id")),
      salon_id: '',
      name: {
        en: formData.get("name_en") as string,
        ar: formData.get("name_ar") as string,
      },
    };

    try {
      const response = await addData("admin/groups", newGroup);
      if (response.success) {
        await fetchGroups();
        setIsAddGroupDialogOpen(false);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تمت إضافة المجموعة بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to add group:", error);
    }
  };

  const handleEditGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGroup) return;

    const formData = new FormData(e.currentTarget);
    const updatedGroup = {
      // salon_id: Number(formData.get("salon_id")),
      salon_id: '',
      name: {
        en: formData.get("name_en") as string,
        ar: formData.get("name_ar") as string,
      },
    };

    try {
      const response = await updateData(`admin/groups/${editingGroup.id}`, updatedGroup);
      if (response.success) {
        await fetchGroups();
        setIsEditGroupDialogOpen(false);
        setEditingGroup(null);
        toast({
          title: "تم التعديل بنجاح",
          description: "تم تعديل المجموعة بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to update group:", error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!editingGroup) return;

    try {
      const response = await deleteData(`admin/groups/${editingGroup.id}`);
      if (response.success) {
        await fetchGroups();
        setIsDeleteGroupDialogOpen(false);
        setEditingGroup(null);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف المجموعة بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  // Update the useEffect to fetch groups
  useEffect(() => {
    fetchGroups();
  }, [groupCurrentPage,]);

  // Add this function to handle image upload
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
  // Add salon fetch function
  const fetchSalons = async (search: string = "") => {
    try {
      const response = await fetchData(`admin/salons?search=${search}`);
      if (response.success) {
        setSalons(response.data.map((salon: any) => ({
          id: salon.id,
          name: salon.merchant_commercial_name
        })));
      }
    } catch (error) {
      console.error("Failed to fetch salons:", error);
    }
  };

  // Update useEffect to fetch salons
  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const activeFilter = selectedStatus !== 'all' ? `&is_active=${selectedStatus === 'active' ? 1 : 0}` : '';
      const categoryFilter = selectedCategory ? `&gender=${selectedCategory}` : '';

      const response = await fetchData(`admin/services?page=${currentPage}&limit=${perPage}&search=${searchTerm}${activeFilter}${categoryFilter}`);
      if (response.success) {
        setServices(response.data || []);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setPerPage(response.meta.per_page);
        setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Add useEffect to fetch data on component mount
  useEffect(() => {
    fetchServices();
  }, [currentPage, searchTerm, selectedStatus, selectedCategory]);
  // تصفية الخدمات حسب البحث والفئة والحالة
  // const filteredServices = services.filter((service) => {
  //   const matchesSearch =
  //     service.name.includes(searchTerm) ||
  //     service.description.includes(searchTerm);
  //   const matchesCategory =
  //     selectedCategory === "all" || service.category === selectedCategory;
  //   const matchesStatus =
  //     selectedStatus === "all" || service.status === selectedStatus;
  //   return matchesSearch && matchesCategory && matchesStatus;
  // });
  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newService = {
      salon_id: Number(formData.get("salon_id")), // Get selected salon_id
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
  // تعديل خدمة
  const handleEditService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService) return;

    const formData = new FormData(e.currentTarget);
    const updatedService = {
      salon_id: Number(formData.get("salon_id")), // Get selected salon_id
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
  useEffect(() => {
    return () => {
      if (iconPreview) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);
  // حذف خدمة
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {activeTab === "groups" ? "إدارة المجموعات" : "إدارة الخدمات"}
        </h1>
        <Button
          onClick={() => activeTab === "groups"
            ? setIsAddGroupDialogOpen(true)
            : setIsAddDialogOpen(true)
          }
        >
          <Plus className="h-4 w-4 ml-2" />
          {activeTab === "groups" ? "إضافة مجموعة" : "إضافة خدمة"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={activeTab === "groups" ? "بحث في المجموعات" : "بحث في الخدمات"}
            className="pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === "all" && (
          <>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="تصفية حسب الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both"> كلاهما</SelectItem>
                  <SelectItem value="male">الرجال</SelectItem>
                  <SelectItem value="female">النساء </SelectItem>

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
          </>
        )
        }
      </div>

      <Tabs defaultValue="groups" className="w-full" onValueChange={setActiveTab}>
        {/* <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            الخدمات ({services.length})
          </TabsTrigger>
          <TabsTrigger value="groups">المجموعات ({groups.length})</TabsTrigger>

        </TabsList> */}

        {/* <TabsContent value="all" className="mt-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </TabsContent> */}
        <TabsContent value="groups" className="mt-4">
          {/* <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddGroupDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مجموعة
            </Button>
          </div> */}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري تحميل المجموعات...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد مجموعات متاحة</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddGroupDialogOpen(true)}
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة مجموعة جديدة
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onEdit={() => {
                    setEditingGroup(group);
                    setIsEditGroupDialogOpen(true);
                  }}
                  onDelete={() => {
                    setEditingGroup(group);
                    setIsDeleteGroupDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}

          {!isLoading && groups.length > 0 && groupTotalPages > 1 && (
            <div className="mt-4">
              <PaginationWithInfo
                currentPage={groupCurrentPage}
                totalPages={groupTotalPages}
                totalItems={groupTotalItems}
                itemsPerPage={perPage}
                onPageChange={setGroupCurrentPage}
              />
            </div>
          )}
        </TabsContent>
        {/* <TabsContent value="active" className="mt-4">
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
        </TabsContent> */}

        {/* <TabsContent value="inactive" className="mt-4">
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
        </TabsContent> */}
      </Tabs>
      {/* Add Group Dialog */}
      <Dialog open={isAddGroupDialogOpen} onOpenChange={setIsAddGroupDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة مجموعة جديدة</DialogTitle>
            <DialogDescription>أدخل تفاصيل المجموعة الجديدة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGroup}>
            <div className="grid gap-4 py-4">
              {/* <div className="space-y-2">
                <Label htmlFor="salon_id">الصالون</Label>
                <Select name="salon_id" defaultValue="5">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الصالون" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <Label htmlFor="name_ar">اسم المجموعة (عربي)</Label>
                  <Input id="name_ar" name="name_ar" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">Group Name (English)</Label>
                  <Input id="name_en" name="name_en" required />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddGroupDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">إضافة المجموعة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupDialogOpen} onOpenChange={setIsEditGroupDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل المجموعة</DialogTitle>
            <DialogDescription>تعديل تفاصيل المجموعة</DialogDescription>
          </DialogHeader>
          {editingGroup && (
            <form onSubmit={handleEditGroup}>
              <div className="grid gap-4 py-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="salon_id">الصالون</Label>
                  <Select name="salon_id" defaultValue={editingGroup.salon_id.toString()}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الصالون" />
                    </SelectTrigger>
                    <SelectContent>
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
                    <Label htmlFor="name_ar">اسم المجموعة (عربي)</Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      defaultValue={editingGroup.name.ar}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en">Group Name (English)</Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      defaultValue={editingGroup.name.en}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditGroupDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog open={isDeleteGroupDialogOpen} onOpenChange={setIsDeleteGroupDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف المجموعة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذه المجموعة؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {editingGroup && (
              <p className="text-center">
                أنت على وشك حذف مجموعة &quot;{editingGroup.name.ar}&quot;. هذا
                الإجراء لا يمكن التراجع عنه.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteGroupDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              </div>


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
                <div className="space-y-2">
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
                </div>
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

// مكون بطاقة الخدمة
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
interface GroupCardProps {
  group: ServiceGroup;
  onEdit: () => void;
  onDelete: () => void;
}

function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{group.name.ar}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              {group.name.en}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2 pt-2 border-t mt-auto">
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
  );
}