"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, CalendarCheck2, DollarSign, Plus, Store, Users } from "lucide-react"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { TopSalons } from "@/components/dashboard/top-salons"

// Sample data for charts
const weeklyAppointments = [
  { name: "الأحد", total: 82 },
  { name: "الاثنين", total: 125 },
  { name: "الثلاثاء", total: 56 },
  { name: "الأربعاء", total: 138 },
  { name: "الخميس", total: 94 },
  { name: "الجمعة", total: 45 },
  { name: "السبت", total: 71 },
]

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
]

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-heading">لوحة المعلومات</h1>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="daily" className="w-fit">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="daily">يومي</TabsTrigger>
              <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
              <TabsTrigger value="monthly">شهري</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-blue-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">صالونات مسجلة</CardTitle>
            <Store className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-green-500 flex items-center text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                12%
              </span>
              منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مستخدمين مسجلين</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,532</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-green-500 flex items-center text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                18%
              </span>
              منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات اليوم</CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                108 مؤكد
              </Badge>
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                20 معلق
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card card-hover overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-pink-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22,458 ر.س</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-green-500 flex items-center text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                8%
              </span>
              منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات قيد التأكيد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات مكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">حجوزات ملغاة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">شكاوى جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إعلانات للمراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
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
          <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" />
            إضافة
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <Badge className="bg-blue-500 text-white border-0">مراجعة إعلانات</Badge>
                  <h4 className="font-medium mt-2">مراجعة 5 إعلانات جديدة</h4>
                </div>
                <div className="text-sm text-muted-foreground">24%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "24%" }}></div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <Badge className="bg-green-500 text-white border-0">شكاوى العملاء</Badge>
                  <h4 className="font-medium mt-2">الرد على 8 شكاوى جديدة</h4>
                </div>
                <div className="text-sm text-muted-foreground">65%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <Badge className="bg-purple-500 text-white border-0">تفعيل صالونات</Badge>
                  <h4 className="font-medium mt-2">مراجعة 3 طلبات تفعيل جديدة</h4>
                </div>
                <div className="text-sm text-muted-foreground">10%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "10%" }}></div>
              </div>
            </div>
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
              <BarChart data={weeklyAppointments}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
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
                <Bar dataKey="total" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
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
              <LineChart data={monthlySalonsRevenue}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} ر.س`}
                />
                <Tooltip
                  formatter={(value) => [`${value} ر.س`, "الإيرادات"]}
                  labelFormatter={(label) => `شهر ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ stroke: "#4f46e5", strokeWidth: 2, fill: "white", r: 4 }}
                  activeDot={{ stroke: "#4f46e5", strokeWidth: 2, fill: "#4f46e5", r: 6 }}
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
            <RecentAppointments />
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle>أفضل الصالونات</CardTitle>
            <CardDescription>الصالونات الأكثر حجزاً هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <TopSalons />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

