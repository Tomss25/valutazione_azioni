'use client';

import { Briefcase, TrendingUp, DollarSign, Target, PieChart as PieChartIcon } from 'lucide-react';
import { KPICard } from './KPICard';
import { DonutChart } from './DonutChart';
import { ScoreBarChart } from './ScoreBarChart';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { PortfolioAPIResponse } from '@/types/portfolio';

interface DashboardViewProps {
  data: NonNullable<PortfolioAPIResponse['data']>;
}

export function DashboardView({ data }: DashboardViewProps) {
  const { summary, securities } = data;
  
  // Calculate additional metrics
  const validScores = securities.filter(s => s.fundamentalGlobalScore !== null);
  const topPerformers = validScores
    .sort((a, b) => (b.fundamentalGlobalScore || 0) - (a.fundamentalGlobalScore || 0))
    .slice(0, 10);
  
  const avgValuationScore = securities
    .filter(s => s.valuationScore !== null)
    .reduce((sum, s) => sum + (s.valuationScore || 0), 0) / 
    securities.filter(s => s.valuationScore !== null).length || 0;

  const marketCapDistribution = {
    large: securities.filter(s => s.marketCapCategory?.toLowerCase().includes('large')).length,
    mid: securities.filter(s => s.marketCapCategory?.toLowerCase().includes('mid')).length,
    small: securities.filter(s => s.marketCapCategory?.toLowerCase().includes('small')).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Panoramica aggregata del portfolio con {summary.totalSecurities.toLocaleString()} titoli analizzati
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Ultimo aggiornamento</p>
          <p className="text-sm font-medium text-foreground">Q4 2025</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Titoli Analizzati"
          value={summary.totalSecurities.toLocaleString()}
          subtitle={`${summary.sectors.length} Settori • ${data.rawSheets.length + 1} Fogli`}
          icon={Briefcase}
          accentColor="emerald"
          delay={0}
        />
        <KPICard
          title="Market Cap Totale"
          value={formatCurrency(summary.totalMarketCap * 1e6)}
          subtitle={`Large: ${marketCapDistribution.large} • Mid: ${marketCapDistribution.mid}`}
          icon={DollarSign}
          accentColor="cyan"
          delay={100}
        />
        <KPICard
          title="Fundamental Score Medio"
          value={formatNumber(summary.avgFundamentalScore, 2)}
          subtitle="Score complessivo ponderato"
          icon={Target}
          trend={{ value: 2.4, isPositive: true }}
          accentColor="violet"
          delay={200}
        />
        <KPICard
          title="Valuation Score Medio"
          value={formatNumber(avgValuationScore, 2)}
          subtitle="Sottovalutazione relativa"
          icon={TrendingUp}
          accentColor="amber"
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DonutChart
          data={summary.sectors}
          title="Allocazione per Settore"
          description="Distribuzione dei titoli per settore di mercato"
          delay={400}
        />
        <DonutChart
          data={summary.industries}
          title="Top 15 Industrie"
          description="Industrie più rappresentate nel portfolio"
          delay={500}
        />
        <ScoreBarChart
          data={summary.scoreDistribution}
          title="Distribuzione Fundamental Score"
          description="Numero di titoli per fascia di score"
          delay={600}
        />
      </div>

      {/* Top Performers Table */}
      <div 
        className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden opacity-0 animate-fade-in"
        style={{ animationDelay: '700ms' }}
      >
        <div className="p-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <PieChartIcon className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Top 10 Performers</h3>
              <p className="text-xs text-muted-foreground">Titoli con Fundamental Global Score più elevato</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settore</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industria</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Global Score</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valuation</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Operations</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((security, index) => (
                <tr 
                  key={security.isin || index} 
                  className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`
                      inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                      ${index < 3 ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' : 'bg-muted text-muted-foreground'}
                    `}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">{security.nome}</p>
                      <p className="text-xs text-muted-foreground">{security.isin}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{security.settore}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{security.industria}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                      {formatNumber(security.fundamentalGlobalScore, 2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    {formatNumber(security.valuationScore, 2)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    {formatNumber(security.operationsScore, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
