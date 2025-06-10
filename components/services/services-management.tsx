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
import { se } from "date-fns/locale";
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

interface ServiceGroup {
  id: number;
  orders?: any[]; // Assuming orders is an array, adjust type as needed
  name: {
    en: string;
    ar: string;
  };
  salon_id: number;
}

export default function ServicesManagement() {
  // بيانات نموذجية للخدمات

  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("both");
  const [selectedStatus, setSelectedStatus] = useState<string>("groups");
  const [activeTab, setActiveTab] = useState("groups");
  const perPage = 10; // عدد العناصر في كل صفحة
  // Add new state for salons
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
      const response = await fetchData(
        `admin/groups?page=${groupCurrentPage}&limit=${perPage}&search=${searchTerm}`
      );
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

  // منع جلب البيانات أثناء السحب
  const [isDragging, setIsDragging] = useState(false);

  // Add group management functions
  const handleAddGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newGroup = {
      // salon_id: Number(formData.get("salon_id")),
      salon_id: "",
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
      salon_id: "",
      name: {
        en: formData.get("name_en") as string,
        ar: formData.get("name_ar") as string,
      },
    };

    try {
      const response = await updateData(
        `admin/groups/${editingGroup.id}`,
        updatedGroup
      );
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

  // sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // دالة تغيير ترتيب المجموعات dnd-kit
  const handleDndKitDragEnd = async (event: any) => {
    if (!event.active || !event.over) {
      return;
    }

    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = groups.findIndex((g) => g.id === active.id);
    const newIndex = groups.findIndex((g) => g.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newGroups = arrayMove(groups, oldIndex, newIndex);
    // تحديد orders الجديد (من العنصر الذي سنأخذ مكانه)
    let newOrdersValue: any = null;
    if (newIndex === 0 && newGroups.length > 1) {
      newOrdersValue = newGroups[1].orders;
    } else if (newIndex > 0) {
      newOrdersValue = newGroups[newIndex - 1].orders;
    }
    const reorderBody = { orders: newOrdersValue };
    try {
      await addData(`admin/groups/${active.id}/reorder`, reorderBody);
      setGroups(newGroups);
      setIsDragging(false);
    } catch (error) {
      toast({
        title: "خطأ في الترتيب",
        description: "حدث خطأ أثناء تحديث الترتيب",
        variant: "destructive",
      });
    }
  };

  // عند بدء السحب
  const handleDragStart = () => setIsDragging(true);

  // Update the useEffect to fetch groups
  useEffect(() => {
    if (!isDragging) fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupCurrentPage]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {activeTab === "groups" ? "إدارة المجموعات" : "إدارة الخدمات"}
        </h1>
        <Button
          onClick={() =>
            activeTab === "groups"
              ? setIsAddGroupDialogOpen(true)
              : null
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
            placeholder={
              activeTab === "groups" ? "بحث في المجموعات" : "بحث في الخدمات"
            }
            className="pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === "all" && (
          <>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
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
        )}
      </div>

      <Tabs
        defaultValue="groups"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsContent value="groups" className="mt-4">
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDndKitDragEnd}
            >
              <SortableContext
                items={groups.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-4">
                  {groups.map((group, idx) => (
                    <SortableGroupCard
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
                      index={idx}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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

      </Tabs>
      {/* Add Group Dialog */}
      <Dialog
        open={isAddGroupDialogOpen}
        onOpenChange={setIsAddGroupDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة مجموعة جديدة</DialogTitle>
            <DialogDescription>أدخل تفاصيل المجموعة الجديدة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGroup}>
            <div className="grid gap-4 py-4">
              {/* <div className="space-y-2">
                <Label htmlFor="salon_id">المزود</Label>
                <Select name="salon_id" defaultValue="5">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المزود" />
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddGroupDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">إضافة المجموعة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog
        open={isEditGroupDialogOpen}
        onOpenChange={setIsEditGroupDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل المجموعة</DialogTitle>
            <DialogDescription>تعديل تفاصيل المجموعة</DialogDescription>
          </DialogHeader>
          {editingGroup && (
            <form onSubmit={handleEditGroup}>
              <div className="grid gap-4 py-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="salon_id">المزود</Label>
                  <Select name="salon_id" defaultValue={editingGroup.salon_id.toString()}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر المزود" />
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
      <Dialog
        open={isDeleteGroupDialogOpen}
        onOpenChange={setIsDeleteGroupDialogOpen}
      >
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

    </div>
  );
}


interface GroupCardProps {
  group: ServiceGroup;
  onEdit: () => void;
  onDelete: () => void;
}

function GroupCard({ group, onEdit, onDelete, dragHandleProps }: GroupCardProps & { dragHandleProps?: React.HTMLAttributes<HTMLDivElement> }) {
  return (
    <Card className="h-full flex flex-col select-none">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex flex-col flex-1">
            <div className="flex items-center w-full mb-1">
              {/* Drag handle */}
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing mr-2 p-1 rounded hover:bg-muted transition"
                title="اسحب لتحريك المجموعة"
                style={{ userSelect: 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><circle cx="5" cy="6" r="1.5" /><circle cx="5" cy="10" r="1.5" /><circle cx="5" cy="14" r="1.5" /><circle cx="10" cy="6" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="10" cy="14" r="1.5" /></svg>
              </div>
              <CardTitle className="text-lg flex justify-between items-center w-full">
                <span className="font-bold">{group.name.ar}</span>
                {/* <Badge className="ml-2 " variant="secondary">
                  {group.orders} الترتيب
                </Badge> */}
              </CardTitle>
            </div>
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

function SortableGroupCard({ group, onEdit, onDelete, index }: { group: ServiceGroup, onEdit: () => void, onDelete: () => void, index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? '0 0 10px #aaa' : undefined,
    minWidth: '300px',
    margin: '8px',
    userSelect: 'none',
    background: isDragging ? '#f9fafb' : undefined,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div ref={setNodeRef} style={{ ...style, userSelect: 'none' as any }} {...attributes}>
      <GroupCard
        group={group}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={listeners}
      />
    </div>
  );
}
