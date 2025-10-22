import { registerGlobalMiddleware } from '@tanstack/react-start'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { localeMiddleware } from '@/utils/locale-middleware'

registerGlobalMiddleware({
  middleware: [authMiddleware, localeMiddleware],
})