import { createServerFn } from "@tanstack/react-start";
import { m } from "../paraglide/messages.js";

export const getServerMessage = createServerFn()
  .inputValidator((emoji: string) => emoji)
  .handler(({ data }) => {
    return m.server_message({ emoji: data });
  });
