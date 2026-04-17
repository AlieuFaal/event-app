import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { NodeRequest, sendNodeResponse } from 'srvx/node'

export default defineConfig({
  plugins: [
    paraglideVitePlugin({ 
      project: './project.inlang', 
      outdir: './src/paraglide',
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["cookie", "localStorage", "preferredLanguage", "baseLocale"],
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    {
      name: 'tanstack-dispatch-fetch-dev-middleware',
      configureServer(viteDevServer) {
        return () => {
          viteDevServer.middlewares.use(async (req, res, next) => {
            const url = req.url || '/'
            const acceptsHtml = (req.headers.accept ?? '').includes('text/html')
            const isServerFnRequest = url.startsWith('/_serverFn/')
            const isApiRequest = url.startsWith('/api/')
            const isGetLikeRequest = req.method === 'GET' || req.method === 'HEAD'
            const isStartHandledRequest = isServerFnRequest || isApiRequest

            // Route page requests plus server/API requests through the Start fetch handler in dev.
            if (!isGetLikeRequest && !isStartHandledRequest) {
              return next()
            }

            if (!acceptsHtml && !isStartHandledRequest) {
              return next()
            }

            if (
              url.startsWith('/@') ||
              url.startsWith('/__vite') ||
              url.includes('/node_modules/') ||
              url.includes('.js') ||
              url.includes('.css') ||
              url.includes('.map')
            ) {
              return next()
            }

            try {
              if (req.originalUrl) {
                req.url = req.originalUrl
              }
              const serverEntryModule = await viteDevServer.ssrLoadModule('/src/server.ts')
              const serverEntry = serverEntryModule.default
              const fetchHandler =
                typeof serverEntry === 'function' ? serverEntry : serverEntry?.fetch
              if (typeof fetchHandler !== 'function') {
                return next(new Error('Invalid SSR server entry: missing fetch handler'))
              }
              const webReq = new NodeRequest({ req, res })
              const webRes = await fetchHandler(webReq)
              return sendNodeResponse(res, webRes)
            } catch (error) {
              return next(error)
            }
          })
        }
      },
    },
    ...(tanstackStart() as unknown as PluginOption[]),
    viteReact(),
  ],
  ssr: {
    noExternal: ['@vibespot/database'],
  },
})
