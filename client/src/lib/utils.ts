// client/src/lib/utils.ts - helper functions

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NewUser, User } from "@/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
