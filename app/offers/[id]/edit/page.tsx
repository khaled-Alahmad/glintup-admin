import EditOffer from "@/components/offers/edit-offer"
import AdminLayout from "@/components/layout/admin-layout"

export default function EditOfferPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <EditOffer offerId={params.id} />
    </AdminLayout>
  )
}

