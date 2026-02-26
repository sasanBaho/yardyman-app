import React from "react";

interface NavbarProps {
  active: "snow" | "lawn";
  onSelect: (service: "snow" | "lawn") => void;
}

const Navbar: React.FC<NavbarProps> = ({ active, onSelect }) => {
  return (
    <div style={{
      position: "fixed",
      top: 24,
      right: 32,
      zIndex: 200,
      display: "flex",
      gap: 12,
      background: "rgba(255,255,255,0.95)",
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      padding: "8px 16px"
    }}>
      <button
        onClick={() => onSelect("snow")}
        style={{
          padding: "8px 18px",
          borderRadius: 8,
          border: "none",
          fontWeight: 600,
          fontSize: 16,
          background: active === "snow" ? "#09f" : "#f0f0f0",
          color: active === "snow" ? "#fff" : "#222",
          cursor: "pointer"
        }}
      >
        Snow removals
      </button>
      <button
        onClick={() => onSelect("lawn")}
        style={{
          padding: "8px 18px",
          borderRadius: 8,
          border: "none",
          fontWeight: 600,
          fontSize: 16,
          background: active === "lawn" ? "#09f" : "#f0f0f0",
          color: active === "lawn" ? "#fff" : "#222",
          cursor: "pointer"
        }}
      >
        Lawn care
      </button>
    </div>
  );
};

export default Navbar;
