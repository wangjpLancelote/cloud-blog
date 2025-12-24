'use client';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Zustand stores are global and do not require a Provider, but this creates
  // a client boundary for any future client-only store setup.
  return children;
}

