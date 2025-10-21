import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import { getSessionUserFn } from '@/services/user-service'
import { getLocale } from "../paraglide/runtime.js";
import { Header } from '@/components/Header.js'
import { getThemeServerFn } from '@/services/ThemeService.js'
import React, { useEffect } from 'react'



export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await getSessionUserFn()
    const isAuthenticated = !!user

    // console.log("Current User in Root Route:", user?.name);
    // console.log("Is Authenticated in Root Route:", isAuthenticated);

    return { currentUser: user, IsAuthenticated: isAuthenticated }
  },
  loader: async ({ context }) => {
    const ctx = context

    getThemeServerFn()

    return { ctx, theme: await getThemeServerFn() }
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
  const { ctx, theme } = Route.useLoaderData()
  const [hideFooter, setHideFooter] = React.useState(false);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setHideFooter(false)
    }
  }, []);

  return (
    <html lang={getLocale()} className={`${theme}`} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {ctx.IsAuthenticated && (
          <Header currentUser={ctx.currentUser} theme={theme} />
        )}
        <main className="flex-1 min-h--10 min-w-3xl mx-auto">
          {children}
        </main>
        {hideFooter && (
          <Footer />
        )}
        <Toaster position="top-center" richColors={true} duration={1500} />
        <Scripts />
      </body>
    </html>
  )
}
