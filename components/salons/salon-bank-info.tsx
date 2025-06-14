import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { addData } from "@/lib/apiHelper";

interface SalonFormData {
    service_location: string;
    bank_name: string;
    bank_account_number: string;
    bank_account_holder_name: string;
    bank_account_iban: string;
    vat_number: string;
    services_list: string;
    trade_license: string;
    vat_certificate: string;
    bank_account_certificate: string;
    [key: string]: any; // For other fields that might exist in formData
}

interface SalonBankInfoProps {
    formData: SalonFormData;
    setFormData: React.Dispatch<React.SetStateAction<SalonFormData>>;
    servicesListFile: File | null;
    setServicesListFile: React.Dispatch<React.SetStateAction<File | null>>;
    tradeLicenseFile: File | null;
    setTradeLicenseFile: React.Dispatch<React.SetStateAction<File | null>>;
    vatCertificateFile: File | null;
    setVatCertificateFile: React.Dispatch<React.SetStateAction<File | null>>;
    bankAccountCertificateFile: File | null;
    setBankAccountCertificateFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export function SalonBankInfo({
    formData,
    setFormData,
    servicesListFile,
    setServicesListFile,
    tradeLicenseFile,
    setTradeLicenseFile,
    vatCertificateFile,
    setVatCertificateFile,
    bankAccountCertificateFile,
    setBankAccountCertificateFile,
}: SalonBankInfoProps) {
    console.log("form data", formData);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="service_location">
                    موقع تقديم الخدمة <span className="text-red-500">*</span>
                </Label>
                <Select
                    required
                    value={formData.service_location}
                    onValueChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            service_location: value,
                        }))
                    }
                >
                    <SelectTrigger id="service_location">
                        <SelectValue placeholder="اختر موقع تقديم الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="in_center">في المركز</SelectItem>
                        <SelectItem value="in_house">في المنزل</SelectItem>
                        <SelectItem value="in_house_and_center">في المركز والمنزل</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="bank_name">
                        اسم البنك <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="bank_name"
                        value={formData.bank_name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                bank_name: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bank_account_number">
                        رقم الحساب البنكي <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="bank_account_number"
                        value={formData.bank_account_number}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                bank_account_number: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="bank_account_holder_name">
                        اسم صاحب الحساب البنكي <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="bank_account_holder_name"
                        value={formData.bank_account_holder_name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                bank_account_holder_name: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bank_account_iban">
                        رقم الآيبان <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="bank_account_iban"
                        value={formData.bank_account_iban}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                bank_account_iban: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="vat_number">
                        الرقم الضريبي <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="vat_number"
                        value={formData.vat_number}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                vat_number: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
            </div>

            {/* قائمة الخدمات PDF */}
            <div className="space-y-4">
                <Label htmlFor="services_list">
                    قائمة الخدمات (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Label htmlFor="services_list" className="mt-4 w-full">
                        <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                                اسحب وأفلت ملف PDF هنا أو انقر للتصفح
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF حتى 10MB
                            </p>
                        </div>
                        <Input
                            id="services_list"
                            type="file"
                            accept="application/pdf"
                            className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    try {
                                        const uploadFormData = new FormData();
                                        uploadFormData.append("file", file);
                                        uploadFormData.append("folder", "salons");

                                        const response = await addData("general/upload-file", uploadFormData);

                                        if (response.success) {
                                            setServicesListFile(file);
                                            setFormData((prev) => ({
                                                ...prev,
                                                services_list: response.data.file_name,
                                            }));
                                        }
                                    } catch (error) {
                                        console.error("File upload failed:", error);
                                        toast({
                                            title: "خطأ في رفع الملف",
                                            description: "تعذر رفع الملف، الرجاء المحاولة مرة أخرى",
                                            variant: "destructive",
                                        });
                                    }
                                }
                            }}
                            required
                        />
                    </Label>
                    {formData.services_list && (
                        <div className="flex items-center mt-2">
                            <FileText className="h-5 w-5 text-gray-500 mr-2" />
                            <a href={formData.services_list_url} target="_blank" className="text-sm text-gray-700">
                                {formData.services_list}
                            </a>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="mr-2"
                                onClick={() => {
                                    setServicesListFile(null);
                                    setFormData((prev) => ({
                                        ...prev,
                                        services_list: "",
                                    }));
                                }}
                            >
                                <span className="sr-only">حذف</span>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* الرخصة التجارية PDF */}
            <div className="space-y-4">
                <Label htmlFor="trade_license">
                    الرخصة التجارية (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Label htmlFor="trade_license" className="mt-4 w-full">
                        <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                                اسحب وأفلت ملف PDF هنا أو انقر للتصفح
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF حتى 10MB
                            </p>
                        </div>
                        <Input
                            id="trade_license"
                            type="file"
                            accept="application/pdf"
                            className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    try {
                                        const uploadFormData = new FormData();
                                        uploadFormData.append("file", file);
                                        uploadFormData.append("folder", "salons");

                                        const response = await addData("general/upload-file", uploadFormData);

                                        if (response.success) {
                                            setTradeLicenseFile(file);
                                            setFormData((prev) => ({
                                                ...prev,
                                                trade_license: response.data.file_name,
                                            }));
                                        }
                                    } catch (error) {
                                        console.error("File upload failed:", error);
                                        toast({
                                            title: "خطأ في رفع الملف",
                                            description: "تعذر رفع الملف، الرجاء المحاولة مرة أخرى",
                                            variant: "destructive",
                                        });
                                    }
                                }
                            }}
                            required
                        />
                    </Label>
                    {formData.trade_license && (
                        <div className="flex items-center mt-2">
                            <FileText className="h-3 w-5 text-gray-500 mr-2" />
                            <a href={formData.trade_license_url} className="text-sm text-gray-700">
                                {formData.trade_license}
                            </a>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="mr-2"
                                onClick={() => {
                                    setTradeLicenseFile(null);
                                    setFormData((prev) => ({
                                        ...prev,
                                        trade_license: "",
                                    }));
                                }}
                            >
                                <span className="sr-only">حذف</span>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* شهادة ضريبة القيمة المضافة PDF */}
            <div className="space-y-4">
                <Label htmlFor="vat_certificate">
                    شهادة ضريبة القيمة المضافة (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Label htmlFor="vat_certificate" className="mt-4 w-full">
                        <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                                اسحب وأفلت ملف PDF هنا أو انقر للتصفح
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF حتى 10MB
                            </p>
                        </div>
                        <Input
                            id="vat_certificate"
                            type="file"
                            accept="application/pdf"
                            className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    try {
                                        const uploadFormData = new FormData();
                                        uploadFormData.append("file", file);
                                        uploadFormData.append("folder", "salons");

                                        const response = await addData("general/upload-file", uploadFormData);

                                        if (response.success) {
                                            setVatCertificateFile(file);
                                            setFormData((prev) => ({
                                                ...prev,
                                                vat_certificate: response.data.file_name,
                                            }));
                                        }
                                    } catch (error) {
                                        console.error("File upload failed:", error);
                                        toast({
                                            title: "خطأ في رفع الملف",
                                            description: "تعذر رفع الملف، الرجاء المحاولة مرة أخرى",
                                            variant: "destructive",
                                        });
                                    }
                                }
                            }}
                            required
                        />
                    </Label>
                    {formData.vat_certificate && (
                        <div className="flex items-center mt-2">
                            <FileText className="h-5 w-5 text-gray-500 mr-2" />
                            <a href={formData.vat_certificate_url} className="text-sm text-gray-700">
                                {formData.vat_certificate}
                            </a>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="ml-2"
                                onClick={() => {
                                    setVatCertificateFile(null);
                                    setFormData((prev) => ({
                                        ...prev,
                                        vat_certificate: "",
                                    }));
                                }}
                            >
                                <span className="sr-only">حذف</span>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* شهادة الحساب البنكي PDF */}
            <div className="space-y-4">
                <Label htmlFor="bank_account_certificate">
                    شهادة الحساب البنكي (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Label htmlFor="bank_account_certificate" className="mt-4 w-full">
                        <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                                اسحب وأفلت ملف PDF هنا أو انقر للتصفح
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF حتى 10MB
                            </p>
                        </div>
                        <Input
                            id="bank_account_certificate"
                            type="file"
                            accept="application/pdf"
                            className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    try {
                                        const uploadFormData = new FormData();
                                        uploadFormData.append("file", file);
                                        uploadFormData.append("folder", "salons");

                                        const response = await addData("general/upload-file", uploadFormData);

                                        if (response.success) {
                                            setBankAccountCertificateFile(file);
                                            setFormData((prev) => ({
                                                ...prev,
                                                bank_account_certificate: response.data.file_name,
                                            }));
                                        }
                                    } catch (error) {
                                        console.error("File upload failed:", error);
                                        toast({
                                            title: "خطأ في رفع الملف",
                                            description: "تعذر رفع الملف، الرجاء المحاولة مرة أخرى",
                                            variant: "destructive",
                                        });
                                    }
                                }
                            }}
                            required
                        />
                    </Label>
                    {formData
                        .bank_account_certificate && (
                            <div className="flex items-center mt-2">
                                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                                <a href={formData.bank_account_certificate_url} className="text-sm text-gray-700">
                                    {formData.bank_account_certificate}
                                </a>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() => {
                                        setBankAccountCertificateFile(null);
                                        setFormData((prev) => ({
                                            ...prev,
                                            bank_account_certificate: "",
                                        }));
                                    }}
                                >
                                    <span className="sr-only">حذف</span>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
