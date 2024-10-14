// client/src/lib/utils.ts - helper functions

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NewUser, User } from "@/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// TODO: Check if I need this function
// export async function createUser(newUser: NewUser): Promise<User | null> {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
//     {
//       method: "POST",
//       headers: {
//         "Context-Type": "application/json",
//       },
//       body: JSON.stringify(newUser),
//     },
//   );
//   if (!response.ok) {
//     throw new Error("Failed to create user");
//   }
//   const user: User = await response.json();
//   return user;
// }
