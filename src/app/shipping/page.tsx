import type { Metadata } from "next";

import { LegalPageBody } from "@/components/ui/LegalPageBody";
import { legalBySlug } from "@/lib/legal";

const page = legalBySlug("shipping")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  alternates: { canonical: "/shipping" },
};

export default function Page() {
  return <LegalPageBody page={page} />;
}
