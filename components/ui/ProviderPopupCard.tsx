"use client";
import React, { useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { trackEvent } from "@/lib/analytics";
import ReportModal from "./ReportModal";
import RatingModal from "./RatingModal";

export interface ProviderPopupCardProps {
  provider: any;
  onClose: () => void;
  activeService?: "snow" | "lawn";
}

const GreenCheck: React.FC = () => (
  <span style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#22c55e",
    flexShrink: 0,
  }}>
    <svg width={11} height={11} viewBox="0 0 20 20" fill="none">
      <path d="M5 10.5L9 14.5L15 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const StarRating: React.FC<{ rating: number; count: number }> = ({ rating, count }) => {
  const filled = Math.round(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={22} height={22} viewBox="0 0 24 24" fill={i < filled ? "#f7b500" : "none"} stroke={i < filled ? "#f7b500" : "#d1d5db"} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontWeight: 700, fontSize: 15, marginLeft: 4, color: "#222" }}>
        {rating > 0 ? rating.toFixed(1) : "0.0"}
      </span>
      <span style={{ fontSize: 14, color: "#888" }}>({count})</span>
    </div>
  );
};

const ProviderPopupCard: React.FC<ProviderPopupCardProps> = ({ provider, onClose, activeService }) => {
  const [showReport, setShowReport] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [displayRating, setDisplayRating] = useState<number>(provider?.rating ?? 0);
  const [displayCount, setDisplayCount] = useState<number>(provider?.ratingsCount ?? 0);
  if (!provider) return null;

  const phone = provider.phone || provider.phoneNumber || provider.contactNumber || "";
  const accentColor = activeService === "snow" ? "#09f" : "#22c55e";
  const serviceIcon = activeService === "snow" ? "/shovel-blue.png" : "/lawn-mower-green.png";

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

  return (
    <>
      {showReport && (
        <ReportModal
          providerId={provider.id || ""}
          providerName={provider.providerName || ""}
          onClose={() => setShowReport(false)}
        />
      )}
      {showRating && (
        <RatingModal
          providerId={provider.id || ""}
          providerName={provider.providerName || ""}
          onClose={() => setShowRating(false)}
          onRated={(avg, count) => {
            setDisplayRating(avg);
            setDisplayCount(count);
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          width: "calc(100vw - 32px)",
          maxWidth: 400,
          overflow: "hidden",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => { trackEvent("Provider_Details_Closed", getAnalyticsPayload()); onClose(); }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.07)",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
            zIndex: 1,
          }}
        >
          ×
        </button>

        {/* Top section: photo + CTA buttons */}
       <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "30px 16px 16px" }}>
          {/* Photo + name */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <img
                src={provider.imageUrl}
                alt={provider.providerName}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${accentColor}`,
                  display: "block",
                }}
              />
              <div style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#fff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}>
                <img src={serviceIcon} alt="service" style={{ width: 20, height: 20, objectFit: "contain" }} />
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: 17, textAlign: "center" }}>
              {provider.providerName}
            </span>
          </div>

          {/* Call / Message buttons */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              href={`tel:${phone}`}
              onClick={() => trackEvent("Provider_Call_Tapped", getAnalyticsPayload())}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#22c55e",
                color: "#fff",
                borderRadius: 999,
                padding: "13px 0",
                fontWeight: 700,
                fontSize: 17,
                textDecoration: "none",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.13h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.92a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              Call
            </a>
            <a
              href={`sms:${phone}`}
              onClick={() => trackEvent("Provider_Message_Tapped", getAnalyticsPayload())}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#fff",
                color: "#22c55e",
                border: "2px solid #22c55e",
                borderRadius: 999,
                padding: "11px 0",
                fontWeight: 700,
                fontSize: 17,
                textDecoration: "none",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Message
            </a>
          </div>
        </div>

        {/* Details section */}
        <div style={{ padding: "0 16px 12px" }}>
          {/* Tools */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
            <BsCircleFill color="#22c55e" size={9} />
            <span style={{ fontSize: 14, color: "#444" }}>
              {provider.hasTools ? "I have tools" : "I will use home-owner's tools"}
            </span>
          </div>

          {/* Description */}
          {provider.description ? (
            <p style={{ fontStyle: "italic", fontSize: 14, color: "#666", margin: "0 0 8px" }}>
              {provider.description}
            </p>
          ) : null}

          {/* Payment methods */}
          {provider.paymentMethods && provider.paymentMethods.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {provider.paymentMethods.map((method: string) => (
                <span key={method} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#444" }}>
                  <GreenCheck />
                  {method}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: stars + report */}
        <div style={{
          padding: "10px 16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #f3f4f6",
        }}>
          <div
            onClick={() => setShowRating(true)}
            style={{ cursor: "pointer" }}
            title="Tap to rate"
          >
            <StarRating rating={displayRating} count={displayCount} />
          </div>

          <button
            onClick={() => setShowReport(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#fffbeb",
              border: "1px solid #fcd34d",
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: 14,
              fontWeight: 600,
              color: "#92400e",
              cursor: "pointer",
            }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Report
          </button>
        </div>
      </div>
    </>
  );
};

export default ProviderPopupCard;
