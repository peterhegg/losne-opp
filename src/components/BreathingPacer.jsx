import { useState, useEffect } from 'react'

// 4-7-8: inhale 4s (grow), hold 7s, exhale 8s (shrink).
const PHASES = [
  { key: 'inn', label: 'Pust inn', secs: 4, scale: 1 },
  { key: 'hold', label: 'Hold', secs: 7, scale: 1 },
  { key: 'ut', label: 'Pust ut', secs: 8, scale: 0.55 },
]

export default function BreathingPacer() {
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [remaining, setRemaining] = useState(PHASES[0].secs)

  const phase = PHASES[phaseIdx]

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

  function toggle() {
    if (running) {
      setRunning(false)
      setPhaseIdx(0)
      setRemaining(PHASES[0].secs)
    } else {
      setPhaseIdx(0)
      setRemaining(PHASES[0].secs)
      setRunning(true)
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

      <p className="pacer-hint">
        Følg sirkelen: inn i fire, hold i sju, ut i åtte. Kjennes det ubehagelig,
        pust normalt igjen.
      </p>
    </div>
  )
}
