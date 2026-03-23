'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { GlobalAnalysisView } from '@/components/analysis/GlobalAnalysisView';
import { RawDataInspector } from '@/components/rawdata/RawDataInspector';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';
import { PortfolioAPIResponse } from '@/types/portfolio';

type ViewType = 'dashboard' | 'analysis' | 'rawdata';

export default function HomePage() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [data, setData] = useState<PortfolioAPIResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/portfolio');
      const result: PortfolioAPIResponse = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Errore sconosciuto durante il caricamento dei dati');
      }
      
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return <ErrorFallback error={error} onRetry={fetchData} />;
    }

    if (!data) {
      return <ErrorFallback error="Dati non disponibili" onRetry={fetchData} />;
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView data={data} />;
      case 'analysis':
        return <GlobalAnalysisView securities={data.securities} />;
      case 'rawdata':
        return <RawDataInspector sheets={data.rawSheets} />;
      default:
        return <DashboardView data={data} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={(view) => setActiveView(view as ViewType)} />
      
      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
