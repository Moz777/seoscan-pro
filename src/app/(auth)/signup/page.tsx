import { Metadata } from "next";
import { SignupForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your SEOScan Pro account and start auditing your website in less than 2 minutes.",
};

export default function SignupPage() {
  return <SignupForm />;
}
