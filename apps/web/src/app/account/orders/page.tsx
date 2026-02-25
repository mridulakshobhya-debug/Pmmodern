import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { OrdersPanel } from "@/components/account/orders-panel";

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account/profile" },
          { label: "Orders" }
        ]}
      />
      <h1 className="text-2xl font-bold">Order History</h1>
      <OrdersPanel />
    </div>
  );
}
