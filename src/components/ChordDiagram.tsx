"use client";

import { ChordFingering, getChord } from "@/lib/chord-library";

interface ChordDiagramProps {
  chordName: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { width: 60, height: 80, dotRadius: 6, fontSize: 8, titleSize: 10 },
  md: { width: 80, height: 100, dotRadius: 8, fontSize: 10, titleSize: 14 },
  lg: { width: 120, height: 150, dotRadius: 12, fontSize: 14, titleSize: 18 },
};

// Design system colors (hardcoded for SVG compatibility)
const colors = {
  accentPrimary: "#f5a623",
  accentSecondary: "#e8930c",
  textPrimary: "#fafaf9",
  textSecondary: "rgba(250, 250, 249, 0.7)",
  textMuted: "rgba(250, 250, 249, 0.25)",
  borderStrong: "rgba(255, 255, 255, 0.15)",
  borderDefault: "rgba(255, 255, 255, 0.1)",
  bgDeep: "#0a0a0b",
};

export function ChordDiagram({ chordName, size = "md" }: ChordDiagramProps) {
  const chord = getChord(chordName);
  const config = sizeConfig[size];

  if (!chord) {
    return (
      <div
        className="flex flex-col items-center justify-center text-[var(--text-muted)]"
        style={{ width: config.width, height: config.height + 20 }}
      >
        <span
          className="chord font-bold"
          style={{ fontSize: config.titleSize }}
        >
          {chordName}
        </span>
        <span style={{ fontSize: config.fontSize }}>Ukjent</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center group">
      <span
        className="chord font-bold mb-1 transition-all group-hover:scale-110"
        style={{ fontSize: config.titleSize }}
      >
        {chord.name}
      </span>
      <ChordSVG chord={chord} config={config} />
    </div>
  );
}

interface ChordSVGProps {
  chord: ChordFingering;
  config: (typeof sizeConfig)["md"];
}

function ChordSVG({ chord, config }: ChordSVGProps) {
  const { width, height, dotRadius, fontSize } = config;
  const numStrings = 6;
  const numFrets = 4;

  // Unique ID for this chord's gradients (to avoid conflicts when multiple chords render)
  const gradientId = `dot-${chord.name.replace(/[^a-zA-Z0-9]/g, "")}`;

  // Layout calculations
  const padding = { top: 20, bottom: 10, left: 15, right: 10 };
  const fretboardWidth = width - padding.left - padding.right;
  const fretboardHeight = height - padding.top - padding.bottom;
  const stringSpacing = fretboardWidth / (numStrings - 1);
  const fretSpacing = fretboardHeight / numFrets;

  // String positions (0 = low E on the left, 5 = high e on the right)
  const getStringX = (stringIndex: number) =>
    padding.left + stringIndex * stringSpacing;

  // Fret positions (0 = nut at top, 4 = bottom)
  const getFretY = (fretIndex: number) => padding.top + fretIndex * fretSpacing;

  // Get Y position for a finger dot at a specific fret
  const getDotY = (fret: number) => {
    if (fret === 0) return padding.top - 8; // Above nut for open strings
    const relativeFret = fret - (chord.baseFret - 1);
    return getFretY(relativeFret) - fretSpacing / 2;
  };

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        {/* Gradient for dots - amber/gold */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.accentPrimary} />
          <stop offset="100%" stopColor={colors.accentSecondary} />
        </linearGradient>
        {/* Shadow filter */}
        <filter
          id={`${gradientId}-shadow`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="1"
            floodColor={colors.accentPrimary}
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      {/* Nut (thick line at top) or fret position indicator */}
      {chord.baseFret === 1 ? (
        <rect
          x={padding.left - 2}
          y={padding.top - 3}
          width={fretboardWidth + 4}
          height={4}
          fill={colors.textPrimary}
          rx={2}
        />
      ) : (
        <text
          x={padding.left - 12}
          y={getFretY(0) + fretSpacing / 2 + 4}
          fill={colors.textSecondary}
          fontSize={fontSize}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
        >
          {chord.baseFret}
        </text>
      )}

      {/* Frets (horizontal lines) */}
      {Array.from({ length: numFrets + 1 }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={padding.left}
          y1={getFretY(i)}
          x2={padding.left + fretboardWidth}
          y2={getFretY(i)}
          stroke={colors.borderStrong}
          strokeWidth={i === 0 && chord.baseFret !== 1 ? 2 : 1}
        />
      ))}

      {/* Strings (vertical lines) - gradient from thicker to thinner */}
      {Array.from({ length: numStrings }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={getStringX(i)}
          y1={padding.top}
          x2={getStringX(i)}
          y2={padding.top + fretboardHeight}
          stroke={colors.borderDefault}
          strokeWidth={1.5 - i * 0.15}
        />
      ))}

      {/* Barre indicator */}
      {chord.barre && (
        <rect
          x={getStringX(chord.barre.fromString) - dotRadius / 2}
          y={getDotY(chord.barre.fret) - dotRadius / 2}
          width={
            getStringX(chord.barre.toString) -
            getStringX(chord.barre.fromString) +
            dotRadius
          }
          height={dotRadius}
          rx={dotRadius / 2}
          fill={`url(#${gradientId})`}
          filter={`url(#${gradientId}-shadow)`}
        />
      )}

      {/* Finger positions and string indicators */}
      {chord.frets.map((fret, stringIndex) => {
        const x = getStringX(stringIndex);
        const finger = chord.fingers[stringIndex];

        if (fret === -1) {
          // Muted string (×)
          return (
            <text
              key={`mute-${stringIndex}`}
              x={x}
              y={padding.top - 8}
              fill={colors.textMuted}
              fontSize={fontSize + 2}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              ×
            </text>
          );
        }

        if (fret === 0) {
          // Open string (○)
          return (
            <circle
              key={`open-${stringIndex}`}
              cx={x}
              cy={padding.top - 8}
              r={dotRadius / 2}
              fill="none"
              stroke={colors.textSecondary}
              strokeWidth={1.5}
            />
          );
        }

        // Fretted note - only show if not part of a barre (or is the barre position)
        const isInBarre =
          chord.barre &&
          fret === chord.barre.fret &&
          stringIndex >= chord.barre.fromString &&
          stringIndex <= chord.barre.toString &&
          stringIndex !== chord.barre.fromString;

        if (isInBarre) {
          return null;
        }

        const y = getDotY(fret);

        return (
          <g key={`finger-${stringIndex}`}>
            <circle
              cx={x}
              cy={y}
              r={dotRadius}
              fill={`url(#${gradientId})`}
              filter={`url(#${gradientId}-shadow)`}
            />
            {finger > 0 && (
              <text
                x={x}
                y={y}
                fill={colors.bgDeep}
                fontSize={fontSize}
                textAnchor="middle"
                dominantBaseline="central"
                fontWeight="bold"
                fontFamily="'JetBrains Mono', monospace"
              >
                {finger}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
