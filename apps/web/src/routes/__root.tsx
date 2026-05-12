import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/shadcn/ui/sonner'
import { getSessionUserFn } from '@/services/user-service'
import { Header } from '@/components/Header.js'
import { getThemeServerFn, getLocaleServerFn } from '@/services/ThemeService.js'
import React, { useEffect } from 'react'
import { ThemeProvider } from '@/components/Themeprovider.js'
import { setLocale } from '@/paraglide/runtime'
import { ModeToggle } from '@/components/mode-toggle'

export const Route = createRootRoute({
  beforeLoad: async () => {
    try {
      const user = await getSessionUserFn()
      const isAuthenticated = !!user

      return { currentUser: user, IsAuthenticated: isAuthenticated }
    } catch (error) {
      console.error("Error in root beforeLoad:", error);
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
  //       <h2 className="text-lg font-semibold text-red-800">Oops something went wrong! </h2>
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

const themeInitScript = `
(() => {
  const match = document.cookie.match(/(?:^|; )theme-preference=(light|dark|system)(?:;|$)/);
  const preference = match ? match[1] : "system";
  const resolved = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preference;

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
  document.documentElement.dataset.themePreference = preference;
})();
`.trim();

function RootDocument({ children }: { children: React.ReactNode }) {
  const { ctx, theme, locale } = Route.useLoaderData()
  const [hideFooter, setHideFooter] = React.useState(false);

  useEffect(() => {
    setLocale(locale as "en" | "sv", { reload: false });
  }, [locale]);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setHideFooter(false)
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <html lang={locale} className={theme === "system" ? undefined : theme} suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <HeadContent />
        </head>
        <body className="flex-1 min-h--10 mx-auto" suppressHydrationWarning>
          {ctx.IsAuthenticated && (
            <Header currentUser={ctx.currentUser} />
          )}
          {!ctx.IsAuthenticated && (
            <div className="fixed right-4 top-4 z-50">
              <ModeToggle />
            </div>
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
