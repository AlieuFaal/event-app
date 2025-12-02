import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@vibespot/validation/user";

// export const useGetUserById = (id: string) => {
//   const { isPending, error, data } = useQuery<User, Error>({
//     queryKey: ["user", id],
//     queryFn: async () => {
//       const res = await apiClient.users[":id"].$get({
//         param: { id: id as string },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         return data;
//       } else {
//         throw new Error("Failed to fetch user");
//       }
//     },
//   });

//   return { isPending, error, data };
// };
