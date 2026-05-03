"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

type NavbarProps = {
  children?: React.ReactNode;
  onCreateAccount?: () => void;
  currentUser?: { photoUrl: string; name: string } | null;
  onSignOut?: () => void;
  onEditAccount?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  children,
  onCreateAccount,
  currentUser,
  onSignOut,
  onEditAccount,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(window.navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

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
        <img src="/yardyman-logo.png" alt="Yardyman Logo" style={{ width: 36, height: 36, objectFit: 'contain', marginRight: 8, borderRadius: 4 }} />
      </Link>
      <button style={{ background: 'none', border: 'none', padding: 0, marginRight: 4, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Open menu">
        <FiMenu size={28} />
      </button>

      {currentUser ? (
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="Account menu"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1px solid #3eab40" }}
            />
          </button>

          {dropdownOpen && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
              minWidth: 180,
              overflow: "hidden",
              zIndex: 300,
            }}>
              <button
                onClick={() => { setDropdownOpen(false); onEditAccount?.(); }}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#222",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                My profile
              </button>
              <button
                onClick={() => { setDropdownOpen(false); onSignOut?.(); }}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#e53e3e",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        onCreateAccount && (
          <button
            onClick={onCreateAccount}
            aria-label="Sign in"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <img src="/user-account.png" alt="Sign in" style={{ width: 30, height: 30, objectFit: "contain" }} />
          </button>
        )
      )}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: isMobile ? 8 : 10 }}>
        {children}
      </div>
    </div>
  );
};

export default Navbar;
