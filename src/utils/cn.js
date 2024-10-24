// src/utils/cn.js
import { clsx } from "clsx"; // Import clsx
import { twMerge } from "tailwind-merge"; // Import tailwind-merge

export function cn(...inputs) {
  return twMerge(clsx(inputs)); // Merge class names
}