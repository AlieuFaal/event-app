import {createStartHandler, defaultStreamHandler, getWebRequest,} from '@tanstack/react-start/server'
import { createRouter, router } from './router'
import 'localstorage-polyfill'
import { paraglideMiddleware } from './paraglide/server';
import { overwriteGetLocale } from './paraglide/runtime';
 
// export default createStartHandler({
//   createRouter,
// })(defaultStreamHandler)

export default createStartHandler({
  createRouter: () => router,
})((event) =>
  paraglideMiddleware(getWebRequest(), ({ locale }) => {
    overwriteGetLocale(() => locale);
    return defaultStreamHandler(event);
  }),
);

global['localStorage'] = localStorage;