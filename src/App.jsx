import { useState, useEffect } from 'react'
import { useStorage } from './hooks/useStorage.js'
import DayPlan from './components/DayPlan.jsx'
import TensionLog from './components/TensionLog.jsx'
import Streak from './components/Streak.jsx'
import TrendChart from './components/TrendChart.jsx'
import BreathingPacer from './components/BreathingPacer.jsx'
import BottomNav from './components/BottomNav.jsx'

function NotifPrompt({ onEnable }) {
  return (
    <div className="notif">
      <span>Vil du ha en påminnelse hver morgen kl. 07?</span>
      <button onClick={onEnable}>Slå på</button>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('dag')
  const { logs, getToday, toggleSession, setTension } = useStorage()
  const today = getToday()

  // Notification permission state: 'default' | 'granted' | 'denied' | 'unsupported'
  const [notifState, setNotifState] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  )

  // Ask the service worker to schedule the daily reminder once granted.
  useEffect(() => {
    if (notifState !== 'granted') return
    navigator.serviceWorker?.ready.then((reg) => {
      reg.active?.postMessage({ type: 'SCHEDULE_NOTIF', hour: 7 })
    })
  }, [notifState])

  async function enableNotif() {
    if (typeof Notification === 'undefined') return
    const perm = await Notification.requestPermission()
    setNotifState(perm)
  }

  return (
    <div className="app">
      {tab === 'dag' && (
        <>
          <header className="app-header">
            <h1>Løsne opp</h1>
            <div className="sub">Ett skritt om gangen. Kroppen bestemmer tempoet.</div>
          </header>
          <div className="screen">
            <Streak logs={logs} />

            {notifState === 'default' && <NotifPrompt onEnable={enableNotif} />}

            <TensionLog value={today.tension} onSet={setTension} />

            <div className="rule">
              <strong>Kjennes en økt ut som den bygger opp uro, avslutt den.</strong>{' '}
              Gå til nakke- og kjeveøvelsen i stedet.
            </div>

            <h2 className="section-title">Dagens økter</h2>
            <p className="section-note">Kryss av det du har gjort. Ingen tvang om å ta alle.</p>
            <DayPlan done={today.done} onToggle={toggleSession} />
          </div>
        </>
      )}

      {tab === 'pust' && (
        <>
          <header className="app-header">
            <h1>4-7-8</h1>
            <div className="sub">Rolig pust som demper nervesystemet.</div>
          </header>
          <div className="screen">
            <BreathingPacer />
          </div>
        </>
      )}

      {tab === 'trend' && (
        <>
          <header className="app-header">
            <h1>Trend</h1>
            <div className="sub">Spenningsnivå de siste to ukene.</div>
          </header>
          <div className="screen">
            <TrendChart logs={logs} />
            <p className="section-note" style={{ marginTop: 16 }}>
              Lavere søyler betyr roligere kropp. Hull er dager uten logg — helt greit.
            </p>
          </div>
        </>
      )}

      <BottomNav active={tab} onNav={setTab} />
    </div>
  )
}
