import { getSeoMetadata } from "@/lib/seo-server";
import HomeContent from "@/components/HomeContent";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch dynamic SEO settings for "home" page
  return await getSeoMetadata("home");
}

export default function Home() {
  return <HomeContent />;
}
