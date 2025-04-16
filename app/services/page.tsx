import AdminLayout from "@/components/layout/admin-layout";
import ServicesManagement from "@/components/services/services-management";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة المجموعات | لوحة تحكم Glintup",
  description: "إدارة خدمات التجميل والعناية في منصة Glintup",
};

export default function ServicesPage() {
  return (
    <AdminLayout>
      <ServicesManagement />
    </AdminLayout>
  );
}
