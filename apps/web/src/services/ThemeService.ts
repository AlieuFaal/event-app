import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import z from "zod";

const postThemeValidator = z.union([z.literal("light"), z.literal("dark"), z.literal("system")]);

export type T = z.infer<typeof postThemeValidator>;

const storageKey = "theme-preference";
const localeStorageKey = "PARAGLIDE_LOCALE";

export const getThemeServerFn = createServerFn().handler(async () => {
  const parsedTheme = postThemeValidator.safeParse(getCookie(storageKey));

  return parsedTheme.success ? parsedTheme.data : "system";
});

export const setThemeServerFn = createServerFn({method: "POST"})
  .inputValidator(postThemeValidator)
  .handler(async ({data}) => setCookie(storageKey, data, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  }));

export const getLocaleServerFn = createServerFn().handler(async () => getCookie(localeStorageKey) || "en");

export const setLocaleServerFn = createServerFn({method: "POST"})
  .inputValidator(z.string())
  .handler(async ({data}) => setCookie(localeStorageKey, data, {
    maxAge: 34560000, // 400 days
    path: "/",
  }));
