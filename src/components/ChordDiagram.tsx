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

export function ChordDiagram({ chordName, size = "md" }: ChordDiagramProps) {
  const chord = getChord(chordName);
  const config = sizeConfig[size];

  if (!chord) {
    return (
      <div
        className="flex flex-col items-center justify-center text-gray-500"
        style={{ width: config.width, height: config.height + 20 }}
      >
        <span style={{ fontSize: config.titleSize }}>{chordName}</span>
        <span style={{ fontSize: config.fontSize }}>Unknown</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <span
        className="text-white font-bold mb-1"
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
      {/* Nut (thick line at top) or fret position indicator */}
      {chord.baseFret === 1 ? (
        <rect
          x={padding.left - 2}
          y={padding.top - 3}
          width={fretboardWidth + 4}
          height={4}
          fill="white"
        />
      ) : (
        <text
          x={padding.left - 12}
          y={getFretY(0) + fretSpacing / 2 + 4}
          fill="white"
          fontSize={fontSize}
          textAnchor="middle"
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
          stroke="gray"
          strokeWidth={i === 0 && chord.baseFret !== 1 ? 2 : 1}
        />
      ))}

      {/* Strings (vertical lines) */}
      {Array.from({ length: numStrings }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={getStringX(i)}
          y1={padding.top}
          x2={getStringX(i)}
          y2={padding.top + fretboardHeight}
          stroke="gray"
          strokeWidth={1}
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
          fill="white"
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
              fill="white"
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
              stroke="white"
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
            <circle cx={x} cy={y} r={dotRadius} fill="white" />
            {finger > 0 && (
              <text
                x={x}
                y={y}
                fill="black"
                fontSize={fontSize}
                textAnchor="middle"
                dominantBaseline="central"
                fontWeight="bold"
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
