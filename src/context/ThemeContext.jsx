import { createContext, useContext, useState, useEffect } from 'react'

const ACCENTS = {
  amber:   { name: 'Amber',   primary: '#f59e0b', rgb: '245,158,11'  },
  orange:  { name: 'Orange',  primary: '#f97316', rgb: '249,115,22'  },
  rose:    { name: 'Rose',    primary: '#f43f5e', rgb: '244,63,94'   },
  violet:  { name: 'Violet',  primary: '#8b5cf6', rgb: '139,92,246'  },
  cyan:    { name: 'Cyan',    primary: '#06b6d4', rgb: '6,182,212'   },
  lime:    { name: 'Lime',    primary: '#84cc16', rgb: '132,204,22'  },
  white:   { name: 'White',   primary: '#f0ede6', rgb: '240,237,230' },
}

const BACKGROUNDS = {
  void:     { name: 'Void',     bg: '#0a0a0a', card: '#111111', border: '#1f1f1f', light: false },
  carbon:   { name: 'Carbon',   bg: '#0d0d0f', card: '#16161a', border: '#222228', light: false },
  ink:      { name: 'Ink',      bg: '#090c10', card: '#0f1318', border: '#1a2030', light: false },
  espresso: { name: 'Espresso', bg: '#0d0a08', card: '#161210', border: '#2a1f18', light: false },
  forest:   { name: 'Forest',   bg: '#080d0a', card: '#0f1512', border: '#182418', light: false },
  midnight: { name: 'Midnight', bg: '#080810', card: '#0e0e1a', border: '#181828', light: false },
  snow:     { name: 'Snow',     bg: '#f8f7f4', card: '#eeecea', border: '#d8d5cf', light: true  },
  paper:    { name: 'Paper',    bg: '#f2ede4', card: '#e8e2d8', border: '#cfc8bb', light: true  },
  chalk:    { name: 'Chalk',    bg: '#eef0f2', card: '#e4e7ea', border: '#c8cdd2', light: true  },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [accentKey, setAccentKey] = useState(() => localStorage.getItem('zh_accent') || 'orange')
  const [bgKey, setBgKey]         = useState(() => localStorage.getItem('zh_bg') || 'void')

  const accent = ACCENTS[accentKey] || ACCENTS.orange
  const bg     = BACKGROUNDS[bgKey] || BACKGROUNDS.void

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent',      accent.primary)
    root.style.setProperty('--accent-rgb',  accent.rgb)
    root.style.setProperty('--bg',          bg.bg)
    root.style.setProperty('--card',        bg.card)
    root.style.setProperty('--border',      bg.border)
    root.style.setProperty('--text-primary', bg.light ? '#1a1a1a' : '#f0ede6')
    root.style.setProperty('--text-muted',   bg.light ? '#777' : '#555')
    root.style.setProperty('--text-faint',   bg.light ? '#aaa' : '#333')
    document.body.style.background = bg.bg
    localStorage.setItem('zh_accent', accentKey)
    localStorage.setItem('zh_bg', bgKey)
  }, [accentKey, bgKey, accent, bg])

  return (
    <ThemeContext.Provider value={{ accent, bg, accentKey, bgKey, setAccentKey, setBgKey, ACCENTS, BACKGROUNDS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
