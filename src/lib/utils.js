import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Simple symmetric obfuscation similar to AuthContext; not cryptographically strong
const BKP_SECRET = 'mlkPhone2024-bkp';

export function encryptBkp(data) {
  try {
    const json = JSON.stringify(data);
    return btoa(json + BKP_SECRET);
  } catch {
    return null;
  }
}

export function decryptBkp(encrypted) {
  try {
    const raw = atob(encrypted);
    const json = raw.replace(BKP_SECRET, '');
    return JSON.parse(json);
  } catch {
    return null;
  }
}
