import EditAdvertisement from "@/components/advertisements/edit-advertisement"
import AdminLayout from "@/components/layout/admin-layout"

export default function EditAdvertisementPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <EditAdvertisement advertisementId={params.id} />
    </AdminLayout>
  )
}

