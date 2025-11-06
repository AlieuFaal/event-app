import { useEffect, useState } from 'react';

/**
 * This component prevents the flash of error/content during initial page load
 * by ensuring the app is fully hydrated before showing content.
 */
export function HydrationGuard({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after the first render on the client
    setIsHydrated(true);
  }, []);

  // On server or during initial client render, show a minimal loading state
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
