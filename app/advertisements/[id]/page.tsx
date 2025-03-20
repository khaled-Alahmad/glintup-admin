import AdvertisementDetails from "@/components/advertisements/advertisement-details";
import AdminLayout from "@/components/layout/admin-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل الإعلان | لوحة تحكم Glintup",
  description: "عرض تفاصيل الإعلان في منصة Glintup",
};

interface AdvertisementPageProps {
  params: {
    id: string;
  };
}

export default function AdvertisementPage({ params }: AdvertisementPageProps) {
  return (
    <AdminLayout>
      <AdvertisementDetails advertisementId={params.id} />
    </AdminLayout>
  );
}
