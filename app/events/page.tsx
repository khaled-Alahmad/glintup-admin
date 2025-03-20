import EventsManagement from "@/components/events/events-management";
import AdminLayout from "@/components/layout/admin-layout";

export default function EventsPage() {
  return (
    <AdminLayout>
      <EventsManagement />
    </AdminLayout>
  );
}
