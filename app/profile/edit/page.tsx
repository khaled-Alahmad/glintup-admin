import AdminLayout from "@/components/layout/admin-layout";
import EditAdminProfile from "@/components/profile/edit-admin-profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تعديل الملف الشخصي | لوحة تحكم Glintup",
  description: "تعديل بيانات الملف الشخصي للمسؤول في منصة Glintup",
};

export default function EditProfilePage() {
  return (
    <AdminLayout>
      <EditAdminProfile />
    </AdminLayout>
  );
}
