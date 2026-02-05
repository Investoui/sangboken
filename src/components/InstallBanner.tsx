"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Platform = "ios" | "android" | "desktop" | "unknown";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [isStandalone, setIsStandalone] = useState(true); // Default true to hide initially
  const [isDismissed, setIsDismissed] = useState(true);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setIsStandalone(standalone);

    // Check if previously dismissed
    const dismissed = localStorage.getItem("install-banner-dismissed");
    setIsDismissed(!!dismissed);

    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform("ios");
    } else if (/android/.test(ua)) {
      setPlatform("android");
    } else if (!/mobile/.test(ua)) {
      setPlatform("desktop");
    }

    // Listen for install prompt (Chrome/Edge on Android & Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("install-banner-dismissed", "true");
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsDismissed(true);
      }
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed, dismissed, or unknown platform
  if (isStandalone || isDismissed || platform === "unknown") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)]">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Installer Sangboken
          </p>
          <p className="text-xs text-[var(--text-secondary)] truncate">
            {platform === "ios" && "Trykk Del-knappen, så «Legg til på Hjem-skjerm»"}
            {platform === "android" && "Legg til på hjemskjermen for rask tilgang"}
            {platform === "desktop" && "Installer som app for bedre opplevelse"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {platform === "ios" ? (
            <Link
              href="/installer"
              className="px-3 py-1.5 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-lg"
            >
              Vis meg
            </Link>
          ) : deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-lg"
            >
              Installer
            </button>
          ) : (
            <Link
              href="/installer"
              className="px-3 py-1.5 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-lg"
            >
              Hvordan?
            </Link>
          )}

          <button
            onClick={handleDismiss}
            className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            aria-label="Lukk"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
