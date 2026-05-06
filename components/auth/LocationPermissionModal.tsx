"use client";
import React, { useState } from "react";

interface LocationPermissionModalProps {
  onGranted: (coords: [number, number]) => void;
  onClose: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ onGranted, onClose }) => {
  const [requesting, setRequesting] = useState(false);
  const [denied, setDenied] = useState(false);

  const handleAllow = () => {
    if (!("geolocation" in navigator)) {
      setDenied(true);
      return;
    }
    setRequesting(true);
    setDenied(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRequesting(false);
        onGranted([pos.coords.longitude, pos.coords.latitude]);
      },
      () => {
        setRequesting(false);
        setDenied(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "36px 28px 28px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: "#f0fdf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
          Location Access Required
        </h2>

        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.65 }}>
          Yardyman needs your location to show you on the map and connect you with nearby homeowners.
        </p>

        <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 24px", lineHeight: 1.5 }}>
          You cannot create a provider account without sharing your location.
        </p>

        {denied && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 18,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            textAlign: "left",
          }}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ color: "#b91c1c", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Location access was denied. Please enable it in your browser or device settings, then try again.
            </p>
          </div>
        )}

        <button
          onClick={handleAllow}
          disabled={requesting}
          style={{
            width: "100%",
            padding: "15px",
            background: requesting ? "#86efac" : "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            cursor: requesting ? "not-allowed" : "pointer",
            marginBottom: 12,
            transition: "background 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {requesting ? (
            <>
              <span style={{
                width: 16,
                height: 16,
                border: "2.5px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              Requesting…
            </>
          ) : (
            <>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Allow Location Access
            </>
          )}
        </button>

        <button
          onClick={onClose}
          disabled={requesting}
          style={{
            background: "none",
            border: "none",
            color: "#9ca3af",
            fontSize: 14,
            cursor: requesting ? "not-allowed" : "pointer",
            padding: "6px 0",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LocationPermissionModal;
