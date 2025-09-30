import { AsyncLocalStorage } from "node:async_hooks";
import { createMiddleware } from "@tanstack/react-start";
import {
  baseLocale,
  isLocale,
  type Locale,
  overwriteGetLocale,
  strategy as strategies,
} from "../paraglide/runtime.js";
import { resolveLocale } from "./resolve-locale";
import { router } from "@/router.js";

export const localeMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const standardLocale = await resolveLocale();
    return next({
      sendContext: {
        locale:
          extractLocaleFromStrategies(router.latestLocation.href) ??
          standardLocale,
      },
    });
  })
  .server(({ context: { locale }, next }) => {
    const storage = new AsyncLocalStorage<Locale>();
    overwriteGetLocale(() => storage.getStore() ?? baseLocale);

    return storage.run(locale, next);
  });

function extractLocaleFromStrategies(url: string): Locale | undefined {
  for (const strategy of strategies) {
    if (strategy === "url") {
      const locale = extractLocaleFromUrl(url);
      if (locale) return locale;
    }
  }
}

function extractLocaleFromUrl(url: string): Locale | undefined {
  const urlObj = new URL(url, "http://dummy.com");
  const pathSegments = urlObj.pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    const potentialLocale = pathSegments[0];
    if (isLocale(potentialLocale)) {
      return potentialLocale;
    }
  }
}