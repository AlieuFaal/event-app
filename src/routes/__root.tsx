import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import Header from '../components/Header'

import appCss from '../styles.css?url'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import { getCurrentUserFn } from '@/services/user-service'
import { getLocale } from "../paraglide/runtime.js";


// Define the router context type
interface RouterContext {
  currentUser: Awaited<ReturnType<typeof getCurrentUserFn>>
  IsAuthenticated: boolean
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const user = await getCurrentUserFn()
    const isAuthenticated = !!user
    
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800">Oops something went wrong! 🫠</h2>
        <p className="text-red-600">{error.message}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-red-700">Stack trace</summary>
          <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">{error.stack}</pre>
        </details>
      </div>
    </div>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { ctx } = Route.useLoaderData()
  return (
    <html lang={getLocale()} className="scroll-smooth h-full">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-full">
        {ctx.IsAuthenticated && (
          <Header />
        )}
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="top-center" richColors={true} duration={1500} />
        {/* <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
