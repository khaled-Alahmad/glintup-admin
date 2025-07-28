import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addData, deleteData, fetchData, updateData } from "@/lib/apiHelper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2, Search, Eye, Package, Clock, DollarSign, Users, X, Check, Info } from "lucide-react";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SalonGroup {
  id: number;
  name: {
    ar: string;
    en: string;
  };
  description?: {
    ar: string;
    en: string;
  };
  salon_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  members_count?: number;
  orders?: number;
  group_services?: GroupService[];
}

interface Service {
  id: number;
  salon_id: number;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  icon: string;
  icon_url: string;
  duration_minutes: number;
  price: string;
  final_price: number;
  currency: string;
  discount_percentage: string;
  gender: string;
  is_active: boolean;
  is_home_service: boolean;
  is_beautician: boolean;
  capacity: number;
  order: number;
  created_at: string;
  updated_at: string;
}

interface GroupService {
  id: number;
  group_id: number;
  service_id: number;
  salon_id: number;
  order: number;
  service: Service;
  created_at: string;
  updated_at: string;
}

// SortableGroupRow component for drag handle and row rendering
function SortableGroupRow({ group, onEdit, onDelete, onViewServices, onAddServices }: {
  group: SalonGroup,
  onEdit: () => void,
  onDelete: () => void,
  onViewServices: () => void,
  onAddServices: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: group.id,
    transition: {
      duration: 150, // أسرع حركة (كانت افتراضيًا 250 مللي ثانية)
      easing: "cubic-bezier(0.2, 0, 0.4, 1)" // تسارع أكبر في البداية للحركة
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? '#f9fafb' : undefined,
    zIndex: isDragging ? 100 : undefined,
    opacity: isDragging ? 0.9 : 1, // لشفافية خفيفة أثناء السحب
    boxShadow: isDragging ? '0 5px 15px rgba(0, 0, 0, 0.15)' : undefined, // ظل أفضل
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={group.id}
      {...attributes}
      className={`transition-all duration-150 ${isDragging ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
    >
      <TableCell className="font-medium flex items-center gap-2">
        <div
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-1.5 rounded-md transition-all duration-100
            ${isDragging
              ? 'bg-primary/15 text-primary rotate-1 scale-110'
              : 'hover:bg-primary/10 hover:text-primary hover:scale-105'
            } border text-center bg-white shadow mr-2`}
          title="اسحب لتحريك المجموعة"
          style={{ userSelect: 'none' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2ZM6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2ZM18 16c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2ZM6 16c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z" />
            <path d="M6 16v4M6 8v4M18 16v4M18 8v4M6 12h12" strokeDasharray={isDragging ? "1 3" : "0"} />
          </svg>
        </div>
        <span className={`${isDragging ? 'font-bold text-primary' : ''}`}>{group.name.ar}</span>
      </TableCell>
      {group.orders !== undefined && <TableCell>{group.orders}</TableCell>}
      <TableCell>
        <div className="space-y-2">
          {group.group_services && group.group_services.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Package className="h-3 w-3 mr-1" />
                  {group.group_services.length} خدمات
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>انقر على "عرض الخدمات" لرؤية جميع التفاصيل</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {group.group_services.slice(0, 4).map((groupService, index) => (
                  <div
                    key={groupService.id}
                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200"
                  >
                    <Avatar className="h-6 w-6 rounded">
                      <AvatarImage
                        src={groupService.service.icon_url}
                        alt={groupService.service.name.ar}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {groupService.service.name.ar.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800 text-sm truncate">
                          {groupService.service.name.ar}
                        </span>
                        <div className="flex items-center gap-1 text-green-600 ml-2">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-bold text-xs">{groupService.service.final_price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{groupService.service.duration_minutes}د</span>
                        </div>
                        <Badge
                          variant={groupService.service.is_active ? "default" : "secondary"}
                          className={`text-xs h-4 ${groupService.service.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {groupService.service.is_active ? "نشط" : "غير نشط"}
                        </Badge>
                        {groupService.service.discount_percentage !== "0.00" && (
                          <Badge variant="destructive" className="text-xs h-4 bg-red-100 text-red-700">
                            خصم {groupService.service.discount_percentage}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {group.group_services.length > 4 && (
                  <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded-md border border-dashed border-gray-200">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="h-3 w-3" />
                      <span>+{group.group_services.length - 4} خدمات أخرى</span>
                    </div>
                    <span className="text-xs text-gray-400">انقر على "عرض الخدمات" للمزيد</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                <Package className="h-3 w-3 mr-1" />
                لا توجد خدمات
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddServices}
                className="text-xs h-7 px-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                إضافة خدمات
              </Button>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>{new Date(group.created_at).toLocaleDateString("ar-EG")}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onViewServices}
            className="hover:bg-green-50 hover:text-green-600 transition-colors"
            title="عرض الخدمات"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddServices}
            className="hover:bg-purple-50 hover:text-purple-600 transition-colors"
            title="إضافة خدمات"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="تعديل المجموعة"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
            title="حذف المجموعة"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface GroupsTabProps {
  salonId: string;
}

export default function GroupsTab({ salonId }: GroupsTabProps) {
  const { toast } = useToast();
  const [groups, setGroups] = useState<SalonGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<SalonGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isServicesDialogOpen, setIsServicesDialogOpen] = useState(false);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  // DnD-kit sensors with improved responsiveness
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2, // مسافة أقل لبدء السحب بشكل أسرع
        tolerance: 3, // تسامح أقل لدقة أكبر
        delay: 30, // تأخير أقل للاستجابة الأسرع
      }
    })
  );
  const [isDragging, setIsDragging] = useState(false);

  // Fetch groups when component mounts or when page changes
  useEffect(() => {
    fetchGroups();
  }, [salonId, currentPage, searchQuery]);

  // Function to fetch groups from API
  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData(
        `admin/groups?salon_id=${salonId}&page=${currentPage}&search=${searchQuery}`
      );
      console.log("Fetched groups:", response);

      if (response.success) {
        setGroups(response.data);
        setTotalPages(response.meta.last_page);
        setTotalItems(response.meta.total);
        setPerPage(response.meta.per_page);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب بيانات المجموعات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new group
  const handleAddGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newGroup = {
      salon_id: Number(salonId),
      name: {
        ar: formData.get("name_ar") as string,
        en: formData.get("name_en") as string,
      },
    };

    try {
      const response = await addData("admin/groups", newGroup);
      if (response.success) {
        await fetchGroups();
        setIsAddDialogOpen(false);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تمت إضافة المجموعة بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to add group:", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة المجموعة",
        variant: "destructive",
      });
    }
  };

  // Function to edit a group
  const handleEditGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentGroup) return;

    const formData = new FormData(e.currentTarget);

    const updatedGroup = {
      name: {
        ar: formData.get("name") as string,
        en: formData.get("name_en") as string,
      },
    };

    try {
      const response = await updateData(
        `admin/groups/${currentGroup.id}`,
        updatedGroup
      );
      if (response.success) {
        await fetchGroups();
        setIsEditDialogOpen(false);
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المجموعة بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to update group:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث المجموعة",
        variant: "destructive",
      });
    }
  };

  // Function to delete a group
  const handleDeleteGroup = async () => {
    if (!currentGroup) return;

    try {
      const response = await deleteData(`admin/groups/${currentGroup.id}`);
      if (response.success) {
        await fetchGroups();
        setIsDeleteDialogOpen(false);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف المجموعة بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المجموعة",
        variant: "destructive",
      });
    }
  };

  // Function to fetch available services for adding to group
  const fetchAvailableServices = async (groupId: number) => {
    setIsLoadingServices(true);
    try {
      const response = await fetchData(`admin/services?salon_id=${salonId}`);
      if (response.success) {
        // Filter out services that are already in the group
        const currentGroup = groups.find(g => g.id === groupId);
        const existingServiceIds = currentGroup?.group_services?.map(gs => gs.service_id) || [];
        const availableServices = response.data.filter((service: Service) =>
          !existingServiceIds.includes(service.id)
        );
        setAvailableServices(availableServices);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب الخدمات المتاحة",
        variant: "destructive",
      });
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Function to add services to group
  const handleAddServicesToGroup = async () => {
    if (!currentGroup || selectedServices.length === 0) return;

    try {
      const promises = selectedServices.map(serviceId =>
        addData("admin/group-services", {
          group_id: currentGroup.id,
          service_id: serviceId,
          salon_id: Number(salonId)
        })
      );

      await Promise.all(promises);

      await fetchGroups(); // Refresh groups data
      setIsAddServiceDialogOpen(false);
      setSelectedServices([]);
      toast({
        title: "تمت الإضافة بنجاح",
        description: `تم إضافة ${selectedServices.length} خدمة للمجموعة`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to add services to group:", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الخدمات للمجموعة",
        variant: "destructive",
      });
    }
  };

  // Function to remove service from group
  const handleRemoveServiceFromGroup = async (groupServiceId: number) => {
    try {
      const response = await deleteData(`admin/group-services/${groupServiceId}`);
      if (response.success) {
        await fetchGroups(); // Refresh groups data
        setCurrentGroup(
          (prev) => prev ? { ...prev, group_services: prev.group_services?.filter(gs => gs.id !== groupServiceId) } : null
        );
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الخدمة من المجموعة",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to remove service from group:", error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الخدمة من المجموعة",
        variant: "destructive",
      });

    }
  };

  // Function to view group services
  const handleViewGroupServices = (group: SalonGroup) => {
    setCurrentGroup(group);
    setIsServicesDialogOpen(true);
  };

  // Function to open add services dialog
  const handleOpenAddServices = (group: SalonGroup) => {
    setCurrentGroup(group);
    fetchAvailableServices(group.id);
    setIsAddServiceDialogOpen(true);
  };
  // DnD reorder handler - Enhanced with animations and better user experience
  const handleDndKitDragEnd = async (event: any) => {
    if (!event.active || !event.over) {
      setIsDragging(false);
      return;
    }

    const { active, over } = event;
    if (!over || active.id === over.id) {
      setIsDragging(false);
      return;
    }

    // Find indices and create the new array
    const oldIndex = groups.findIndex((g) => g.id === active.id);
    const newIndex = groups.findIndex((g) => g.id === over.id);
    if (oldIndex === -1 || newIndex === -1) {
      setIsDragging(false);
      return;
    }

    // Update UI immediately for better user experience
    setGroups((prevGroups) => arrayMove([...prevGroups], oldIndex, newIndex));

    // تحديد orders الجديد (من العنصر الذي سنأخذ مكانه)
    const newGroups = arrayMove([...groups], oldIndex, newIndex);
    let newOrdersValue: any = null;
    if (newIndex === 0 && newGroups.length > 1) {
      newOrdersValue = newGroups[1]?.orders ?? null;
    } else if (newIndex > 0) {
      newOrdersValue = newGroups[newIndex - 1]?.orders ?? null;
    }

    const reorderBody = { orders: newOrdersValue };
    try {
      await addData(`admin/groups/${active.id}/reorder`, reorderBody);
      setIsDragging(false);
      // toast({
      //   title: "تم تحديث الترتيب",
      //   description: "تم تحديث ترتيب المجموعات بنجاح",
      //   variant: "default",
      // });
    } catch (error) {
      // Revert to original order on error
      await fetchGroups(); // Reload from server
      toast({
        title: "خطأ في الترتيب",
        description: "حدث خطأ أثناء تحديث الترتيب",
        variant: "destructive",
      });
      setIsDragging(false);
    }
  };

  // عند بدء السحب - with feedback
  const handleDragStart = () => {
    setIsDragging(true);
    // Add haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // اهتزاز خفيف على الأجهزة المحمولة
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">مجموعات المزود</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة مجموعة
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="البحث عن مجموعات..."
            className="w-full pl-8 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-2 text-muted-foreground">جاري تحميل المجموعات...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">لا توجد مجموعات متاحة</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة مجموعة جديدة
          </Button>
        </div>
      ) : (<DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDndKitDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={groups.map((g) => g.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={`rounded-md border bg-white relative overflow-hidden ${isDragging ? 'cursor-grabbing' : ''}`}>
            {isDragging && (
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-primary/30 bg-primary/5 rounded-md"></div>
            )}
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className={isDragging ? 'relative z-10 bg-white' : ''}>
                    <TableHead className="w-[200px] min-w-[200px]">اسم المجموعة</TableHead>
                    {groups.some(g => g.orders !== undefined) && <TableHead className="w-[80px] min-w-[80px]">الترتيب</TableHead>}
                    <TableHead className="w-[400px] min-w-[400px]">الخدمات</TableHead>
                    <TableHead className="w-[120px] min-w-[120px]">تاريخ الإنشاء</TableHead>
                    <TableHead className="w-[180px] min-w-[180px]">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <SortableGroupRow
                      key={group.id}
                      group={group}
                      onEdit={() => {
                        setCurrentGroup(group);
                        setIsEditDialogOpen(true);
                      }}
                      onDelete={() => {
                        setCurrentGroup(group);
                        setIsDeleteDialogOpen(true);
                      }}
                      onViewServices={() => handleViewGroupServices(group)}
                      onAddServices={() => handleOpenAddServices(group)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SortableContext>
      </DndContext>
      )}

      {!isLoading && groups.length > 0 && totalPages > 1 && (
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

      {/* Add Group Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة مجموعة جديدة</DialogTitle>
            <DialogDescription>
              قم بإدخال تفاصيل المجموعة الجديدة للمزود
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGroup}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name-ar">اسم المجموعة</Label>
                <Input id="name-ar" name="name_ar" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name-en">اسم المجموعة (بالإنجليزية)</Label>
                <Input id="name-en" name="name_en" required />
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
              <Button type="submit">إضافة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل المجموعة</DialogTitle>
            <DialogDescription>قم بتعديل تفاصيل المجموعة</DialogDescription>
          </DialogHeader>
          {currentGroup && (
            <form onSubmit={handleEditGroup}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">اسم المجموعة</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={currentGroup.name.ar}
                    placeholder="اسم المجموعة"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-name-en">
                    اسم المجموعة (بالإنجليزية)
                  </Label>
                  <Input
                    id="edit-name-en"
                    name="name_en"
                    defaultValue={currentGroup.name.en}
                    placeholder="اسم المجموعة بالإنجليزية"
                    required
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

      {/* Delete Group Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المجموعة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذه المجموعة؟
              {currentGroup && <strong> {currentGroup.name.ar}</strong>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Group Services Dialog */}
      <Dialog open={isServicesDialogOpen} onOpenChange={setIsServicesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              خدمات المجموعة: {currentGroup?.name.ar}
            </DialogTitle>
            <DialogDescription>
              قائمة بجميع الخدمات المضافة لهذه المجموعة
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {currentGroup?.group_services && currentGroup.group_services.length > 0 ? (
              <div className="grid gap-4">
                {currentGroup.group_services.map((groupService) => (
                  <Card key={groupService.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 rounded-lg">
                          <AvatarImage
                            src={groupService.service.icon_url}
                            alt={groupService.service.name.ar}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {groupService.service.name.ar.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900">
                                {groupService.service.name.ar}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {groupService.service.name.en}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveServiceFromGroup(groupService.id)}
                              className="hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="حذف من المجموعة"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {groupService.service.description.ar}
                          </p>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-semibold">{groupService.service.final_price} {groupService.service.currency}</span>
                              {groupService.service.discount_percentage !== "0.00" && (
                                <span className="text-gray-500 line-through text-xs">
                                  {groupService.service.price}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                              <Clock className="h-4 w-4" />
                              <span>{groupService.service.duration_minutes} دقيقة</span>
                            </div>
                            <div className="flex items-center gap-1 text-purple-600">
                              <Users className="h-4 w-4" />
                              <span>سعة {groupService.service.capacity}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={groupService.service.is_active ? "default" : "secondary"}
                              className={groupService.service.is_active ? "bg-green-100 text-green-800" : ""}
                            >
                              {groupService.service.is_active ? "نشط" : "غير نشط"}
                            </Badge>
                            {groupService.service.discount_percentage !== "0.00" && (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">
                                خصم {groupService.service.discount_percentage}%
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {groupService.service.gender === "both" ? "للجميع" :
                                groupService.service.gender === "male" ? "رجال" : "نساء"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">لا توجد خدمات مضافة لهذه المجموعة</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsServicesDialogOpen(false);
                    if (currentGroup) handleOpenAddServices(currentGroup);
                  }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة خدمات
                </Button>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsServicesDialogOpen(false)}
            >
              إغلاق
            </Button>
            <Button
              onClick={() => {
                setIsServicesDialogOpen(false);
                if (currentGroup) handleOpenAddServices(currentGroup);
              }}
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة المزيد من الخدمات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Services to Group Dialog */}
      <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              إضافة خدمات للمجموعة: {currentGroup?.name.ar}
            </DialogTitle>
            <DialogDescription>
              اختر الخدمات التي تريد إضافتها لهذه المجموعة
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {selectedServices.length} خدمة محددة
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedServices(availableServices.map(s => s.id))}
                disabled={selectedServices.length === availableServices.length}
              >
                تحديد الكل
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedServices([])}
                disabled={selectedServices.length === 0}
              >
                إلغاء التحديد
              </Button>
            </div>
          </div>

          <ScrollArea className="max-h-[50vh] pr-4">
            {isLoadingServices ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="mt-2 text-muted-foreground">جاري تحميل الخدمات...</p>
              </div>
            ) : availableServices.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">جميع الخدمات مضافة بالفعل لهذه المجموعة</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {availableServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedServices.includes(service.id)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-gray-50'
                      }`}
                    onClick={() => {
                      setSelectedServices(prev =>
                        prev.includes(service.id)
                          ? prev.filter(id => id !== service.id)
                          : [...prev, service.id]
                      );
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onChange={() => { }}
                          className="mt-1"
                        />

                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarImage
                            src={service.icon_url}
                            alt={service.name.ar}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {service.name.ar.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {service.name.ar}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {service.name.en}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-medium">{service.final_price} {service.currency}</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                              <Clock className="h-3 w-3" />
                              <span>{service.duration_minutes}د</span>
                            </div>
                            <div className="flex items-center gap-1 text-purple-600">
                              <Users className="h-3 w-3" />
                              <span>{service.capacity}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Badge
                              variant={service.is_active ? "default" : "secondary"}
                              className={`text-xs ${service.is_active ? "bg-green-100 text-green-800" : ""}`}
                            >
                              {service.is_active ? "نشط" : "غير نشط"}
                            </Badge>
                            {service.discount_percentage !== "0.00" && (
                              <Badge variant="destructive" className="text-xs bg-red-100 text-red-800">
                                خصم {service.discount_percentage}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddServiceDialogOpen(false);
                setSelectedServices([]);
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAddServicesToGroup}
              disabled={selectedServices.length === 0}
            >
              <Check className="h-4 w-4 ml-2" />
              إضافة {selectedServices.length > 0 && `(${selectedServices.length})`} خدمات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
