import type { Metadata } from "next";

const BACKEND_URL = "http://localhost:3001/api";

export async function getSeoMetadata(page: string): Promise<Metadata> {
    try {
        // We use a direct fetch for server-side compatibility
        const res = await fetch(`${BACKEND_URL}/seo/page/${page}`, {
            next: { revalidate: 60 }, // Revalidate every minute
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) return {};
        const data = await res.json();

        // If backend returned the fallback object or valid SEO data
        if (!data || !data.title) return {};

        return {
            title: data.title,
            description: data.description,
            keywords: data.keywords ? data.keywords.split(',').map((k: string) => k.trim()) : [],
            openGraph: {
                title: data.ogTitle || data.title,
                description: data.ogDescription || data.description,
                images: data.ogImage ? [{ url: data.ogImage }] : [],
                type: 'website',
            },
            twitter: {
                card: (data.twitterCard as any) || 'summary_large_image',
                title: data.twitterTitle || data.ogTitle || data.title,
                description: data.twitterDescription || data.ogDescription || data.description,
                images: data.twitterImage ? [data.twitterImage] : data.ogImage ? [data.ogImage] : [],
            },
            alternates: {
                canonical: data.canonicalUrl || undefined,
            },
            authors: data.author ? [{ name: data.author }] : [],
            robots: data.robots || "index, follow",
            verification: {
                google: data.googleSiteVerification || undefined,
            }
        };
    } catch (error) {
        console.error(`[SEO-Master] Failed to fetch metadata for page: ${page}`, error);
        return {};
    }
}
