'use client';

import { Toaster } from 'sonner';
import { useDareNotifications } from '@/hooks/useDareNotifications';

export function GlobalNotifications() {
  useDareNotifications();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
    />
  );
}
