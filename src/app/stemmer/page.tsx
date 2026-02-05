"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

// Standard guitar tuning frequencies (Hz)
const GUITAR_STRINGS = [
  { note: "E2", frequency: 82.41, string: 6, label: "E" },
  { note: "A2", frequency: 110.0, string: 5, label: "A" },
  { note: "D3", frequency: 146.83, string: 4, label: "D" },
  { note: "G3", frequency: 196.0, string: 3, label: "G" },
  { note: "B3", frequency: 246.94, string: 2, label: "B" },
  { note: "E4", frequency: 329.63, string: 1, label: "e" },
];

// All note frequencies for detection
const NOTE_FREQUENCIES: { note: string; frequency: number }[] = [];
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Generate frequencies for octaves 1-6
for (let octave = 1; octave <= 6; octave++) {
  for (let i = 0; i < NOTE_NAMES.length; i++) {
    const noteIndex = i - 9 + octave * 12; // A4 = 440Hz is the reference
    const frequency = 440 * Math.pow(2, (noteIndex - 48) / 12);
    if (frequency >= 60 && frequency <= 500) {
      NOTE_FREQUENCIES.push({
        note: `${NOTE_NAMES[i]}${octave}`,
        frequency,
      });
    }
  }
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function MicIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function MicOffIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
      <path d="M5 10v2a7 7 0 0 0 12 5" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function TuningForkIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v10M16 3v10M8 13c0 2.5 2 4 4 4s4-1.5 4-4M12 17v5" />
    </svg>
  );
}

// Autocorrelation pitch detection
function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let foundGoodCorrelation = false;
  const correlations = new Array(MAX_SAMPLES);

  // Calculate RMS to check if there's enough signal
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);

  if (rms < 0.01) return -1; // Not enough signal

  let lastCorrelation = 1;
  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;

    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;
    correlations[offset] = correlation;

    if (correlation > 0.9 && correlation > lastCorrelation) {
      foundGoodCorrelation = true;
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    } else if (foundGoodCorrelation) {
      const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
      return sampleRate / (bestOffset + 8 * shift);
    }
    lastCorrelation = correlation;
  }

  if (bestCorrelation > 0.01) {
    return sampleRate / bestOffset;
  }
  return -1;
}

function findClosestNote(frequency: number): { note: string; frequency: number; cents: number } | null {
  if (frequency <= 0) return null;

  let closest = NOTE_FREQUENCIES[0];
  let minDiff = Math.abs(frequency - closest.frequency);

  for (const noteFreq of NOTE_FREQUENCIES) {
    const diff = Math.abs(frequency - noteFreq.frequency);
    if (diff < minDiff) {
      minDiff = diff;
      closest = noteFreq;
    }
  }

  // Calculate cents (100 cents = 1 semitone)
  const cents = Math.round(1200 * Math.log2(frequency / closest.frequency));

  return {
    note: closest.note,
    frequency: closest.frequency,
    cents,
  };
}

function getStringForNote(note: string): typeof GUITAR_STRINGS[0] | null {
  return GUITAR_STRINGS.find((s) => s.note === note) || null;
}

