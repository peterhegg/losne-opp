import { useState, useCallback, useEffect } from 'react'

const KEY = 'tension-logs-v1'

// Local date as YYYY-MM-DD (avoids UTC off-by-one from toISOString).
export function todayStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const emptyDay = () => ({ done: [], tension: null })

/**
 * Central data store. Shape:
 *   { "YYYY-MM-DD": { done: string[], tension: number|null } }
 */
export function useStorage() {
  const [logs, setLogs] = useState(loadAll)

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(logs))
    } catch {
      /* quota or private mode — ignore */
    }
  }, [logs])

  const getDay = useCallback(
    (date) => logs[date] || emptyDay(),
    [logs]
  )

  const getToday = useCallback(
    () => logs[todayStr()] || emptyDay(),
    [logs]
  )

  const toggleSession = useCallback((id) => {
    const key = todayStr()
    setLogs((prev) => {
      const day = prev[key] || emptyDay()
      const done = day.done.includes(id)
        ? day.done.filter((x) => x !== id)
        : [...day.done, id]
      return { ...prev, [key]: { ...day, done } }
    })
  }, [])

  const setTension = useCallback((n) => {
    const key = todayStr()
    setLogs((prev) => {
      const day = prev[key] || emptyDay()
      // Tap the active value again to clear it.
      const tension = day.tension === n ? null : n
      return { ...prev, [key]: { ...day, tension } }
    })
  }, [])

  return { logs, getDay, getToday, toggleSession, setTension }
}
