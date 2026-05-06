"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import SidebarMenu from "./SidebarMenu";

type NavbarProps = {
  children?: React.ReactNode;
  onCreateAccount?: () => void;
  onSignIn?: () => void;
  currentUser?: { photoUrl: string; name: string } | null;
  onEditAccount?: () => void;
  onSignOut?: () => void;
  onCancelSubscription?: () => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
  canCancelSubscription?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({
  children,
  onCreateAccount,
  onSignIn,
  currentUser,
  onEditAccount,
  onSignOut,
  onCancelSubscription,
  onDeleteAccount,
  canCancelSubscription,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(window.navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <>
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
        <button
          onClick={() => setMenuOpen(true)}
          style={{ background: 'none', border: 'none', padding: 0, marginRight: 4, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          aria-label="Open menu"
        >
          <FiMenu size={28} />
        </button>

        {currentUser ? (
          <button
            onClick={onEditAccount}
            aria-label="My profile"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1px solid #3eab40" }}
            />
          </button>
        ) : (
          (onCreateAccount || onSignIn) && (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                aria-label="Account"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <img src="/user-account.png" alt="Account" style={{ width: 30, height: 30, objectFit: "contain" }} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  left: 0,
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                  minWidth: 210,
                  overflow: "hidden",
                  zIndex: 300,
                  border: "1px solid #f0f0f0",
                }}>
                  {/* Join as Provider */}
                  <button
                    onClick={() => { setDropdownOpen(false); onCreateAccount?.(); }}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid #f3f4f6",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#f0fdf4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                      </svg>
                    </span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>Join as Provider</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>Create a new account</div>
                    </div>
                  </button>

                  {/* Sign In */}
                  <button
                    onClick={() => { setDropdownOpen(false); onSignIn?.(); }}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                    </span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>Sign In</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>Access your account</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )
        )}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: isMobile ? 8 : 10 }}>
          {children}
        </div>
      </div>

      <SidebarMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentUser={currentUser}
        onSignOut={onSignOut}
        onCancelSubscription={onCancelSubscription}
        onDeleteAccount={onDeleteAccount}
        canCancelSubscription={canCancelSubscription}
      />
    </>
  );
};

export default Navbar;
