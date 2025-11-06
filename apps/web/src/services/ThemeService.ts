import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import z from "zod";

const postThemeValidator = z.union([z.literal("light"), z.literal("dark"), z.literal("system")]);

export type T = z.infer<typeof postThemeValidator>;

const storageKey = "theme-preference";
const localeStorageKey = "PARAGLIDE_LOCALE";

export const getThemeServerFn = createServerFn().handler(async () => (getCookie(storageKey) || "system") as T);

export const setThemeServerFn = createServerFn({method: "POST"})
  .validator(postThemeValidator)
  .handler(async ({data}) => setCookie(storageKey, data,));

export const getLocaleServerFn = createServerFn().handler(async () => getCookie(localeStorageKey) || "en");

export const setLocaleServerFn = createServerFn({method: "POST"})
  .validator(z.string())
  .handler(async ({data}) => setCookie(localeStorageKey, data, {
    maxAge: 34560000, // 400 days
    path: "/",
  }));