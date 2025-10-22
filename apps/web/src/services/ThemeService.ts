import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import z from "zod";

const postThemeValidator = z.union([z.literal("light"), z.literal("dark"), z.literal("system")]);

export type T = z.infer<typeof postThemeValidator>;

const storageKey = "theme-preference";

export const getThemeServerFn = createServerFn().handler(async () => (getCookie(storageKey) || "system") as T);

export const setThemeServerFn = createServerFn({method: "POST"})
  .validator(postThemeValidator)
  .handler(async ({data}) => setCookie(storageKey, data,));