"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "wordmark";
  className?: string;
  animated?: boolean;
}

const sizes = {
  sm: { icon: 24, text: 16 },
  md: { icon: 32, text: 20 },
  lg: { icon: 48, text: 28 },
  xl: { icon: 64, text: 36 },
};

export function Logo({
  size = "md",
  variant = "full",
  className = "",
  animated = false,
}: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size];

  const iconElement = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? "animate-float" : ""}
      aria-hidden="true"
    >
      {/* Background circle with warm gradient */}
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5a623" />
          <stop offset="100%" stopColor="#e8930c" />
        </linearGradient>
        <linearGradient id="book-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fafaf9" />
          <stop offset="100%" stopColor="#d4d4d4" />
        </linearGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="24" cy="24" r="22" fill="url(#logo-gradient)" opacity="0.15" />

      {/* Main circle */}
      <circle cx="24" cy="24" r="20" fill="url(#logo-gradient)" />

      {/* Book/songbook icon */}
      <g transform="translate(12, 11)">
        {/* Book spine */}
        <path
          d="M12 0 L12 26"
          stroke="#0a0a0b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Left page */}
        <path
          d="M2 3 C2 2 3 1 5 1 L12 1 L12 23 L5 23 C3 23 2 22 2 21 L2 3 Z"
          fill="#0a0a0b"
          opacity="0.9"
        />

        {/* Right page */}
        <path
          d="M22 3 C22 2 21 1 19 1 L12 1 L12 23 L19 23 C21 23 22 22 22 21 L22 3 Z"
          fill="#0a0a0b"
          opacity="0.8"
        />

        {/* Musical note on left page */}
        <g transform="translate(4, 6)" fill="url(#logo-gradient)">
          <ellipse cx="2" cy="10" rx="2" ry="1.5" />
          <path d="M4 10 L4 2 L7 1 L7 3 L4 4" strokeWidth="0" />
          <rect x="3.5" y="2" width="1" height="8" rx="0.5" />
          <path d="M4 2 Q6 1 7 2 L7 4 Q6 3 4 4 Z" />
        </g>

        {/* Lines on right page (representing lyrics) */}
        <g stroke="#f5a623" strokeWidth="1" strokeLinecap="round" opacity="0.6">
          <line x1="14" y1="6" x2="19" y2="6" />
          <line x1="14" y1="9" x2="18" y2="9" />
          <line x1="14" y1="12" x2="19" y2="12" />
          <line x1="14" y1="15" x2="17" y2="15" />
          <line x1="14" y1="18" x2="19" y2="18" />
        </g>
      </g>
    </svg>
  );

  const wordmarkElement = (
    <span
      className="font-display font-semibold tracking-tight"
      style={{ fontSize: textSize }}
    >
      <span className="text-[var(--text-primary)]">Sang</span>
      <span className="text-[var(--accent-primary)]">boken</span>
    </span>
  );

  if (variant === "icon") {
    return <div className={className}>{iconElement}</div>;
  }

  if (variant === "wordmark") {
    return <div className={className}>{wordmarkElement}</div>;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {iconElement}
      {wordmarkElement}
    </div>
  );
}

// Favicon-optimized version (simpler for small sizes)
export function LogoFavicon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fav-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5a623" />
          <stop offset="100%" stopColor="#e8930c" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="32" height="32" rx="8" fill="#111113" />

      {/* Simple book + note icon */}
      <g transform="translate(6, 5)">
        {/* Book */}
        <path
          d="M10 0 L10 22 M2 2 C2 1 3 0 5 0 L10 0 L10 20 L5 20 C3 20 2 19 2 18 L2 2 Z M18 2 C18 1 17 0 15 0 L10 0 L10 20 L15 20 C17 20 18 19 18 18 L18 2 Z"
          fill="url(#fav-gradient)"
        />

        {/* Note symbol */}
        <circle cx="6" cy="14" r="2" fill="#111113" />
        <rect x="7.5" y="6" width="1.5" height="8" rx="0.75" fill="#111113" />
      </g>
    </svg>
  );
}
