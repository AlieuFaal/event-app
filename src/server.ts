import {createStartHandler, defaultStreamHandler,} from '@tanstack/react-start/server'
import { createRouter } from './router'
import { auth } from './lib/auth'
import 'localstorage-polyfill'
 
export default createStartHandler({
  createRouter,
})(defaultStreamHandler)

// const response = await auth.api.signInEmail({
//   body: { 
//     email,
//     password
//   },
//   asResponse: true
// })

global['localStorage'] = localStorage;