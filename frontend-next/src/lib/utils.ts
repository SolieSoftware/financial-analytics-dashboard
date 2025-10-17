// This utility function combines Tailwind CSS classes efficiently
// It uses clsx to merge class names and twMerge to handle Tailwind-specific conflicts
// Example usage: 
// cn('text-red-500', isActive && 'bg-blue-500') -> "text-red-500 bg-blue-500"
// cn('p-4 p-8') -> "p-8" (twMerge dedupes conflicting classes)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
