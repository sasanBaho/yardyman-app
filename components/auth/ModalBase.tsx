"use client";
import React from "react";

interface ModalBaseProps {
  onClose: () => void;
  children: React.ReactNode;
  closeButtonColor?: string;
}

const ModalBase: React.FC<ModalBaseProps> = ({
  onClose,
  children,
  closeButtonColor = "#09f",
}) => {
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
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: 520,
          maxHeight: "92dvh",
          overflowY: "auto",
          padding: "24px 24px 48px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: closeButtonColor,
            border: "none",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            lineHeight: 1,
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalBase;
