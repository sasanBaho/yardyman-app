import { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Yardyman Blog — Tips for Lawn Care & Snow Removal Providers",
  description:
    "Practical tips and guides to help Yardyman providers attract more clients, work safely, and build a thriving yard care business. Written by the Yardyman team.",
  keywords: [
    "yardyman blog",
    "lawn care provider tips",
    "snow removal business tips",
    "how to grow yard care business",
    "yardyman provider guide",
  ],
  openGraph: {
    title: "Yardyman Blog — Tips for Lawn Care & Snow Removal Providers",
    description:
      "Practical guides to help Yardyman providers win more clients and grow their business.",
    type: "website",
  },
};

const POSTS = [
  {
    slug: "stand-out-profile-tips",
    category: "Provider Tips",
    title: "How to Catch Homeowners' Attention: Build a Profile That Gets You More Calls",
    excerpt:
      "Your profile is your storefront. Learn how the right photo, a detailed description, clear service area, and transparent pricing can dramatically increase the calls you receive.",
    readTime: "6 min",
    date: "May 6, 2025",
    accent: "#22c55e",
    iconPath: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  },
  {
    slug: "safe-job-practices",
    category: "Safety & Best Practices",
    title: "Always Call Before You Start: The Habit That Makes Every Job Professional and Safe",
    excerpt:
      "One 30-second phone call when you arrive protects you from disputes, impresses homeowners, and sets the tone for a job that earns five-star reviews.",
    readTime: "5 min",
    date: "May 6, 2025",
    accent: "#3b82f6",
    iconPath: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.13h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.92a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  },
  {
    slug: "10-tips-returning-customers",
    category: "Grow Your Business",
    title: "10 Proven Tips to Turn First-Time Clients Into Loyal, Returning Customers",
    excerpt:
      "Repeat customers are the backbone of a steady income. From business cards to follow-up messages, these 10 tips will help you build relationships that last for years.",
    readTime: "8 min",
    date: "May 6, 2025",
    accent: "#f97316",
    iconPath: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  },
];

function PageHeader() {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      background: "#fff",
      borderBottom: "1px solid #f3f4f6",
      padding: "14px 20px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      zIndex: 10,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <Link href="/" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#f3f4f6",
        textDecoration: "none",
        flexShrink: 0,
      }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>
      <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Blog</h1>
    </header>
  );
}

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#f9fafb" }}>
      <PageHeader />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 20px 80px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#f0fdf4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: 28, fontWeight: 800, color: "#111827" }}>
            Yardyman Blog
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: "#6b7280", lineHeight: 1.7, maxWidth: 500 }}>
            Practical tips and guides to help providers attract more clients, work professionally, and build a business that grows every season.
          </p>
        </div>

        {/* Post cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {POSTS.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 48,
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 16,
          padding: "28px 24px",
          textAlign: "center",
        }}>
          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 17, color: "#111827" }}>
            Not a provider yet?
          </p>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
            Join Yardyman and start connecting with homeowners in your area. It only takes a few minutes to create your profile.
          </p>
          <Link href="/" style={{
            display: "inline-block",
            background: "#22c55e",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 999,
            padding: "12px 28px",
            textDecoration: "none",
          }}>
            Become a Provider
          </Link>
        </div>
      </div>
    </div>
  );
}
