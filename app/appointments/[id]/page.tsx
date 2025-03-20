import AppointmentDetails from "@/components/appointments/appointment-details";
import AdminLayout from "@/components/layout/admin-layout";

export default function AppointmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AdminLayout>
      <AppointmentDetails appointmentId={params.id} />
    </AdminLayout>
  );
}
