import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProfilePanel } from "@/components/account/profile-panel";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account/profile" },
          { label: "Profile" }
        ]}
      />
      <ProfilePanel />
    </div>
  );
}
