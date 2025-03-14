import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names conditionally
 */
export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}
