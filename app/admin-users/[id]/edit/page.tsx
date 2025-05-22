import EditAdminUser from "@/components/admin-users/edit-admin-user";
import AdminLayout from "@/components/layout/admin-layout";

interface EditAdminUserPageProps {
  params: {
    id: string;
  };
}

export default function EditAdminUserPage({ params }: EditAdminUserPageProps) {
  return (
    <AdminLayout>
      <EditAdminUser id={params.id} />
    </AdminLayout>
  );
}
