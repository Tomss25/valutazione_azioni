'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface ScoreBarChartProps {
  data: { range: string; count: number }[];
  title: string;
  description?: string;
  delay?: number;
}

const GRADIENT_COLORS = [
  { start: '#ef4444', end: '#f87171' },
  { start: '#f97316', end: '#fb923c' },
  { start: '#eab308', end: '#facc15' },
  { start: '#22c55e', end: '#4ade80' },
  { start: '#10b981', end: '#34d399' },
  { start: '#06b6d4', end: '#22d3ee' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-xl">
        <p className="font-semibold text-foreground">Score Range: {label}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Titoli: <span className="font-medium text-foreground">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ScoreBarChart({ data, title, description, delay = 0 }: ScoreBarChartProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div
      className={cn(
        'rounded-xl border border-border/50 bg-card p-5 shadow-lg',
        'opacity-0 animate-fade-in'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {GRADIENT_COLORS.map((color, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`barGradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color.start} stopOpacity={1} />
                  <stop offset="100%" stopColor={color.end} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.3}
              vertical={false}
            />
            <XAxis 
              dataKey="range" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              dy={8}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              dx={-8}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient-${index})`}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-red-500 to-red-400" />
          <span>Low (0-2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-yellow-500 to-yellow-400" />
          <span>Medium (2-3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-400" />
          <span>High (4+)</span>
        </div>
      </div>
    </div>
  );
}
