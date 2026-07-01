import { todayStr } from '../hooks/useStorage.js'

const DOW = ['S', 'M', 'T', 'O', 'T', 'F', 'L']

// Build the last 14 days, oldest first.
function lastDays(logs, count = 14) {
  const out = []
  const d = new Date()
  d.setDate(d.getDate() - (count - 1))
  for (let i = 0; i < count; i++) {
    const key = todayStr(d)
    const tension = logs[key]?.tension ?? null
    out.push({ key, tension, dow: DOW[d.getDay()] })
    d.setDate(d.getDate() + 1)
  }
  return out
}

export default function TrendChart({ logs }) {
  const days = lastDays(logs)
  return (
    <div className="chart">
      <div className="chart-bars">
        {days.map((d, i) => {
          const has = d.tension != null
          // Scale 1–5 to 20–100% height. Empty days get a minimal stub.
          const h = has ? 20 + (d.tension - 1) * 20 : 4
          return (
            <div className="chart-col" key={d.key}>
              <div
                className={`chart-bar${has ? '' : ' empty'}`}
                style={{ height: `${h}%` }}
                title={has ? `Spenning ${d.tension}/5` : 'Ingen logg'}
              />
              <div className="chart-day">{d.dow === 'M' ? 'M' : ''}</div>
            </div>
          )
        })}
      </div>
      <div className="chart-legend">
        <span>14 dager siden</span>
        <span>I dag</span>
      </div>
    </div>
  )
}
