import { useState, useEffect, useRef } from 'react'

// 4-7-8: inhale 4s (grow), hold 7s, exhale 8s (shrink).
const PHASES = [
  { key: 'inn', label: 'Pust inn', secs: 4, scale: 1 },
  { key: 'hold', label: 'Hold', secs: 7, scale: 1 },
  { key: 'ut', label: 'Pust ut', secs: 8, scale: 0.55 },
]

function loadPref(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : v === '1'
  } catch {
    return fallback
  }
}

export default function BreathingPacer() {
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [remaining, setRemaining] = useState(PHASES[0].secs)
  const [sound, setSound] = useState(() => loadPref('pacer-sound', true))
  const [voice, setVoice] = useState(() => loadPref('pacer-voice', false))

  const audioRef = useRef(null)
  const wakeLockRef = useRef(null)

  const phase = PHASES[phaseIdx]

  async function acquireWakeLock() {
    if (!('wakeLock' in navigator)) return
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
    } catch {}
  }

  function releaseWakeLock() {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {})
      wakeLockRef.current = null
    }
  }

  // Re-acquire wake lock if page becomes visible again (OS releases it on hide).
  useEffect(() => {
    function onVisibility() {
      if (running && document.visibilityState === 'visible') acquireWakeLock()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [running])

  useEffect(() => {
    try { localStorage.setItem('pacer-sound', sound ? '1' : '0') } catch {}
  }, [sound])
  useEffect(() => {
    try { localStorage.setItem('pacer-voice', voice ? '1' : '0') } catch {}
  }, [voice])

  // Tick down once per second.
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : r))
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  // Advance to the next phase when the countdown reaches zero.
  useEffect(() => {
    if (!running || remaining !== 0) return
    const next = (phaseIdx + 1) % PHASES.length
    setPhaseIdx(next)
    setRemaining(PHASES[next].secs)
  }, [remaining, running, phaseIdx])

  // Play a calm tone + spoken cue at the start of each phase.
  useEffect(() => {
    if (!running) return
    if (sound) playTone(phase.key)
    if (voice) speak(phase.label)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIdx, running])

  function ensureAudio() {
    if (!audioRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) audioRef.current = new Ctx()
    }
    return audioRef.current
  }

  // Soft sine sweep: rising for inhale, falling for exhale, steady low for hold.
  function playTone(key) {
    const ctx = ensureAudio()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'

    if (key === 'inn') {
      osc.frequency.setValueAtTime(294, now)
      osc.frequency.linearRampToValueAtTime(392, now + 0.7)
    } else if (key === 'ut') {
      osc.frequency.setValueAtTime(392, now)
      osc.frequency.linearRampToValueAtTime(262, now + 0.9)
    } else {
      osc.frequency.setValueAtTime(330, now)
    }

    const dur = key === 'ut' ? 1.0 : 0.75
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.12)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + dur + 0.05)
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'nb-NO'
    u.rate = 0.9
    u.pitch = 1
    window.speechSynthesis.speak(u)
  }

  function toggle() {
    if (running) {
      setRunning(false)
      setPhaseIdx(0)
      setRemaining(PHASES[0].secs)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      releaseWakeLock()
    } else {
      // Unlock audio inside the user gesture so mobile browsers allow playback.
      const ctx = ensureAudio()
      if (ctx && ctx.state === 'suspended') ctx.resume()
      setPhaseIdx(0)
      setRemaining(PHASES[0].secs)
      setRunning(true)
      acquireWakeLock()
    }
  }

  // The circle animates over the current phase duration so grow/shrink
  // visually matches the breath timing.
  const scale = running ? phase.scale : 0.7
  const dur = running ? phase.secs : 0.5

  return (
    <div className="pacer">
      <div className="pacer-stage">
        <div
          className="pacer-circle"
          style={{
            transform: `scale(${scale})`,
            transition: `transform ${dur}s ease-in-out`,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="phase">{running ? phase.label : 'Klar'}</div>
            {running && <div className="count">{remaining}</div>}
          </div>
        </div>
      </div>

      <button className="pacer-btn" onClick={toggle}>
        {running ? 'Stopp' : 'Start'}
      </button>

      <div className="pacer-toggles" role="group" aria-label="Lyd og stemme">
        <button
          className={`pacer-toggle${sound ? ' on' : ''}`}
          onClick={() => setSound((s) => !s)}
          aria-pressed={sound}
        >
          {sound ? 'Lyd på' : 'Lyd av'}
        </button>
        <button
          className={`pacer-toggle${voice ? ' on' : ''}`}
          onClick={() => setVoice((v) => !v)}
          aria-pressed={voice}
        >
          {voice ? 'Stemme på' : 'Stemme av'}
        </button>
      </div>

      <p className="pacer-hint">
        Følg sirkelen: inn i fire, hold i sju, ut i åtte. Kjennes det ubehagelig,
        pust normalt igjen.
      </p>
    </div>
  )
}
