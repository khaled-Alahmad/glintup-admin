import EditSalon from "@/components/salons/edit-salon"
import AdminLayout from "@/components/layout/admin-layout"

export default function EditSalonPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <EditSalon salonId={params.id} />
    </AdminLayout>
  )
}

