'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface DonutChartProps {
  data: { name: string; count: number; percentage: number }[];
  title: string;
  description?: string;
  delay?: number;
}

const COLORS = [
  '#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444',
  '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16',
  '#a855f7', '#0ea5e9', '#22c55e', '#eab308', '#d946ef',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-xl">
        <p className="font-semibold text-foreground">{data.name}</p>
        <div className="mt-1 flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Titoli: <span className="font-medium text-foreground">{data.count}</span>
          </span>
          <span className="text-muted-foreground">
            Share: <span className="font-medium text-foreground">{data.percentage.toFixed(1)}%</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;
  
  const visibleItems = payload.slice(0, 6);
  const remaining = payload.length - 6;
  
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-2">
      {visibleItems.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5 text-xs">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground truncate max-w-[80px]">
            {entry.value}
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining} altri</span>
      )}
    </div>
  );
};

export function DonutChart({ data, title, description, delay = 0 }: DonutChartProps) {
  const chartData = data.slice(0, 15);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

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
      
      <div className="h-[280px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="count"
              nameKey="name"
              stroke="transparent"
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-2xl font-bold text-foreground">{totalCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Totale</p>
        </div>
      </div>
    </div>
  );
}
