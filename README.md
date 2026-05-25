# ZEROHOUR 🕐

A minimal, bold clock web app with multiple clock faces — built with React, Tailwind CSS, and Vite.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat&logo=tailwindcss)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel)

---

## Features

- **8 Clock Faces** — switch between completely different visual styles
- **Fullscreen mode** — one click to go distraction-free
- **Remembers your last face** — picks up where you left off via localStorage
- **Live previews** — every face on the picker shows the actual current time
- **Fully responsive** — works on mobile, tablet, and desktop

---

## Clock Faces

| Face | Description |
|------|-------------|
| **Digital** | Bold Bebas Neue numbers with HH:MM:SS |
| **Analog** | SVG dial with smooth sweeping hands |
| **Flip** | Split-flap airport board animation |
| **Orb** | Pulsing gradient sphere with progress arcs |
| **Wavy** | Characters that bounce in a wave pattern |
| **Calendar** | Full month grid alongside the current time |
| **Minimal** | Just the hour and minute, extra large |
| **Binary** | Time displayed as lit/unlit binary dots |

---

## Tech Stack

- **React 18** — UI and state
- **React Router 6** — face routing (`/clock/:face`)
- **Tailwind CSS 3** — utility styling
- **Vite 5** — dev server and bundler
- **Bebas Neue + DM Sans + Space Mono** — typography via Google Fonts

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/zerohour.git
cd zerohour

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
zerohour/
├── index.html
├── vercel.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── App.jsx              # Routes
    ├── main.jsx             # Entry point
    ├── index.css            # Global styles + animations
    ├── hooks/
    │   └── useTime.js       # Live clock hook (ticks every second)
    ├── components/
    │   ├── DigitalClock.jsx
    │   ├── AnalogClock.jsx
    │   ├── FlipClock.jsx
    │   ├── OrbClock.jsx
    │   ├── WavyClock.jsx
    │   ├── CalendarClock.jsx
    │   ├── MinimalClock.jsx
    │   ├── BinaryClock.jsx
    │   └── FullscreenButton.jsx
    └── pages/
        ├── Home.jsx         # Main clock view
        └── Faces.jsx        # Face picker grid
```

---

## Deployment

The app is configured for Vercel out of the box via `vercel.json`. React Router rewrites are included so deep links like `/clock/flip` work correctly in production.

```bash
npm run build   # builds to /dist
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Loads last used face (or Digital by default) |
| `/faces` | Face picker with live previews |
| `/clock/:face` | Direct link to a specific face |

Valid face values: `digital` `analog` `flip` `orb` `wavy` `calendar` `minimal` `binary`

---

## License

MIT
