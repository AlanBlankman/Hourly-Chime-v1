self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') {
    e.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
        list.forEach(c => c.postMessage({ type: 'DISMISS_CHIME' }));
      })
    );
  } else {
    e.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
        if (list.length) {
          list[0].focus();
          list[0].postMessage({ type: 'FOCUS_APP' });
        } else {
          clients.openWindow('./');
        }
      })
    );
  }
});

self.addEventListener('notificationclose', e => {
  clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    list.forEach(c => c.postMessage({ type: 'DISMISS_CHIME' }));
  });
});

// Keep SW alive
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
