import { IconDag, IconPust, IconTrend } from './Icons.jsx'

const TABS = [
  { id: 'dag', label: 'Dag', Icon: IconDag },
  { id: 'pust', label: 'Pust', Icon: IconPust },
  { id: 'trend', label: 'Trend', Icon: IconTrend },
]

export default function BottomNav({ active, onNav }) {
  return (
    <nav className="nav">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            className={isActive ? 'active' : ''}
            onClick={() => onNav(id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon active={isActive} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
