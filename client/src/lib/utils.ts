// client/src/lib/utils.ts - helper functions

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// function to convert amount to subcurrency
export function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}
