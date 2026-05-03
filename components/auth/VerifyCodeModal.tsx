"use client";
import React, { useState, useEffect } from "react";
import { ConfirmationResult, UserCredential } from "firebase/auth";
import ModalBase from "./ModalBase";

interface VerifyCodeModalProps {
  onClose: () => void;
  confirmationResult: ConfirmationResult;
  phone: string;
  photoPreview?: string | null;
  onVerified: (credential: UserCredential) => void;
  onEditPhone: () => void;
  isSignup?: boolean;
  onLoginInstead?: () => void;
}

const VerifyCodeModal: React.FC<VerifyCodeModalProps> = ({
  onClose,
  confirmationResult,
  phone,
  photoPreview,
  onVerified,
  onEditPhone,
  isSignup = false,
  onLoginInstead,
}) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowBanner(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleVerify = async () => {
    if (code.length !== 6 || loading) return;
    setLoading(true);
    setError("");
    try {
      const credential = await confirmationResult.confirm(code);
      onVerified(credential);
    } catch {
      setError("Invalid code. Please check and try again.");
    }
    setLoading(false);
  };

  return (
    <ModalBase onClose={onClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 8,
        }}
      >
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Profile"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #22c55e",
              marginBottom: 16,
            }}
          />
        )}

        {/* Message bubble icon */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "#09f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <svg width={28} height={28} viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Enter the verification code
        </h2>
        <p style={{ color: "#888", fontSize: 15, marginBottom: 4, textAlign: "center" }}>
          We sent a 6-digit code to
        </p>
        <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 28, textAlign: "center" }}>
          {phone}
        </p>

        <input
          type="tel"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter 6-digit code"
          style={{
            width: "100%",
            padding: "16px",
            background: "#f0f0f0",
            border: "none",
            borderRadius: 12,
            fontSize: 22,
            letterSpacing: 8,
            textAlign: "center",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 16,
            fontWeight: 600,
          }}
        />

        {error && (
          <p style={{ color: "#e53e3e", fontSize: 14, marginBottom: 12, textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={code.length !== 6 || loading}
          style={{
            width: "100%",
            padding: "16px",
            background: code.length === 6 && !loading ? "#09f" : "#ddd",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: 17,
            fontWeight: 600,
            cursor: code.length === 6 && !loading ? "pointer" : "not-allowed",
            marginBottom: 18,
          }}
        >
          {loading ? "Verifying…" : "Verify"}
        </button>

        <button
          onClick={onEditPhone}
          style={{
            background: "none",
            border: "none",
            color: "#09f",
            fontSize: 16,
            cursor: "pointer",
            textDecoration: "underline",
            marginBottom: 20,
          }}
        >
          Edit phone number
        </button>

        {showBanner && (
          <div
            style={{
              background: "#f0fff4",
              border: "1px solid #68d391",
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width={12} height={12} viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 10.5L9 14.5L15 7.5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ color: "#276749", fontSize: 14 }}>
              Verification code sent to {phone}
            </span>
          </div>
        )}

        {isSignup && onLoginInstead && (
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <p style={{ color: "#888", fontSize: 15, margin: "0 0 4px" }}>
              Already have an account?
            </p>
            <button
              onClick={onLoginInstead}
              style={{
                background: "none",
                border: "none",
                color: "#09f",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Log in!
            </button>
          </div>
        )}
      </div>
    </ModalBase>
  );
};

export default VerifyCodeModal;
