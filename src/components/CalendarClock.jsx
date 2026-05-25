import { useTime } from '../hooks/useTime'
import { useTheme } from '../context/ThemeContext'

export default function CalendarClock() {
  const { pad, hours12, m, s, ampm, dayName, date, month, year, raw } = useTime()
  const { accent } = useTheme()

  const firstDay    = new Date(raw.getFullYear(), raw.getMonth(), 1).getDay()
  const daysInMonth = new Date(raw.getFullYear(), raw.getMonth() + 1, 0).getDate()
  const today       = raw.getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none gap-5 px-4">
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{month}</p>
          <p className="font-display text-[clamp(4rem,12vw,9rem)] leading-none" style={{ color: 'var(--text-primary)' }}>{date}</p>
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{year}</p>
        </div>
        <div className="w-px h-24" style={{ background: 'var(--border)' }} />
        <div className="text-center">
          <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{dayName}</p>
          <p className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-none" style={{ color: accent.primary }}>
            {pad(hours12)}:{pad(m)}
          </p>
          <p className="font-mono text-sm tracking-widest" style={{ color: 'var(--text-muted)' }}>{ampm} · :{pad(s)}</p>
        </div>
      </div>
      <div className="w-full max-w-xs mt-2">
        <div className="grid grid-cols-7 mb-2">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-center font-mono text-xs py-1" style={{ color: 'var(--text-muted)' }}>{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => (
              <div key={di} className="text-center font-mono text-sm py-1.5 rounded-lg transition-all"
                style={{
                  background: day === today ? accent.primary : 'transparent',
                  color: day === today ? '#000' : day ? 'var(--text-muted)' : 'transparent',
                  fontWeight: day === today ? 700 : 400,
                }}>
                {day || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
