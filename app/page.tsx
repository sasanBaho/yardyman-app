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
  id: string;
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
  isAvailable?: boolean;
};

import { Map } from "@/components/map/components/Map";
import { MapControls } from "@/components/map/components/MapControls";
import { MapMarker, MarkerContent } from "@/components/map/components/MapMarker";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { db, collection, getDocs, auth, query, where } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthFlow from "@/components/auth/AuthFlow";
import ProviderProfileModal, { ProviderProfile } from "@/components/auth/ProviderProfileModal";

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
  const [showAuth, setShowAuth] = useState(false);
  const [currentProviderData, setCurrentProviderData] = useState<ProviderProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentProviderData(null);
        return;
      }
      try {
        const snap = await getDocs(query(collection(db, "providers"), where("uid", "==", user.uid)));
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setCurrentProviderData({
            uid: user.uid,
            name: data.providerName ?? "",
            phone: data.phoneNumber ?? "",
            email: data.email ?? "",
            photoUrl: data.imageUrl ?? "",
            city: data.city ?? "",
            selectedServices: Array.isArray(data.selectedServices) ? data.selectedServices : [],
            descriptions: data.description && typeof data.description === "object" ? data.description : {},
            hasTools: data.hasTools ?? false,
            paymentMethods: Array.isArray(data.paymentMethods) ? data.paymentMethods : [],
            isAvailable: data.isAvailable ?? true,
            profileViews: data.profileViews ?? 0,
          });
        }
      } catch {
        setCurrentProviderData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    setCurrentProviderData(null);
  }

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

    trackPageView({
      page_title: "Home Map",
      page_path: "/",
      page_location: typeof window !== "undefined" ? window.location.href : "/",
    });

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
          id: doc.id,
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
          isAvailable: data.isAvailable ?? true,
        });
      });
      setProviders(fetchedProviders);
    }
    fetchProviders();
  }, [mounted]);

  // Filtering logic for providers
  const filteredProviders = providers.filter((provider) => {
    if (provider.isAvailable === false) return false;
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

  function handleProviderSelect(provider: Provider) {
    trackEvent("Provider Profile Viewed", {
      providerId: provider.id,
      providerName: provider.providerName || "Unknown",
      serviceType: activeService,
      hasTools: Boolean(provider.hasTools),
      rating: provider.rating ?? null,
      ratingsCount: provider.ratingsCount ?? 0,
      paymentMethodsCount: provider.paymentMethods?.length ?? 0,
      hasInstagram: Boolean(provider.instagramID),
      viewSource: "map_annotation",
    });

    setSelectedProvider(provider);
  }

  function handleServiceChange(service: "snow" | "lawn") {
    trackEvent("Service Filter Switched", {
      selectedService: service,
      previousService: activeService,
      providerResultsCount:
        service === "snow"
          ? providers.filter((provider) => provider.selectedServices?.includes("service-two")).length
          : providers.filter((provider) => provider.selectedServices?.includes("service-one")).length,
    });

    setActiveService(service);
  }

  return (
    <>
      <Navbar
        onCreateAccount={currentProviderData ? undefined : () => setShowAuth(true)}
        currentUser={currentProviderData ? { photoUrl: currentProviderData.photoUrl, name: currentProviderData.name } : null}
        onSignOut={handleSignOut}
        onEditAccount={() => setShowProfile(true)}
      >
        <button
          onClick={() => handleServiceChange("snow")}
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
            borderRadius: 9999,
          }}
        >
          <img
            src={activeService === "snow" ? "/shovel-blue.png" : "/shovel-black.png"}
            alt="Shovel icon"
            style={{ width: 30, height: 30 }}
          />
          {!isSmallScreen && <span>Snow removals</span>}
        </button>

        <button
          onClick={() => handleServiceChange("lawn")}
          style={{
            border: "none",
            background: "none",
            fontWeight: 600,
            fontSize: 15,
            color: activeService === "lawn" ? "rgb(69, 197, 69)" : "#555",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 8px",
            borderRadius: 9999,
          }}
        >
          <img
            src={activeService === "lawn" ? "/lawn-mower-green.png" : "/lawn-mower-black.png"}
            alt="Lawn mower icon"
            style={{ width: 34, height: 34 }}
          />
          {!isSmallScreen && <span>Lawn care</span>}
        </button>
      </Navbar>
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
                    <div onClick={() => handleProviderSelect(provider)} style={{ cursor: "pointer" }}>
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
      {showProfile && currentProviderData && (
        <ProviderProfileModal
          profile={currentProviderData}
          onClose={() => setShowProfile(false)}
          onAvailabilityChange={(isAvailable) => {
            setProviders((prev) =>
              prev.map((p) =>
                p.id === currentProviderData.uid ? { ...p, isAvailable } : p
              )
            );
          }}
          onProfileUpdated={(updated) => {
            setCurrentProviderData(updated);
            setProviders((prev) =>
              prev.map((p) =>
                p.id === updated.uid
                  ? {
                      ...p,
                      selectedServices: updated.selectedServices,
                      description: updated.descriptions as any,
                      hasTools: updated.hasTools,
                      paymentMethods: updated.paymentMethods,
                    }
                  : p
              )
            );
          }}
        />
      )}
      <AuthFlow
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        userLocation={userLocation}
        onProviderCreated={async () => {
          const querySnapshot = await getDocs(collection(db, "providers"));
          const fetched: any[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            fetched.push({
              id: doc.id,
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
              isAvailable: data.isAvailable ?? true,
            });
          });
          setProviders(fetched);
        }}
      />
    </>
  );
}
