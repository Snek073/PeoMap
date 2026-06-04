self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'PeoMap', {
      body: data.body ?? '서울 실시간 혼잡도 업데이트',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'peomap-daily',
      renotify: true,
      data: { url: '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      const client = list.find((c) => c.url.endsWith('/') && 'focus' in c);
      if (client) return client.focus();
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
