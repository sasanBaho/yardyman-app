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

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div style={{
      borderBottom: "1px solid #f3f4f6",
      paddingBottom: 20,
      marginBottom: 20,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#f0fdf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>{question}</p>
      </div>
      <p style={{ margin: "0 0 0 32px", fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{answer}</p>
    </div>
  );
}

export default function ProviderSupportPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#f9fafb" }}>
      <PageHeader title="Provider Support" />

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
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: "#111827" }}>Provider Support</h2>
        <p style={{ margin: "0 0 32px", fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
          Find answers to common questions, or reach out to our team directly.
        </p>

        {/* Contact card */}
        <div style={{
          background: "#f0fdf4",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#111827" }}>Need direct help?</p>
            <a href="mailto:support@yardyman.com" style={{ fontSize: 14, color: "#16a34a", textDecoration: "none", fontWeight: 600 }}>
              support@yardyman.com
            </a>
          </div>
        </div>

        {/* FAQ */}
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Frequently Asked Questions</h3>

        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <FaqItem
            question="How do I update my profile information?"
            answer="Tap your profile photo in the top navigation bar to open your provider profile. From there you can edit your name, photo, services, and payment methods. [This answer will be updated with detailed steps.]"
          />
          <FaqItem
            question="How do I manage my subscription?"
            answer="Open your profile from the top navigation bar and scroll to the 'My Subscription' section. You can view your billing dates and cancel or reactivate your subscription from there. [This answer will be updated.]"
          />
          <FaqItem
            question="How do homeowners find my profile?"
            answer="Once you create an account and enable availability, your profile appears as a pin on the Yardyman map for homeowners in your area. [This answer will be updated with details about visibility.]"
          />
          <FaqItem
            question="What happens after my free trial ends?"
            answer="After your 1-month free trial, your chosen subscription plan will begin billing. You can cancel at any time before the trial ends to avoid charges. [This answer will be updated.]"
          />
          <FaqItem
            question="How do I toggle my availability?"
            answer="Open your provider profile and use the availability toggle. When set to unavailable, your pin will be hidden from homeowners on the map. [This answer will be updated.]"
          />
          <FaqItem
            question="How do I delete my account?"
            answer="You can delete your account from the sidebar menu (tap the ☰ icon) under Account → Delete My Account. This permanently removes all your data from Yardyman. [This answer will be updated with full steps.]"
          />
        </div>
      </div>
    </div>
  );
}
