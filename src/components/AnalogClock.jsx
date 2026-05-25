import { useTime } from '../hooks/useTime'
import { useTheme } from '../context/ThemeContext'

export default function AnalogClock() {
  const { hourDeg, minDeg, secDeg, timeStr } = useTime()
  const { accent, bg } = useTheme()

  const ticks = Array.from({ length: 60 }, (_, i) => i)
  const dialFill = bg.light ? '#e8e4dc' : '#111'
  const dialStroke = bg.light ? '#ccc' : '#1a1a1a'
  const textColor = bg.light ? '#222' : '#f0ede6'
  const tickMinor = bg.light ? '#bbb' : '#333'

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none gap-6">
      <div className="relative" style={{ width: 'clamp(240px, 38vw, 420px)', height: 'clamp(240px, 38vw, 420px)' }}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle cx="200" cy="200" r="195" fill="none" stroke={dialStroke} strokeWidth="2" />
          <circle cx="200" cy="200" r="190" fill={dialFill} />
          {ticks.map(i => {
            const angle = (i / 60) * 360
            const rad = (angle - 90) * (Math.PI / 180)
            const isHour = i % 5 === 0
            const r1 = isHour ? 165 : 175
            const x1 = 200 + r1 * Math.cos(rad)
            const y1 = 200 + r1 * Math.sin(rad)
            const x2 = 200 + 185 * Math.cos(rad)
            const y2 = 200 + 185 * Math.sin(rad)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isHour ? textColor : tickMinor} strokeWidth={isHour ? 2.5 : 1} />
          })}
          {[3, 6, 9, 12].map(num => {
            const rad = ((num / 12) * 360 - 90) * (Math.PI / 180)
            return (
              <text key={num} x={200 + 148 * Math.cos(rad)} y={200 + 148 * Math.sin(rad)}
                textAnchor="middle" dominantBaseline="central"
                fill={textColor} fontSize="20" fontFamily="Bebas Neue" letterSpacing="1">
                {num}
              </text>
            )
          })}
          <line x1="200" y1="200" x2="200" y2="90" stroke={textColor} strokeWidth="8" strokeLinecap="round"
            className="hand" style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: '200px 200px' }} />
          <line x1="200" y1="200" x2="200" y2="60" stroke={textColor} strokeWidth="4" strokeLinecap="round"
            className="hand" style={{ transform: `rotate(${minDeg}deg)`, transformOrigin: '200px 200px', opacity: 0.85 }} />
          <line x1="200" y1="220" x2="200" y2="50" stroke={accent.primary} strokeWidth="2" strokeLinecap="round"
            style={{ transform: `rotate(${secDeg}deg)`, transformOrigin: '200px 200px', transition: 'transform 0.15s ease' }} />
          <circle cx="200" cy="200" r="8" fill={accent.primary} />
          <circle cx="200" cy="200" r="4" fill={dialFill} />
        </svg>
      </div>
      <p className="font-mono tracking-widest text-lg" style={{ color: 'var(--text-muted)' }}>{timeStr}</p>
    </div>
  )
}
