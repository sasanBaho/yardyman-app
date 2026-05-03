"use client";
import React, { useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import ModalBase from "./ModalBase";
import PhoneInput from "./PhoneInput";
import { auth } from "@/firebase";

interface LoginModalProps {
  onClose: () => void;
  onCodeSent: (result: ConfirmationResult, phone: string) => void;
  onCreateAccount: () => void;
  initialPhone?: string;
  initialCountryCode?: string;
  slideFrom?: "right" | "left";
}

const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onCodeSent,
  onCreateAccount,
  initialPhone = "",
  initialCountryCode = "+1",
  slideFrom,
}) => {
  const [phone, setPhone] = useState(initialPhone);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const digits = phone.replace(/\D/g, "");
  const fullPhone = countryCode + digits;
  const isValid = digits.length >= 10;

  const handleSendCode = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError("");
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-login", {
          size: "invisible",
        });
      }
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaRef.current);
      onCodeSent(result, fullPhone);
    } catch (err: any) {
      setError(err.message ?? "Failed to send verification code. Please try again.");
      recaptchaRef.current = null;
    }
    setLoading(false);
  };

  return (
    <ModalBase onClose={onClose} slideFrom={slideFrom}>
      <div id="recaptcha-login" />

      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 28, paddingRight: 40, marginTop: 4 }}>
        Sign in to your account!
      </h2>

      <label style={{ fontWeight: 700, fontSize: 16, display: "block", marginBottom: 10 }}>
        Phone Number
      </label>
      <PhoneInput
        value={phone}
        onChange={setPhone}
        countryCode={countryCode}
        onCountryCodeChange={setCountryCode}
      />
      <p style={{ color: "#888", fontSize: 14, margin: "8px 0 28px" }}>
        We'll send you a verification code via SMS.
      </p>

      {error && (
        <p style={{ color: "#e53e3e", fontSize: 14, marginBottom: 12 }}>{error}</p>
      )}

      <button
        onClick={handleSendCode}
        disabled={!isValid || loading}
        style={{
          width: "100%",
          padding: "16px",
          background: isValid && !loading ? "#09f" : "#ddd",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontSize: 17,
          fontWeight: 600,
          cursor: isValid && !loading ? "pointer" : "not-allowed",
          marginBottom: 14,
        }}
      >
        {loading ? "Sending…" : "Send Code"}
      </button>

      <p style={{ textAlign: "center", color: "#888", fontSize: 13, marginBottom: 24 }}>
        By tapping Send Code, you agree to our{" "}
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Use</span>
        {" "}and{" "}
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
      </p>

      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#888", fontSize: 15, margin: "0 0 4px" }}>Don't have an account?</p>
        <button
          onClick={onCreateAccount}
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
          Create account!
        </button>
      </div>
    </ModalBase>
  );
};

export default LoginModal;
