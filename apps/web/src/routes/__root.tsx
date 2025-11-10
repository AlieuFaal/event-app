import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import { getSessionUserFn } from '@/services/user-service'
import { Header } from '@/components/Header.js'
import { getThemeServerFn, getLocaleServerFn } from '@/services/ThemeService.js'
import React, { useEffect } from 'react'
import { ThemeProvider } from '@/components/Themeprovider.js'
import { setLocale } from '@/paraglide/runtime'

// Cache the last successful auth check to prevent flickering
let lastAuthState: { user: any; timestamp: number } | null = null;
const AUTH_CACHE_DURATION = 1000; // Cache for 1 second

export const Route = createRootRoute({
  beforeLoad: async ({ cause }) => {
    try {
      // If we have a recent cached auth state and this is a "stay" navigation, use it
      if (lastAuthState && cause === 'stay' && Date.now() - lastAuthState.timestamp < AUTH_CACHE_DURATION) {
        const isAuthenticated = !!lastAuthState.user;
        console.log("Root beforeLoad - User:", lastAuthState.user?.name, "IsAuthenticated:", isAuthenticated, "cause:", cause, "(cached)");
        return { currentUser: lastAuthState.user, IsAuthenticated: isAuthenticated };
      }

      const user = await getSessionUserFn()
      const isAuthenticated = !!user

      // Update cache with successful result
      lastAuthState = { user, timestamp: Date.now() };

      console.log("Root beforeLoad - User:", user?.name, "IsAuthenticated:", isAuthenticated, "cause:", cause);

      return { currentUser: user, IsAuthenticated: isAuthenticated }
    } catch (error) {
      console.error("Error in root beforeLoad:", error);
      // On error, don't immediately clear the cache - this prevents flickering
      // Only return unauthenticated if we don't have a valid cache
      if (lastAuthState && Date.now() - lastAuthState.timestamp < AUTH_CACHE_DURATION * 2) {
        console.log("Using cached auth state due to error");
        return { currentUser: lastAuthState.user, IsAuthenticated: !!lastAuthState.user };
      }
      // Clear cache and return unauthenticated state
      lastAuthState = null;
      return { currentUser: null, IsAuthenticated: false }
    }
  },
  loader: async ({ context }) => {
    const ctx = context

    return { 
      ctx, 
      theme: await getThemeServerFn(),
      locale: await getLocaleServerFn()
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'VibeSpot - Discover and Share Events Near You',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  // errorComponent: ({ error }) => (
  //   <div className="min-h-screen bg-gray-50 p-4">
  //     <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
  //       <h2 className="text-lg font-semibold text-red-800">Oops something went wrong! 🫠</h2>
  //       <p className="text-red-600">{error.message}</p>
  //       <details className="mt-2">
  //         <summary className="cursor-pointer text-sm text-red-700">Stack trace</summary>
  //         <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">{error.stack}</pre>
  //       </details>
  //     </div>
  //   </div>
  // ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { ctx, theme, locale } = Route.useLoaderData()
  const [hideFooter, setHideFooter] = React.useState(false);

  // Sync locale from server to client on mount
  useEffect(() => {
    console.log("[Root] useEffect triggered - Setting locale from server:", locale);
    console.log("[Root] Current performance.navigation.type:", performance.navigation?.type);
    console.log("[Root] Current window.performance.getEntriesByType('navigation'):", 
      window.performance.getEntriesByType('navigation'));
    
    // IMPORTANT: Pass { reload: false } to prevent setLocale from reloading the page again
    // (setLocale has reload: true by default which would cause infinite loop)
    setLocale(locale as 'en' | 'sv', { reload: false });
    console.log("[Root] setLocale completed with reload: false");
  }, [locale]);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setHideFooter(false)
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <html lang={locale} className={`${theme}`} suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body className="flex-1 min-h--10 mx-auto" suppressHydrationWarning>
          {ctx.IsAuthenticated && (
            <Header currentUser={ctx.currentUser} />
          )}
          <main>
            {children}
          </main>
          {hideFooter && (
            <Footer />
          )}
          <Toaster position="top-center" richColors={true} duration={1500} />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  )
}
