import { useNavigate } from "react-router-dom";
import { useTime } from "../hooks/useTime";
import { useTheme } from "../context/ThemeContext";
import { useRef } from "react";

function DigitalPreview() {
  const { pad, hours12, m, s, ampm } = useTime();
  const { accent } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className="font-display text-4xl leading-none"
        style={{ color: "var(--text-primary)" }}
      >
        {pad(hours12)}
        <span style={{ color: accent.primary }}>:</span>
        {pad(m)}
        <span style={{ color: "var(--text-faint)" }}>:</span>
        <span className="text-2xl" style={{ color: "var(--text-muted)" }}>
          {pad(s)}
        </span>
      </div>
      <span
        className="font-mono text-xs mt-1 tracking-widest"
        style={{ color: accent.primary }}
      >
        {ampm}
      </span>
    </div>
  );
}

function AnalogPreview() {
  const { hourDeg, minDeg, secDeg } = useTime();
  const { accent, bg } = useTheme();
  const dialFill = bg.light ? "#e8e4dc" : "#111";
  const textColor = bg.light ? "#222" : "#f0ede6";
  return (
    <div className="flex items-center justify-center h-full">
      <svg viewBox="0 0 120 120" width="90" height="90">
        <circle
          cx="60"
          cy="60"
          r="58"
          fill={dialFill}
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const rad = (((i / 12) * 360 - 90) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={60 + 50 * Math.cos(rad)}
              y1={60 + 50 * Math.sin(rad)}
              x2={60 + 55 * Math.cos(rad)}
              y2={60 + 55 * Math.sin(rad)}
              stroke="var(--border)"
              strokeWidth="2"
            />
          );
        })}
        <line
          x1="60"
          y1="60"
          x2="60"
          y2="32"
          stroke={textColor}
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            transform: `rotate(${hourDeg}deg)`,
            transformOrigin: "60px 60px",
          }}
        />
        <line
          x1="60"
          y1="60"
          x2="60"
          y2="20"
          stroke={textColor}
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            transform: `rotate(${minDeg}deg)`,
            transformOrigin: "60px 60px",
            opacity: 0.8,
          }}
        />
        <line
          x1="60"
          y1="66"
          x2="60"
          y2="18"
          stroke={accent.primary}
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transform: `rotate(${secDeg}deg)`,
            transformOrigin: "60px 60px",
            transition: "transform 0.15s ease",
          }}
        />
        <circle cx="60" cy="60" r="3" fill={accent.primary} />
      </svg>
    </div>
  );
}

