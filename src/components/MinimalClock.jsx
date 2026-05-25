import { useTime } from '../hooks/useTime'
import { useTheme } from '../context/ThemeContext'

export default function MinimalClock() {
  const { pad, hours12, m, s, ampm, dayName, month, date } = useTime()
  const { accent } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none">
      <p className="font-mono text-xs tracking-[0.6em] uppercase" style={{ color: 'var(--text-faint)' }}>
        {dayName} · {month} {pad(date)}
      </p>
      <div className="flex items-start leading-none mt-4">
        <span className="font-display text-[clamp(6rem,22vw,18rem)] leading-[0.85]" style={{ color: 'var(--text-primary)' }}>{pad(hours12)}</span>
        <span className="font-display text-[clamp(6rem,22vw,18rem)] leading-[0.85] mx-1" style={{ color: 'var(--text-faint)' }}>:</span>
        <span className="font-display text-[clamp(6rem,22vw,18rem)] leading-[0.85]" style={{ color: 'var(--text-primary)' }}>{pad(m)}</span>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <span className="font-display text-3xl" style={{ color: accent.primary }}>{ampm}</span>
        <span className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>:{pad(s)}</span>
      </div>
    </div>
  )
}
