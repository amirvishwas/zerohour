import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const MODES = [
  { key: "focus", label: "Focus", minutes: 25, color: "accent" },
  { key: "short", label: "Short Break", minutes: 5, color: "green" },
  { key: "long", label: "Long Break", minutes: 15, color: "blue" },
  { key: "stopwatch", label: "Stopwatch", minutes: 0, color: "purple" },
];

const PRESETS = [
  { label: "25 / 5", focus: 25, short: 5, long: 15 },
  { label: "50 / 10", focus: 50, short: 10, long: 20 },
  { label: "90 / 20", focus: 90, short: 20, long: 30 },
];

function beep(ctx, type = "done") {
  if (!ctx) return;
  const freqs = type === "done" ? [523, 659, 784] : [784, 659];
  const delays = type === "done" ? [0, 0.15, 0.3] : [0, 0.2];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    const t = ctx.currentTime + delays[i];
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.start(t);
    osc.stop(t + 0.5);
  });
}

function tick(ctx) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 1000;
  osc.type = "square";
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
}

export default function Pomodoro() {
  const navigate = useNavigate();
  const { accent } = useTheme();

  const [modeIdx, setModeIdx] = useState(0);
  const [preset, setPreset] = useState(0);
  const [durations, setDurations] = useState({ focus: 25, short: 5, long: 15 });
  const [seconds, setSeconds] = useState(25 * 60);
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [tickOn, setTickOn] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const audioCtx = useRef(null);
  const intervalR = useRef(null);

  const mode = MODES[modeIdx];

  const getAudio = useCallback(() => {
    if (!audioCtx.current)
      audioCtx.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
    return audioCtx.current;
  }, []);

  const switchMode = useCallback(
    (idx) => {
      setModeIdx(idx);
      setRunning(false);
      if (idx === 3) {
        setStopwatchMs(0);
      } else {
        setSeconds(durations[MODES[idx].key] * 60);
      }
      clearInterval(intervalR.current);
    },
    [durations],
  );

  const applyPreset = (p) => {
    const pr = PRESETS[p];
    setPreset(p);
    setDurations({ focus: pr.focus, short: pr.short, long: pr.long });
    setSeconds(pr[MODES[modeIdx].key] * 60);
    setRunning(false);
    clearInterval(intervalR.current);
    setShowPresets(false);
  };

  useEffect(() => {
    if (!running) {
      clearInterval(intervalR.current);
      return;
    }

    if (modeIdx === 3) {
      const startTime = Date.now() - stopwatchMs;
      let lastTick = Math.floor(stopwatchMs / 1000);

      intervalR.current = setInterval(() => {
        const currentMs = Date.now() - startTime;
        setStopwatchMs(currentMs);

        const currentSec = Math.floor(currentMs / 1000);
        if (currentSec > lastTick) {
          lastTick = currentSec;
          if (tickOn && soundOn) tick(getAudio());
        }
      }, 10);
    } else {
      intervalR.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalR.current);
            setRunning(false);
            if (soundOn) beep(getAudio(), "done");
            if (modeIdx === 0) setSessions((n) => n + 1);
            return 0;
          }
          if (tickOn && soundOn) tick(getAudio());
          return s - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalR.current);
  }, [running, modeIdx, tickOn, soundOn, getAudio]);

  const reset = () => {
    setRunning(false);
    if (modeIdx === 3) {
      setStopwatchMs(0);
    } else {
      setSeconds(durations[mode.key] * 60);
    }
    clearInterval(intervalR.current);
  };

  let mm, ss, msStr;
  if (modeIdx === 3) {
    mm = String(Math.floor(stopwatchMs / 60000)).padStart(2, "0");
    ss = String(Math.floor((stopwatchMs % 60000) / 1000)).padStart(2, "0");
    msStr = String(Math.floor((stopwatchMs % 1000) / 10)).padStart(2, "0");
  } else {
    mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    ss = String(seconds % 60).padStart(2, "0");
  }

  const R = 130;
  const circ = 2 * Math.PI * R;

  let progress = 0;
  if (modeIdx === 3) {
    progress = (stopwatchMs % 60000) / 60000;
  } else {
    const total = durations[mode.key] * 60;
    progress = 1 - seconds / total;
  }

  const pct = Math.min(progress * 100, 100);
  const dash = circ * (1 - pct / 100);

  const modeColors = {
    accent: accent.primary,
    green: "#22c55e",
    blue: "#3b82f6",
    purple: "#a855f7",
  };
  const activeColor = modeColors[mode.color];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors"
          style={{ color: "#666" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary, #000)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
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
          style={{ color: "var(--text-primary, #1a1a1a)" }}
        >
          ZERO<span style={{ color: accent.primary }}>FOCUS</span>
        </span>

        <div className="flex items-center gap-3">
          <div
            className="font-mono text-xs tracking-widest"
            style={{ color: "#555" }}
          >
            <span style={{ color: accent.primary }}>{sessions}</span> sessions
          </div>
          <button
            onClick={() => setSoundOn((v) => !v)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: soundOn ? accent.primary + "20" : "transparent",
              border: `1px solid ${soundOn ? accent.primary : "#333"}`,
            }}
            title={soundOn ? "Mute" : "Unmute"}
          >
            {soundOn ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accent.primary}
                strokeWidth="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-8">
        <div className="flex items-center gap-4">
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {MODES.slice(0, 3).map((m, i) => (
              <button
                key={m.key}
                onClick={() => switchMode(i)}
                className="px-4 py-2 rounded-lg font-mono text-xs tracking-widest uppercase transition-all"
                style={{
                  background:
                    i === modeIdx ? modeColors[m.color] + "22" : "transparent",
                  color: i === modeIdx ? modeColors[m.color] : "#555",
                  border:
                    i === modeIdx
                      ? `1px solid ${modeColors[m.color]}44`
                      : "1px solid transparent",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => switchMode(3)}
            className="px-4 py-2 rounded-xl font-mono text-xs tracking-widest uppercase transition-all"
            style={{
              background:
                3 === modeIdx
                  ? modeColors[MODES[3].color] + "22"
                  : "var(--card)",
              color: 3 === modeIdx ? modeColors[MODES[3].color] : "#555",
              border:
                3 === modeIdx
                  ? `1px solid ${modeColors[MODES[3].color]}44`
                  : "1px solid var(--border)",
            }}
          >
            {MODES[3].label}
          </button>
        </div>

        <div
          className="relative flex items-center justify-center"
          style={{ width: 300, height: 300 }}
        >
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            className="-rotate-90 absolute inset-0"
          >
            <circle
              cx="150"
              cy="150"
              r={R}
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            <circle
              cx="150"
              cy="150"
              r={R}
              fill="none"
              stroke={activeColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              style={{
                transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease",
                filter: `drop-shadow(0 0 8px ${activeColor}66)`,
              }}
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className="flex items-baseline font-display leading-none"
              style={{ color: "var(--text-primary, #1a1a1a)" }}
            >
              <span style={{ fontSize: 80 }}>
                {mm}
                <span style={{ color: activeColor, opacity: 0.8 }}>:</span>
                {ss}
              </span>
              {modeIdx === 3 && (
                <span
                  style={{
                    fontSize: 40,
                    color: activeColor,
                    opacity: 0.8,
                    marginLeft: "4px",
                  }}
                >
                  .{msStr}
                </span>
              )}
            </div>
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "#444" }}
            >
              {mode.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          <button
            onClick={() => {
              getAudio();
              setRunning((v) => !v);
            }}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all"
            style={{
              background: activeColor,
              boxShadow: `0 0 30px ${activeColor}44`,
              transform: "scale(1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.06)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {running ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#000"
                stroke="none"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#000"
                stroke="none"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setTickOn((v) => !v)}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all font-mono text-xs"
            style={{
              background: tickOn ? activeColor + "22" : "var(--card)",
              border: `1px solid ${tickOn ? activeColor + "55" : "var(--border)"}`,
              color: tickOn ? activeColor : "#555",
            }}
            title="Tick sound"
          >
            tic
          </button>
        </div>

        <div
          className="flex flex-col items-center gap-3 transition-opacity duration-300"
          style={{
            visibility: modeIdx === 3 ? "hidden" : "visible",
            opacity: modeIdx === 3 ? 0 : 1,
            pointerEvents: modeIdx === 3 ? "none" : "auto",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setShowPresets((v) => !v)}
              className="font-mono text-xs tracking-widest uppercase transition-colors"
              style={{ color: showPresets ? accent.primary : "#444" }}
            >
              {showPresets ? "▲ Hide Presets" : "▼ Presets"}
            </button>

            {showPresets && (
              <div className="flex gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(i)}
                    className="px-4 py-2 rounded-xl font-mono text-xs tracking-widest transition-all"
                    style={{
                      background:
                        preset === i ? accent.primary + "22" : "var(--card)",
                      border: `1px solid ${preset === i ? accent.primary : "var(--border)"}`,
                      color: preset === i ? accent.primary : "#666",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center mt-2">
            <div className="flex gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{
                    background:
                      i < sessions % 4 ? activeColor : "var(--border)",
                    boxShadow:
                      i < sessions % 4 ? `0 0 6px ${activeColor}88` : "none",
                  }}
                />
              ))}
            </div>
            <span className="font-mono text-xs ml-2" style={{ color: "#444" }}>
              {sessions > 0 && sessions % 4 === 0
                ? "🎉 Long break!"
                : `${4 - (sessions % 4)} until long break`}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
