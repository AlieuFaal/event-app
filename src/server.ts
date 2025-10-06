import {createStartHandler, defaultStreamHandler, getWebRequest,} from '@tanstack/react-start/server'
import { router } from './router'
import { paraglideMiddleware } from './paraglide/server';
import { overwriteGetLocale } from './paraglide/runtime';

export default createStartHandler({createRouter: () => router,})
((event) =>
  paraglideMiddleware(getWebRequest(), ({ locale }) => {
    overwriteGetLocale(() => locale);
    return defaultStreamHandler(event);
  }),
);