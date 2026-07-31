import type { Metadata } from "next";
import BirthdayPage from "@/components/slaega/pages/BirthdayPage";

export const metadata: Metadata = {
  title: "Happy Birthday — slaega",
};

export default function Page() {
  return <BirthdayPage />;
}
