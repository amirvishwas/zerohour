import { useState, useEffect } from 'react'

export function useTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const h = time.getHours()
  const m = time.getMinutes()
  const s = time.getSeconds()
  const ms = time.getMilliseconds()

  const pad = (n) => String(n).padStart(2, '0')

  const hours12 = h % 12 || 12
  const ampm = h >= 12 ? 'PM' : 'AM'

  const hourDeg = (hours12 / 12) * 360 + (m / 60) * 30
  const minDeg = (m / 60) * 360 + (s / 60) * 6
  const secDeg = (s / 60) * 360 + (ms / 1000) * 6

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]

  return {
    raw: time,
    h, m, s,
    pad,
    hours12,
    ampm,
    hourDeg,
    minDeg,
    secDeg,
    timeStr: `${pad(h)}:${pad(m)}:${pad(s)}`,
    time12Str: `${pad(hours12)}:${pad(m)}:${pad(s)}`,
    dayName: dayNames[time.getDay()],
    date: time.getDate(),
    month: monthNames[time.getMonth()],
    year: time.getFullYear(),
  }
}
