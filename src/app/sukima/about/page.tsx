import type { Metadata } from "next";

import AboutPage from "@/components/sukima/pages/AboutPage";

export const metadata: Metadata = {
  title: "About the Organizer｜关于主催",
  description: "隙间月影的主催是谁，这个社团在做什么。",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <AboutPage />;
}
