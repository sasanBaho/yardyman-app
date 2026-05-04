"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ImageCropModalProps {
  src: string;
  onCrop: (dataUrl: string) => void;
  onCancel: () => void;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(v, hi));
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({ src, onCrop, onCancel }) => {
  // Dynamic crop size — fills the screen width so image is shown "as-is"
  const cropSize =
    typeof window !== "undefined" ? Math.min(window.innerWidth - 24, 420) : 300;

  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ cx: number; cy: number; ox: number; oy: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scale so the shorter dimension fills cropSize — image is never squeezed
  const getDisp = (nat: { w: number; h: number }) =>
    nat.w >= nat.h
      ? { w: (nat.w / nat.h) * cropSize, h: cropSize }
      : { w: cropSize, h: (nat.h / nat.w) * cropSize };

  const disp = imgNatural ? getDisp(imgNatural) : { w: cropSize, h: cropSize };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const nat = { w: img.naturalWidth, h: img.naturalHeight };
      setImgNatural(nat);
      const d = getDisp(nat);
      // Start centered
      setOffset({ x: (d.w - cropSize) / 2, y: (d.h - cropSize) / 2 });
    };
    img.src = src;
  }, [src]);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pt = "touches" in e ? e.touches[0] : e;
    setDragging(true);
    dragStart.current = { cx: pt.clientX, cy: pt.clientY, ox: offset.x, oy: offset.y };
  };

  const onPointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragStart.current || !imgNatural) return;
    const pt = "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent);
    const dx = dragStart.current.cx - pt.clientX;
    const dy = dragStart.current.cy - pt.clientY;
    const d = getDisp(imgNatural);
    setOffset({
      x: clamp(dragStart.current.ox + dx, 0, Math.max(0, d.w - cropSize)),
      y: clamp(dragStart.current.oy + dy, 0, Math.max(0, d.h - cropSize)),
    });
  }, [imgNatural, cropSize]);

  const onPointerUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [dragging, onPointerMove, onPointerUp]);

  const handleCrop = () => {
    if (!imgNatural || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const OUT = 600;
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scaleX = imgNatural.w / disp.w;
    const scaleY = imgNatural.h / disp.h;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(
        img,
        offset.x * scaleX,
        offset.y * scaleY,
        cropSize * scaleX,
        cropSize * scaleY,
        0, 0, OUT, OUT
      );
      onCrop(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.src = src;
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 900, background: "#111",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 20, letterSpacing: 0.3 }}>
        Drag to reposition
      </p>

      {/* Crop viewport — full width, image shown at natural aspect ratio */}
      <div
        style={{
          position: "relative",
          width: cropSize,
          height: cropSize,
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        {/* Full image dimmed — shows what lies outside the circle */}
        {imgNatural && (
          <img
            src={src}
            draggable={false}
            style={{
              position: "absolute",
              width: disp.w, height: disp.h,
              top: -offset.y, left: -offset.x,
              opacity: 0.28,
              pointerEvents: "none",
            }}
          />
        )}
        {/* Circle — full-brightness image visible only inside */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%", overflow: "hidden",
          border: "2.5px solid rgba(255,255,255,0.8)",
          boxSizing: "border-box",
        }}>
          {imgNatural && (
            <img
              src={src}
              draggable={false}
              style={{
                position: "absolute",
                width: disp.w, height: disp.h,
                top: -offset.y, left: -offset.x,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
        <button
          onClick={onCancel}
          style={{ padding: "12px 30px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 999, fontSize: 16, cursor: "pointer" }}
        >
          Cancel
        </button>
        <button
          onClick={handleCrop}
          disabled={!imgNatural}
          style={{ padding: "12px 30px", background: imgNatural ? "#22c55e" : "#444", color: "#fff", border: "none", borderRadius: 999, fontSize: 16, fontWeight: 700, cursor: imgNatural ? "pointer" : "default" }}
        >
          Use Photo
        </button>
      </div>
    </div>
  );
};

export default ImageCropModal;
