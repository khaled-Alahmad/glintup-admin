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
import { Edit, Plus, Trash2, XCircle } from "lucide-react";
import { PaginationWithInfo } from "../ui/pagination-with-info";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SalonCoupon {
  id: number;
  code: string;
  salon_id: number;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  discount_label: string;
  max_uses: number;
  max_uses_per_user: number;
  start_date: string;
  end_date: string;
  min_age?: number;
  max_age?: number;
  gender?: "male" | "female" | "both";
  is_active: boolean;
  is_expired: boolean;
  is_valid: boolean;
}

interface SalonCouponsProps {
  salonId: string;
}

export default function SalonCoupons({ salonId }: SalonCouponsProps) {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<SalonCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<SalonCoupon | null>(null);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `admin/coupons?salon_id=${salonId}&page=${currentPage}&limit=${perPage}`
      );
      if (response.success) {
        setCoupons(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setPerPage(response.meta.per_page);
        setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب الكوبونات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCoupons();
  }, [currentPage, salonId]);
  const handleAddCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newCoupon = {
      salon_id: Number(salonId),
      code: formData.get("code") as string,
      discount_type: formData.get("discount_type") as "fixed" | "percentage",
      discount_value: Number(formData.get("discount_value")),
      max_uses: Number(formData.get("max_uses")),
      max_uses_per_user: Number(formData.get("max_uses_per_user")),
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      min_age: formData.get("min_age")
        ? Number(formData.get("min_age"))
        : undefined,
      max_age: formData.get("max_age")
        ? Number(formData.get("max_age"))
        : undefined,
      gender: formData.get("gender") as "male" | "female" | "both" | undefined,
      is_active: true,
    };

    try {
      const response = await addData("admin/coupons", newCoupon);
      if (response.success) {
        await fetchCoupons();
        setIsAddDialogOpen(false);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة الكوبون بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to add coupon:", error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة الكوبون",
        variant: "destructive",
      });
    }
  };

  const handleEditCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCoupon) return;

    const formData = new FormData(e.currentTarget);

    const updatedCoupon = {
      salon_id: Number(salonId),
      code: formData.get("code") as string,
      discount_type: formData.get("discount_type") as "fixed" | "percentage",
      discount_value: Number(formData.get("discount_value")),
      max_uses: Number(formData.get("max_uses")),
      max_uses_per_user: Number(formData.get("max_uses_per_user")),
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      min_age: formData.get("min_age")
        ? Number(formData.get("min_age"))
        : undefined,
      max_age: formData.get("max_age")
        ? Number(formData.get("max_age"))
        : undefined,
      gender: formData.get("gender") as "male" | "female" | "both" | undefined,
      is_active: formData.get("is_active") === "true",
    };

    try {
      const response = await updateData(
        `admin/coupons/${editingCoupon.id}`,
        updatedCoupon
      );
      if (response.success) {
        await fetchCoupons();
        setIsEditDialogOpen(false);
        setEditingCoupon(null);
        toast({
          title: "تم التعديل بنجاح",
          description: "تم تعديل الكوبون بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to update coupon:", error);
      toast({
        title: "خطأ في التعديل",
        description: "حدث خطأ أثناء تعديل الكوبون",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCoupon = async () => {
    if (!editingCoupon) return;

    try {
      const response = await deleteData(`admin/coupons/${editingCoupon.id}`);
      if (response.success) {
        await fetchCoupons();
        setIsDeleteDialogOpen(false);
        setEditingCoupon(null);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الكوبون بنجاح",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to delete coupon:", error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الكوبون",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">كوبونات الخصم</h3>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة كوبون
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>نوع الخصم</TableHead>
                <TableHead>قيمة الخصم</TableHead>
                <TableHead>الحد الأقصى للاستخدام</TableHead>
                <TableHead>تاريخ البداية</TableHead>
                <TableHead>تاريخ النهاية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      <p className="text-sm text-muted-foreground">
                        جاري تحميل الكوبونات...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      لا توجد كوبونات
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>
                      {coupon.discount_type === "fixed"
                        ? "مبلغ ثابت"
                        : "نسبة مئوية"}
                    </TableCell>
                    <TableCell>{coupon.discount_label}</TableCell>
                    <TableCell>{coupon.max_uses}</TableCell>
                    <TableCell>
                      {new Date(coupon.start_date).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      {new Date(coupon.end_date).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      {coupon.is_expired ? (
                        <Badge variant="secondary">منتهي</Badge>
                      ) : coupon.is_active ? (
                        <Badge variant="default">نشط</Badge>
                      ) : (
                        <Badge variant="destructive">غير نشط</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCoupon(coupon);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => {
                            setEditingCoupon(coupon);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
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

      {/* Dialog for adding new coupon */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة كوبون جديد</DialogTitle>
            <DialogDescription>أدخل تفاصيل الكوبون الجديد</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCoupon}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">كود الكوبون</Label>
                <Input id="code" name="code" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_type">نوع الخصم</Label>
                  <Select name="discount_type" defaultValue="fixed">
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الخصم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                      <SelectItem value="percentage">نسبة مئوية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_value">قيمة الخصم</Label>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_uses">الحد الأقصى للاستخدام</Label>
                  <Input
                    id="max_uses"
                    name="max_uses"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_uses_per_user">
                    الحد الأقصى لكل مستخدم
                  </Label>
                  <Input
                    id="max_uses_per_user"
                    name="max_uses_per_user"
                    type="number"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">تاريخ البداية</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="datetime-local"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">تاريخ النهاية</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_age">الحد الأدنى للعمر</Label>
                  <Input id="min_age" name="min_age" type="number" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_age">الحد الأقصى للعمر</Label>
                  <Input id="max_age" name="max_age" type="number" min="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <Select name="gender">
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                    {/* <SelectItem value="both">الجميع</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">إضافة الكوبون</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing coupon */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الكوبون</DialogTitle>
            <DialogDescription>تعديل تفاصيل الكوبون</DialogDescription>
          </DialogHeader>
          {editingCoupon && (
            <form onSubmit={handleEditCoupon}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">كود الكوبون</Label>
                  <Input
                    id="code"
                    name="code"
                    defaultValue={editingCoupon.code}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount_type">نوع الخصم</Label>
                    <Select
                      name="discount_type"
                      defaultValue={editingCoupon.discount_type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الخصم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                        <SelectItem value="percentage">نسبة مئوية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount_value">قيمة الخصم</Label>
                    <Input
                      id="discount_value"
                      name="discount_value"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={editingCoupon.discount_value}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_uses">الحد الأقصى للاستخدام</Label>
                    <Input
                      id="max_uses"
                      name="max_uses"
                      type="number"
                      min="1"
                      defaultValue={editingCoupon.max_uses}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_uses_per_user">
                      الحد الأقصى لكل مستخدم
                    </Label>
                    <Input
                      id="max_uses_per_user"
                      name="max_uses_per_user"
                      type="number"
                      min="1"
                      defaultValue={editingCoupon.max_uses_per_user}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">تاريخ البداية</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="datetime-local"
                      defaultValue={editingCoupon.start_date}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">تاريخ النهاية</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="datetime-local"
                      defaultValue={editingCoupon.end_date}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_age">الحد الأدنى للعمر</Label>
                    <Input
                      id="min_age"
                      name="min_age"
                      type="number"
                      min="0"
                      defaultValue={editingCoupon.min_age}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_age">الحد الأقصى للعمر</Label>
                    <Input
                      id="max_age"
                      name="max_age"
                      type="number"
                      min="0"
                      defaultValue={editingCoupon.max_age}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">الجنس</Label>
                  <Select name="gender" defaultValue={editingCoupon.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                      {/* <SelectItem value="both">الجميع</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_active">الحالة</Label>
                  <Select
                    name="is_active"
                    defaultValue={editingCoupon.is_active.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">نشط</SelectItem>
                      <SelectItem value="false">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
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

      {/* Dialog for deleting coupon */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف الكوبون</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الكوبون؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
