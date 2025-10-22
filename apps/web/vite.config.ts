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
      strategy: ["localStorage", "preferredLanguage", "url", "baseLocale"],
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
    }
)

// export default config
