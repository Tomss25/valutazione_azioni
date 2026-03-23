'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accentColor: 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose';
  delay?: number;
}

const colorMap = {
  emerald: {
    bg: 'from-emerald-100 to-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    shadow: 'shadow-emerald-100',
    text: 'text-emerald-600',
  },
  cyan: {
    bg: 'from-cyan-100 to-cyan-50',
    icon: 'bg-cyan-100 text-cyan-600',
    shadow: 'shadow-cyan-100',
    text: 'text-cyan-600',
  },
  violet: {
    bg: 'from-violet-100 to-violet-50',
    icon: 'bg-violet-100 text-violet-600',
    shadow: 'shadow-violet-100',
    text: 'text-violet-600',
  },
  amber: {
    bg: 'from-amber-100 to-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    shadow: 'shadow-amber-100',
    text: 'text-amber-600',
  },
  rose: {
    bg: 'from-rose-100 to-rose-50',
    icon: 'bg-rose-100 text-rose-600',
    shadow: 'shadow-rose-100',
    text: 'text-rose-600',
  },
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, accentColor, delay = 0 }: KPICardProps) {
  const colors = colorMap[accentColor];
  
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-lg',
        colors.shadow,
        'opacity-0 animate-fade-in'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        colors.bg
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className={cn('rounded-lg p-2.5', colors.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              trend.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>
          {subtitle && (
            <p className={cn('mt-0.5 text-xs font-medium', colors.text)}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
