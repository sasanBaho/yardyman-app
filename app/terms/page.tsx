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

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#f9fafb" }}>
      <PageHeader title="Terms of Use" />

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
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "#111827" }}>Terms of Use</h2>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#9ca3af" }}>Last updated: [Date]</p>
        <p style={{ margin: "0 0 32px", fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
          By using Yardyman, you agree to the following terms. Please read them carefully.
        </p>

        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <Section
            title="1. Acceptance of Terms"
            body="By accessing or using the Yardyman platform, you agree to be bound by these Terms of Use. If you do not agree, you may not use our services. [This section will be updated with the full acceptance clause.]"
          />
          <Section
            title="2. Use of the Service"
            body="Yardyman connects homeowners with local service providers for lawn care and snow removal. You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others. [This section will be updated with detailed usage terms.]"
          />
          <Section
            title="3. Account Registration"
            body="Service providers must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials. [This section will be updated with full registration requirements.]"
          />
          <Section
            title="4. Payments & Subscriptions"
            body="Provider accounts require an active subscription. Subscription fees are billed according to your chosen plan. A 1-month free trial is available for new accounts. [This section will be updated with full payment terms.]"
          />
          <Section
            title="5. Termination"
            body="We reserve the right to suspend or terminate accounts that violate these terms. You may cancel your subscription at any time through your account settings. [This section will be updated with full termination policy.]"
          />
          <Section
            title="6. Changes to Terms"
            body="We may update these Terms from time to time. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms. [This section will be updated with the full change notification process.]"
          />
          <Section
            title="7. Contact"
            body="If you have any questions about these Terms, please contact us at support@yardyman.com."
          />
        </div>
      </div>
    </div>
  );
}
