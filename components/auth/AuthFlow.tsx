"use client";
import React, { useEffect, useState } from "react";
import { ConfirmationResult, UserCredential } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { auth, storage, db, collection, setDoc, doc, serverTimestamp, query, where, getDocs } from "@/firebase";
import LoginModal from "./LoginModal";
import CreateAccountModal, { SignupFormData } from "./CreateAccountModal";
import VerifyCodeModal from "./VerifyCodeModal";
import SelectServicesModal, { ServicesFormData } from "./SelectServicesModal";
import ProviderProfileModal, { ProviderProfile } from "./ProviderProfileModal";

type Step =
  | "none"
  | "create"
  | "login"
  | "verify-create"
  | "verify-login"
  | "select-services"
  | "profile";

interface AuthFlowProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: [number, number] | null;
  onProviderCreated?: () => void;
}

async function getCityName(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en", "User-Agent": "YardymanApp/1.0" } }
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.suburb ||
      "Unknown"
    );
  } catch {
    return "Unknown";
  }
}

async function uploadPhoto(file: File, uid: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileRef = ref(storage, `provider_profiles/${uid}/profile.${ext}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

const AuthFlow: React.FC<AuthFlowProps> = ({
  isOpen,
  onClose,
  userLocation,
  onProviderCreated,
}) => {
  const [step, setStep] = useState<Step>("none");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = useState("");
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && step === "none") {
      setStep("create");
    } else if (!isOpen) {
      setStep("none");
      setConfirmationResult(null);
      setPhone("");
      setSignupData(null);
    }
  }, [isOpen]);

  const close = () => {
    onClose();
  };

  // ── Create account flow ──────────────────────────────────────────────────

  const handleCreateCodeSent = (
    result: ConfirmationResult,
    fullPhone: string,
    data: SignupFormData
  ) => {
    setConfirmationResult(result);
    setPhone(fullPhone);
    setSignupData(data);
    setStep("verify-create");
  };

  const handleVerifyCreate = async (_credential: UserCredential) => {
    setStep("select-services");
  };

  const handleServicesDone = async (servicesData: ServicesFormData) => {
    if (!signupData) return;
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      let photoUrl = "";
      if (signupData.photoFile) {
        photoUrl = await uploadPhoto(signupData.photoFile, user.uid);
      }

      let city = "Unknown";
      if (userLocation) {
        city = await getCityName(userLocation[1], userLocation[0]);
      }

      const providerDoc = {
        uid: user.uid,
        providerName: signupData.name,
        email: signupData.email,
        phoneNumber: phone,
        imageUrl: photoUrl,
        latitude: userLocation ? userLocation[1] : 0,
        longitude: userLocation ? userLocation[0] : 0,
        city,
        selectedServices: servicesData.selectedServices,
        description: servicesData.descriptions,
        hasTools: servicesData.hasTools,
        paymentMethods: servicesData.paymentMethods,
        isAvailable: true,
        profileViews: 0,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "providers", user.uid), providerDoc);

      setProfile({
        uid: user.uid,
        name: signupData.name,
        phone,
        email: signupData.email,
        photoUrl,
        city,
        selectedServices: servicesData.selectedServices,
        descriptions: servicesData.descriptions,
        hasTools: servicesData.hasTools,
        paymentMethods: servicesData.paymentMethods,
        isAvailable: true,
        profileViews: 0,
      });

      setStep("profile");
      onProviderCreated?.();
    } finally {
      setSaving(false);
    }
  };

  // ── Login flow ───────────────────────────────────────────────────────────

  const handleLoginCodeSent = (result: ConfirmationResult, fullPhone: string) => {
    setConfirmationResult(result);
    setPhone(fullPhone);
    setStep("verify-login");
  };

  const handleVerifyLogin = async (credential: UserCredential) => {
    const uid = credential.user.uid;
    try {
      const q = query(collection(db, "providers"), where("uid", "==", uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setProfile({
          uid,
          name: data.providerName ?? "",
          phone: data.phoneNumber ?? phone,
          email: data.email ?? "",
          photoUrl: data.imageUrl ?? "",
          city: data.city ?? "",
          selectedServices: Array.isArray(data.selectedServices) ? data.selectedServices : [],
          descriptions:
            data.description && typeof data.description === "object" ? data.description : {},
          hasTools: data.hasTools ?? false,
          paymentMethods: Array.isArray(data.paymentMethods) ? data.paymentMethods : [],
          isAvailable: data.isAvailable ?? true,
          profileViews: data.profileViews ?? 0,
        });
        setStep("profile");
      } else {
        // No provider account found — redirect to create
        setStep("create");
      }
    } catch {
      setStep("profile");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  if (step === "none") return null;

  if (saving) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "32px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "4px solid #e0e0e0",
              borderTopColor: "#22c55e",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Creating your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {step === "create" && (
        <CreateAccountModal
          onClose={close}
          onCodeSent={handleCreateCodeSent}
          onLogin={() => setStep("login")}
        />
      )}

      {step === "login" && (
        <LoginModal
          onClose={close}
          onCodeSent={handleLoginCodeSent}
          onCreateAccount={() => setStep("create")}
        />
      )}

      {step === "verify-create" && confirmationResult && (
        <VerifyCodeModal
          onClose={close}
          confirmationResult={confirmationResult}
          phone={phone}
          photoPreview={signupData?.photoPreview}
          onVerified={handleVerifyCreate}
          onEditPhone={() => setStep("create")}
          isSignup
          onLoginInstead={() => setStep("login")}
        />
      )}

      {step === "verify-login" && confirmationResult && (
        <VerifyCodeModal
          onClose={close}
          confirmationResult={confirmationResult}
          phone={phone}
          onVerified={handleVerifyLogin}
          onEditPhone={() => setStep("login")}
        />
      )}

      {step === "select-services" && (
        <SelectServicesModal onClose={close} onDone={handleServicesDone} />
      )}

      {step === "profile" && profile && (
        <ProviderProfileModal profile={profile} onClose={close} />
      )}
    </>
  );
};

export default AuthFlow;
