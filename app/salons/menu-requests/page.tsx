import MenuRequestsManagement from "@/components/salons/menu-requests-management";

export const metadata = {
  title: "طلبات القوائم",
  description: "إدارة طلبات القوائم من المزودين",
};

export default function MenuRequestsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">طلبات القوائم</h2>
      </div>
      <MenuRequestsManagement />
    </div>
  );
}
