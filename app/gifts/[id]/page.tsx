import EditGift from "@/components/gifts/edit-gift";
import AdminLayout from "@/components/layout/admin-layout";

interface EditGiftPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGiftPage({ params }: EditGiftPageProps) {
  const { id } = await params;
  
  return (
    <AdminLayout>
      <EditGift giftId={id} />
    </AdminLayout>
  );
}
