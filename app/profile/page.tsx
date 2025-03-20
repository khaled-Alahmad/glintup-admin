import AdminLayout from "@/components/layout/admin-layout";
import AdminProfile from "@/components/profile/admin-profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الملف الشخصي | لوحة تحكم Glintup",
  description: "عرض وإدارة الملف الشخصي للمسؤول في منصة Glintup",
};

export default function ProfilePage() {
  return (
    <AdminLayout>
      <AdminProfile />
    </AdminLayout>
  );
}
