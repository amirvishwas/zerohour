import { useTime } from "../hooks/useTime";
import { useTheme } from "../context/ThemeContext";

export default function WavyClock() {
  const { pad, hours12, m, s, ampm } = useTime();
  const { accent } = useTheme();

  const chars = `${pad(hours12)}:${pad(m)}:${pad(s)} ${ampm}`.split("");

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none gap-10">
      <p
        className="font-mono text-sm tracking-[0.5em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Time in motion
      </p>

      <div className="flex items-center justify-center flex-wrap gap-0">
        {chars.map((ch, i) => (
          <span
            key={i}
            className="wave-char font-display text-[clamp(3.5rem,10vw,9rem)] leading-none"
            style={{
              animationDelay: `${i * 0.08}s`,
              color:
                ch === ":"
                  ? accent.primary
                  : ch === " "
                    ? "transparent"
                    : "var(--text-primary)",
              width: ch === " " ? "1.5rem" : "auto",
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>

      <div className="flex gap-1.5 mt-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full"
            style={{
              height: `${12 + Math.sin(Date.now() / 400 + i * 0.6) * 12 + 12}px`,
              background: accent.primary,
              animation: `wave ${0.8 + i * 0.04}s ease-in-out infinite`,
              animationDelay: `${i * 0.05}s`,
              opacity: 0.3 + (i / 20) * 0.7,
            }}
          />
        ))}
      </div>
    </div>
  );
}
