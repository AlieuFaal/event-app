import { HeadContent, Scripts, createRootRoute, createRootRouteWithContext, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'

import appCss from '../styles.css?url'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import { getCurrentUserFn, isAuthenticatedFn } from '@/services/user-service'
import { router } from '@/router'
import { User } from 'drizzle/db'

interface RouterContext {
  currentUser: User | null | undefined
  IsAuthenticated: boolean
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const user = await getCurrentUserFn()
    const isAuthenticated = user ? true : false

    console.log("Current User in Root Route:", user?.name);
    console.log("Is Authenticated in Root Route:", isAuthenticated);

    return { currentUser: user, IsAuthenticated: isAuthenticated }
  },
  loader: async ({ context }) => {
    const ctx = context

    return { ctx }
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
  errorComponent: ({ error }) => (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong!</h2>
      <p className="text-red-600">{error.message}</p>
      <details className="mt-2">
        <summary className="cursor-pointer text-sm text-red-700">Stack trace</summary>
        <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">{error.stack}</pre>
      </details>
    </div>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { ctx } = Route.useLoaderData()
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body>
        {ctx.IsAuthenticated && (
          <Header />
        )}
        {children}
        <Toaster position="top-center" richColors={true} duration={1500} />
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <div>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  )
}
