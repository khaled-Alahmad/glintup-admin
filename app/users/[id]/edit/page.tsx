import EditUser from "@/components/users/edit-user"
import AdminLayout from "@/components/layout/admin-layout"

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <EditUser userId={params.id} />
    </AdminLayout>
  )
}

