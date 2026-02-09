'use client';

import { useNotifications } from '@/lib/notification-store';

export default function NotificationsPage() {
  const { notifications, markAllRead } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto pt-24 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Notifications</h1>
        <button
          onClick={markAllRead}
          className="text-sm underline text-[#d4af37]"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 && (
        <p className="text-white/60">No notifications yet.</p>
      )}

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-3 rounded border ${
              n.read ? 'opacity-60' : 'border-[#d4af37]'
            }`}
          >
            <p>{n.message}</p>
            <p className="text-xs text-white/40">
              {new Date(n.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
