import { registerGlobalMiddleware } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from 'drizzle'
import { schema } from 'drizzle/db'
import { eq } from 'drizzle-orm'
import { authMiddleware } from '@/middlewares/authMiddleware'

registerGlobalMiddleware({
  middleware: [authMiddleware],
})