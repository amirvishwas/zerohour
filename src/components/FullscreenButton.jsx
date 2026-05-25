import { useState, useEffect } from 'react'

export default function FullscreenButton({ targetRef }) {
  const [isFS, setIsFS] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFS(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = () => {
    const el = targetRef?.current || document.documentElement
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <button
      onClick={toggle}
      className="fs-btn flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-400 hover:text-white font-mono text-xs tracking-widest uppercase"
      title={isFS ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      {isFS ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" />
            <path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
          </svg>
          <span>Exit</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
          <span>Fullscreen</span>
        </>
      )}
    </button>
  )
}
