import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amountCents: number, locale: string = 'fr-FR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amountCents / 100);
}

export function geohashFromCoords({ lat, lng }: { lat: number; lng: number }) {
  return `${lat.toFixed(3)}:${lng.toFixed(3)}`;
}