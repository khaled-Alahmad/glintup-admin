"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  CreditCard,
  Lock,
  MoreVertical,
  Palette,
  Percent,
  Plus,
  Save,
  Settings,
  Smartphone,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addData, deleteData, fetchData } from "@/lib/apiHelper";
import { useToast } from "../ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
interface SocialMediaSite {
  id: number;
  name: {
    en: string;
    ar: string | null;
  };
  icon: string;
  icon_url: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [socialMediaSites, setSocialMediaSites] = useState<SocialMediaSite[]>([]);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [editingSite, setEditingSite] = useState<SocialMediaSite | null>(null);
  const { toast } = useToast();
  const [uploadedIcon, setUploadedIcon] = useState<string | null>(null);
  const [iconName, setIconName] = useState<string>('');
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview


      // Upload to API
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', "salons");

      try {
        const response = await addData('general/upload-image', formData);
        // const data = await response.data;
        if (response.success) {
          setIconName(response.data.image_name);
          setUploadedIcon(response.data.image_url);
          // toast({
          //   title: "Success",
          //   description: "Icon uploaded successfully",
          // });
        }
      } catch (error) {
        console.error('Failed to upload icon:', error);
        toast({
          title: "Error",
          description: "Failed to upload icon",
          variant: "destructive",
        });
      }
    }
  };
  // Add this effect to fetch social media sites
  useEffect(() => {
    const fetchSocialSites = async () => {
      try {
        const response = await fetchData('admin/social-media-sites');
        if (response.success) {
          setSocialMediaSites(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch social media sites:', error);
      }
    };
    fetchSocialSites();
  }, []);

  // Add these handler functions

  const handleAddSite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {


      const siteData = {
        name: {
          en: formData.get('name_en'),
          ar: formData.get('name_ar')
        },
        icon: iconName
      };

      const response = await addData('admin/social-media-sites', siteData);
      if (response.success) {
        setSocialMediaSites([...socialMediaSites, response.data]);
        setIsAddingSite(false);
        setUploadedIcon(null);
        setIconName('');
        toast({
          title: "Success",
          description: "Social media site added successfully",
        });
      }
    } catch (error) {
      console.error('Failed to add social media site:', error);
      toast({
        title: "Error",
        description: "Failed to add social media site",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-heading">
          إعدادات النظام
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow-md md:row-span-2">
          <CardHeader>
            <CardTitle>الإعدادات</CardTitle>
            <CardDescription>إدارة إعدادات النظام</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="flex flex-col space-y-1 px-2">
              <Button
                variant={activeTab === "general" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "general" ? "" : "hover:bg-muted"
                  }`}
                onClick={() => setActiveTab("general")}
              >
                <Settings className="h-4 w-4 ml-2" />
                إعدادات عامة
              </Button>
              <Button
                variant={activeTab === "appearance" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "appearance" ? "" : "hover:bg-muted"
                  }`}
                onClick={() => setActiveTab("appearance")}
              >
                <Palette className="h-4 w-4 ml-2" />
                المظهر
              </Button>
              <Button
                variant={activeTab === "commissions" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "commissions" ? "" : "hover:bg-muted"
                  }`}
                onClick={() => setActiveTab("commissions")}
              >
                <Percent className="h-4 w-4 ml-2" />
                العمولات
              </Button>
              <Button
                variant={activeTab === "app" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "app" ? "" : "hover:bg-muted"
                  }`}
                onClick={() => setActiveTab("app")}
              >
                <Smartphone className="h-4 w-4 ml-2" />
                إعدادات التطبيق
              </Button>
              <Button
                variant={activeTab === "social-media" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "social-media" ? "" : "hover:bg-muted"
                  }`}
                onClick={() => setActiveTab("social-media")}
              >
                <Settings className="h-4 w-4 ml-2" />
                مواقع التواصل الاجتماعي
              </Button>
            </nav>
          </CardContent>
        </Card>

        {activeTab === "general" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات عامة</CardTitle>
              <CardDescription>إدارة الإعدادات العامة للنظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">معلومات النظام</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">اسم التطبيق</Label>
                    <Input id="app-name" defaultValue="Glintup" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-url">رابط التطبيق</Label>
                    <Input id="app-url" defaultValue="https://glintup.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">
                      البريد الإلكتروني للإدارة
                    </Label>
                    <Input id="admin-email" defaultValue="admin@glintup.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">
                      البريد الإلكتروني للدعم
                    </Label>
                    <Input
                      id="support-email"
                      defaultValue="support@glintup.com"
                    />
                  </div>
                </div>
              </div>

              {/* <Separator /> */}

              {/* <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات اللغة والمنطقة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">اللغة الافتراضية</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="اختر اللغة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">الإنجليزية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">المنطقة الزمنية</Label>
                    <Select defaultValue="asia-riyadh">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="اختر المنطقة الزمنية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia-riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="asia-dubai">دبي (GMT+4)</SelectItem>
                        <SelectItem value="europe-london">لندن (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">تنسيق التاريخ</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="اختر تنسيق التاريخ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة الافتراضية</Label>
                    <Select defaultValue="sar">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sar">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="د.إ">درهم إماراتي (د.إ)</SelectItem>
                        <SelectItem value="usd">دولار أمريكي (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div> */}

              {/* <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات متقدمة</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">وضع الصيانة</Label>
                      <p className="text-sm text-muted-foreground">
                        تفعيل وضع الصيانة سيمنع المستخدمين من الوصول إلى التطبيق
                      </p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debug-mode">وضع التصحيح</Label>
                      <p className="text-sm text-muted-foreground">تفعيل وضع التصحيح سيظهر معلومات إضافية للمطورين</p>
                    </div>
                    <Switch className="switch-custom" id="debug-mode" />
                  </div>
                </div>
              </div> */}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "appearance" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات المظهر</CardTitle>
              <CardDescription>تخصيص مظهر النظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">السمة</h3>
                <RadioGroup
                  defaultValue="light"
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="light"
                      id="theme-light"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full rounded-md bg-[#f8fafc] border"></div>
                      <div className="text-center">
                        <p className="font-medium">فاتح</p>
                        <p className="text-sm text-muted-foreground">
                          سمة فاتحة للنظام
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="dark"
                      id="theme-dark"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full rounded-md bg-[#1e293b] border"></div>
                      <div className="text-center">
                        <p className="font-medium">داكن</p>
                        <p className="text-sm text-muted-foreground">
                          سمة داكنة للنظام
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="system"
                      id="theme-system"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full rounded-md bg-gradient-to-r from-[#f8fafc] to-[#1e293b] border"></div>
                      <div className="text-center">
                        <p className="font-medium">تلقائي</p>
                        <p className="text-sm text-muted-foreground">
                          يتبع إعدادات النظام
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">الألوان الأساسية</h3>
                <RadioGroup
                  defaultValue="blue"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="blue"
                      id="color-blue"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="color-blue"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-10 w-10 rounded-full bg-primary"></div>
                      <p className="font-medium">أزرق</p>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="purple"
                      id="color-purple"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="color-purple"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-10 w-10 rounded-full bg-purple-500"></div>
                      <p className="font-medium">أرجواني</p>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="green"
                      id="color-green"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="color-green"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-10 w-10 rounded-full bg-green-500"></div>
                      <p className="font-medium">أخضر</p>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="pink"
                      id="color-pink"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="color-pink"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-50 hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-10 w-10 rounded-full bg-pink-500"></div>
                      <p className="font-medium">وردي</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">الشعار</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">شعار التطبيق</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-muted">
                        <img
                          src="/placeholder.svg?height=64&width=64"
                          alt="شعار التطبيق"
                          className="h-12 w-12"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        تغيير الشعار
                      </Button>
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="favicon">أيقونة التطبيق</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md border flex items-center justify-center bg-muted">
                        <img src="/placeholder.svg?height=32&width=32" alt="أيقونة التطبيق" className="h-8 w-8" />
                      </div>
                      <Button variant="outline" size="sm">
                        تغيير الأيقونة
                      </Button>
                    </div>
                  </div> */}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                إدارة إعدادات الإشعارات في النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  إشعارات البريد الإلكتروني
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات الحجوزات الجديدة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند إنشاء حجز جديد
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات الشكاوى الجديدة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند تقديم شكوى جديدة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات التقييمات الجديدة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند إضافة تقييم جديد
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>التقارير الأسبوعية</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال تقرير أسبوعي بإحصائيات النظام
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إشعارات التطبيق</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات الحجوزات الجديدة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند إنشاء حجز جديد
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات الشكاوى الجديدة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند تقديم شكوى جديدة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات التقييمات الجديدة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند إضافة تقييم جديد
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات متقدمة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-provider">
                      مزود خدمة البريد الإلكتروني
                    </Label>
                    <Select defaultValue="smtp">
                      <SelectTrigger id="email-provider">
                        <SelectValue placeholder="اختر مزود الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="push-provider">مزود خدمة الإشعارات</Label>
                    <Select defaultValue="firebase">
                      <SelectTrigger id="push-provider">
                        <SelectValue placeholder="اختر مزود الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="firebase">Firebase</SelectItem>
                        <SelectItem value="onesignal">OneSignal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "users" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات المستخدمين</CardTitle>
              <CardDescription>
                إدارة إعدادات المستخدمين في النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات التسجيل</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تفعيل التسجيل</Label>
                      <p className="text-sm text-muted-foreground">
                        السماح للمستخدمين الجدد بالتسجيل في النظام
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تأكيد البريد الإلكتروني</Label>
                      <p className="text-sm text-muted-foreground">
                        طلب تأكيد البريد الإلكتروني عند التسجيل
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تسجيل الدخول بوسائل التواصل الاجتماعي</Label>
                      <p className="text-sm text-muted-foreground">
                        السماح بتسجيل الدخول عبر حسابات التواصل الاجتماعي
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات الحساب</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تغيير البريد الإلكتروني</Label>
                      <p className="text-sm text-muted-foreground">
                        السماح للمستخدمين بتغيير بريدهم الإلكتروني
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>حذف الحساب</Label>
                      <p className="text-sm text-muted-foreground">
                        السماح للمستخدمين بحذف حساباتهم
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات المشرفين</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-role">دور المشرف الافتراضي</Label>
                    <Select defaultValue="admin">
                      <SelectTrigger id="admin-role">
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super-admin">مشرف عام</SelectItem>
                        <SelectItem value="admin">مشرف</SelectItem>
                        <SelectItem value="moderator">مراقب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-access">صلاحيات المشرف</Label>
                    <Select defaultValue="full">
                      <SelectTrigger id="admin-access">
                        <SelectValue placeholder="اختر الصلاحيات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">كاملة</SelectItem>
                        <SelectItem value="limited">محدودة</SelectItem>
                        <SelectItem value="read-only">قراءة فقط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "security" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>إدارة إعدادات الأمان في النظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات كلمة المرور</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تفعيل المصادقة الثنائية</Label>
                      <p className="text-sm text-muted-foreground">
                        طلب رمز تحقق إضافي عند تسجيل الدخول
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تغيير كلمة المرور الدوري</Label>
                      <p className="text-sm text-muted-foreground">
                        طلب تغيير كلمة المرور كل 90 يوم
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-length">
                        الحد الأدنى لطول كلمة المرور
                      </Label>
                      <Select defaultValue="8">
                        <SelectTrigger id="password-length">
                          <SelectValue placeholder="اختر الطول" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 أحرف</SelectItem>
                          <SelectItem value="8">8 أحرف</SelectItem>
                          <SelectItem value="10">10 أحرف</SelectItem>
                          <SelectItem value="12">12 حرف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-complexity">
                        تعقيد كلمة المرور
                      </Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="password-complexity">
                          <SelectValue placeholder="اختر التعقيد" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفض</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="high">عالي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات الجلسة</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تسجيل الخروج التلقائي</Label>
                      <p className="text-sm text-muted-foreground">
                        تسجيل الخروج تلقائياً بعد فترة من عدم النشاط
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">مدة الجلسة</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="session-timeout">
                          <SelectValue placeholder="اختر المدة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 دقيقة</SelectItem>
                          <SelectItem value="30">30 دقيقة</SelectItem>
                          <SelectItem value="60">60 دقيقة</SelectItem>
                          <SelectItem value="120">120 دقيقة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remember-me">تذكرني</Label>
                      <Select defaultValue="7">
                        <SelectTrigger id="remember-me">
                          <SelectValue placeholder="اختر المدة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">يوم واحد</SelectItem>
                          <SelectItem value="7">7 أيام</SelectItem>
                          <SelectItem value="30">30 يوم</SelectItem>
                          <SelectItem value="90">90 يوم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات متقدمة</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>حماية من هجمات القوة الغاشمة</Label>
                      <p className="text-sm text-muted-foreground">
                        حظر المستخدم بعد عدة محاولات فاشلة لتسجيل الدخول
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تسجيل محاولات تسجيل الدخول</Label>
                      <p className="text-sm text-muted-foreground">
                        تسجيل جميع محاولات تسجيل الدخول الناجحة والفاشلة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "payments" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات المدفوعات</CardTitle>
              <CardDescription>
                إدارة إعدادات المدفوعات وبوابات الدفع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">بوابات الدفع</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>بطاقات الائتمان</Label>
                      <p className="text-sm text-muted-foreground">
                        قبول الدفع عن طريق بطاقات الائتمان
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Apple Pay</Label>
                      <p className="text-sm text-muted-foreground">
                        قبول الدفع عن طريق Apple Pay
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>مدى</Label>
                      <p className="text-sm text-muted-foreground">
                        قبول الدفع عن طريق بطاقات مدى
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>المحافظ الإلكترونية</Label>
                      <p className="text-sm text-muted-foreground">
                        قبول الدفع عن طريق المحافظ الإلكترونية
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">مزودي خدمات الدفع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-gateway">
                      بوابة الدفع الرئيسية
                    </Label>
                    <Select defaultValue="stripe">
                      <SelectTrigger id="payment-gateway">
                        <SelectValue placeholder="اختر بوابة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="payfort">PayFort</SelectItem>
                        <SelectItem value="hyperpay">HyperPay</SelectItem>
                        <SelectItem value="paytabs">PayTabs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-mode">وضع الدفع</Label>
                    <Select defaultValue="live">
                      <SelectTrigger id="payment-mode">
                        <SelectValue placeholder="اختر وضع الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">اختبار</SelectItem>
                        <SelectItem value="live">مباشر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات الفواتير</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-prefix">بادئة رقم الفاتورة</Label>
                    <Input id="invoice-prefix" defaultValue="INV-" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-footer">تذييل الفاتورة</Label>
                    <Input
                      id="invoice-footer"
                      defaultValue="شكراً لاستخدامكم خدمات Glintup"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">نسبة الضريبة</Label>
                    <Input id="tax-rate" defaultValue="15" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-due-days">
                      مدة استحقاق الفاتورة (بالأيام)
                    </Label>
                    <Input
                      id="invoice-due-days"
                      defaultValue="30"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات الاسترجاع</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>السماح بالاسترجاع التلقائي</Label>
                      <p className="text-sm text-muted-foreground">
                        السماح بالاسترجاع التلقائي للمدفوعات في حالات معينة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="refund-period">
                        فترة السماح للاسترجاع (بالأيام)
                      </Label>
                      <Input
                        id="refund-period"
                        defaultValue="14"
                        type="number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refund-policy">سياسة الاسترجاع</Label>
                      <Select defaultValue="partial">
                        <SelectTrigger id="refund-policy">
                          <SelectValue placeholder="اختر سياسة الاسترجاع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">استرجاع كامل</SelectItem>
                          <SelectItem value="partial">استرجاع جزئي</SelectItem>
                          <SelectItem value="none">لا يوجد استرجاع</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "commissions" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات العمولات</CardTitle>
              <CardDescription>
                إدارة إعدادات العمولات والمدفوعات للصالونات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">نسب العمولة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-commission">
                      نسبة العمولة Glintup (%)
                    </Label>
                    <Input
                      id="default-commission"
                      defaultValue="10"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premium-commission">
                      نسبة العمولة للحجز (%)
                    </Label>
                    <Input
                      id="premium-commission"
                      defaultValue="8"
                      type="number"
                    />
                  </div>
              
                </div>
              </div>
         
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "app" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات التطبيق</CardTitle>
              <CardDescription>
                إدارة إعدادات تطبيق الهاتف المحمول
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات عامة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-version">إصدار التطبيق الحالي</Label>
                    <Input id="app-version" defaultValue="1.2.0" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-version">
                      الحد الأدنى للإصدار المدعوم
                    </Label>
                    <Input id="min-version" defaultValue="1.0.0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="android-link">رابط تطبيق Android</Label>
                    <Input
                      id="android-link"
                      defaultValue="https://play.google.com/store/apps/details?id=com.glintup"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ios-link">رابط تطبيق iOS</Label>
                    <Input
                      id="ios-link"
                      defaultValue="https://apps.apple.com/app/glintup/id1234567890"
                    />
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}
        {activeTab === "social-media" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>مواقع التواصل الاجتماعي</CardTitle>
                  <CardDescription>إدارة مواقع التواصل الاجتماعي</CardDescription>
                </div>
                <Button onClick={() => setIsAddingSite(true)}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة موقع جديد
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isAddingSite && (
                <form onSubmit={handleAddSite} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name_en">الاسم (إنجليزي)</Label>
                      <Input id="name_en" name="name_en" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_ar">الاسم (عربي)</Label>
                      <Input id="name_ar" name="name_ar" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">الأيقونة</Label>
                    <Input id="icon"

                      onChange={handleIconUpload}
                      name="icon" type="file" accept="image/*" required />
                    {uploadedIcon && (
                      <div className="mt-2">
                        <img
                          src={uploadedIcon}
                          alt="Icon preview"
                          className="w-16 h-16 rounded object-cover border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsAddingSite(false);
                      setUploadedIcon(null);
                      setIconName('');
                    }}>
                      إلغاء
                    </Button>
                    <Button type="submit">حفظ</Button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialMediaSites.map((site) => (
                  <Card key={site.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <img
                            src={site.icon_url}
                            alt={site.name.en}
                            className="w-8 h-8 rounded"
                          />
                          <div>
                            <h4 className="font-medium">{site.name.ar || site.name.en}</h4>
                            <p className="text-sm text-muted-foreground">{site.name.en}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* <DropdownMenuItem onClick={() => setEditingSite(site)}>
                              تعديل
                            </DropdownMenuItem>
                            */}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={async () => {
                                if (confirm('هل أنت متأكد من حذف هذا الموقع؟')) {
                                  await deleteData(`admin/social-media-sites/${site.id}`);
                                  setSocialMediaSites(sites =>
                                    sites.filter(s => s.id !== site.id)
                                  );
                                }
                              }}
                            >
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
