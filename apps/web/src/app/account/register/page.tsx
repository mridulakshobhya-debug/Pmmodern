import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { RegisterForm } from "@/components/account/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account/profile" },
          { label: "Register" }
        ]}
      />
      <RegisterForm />
    </div>
  );
}
