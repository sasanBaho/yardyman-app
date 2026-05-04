"use client";
import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

type NavbarProps = {
  children?: React.ReactNode;
  onCreateAccount?: () => void;
  currentUser?: { photoUrl: string; name: string } | null;
  onEditAccount?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  children,
  onCreateAccount,
  currentUser,
  onEditAccount,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(window.navigator.userAgent));
    }
  }, []);

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
