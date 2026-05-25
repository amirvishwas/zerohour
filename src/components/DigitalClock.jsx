import { useTime } from '../hooks/useTime'
import { useTheme } from '../context/ThemeContext'

export default function DigitalClock() {
  const { pad, hours12, m, s, ampm, dayName, date, month } = useTime()
  const { accent, bg } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none">
      <p className="font-mono text-sm tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--text-muted)' }}>
        {dayName}, {month} {date}
      </p>
      <div className="flex items-end gap-2">
        <span className="font-display text-[clamp(5rem,18vw,14rem)] leading-none" style={{ color: 'var(--text-primary)' }}>{pad(hours12)}</span>
        <span className="font-display text-[clamp(5rem,18vw,14rem)] leading-none animate-pulse" style={{ color: accent.primary }}> :</span>
        <span className="font-display text-[clamp(5rem,18vw,14rem)] leading-none" style={{ color: 'var(--text-primary)' }}>{pad(m)}</span>
        <span className="font-display text-[clamp(5rem,18vw,14rem)] leading-none" style={{ color: 'var(--text-faint)' }}>:</span>
        <span className="font-display text-[clamp(5rem,18vw,14rem)] leading-none" style={{ color: 'var(--text-muted)' }}>{pad(s)}</span>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <span className="font-mono text-2xl tracking-widest" style={{ color: accent.primary }}>{ampm}</span>
        <span className="w-px h-5" style={{ background: 'var(--border)' }} />
        <span className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Local Time</span>
      </div>
    </div>
  )
}
