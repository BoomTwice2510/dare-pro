'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => {
          setOpen(!open);
          markAllRead();
        }}
        className="relative text-xl px-3 py-2"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-black backdrop-blur-xl shadow-xl z-50">
          <div className="p-3 border-b border-white/10 text-sm font-semibold text-white">
            Notifications
          </div>

          {notifications.length === 0 && (
            <div className="p-4 text-white/50 text-sm">
              No notifications yet
            </div>
          )}

          {notifications.map(n => (
            <div
              key={n.id}
              className="p-3 border-b border-white/5 hover:bg-white/5 transition text-sm"
            >
              <p className="text-white">{n.message}</p>
              <p className="text-xs text-white/40 mt-1">
                {new Date(n.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
