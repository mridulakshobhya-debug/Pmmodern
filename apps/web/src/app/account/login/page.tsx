import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { LoginForm } from "@/components/account/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account/profile" },
          { label: "Login" }
        ]}
      />
      <LoginForm />
    </div>
  );
}
