"use client";
import { useState, useEffect } from "react";
import ProviderPopupCard from "@/components/ui/ProviderPopupCard";
import type { ProviderPopupCardProps } from "@/components/ui/ProviderPopupCard";
import Navbar from "@/components/ui/Navbar";

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
      boxShadow: "0 0 8px 2px #09f7",
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

  useEffect(() => {
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
          selectedServices: Array.isArray(data.selectedServices) ? data.selectedServices : [],
        });
      });
      setProviders(fetchedProviders);
    }
    fetchProviders();
  }, []);

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
      <Navbar
        active={activeService}
        onSelect={(service) => {
          setActiveService(service);
          setSelectedProvider(null);
        }}
      />
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Map
          className="w-full h-full"
          viewport={viewport}
          onViewportChange={setViewport}
          styles={{ light: mapStyle, dark: mapStyle }}
        >
          <MapControls />
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
        />
      )}
    </>
  );
}
