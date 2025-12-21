import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrentDateTime = (): string => {
  const now = new Date();

  // Format the date: "Sunday, December 03, 2023"
  const datePart = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  // Format the time: "9:00 AM"
  const timePart = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Combine them with "at"
  return `${datePart} at ${timePart}`;
};