export default function TunerPage() {
  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [detectedNote, setDetectedNote] = useState<{ note: string; frequency: number; cents: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedString, setSelectedString] = useState<typeof GUITAR_STRINGS[0] | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const analyze = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);

    const freq = autoCorrelate(buffer, audioContextRef.current.sampleRate);

    if (freq > 0) {
      setFrequency(freq);
      const closest = findClosestNote(freq);
      setDetectedNote(closest);
    }

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      analyze();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Kunne ikke koble til mikrofonen. Sjekk at du har gitt tillatelse.");
    }
  }, [analyze]);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setFrequency(null);
    setDetectedNote(null);
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Determine tuning status
  const getTuningStatus = () => {
    if (!detectedNote) return null;

    const targetNote = selectedString?.note;
    if (!targetNote) {
      // Just show if note is in tune
      if (Math.abs(detectedNote.cents) <= 5) return "perfect";
      if (Math.abs(detectedNote.cents) <= 10) return "good";
      return detectedNote.cents > 0 ? "sharp" : "flat";
    }

    // Check if detected note matches selected string
    if (detectedNote.note === targetNote) {
      if (Math.abs(detectedNote.cents) <= 5) return "perfect";
      if (Math.abs(detectedNote.cents) <= 10) return "good";
      return detectedNote.cents > 0 ? "sharp" : "flat";
    }

    return "wrong-note";
  };

  const tuningStatus = getTuningStatus();

  const statusColors = {
    perfect: "text-green-400",
    good: "text-green-300",
    sharp: "text-[var(--accent-primary)]",
    flat: "text-blue-400",
    "wrong-note": "text-[var(--text-muted)]",
  };

  const statusMessages = {
    perfect: "Perfekt stemt!",
    good: "Nesten der!",
    sharp: "For hoy - slakk ned",
    flat: "For lav - stram opp",
    "wrong-note": selectedString ? `Forventet ${selectedString.note}` : "",
  };

  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent-primary)] opacity-[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-60 h-60 bg-[var(--accent-primary)] opacity-[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-6 safe-area-inset">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <BackIcon />
            <span>Tilbake</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
              <TuningForkIcon className="w-8 h-8 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
                Gitarstemmer
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Stem gitaren med mikrofonen
              </p>
            </div>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Main tuner display */}
        <div className="card p-8 mb-6">
          {/* Detected note display */}
          <div className="text-center mb-8">
            <div className="text-8xl font-mono font-bold text-[var(--text-primary)] mb-2">
              {detectedNote ? detectedNote.note.replace(/\d/, "") : "--"}
              {detectedNote && (
                <span className="text-4xl text-[var(--text-muted)]">
                  {detectedNote.note.match(/\d/)?.[0]}
                </span>
              )}
            </div>
            <div className="text-[var(--text-secondary)] text-lg">
              {frequency ? `${frequency.toFixed(1)} Hz` : "Venter pa signal..."}
            </div>
          </div>

          {/* Cents indicator */}
          <div className="relative h-16 mb-8">
            {/* Scale background */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-[var(--bg-elevated)] rounded-full">
              {/* Center marker */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-green-500 rounded-full" />
            </div>

            {/* Labels */}
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs text-[var(--text-muted)]">
              <span>-50</span>
              <span>For lav</span>
              <span className="text-green-400">0</span>
              <span>For hoy</span>
              <span>+50</span>
            </div>

            {/* Needle indicator */}
            {detectedNote && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-100"
                style={{
                  left: `${50 + Math.max(-50, Math.min(50, detectedNote.cents))}%`,
                  backgroundColor:
                    Math.abs(detectedNote.cents) <= 5
                      ? "#4ade80"
                      : Math.abs(detectedNote.cents) <= 10
                      ? "#86efac"
                      : detectedNote.cents > 0
                      ? "#f5a623"
                      : "#60a5fa",
                  boxShadow: "0 0 12px currentColor",
                }}
              />
            )}
          </div>

          {/* Status message */}
          {tuningStatus && (
            <div className={`text-center text-xl font-semibold ${statusColors[tuningStatus]}`}>
              {statusMessages[tuningStatus]}
            </div>
          )}
        </div>

        {/* String selector */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-4">
            Velg streng (valgfritt)
          </h2>
          <div className="grid grid-cols-6 gap-2">
            {GUITAR_STRINGS.map((string) => {
              const isActive = selectedString?.string === string.string;
              const isDetected = detectedNote?.note === string.note;

              return (
                <button
                  key={string.string}
                  onClick={() => setSelectedString(isActive ? null : string)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-[var(--bg-deep)]"
                      : isDetected && isListening
                      ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="text-2xl font-mono font-bold">{string.label}</div>
                  <div className="text-xs opacity-70">{string.frequency.toFixed(0)} Hz</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start/Stop button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
            isListening
              ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              : "btn btn-primary"
          }`}
        >
          {isListening ? (
            <>
              <MicOffIcon className="w-6 h-6" />
              <span>Stopp stemmer</span>
            </>
          ) : (
            <>
              <MicIcon className="w-6 h-6" />
              <span>Start stemmer</span>
            </>
          )}
        </button>

        {/* Info text */}
        <p className="text-center text-[var(--text-muted)] text-sm mt-6">
          Spill en streng og se om den er stemt. Grønt = stemt, oransje = for høy, blå = for lav.
        </p>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <Logo size="sm" variant="icon" />
            <p className="text-[var(--text-muted)] text-sm">
              Standard gitarstemming (EADGBE)
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
