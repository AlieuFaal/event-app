import { createRouter as createTanstackRouter, Link } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { Button } from './components/shadcn/ui/button'

// Create a new router instance
export const createRouter = () => {
  return createTanstackRouter({
    routeTree,
    scrollRestoration: true,
    scrollRestorationBehavior: "smooth",
    defaultPreloadStaleTime: 0,

    defaultNotFoundComponent: () => {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="mt-4 text-lg">The page you are looking for does not seem to exist.</p>
          <div className='mt-6'>
            <Button className='hover:scale-110 hover:bg-secondary transition-transform rounded-2xl' variant='outline' >
              <Link to={'/'}>Return home</Link>
            </Button>
          </div>
        </div>
      )
    },
  })
}

export const router = createRouter()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}