import { useEffect, useState } from 'react';

/**
 * Client-only component wrapper
 * Prevents server-side rendering of components that use browser-only APIs
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
