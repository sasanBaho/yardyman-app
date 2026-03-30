import React, { useRef, useLayoutEffect } from "react";

interface NavbarProps {
  active: "snow" | "lawn";
  onSelect: (service: "snow" | "lawn") => void;
}

import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

const Navbar: React.FC<NavbarProps> = ({ active, onSelect }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(window.navigator.userAgent));
    }
  }, []);

  const snowRef = useRef<HTMLButtonElement | null>(null);
  const lawnRef = useRef<HTMLButtonElement | null>(null);
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const btnsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const underline = underlineRef.current;
    const snowBtn = snowRef.current;
    const lawnBtn = lawnRef.current;
    if (!underline || !snowBtn || !lawnBtn) return;
    const activeBtn = active === "snow" ? snowBtn : lawnBtn;
    const { offsetLeft, offsetWidth } = activeBtn;
    underline.style.left = offsetLeft + "px";
    underline.style.width = offsetWidth + "px";
    underline.style.background = active === "snow" ? "#09f" : "rgb(5, 181, 5)";
  }, [active, isMobile]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "#fff",
      borderRadius: 0,
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      padding: "8px 16px"
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', marginRight: 4 }}>
        <img src="/yardyman-logo.png" alt="Yardyman Logo" style={{ width: 36, height: 36, objectFit: 'contain', marginRight: 8 }} />
      </Link>
      <button style={{ background: 'none', border: 'none', padding: 0, marginRight: 16, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Open menu">
        <FiMenu size={28} />
      </button>
      <div ref={btnsRef} style={{ marginLeft: "auto", display: "flex", gap: 12, position: "relative", minWidth: 180 }}>
        <span
          ref={underlineRef}
          style={{
            position: "absolute",
            bottom: 0,
            height: 3,
            left: 0,
            width: 0,
            borderRadius: 2,
            background: active === "snow" ? "#09f" : "rgb(5, 181, 5)",
            transition: "left 0.3s cubic-bezier(.4,0,.2,1), width 0.3s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1)"
          }}
        />
      <button
        ref={snowRef}
        onClick={() => onSelect("snow")}
        style={{
          padding: "8px 0 8px 0",
          border: 'none',
          background: 'none',
          fontWeight: 600,
          fontSize: 16,
          color: active === "snow" ? "#09f" : "#888",
          cursor: "pointer",
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          borderRadius: 0,
          outline: 'none',
          boxShadow: 'none',
          transition: 'color 0.3s cubic-bezier(.4,0,.2,1)',
          marginRight: "10px"
        }}
      >
        {isMobile ? (
          <img src={active === "snow" ? "/shovel-blue.png" : "/shovel-black.png"} alt="Shovel icon for snow removal service selection" style={{ width: 32, height: 32 }} />
        ) : (
          <>
            <img src={active === "snow" ? "/shovel-blue.png" : "/shovel-black.png"} alt="Shovel icon for snow removal service selection" style={{ width: 32, height: 32, marginRight: 6 }} />
            <span>Snow removals</span>
          </>
        )}
      </button>
      <button
        ref={lawnRef}
        onClick={() => onSelect("lawn")}
        style={{
          padding: "8px 0 8px 0",
          border: 'none',
          background: 'none',
          fontWeight: 600,
          fontSize: 16,
          color: active === "lawn" ? "rgb(5, 181, 5)" : "#888",
          cursor: "pointer",
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          borderRadius: 0,
          outline: 'none',
          boxShadow: 'none',
          transition: 'color 0.3s cubic-bezier(.4,0,.2,1)',
          marginRight: "10px"
        }}
      >
        {isMobile ? (
          <img src={active === "lawn" ? "/lawn-mower-green.png" : "/lawn-mower-black.png"} alt="Lawn mower" style={{ width: 32, height: 32 }} />
        ) : (
          <>
            <img src={active === "lawn" ? "/lawn-mower-green.png" : "/lawn-mower-black.png"} alt="Lawn mower" style={{ width: 32, height: 32, marginRight: 6 }} />
            <span>Lawn care</span>
          </>
        )}
      </button>
      </div>
    </div>
  );
};

export default Navbar;
