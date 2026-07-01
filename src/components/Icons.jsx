export const IconCheck = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12 10 18 20 6" />
  </svg>
)

export const IconPlay = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

export const IconFlame = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c0 3-4 4-4 8a4 4 0 0 0 8 0c0-1.5-1-2.5-1-4 2 1 3 3 3 5a6 6 0 1 1-12 0c0-5 6-6 6-9z" />
  </svg>
)

export const IconDag = ({ active }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'var(--ink-soft)'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M4 9h16M8 3v4M16 3v4" />
    <path d="M9 14l2 2 4-4" />
  </svg>
)

export const IconPust = ({ active }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'var(--ink-soft)'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
  </svg>
)

export const IconTrend = ({ active }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'var(--ink-soft)'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
)
