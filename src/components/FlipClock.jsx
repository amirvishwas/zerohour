import { useState, useEffect, useRef } from "react";
import { useTime } from "../hooks/useTime";
import { useTheme } from "../context/ThemeContext";

const CARD_W = "clamp(70px,12vw,140px)";
const CARD_H = "clamp(100px,18vw,200px)";
const FONT_SZ = "clamp(80px,15vw,180px)";

function FlipCard({ digit, prevDigit }) {
  const { bg } = useTheme();
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(prevDigit);

  useEffect(() => {
    if (digit !== prevRef.current) {
      setFlipping(true);
      prevRef.current = digit;
      const t = setTimeout(() => setFlipping(false), 420);
      return () => clearTimeout(t);
    }
  }, [digit]);

  const cardTop = bg.light ? "#d8d4cc" : "#1c1c1c";
  const cardBot = bg.light ? "#ccc8c0" : "#161616";
  const numColor = bg.light ? "#1a1a1a" : "#f0ede6";
  const divider = bg.light ? "#bbb" : "#0a0a0a";

  const topStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    overflow: "hidden",
    borderRadius: "8px 8px 0 0",
    background: cardTop,
    borderBottom: `1.5px solid ${divider}`,
  };
  const botStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    overflow: "hidden",
    borderRadius: "0 0 8px 8px",
    background: cardBot,
  };

  const numStyleTop = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "200%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Bebas Neue',cursive",
    fontSize: FONT_SZ,
    lineHeight: 1,
    color: numColor,
    userSelect: "none",
  };
  const numStyleBot = { ...numStyleTop, top: "auto", bottom: 0 };

  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        flexShrink: 0,
      }}
    >
      <style>{`
        @keyframes fTop { 0%{transform:rotateX(0)} 100%{transform:rotateX(-90deg)} }
        @keyframes fBot { 0%{transform:rotateX(90deg)} 100%{transform:rotateX(0)} }
        .fa-top { animation:fTop 0.35s ease-in forwards; transform-origin:bottom center; }
        .fa-bot { animation:fBot 0.35s ease-out 0.2s forwards; transform-origin:top center; transform:rotateX(90deg); }
      `}</style>
      <div style={topStyle}>
        <span style={numStyleTop}>{digit}</span>
      </div>
      <div style={botStyle}>
        <span style={numStyleBot}>{digit}</span>
      </div>
      {flipping && (
        <>
          <div
            className="fa-top"
            style={{
              ...topStyle,
              zIndex: 10,
              background: bg.light ? "#ccc" : "#242424",
            }}
          >
            <span style={{ ...numStyleTop, opacity: 0.5 }}>
              {prevRef.current}
            </span>
          </div>
          <div className="fa-bot" style={{ ...botStyle, zIndex: 10 }}>
            <span style={numStyleBot}>{digit}</span>
          </div>
        </>
      )}
    </div>
  );
}

function FlipGroup({ value }) {
  const digits = String(value).padStart(2, "0").split("");
  const prevRef = useRef([...digits]);
  const prev = [...prevRef.current];
  useEffect(() => {
    prevRef.current = [...digits];
  }, [value]);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <FlipCard digit={digits[0]} prevDigit={prev[0]} />
      <FlipCard digit={digits[1]} prevDigit={prev[1]} />
    </div>
  );
}

function Colon() {
  const { accent } = useTheme();
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 1000);
    return () => clearInterval(id);
  }, []);
  const dot = "clamp(8px,1.5vw,14px)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        height: CARD_H,
        paddingBottom: 4,
      }}
    >
      <div
        style={{
          width: dot,
          height: dot,
          borderRadius: "50%",
          background: accent.primary,
          opacity: on ? 1 : 0.15,
          transition: "opacity 0.3s",
        }}
      />
      <div
        style={{
          width: dot,
          height: dot,
          borderRadius: "50%",
          background: accent.primary,
          opacity: on ? 1 : 0.15,
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}

export default function FlipClock() {
  const { hours12, m, s, ampm, dayName, month, date } = useTime();
  const { accent } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none gap-8">
      <p
        className="font-mono text-sm tracking-[0.4em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        {dayName} · {month} {date}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <FlipGroup value={hours12} />
        <Colon />
        <FlipGroup value={m} />
        <Colon />
        <FlipGroup value={s} />
      </div>
      <span
        className="font-display text-3xl tracking-widest"
        style={{ color: accent.primary }}
      >
        {ampm}
      </span>
    </div>
  );
}
