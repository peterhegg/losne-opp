import { SESSIONS } from '../data/sessions.js'
import { IconCheck, IconPlay } from './Icons.jsx'

export default function DayPlan({ done, onToggle }) {
  return (
    <div className="session-list">
      {SESSIONS.map((s) => {
        const isDone = done.includes(s.id)
        return (
          <div key={s.id} className={`session${isDone ? ' done' : ''}`}>
            <button
              className="check"
              onClick={() => onToggle(s.id)}
              aria-pressed={isDone}
              aria-label={`${isDone ? 'Fjern' : 'Marker'} «${s.title}» som gjennomført`}
            >
              <IconCheck />
            </button>
            <div className="body">
              <div className="time">{s.time}</div>
              <div className="title">{s.title}</div>
              <div className="desc">{s.desc}</div>
              <a className="link" href={s.url} target="_blank" rel="noopener noreferrer">
                <span style={{ width: 14, height: 14, display: 'inline-flex' }}>
                  <IconPlay />
                </span>
                Åpne økt
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
