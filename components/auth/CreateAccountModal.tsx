"use client";
import React, { useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import ModalBase from "./ModalBase";
import PhoneInput from "./PhoneInput";
import { auth, db, collection, query, where, getDocs } from "@/firebase";

export interface SignupFormData {
  name: string;
  email: string;
  photoFile: File | null;
  photoPreview: string | null;
}

interface CreateAccountModalProps {
  onClose: () => void;
  onCodeSent: (result: ConfirmationResult, phone: string, data: SignupFormData) => void;
  onLogin: () => void;
  onPhoneAlreadyRegistered: (phone: string, countryCode: string) => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  onClose,
  onCodeSent,
  onLogin,
  onPhoneAlreadyRegistered,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const isMobile =
    typeof window !== "undefined" &&
    /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  const digits = phone.replace(/\D/g, "");
  const fullPhone = countryCode + digits;
  const isValid =
    name.trim().length > 0 && digits.length >= 10 && email.trim().length > 0;

  const handlePhotoSelected = (file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setShowImagePicker(false);
  };

  const handleSendCode = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(
        query(collection(db, "providers"), where("phoneNumber", "==", fullPhone))
      );
      if (!snapshot.empty) {
        setLoading(false);
        onPhoneAlreadyRegistered(phone, countryCode);
        return;
      }
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-create", {
          size: "invisible",
        });
      }
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaRef.current);
      onCodeSent(result, fullPhone, { name, email, photoFile, photoPreview });
    } catch (err: any) {
      setError(err.message ?? "Failed to send verification code. Please try again.");
      recaptchaRef.current = null;
    }
    setLoading(false);
  };

  return (
    <ModalBase onClose={onClose}>
      <div id="recaptcha-create" />

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && handlePhotoSelected(e.target.files[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && handlePhotoSelected(e.target.files[0])}
      />

      {/* iOS-style image picker sheet */}
      {showImagePicker && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 700,
            display: "flex",
            alignItems: "flex-end",
            background: "rgba(0,0,0,0.4)",
          }}
          onClick={() => setShowImagePicker(false)}
        >
          <div
            style={{ width: "100%", padding: "0 8px 8px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  color: "#888",
                  fontSize: 13,
                  borderBottom: "1px solid #e5e5ea",
                }}
              >
                Select Photo
              </div>
              {isMobile && (
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  style={{
                    width: "100%",
                    padding: "18px",
                    background: "#fff",
                    border: "none",
                    borderBottom: "1px solid #e5e5ea",
                    color: "#007aff",
                    fontSize: 17,
                    cursor: "pointer",
                  }}
                >
                  Camera
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  padding: "18px",
                  background: "#fff",
                  border: "none",
                  color: "#007aff",
                  fontSize: 17,
                  cursor: "pointer",
                }}
              >
                Photo Library
              </button>
            </div>
            <button
              onClick={() => setShowImagePicker(false)}
              style={{
                width: "100%",
                padding: "18px",
                background: "#fff",
                border: "none",
                borderRadius: 14,
                color: "#007aff",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, paddingRight: 40, marginTop: 4 }}>
        Create Service Provider Account!
      </h2>
      <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 24 }}>
        * All the fields are required.
      </p>

      {/* Photo upload */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <button
          type="button"
          onClick={() => setShowImagePicker(true)}
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "#e8e8e8",
            border: photoPreview ? "3px solid #22c55e" : "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: 0,
          }}
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <path
                  d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                  stroke="#09f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="13" r="4" stroke="#09f" strokeWidth="2" />
              </svg>
              <span style={{ color: "#09f", fontSize: 13, marginTop: 5 }}>Add Photo</span>
            </>
          )}
        </button>
      </div>

      {/* Full Name */}
      <label style={{ fontWeight: 700, fontSize: 16, display: "block", marginBottom: 8 }}>
        Full Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your full name"
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "#f0f0f0",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          outline: "none",
          boxSizing: "border-box",
          marginBottom: 20,
        }}
      />

      {/* Phone Number */}
      <label style={{ fontWeight: 700, fontSize: 16, display: "block", marginBottom: 8 }}>
        Phone Number
      </label>
      <PhoneInput
        value={phone}
        onChange={setPhone}
        countryCode={countryCode}
        onCountryCodeChange={setCountryCode}
      />
      <p style={{ color: "#888", fontSize: 14, margin: "8px 0 20px" }}>
        We'll send you a verification code via SMS.
      </p>

      {/* Email */}
      <label style={{ fontWeight: 700, fontSize: 16, display: "block", marginBottom: 8 }}>
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "#f0f0f0",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          outline: "none",
          boxSizing: "border-box",
          marginBottom: 24,
        }}
      />

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
        <p style={{ color: "#888", fontSize: 15, margin: "0 0 4px" }}>Already have an account?</p>
        <button
          onClick={onLogin}
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
    </ModalBase>
  );
};

export default CreateAccountModal;
