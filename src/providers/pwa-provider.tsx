'use client';

import { useEffect } from 'react';

export function PwaProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          await navigator.serviceWorker.register('/sw.js');
        } catch (error) {
          console.error('SW registration failed', error);
        }
      };
      register();
    }
  }, []);

  return null;
}