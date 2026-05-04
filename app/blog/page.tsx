import Link from "next/link";

function PageHeader({ title }: { title: string }) {
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
      <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{title}</h1>
    </header>
  );
}

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#f9fafb" }}>
      <PageHeader title="Blog" />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "36px 20px" }}>
        {/* Icon + heading */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#f0fdf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: "#111827" }}>Yardyman Blog</h2>
        <p style={{ margin: "0 0 32px", fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
          Tips, seasonal guides, and updates from the Yardyman team.
        </p>

        {/* Coming soon notice */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "28px 24px",
          textAlign: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          marginBottom: 24,
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#f0fdf4",
            color: "#16a34a",
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 999,
            padding: "5px 14px",
            marginBottom: 16,
          }}>
            Coming Soon
          </div>
          <p style={{ margin: 0, fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
            We're working on helpful content about lawn care, snow removal, and how to grow your provider business. Check back soon!
          </p>
        </div>

        {/* Placeholder article cards */}
        {[
          "How to prepare your lawn for spring",
          "Top 5 snow removal tips for homeowners",
          "Why hiring a local provider makes a difference",
        ].map((title, i) => (
          <div key={i} style={{
            background: "#fff",
            borderRadius: 14,
            padding: "18px 20px",
            marginBottom: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#f3f4f6",
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: 6 }}>{title}</div>
              <div style={{ height: 10, background: "#f3f4f6", borderRadius: 4, marginBottom: 5, width: "80%" }} />
              <div style={{ height: 10, background: "#f3f4f6", borderRadius: 4, width: "55%" }} />
              <div style={{ marginTop: 10, fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Coming soon</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
