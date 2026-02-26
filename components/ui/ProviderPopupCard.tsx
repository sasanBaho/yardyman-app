import React from "react";

interface ProviderPopupCardProps {
  provider: any;
  onClose: () => void;
}

const ProviderPopupCard: React.FC<ProviderPopupCardProps> = ({ provider, onClose }) => {
  if (!provider) return null;

  // Helper to detect mobile device
  const isMobile = typeof window !== "undefined" && /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(window.navigator.userAgent);
  const phone = provider.phone || provider.phoneNumber || provider.contactNumber || "";

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
      <button onClick={onClose} style={{ position: "absolute", right: 16, top: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>×</button>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img src={provider.imageUrl} alt={provider.providerName} style={{ width: 72, height: 72, borderRadius: "50%", border: "2px solid #fff"}} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 20 }}>{provider.providerName}</div>
          {provider.instagramID && (
            <div style={{ color: "#e1306c", fontWeight: 500, marginTop: 2 }}>
              <span style={{ marginRight: 4 }}>@</span>{provider.instagramID}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 16, color: "#444", fontSize: 15, whiteSpace: "pre-line" }}>
        {provider.description}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
        {provider.rating && (
          <span style={{ color: "#f7b500", fontWeight: 600, fontSize: 18 }}>★ {provider.rating.toFixed(1)}</span>
        )}
        {provider.ratingsCount && (
          <span style={{ color: "#888", fontSize: 14 }}>({provider.ratingsCount})</span>
        )}
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
        {isMobile ? (
          <>
            <a
              href={phone ? `tel:${phone}` : undefined}
              style={{ background: "#09f", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 16, cursor: phone ? "pointer" : "not-allowed", textDecoration: "none", display: "inline-block" }}
            >
              Call
            </a>
            <a
              href={phone ? `sms:${phone}` : undefined}
              style={{ background: "#fff", color: "#09f", border: "2px solid #09f", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 16, cursor: phone ? "pointer" : "not-allowed", textDecoration: "none", display: "inline-block" }}
            >
              Message
            </a>
          </>
        ) : (
          phone ? (
            <div style={{ fontWeight: 600, fontSize: 16, color: "#222", background: "#f7f7f7", borderRadius: 8, padding: "8px 18px", border: "1px solid #e0e0e0" }}>
              {phone}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ProviderPopupCard;
