import { getSeoMetadata } from "@/lib/seo-server";
import AboutContent from "@/components/AboutContent";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    // Fetch dynamic SEO settings for "about" page from SEO Master
    return await getSeoMetadata("about");
}

export default function AboutPage() {
    return <AboutContent />;
}
