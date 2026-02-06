"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Platform = "ios" | "android" | "desktop" | "unknown";

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function PlusSquareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default function InstallerPage() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setIsStandalone(standalone);

    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform("ios");
    } else if (/android/.test(ua)) {
      setPlatform("android");
    } else if (!/mobile/.test(ua)) {
      setPlatform("desktop");
    } else {
      setPlatform("unknown");
    }
  }, []);

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Allerede installert!
        </h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Du bruker allerede Sangboken som app.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[var(--accent-primary)] text-white rounded-xl font-medium"
        >
          Tilbake til sangene
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <header className="sticky top-0 z-10 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            Installer Sangboken
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <section className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[var(--bg-elevated)] rounded-2xl flex items-center justify-center border border-[var(--border-subtle)]">
            <span className="text-4xl">🎸</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Installer som app
          </h2>
          <p className="text-[var(--text-secondary)]">
            Få rask tilgang til Sangboken rett fra hjemskjermen – uten å åpne
            nettleseren først.
          </p>
        </section>

        {/* iOS Instructions */}
        <section
          className={`rounded-2xl border p-5 ${
            platform === "ios"
              ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
              <span className="text-xl"></span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">
                iPhone og iPad
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Safari</p>
            </div>
            {platform === "ios" && (
              <span className="ml-auto text-xs font-medium text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-1 rounded-full">
                Din enhet
              </span>
            )}
          </div>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium flex items-center justify-center">
                1
              </span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)]">
                  Trykk på{" "}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-base)] rounded border border-[var(--border-subtle)]">
                    <ShareIcon className="w-4 h-4" />
                    Del
                  </span>{" "}
                  i Safari
                </p>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                  Du finner den nederst på skjermen (iPhone) eller øverst (iPad)
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium flex items-center justify-center">
                2
              </span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)]">
                  <strong>Bla ned</strong> i menyen til du ser{" "}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-base)] rounded border border-[var(--border-subtle)]">
                    <PlusSquareIcon className="w-4 h-4" />
                    Legg til på Hjem-skjerm
                  </span>
                </p>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                  Den er ofte skjult lenger ned i lista – fortsett å bla!
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium flex items-center justify-center">
                3
              </span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)]">
                  Trykk <strong>Legg til</strong> øverst til høyre
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Android Instructions */}
        <section
          className={`rounded-2xl border p-5 ${
            platform === "android"
              ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-800 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">
                Android
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Chrome</p>
            </div>
            {platform === "android" && (
              <span className="ml-auto text-xs font-medium text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-1 rounded-full">
                Din enhet
              </span>
            )}
          </div>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium flex items-center justify-center">
                1
              </span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)]">
                  Trykk på{" "}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-base)] rounded border border-[var(--border-subtle)]">
                    <MenuIcon className="w-4 h-4" />
                    menyen
                  </span>{" "}
                  øverst til høyre
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium flex items-center justify-center">
                2
              </span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)]">
                  Velg{" "}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-base)] rounded border border-[var(--border-subtle)]">
                    <DownloadIcon className="w-4 h-4" />
                    Installer app
                  </span>{" "}
                  eller «Legg til på startskjermen»
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium flex items-center justify-center">
                3
              </span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)]">
                  Bekreft ved å trykke <strong>Installer</strong>
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-4 p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
            <p className="text-sm text-[var(--text-secondary)]">
              💡 <strong>Tips:</strong> Chrome viser ofte et eget banner nederst
              på skjermen som spør om du vil installere appen.
            </p>
          </div>
        </section>

        {/* Desktop Instructions */}
        <section
          className={`rounded-2xl border p-5 ${
            platform === "desktop"
              ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center">
              <span className="text-xl">💻</span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">
                Datamaskin
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Chrome, Edge, Brave
              </p>
            </div>
            {platform === "desktop" && (
              <span className="ml-auto text-xs font-medium text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-1 rounded-full">
                Din enhet
              </span>
            )}
          </div>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium flex items-center justify-center">
                1
              </span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)]">
                  Se etter{" "}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-base)] rounded border border-[var(--border-subtle)]">
                    <DownloadIcon className="w-4 h-4" />
                  </span>{" "}
                  ikonet i adressefeltet (til høyre)
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium flex items-center justify-center">
                2
              </span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)]">
                  Klikk på ikonet og velg <strong>Installer</strong>
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Benefits */}
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">
            Fordeler med appen
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-lg">⚡</span>
              <div>
                <p className="text-[var(--text-primary)]">Raskere oppstart</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Åpne direkte fra hjemskjermen
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">🖥️</span>
              <div>
                <p className="text-[var(--text-primary)]">Fullskjerm</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Ingen nettlesergrensesnitt – mer plass til tekst
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">📱</span>
              <div>
                <p className="text-[var(--text-primary)]">Som en vanlig app</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Vises i app-lista og kan deles lett
                </p>
              </div>
            </li>
          </ul>
        </section>

        <div className="text-center pt-4 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-medium"
          >
            ← Tilbake til sangene
          </Link>
        </div>
      </main>
    </div>
  );
}
