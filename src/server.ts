import {createStartHandler, defaultStreamHandler, getWebRequest,} from '@tanstack/react-start/server'
import { router } from './router'
import { paraglideMiddleware } from './paraglide/server';
import { overwriteGetLocale } from './paraglide/runtime';

// Polyfill localStorage for SSR (server-side rendering)
if (typeof global !== 'undefined' && typeof global.localStorage === 'undefined') {
  class LocalStorageMock {
    private store: Map<string, string> = new Map();
    
    getItem(key: string): string | null {
      return this.store.get(key) || null;
    }
    
    setItem(key: string, value: string): void {
      this.store.set(key, value);
    }
    
    removeItem(key: string): void {
      this.store.delete(key);
    }
    
    clear(): void {
      this.store.clear();
    }
  }
  
  global.localStorage = new LocalStorageMock() as any;
}

export default createStartHandler({createRouter: () => router,})
((event) =>
  paraglideMiddleware(getWebRequest(), ({ locale }) => {
    overwriteGetLocale(() => locale);
    return defaultStreamHandler(event);
  }),
);