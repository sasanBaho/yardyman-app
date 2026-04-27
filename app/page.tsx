"use client";
import { useState, useEffect } from "react";
import ProviderPopupCard from "@/components/ui/ProviderPopupCard";
import type { ProviderPopupCardProps } from "@/components/ui/ProviderPopupCard";
import Navbar from "@/components/ui/Navbar";
import Image from "next/image";
import LawnSnowRow from "@/components/ui/rows/LawnSnowRow";
import HeroRow from "@/components/ui/rows/HeroRow";
import TestimonialRow from "@/components/ui/rows/TestimonialRow";
import ConnectRow from "@/components/ui/rows/ConnectRow";
import WhyDownloadRow from "@/components/ui/rows/WhyDownloadRow";

type Provider = Omit<ProviderPopupCardProps["provider"], ""> & {
  latitude: number;
  longitude: number;
  imageUrl: string;
  providerName?: string;
  instagramID?: string;
  description?: string;
  rating?: number;
  ratingsCount?: number;
  selectedServices?: string[];
  phoneNumber: String;
  hasTools?: boolean;
  paymentMethods?: string[];
};

import { Map, MapControls, MapMarker, MarkerContent } from "@/components/ui/map";
// import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";

function ProviderAvatar({ imageUrl, name }: { imageUrl: string; name: string }) {
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      overflow: "hidden",
      border: "2px solid #fff",
      background: "#eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: -20,
      top: -20,
    }}>
      <img
        src={imageUrl}
        alt={name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

function UserLocationIndicator() {
  return (
    <>
      <span
        style={{
          display: "block",
          width: 32,
          height: 32,
          background: "rgba(0, 153, 255, 0.2)",
          borderRadius: "50%",
          position: "absolute",
          left: -16,
          top: -16,
          animation: "pulse 1.5s infinite",
          border: "2px solid #09f",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          display: "block",
          width: 15,
          height: 15,
          background: "#09f",
          borderRadius: "50%",
          position: "absolute",
          left: -6,
          top: -6,
          boxShadow: "0 0 8px 2px #09f7",
          border: "2px solid #fff",
          pointerEvents: "none",
        }}
      />
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </>
  );
}

export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const mapStyle = "https://tiles.openfreemap.org/styles/bright";
  const [providers, setProviders] = useState<Provider[]>([]);
  const [viewport, setViewport] = useState({
    zoom: 11,
    bearing: 0,
    pitch: 0,
  });
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [activeService, setActiveService] = useState<"snow" | "lawn">("snow");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setViewport((v) => ({
            ...v,
            center: coords,
            zoom: 14,
          }));
          setUserLocation(coords);
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
    async function fetchProviders() {
      const querySnapshot = await getDocs(collection(db, "providers"));
      const fetchedProviders: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedProviders.push({
          latitude: data.latitude,
          longitude: data.longitude,
          imageUrl: data.imageUrl,
          providerName: data.providerName,
          instagramID: data.instagramID,
          rating: data.rating,
          ratingsCount: data.ratingsCount,
          description: data.description,
          phoneNumber: data.phoneNumber,
          selectedServices: Array.isArray(data.selectedServices) ? data.selectedServices : [],
          hasTools: data.hasTools || false,
          paymentMethods: Array.isArray(data.paymentMethods) ? data.paymentMethods : [],
        });
      });
      setProviders(fetchedProviders);
    }
    fetchProviders();
  }, [mounted]);

  // Filtering logic for providers
  const filteredProviders = providers.filter((provider) => {
    if (activeService === "snow") {
      return provider.selectedServices?.includes("service-two");
    } else {
      return provider.selectedServices?.includes("service-one");
    }
  });

  // Helper to get relevant description for popup
  function getRelevantDescription(provider: Provider | null) {
    if (!provider) return "";
    if (provider.description && typeof provider.description === "object") {
      if (activeService === "snow") {
        return provider.description["service-two"] || "";
      } else {
        return provider.description["service-one"] || "";
      }
    }
    return provider.description || "";
  }

  return (
    <>
      <Navbar />
      {/* Map Section */}
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100dvh",
          minHeight: "100svh",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 72,
            right: 16,
            zIndex: 120,
            display: "flex",
            gap: 10,
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "9999px",
            padding: "8px 12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
            backdropFilter: "blur(4px)",
          }}
        >
          <button
            onClick={() => setActiveService("snow")}
            style={{
              border: "none",
              background: "none",
              fontWeight: 600,
              fontSize: 15,
              color: activeService === "snow" ? "#09f" : "#555",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 8px",
            }}
          >
            <img
              src={activeService === "snow" ? "/shovel-blue.png" : "/shovel-black.png"}
              alt="Shovel icon"
              style={{ width: 24, height: 24 }}
            />
            <span>Snow removals</span>
          </button>

          <button
            onClick={() => setActiveService("lawn")}
            style={{
              border: "none",
              background: "none",
              fontWeight: 600,
              fontSize: 15,
              color: activeService === "lawn" ? "rgb(5, 181, 5)" : "#555",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 8px",
            }}
          >
            <img
              src={activeService === "lawn" ? "/lawn-mower-green.png" : "/lawn-mower-black.png"}
              alt="Lawn mower icon"
              style={{ width: 24, height: 24 }}
            />
            <span>Lawn care</span>
          </button>
        </div>
        <Map
          className="w-full h-full"
          viewport={viewport}
          onViewportChange={setViewport}
          styles={{ light: mapStyle, dark: mapStyle }}
        >
          <MapControls showLocate={true} onLocate={(coords) => {
            setViewport((v) => ({ ...v, center: [coords.longitude, coords.latitude], zoom: 14 }));
            setUserLocation([coords.longitude, coords.latitude]);
          }} />
          {userLocation && (
            <MapMarker longitude={userLocation[0]} latitude={userLocation[1]}>
              <MarkerContent>
                <UserLocationIndicator />
              </MarkerContent>
            </MapMarker>
          )}
          {filteredProviders.map(
            (provider, idx) =>
              provider.latitude && provider.longitude && provider.imageUrl && (
                <MapMarker
                  key={idx}
                  longitude={provider.longitude}
                  latitude={provider.latitude}
                >
                  <MarkerContent>
                    <div onClick={() => setSelectedProvider(provider)} style={{ cursor: "pointer" }}>
                      <ProviderAvatar imageUrl={provider.imageUrl} name={provider.providerName || "Provider"} />
                    </div>
                  </MarkerContent>
                </MapMarker>
              )
          )}
        </Map>
      </div>
      {selectedProvider && (
        <ProviderPopupCard
          provider={{ ...selectedProvider, description: getRelevantDescription(selectedProvider) }}
          onClose={() => setSelectedProvider(null)}
          activeService={activeService}
        />
      )}
    </>
  );
}
