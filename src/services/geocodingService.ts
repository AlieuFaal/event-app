// import { createServerFn } from "@tanstack/react-start";
// import { geocodingSchema } from "drizzle/db";
// import z from "zod";

// export const geocodeAddress = createServerFn({
//   method: "POST",
// })
//   .validator(geocodingSchema)
//   .handler(async ({ data }) => {
//     const accessToken = process.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN;

//     if (!accessToken) {
//       throw new Error("Mapbox access token is not defined");
//     }

//     try {
//       const response = await fetch(
//         `https://api.mapbox.com/search/geocode/v6/forward?q=${data.address}&access_token=${accessToken}&limit=1`
//       );

//       if (!response.ok) {
//         throw new Error(`Geocoding request failed: ${response.status}`);
//       }

//       const geocodingData = await response.json();

//       if (geocodingData.features && geocodingData.features.length > 0) {
//         const feature = geocodingData.features[0];
//         return {
//           coordinates: feature.geometry.coordinates,
//           placeName: feature.properties.full_address || feature.properties.name,
//           context: feature.properties.context,
//         };
//       }

//       return null;
//     } catch (error) {
//       console.error("Error during geocoding:", error);
//       throw new Error("Failed to fetch geocoding data");
//     }
//   });
