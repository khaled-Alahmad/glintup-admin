"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, MoreHorizontal, Search, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { fetchData, updateData } from "@/lib/apiHelper"
import { useToast } from "../ui/use-toast"
import { PaginationWithInfo } from "../ui/pagination-with-info"


interface UserInfo {
  all_count: number;
  active_count: number;
  unactive_count: number;
  average_spending: number;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  balance: number;
  full_phone: string;
  gender: string;
  birth_date: string;
  age: string;
  avatar: string | null;
  phone_code: string;
  phone: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
export default function UsersManagement() {

  const [users, setUsers] = useState<User[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const { toast } = useToast()
  const [totalItems, setTotalItems] = useState(0)

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: perPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { is_active: statusFilter === 'نشط' ? '1' : '0' }),
      });

      const response = await fetchData(`admin/users?${queryParams}`);
      if (response.success) {
        setUsers(response.data);
        setUserInfo(response.info);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
        setTotalItems(response.meta.total)

        setPerPage(response.meta.per_page);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter, searchQuery]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            نشط
          </Badge>
        )
      case "محظور":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            محظور
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  const handleStatusUpdate = async (userId: number, newStatus: boolean) => {
    try {
      const response = await updateData(`admin/users/${userId}`, {
        is_active: newStatus
      });
      if (response.success) {
        toast({
          title: "Success",
          description: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
        <Button asChild>
          <Link href="/users/add">
            <UserPlus className="h-4 w-4 ml-2" />
            إضافة مستخدم
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userInfo?.all_count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مستخدمين نشطين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userInfo?.active_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {userInfo ? `${((userInfo.active_count / userInfo.all_count) * 100).toFixed(1)}% من إجمالي المستخدمين` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مستخدمين محظورين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userInfo?.unactive_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {userInfo ? `${((userInfo.unactive_count / userInfo.all_count) * 100).toFixed(1)}% من إجمالي المستخدمين` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط الإنفاق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userInfo?.average_spending.toFixed(2) || 0} د.إ</div>
            <p className="text-xs text-muted-foreground mt-1">لكل مستخدم</p>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>المستخدمين</CardTitle>
                <CardDescription>قائمة بجميع المستخدمين المسجلين في النظام</CardDescription>
              </div>
              {/* <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="blocked">محظور</TabsTrigger>
              </TabsList> */}
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث عن المستخدمين..."
                  className="pr-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="جميع الحالات" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="محظور">محظور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>التواصل</TableHead>
                    <TableHead>الرصيد</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`loading-${index}`} className="animate-pulse">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-muted"></div>
                            <div>
                              <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                              <div className="h-3 w-16 bg-muted rounded"></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><div className="h-4 w-32 bg-muted rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-20 bg-muted rounded"></div></TableCell>
                        <TableCell><div className="h-6 w-16 bg-muted rounded-full"></div></TableCell>
                        <TableCell><div className="h-4 w-24 bg-muted rounded"></div></TableCell>
                        <TableCell><div className="h-8 w-8 bg-muted rounded"></div></TableCell>
                      </TableRow>
                    ))
                  ) :
                    users && users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-muted-foreground">لا يوجد مستخدمين مسجلين</p>
                            <Button asChild variant="link" className="gap-1">
                              <Link href="/users/add">
                                إضافة مستخدم جديد
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) :
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar || ''} alt={user.full_name} />
                                <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.full_name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(user.created_at).toLocaleDateString("en-US")}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs text-right" style={{ unicodeBidi: "plaintext" }}>{user.full_phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.balance} د.إ</TableCell>
                          <TableCell>
                            {getStatusBadge(user.is_active ? 'نشط' : 'محظور')}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString("en-US")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/users/${user.id}`}>عرض التفاصيل</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/users/${user.id}/edit`}>تعديل البيانات</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.is_active ? (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleStatusUpdate(user.id, false)}
                                  >
                                    حظر المستخدم
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() => handleStatusUpdate(user.id, true)}
                                  >
                                    إلغاء الحظر
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}

                </TableBody>

              </Table>
            </div>
            {!isLoading && users.length > 0 && totalPages > 1 && (
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
  )
}

