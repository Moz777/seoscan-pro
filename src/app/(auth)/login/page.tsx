import { Metadata } from "next";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your SEOScan Pro account to access your SEO audits and reports.",
};

export default function LoginPage() {
  return <LoginForm />;
}
