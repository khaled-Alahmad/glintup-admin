import AdminLayout from "@/components/layout/admin-layout"
import NotificationsManagement from "@/components/notifications/notifications-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "إدارة الإشعارات | لوحة تحكم Glintup",
    description: "إدارة وعرض الإشعارات داخل منصة Glintup",
}

export default function NotificationsPage() {
    return (
        <AdminLayout>

            <NotificationsManagement />
        </AdminLayout>
    )
}
