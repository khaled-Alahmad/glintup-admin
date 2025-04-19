"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { fetchData, updateData, addData } from "@/lib/apiHelper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Upload,
  MapPin,
  Phone,
  Mail,
  Clock,
  Plus,
  X,
  Edit,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditSalonProps {
  salonId: string;
}
// interface WorkingHour {
//   id?: number;
//   salon_id: number;
//   day_of_week: string;
//   opening_time: string;
//   closing_time: string;
//   is_closed: boolean;
//   break_start: string | null;
//   break_end: string | null;
// }

// تعريف نوع البيانات للخدمة
interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  category: string;
}

// تعريف نوع البيانات للخدمة في الصالون
interface SalonService {
  id: string;
  serviceId: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  category: string;
}

// تعريف نوع البيانات للمجموعة
interface Collection {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  discount: number;
}
// Add these types and constants
export interface WorkingHour {
  id: string;
  day_of_week: string;
  is_closed: boolean;
  opening_time: string;
  closing_time: string;
  break_start?: string;
  break_end?: string;
}
interface SocialMediaSite {
  id: number;
  name: {
    en: string;
    ar: string | null;
  };
  icon: string;
  icon_url: string;
}

interface SocialMediaMap {
  [key: number]: string;
}
const DAYS_OF_WEEK = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
];
interface SalonSocialMedia {
  id: number;
  salon_id: number;
  social_media_site_id: number;
  link: string;
}

