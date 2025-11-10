import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  server: {
    preset: 'vercel',
  },
  tsr: {
    appDirectory: './src',
    routesDirectory: './src/routes',
  },
  // Tell Nitro to externalize @noble/ciphers so it uses node_modules version
  nitro: {
    externals: {
      external: ['@noble/ciphers'],
    }
  }
})
