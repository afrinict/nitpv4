import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMembershipFee(type: 'INDIVIDUAL' | 'CORPORATE'): number {
  return type === 'INDIVIDUAL' ? 50000 : 100000;
}