export default function EditSalon({ salonId }: EditSalonProps) {
  const { toast } = useToast();
  const router = useRouter();
  // Add these after other state declarations
  const [salonImages, setSalonImages] = useState<{ id: number; url: string }[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [salonData, setSalonData] = useState<any>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoText, setLogoText] = useState<string | null>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableDays, setAvailableDays] = useState<string[]>(DAYS_OF_WEEK);
  const [editingWorkingHour, setEditingWorkingHour] = useState<WorkingHour | null>(null);
  const [isWorkingHourDialogOpen, setIsWorkingHourDialogOpen] = useState(false);
  useEffect(() => {
    const usedDays = workingHours.map(wh => wh.day_of_week);
    console.log(usedDays);
    console.log(availableDays);


    setAvailableDays(DAYS_OF_WEEK.filter(day => !usedDays.includes(day)));
  }, [workingHours]);
  const [socialMediaSites, setSocialMediaSites] = useState<SocialMediaSite[]>([]);
  const [salonSocialMedia, setSalonSocialMedia] = useState<SocialMediaMap>({});
  const [newImagesNames, setNewImagesNames] = useState<string[]>([]);

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);

        // Upload each image and store their names and URLs
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('folder', "salons");

          const response = await addData('general/upload-image', formData);
          if (response.success) {
            return {
              name: response.data.image_name,
              url: response.data.image_url
            };
          }
          return null;
        });

        const imageResults = await Promise.all(uploadPromises);
        const validResults = imageResults.filter((result): result is { name: string, url: string } => result !== null);

        setSalonImages(prev => [...prev, ...validResults.map((r, index) => ({
          id: Date.now() + index, // Convert to number
          url: r.url
        }))]);
      } catch (error) {
        console.error('Error uploading images:', error);
        toast({
          title: "خطأ في رفع الصور",
          description: "حدث خطأ أثناء رفع الصور",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveMedia = async () => {
    try {
      setIsLoading(true);

      const uploadedImages = await Promise.all(
        newImages.map(async (file) => {
          const imageFormData = new FormData();
          imageFormData.append('image', file);
          imageFormData.append('folder', "salons");

          const response = await addData('general/upload-image', imageFormData);
          return response.data.image_name;
        })
      );

      // Prepare final update data
      const updateDataToSend = {
        images: uploadedImages,
        images_remove: imagesToRemove,
        icon: logoText
      };

      const response = await updateData(`admin/salons/${salonId}`, updateDataToSend);

      if (response.success) {
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث صور الصالون بنجاح",
        });
        // Reset states
        setNewImages([]);
        setNewImagesNames([]);
        setImagesToRemove([]);
        // Refresh images
        fetchSalonImages();
      }
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الصور",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalonImages = async () => {
    try {
      const response = await fetchData(`admin/salons/${salonId}`);
      if (response.success) {
        setSalonImages(response.data.images);
      }
    } catch (error) {
      console.error('Error fetching salon images:', error);
    }
  };

  // Add this to your existing useEffect or create a new one
  useEffect(() => {
    fetchSalonImages();
  }, [salonId]);
  // Add this effect to fetch social media sites
  useEffect(() => {
    const fetchSocialMediaSites = async () => {
      try {
        const response = await fetchData('admin/social-media-sites');
        if (response.success) {
          setSocialMediaSites(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch social media sites:', error);
      }
    };

    const fetchSalonSocialMedia = async () => {
      try {
        const response = await fetchData(`admin/salon-social-media-sites?salon_id=${salonId}`);
        if (response.success) {
          const socialMediaMap: SocialMediaMap = {};
          response.data.forEach((item: SalonSocialMedia) => {
            socialMediaMap[item.social_media_site_id] = item.link;
          });
          setSalonSocialMedia(socialMediaMap);
        }
      } catch (error) {
        console.error('Failed to fetch salon social media:', error);
      }
    };

    fetchSocialMediaSites();
    fetchSalonSocialMedia();
  }, [salonId]);

  // خدمات الصالون المحددة
  const [salonServices, setSalonServices] = useState<SalonService[]>([]);
  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const response = await fetchData(`admin/working-hours?salon_id=${salonId}`);
        console.log(response);

        if (response.success) {
          setWorkingHours(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch working hours:", error);
      }
    };
    fetchWorkingHours();
  }, [salonId]);
  const handleSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setIsLoading(true);
      const contactData = {
        email: formData.get('email'),
        phone: formData.get('phone'),
        phone_code: formData.get('phone_code'),
        address: formData.get('location'),
        city: formData.get('city'),
        district: formData.get('country'),

      };

      const workingHoursData = workingHours.map(hour => {
        const filteredHour = Object.fromEntries(
          Object.entries({
            ...hour,
            salon_id: Number(salonId)
          }).filter(([_, value]) => value !== "" && value !== null)
        );
        return filteredHour;
      });



      await Promise.all(workingHoursData.map(async (hour) => {
        const hoursResponse = await updateData(`admin/working-hours/${hour.id}`, hour);

      }));
      const salonResponse = await updateData(`admin/salons/${salonId}`, contactData);

      await Promise.all(
        Object.entries(salonSocialMedia).map(([siteId, link]) => {
          if (link) {
            return addData('admin/salon-social-media-sites', {
              salon_id: salonId,
              social_media_site_id: siteId,
              link
            });
          }
        })
      );
      if (salonResponse.success) {
        toast({
          title: "تم التحديث بنجاح",
          description: salonResponse?.message,
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update contact info:", error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث معلومات الاتصال",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // المجموعات المحددة
  const [selectedCollections, setSelectedCollections] = useState<Collection[]>(
    []
  );

  // قائمة الخدمات المتاحة
  const [availableServices, setAvailableServices] = useState<Service[]>([
    {
      id: "1",
      name: "قص الشعر",
      duration: 60,
      price: 150,
      description: "قص الشعر بأحدث التقنيات والموضات",
      category: "hair",
    },
    {
      id: "2",
      name: "صبغة شعر",
      duration: 120,
      price: 300,
      description: "صبغة شعر بألوان عالمية وتقنيات حديثة",
      category: "hair",
    },
    {
      id: "3",
      name: "تسريحة شعر",
      duration: 90,
      price: 200,
      description: "تسريحات متنوعة للمناسبات والحفلات",
      category: "hair",
    },
    {
      id: "4",
      name: "مكياج",
      duration: 60,
      price: 250,
      description: "مكياج احترافي للمناسبات والسهرات",
      category: "makeup",
    },
    {
      id: "5",
      name: "مانيكير",
      duration: 45,
      price: 100,
      description: "عناية كاملة بالأظافر",
      category: "nails",
    },
    {
      id: "6",
      name: "باديكير",
      duration: 45,
      price: 120,
      description: "عناية كاملة بأظافر القدم",
      category: "nails",
    },
    {
      id: "7",
      name: "تنظيف بشرة",
      duration: 60,
      price: 200,
      description: "تنظيف عميق للبشرة",
      category: "skin",
    },
    {
      id: "8",
      name: "ماسك للوجه",
      duration: 30,
      price: 100,
      description: "ماسكات طبيعية للوجه",
      category: "skin",
    },
  ]);

  // قائمة المجموعات المتاحة
  const [availableCollections, setAvailableCollections] = useState<
    Collection[]
  >([
    {
      id: "1",
      name: "باقة العروس",
      description: "باقة متكاملة لتجهيز العروس",
      services: ["1", "3", "4"],
      price: 550,
      discount: 50,
    },
    {
      id: "2",
      name: "باقة العناية الكاملة",
      description: "باقة للعناية الكاملة بالجسم",
      services: ["5", "6", "7", "8"],
      price: 450,
      discount: 70,
    },
  ]);

  // حالة مربع حوار إضافة خدمة
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);

  // حالة مربع حوار تعديل خدمة
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);

  // الخدمة الحالية للتعديل
  const [currentService, setCurrentService] = useState<SalonService | null>(
    null
  );

  // الخدمة المختارة للإضافة
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  // السعر المخصص للخدمة المختارة
  const [customPrice, setCustomPrice] = useState<number>(0);

  // المدة المخصصة للخدمة المختارة
  const [customDuration, setCustomDuration] = useState<number>(0);

  // جلب بيانات الصالون
  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData(`admin/salons/${salonId}`);
        if (response.success) {
          const data = response.data;
          setSalonData(data);
          setLogoPreview(data.icon_url);
          // setCoverPreview(data.cove || "/placeholder.svg?height=400&width=800");
          setGalleryPreviews(data.images || []);
          setSalonServices(data.services || []);
          setLogoText(data.icon);

          setSelectedCollections(data.collections || []);
        }
      } catch (error) {
        console.error("Failed to fetch salon data:", error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء جلب بيانات الصالون",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalonData();
  }, [salonId]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', "salons");

        const response = await addData('general/upload-image', formData);
        if (response.success) {
          setLogoPreview(response.data.image_url);
          setLogoText(response.data.image_name);
        }
      } catch (error) {
        console.error("Failed to upload logo:", error);
        toast({
          title: "خطأ في رفع الصورة",
          description: "حدث خطأ أثناء رفع شعار الصالون",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmitBasic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setIsLoading(true);
      const updateDatatoSend = {
        name: formData.get('name'),
        description: formData.get('description'),
        is_active: formData.get('is_active') === 'on' ? 1 : 0,
        is_approved: formData.get('is_approved') === 'on' ? 1 : 0,
        merchant_legal_name: formData.get('merchant_legal_name'),
        merchant_commercial_name: formData.get('merchant_commercial_name'),
        address: formData.get('address'),
        city_street_name: formData.get('city_street_name'),
        contact_name: formData.get('contact_name'),
        contact_number: formData.get('contact_number'),
        contact_email: formData.get('contact_email')
        ,
        business_contact_name: formData.get('business_contact_name'),
        business_contact_number: formData.get('business_contact_number'),
        business_contact_email: formData.get('business_contact_email'),
        // description: "",
        bio: formData.get('bio'),
        // icon: logoText,

        // logo_url: logoPreview,
        // cover_url: coverPreview,
        // gallery_urls: galleryPreviews,
        // services: salonServices,
        // collections: selectedCollections,
      };

      const response = await updateData(`admin/salons/${salonId}`, updateDatatoSend);
      if (response.success) {
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث بيانات الصالون بنجاح",
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update salon:", error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث بيانات الصالون",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة خدمة إلى الصالون
  const addServiceToSalon = () => {
    if (!selectedServiceId) return;

    const service = availableServices.find((s) => s.id === selectedServiceId);
    if (!service) return;

    // التحقق من عدم وجود الخدمة مسبقاً في الصالون
    if (salonServices.some((s) => s.serviceId === selectedServiceId)) {
      alert("هذه الخدمة موجودة بالفعل في الصالون");
      return;
    }

    const price = customPrice > 0 ? customPrice : service.price;
    const duration = customDuration > 0 ? customDuration : service.duration;

    const newSalonService: SalonService = {
      id: `salon-service-${Date.now()}`,
      serviceId: service.id,
      name: service.name,
      duration: duration,
      price: price,
      description: service.description,
      category: service.category,
    };

    setSalonServices([...salonServices, newSalonService]);
    setIsAddServiceDialogOpen(false);
    setSelectedServiceId("");
    setCustomPrice(0);
    setCustomDuration(0);
  };

  // تعديل خدمة في الصالون
  const editSalonService = () => {
    if (!currentService) return;

    setSalonServices(
      salonServices.map((service) =>
        service.id === currentService.id ? currentService : service
      )
    );

    setIsEditServiceDialogOpen(false);
    setCurrentService(null);
  };

  // حذف خدمة من الصالون
  const removeSalonService = (serviceId: string) => {
    setSalonServices(
      salonServices.filter((service) => service.id !== serviceId)
    );
  };

  // إضافة مجموعة إلى الصالون
  const addCollection = (collectionId: string) => {
    const collection = availableCollections.find((c) => c.id === collectionId);
    if (collection && !selectedCollections.some((c) => c.id === collectionId)) {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  // إزالة مجموعة من الصالون
  const removeCollection = (collectionId: string) => {
    setSelectedCollections(
      selectedCollections.filter((c) => c.id !== collectionId)
    );
  };

  // تحديث الخدمة المختارة للإضافة
  const handleServiceSelection = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const service = availableServices.find((s) => s.id === serviceId);
    if (service) {
      setCustomPrice(service.price);
      setCustomDuration(service.duration);
    }
  };
  if (!salonData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse bg-muted rounded-md" />
          <div className="h-8 w-48 animate-pulse bg-muted rounded-md" />
        </div>

        <div className="grid gap-6">
          <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
          <Card>
            <CardHeader>
              <div className="h-6 w-32 animate-pulse bg-muted rounded" />
              <div className="h-4 w-48 animate-pulse bg-muted/50 rounded mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="h-5 w-24 animate-pulse bg-muted rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-10 animate-pulse bg-muted rounded" />
                  <div className="h-10 animate-pulse bg-muted rounded" />
                </div>
                <div className="h-32 animate-pulse bg-muted rounded" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end gap-4 w-full">
                <div className="h-10 w-24 animate-pulse bg-muted rounded" />
                <div className="h-10 w-32 animate-pulse bg-muted rounded" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  const validateWorkingHour = (workingHour: WorkingHour): boolean => {
    if (!workingHour.day_of_week) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار اليوم",
        variant: "destructive",
      });
      return false;
    }

    if (!workingHour.is_closed) {
      if (!workingHour.opening_time || !workingHour.closing_time) {
        toast({
          title: "خطأ",
          description: "يرجى تحديد وقت الفتح والإغلاق",
          variant: "destructive",
        });
        return false;
      }

      if (workingHour.opening_time >= workingHour.closing_time) {
        toast({
          title: "خطأ",
          description: "يجب أن يكون وقت الإغلاق بعد وقت الفتح",
          variant: "destructive",
        });
        return false;
      }

      if (workingHour.break_start && !workingHour.break_end ||
        !workingHour.break_start && workingHour.break_end) {
        toast({
          title: "خطأ",
          description: "يجب تحديد وقت بداية ونهاية الراحة",
          variant: "destructive",
        });
        return false;
      }

      if (workingHour.break_start && workingHour.break_end &&
        workingHour.break_start >= workingHour.break_end) {
        toast({
          title: "خطأ",
          description: "يجب أن يكون وقت نهاية الراحة بعد وقت البداية",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/salons/${salonId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          تعديل بيانات الصالون
        </h1>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">معلومات أساسية</TabsTrigger>
          <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
          <TabsTrigger value="media">الصور والوسائط</TabsTrigger>
          {/* <TabsTrigger value="services">الخدمات</TabsTrigger>
          <TabsTrigger value="collections">المجموعات</TabsTrigger> */}
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <form onSubmit={handleSubmitBasic}>
            <Card>
              <CardHeader>
                <CardTitle>تعديل بيانات الصالون</CardTitle>
                <CardDescription>قم بتعديل معلومات الصالون</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* المعلومات الأساسية */}
                <h3 className="text-lg font-medium">المعلومات الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      اسم الصالون <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" name="name" defaultValue={salonData?.business_contact_name} required />
                  </div>

                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">وصف الصالون</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={salonData?.description}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="merchant_legal_name">الاسم القانوني للتاجر</Label>
                    <Input
                      id="merchant_legal_name"
                      name="merchant_legal_name"
                      defaultValue={salonData?.merchant_legal_name}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="merchant_commercial_name">الاسم التجاري للتاجر</Label>
                    <Input
                      id="merchant_commercial_name"
                      name="merchant_commercial_name"
                      defaultValue={salonData?.merchant_commercial_name}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={salonData?.address}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city_street_name">الشارع والمدينة</Label>
                    <Input
                      id="city_street_name"
                      name="city_street_name"
                      defaultValue={salonData?.city_street_name}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_name">اسم جهة الاتصال</Label>
                    <Input
                      id="contact_name"
                      name="contact_name"
                      defaultValue={salonData?.contact_name}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_number">رقم جهة الاتصال</Label>
                    <Input
                      id="contact_number"
                      name="contact_number"
                      defaultValue={salonData?.contact_number}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">البريد الإلكتروني لجهة الاتصال</Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      defaultValue={salonData?.contact_email}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_contact_name">الاسم التجاري لجهة الأعمال</Label>
                    <Input
                      id="business_contact_name"
                      name="business_contact_name"
                      defaultValue={salonData?.business_contact_name}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_contact_number">رقم جهة الأعمال</Label>
                    <Input
                      id="business_contact_number"
                      name="business_contact_number"
                      defaultValue={salonData?.business_contact_number}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_contact_email">البريد الإلكتروني لجهة الأعمال</Label>
                    <Input
                      id="business_contact_email"
                      name="business_contact_email"
                      type="email"
                      defaultValue={salonData?.business_contact_email}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="description">وصف الصالون</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={salonData?.description}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">نبذة عن الصالون</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    defaultValue={salonData?.bio}
                  />
                </div>



                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">إعدادات متقدمة</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_approved">صالون موثق</Label>
                        <p className="text-sm text-muted-foreground">
                          إضافة علامة التوثيق إلى الصالون
                        </p>
                      </div>
                      <Switch name="is_approved" id="is_approved" defaultChecked={salonData?.is_approved} className="switch-custom" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_active">صالون نشط</Label>
                        <p className="text-sm text-muted-foreground">
                          تعيين الصالون نشطًا
                        </p>
                      </div>
                      <Switch id="is_active" name="is_active" defaultChecked={salonData?.is_active} className="switch-custom" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/salons`}>إلغاء</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card>
            <form onSubmit={handleSubmitContact}>

              <CardHeader>
                <CardTitle>معلومات الاتصال</CardTitle>
                <CardDescription>
                  تعديل معلومات الاتصال والموقع للصالون
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" name="email" defaultValue={salonData?.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex">
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={salonData?.phone}
                        className="rounded-l-none text-right"
                        style={{ direction: "rtl", textAlign: "left" }}
                        placeholder="555 123 4567"
                        required
                      />
                      <Input
                        id="phone_code"
                        name="phone_code"

                        defaultValue={salonData?.phone_code}
                        className="w-[90px] rounded-r-none text-center border-r-0"
                        style={{ direction: "ltr", unicodeBidi: "plaintext" }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="location"
                      name="location"
                      defaultValue={salonData?.location}
                      className="pr-9 min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      المدينة <span className="text-red-500">*</span>
                    </Label>
                    <Input id="city" name="city" defaultValue={salonData?.city} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">
                      الدولة <span className="text-red-500">*</span>
                    </Label>
                    <Input id="country" name="country" defaultValue={salonData?.country} required />
                  </div>
                </div>

                <Separator />
                <div className="space-y-4">


                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">ساعات العمل</h3>
                    {availableDays.length > 0 && (
                      <Dialog open={isWorkingHourDialogOpen} onOpenChange={setIsWorkingHourDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 ml-2" />
                            إضافة يوم عمل
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editingWorkingHour ? 'تعديل يوم عمل' : 'إضافة يوم عمل'}
                            </DialogTitle>
                          </DialogHeader>
                          <WorkingHourForm
                            workingHour={editingWorkingHour}
                            onSubmit={async (data) => {
                              try {
                                if (!validateWorkingHour(data)) {
                                  return;
                                }
                                console.log("data", data);

                                const filteredData = Object.fromEntries(
                                  Object.entries(data).filter(([_, value]) => value !== "" && value !== null)
                                );
                                console.log("filteredData", filteredData);

                                if (editingWorkingHour) {
                                  const response = await updateData(
                                    `admin/working-hours/${editingWorkingHour.id}`,
                                    filteredData
                                  );
                                  if (response.success) {
                                    setWorkingHours(hours =>
                                      hours.map(h => h.id === editingWorkingHour.id ? response.data : h)
                                    );
                                    setIsWorkingHourDialogOpen(false);
                                    setEditingWorkingHour(null);
                                    toast({
                                      title: "تم بنجاح",
                                      description: "تم تعديل يوم العمل بنجاح",
                                    });
                                  }
                                } else {
                                  const response = await addData(
                                    `admin/working-hours`,
                                    { ...filteredData, salon_id: salonId }
                                  );
                                  if (response.success) {
                                    setWorkingHours([...workingHours, response.data]);
                                    setIsWorkingHourDialogOpen(false);
                                    toast({
                                      title: "تم بنجاح",
                                      description: "تم إضافة يوم العمل بنجاح",
                                    });
                                  }
                                }
                              } catch (error) {
                                console.error("Error saving working hours:", error);
                                toast({
                                  title: "خطأ",
                                  description: "حدث خطأ أثناء حفظ البيانات",
                                  variant: "destructive",
                                });
                              }
                            }}
                            availableDays={availableDays}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="space-y-4">
                    {/* <h3 className="text-lg font-medium">ساعات العمل</h3> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {workingHours.map((workDay) => (
                        <div
                          key={workDay.day_of_week}
                          className="flex flex-col gap-4 p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{workDay.day_of_week}</span>
                            </div>
                            <Switch
                              className="switch-custom"
                              checked={!workDay.is_closed}
                              onCheckedChange={(checked) => {
                                setWorkingHours(hours =>
                                  hours.map(h =>
                                    h.day_of_week === workDay.day_of_week
                                      ? { ...h, is_closed: !checked }
                                      : h
                                  )
                                );
                              }}
                            />
                          </div>

                          {!workDay.is_closed && (
                            <>
                              <div className="flex gap-2 items-center">
                                <Select
                                  value={workDay.opening_time}
                                  onValueChange={(value) => {
                                    setWorkingHours(hours =>
                                      hours.map(h =>
                                        h.day_of_week === workDay.day_of_week
                                          ? { ...h, opening_time: value }
                                          : h
                                      )
                                    );
                                  }}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="من" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 24 }).map((_, i) => (
                                      <SelectItem
                                        key={i}
                                        value={`${String(i).padStart(2, "0")}:00`}
                                      >
                                        {`${String(i).padStart(2, "0")}:00`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span>إلى</span>
                                <Select
                                  value={workDay.closing_time}
                                  onValueChange={(value) => {
                                    setWorkingHours(hours =>
                                      hours.map(h =>
                                        h.day_of_week === workDay.day_of_week
                                          ? { ...h, closing_time: value }
                                          : h
                                      )
                                    );
                                  }}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="إلى" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 24 }).map((_, i) => (
                                      <SelectItem
                                        key={i}
                                        value={`${String(i).padStart(2, "0")}:00`}
                                      >
                                        {`${String(i).padStart(2, "0")}:00`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label>فترة الراحة</Label>
                                <div className="flex gap-2 items-center">
                                  <Select
                                    value={workDay.break_start || ""}
                                    onValueChange={(value) => {
                                      setWorkingHours(hours =>
                                        hours.map(h =>
                                          h.day_of_week === workDay.day_of_week
                                            ? { ...h, break_start: value }
                                            : h
                                        )
                                      );
                                    }}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="من" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="aa">بدون راحة</SelectItem>
                                      {Array.from({ length: 24 }).map((_, i) => (
                                        <SelectItem
                                          key={i}
                                          value={`${String(i).padStart(2, "0")}:00`}
                                        >
                                          {`${String(i).padStart(2, "0")}:00`}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <span>إلى</span>
                                  <Select
                                    value={workDay.break_end || ""}
                                    onValueChange={(value) => {
                                      setWorkingHours(hours =>
                                        hours.map(h =>
                                          h.day_of_week === workDay.day_of_week
                                            ? { ...h, break_end: value }
                                            : h
                                        )
                                      );
                                    }}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="إلى" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="aa">بدون راحة</SelectItem>
                                      {Array.from({ length: 24 }).map((_, i) => (
                                        <SelectItem
                                          key={i}
                                          value={`${String(i).padStart(2, "0")}:00`}
                                        >
                                          {`${String(i).padStart(2, "0")}:00`}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Separator />

                {/* handle social-media-sites */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">مواقع التواصل الاجتماعي</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {socialMediaSites.map((site) => (
                      <div key={site.id} className="flex items-center gap-4">
                        <div className="w-8 h-8">
                          <img
                            src={site.icon_url}
                            alt={site.name.en}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder={`${site.name.en} URL`}
                            value={salonSocialMedia[site.id] || ''}
                            onChange={(e) => {
                              setSalonSocialMedia(prev => ({
                                ...prev,
                                [site.id]: e.target.value
                              }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/salons`}>إلغاء</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الصور والوسائط</CardTitle>
              <CardDescription>تعديل صور وشعار الصالون</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">شعار الصالون</h3>
                <Label
                  htmlFor="logo"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {logoPreview ? (
                    <div className="relative w-full">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="معاينة الشعار"
                        className="mx-auto max-h-48 rounded-md object-contain"
                      />
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.preventDefault();
                          setLogoPreview(null);
                        }}
                      >
                        حذف
                      </Button> */}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        اسحب وأفلت شعار الصالون هنا أو انقر للتصفح
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG حتى 2MB</p>
                    </div>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </Label>
              </div>
              <Separator />


              <div className="space-y-4">
                <h3 className="text-lg font-medium">صور الغلاف </h3>
                <Label
                  htmlFor="gallery"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      اسحب وأفلت صور الصالون هنا أو انقر للتصفح
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG حتى 5MB لكل صورة
                    </p>
                  </div>
                  <Button type="button" variant="outline" className="mt-4">
                    إضافة صور جديدة
                  </Button>
                  <Input
                    id="gallery"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryChange}
                  />
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {salonImages.map((image) => (
                    <div key={image.id} className="relative group rounded-lg overflow-hidden h-40">
                      <img
                        src={image.url}
                        alt="صورة الصالون"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => {
                            setImagesToRemove(prev => [...prev, image.id]);
                            setSalonImages(prev => prev.filter(img => img.id !== image.id));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
            <CardFooter className="item-end justify-end">
              <Button onClick={handleSaveMedia} disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الخدمات والأسعار</CardTitle>
              <CardDescription>تعديل خدمات الصالون وأسعارها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">خدمات الصالون</h3>
                  <Dialog
                    open={isAddServiceDialogOpen}
                    onOpenChange={setIsAddServiceDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة خدمة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>إضافة خدمة للصالون</DialogTitle>
                        <DialogDescription>
                          اختر خدمة من القائمة وحدد السعر والمدة المناسبة
                          للصالون
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="service-select"
                            className="text-right"
                          >
                            الخدمة
                          </Label>
                          <Select
                            value={selectedServiceId}
                            onValueChange={handleServiceSelection}
                          >
                            <SelectTrigger
                              id="service-select"
                              className="col-span-3"
                            >
                              <SelectValue placeholder="اختر خدمة" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableServices.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="service-price" className="text-right">
                            السعر (د.إ)
                          </Label>
                          <Input
                            id="service-price"
                            type="number"
                            min="0"
                            step="0.01"
                            className="col-span-3"
                            value={customPrice}
                            onChange={(e) =>
                              setCustomPrice(Number(e.target.value))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="service-duration"
                            className="text-right"
                          >
                            المدة (دقيقة)
                          </Label>
                          <Input
                            id="service-duration"
                            type="number"
                            min="1"
                            className="col-span-3"
                            value={customDuration}
                            onChange={(e) =>
                              setCustomDuration(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddServiceDialogOpen(false)}
                        >
                          إلغاء
                        </Button>
                        <Button
                          onClick={addServiceToSalon}
                          disabled={!selectedServiceId}
                        >
                          إضافة الخدمة
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {salonServices.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الخدمة</TableHead>
                          <TableHead>الفئة</TableHead>
                          <TableHead>المدة</TableHead>
                          <TableHead>السعر</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salonServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div>{service.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {service.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {service.category === "hair" && "خدمات الشعر"}
                                {service.category === "skin" && "خدمات البشرة"}
                                {service.category === "nails" &&
                                  "خدمات الأظافر"}
                                {service.category === "makeup" &&
                                  "خدمات المكياج"}
                                {service.category === "other" && "خدمات أخرى"}
                              </Badge>
                            </TableCell>
                            <TableCell>{service.duration} دقيقة</TableCell>
                            <TableCell>{service.price} د.إ</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentService(service);
                                    setIsEditServiceDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500"
                                  onClick={() => removeSalonService(service.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      لم يتم إضافة أي خدمات بعد
                    </p>
                    <p className="text-sm text-muted-foreground">
                      اضغط على زر "إضافة خدمة" لإضافة خدمات للصالون
                    </p>
                  </div>
                )}
              </div>

              {/* مربع حوار تعديل الخدمة */}
              <Dialog
                open={isEditServiceDialogOpen}
                onOpenChange={setIsEditServiceDialogOpen}
              >
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>تعديل خدمة الصالون</DialogTitle>
                    <DialogDescription>
                      قم بتعديل تفاصيل الخدمة في الصالون
                    </DialogDescription>
                  </DialogHeader>
                  {currentService && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="edit-service-name"
                          className="text-right"
                        >
                          الخدمة
                        </Label>
                        <Input
                          id="edit-service-name"
                          className="col-span-3"
                          value={currentService.name}
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="edit-service-price"
                          className="text-right"
                        >
                          السعر (د.إ)
                        </Label>
                        <Input
                          id="edit-service-price"
                          type="number"
                          min="0"
                          step="0.01"
                          className="col-span-3"
                          value={currentService.price}
                          onChange={(e) =>
                            setCurrentService({
                              ...currentService,
                              price: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="edit-service-duration"
                          className="text-right"
                        >
                          المدة (دقيقة)
                        </Label>
                        <Input
                          id="edit-service-duration"
                          type="number"
                          min="1"
                          className="col-span-3"
                          value={currentService.duration}
                          onChange={(e) =>
                            setCurrentService({
                              ...currentService,
                              duration: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditServiceDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={editSalonService}>حفظ التغييرات</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>المجموعات</CardTitle>
              <CardDescription>إدارة مجموعات الخدمات للصالون</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">اختيار المجموعات</h3>
                  <Select onValueChange={(value) => addCollection(value)}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="اختر مجموعة لإضافتها" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCollections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.name} - {collection.price} د.إ
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCollections.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>المجموعة</TableHead>
                          <TableHead>الخدمات</TableHead>
                          <TableHead>السعر</TableHead>
                          <TableHead>الخصم</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCollections.map((collection) => (
                          <TableRow key={collection.id}>
                            <TableCell className="font-medium">
                              {collection.name}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {collection.services.map((serviceId) => {
                                  const service = availableServices.find(
                                    (s) => s.id === serviceId
                                  );
                                  return service ? (
                                    <Badge
                                      key={serviceId}
                                      variant="outline"
                                      className="mr-1"
                                    >
                                      {service.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </TableCell>
                            <TableCell>{collection.price} د.إ</TableCell>
                            <TableCell>{collection.discount} د.إ</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => removeCollection(collection.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      لم يتم إضافة أي مجموعات بعد
                    </p>
                    <p className="text-sm text-muted-foreground">
                      اختر مجموعة من القائمة المنسدلة لإضافتها
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* 
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/salons/${salonId}`}>إلغاء</Link>
        </Button>
        <Button>حفظ التغييرات</Button>
      </div> */}
    </div>
  );
}
interface WorkingHourFormProps {
  workingHour?: WorkingHour | null;
  onSubmit: (data: WorkingHour) => void;
  availableDays: string[];
}
export function WorkingHourForm({ workingHour, onSubmit, availableDays }: WorkingHourFormProps) {
  const [formData, setFormData] = useState<WorkingHour>({
    id: workingHour?.id || '',
    day_of_week: workingHour?.day_of_week || '',
    is_closed: workingHour?.is_closed || false,
    opening_time: workingHour?.opening_time || '',
    closing_time: workingHour?.closing_time || '',
    break_start: workingHour?.break_start || '',
    break_end: workingHour?.break_end || '',
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>اليوم</Label>
        <Select
          value={formData.day_of_week}
          onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر اليوم" />
          </SelectTrigger>
          <SelectContent>
            {availableDays.map(day => (
              <SelectItem key={day} value={day}>
                {day === 'sunday' && 'الأحد'}
                {day === 'monday' && 'الإثنين'}
                {day === 'tuesday' && 'الثلاثاء'}
                {day === 'wednesday' && 'الأربعاء'}
                {day === 'thursday' && 'الخميس'}
                {day === 'friday' && 'الجمعة'}
                {day === 'saturday' && 'السبت'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>مغلق</Label>
        <Switch
          className="switch-custom"
          checked={formData.is_closed}
          onCheckedChange={(checked) => setFormData({ ...formData, is_closed: checked })}
        />
      </div>

      {!formData.is_closed && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>وقت الفتح</Label>
              <Select
                value={formData.opening_time}
                onValueChange={(value) => setFormData({ ...formData, opening_time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوقت" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${String(i).padStart(2, "0")}:00`}>
                      {`${String(i).padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>وقت الإغلاق</Label>
              <Select
                value={formData.closing_time}
                onValueChange={(value) => setFormData({ ...formData, closing_time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوقت" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${String(i).padStart(2, "0")}:00`}>
                      {`${String(i).padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>فترة الراحة</Label>
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={formData.break_start}
                onValueChange={(value) => setFormData({ ...formData, break_start: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="من" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_break">بدون راحة</SelectItem>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${String(i).padStart(2, "0")}:00`}>
                      {`${String(i).padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={formData.break_end}
                onValueChange={(value) => setFormData({ ...formData, break_end: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="إلى" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_break">بدون راحة</SelectItem>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${String(i).padStart(2, "0")}:00`}>
                      {`${String(i).padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onSubmit(formData)}>
          {workingHour ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </div>
  );
}