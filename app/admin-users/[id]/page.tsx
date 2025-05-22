import AdminUserDetails from "@/components/admin-users/admin-user-details";
import AdminLayout from "@/components/layout/admin-layout";

interface AdminUserDetailsPageProps {
  params: {
    id: string;
  };
}

export default function AdminUserDetailsPage({
  params,
}: AdminUserDetailsPageProps) {
  return (
    <AdminLayout>
      <AdminUserDetails id={params.id} />
    </AdminLayout>
  );
}
