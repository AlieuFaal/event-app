import { createServerFn } from "@tanstack/react-start";
import { geocodingSchema } from "drizzle/db";
import z from "zod";

export const geocodeAddress = createServerFn({
  method: "POST",
})
  .validator(geocodingSchema)
  .handler(async ({ data }) => {
    const accessToken = import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("Mapbox access token is not defined");
    }
  
try {
    const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(data.address)}.json?access_token=${accessToken}&limit=1`
      );
}});
