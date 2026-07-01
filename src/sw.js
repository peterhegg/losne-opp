import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

// App shell + assets injected at build time.
precacheAndRoute(self.__WB_MANIFEST)

// Google Fonts: serve cached copy, refresh in background (offline-friendly).
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts' })
)

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

let notifTimer = null

// Schedule a one-shot notification at the next occurrence of `hour`.
// Re-armed each time the app loads (SW timers don't survive termination).
function scheduleDailyNotif(hour) {
  clearTimeout(notifTimer)
  const now = new Date()
  const next = new Date()
  next.setHours(hour, 0, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  const delay = next - now
  notifTimer = setTimeout(() => {
    self.registration.showNotification('Løsne opp', {
      body: 'Ny dag. Start med kroppsskanningen når du er klar.',
      icon: '/losne-opp/icons/icon-192.svg',
      badge: '/losne-opp/icons/icon-192.svg',
      tag: 'daily-reminder',
    })
    scheduleDailyNotif(hour) // re-arm for tomorrow if SW stays alive
  }, delay)
}

self.addEventListener('message', (e) => {
  if (e.data?.type === 'SCHEDULE_NOTIF') {
    scheduleDailyNotif(e.data.hour ?? 7)
  }
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const url = '/losne-opp/'
      const existing = clients.find((c) => c.url.includes(url))
      if (existing) return existing.focus()
      return self.clients.openWindow(url)
    })
  )
})
