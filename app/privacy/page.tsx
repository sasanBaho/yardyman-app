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

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#f9fafb" }}>
      <PageHeader title="Privacy Policy" />

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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "#111827" }}>Privacy Policy</h2>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#9ca3af" }}>Last updated: [Date]</p>
        <p style={{ margin: "0 0 32px", fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
          Your privacy matters to us. This policy explains how Yardyman collects, uses, and protects your information.
        </p>

        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <Section
            title="1. Information We Collect"
            body="We collect information you provide directly, such as your name, phone number, email address, and profile photo. We also collect location data to display your services on the map. [This section will be updated with the full data collection details.]"
          />
          <Section
            title="2. How We Use Your Information"
            body="We use your information to operate the platform, connect you with homeowners, process payments, and communicate with you about your account. [This section will be updated with detailed usage descriptions.]"
          />
          <Section
            title="3. Sharing of Information"
            body="We do not sell your personal information. Your public profile (name, photo, services, location) is visible to homeowners using the app. Payment processing is handled by Stripe. [This section will be updated with full sharing policy.]"
          />
          <Section
            title="4. Data Security"
            body="We use industry-standard security measures to protect your data. All data is stored securely using Firebase and transmitted over HTTPS. [This section will be updated with full security practices.]"
          />
          <Section
            title="5. Your Rights"
            body="You may request deletion of your account and associated data at any time through the app settings. [This section will be updated with full rights information including GDPR/CCPA compliance.]"
          />
          <Section
            title="6. Cookies & Analytics"
            body="We use analytics tools to understand how the platform is used and to improve our services. [This section will be updated with full cookie and analytics details.]"
          />
          <Section
            title="7. Contact"
            body="For privacy-related questions or requests, please contact us at privacy@yardyman.com."
          />
        </div>
      </div>
    </div>
  );
}
