import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// const config = defineConfig({
//   plugins: [paraglideVitePlugin({ project: './project.inlang', outdir: './src/paraglide' }),
//     // this is the plugin that enables path aliases
//     viteTsConfigPaths({
//       projects: ['./tsconfig.json'],
//     }),
//     tailwindcss(),
//     tanstackStart({
//       customViteReactPlugin: true,
//     }),
//     viteReact(),
//   ],
// })

export default defineConfig({
  plugins: [paraglideVitePlugin({ project: './project.inlang', outdir: './src/paraglide',outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["cookie", "localStorage", "preferredLanguage", "baseLocale"],
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
    }),
    viteReact()],
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-tanstack': ['@tanstack/react-router', '@tanstack/react-start', '@tanstack/react-query'],
            'vendor-gsap': ['gsap', '@gsap/react'],
            'vendor-ui': ['framer-motion', 'lucide-react'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@tanstack/react-router', 'gsap'],
    },
    }
)

// export default config
