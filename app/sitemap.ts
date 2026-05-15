import type { MetadataRoute } from "next";

const BASE_URL = "https://yardyman.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${BASE_URL}/faq`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/privacy`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/terms`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/refund`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/feedback`, priority: 0.3, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/provider-support`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/how-to-enable-location`, priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const blogPosts = [
    "lawn-mowing-side-hustle",
    "10-tips-returning-customers",
    "stand-out-profile-tips",
    "safe-job-practices",
    "yardyman-vs-uber",
  ].map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...blogPosts].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
