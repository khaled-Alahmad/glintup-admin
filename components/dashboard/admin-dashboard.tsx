"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Banknote,
  CalendarCheck2,
  DollarSign,
  Plus,
  Store,
  Users,
} from "lucide-react";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { TopSalons } from "@/components/dashboard/top-salons";
import { useEffect, useState } from "react";
import { addData, fetchData } from "@/lib/apiHelper";

// Sample data for charts
const weeklyAppointments = [
  { name: "الأحد", total: 82 },
  { name: "الاثنين", total: 125 },
  { name: "الثلاثاء", total: 56 },
  { name: "الأربعاء", total: 138 },
  { name: "الخميس", total: 94 },
  { name: "الجمعة", total: 45 },
  { name: "السبت", total: 71 },
];

const monthlySalonsRevenue = [
  {
    name: "يناير",
    total: 2400,
  },
  {
    name: "فبراير",
    total: 1398,
  },
  {
    name: "مارس",
    total: 9800,
  },
  {
    name: "أبريل",
    total: 3908,
  },
  {
    name: "مايو",
    total: 4800,
  },
  {
    name: "يونيو",
    total: 3800,
  },
  {
    name: "يوليو",
    total: 4300,
  },
];

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("daily");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [showDateRange, setShowDateRange] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      let url = `admin/dashboard?date=${dateFilter}`;
      
      // Add date range parameters if custom filter is selected
      if (dateFilter === "custom" && fromDate && toDate) {
        const fromDateStr = fromDate.toISOString().split('T')[0];
        const toDateStr = toDate.toISOString().split('T')[0];
        url = `admin/dashboard?date=${dateFilter}&from=${fromDateStr}&to=${toDateStr}`;
      }
      
      const response = await fetchData(url);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dateFilter === "custom") {
      setShowDateRange(true);
      // Only fetch data if both dates are selected
      if (fromDate && toDate) {
        fetchDashboardData();
      }
    } else {
      setShowDateRange(false);
      fetchDashboardData();
    }
  }, [dateFilter, fromDate, toDate]); // Add fromDate and toDate as dependencies
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Update the statistics cards
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-heading">
          لوحة المعلومات
        </h1>
        <div className="flex items-center gap-2">
          <Tabs
            value={dateFilter}
            onValueChange={setDateFilter}
            className="w-fit"
          >
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="daily">يومي</TabsTrigger>
              <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
              <TabsTrigger value="monthly">شهري</TabsTrigger>
              <TabsTrigger value="yearly">سنوي</TabsTrigger>
              <TabsTrigger value="custom">مخصص</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {showDateRange && (
            <div className="flex items-center gap-2 mr-2">
              <DatePicker
                selected={fromDate}
                onSelect={setFromDate}
                placeholder="من تاريخ"
              />
              <DatePicker
                selected={toDate}
                onSelect={setToDate}
                placeholder="إلى تاريخ"
                minDate={fromDate}
              />
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المزودين المسجلين</CardTitle>
            <Store className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.salons_registered_count}</div>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مستخدمين مسجلين</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.users_registered_count}</div>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات </CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.bookings.all_bookings_count}</div>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {dashboardData.bookings.confirmed_booking_count} مؤكد
              </Badge>
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                {dashboardData.bookings.pending_booking_count} معلق
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-pink-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <Banknote className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.total_revenue} AED</div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات قيد الإنتظار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.bookings.pending_booking_count}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات مكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.bookings.completed_booking_count}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات ملغاة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.bookings.canceled_booking_count}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">شكاوى جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.new_complaints_count}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إعلانات للمراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.ads_count}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick To-Do List */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>المهام السريعة</CardTitle>
            <CardDescription>المهام التي تحتاج إلى اهتمامك</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <Badge className="bg-primary text-white border-0">مراجعة إعلانات</Badge>
                  <h4 className="font-medium mt-2">
                    مراجعة {dashboardData.fast_tasks.ads.ads_review_count} إعلانات جديدة
                  </h4>
                </div>
                <div className="text-sm text-muted-foreground">
                  {dashboardData.fast_tasks.ads.review_percentage}%
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${dashboardData.fast_tasks.ads.review_percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <Badge className="bg-green-500 text-white border-0">شكاوى العملاء</Badge>
                  <h4 className="font-medium mt-2">الرد على{dashboardData.fast_tasks.complaints.complaints_review_count} شكاوى جديدة</h4>
                </div>
                <div className="text-sm text-muted-foreground">
                  {dashboardData.fast_tasks.complaints.review_percentage}%
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${dashboardData.fast_tasks.complaints.review_percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <Badge className="bg-purple-500 text-white border-0">تفعيل مزودات</Badge>
                  <h4 className="font-medium mt-2">مراجعة {dashboardData.fast_tasks.salons.salons_review_count} طلبات تفعيل جديدة</h4>
                </div>
                <div className="text-sm text-muted-foreground">
                  {dashboardData.fast_tasks.salons.review_percentage}%
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${dashboardData.fast_tasks.salons.review_percentage}%` }}></div>
              </div>
            </div>
            {/* ... similar updates for complaints and salons tasks ... */}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle>الحجوزات الأسبوعية</CardTitle>
            <CardDescription>عدد الحجوزات التي تمت خلال الأسبوع الحالي</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardData.weekly_appointments}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value) => [`${value} حجز`, "الحجوزات"]}
                  labelFormatter={(label) => `يوم ${label}`}
                />
                <Bar
                  dataKey="total"
                  fill="url(#colorGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle>الإيرادات الشهرية</CardTitle>
            <CardDescription>إجمالي الإيرادات التي تم تحقيقها شهرياً</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData.monthly_salons_revenue}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} AED`}
                />
                <Tooltip
                  formatter={(value) => [`${value} AED`, "الإيرادات"]}
                  labelFormatter={(label) => `شهر ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{
                    stroke: "#4f46e5",
                    strokeWidth: 2,
                    fill: "white",
                    r: 4,
                  }}
                  activeDot={{
                    stroke: "#4f46e5",
                    strokeWidth: 2,
                    fill: "#4f46e5",
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle>أحدث الحجوزات</CardTitle>
            <CardDescription>أحدث 5 حجوزات في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAppointments appointments={dashboardData.last_bookings} />
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle>أفضل المزودين</CardTitle>
            <CardDescription>المزودين الأكثر حجزاً هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <TopSalons salons={dashboardData.bset_salons} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
