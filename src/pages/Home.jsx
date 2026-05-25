import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import FullscreenButton from "../components/FullscreenButton";
import ThemePanel from "../components/ThemePanel";
import DigitalClock from "../components/DigitalClock";
import AnalogClock from "../components/AnalogClock";
import WavyClock from "../components/WavyClock";
import CalendarClock from "../components/CalendarClock";
import MinimalClock from "../components/MinimalClock";
import BinaryClock from "../components/BinaryClock";
import FlipClock from "../components/FlipClock";
import OrbClock from "../components/OrbClock";

const FACES = {
  digital: DigitalClock,
  analog: AnalogClock,
  wavy: WavyClock,
  calendar: CalendarClock,
  minimal: MinimalClock,
  binary: BinaryClock,
  flip: FlipClock,
  orb: OrbClock,
};

export default function Home({ face = "digital" }) {
  const clockRef = useRef(null);
  const navigate = useNavigate();
  const { accent, bgKey, setBgKey, BACKGROUNDS } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const [isFS, setIsFS] = useState(false);
  const ClockFace = FACES[face] || DigitalClock;
  const [customBgUrl, setCustomBgUrl] = useState(null);

  useEffect(() => {
    if (face && FACES[face]) localStorage.setItem("zerohour_face", face);
  }, [face]);

  useEffect(() => {
    const onChange = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (BACKGROUNDS && !BACKGROUNDS.custom) {
      BACKGROUNDS.custom = {
        name: "Custom Image",
        bg: "#000",
        border: "#222",
        card: "#111",
        light: false,
      };
    }

    const stored = localStorage.getItem("zeroclock_custom_bg");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Date.now() < parsed.expiry) {
          setCustomBgUrl(parsed.data);

          if (localStorage.getItem("zeroclock_use_custom") === "true") {
            setBgKey("custom");
          }
        } else {
          localStorage.removeItem("zeroclock_custom_bg");
          localStorage.removeItem("zeroclock_use_custom");
        }
      } catch (e) {
        localStorage.removeItem("zeroclock_custom_bg");
      }
    }
  }, [BACKGROUNDS, setBgKey]);

  const btnBase = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 14px",
    borderRadius: 9999,
    fontFamily: "'Space Mono',monospace",
    fontSize: 11,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    border: "1px solid var(--border)",
    color: "var(--text-muted)",
    background: "var(--card)",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  return (
    <div
      ref={clockRef}
      className="flex flex-col h-screen overflow-hidden relative"
      style={{
        background:
          bgKey === "custom" && customBgUrl
            ? `url(${customBgUrl}) center/cover no-repeat`
            : "var(--bg)",
      }}
    >
      {bgKey === "custom" && customBgUrl && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />
      )}

      <header
        className="flex items-center justify-between px-6 py-4 flex-shrink-0 relative z-10"
        style={{
          opacity: isFS ? 0 : 1,
          pointerEvents: isFS ? "none" : "auto",
          transition: "opacity 0.4s",
        }}
      >
        <span
          className="font-display text-2xl tracking-widest"
          style={{ color: "var(--text-primary)" }}
        >
          ZERO<span style={{ color: accent.primary }}>HOUR</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            style={btnBase}
            onClick={() => navigate("/focus")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent.primary;
              e.currentTarget.style.color = accent.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Focus
          </button>
          <button
            style={btnBase}
            onClick={() => setThemeOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent.primary;
              e.currentTarget.style.color = accent.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: accent.primary,
              }}
            />
            Theme
          </button>
          <FullscreenButton targetRef={clockRef} />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center min-h-0 relative z-10">
        <ClockFace />
      </main>

      <footer
        className="flex items-center justify-center pb-8 flex-shrink-0 relative z-10"
        style={{
          opacity: isFS ? 0 : 1,
          pointerEvents: isFS ? "none" : "auto",
          transition: "opacity 0.4s",
        }}
      >
        <button
          onClick={() => navigate("/faces")}
          className="group flex flex-col items-center gap-2 transition-colors duration-200"
          style={{
            color: "var(--text-muted)",
            background: "var(--card)",
            padding: "8px 16px",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <span className="font-mono text-xs tracking-[0.4em] uppercase">
            Clock Faces
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="animate-bounce"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </footer>

      <ThemePanel open={themeOpen} onClose={() => setThemeOpen(false)} />
    </div>
  );
}
