"use client";
import React, { useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import SelectServicesModal, { ServicesFormData } from "./SelectServicesModal";

export interface ProviderProfile {
  uid: string;
  name: string;
  phone: string;
  email: string;
  photoUrl: string;
  city: string;
  selectedServices: string[];
  descriptions: Record<string, string>;
  hasTools: boolean;
  paymentMethods: string[];
  isAvailable: boolean;
  profileViews: number;
}

interface ProviderProfileModalProps {
  profile: ProviderProfile;
  onClose: () => void;
  onAvailabilityChange?: (isAvailable: boolean) => void;
  onProfileUpdated?: (updated: ProviderProfile) => void;
}

const SERVICE_META: Record<string, { shortName: string; icon: string }> = {
  "service-one": { shortName: "Lawn Care", icon: "/lawn-mower-green.png" },
  "service-two": { shortName: "Snow Removal", icon: "/shovel-blue.png" },
};

const GreenCheck: React.FC = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "#22c55e",
      flexShrink: 0,
    }}
  >
    <svg width={11} height={11} viewBox="0 0 20 20" fill="none">
      <path
        d="M5 10.5L9 14.5L15 7.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const ProviderProfileModal: React.FC<ProviderProfileModalProps> = ({
  profile,
  onClose,
  onAvailabilityChange,
  onProfileUpdated,
}) => {
  const [isAvailable, setIsAvailable] = useState(profile.isAvailable);
  const [profileState, setProfileState] = useState(profile);
  const [showEditServices, setShowEditServices] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "providers", profile.uid)).then((snap) => {
      if (snap.exists()) {
        setIsAvailable(snap.data().isAvailable ?? true);
      }
    });
  }, []);

  const handleToggle = async () => {
    const next = !isAvailable;
    setIsAvailable(next);
    onAvailabilityChange?.(next);
    try {
      await updateDoc(doc(db, "providers", profile.uid), { isAvailable: next });
    } catch {
      setIsAvailable(!next);
    }
  };

  const handleServicesDone = async (data: ServicesFormData) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "providers", profile.uid), {
        selectedServices: data.selectedServices,
        description: data.descriptions,
        hasTools: data.hasTools,
        paymentMethods: data.paymentMethods,
      });
      const updated: ProviderProfile = {
        ...profileState,
        selectedServices: data.selectedServices,
        descriptions: data.descriptions,
        hasTools: data.hasTools,
        paymentMethods: data.paymentMethods,
      };
      setProfileState(updated);
      onProfileUpdated?.(updated);
    } finally {
      setSaving(false);
      setShowEditServices(false);
    }
  };

  if (showEditServices) {
    return (
      <SelectServicesModal
        onClose={() => setShowEditServices(false)}
        onDone={handleServicesDone}
        initialData={{
          selectedServices: profileState.selectedServices,
          descriptions: profileState.descriptions,
          hasTools: profileState.hasTools,
          paymentMethods: profileState.paymentMethods,
        }}
      />
    );
  }

  if (saving) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 40px", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "4px solid #e0e0e0", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Saving changes…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "92dvh",
          overflowY: "auto",
          borderRadius: "20px 20px 0 0",
          background: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(180deg, #c8c8c8 0%, #e2f0e2 100%)",
            padding: "20px 20px 28px",
            borderRadius: "20px 20px 0 0",
            position: "relative",
            textAlign: "center",
          }}
        >
          <span style={{ position: "absolute", top: 18, left: 18, fontSize: 13, color: "#555" }}>
            Profile views: {profileState.profileViews}
          </span>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#22c55e",
              border: "none",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            ×
          </button>

          {/* Avatar */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: 14,
              marginTop: 8,
            }}
          >
            {profileState.photoUrl ? (
              <img
                src={profileState.photoUrl}
                alt={profileState.name}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #22c55e",
                }}
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "#ccc",
                  border: "3px solid #22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {profileState.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <path
                  d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              {profileState.name}
            </span>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              aria-label="Edit name"
            >
              <svg
                width={17}
                height={17}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>

          {/* Location + phone */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              fontSize: 14,
              color: "#555",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span>{profileState.city}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.13h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.92a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>{profileState.phone}</span>
            </div>
          </div>
        </div>

        {/* Availability toggle */}
        <div
          style={{
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              marginBottom: 6,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 17 }}>I'm available</span>
            <button
              onClick={handleToggle}
              style={{
                width: 52,
                height: 30,
                borderRadius: 999,
                border: "none",
                background: isAvailable ? "#22c55e" : "#bbb",
                cursor: "pointer",
                position: "relative",
                padding: 0,
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: isAvailable ? 24 : 3,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  display: "block",
                }}
              />
            </button>
          </div>
          <p style={{ textAlign: "center", color: "#888", fontSize: 13, margin: 0 }}>
            We will NOT show you on the map if you are not available
          </p>
        </div>

        {/* Services */}
        <div style={{ padding: "20px 20px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 17 }}>Your Services:</span>
            <button
              onClick={() => setShowEditServices(true)}
              style={{
                background: "none",
                border: "none",
                color: "#22c55e",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
          </div>

          {profileState.selectedServices.map((id) => {
            const meta = SERVICE_META[id];
            if (!meta) return null;
            return (
              <div key={id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <img
                    src={meta.icon}
                    alt={meta.shortName}
                    style={{ width: 28, height: 28, objectFit: "contain" }}
                  />
                  <span style={{ fontSize: 16, color: "#555", fontWeight: 500 }}>
                    {meta.shortName}
                  </span>
                </div>
                <p style={{ color: "#666", fontSize: 14, margin: "0 0 6px 38px" }}>
                  {profileState.descriptions[id]}
                </p>
                {id === "service-two" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginLeft: 38,
                      fontSize: 14,
                      color: "#555",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#22c55e",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {profileState.hasTools ? "I have tools" : "I will use home-owner's tools"}
                  </div>
                )}
              </div>
            );
          })}

          {/* Payment Methods */}
          <div style={{ paddingBottom: 40, marginTop: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 17, display: "block", marginBottom: 12 }}>
              Payment Methods:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {profileState.paymentMethods.map((method) => (
                <span
                  key={method}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15 }}
                >
                  <GreenCheck />
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileModal;
