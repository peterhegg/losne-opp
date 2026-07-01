import { IconFlame } from './Icons.jsx'
import { todayStr } from '../hooks/useStorage.js'

// Count consecutive days (ending today or yesterday) with at least one done session.
function computeStreak(logs) {
  let count = 0
  const d = new Date()
  // Allow the streak to still be "alive" if today isn't logged yet.
  if (!(logs[todayStr(d)]?.done?.length > 0)) {
    d.setDate(d.getDate() - 1)
  }
  while (logs[todayStr(d)]?.done?.length > 0) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}

export default function Streak({ logs }) {
  const n = computeStreak(logs)
  return (
    <div className="streak">
      <div className="flame">
        <span style={{ width: 22, height: 22, display: 'inline-flex' }}>
          <IconFlame />
        </span>
      </div>
      <div>
        <div className="num">{n}</div>
        <div className="cap">{n === 1 ? 'dag på rad' : 'dager på rad'}</div>
      </div>
    </div>
  )
}
