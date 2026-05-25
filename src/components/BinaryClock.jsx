import { useTime } from '../hooks/useTime'
import { useTheme } from '../context/ThemeContext'

export default function BinaryClock() {
  const { h, m, s, pad } = useTime()
  const { accent } = useTheme()

  const toBinary = (n, bits) => n.toString(2).padStart(bits, '0').split('')
  const rows = [
    { label: 'HH', bits: toBinary(h, 6), value: pad(h) },
    { label: 'MM', bits: toBinary(m, 6), value: pad(m) },
    { label: 'SS', bits: toBinary(s, 6), value: pad(s) },
  ]

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none gap-8">
      <p className="font-mono text-xs tracking-[0.5em] uppercase" style={{ color: 'var(--text-muted)' }}>Binary Time</p>
      <div className="flex flex-col gap-5">
        {rows.map(({ label, bits, value }) => (
          <div key={label} className="flex items-center gap-4">
            <span className="font-mono text-xs w-6" style={{ color: 'var(--text-muted)' }}>{label}</span>
            <div className="flex gap-2">
              {bits.map((bit, i) => (
                <div key={i} className="rounded-sm transition-all duration-300"
                  style={{
                    width: 'clamp(22px,4vw,38px)', height: 'clamp(22px,4vw,38px)',
                    background: bit === '1' ? accent.primary : 'var(--border)',
                  }} />
              ))}
            </div>
            <span className="font-display text-3xl w-10 text-right" style={{ color: 'var(--text-muted)' }}>{value}</span>
          </div>
        ))}
      </div>
      <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-faint)' }}>
        {`${pad(h)}:${pad(m)}:${pad(s)}`}
      </p>
    </div>
  )
}
