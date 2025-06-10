"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
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
import "react-international-phone/style.css";

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
import { addData, deleteData, fetchData, updateData } from "@/lib/apiHelper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PhoneInput } from "react-international-phone";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
interface SocialMediaSite {
  id: number;
  name: {
    en: string;
    ar: string | null;
  };
  icon: string;
  icon_url: string;
}
interface Setting {
  id: number;
  key: string;
  value: string | null;
  type: "text" | "float";
  allow_null: boolean;
  is_settings: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [socialMediaSites, setSocialMediaSites] = useState<SocialMediaSite[]>(
    []
  );
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [editingSite, setEditingSite] = useState<SocialMediaSite | null>(null);
  const { toast } = useToast();
  const [uploadedIcon, setUploadedIcon] = useState<string | null>(null);
  const [iconName, setIconName] = useState<string>("");
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Add this effect to fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData("admin/settings?limit=100");
        if (response.success) {
          setSettings(response.data);
          // Initialize form data
          const initialData: Record<string, string> = {};
          response.data.forEach((setting: Setting) => {
            initialData[setting.key] = setting.value || "";
          });
          setFormData(initialData);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Add this handler for input changes
  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Add this handler for form submission
  const handleSaveSettings = async () => {
    try {
      const changedSettings = Object.entries(formData)
        .filter(([key, value]) => {
          const originalSetting = settings.find((s) => s.key === key);
          // Treat empty string as null for comparison
          const originalValue = originalSetting?.value ?? "";
          const currentValue = value ?? "";
          return originalSetting && originalValue !== currentValue;
        })
        .map(([key, value]) => ({
          key,
          value: value === "" ? null : value,
        }));

      if (changedSettings.length === 0) {
        toast({
          title: "Info",
          description: "No changes to save",
        });
        return;
      }
      setIsLoading(true);
      const response = await updateData("admin/settings", {
        settings: changedSettings,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Settings updated successfully",
        });
        // Update local settings
        setSettings((prev) =>
          prev.map((setting) => {
            const updated = changedSettings.find((s) => s.key === setting.key);
            return updated ? { ...setting, value: updated.value } : setting;
          })
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview

      // Upload to API
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "salons");

      try {
        const response = await addData("general/upload-image", formData);
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
        console.error("Failed to upload icon:", error);
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
        const response = await fetchData("admin/social-media-sites");
        if (response.success) {
          setSocialMediaSites(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch social media sites:", error);
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
          en: formData.get("name_en"),
          ar: formData.get("name_ar"),
        },
        icon: iconName,
      };

      const response = await addData("admin/social-media-sites", siteData);
      if (response.success) {
        setSocialMediaSites([...socialMediaSites, response.data]);
        setIsAddingSite(false);
        setUploadedIcon(null);
        setIconName("");
        toast({
          title: "Success",
          description: "Social media site added successfully",
        });
      }
    } catch (error) {
      console.error("Failed to add social media site:", error);
      toast({
        title: "Error",
        description: "Failed to add social media site",
        variant: "destructive",
      });
    }
  };

  const handleEditSite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const siteData = {
        name: {
          en: formData.get("name_en"),
          ar: formData.get("name_ar"),
        },
        ...(iconName && { icon: iconName }),
      };

      const response = await updateData(
        `admin/social-media-sites/${editingSite?.id}`,
        siteData
      );
      if (response.success) {
        const updatedSites = socialMediaSites.map((site) =>
          site.id === editingSite?.id ? { ...site, ...response.data } : site
        );
        setSocialMediaSites(updatedSites);
        setEditingSite(null);
        setUploadedIcon(null);
        setIconName("");
        toast({
          title: "نجاح",
          description: "تم تحديث موقع التواصل الاجتماعي بنجاح",
        });
      }
    } catch (error) {
      console.error("Failed to update social media site:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث موقع التواصل الاجتماعي",
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
                variant={
                  activeTab === "experience_artists" ? "default" : "ghost"
                }
                className={`justify-start ${activeTab === "general" ? "" : "hover:bg-muted"
                  }`}
                onClick={() => setActiveTab("experience_artists")}
              >
                <Settings className="h-4 w-4 ml-2" />
                إعدادات خبيرة التجميل
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
        {activeTab === "experience_artists" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات خبيرة التجميل</CardTitle>
              <CardDescription>إدارة إعدادات خبيرة التجميل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {/* Home Service */}
                  <div className="space-y-2">
                    <Label htmlFor="makeup_artist_home_service_text_ar">
                      نص خدمة "نصلك أينما كنت" <span className="text-muted-foreground">(عربي / English)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="makeup_artist_home_service_text_ar"
                        placeholder="نص الخدمة بالعربي"
                        value={formData["makeup_artist_home_service_text_ar"] || ""}
                        onChange={(e) =>
                          handleInputChange("makeup_artist_home_service_text_ar", e.target.value)
                        }
                        className="w-1/2"
                      />
                      <Textarea
                        id="makeup_artist_home_service_text_en"
                        placeholder='Home Service Text (English)'
                        value={formData["makeup_artist_home_service_text_en"] || ""}
                        onChange={(e) =>
                          handleInputChange("makeup_artist_home_service_text_en", e.target.value)
                        }
                        className="w-1/2"
                      />
                    </div>
                  </div>
                  {/* Center Service */}
                  <div className="space-y-2">
                    <Label htmlFor="makeup_artist_center_service_text_ar">
                      نص خدمة "خدمتنا في مقرنا" <span className="text-muted-foreground">(عربي / English)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="makeup_artist_center_service_text_ar"
                        placeholder="نص الخدمة بالعربي"
                        value={formData["makeup_artist_center_service_text_ar"] || ""}
                        onChange={(e) =>
                          handleInputChange("makeup_artist_center_service_text_ar", e.target.value)
                        }
                        className="w-1/2"
                      />
                      <Textarea
                        id="makeup_artist_center_service_text_en"
                        placeholder='Center Service Text (English)'
                        value={formData["makeup_artist_center_service_text_en"] || ""}
                        onChange={(e) =>
                          handleInputChange("makeup_artist_center_service_text_en", e.target.value)
                        }
                        className="w-1/2"
                      />
                    </div>
                  </div>
                  {/* Center & Home Service */}
                  <div className="space-y-2">
                    <Label htmlFor="makeup_artist_center_and_home_service_text_ar">
                      نص خدمة "نقدم الخدمة في منزلك أو مقرنا" <span className="text-muted-foreground">(عربي / English)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="makeup_artist_center_and_home_service_text_ar"
                        placeholder="نص الخدمة بالعربي"
                        value={formData["makeup_artist_center_and_home_service_text_ar"] || ""}
                        onChange={(e) =>
                          handleInputChange("makeup_artist_center_and_home_service_text_ar", e.target.value)
                        }
                        className="w-1/2"
                      />
                      <Textarea
                        id="makeup_artist_center_and_home_service_text_en"
                        placeholder='Center & Home Service Text (English)'
                        value={formData["makeup_artist_center_and_home_service_text_en"] || ""}
                        onChange={(e) =>
                          handleInputChange("makeup_artist_center_and_home_service_text_en", e.target.value)
                        }
                        className="w-1/2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="rounded-full"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
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
                    <Input
                      id="app-version"
                      value={formData["app_version"] || ""}
                      onChange={(e) =>
                        handleInputChange("app_version", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-version">
                      الحد الأدنى للإصدار المدعوم
                    </Label>
                    <Input
                      id="min-version"
                      value={formData["min_supported_version"] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "min_supported_version",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="android-link">رابط تطبيق Android</Label>
                    <Input
                      id="android-link"
                      value={formData["android_app_url"] || ""}
                      onChange={(e) =>
                        handleInputChange("android_app_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ios-link">رابط تطبيق iOS</Label>
                    <Input
                      id="ios-link"
                      value={formData["ios_app_url"] || ""}
                      onChange={(e) =>
                        handleInputChange("ios_app_url", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="rounded-full"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        )}
        {activeTab === "general" && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>إعدادات عامة</CardTitle>
              <CardDescription>إدارة الإعدادات العامة للنظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">معلومات النظام</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="app_name">اسم التطبيق</Label>
                      <Input
                        id="app_name"
                        value={formData["app_name"] || ""}
                        onChange={(e) =>
                          handleInputChange("app_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="app_url">رابط التطبيق</Label>
                      <Input
                        id="app_url"
                        value={formData["app_url"] || ""}
                        onChange={(e) =>
                          handleInputChange("app_url", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin_email">
                        البريد الإلكتروني للإدارة
                      </Label>
                      <Input
                        id="admin_email"
                        value={formData["admin_email"] || ""}
                        onChange={(e) =>
                          handleInputChange("admin_email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support_email">
                        البريد الإلكتروني للدعم
                      </Label>
                      <Input
                        id="support_email"
                        value={formData["support_email"] || ""}
                        onChange={(e) =>
                          handleInputChange("support_email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني العام</Label>
                      <Input
                        id="email"
                        value={formData["email"] || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <div className="phone-input-container">
                        <PhoneInput
                          // id="phone"
                          defaultCountry="ae"
                          style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            height: "40px",
                            fontSize: "0.875rem",
                            borderRadius: "0.375rem",
                          }}
                          value={formData["phone"] || ""}
                          onChange={(value: string) =>
                            handleInputChange("phone", value)
                          }
                          // international
                          className="w-full"
                          inputProps={{
                            placeholder: "أدخل رقم الهاتف",
                            required: true,
                            name: "phone_display",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium">معلومات اساسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="about_app_ar">عن التطبيق (عربي)</Label>
                      <Editor
                        id="about_app_ar"
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                        value={formData["about_app_ar"] || ""}
                        init={{
                          height: 300,
                          directionality: "rtl",
                          language: "ar",
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignright aligncenter alignleft alignjustify | " +
                            "bullist numlist outdent indent | " +
                            "removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleInputChange("about_app_ar", content)
                        }
                      />
                    </div>
                    {/* about_app_en */}
                    <div className="space-y-2">
                      <Label htmlFor="about_app_en">About App (English)</Label>
                      <Editor
                        id="about_app_en"
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                        value={formData["about_app_en"] || ""}
                        init={{
                          height: 300,
                          directionality: "ltr",
                          language: "en",
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignright aligncenter alignleft alignjustify | " +
                            "bullist numlist outdent indent | " +
                            "removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleInputChange("about_app_en", content)
                        }
                      />
                    </div>

                    {/* privacy_policy_ar */}
                    <div className="space-y-2">
                      <Label htmlFor="privacy_policy_ar">
                        سياسة الخصوصية (عربي)
                      </Label>
                      <Editor
                        id="privacy_policy_ar"
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                        value={formData["privacy_policy_ar"] || ""}
                        init={{
                          height: 300,
                          directionality: "rtl",
                          language: "ar",
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignright aligncenter alignleft alignjustify | " +
                            "bullist numlist outdent indent | " +
                            "removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleInputChange("privacy_policy_ar", content)
                        }
                      />
                    </div>
                    {/* privacy_policy_en */}
                    <div className="space-y-2">
                      <Label htmlFor="privacy_policy_en">
                        Privacy Policy (English)
                      </Label>
                      <Editor
                        id="privacy_policy_en"
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                        value={formData["privacy_policy_en"] || ""}
                        init={{
                          height: 300,
                          directionality: "ltr",
                          language: "en",
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignright aligncenter alignleft alignjustify | " +
                            "bullist numlist outdent indent | " +
                            "removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleInputChange("privacy_policy_en", content)
                        }
                      />
                    </div>
                    {/* terms_and_condition_ar */}
                    <div className="space-y-2">
                      <Label htmlFor="terms_and_condition_ar">
                        الشروط والأحكام (عربي)
                      </Label>
                      <Editor
                        id="terms_and_condition_ar"
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                        value={formData["terms_and_condition_ar"] || ""}
                        init={{
                          height: 300,
                          directionality: "rtl",
                          language: "ar",
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignright aligncenter alignleft alignjustify | " +
                            "bullist numlist outdent indent | " +
                            "removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleInputChange("terms_and_condition_ar", content)
                        }
                      />
                    </div>
                    {/* terms_and_condition_en */}
                    <div className="space-y-2">
                      <Label htmlFor="terms_and_condition_en">
                        Terms and Conditions (English)
                      </Label>
                      <Editor
                        id="terms_and_condition_en"
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                        value={formData["terms_and_condition_en"] || ""}
                        init={{
                          height: 300,
                          directionality: "ltr",
                          language: "en",
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignright aligncenter alignleft alignjustify | " +
                            "bullist numlist outdent indent | " +
                            "removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleInputChange("terms_and_condition_en", content)
                        }
                      />
                    </div>
                    {/* help_ar */}
                    <div className="space-y-2">
                      <Label htmlFor="help_ar">مساعدة (عربي)</Label>
                      <Editor
                        id="help_ar"
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                        value={formData["help_ar"] || ""}
                        init={{
                          height: 300,
                          directionality: "rtl",
                          language: "ar",
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignright aligncenter alignleft alignjustify | " +
                            "bullist numlist outdent indent | " +
                            "removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleInputChange("help_ar", content)
                        }
                      />
                    </div>

                    {/* help_en */}
                    <div className="space-y-2">
                      <Label htmlFor="help_en">Help (English)</Label>
                      <Editor
                        id="help_en"
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                        value={formData["help_en"] || ""}
                        init={{
                          height: 300,
                          directionality: "ltr",
                          language: "en",
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignright aligncenter alignleft alignjustify | " +
                            "bullist numlist outdent indent | " +
                            "removeformat | help",
                        }}
                        onEditorChange={(content) =>
                          handleInputChange("help_en", content)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="rounded-full"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
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
                إدارة إعدادات العمولات والمدفوعات للمزودات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">نسب العمولة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div className="space-y-2">
                      <Label htmlFor="system_percentage_gift">
                        نسبة العمولة لبطاقات الهدايا Glintup (%)
                      </Label>
                      <Input
                        id="system_percentage_gift"
                        type="number"
                        value={formData["system_percentage_gift"] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "system_percentage_gift",
                            e.target.value
                          )
                        }
                      />
                    </div> */}
                    {/* //makeup_artists_provider_percentage */}
                    {/* menu_request_cost */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="makeup_artists_provider_percentage">
                        نسبة خبيرات التجميل (%)
                      </Label>
                      <Input
                        id="makeup_artists_provider_percentage"
                        type="number"
                        value={
                          formData["makeup_artists_provider_percentage"] || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "makeup_artists_provider_percentage",
                            e.target.value
                          )
                        }
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="makeup_artists_provider_percentage">
                        نسبة خبيرات التجميل (%)
                      </Label>
                      <Input
                        id="makeup_artists_provider_percentage"
                        min={0}
                        type="number"
                        value={
                          formData["makeup_artists_provider_percentage"] || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "makeup_artists_provider_percentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    {/* menu_request_cost */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="menu_request_cost">
                        تكلفة طلب القائمة
                      </Label>
                      <Input
                        id="menu_request_cost"
                        type="number"
                        value={formData["menu_request_cost"] || ""}
                        onChange={(e) =>
                          handleInputChange("menu_request_cost", e.target.value)
                        }
                      />
                    </div> */}

                    {/* //home_service_provider_percentage */}
                    <div className="space-y-2">
                      <Label htmlFor="home_service_provider_percentage">
                        نسبة مزودات الخدمات المنزلية (%)
                      </Label>
                      <Input
                        id="home_service_provider_percentage"
                        type="number"
                        min={0}
                        value={
                          formData["home_service_provider_percentage"] || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "home_service_provider_percentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    {/* clinics_provider_percentage */}
                    <div className="space-y-2">
                      <Label htmlFor="clinics_provider_percentage">
                        نسبة العيادات (%)
                      </Label>
                      <Input
                        id="clinics_provider_percentage"
                        type="number"
                        min={0}
                        value={formData["clinics_provider_percentage"] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "clinics_provider_percentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax">الضريبة</Label>
                      <Input
                        id="tax"
                        min={0}
                        type="number"
                        value={formData["tax"] || ""}
                        onChange={(e) =>
                          handleInputChange("tax", e.target.value)
                        }
                      />
                    </div>
                    {/* salons_provider_percentage */}
                    <div className="space-y-2">
                      <Label htmlFor="salons_provider_percentage">
                        نسبة المزودين(%)
                      </Label>
                      <Input
                        min={0}
                        id="salons_provider_percentage"
                        type="number"
                        value={formData["salons_provider_percentage"] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "salons_provider_percentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adver_cost_per_day">
                        تكلفة الإعلان في اليوم
                      </Label>
                      <Input
                        id="adver_cost_per_day"
                        type="number"
                        value={formData["adver_cost_per_day"] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "adver_cost_per_day",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="menu_request_cost">
                        تكلفة طلب القائمة
                      </Label>
                      <Input
                        min={0}
                        id="menu_request_cost"
                        type="number"
                        value={formData["menu_request_cost"] || ""}
                        onChange={(e) =>
                          handleInputChange("menu_request_cost", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="rounded-full"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
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
                  <CardDescription>
                    إدارة مواقع التواصل الاجتماعي
                  </CardDescription>
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
                    <Input
                      id="icon"
                      onChange={handleIconUpload}
                      name="icon"
                      type="file"
                      accept="image/*"
                      required
                    />
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
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingSite(false);
                        setUploadedIcon(null);
                        setIconName("");
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button type="submit">حفظ</Button>
                  </div>
                </form>
              )}

              {editingSite && (
                <form onSubmit={handleEditSite} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_name_en">الاسم (إنجليزي)</Label>
                      <Input
                        id="edit_name_en"
                        name="name_en"
                        defaultValue={editingSite.name.en}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_name_ar">الاسم (عربي)</Label>
                      <Input
                        id="edit_name_ar"
                        name="name_ar"
                        defaultValue={editingSite.name.ar || ""}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_icon">الأيقونة</Label>
                    <Input
                      id="edit_icon"
                      onChange={handleIconUpload}
                      name="icon"
                      type="file"
                      accept="image/*"
                    />
                    <div className="mt-2">
                      <img
                        src={uploadedIcon || editingSite.icon_url}
                        alt="Icon preview"
                        className="w-16 h-16 rounded object-cover border"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingSite(null);
                        setUploadedIcon(null);
                        setIconName("");
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button type="submit">حفظ التغييرات</Button>
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
                            <h4 className="font-medium">
                              {site.name.ar || site.name.en}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {site.name.en}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingSite(site);
                                setIsAddingSite(false);
                              }}
                            >
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={async () => {
                                if (
                                  confirm("هل أنت متأكد من حذف هذا الموقع؟")
                                ) {
                                  await deleteData(
                                    `admin/social-media-sites/${site.id}`
                                  );
                                  setSocialMediaSites((sites) =>
                                    sites.filter((s) => s.id !== site.id)
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
