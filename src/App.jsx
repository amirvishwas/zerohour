import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Faces from './pages/Faces'
import Pomodoro from './pages/Pomodoro'

function ClockRoute() {
  const { face } = useParams()
  return <Home face={face} />
}

function DefaultRoute() {
  const saved = localStorage.getItem('zerohour_face')
  if (saved && saved !== 'digital') return <Navigate to={`/clock/${saved}`} replace />
  return <Home face={saved || 'digital'} />
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/"            element={<DefaultRoute />} />
        <Route path="/faces"       element={<Faces />} />
        <Route path="/clock/:face" element={<ClockRoute />} />
        <Route path="/focus"       element={<Pomodoro />} />
      </Routes>
    </ThemeProvider>
  )
}