function WavyPreview() {
  const { pad, hours12, m } = useTime();
  const { accent } = useTheme();
  const chars = `${pad(hours12)}:${pad(m)}`.split("");
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <div className="flex">
        {chars.map((c, i) => (
          <span
            key={i}
            className="wave-char font-display text-2xl"
            style={{
              animationDelay: `${i * 0.1}s`,
              color: c === ":" ? accent.primary : "var(--text-primary)",
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full"
            style={{
              height: "6px",
              background: accent.primary,
              animation: `wave ${0.8 + i * 0.05}s ease-in-out infinite`,
              animationDelay: `${i * 0.06}s`,
              opacity: 0.4 + (i / 12) * 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CalendarPreview() {
  const { date, month, hours12, m, pad, ampm } = useTime();
  const { accent } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <p
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        {month}
      </p>
      <p
        className="font-display text-5xl leading-none"
        style={{ color: "var(--text-primary)" }}
      >
        {date}
      </p>
      <p className="font-display text-xl" style={{ color: accent.primary }}>
        {pad(hours12)}:{pad(m)} {ampm}
      </p>
    </div>
  );
}

function MinimalPreview() {
  const { pad, hours12, m } = useTime();
  const { accent } = useTheme();
  return (
    <div className="flex items-center justify-center h-full">
      <span
        className="font-display text-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        {pad(hours12)}
      </span>
      <span
        className="font-display text-4xl mx-1"
        style={{ color: "var(--text-faint)" }}
      >
        :
      </span>
      <span
        className="font-display text-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        {pad(m)}
      </span>
    </div>
  );
}

function BinaryPreview() {
  const { h, m, s } = useTime();
  const { accent } = useTheme();
  const toBin = (n, b) => n.toString(2).padStart(b, "0").split("");
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      {[toBin(h, 6), toBin(m, 6), toBin(s, 6)].map((bits, ri) => (
        <div key={ri} className="flex gap-1">
          {bits.map((b, bi) => (
            <div
              key={bi}
              className="w-3.5 h-3.5 rounded-sm transition-all duration-300"
              style={{
                background: b === "1" ? accent.primary : "var(--border)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function FlipPreview() {
  const { pad, hours12, m, s } = useTime();
  const { accent, bg } = useTheme();
  const cardTop = bg.light ? "#d8d4cc" : "#1a1a1a";
  const cardBot = bg.light ? "#ccc8c0" : "#161616";
  const numColor = bg.light ? "#1a1a1a" : "#f0ede6";
  const vals = [pad(hours12), pad(m), pad(s)];
  return (
    <div className="flex items-center justify-center h-full gap-1.5">
      {vals.map((val, vi) => (
        <div key={vi} className="flex items-center gap-0.5">
          {vi > 0 && (
            <div className="flex flex-col gap-1 mx-0.5">
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: accent.primary }}
              />
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: accent.primary }}
              />
            </div>
          )}
          {val.split("").map((d, di) => (
            <div
              key={di}
              className="flex flex-col rounded overflow-hidden"
              style={{ width: 28, height: 38 }}
            >
              <div
                className="flex-1 flex items-end justify-center pb-0.5"
                style={{
                  background: cardTop,
                  borderBottom: `1px solid var(--bg)`,
                }}
              >
                <span
                  className="font-display text-xl leading-none"
                  style={{ color: numColor }}
                >
                  {d}
                </span>
              </div>
              <div
                className="flex-1 flex items-start justify-center pt-0.5"
                style={{ background: cardBot }}
              >
                <span
                  className="font-display text-xl leading-none"
                  style={{ color: numColor }}
                >
                  {d}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function OrbPreview() {
  const { pad, hours12, m, s } = useTime();
  const { accent } = useTheme();
  const secPct = s / 60;
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className="relative flex items-center justify-center"
        style={{ width: 90, height: 90 }}
      >
        <div
          className="absolute inset-0 rounded-full orb-pulse"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${accent.primary}44 0%, transparent 55%), radial-gradient(circle at 50% 50%, #1a0f05 0%, #0d0d0d 100%)`,
            boxShadow: `0 0 20px ${accent.primary}33`,
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={`${accent.primary}18`}
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={`${accent.primary}99`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${secPct * 289} 289`}
          />
        </svg>
        <span
          className="relative z-10 font-display text-lg leading-none"
          style={{ color: "var(--text-primary)" }}
        >
          {pad(hours12)}:{pad(m)}
        </span>
      </div>
    </div>
  );
}

function PlasmaPreview() {
  const { h, m, s } = useTime();
  const { accent } = useTheme();

  const cHour = 2 * Math.PI * 38;
  const cMin = 2 * Math.PI * 29;
  const cSec = 2 * Math.PI * 21;

  const hPct = (h % 12) / 12;
  const mPct = m / 60;
  const sPct = s / 60;

  return (
    <div className="flex items-center justify-center h-full">
      <div
        className="relative flex items-center justify-center"
        style={{ width: 80, height: 80 }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="var(--border)"
            strokeWidth="4.8"
            opacity="0.3"
          />
          <circle
            cx="50"
            cy="50"
            r="29"
            fill="none"
            stroke="var(--border)"
            strokeWidth="3.6"
            opacity="0.3"
          />
          <circle
            cx="50"
            cy="50"
            r="21"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2.6"
            opacity="0.3"
          />

          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke={accent.primary}
            strokeWidth="4.8"
            strokeLinecap="round"
            strokeDasharray={`${hPct * cHour} ${cHour}`}
            style={{ filter: `drop-shadow(0 0 2px ${accent.primary})` }}
          />
          <circle
            cx="50"
            cy="50"
            r="29"
            fill="none"
            stroke={accent.primary}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeDasharray={`${mPct * cMin} ${cMin}`}
            opacity="0.8"
          />
          <circle
            cx="50"
            cy="50"
            r="21"
            fill="none"
            stroke={accent.primary}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray={`${sPct * cSec} ${cSec}`}
            opacity="0.6"
            style={{ transition: "stroke-dasharray 0.15s ease" }}
          />
        </svg>
      </div>
    </div>
  );
}

const FACES = [
  {
    id: "digital",
    label: "Digital",
    desc: "Bold numbers, clean lines",
    preview: DigitalPreview,
  },
  {
    id: "analog",
    label: "Analog",
    desc: "Classic dial with hands",
    preview: AnalogPreview,
  },
  {
    id: "plasma",
    label: "Plasma",
    desc: "Glowing kinetic rings",
    preview: PlasmaPreview,
  },
  {
    id: "flip",
    label: "Flip",
    desc: "Split-flap airport board",
    preview: FlipPreview,
  },
  {
    id: "orb",
    label: "Orb",
    desc: "Pulsing gradient sphere",
    preview: OrbPreview,
  },
  {
    id: "wavy",
    label: "Wavy",
    desc: "Animated flowing type",
    preview: WavyPreview,
  },
  {
    id: "calendar",
    label: "Calendar",
    desc: "Date + time together",
    preview: CalendarPreview,
  },
  {
    id: "minimal",
    label: "Minimal",
    desc: "Stripped to the core",
    preview: MinimalPreview,
  },
  {
    id: "binary",
    label: "Binary",
    desc: "Time in ones and zeros",
    preview: BinaryPreview,
  },
];

export default function Faces() {
  const navigate = useNavigate();
  const { accent } = useTheme();
  const savedFace = localStorage.getItem("zerohour_face") || "digital";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span
          className="font-display text-2xl tracking-widest"
          style={{ color: "var(--text-primary)" }}
        >
          ZERO<span style={{ color: accent.primary }}>HOUR</span>
        </span>
        <div style={{ width: 64 }} />
      </header>

      <div className="px-6 pt-10 pb-4 text-center">
        <h1
          className="font-display tracking-wide mb-2"
          style={{
            fontSize: "clamp(3rem,8vw,5rem)",
            color: "var(--text-primary)",
          }}
        >
          CLOCK FACES
        </h1>
        <p
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Choose your style
        </p>
      </div>

      <main className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 p-6 max-w-5xl mx-auto w-full pb-10">
        {FACES.map((face) => {
          const Preview = face.preview;
          const isActive = face.id === savedFace;
          return (
            <button
              key={face.id}
              onClick={() => navigate(`/clock/${face.id}`)}
              className="face-card flex flex-col rounded-2xl overflow-hidden text-left"
              style={{
                minHeight: 180,
                background: "var(--card)",
                border: `1px solid ${isActive ? accent.primary : "var(--border)"}`,
                boxShadow: isActive ? `0 0 0 1px ${accent.primary}44` : "none",
                cursor: "pointer",
              }}
            >
              {isActive && (
                <div className="px-3 pt-2">
                  <span
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: accent.primary, fontSize: 9 }}
                  >
                    ● Active
                  </span>
                </div>
              )}
              <div
                className="flex-1 flex items-center justify-center p-3"
                style={{ minHeight: 120 }}
              >
                <Preview />
              </div>
              <div className="px-4 pb-4">
                <p
                  className="font-display text-xl tracking-wider"
                  style={{ color: "var(--text-primary)" }}
                >
                  {face.label}
                </p>
                <p
                  className="font-mono text-xs tracking-wide mt-0.5"
                  style={{ color: "var(--text-muted)", fontSize: 10 }}
                >
                  {face.desc}
                </p>
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
}
