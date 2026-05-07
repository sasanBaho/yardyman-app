"use client";
import React, { useEffect, useRef, useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "@/firebase";
import { signOut } from "firebase/auth";
import SelectServicesModal, { ServicesFormData } from "./SelectServicesModal";
import ImageCropModal from "./ImageCropModal";
import SubscriptionModal from "./SubscriptionModal";
import { BsCircleFill } from "react-icons/bs";

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
  subscriptionStatus?: string;
  rating?: number;
  ratingsCount?: number;
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
  useBodyScrollLock();

  const [isAvailable, setIsAvailable] = useState(profile.isAvailable);
  const [profileState, setProfileState] = useState(profile);
  const [showEditServices, setShowEditServices] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [savingName, setSavingName] = useState(false);
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState<string | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    status: string;
    created: number;
    trialEnd: number | null;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
  } | null>(null);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [reactivatingSubscription, setReactivatingSubscription] = useState(false);
  const [showSubscriptionPlanModal, setShowSubscriptionPlanModal] = useState(false);
  const [subscribeModalLoading, setSubscribeModalLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getDoc(doc(db, "providers", profile.uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setIsAvailable(data.isAvailable ?? true);
        setProfileState((prev) => ({
          ...prev,
          profileViews: data.profileViewCount ?? prev.profileViews,
        }));
        const subId = data.stripeSubscriptionId ?? null;
        setStripeSubscriptionId(subId);
        if (subId) {
          fetch(`/api/stripe/subscription?subscriptionId=${subId}`)
            .then((r) => r.json())
            .then((info) => { if (!info.error) setSubscriptionInfo(info); })
            .catch(() => {});
        }
      }
    });
  }, []);

  const isSubscriptionInactive =
    profile.subscriptionStatus === "unsubscribed" ||
    subscriptionInfo?.cancelAtPeriodEnd === true ||
    (subscriptionInfo !== null && !["active", "trialing"].includes(subscriptionInfo.status));

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

  const handleSubscribeNow = async (priceId: string) => {
    setSubscribeModalLoading(true);
    try {
      localStorage.setItem("stripeReturn", JSON.stringify({ uid: profile.uid }));
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: profile.uid, email: profile.email, phone: profile.phone, priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setSubscribeModalLoading(false);
    }
  };

  const handlePhotoFileSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setCropSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePhotoCropDone = async (dataUrl: string) => {
    setCropSrc(null);
    setUploadingPhoto(true);
    try {
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      const u8 = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
      const blob = new Blob([u8], { type: mime });
      const sRef = storageRef(storage, `provider_profiles/${profile.uid}/profile.jpg`);
      await uploadBytes(sRef, blob, { contentType: "image/jpeg" });
      const url = await getDownloadURL(sRef);
      await updateDoc(doc(db, "providers", profile.uid), { imageUrl: url });
      const updated = { ...profileState, photoUrl: url };
      setProfileState(updated);
      onProfileUpdated?.(updated);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleNameSave = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === profileState.name) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      await updateDoc(doc(db, "providers", profile.uid), { providerName: trimmed });
      const updated = { ...profileState, name: trimmed };
      setProfileState(updated);
      onProfileUpdated?.(updated);
    } finally {
      setSavingName(false);
      setEditingName(false);
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

  if (cropSrc) {
    return (
      <ImageCropModal
        src={cropSrc}
        onCrop={handlePhotoCropDone}
        onCancel={() => setCropSrc(null)}
      />
    );
  }

  if (uploadingPhoto) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 40px", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "4px solid #e0e0e0", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Uploading photo…</p>
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
      {showSubscriptionPlanModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionPlanModal(false)}
          onPlanSelected={handleSubscribeNow}
          loading={subscribeModalLoading}
        />
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => { if (e.target.files?.[0]) handlePhotoFileSelected(e.target.files[0]); e.target.value = ""; }} />

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
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: 14,
              marginTop: 8,
              cursor: "pointer",
            }}
          >
            {profileState.photoUrl ? (
              <div
                style={{
                  width: 103,
                  height: 103,
                  borderRadius: "50%",
                  background: "#22c55e" , // outer colored circle
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
              <img
                src={profileState.photoUrl}
                alt={profileState.name}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #fff",
                }}
              />
              </div>
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
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              aria-label="Change profile photo"
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#22c55e",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
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
            </button>
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
            {editingName ? (
              <>
                <input
                  ref={nameInputRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                  autoFocus
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    border: "none",
                    borderBottom: "2px solid #22c55e",
                    outline: "none",
                    background: "transparent",
                    textAlign: "center",
                    width: 180,
                    padding: "2px 4px",
                  }}
                />
                <button
                  onClick={handleNameSave}
                  disabled={savingName}
                  style={{
                    background: "#22c55e",
                    border: "none",
                    borderRadius: 999,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "4px 12px",
                    cursor: savingName ? "not-allowed" : "pointer",
                  }}
                >
                  {savingName ? "…" : "Done"}
                </button>
              </>
            ) : (
              <>
                <span
                  onClick={() => { setNameInput(profileState.name); setEditingName(true); }}
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {profileState.name}
                </span>
                <button
                  onClick={() => { setNameInput(profileState.name); setEditingName(true); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  aria-label="Edit name"
                >
                  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </>
            )}
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

        {/* Inactive subscription alert */}
        {isSubscriptionInactive && (
          <div
            style={{
              background: "#fff7ed",
              borderLeft: "4px solid #f97316",
              padding: "14px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="#f97316" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#9a3412" }}>
                Your account is not visible to homeowners
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#c2410c" }}>
                Subscribe to appear on the map and start receiving customer requests.
              </p>
              <button
                onClick={() => {
                  if (stripeSubscriptionId) {
                    setReactivatingSubscription(true);
                    fetch("/api/stripe/reactivate-subscription", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ subscriptionId: stripeSubscriptionId }),
                    })
                      .then(() => setSubscriptionInfo((prev) => prev ? { ...prev, cancelAtPeriodEnd: false } : prev))
                      .finally(() => setReactivatingSubscription(false));
                  } else {
                    setShowSubscriptionPlanModal(true);
                  }
                }}
                disabled={reactivatingSubscription}
                style={{
                  background: "#f97316",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: reactivatingSubscription ? "not-allowed" : "pointer",
                  opacity: reactivatingSubscription ? 0.6 : 1,
                }}
              >
                {reactivatingSubscription ? "Activating…" : stripeSubscriptionId ? "Reactivate Subscription" : "Subscribe Now"}
              </button>
            </div>
          </div>
        )}

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
              marginBottom: 0,
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
              <div key={id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <img
                    src={meta.icon}
                    alt={meta.shortName}
                    style={{ width: 32, height: 32, objectFit: "contain" }}
                  />
                  <span style={{ fontSize: 16, color: "#555", fontWeight: 500 }}>
                    {meta.shortName}
                  </span>
                </div>
                <p style={{ color: "#666", fontSize: 14, margin: "0 0 6px 38px" }}>
                  {profileState.descriptions[id]}
                </p>
              </div>
            );
          })}

          {/* Tools preference */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 15, marginTop: 4 }}>
              <BsCircleFill color="#22c55e" size={10} />
            <span style={{ fontSize: 14, color: "#555", fontWeight: 500 }}>
              {profileState.hasTools ? "I have tools" : "I will use home-owner's tools"}
            </span>
          </div>

          {/* Payment Methods */}
          <div style={{ marginTop: 8 }}>
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

          {/* Subscription */}
          {stripeSubscriptionId && (
            <div style={{ marginTop: 18 }}>
              <span style={{ fontWeight: 700, fontSize: 17, display: "block", marginBottom: 10 }}>
                My Subscription:
              </span>
              {subscriptionInfo ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 14, color: "#555" }}>
                    Subscription date:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {new Date(subscriptionInfo.created * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </span>
                  {!subscriptionInfo.cancelAtPeriodEnd ? (
                    <>
                      <span style={{ fontSize: 14, color: "#555" }}>
                        Next payment:{" "}
                        <span style={{ fontWeight: 600 }}>
                          {new Date(
                            (subscriptionInfo.trialEnd ?? subscriptionInfo.currentPeriodEnd) * 1000
                          ).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                      </span>
                      <button
                        onClick={async () => {
                          if (!stripeSubscriptionId) return;
                          setCancellingSubscription(true);
                          try {
                            await fetch("/api/stripe/cancel-subscription", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ subscriptionId: stripeSubscriptionId }),
                            });
                            setSubscriptionInfo((prev) => prev ? { ...prev, cancelAtPeriodEnd: true } : prev);
                          } finally {
                            setCancellingSubscription(false);
                          }
                        }}
                        disabled={cancellingSubscription}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#555",
                          fontSize: 14,
                          textDecoration: "underline",
                          cursor: cancellingSubscription ? "not-allowed" : "pointer",
                          padding: 0,
                          textAlign: "left",
                          marginTop: 4,
                        }}
                      >
                        {cancellingSubscription ? "Cancelling…" : "Cancel my subscription"}
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 14, color: "#888" }}>
                        Subscription ends on:{" "}
                        <span style={{ fontWeight: 600, color: "#555" }}>
                          {new Date(subscriptionInfo.currentPeriodEnd * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                      </span>
                      <button
                        onClick={async () => {
                          if (!stripeSubscriptionId) return;
                          setReactivatingSubscription(true);
                          try {
                            await fetch("/api/stripe/reactivate-subscription", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ subscriptionId: stripeSubscriptionId }),
                            });
                            setSubscriptionInfo((prev) => prev ? { ...prev, cancelAtPeriodEnd: false } : prev);
                          } finally {
                            setReactivatingSubscription(false);
                          }
                        }}
                        disabled={reactivatingSubscription}
                        style={{
                          background: "none",
                          border: "none",
                          color: reactivatingSubscription ? "#aaa" : "#22c55e",
                          fontSize: 14,
                          textDecoration: "underline",
                          cursor: reactivatingSubscription ? "not-allowed" : "pointer",
                          padding: 0,
                          textAlign: "left",
                          marginTop: 4,
                        }}
                      >
                        {reactivatingSubscription ? "Subscribing…" : "Subscribe"}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: 14, color: "#aaa" }}>Loading…</span>
              )}
            </div>
          )}

          {/* Sign out */}
          <div style={{ paddingTop: 28, paddingBottom: 40 }}>
            <button
              onClick={async () => { await signOut(auth); onClose(); }}
              style={{
                background: "none",
                border: "none",
                color: "#22c55e",
                fontSize: 14,
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileModal;
