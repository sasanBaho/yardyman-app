import React from "react";

import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

const Navbar: React.FC = () => {
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
        <img src="/yardyman-logo.png" alt="Yardyman Logo" style={{ width: 36, height: 36, objectFit: 'contain', marginRight: 8 }} />
      </Link>
      <button style={{ background: 'none', border: 'none', padding: 0, marginRight: 16, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Open menu">
        <FiMenu size={28} />
      </button>
      <div style={{ marginLeft: "auto" }} />
    </div>
  );
};

export default Navbar;
