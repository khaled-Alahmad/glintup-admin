import UserDetails from "@/components/users/user-details"
import AdminLayout from "@/components/layout/admin-layout"

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <UserDetails userId={params.id} />
    </AdminLayout>
  )
}

