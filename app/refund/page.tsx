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

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.8, margin: 0 }}>{body}</p>
    </div>
  );
}

export default function RefundPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#f9fafb" }}>
      <PageHeader title="Refund Policy" />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "36px 20px" }}>
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
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "#111827" }}>Refund Policy</h2>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#9ca3af" }}>Last updated: [Date]</p>
        <p style={{ margin: "0 0 32px", fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
          We want you to be satisfied with your Yardyman subscription. Please review our refund policy below.
        </p>

        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <Section
            title="1. Free Trial Period"
            body="All new provider accounts include a 1-month free trial. No charges are made during the trial period. You may cancel anytime before the trial ends without being charged. [This section will be updated with full trial terms.]"
          />
          <Section
            title="2. Monthly Subscriptions"
            body="Monthly subscriptions are billed at the start of each billing cycle. If you cancel, you retain access until the end of the current period. Monthly subscription fees are generally non-refundable. [This section will be updated with detailed monthly refund terms.]"
          />
          <Section
            title="3. Quarterly & Yearly Subscriptions"
            body="Quarterly and yearly plans are billed upfront. If you cancel within [X] days of a renewal charge, you may be eligible for a prorated refund. [This section will be updated with exact refund eligibility criteria.]"
          />
          <Section
            title="4. Exceptional Circumstances"
            body="Refunds may be granted at our discretion in exceptional circumstances, such as billing errors or technical issues that prevented use of the service. [This section will be updated with full eligibility details.]"
          />
          <Section
            title="5. How to Request a Refund"
            body="To request a refund, contact our support team at support@yardyman.com with your account details and reason for the request. We aim to respond within 3–5 business days."
          />
        </div>
      </div>
    </div>
  );
}
