"use client";
import React, { useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import ModalBase from "./ModalBase";
import PhoneInput from "./PhoneInput";
import ImageCropModal from "./ImageCropModal";
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
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const isMobile =
    typeof window !== "undefined" &&
    /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  const digits = phone.replace(/\D/g, "");
  const fullPhone = countryCode + digits;
  const isValid = name.trim().length > 0 && digits.length >= 10 && email.trim().length > 0;

  const fieldStyle = (fieldName: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    background: "#f9fafb",
    border: `1.5px solid ${focusedField === fieldName ? "#22c55e" : "#e5e7eb"}`,
    borderRadius: 12,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    color: "#111827",
    transition: "border-color 0.15s",
  });

  const handlePhotoSelected = (file: File) => {
    setShowImagePicker(false);
    const reader = new FileReader();
    reader.onload = (e) => setCropSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCropDone = (dataUrl: string) => {
    setCropSrc(null);
    setPhotoPreview(dataUrl);
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const u8 = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
    setPhotoFile(new File([u8], "profile.jpg", { type: mime }));
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
    <>
      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onCrop={handleCropDone}
          onCancel={() => setCropSrc(null)}
        />
      )}
      <ModalBase onClose={onClose} closeButtonColor="#22c55e">
        <div id="recaptcha-create" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={false as any}
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
              <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 8 }}>
                <div style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: 13,
                  fontWeight: 600,
                  borderBottom: "1px solid #f3f4f6",
                }}>
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
                      borderBottom: "1px solid #f3f4f6",
                      color: "#22c55e",
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
                    color: "#22c55e",
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
                  color: "#374151",
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

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24, paddingTop: 4 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#f0fdf4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
            Become a Provider
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
            Join Yardyman and start getting clients
          </p>
        </div>

        {/* Photo upload */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => setShowImagePicker(true)}
            style={{
              position: "relative",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: photoPreview ? "transparent" : "#f0fdf4",
              border: photoPreview ? "3px solid #22c55e" : "2px dashed #86efac",
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
              <>
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 30,
                  background: "rgba(0,0,0,0.42)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span style={{ color: "#22c55e", fontSize: 11, marginTop: 6, fontWeight: 600 }}>Add Photo</span>
              </>
            )}
          </button>
        </div>

        {/* Full Name */}
        <label style={{ fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6, letterSpacing: "0.02em" }}>
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
          placeholder="Enter your full name"
          style={{ ...fieldStyle("name"), marginBottom: 16 }}
        />

        {/* Phone Number */}
        <label style={{ fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6, letterSpacing: "0.02em" }}>
          Phone Number
        </label>
        <PhoneInput
          value={phone}
          onChange={setPhone}
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
        />
        <p style={{ color: "#9ca3af", fontSize: 13, margin: "6px 0 16px" }}>
          A verification code will be sent via SMS.
        </p>

        {/* Email */}
        <label style={{ fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6, letterSpacing: "0.02em" }}>
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          placeholder="Enter your email address"
          style={{ ...fieldStyle("email"), marginBottom: 24 }}
        />

        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSendCode}
          disabled={!isValid || loading}
          style={{
            width: "100%",
            padding: "16px",
            background: isValid && !loading ? "#22c55e" : "#e5e7eb",
            color: isValid && !loading ? "#fff" : "#9ca3af",
            border: "none",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            cursor: isValid && !loading ? "pointer" : "not-allowed",
            marginBottom: 12,
            transition: "background 0.15s",
          }}
        >
          {loading ? "Sending…" : "Send Verification Code"}
        </button>

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
          By continuing, you agree to our{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer", color: "#6b7280" }}>Terms of Use</span>
          {" "}and{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer", color: "#6b7280" }}>Privacy Policy</span>
        </p>

        <div style={{ textAlign: "center", borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 8px" }}>Already have an account?</p>
          <button
            onClick={onLogin}
            style={{
              background: "none",
              border: "none",
              color: "#22c55e",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </div>
      </ModalBase>
    </>
  );
};

export default CreateAccountModal;
