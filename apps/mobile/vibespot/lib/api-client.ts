import { hc } from 'hono/client';
import type { ApiType } from '../../../api/src/index';

// Create typed client - Hono RPC will give us full type safety!
export const apiClient = hc<ApiType>('http://localhost:3001');
