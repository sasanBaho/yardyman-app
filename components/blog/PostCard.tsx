"use client";
import React, { useState } from "react";
import Link from "next/link";

interface PostCardProps {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  accent: string;
  iconPath: string;
}

const PostCard: React.FC<PostCardProps> = ({
  slug,
  category,
  title,
  excerpt,
  readTime,
  date,
  accent,
  iconPath,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/blog/${slug}`} style={{ textDecoration: "none" }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #f3f4f6",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "box-shadow 0.15s, transform 0.15s",
          cursor: "pointer",
        }}
      >
        {/* Color accent strip */}
        <div style={{ height: 4, background: accent }} />

        <div style={{ padding: "20px 22px 22px", display: "flex", gap: 18, alignItems: "flex-start" }}>
          {/* Icon */}
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: `${accent}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
          }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={iconPath} />
            </svg>
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Category + meta */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: accent,
                background: `${accent}15`,
                borderRadius: 999,
                padding: "2px 10px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                {category}
              </span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{date}</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>· {readTime} read</span>
            </div>

            {/* Title */}
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>
              {title}
            </h3>

            {/* Excerpt */}
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
              {excerpt}
            </p>

            {/* Read more */}
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: accent,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}>
              Read article
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
