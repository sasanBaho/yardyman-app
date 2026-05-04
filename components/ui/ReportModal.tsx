"use client";
import React, { useState } from "react";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const REASONS = [
  "Fake profile",
  "Inappropriate content",
  "Wrong location",
  "Spam / soliciting",
  "Other",
];

interface ReportModalProps {
  providerId: string;
  providerName: string;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ providerId, providerName, onClose }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reports"), {
        providerId,
        providerName,
        reason: selected,
        createdAt: serverTimestamp(),
      });
    } finally {
      setSubmitting(false);
      setDone(true);
      setTimeout(onClose, 1400);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 800,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: 520,
          padding: "24px 24px 44px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>Report submitted</p>
            <p style={{ color: "#888", fontSize: 14, marginTop: 6 }}>Thank you for helping keep Yardyman safe.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Report Provider</h2>
              <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888", lineHeight: 1 }}>×</button>
            </div>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
              Why are you reporting <strong>{providerName}</strong>?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelected(reason)}
                  style={{
                    textAlign: "left",
                    padding: "13px 16px",
                    border: `2px solid ${selected === reason ? "#f59e0b" : "#e5e7eb"}`,
                    borderRadius: 12,
                    background: selected === reason ? "#fffbeb" : "#fff",
                    fontSize: 15,
                    fontWeight: selected === reason ? 600 : 400,
                    color: "#222",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${selected === reason ? "#f59e0b" : "#ccc"}`,
                    background: selected === reason ? "#f59e0b" : "#fff",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {selected === reason && (
                      <svg width={10} height={10} viewBox="0 0 20 20" fill="none">
                        <path d="M5 10.5L9 14.5L15 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {reason}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selected || submitting}
              style={{
                width: "100%",
                padding: "16px",
                background: selected && !submitting ? "#f59e0b" : "#e5e7eb",
                color: selected && !submitting ? "#fff" : "#aaa",
                border: "none",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                cursor: selected && !submitting ? "pointer" : "not-allowed",
              }}
            >
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
