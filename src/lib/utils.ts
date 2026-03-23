import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return value.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  if (value >= 1e9) {
    return `€${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `€${(value / 1e6).toFixed(2)}M`;
  }
  return `€${value.toLocaleString('it-IT')}`;
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return `${(value * 100).toFixed(2)}%`;
}

export function getScoreColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground';
  if (score >= 4) return 'text-emerald-600';
  if (score >= 3) return 'text-green-600';
  if (score >= 2) return 'text-amber-600';
  if (score >= 1) return 'text-orange-600';
  return 'text-red-600';
}

export function getScoreBgColor(score: number | null): string {
  if (score === null) return 'bg-muted';
  if (score >= 4) return 'bg-emerald-100';
  if (score >= 3) return 'bg-green-100';
  if (score >= 2) return 'bg-amber-100';
  if (score >= 1) return 'bg-orange-100';
  return 'bg-red-100';
}
