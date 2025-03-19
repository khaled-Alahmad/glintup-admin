import SalonDetails from "@/components/salons/salon-details"
import AdminLayout from "@/components/layout/admin-layout"

export default function SalonDetailsPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <SalonDetails salonId={params.id} />
    </AdminLayout>
  )
}

