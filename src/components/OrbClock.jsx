import { useTime } from '../hooks/useTime'
import { useTheme } from '../context/ThemeContext'

export default function OrbClock() {
  const { pad, hours12, m, s, ampm, dayName, month, date } = useTime()
  const { accent, bg } = useTheme()

  const secProgress = s / 60
  const minProgress = (m + s / 60) / 60
  const a = accent.primary
  const orbBg = bg.light
    ? `radial-gradient(circle at 35% 35%, ${a}33 0%, transparent 55%), radial-gradient(circle at 50% 50%, #e8e4dc 0%, #d8d4cc 100%)`
    : `radial-gradient(circle at 35% 35%, ${a}55 0%, transparent 55%), radial-gradient(circle at 50% 50%, #1a0f05 0%, #0d0d0d 60%, #0a0a0a 100%)`

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none">
      <div className="relative flex items-center justify-center" style={{ width: 'clamp(260px,42vw,480px)', height: 'clamp(260px,42vw,480px)' }}>
        <div className="orb-ring-3 absolute inset-0 rounded-full" style={{ border: `1px solid ${a}18`, transform: 'scale(1.15)' }} />
        <div className="orb-ring-2 absolute inset-0 rounded-full" style={{ border: `1px solid ${a}25`, transform: 'scale(1.08)' }} />
        <div className="orb-ring-1 absolute inset-0 rounded-full" style={{ border: `1px solid ${a}33`, transform: 'scale(1.02)' }} />
        <div className="orb-pulse absolute inset-0 rounded-full"
          style={{ background: orbBg, boxShadow: `0 0 60px ${a}25, 0 0 120px ${a}12, inset 0 0 40px ${a}08` }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="47" fill="none" stroke={`${a}14`} strokeWidth="0.8" />
          <circle cx="50" cy="50" r="47" fill="none" stroke={`${a}80`} strokeWidth="0.8"
            strokeLinecap="round" strokeDasharray={`${minProgress * 295.3} 295.3`} />
        </svg>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100"
          style={{ transform: 'rotate(-90deg) scale(0.88)', transformOrigin: 'center' }}>
          <circle cx="50" cy="50" r="47" fill="none" stroke={`${a}0d`} strokeWidth="1" />
          <circle cx="50" cy="50" r="47" fill="none" stroke={`${a}b3`} strokeWidth="1"
            strokeLinecap="round" strokeDasharray={`${secProgress * 295.3} 295.3`}
            style={{ transition: 'stroke-dasharray 0.5s ease' }} />
        </svg>
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="flex items-end gap-1">
            <span className="font-display leading-none" style={{ fontSize: 'clamp(3rem,8vw,7rem)', color: 'var(--text-primary)' }}>{pad(hours12)}</span>
            <span className="font-display leading-none animate-pulse" style={{ fontSize: 'clamp(3rem,8vw,7rem)', color: a, marginBottom: '2px' }}>:</span>
            <span className="font-display leading-none" style={{ fontSize: 'clamp(3rem,8vw,7rem)', color: 'var(--text-primary)' }}>{pad(m)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl" style={{ color: a }}>{ampm}</span>
            <span className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>:{pad(s)}</span>
          </div>
        </div>
      </div>
      <p className="font-mono text-xs tracking-[0.4em] uppercase mt-2" style={{ color: 'var(--text-faint)' }}>
        {dayName} · {month} {date}
      </p>
    </div>
  )
}
