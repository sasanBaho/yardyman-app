"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  const key = "yardyman_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

interface RatingModalProps {
  providerId: string;
  providerName: string;
  onClose: () => void;
  onRated: (newAvgRating: number, newCount: number) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ providerId, providerName, onClose, onRated }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [prevRating, setPrevRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function loadExisting() {
      const deviceId = getDeviceId();
      if (!deviceId) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, "providers", providerId, "ratings", deviceId));
        if (snap.exists()) {
          const r = snap.data().rating as number;
          setPrevRating(r);
          setSelected(r);
        }
      } finally {
        setLoading(false);
      }
    }
    loadExisting();
  }, [providerId]);

  const display = hovered || selected;

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const deviceId = getDeviceId();
      const ratingRef = doc(db, "providers", providerId, "ratings", deviceId);
      const providerRef = doc(db, "providers", providerId);
      let finalAvg = selected;
      let finalCount = 1;

      await runTransaction(db, async (tx) => {
        const [ratingSnap, providerSnap] = await Promise.all([
          tx.get(ratingRef),
          tx.get(providerRef),
        ]);
        const existing = ratingSnap.exists() ? (ratingSnap.data().rating as number) : null;
        const currentAvg: number = providerSnap.data()?.rating ?? 0;
        const currentCount: number = providerSnap.data()?.ratingsCount ?? 0;

        if (existing !== null) {
          finalCount = currentCount;
          finalAvg = currentCount > 1
            ? (currentAvg * currentCount - existing + selected) / currentCount
            : selected;
        } else {
          finalCount = currentCount + 1;
          finalAvg = currentCount > 0
            ? (currentAvg * currentCount + selected) / finalCount
            : selected;
        }

        tx.set(ratingRef, { rating: selected, updatedAt: serverTimestamp() });
        tx.update(providerRef, { rating: finalAvg, ratingsCount: finalCount });
      });

      onRated(finalAvg, finalCount);
      setDone(true);
      setTimeout(onClose, 1400);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 900,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: 520,
          padding: "36px 28px 52px",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 14 }}>⭐</div>
            <p style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Rating submitted!</p>
            <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>Thank you for your feedback.</p>
          </>
        ) : loading ? (
          <p style={{ color: "#888" }}>Loading…</p>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              Rate {providerName}
            </h2>
            {prevRating !== null && (
              <p style={{ color: "#aaa", fontSize: 13, marginBottom: 4 }}>
                Your previous rating: {prevRating} star{prevRating !== 1 ? "s" : ""}. Tap to update.
              </p>
            )}

            {/* Stars */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "28px 0 36px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width={58}
                  height={58}
                  viewBox="0 0 24 24"
                  fill={star <= display ? "#f7b500" : "none"}
                  stroke="#f7b500"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  style={{ cursor: "pointer", transition: "fill 0.1s" }}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setSelected(star)}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selected || submitting}
              style={{
                width: "100%",
                padding: "18px",
                background: selected && !submitting ? "#555" : "#aaa",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                fontSize: 17,
                fontWeight: 600,
                cursor: selected && !submitting ? "pointer" : "not-allowed",
                marginBottom: 16,
              }}
            >
              {submitting ? "Submitting…" : "Submit rating"}
            </button>

            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#aaa",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingModal;
