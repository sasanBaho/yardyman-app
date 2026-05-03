import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { trackEvent } from "@/lib/analytics";

export interface ProviderPopupCardProps {
  provider: any;
  onClose: () => void;
  activeService?: 'snow' | 'lawn';
}

const GreenCheckIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: '50%',
    background: '#09f',
    color: '#fff',
  }}>
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10.5L9 14.5L15 7.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
);

const ProviderPopupCard: React.FC<ProviderPopupCardProps> = ({ provider, onClose, activeService }) => {
  if (!provider) return null;

  // Helper to detect mobile device
  const isMobile = typeof window !== "undefined" && /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(window.navigator.userAgent);
  const phone = provider.phone || provider.phoneNumber || provider.contactNumber || "";

  // Format phone number as (XXX) XXX-XXXX if 10 digits
  function formatPhoneNumber(num: string) {
    if (!num) return '';
    const digits = num.replace(/\D/g, "");
    if (digits.length === 10) {
      return `(${digits.slice(0,3)})${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits[0] === '1') {
      // US country code
      return `+1 (${digits.slice(1,4)})${digits.slice(4,7)}-${digits.slice(7)}`;
    }
    // fallback: group as best as possible
    if (digits.length > 6) {
      return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    if (digits.length > 3) {
      return `${digits.slice(0,3)}-${digits.slice(3)}`;
    }
    return num;
  }

  function getAnalyticsPayload() {
    return {
      providerId: provider.id || "unknown",
      providerName: provider.providerName || "Unknown",
      serviceType: activeService || "unknown",
      hasTools: Boolean(provider.hasTools),
      rating: provider.rating ?? null,
      ratingsCount: provider.ratingsCount ?? 0,
      paymentMethodsCount: provider.paymentMethods?.length ?? 0,
      hasPhone: Boolean(phone),
    };
  }

  function handleClose() {
    trackEvent("Provider_Details_Closed", getAnalyticsPayload());
    onClose();
  }

  function handleCallTap() {
    trackEvent("Provider_Call_Tapped", getAnalyticsPayload());
  }

  function handleMessageTap() {
    trackEvent("Provider_Message_Tapped", getAnalyticsPayload());
  }

  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -60%)",
      zIndex: 100,
      background: "#fff",
      borderRadius: 20,
      boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
      padding: 24,
      minWidth: 320,
      maxWidth: 350,
      border: "1px solid #e0e0e0",
    }}>
      <button onClick={handleClose} style={{ position: "absolute", right: 16, top: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>×</button>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img src={provider.imageUrl} alt={provider.providerName} style={{ width: 72, height: 72, borderRadius: "50%", border: `2px solid ${activeService === 'lawn' ? '#1db954' : '#09f'}`}} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 20}}>{provider.providerName}</div>
          {phone && (
            <div style={{ fontWeight: 400, color: '#666', fontSize: 15, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span style={{ color: '#666', fontSize: 18, display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span>{formatPhoneNumber(phone)}</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 16, color: "#444", fontSize: 15, whiteSpace: "pre-line" }}>
        {provider.description}
      </div>
      <div style={{ marginTop: 10, color: "#444", fontSize: 15, whiteSpace: "pre-line" }}>
        {provider.hasTools ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <BsCircleFill color="#22c55e" size={10} />
            Has tools
          </span>
        ) : "❌ No tools"}
      </div>
      <div style={{ marginTop: 10, color: "#444", fontSize: 15, whiteSpace: "pre-line" }}>
        {provider.paymentMethods && provider.paymentMethods.length > 0 ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {provider.paymentMethods.map((method: string, idx: number) => (
              <span key={method} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <GreenCheckIcon/>
                {method}
              </span>
            ))} 
          </span>
        ) : "💳 No payment methods"}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
        {provider.rating && (
          <span style={{ color: "#f7b500", fontWeight: 600, fontSize: 15 }}>★ {provider.rating.toFixed(1)}</span>
        )}
        {provider.ratingsCount && (
          <span style={{ color: "#888", fontSize: 14 }}>({provider.ratingsCount})</span>
        )}
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
        {
          isMobile ? (
            <>
              <a
                href={`tel:${phone}`}
                onClick={handleCallTap}
                style={{ background: "#09f", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 16, cursor: "pointer", textDecoration: "none", display: "inline-block" }}
              >
                Call
              </a>
              <a
                href={`sms:${phone}`}
                onClick={handleMessageTap}
                style={{ background: "#fff", color: "#09f", border: "2px solid #09f", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 16, cursor: "pointer", textDecoration: "none", display: "inline-block" }}
              >
                Message
              </a>
            </>
          ) : null
        }
      </div>
    </div>
  );
};

export default ProviderPopupCard;
