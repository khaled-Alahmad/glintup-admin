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
import { Edit, Plus, Trash2, Search } from "lucide-react";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "@/components/ui/separator";

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

  const handleViewMembers = (group: SalonGroup) => {
    // Navigate to the group members page
    window.location.href = `/admin/groups/${group.id}/members?salon_id=${salonId}`;
  };
  if (groups.length === 0 && isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-2 text-muted-foreground">جاري تحميل المجموعات...</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">مجموعات الصالون</h2>
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
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المجموعة</TableHead>

                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name.ar}</TableCell>

                  <TableCell>
                    {new Date(group.created_at).toLocaleDateString("ar-EG")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewMembers(group)}
                      >
                        عرض الأعضاء
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentGroup(group);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">تعديل</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentGroup(group);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                        <span className="sr-only">حذف</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
              قم بإدخال تفاصيل المجموعة الجديدة للصالون
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
    </div>
  );
}
