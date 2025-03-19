import EditAppointment from "@/components/appointments/edit-appointment"
import AdminLayout from "@/components/layout/admin-layout"

export default function EditAppointmentPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <EditAppointment appointmentId={params.id} />
    </AdminLayout>
  )
}

