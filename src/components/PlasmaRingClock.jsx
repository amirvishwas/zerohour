import { useEffect, useRef } from "react";
import { useTime } from "../hooks/useTime";
import { useTheme } from "../context/ThemeContext";

const RINGS = [
  { r: 0.38, thickness: 0.048, opacity: [0.13, 0.8, 1.0], label: "H" },
  { r: 0.29, thickness: 0.036, opacity: [0.1, 0.7, 1.0], label: "M" },
  { r: 0.21, thickness: 0.026, opacity: [0.08, 0.6, 1.0], label: "S" },
];
const GAP = 0.35;

export default function PlasmaRingClock() {
  const canvasRef = useRef(null);
  const { accent } = useTheme();
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const size = canvas.width;
      const CX = size / 2;
      const CY = size / 2;

      ctx.clearRect(0, 0, size, size);

      const now = new Date();
      const h = now.getHours() % 12;
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ms = now.getMilliseconds();

      const vals = [
        h / 12,
        (m + (s + ms / 1000) / 60) / 60,
        (s + ms / 1000) / 60,
      ];

      const a = accent.primary;
      const dim = [a + "22", a + "bb", a];

      RINGS.forEach((ring, i) => {
        const r = ring.r * size;
        const thick = ring.thickness * size;
        const v = vals[i];
        const start = -Math.PI / 2 + v * Math.PI * 2;
        const end = start + Math.PI * 2 - GAP;

        ctx.save();

        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = thick + 3;
        ctx.beginPath();
        ctx.arc(CX, CY, r, 0, Math.PI * 2);
        ctx.stroke();

        const gx1 = CX + r * Math.cos(start);
        const gy1 = CY + r * Math.sin(start);
        const gx2 = CX + r * Math.cos(end);
        const gy2 = CY + r * Math.sin(end);
        const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
        grad.addColorStop(0, a + "18");
        grad.addColorStop(0.5, a + "aa");
        grad.addColorStop(1, a);

        ctx.strokeStyle = grad;
        ctx.lineWidth = thick;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(CX, CY, r, start, end);
        ctx.stroke();

        const tx = CX + r * Math.cos(end);
        const ty = CY + r * Math.sin(end);
        ctx.fillStyle = a;
        ctx.shadowBlur = 14;
        ctx.shadowColor = a;
        ctx.beginPath();
        ctx.arc(tx, ty, thick / 2 + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      const pad = (n) => String(n).padStart(2, "0");
      const hh12 = now.getHours() % 12 || 12;
      const ampm = now.getHours() >= 12 ? "PM" : "AM";

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = `${size * 0.105}px "Bebas Neue"`;
      ctx.fillStyle = "var(--text-primary, #f0ede6)";
      ctx.fillText(`${pad(hh12)}:${pad(m)}`, CX, CY - size * 0.025);

      ctx.font = `${size * 0.032}px "Space Mono"`;
      ctx.fillStyle = a;
      ctx.fillText(`:${pad(s)}  ${ampm}`, CX, CY + size * 0.058);
    };

    const loop = () => {
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [accent.primary]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none gap-4">
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        style={{
          width: "clamp(260px, 46vw, 420px)",
          height: "clamp(260px, 46vw, 420px)",
        }}
      />
      <p
        className="font-mono text-xs tracking-[0.4em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Plasma Ring
      </p>
    </div>
  );
}
