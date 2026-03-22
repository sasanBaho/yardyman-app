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
          cursor: "pointer",
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <img src="/shovel-black.png" alt="Shovel icon for snow removal service selection" style={{ width: 32, height: 32, marginRight: 6 }} />
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
          background: active === "lawn" ? "rgb(5, 181, 5)" : "#f0f0f0",
          color: active === "lawn" ? "#fff" : "#222",
          cursor: "pointer",
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
          <img src="/lawn-mower-black.png" alt="Lawn mower" style={{ width: 32, height: 32, marginRight: 6 }} />
        Lawn care
      </button>
    </div>
  );
};

export default Navbar;
