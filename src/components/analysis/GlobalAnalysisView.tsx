'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Search } from 'lucide-react';
import { SecurityData, FilterState } from '@/types/portfolio';
import { cn, formatNumber, formatCurrency, getScoreColor, getScoreBgColor } from '@/lib/utils';
import { MultiSelect } from '@/components/ui/multi-select';
import { Slider } from '@/components/ui/slider';

interface GlobalAnalysisViewProps {
  securities: SecurityData[];
}

const columnHelper = createColumnHelper<SecurityData>();

export function GlobalAnalysisView({ securities }: GlobalAnalysisViewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  
  const [filters, setFilters] = useState<FilterState>({
    sectors: [],
    industries: [],
    valuationScoreMin: 0,
    valuationScoreMax: 10,
    operationsScoreMin: 0,
    operationsScoreMax: 10,
    riskScoreMin: 0,
    riskScoreMax: 10,
    fundamentalScoreMin: 0,
    fundamentalScoreMax: 10,
  });

  // Extract unique sectors and industries
  const sectors = useMemo(() => 
    [...new Set(securities.map(s => s.settore).filter(Boolean))].sort(),
    [securities]
  );
  
  const industries = useMemo(() => 
    [...new Set(securities.map(s => s.industria).filter(Boolean))].sort(),
    [securities]
  );

  // Filter data
  const filteredData = useMemo(() => {
    return securities.filter(security => {
      // Sector filter
      if (filters.sectors.length > 0 && !filters.sectors.includes(security.settore)) {
        return false;
      }
      
      // Industry filter
      if (filters.industries.length > 0 && !filters.industries.includes(security.industria)) {
        return false;
      }
      
      // Score filters
      const valScore = security.valuationScore ?? 0;
      if (valScore < filters.valuationScoreMin || valScore > filters.valuationScoreMax) {
        return false;
      }
      
      const opsScore = security.operationsScore ?? 0;
      if (opsScore < filters.operationsScoreMin || opsScore > filters.operationsScoreMax) {
        return false;
      }
      
      const riskScore = security.riskScore ?? 0;
      if (riskScore < filters.riskScoreMin || riskScore > filters.riskScoreMax) {
        return false;
      }
      
      const fundScore = security.fundamentalGlobalScore ?? 0;
      if (fundScore < filters.fundamentalScoreMin || fundScore > filters.fundamentalScoreMax) {
        return false;
      }
      
      // Global text search
      if (globalFilter) {
        const searchLower = globalFilter.toLowerCase();
        return (
          security.nome?.toLowerCase().includes(searchLower) ||
          security.isin?.toLowerCase().includes(searchLower) ||
          security.settore?.toLowerCase().includes(searchLower) ||
          security.industria?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [securities, filters, globalFilter]);

  // Define columns
  const columns = useMemo(() => [
    columnHelper.accessor('nome', {
      header: ({ column }) => (
        <SortableHeader column={column} label="Nome" />
      ),
      cell: info => (
        <div className="min-w-[180px]">
          <p className="font-medium text-foreground truncate">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor('isin', {
      header: ({ column }) => (
        <SortableHeader column={column} label="ISIN" />
      ),
      cell: info => (
        <span className="text-xs font-mono text-muted-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('settore', {
      header: ({ column }) => (
        <SortableHeader column={column} label="Settore" />
      ),
      cell: info => (
        <span className="text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('industria', {
      header: ({ column }) => (
        <SortableHeader column={column} label="Industria" />
      ),
      cell: info => (
        <span className="text-sm truncate max-w-[150px] block">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('marketCapMilEur', {
      header: ({ column }) => (
        <SortableHeader column={column} label="Market Cap" className="justify-end" />
      ),
      cell: info => (
        <div className="text-right">
          <span className="text-sm font-medium">{formatCurrency((info.getValue() || 0) * 1e6)}</span>
        </div>
      ),
    }),
    columnHelper.accessor('valuationScore', {
      header: ({ column }) => (
        <SortableHeader column={column} label="Valuation" className="justify-end" />
      ),
      cell: info => <ScoreCell value={info.getValue()} />,
    }),
    columnHelper.accessor('operationsScore', {
      header: ({ column }) => (
        <SortableHeader column={column} label="Operations" className="justify-end" />
      ),
      cell: info => <ScoreCell value={info.getValue()} />,
    }),
    columnHelper.accessor('riskScore', {
      header: ({ column }) => (
        <SortableHeader column={column} label="Risk" className="justify-end" />
      ),
      cell: info => <ScoreCell value={info.getValue()} />,
    }),
    columnHelper.accessor('fundamentalGlobalScore', {
      header: ({ column }) => (
        <SortableHeader column={column} label="Global Score" className="justify-end" />
      ),
      cell: info => {
        const value = info.getValue();
        return (
          <div className="text-right">
            <span className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold',
              getScoreBgColor(value),
              getScoreColor(value)
            )}>
              {formatNumber(value, 2)}
            </span>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const resetFilters = () => {
    setFilters({
      sectors: [],
      industries: [],
      valuationScoreMin: 0,
      valuationScoreMax: 10,
      operationsScoreMin: 0,
      operationsScoreMax: 10,
      riskScoreMin: 0,
      riskScoreMax: 10,
      fundamentalScoreMin: 0,
      fundamentalScoreMax: 10,
    });
    setGlobalFilter('');
  };

  const hasActiveFilters = 
    filters.sectors.length > 0 ||
    filters.industries.length > 0 ||
    filters.valuationScoreMin > 0 ||
    filters.valuationScoreMax < 10 ||
    filters.operationsScoreMin > 0 ||
    filters.operationsScoreMax < 10 ||
    filters.riskScoreMin > 0 ||
    filters.riskScoreMax < 10 ||
    filters.fundamentalScoreMin > 0 ||
    filters.fundamentalScoreMax < 10 ||
    globalFilter;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tabella interattiva con {filteredData.length.toLocaleString()} di {securities.length.toLocaleString()} titoli
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            showFilters 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <Filter className="h-4 w-4" />
          Filtri
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              •
            </span>
          )}
        </button>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="rounded-xl border border-border/50 bg-card p-4 shadow-lg space-y-4 animate-fade-in">
          {/* Search and Reset Row */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Cerca per nome, ISIN, settore..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="h-4 w-4" />
                Reset filtri
              </button>
            )}
          </div>

          {/* Multi-Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Settore
              </label>
              <MultiSelect
                options={sectors}
                value={filters.sectors}
                onChange={(value) => setFilters(f => ({ ...f, sectors: value }))}
                placeholder="Tutti i settori"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Industria
              </label>
              <MultiSelect
                options={industries}
                value={filters.industries}
                onChange={(value) => setFilters(f => ({ ...f, industries: value }))}
                placeholder="Tutte le industrie"
              />
            </div>
          </div>

          {/* Score Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScoreFilter
              label="Valuation Score"
              value={[filters.valuationScoreMin, filters.valuationScoreMax]}
              onChange={([min, max]) => setFilters(f => ({ 
                ...f, 
                valuationScoreMin: min, 
                valuationScoreMax: max 
              }))}
            />
            <ScoreFilter
              label="Operations Score"
              value={[filters.operationsScoreMin, filters.operationsScoreMax]}
              onChange={([min, max]) => setFilters(f => ({ 
                ...f, 
                operationsScoreMin: min, 
                operationsScoreMax: max 
              }))}
            />
            <ScoreFilter
              label="Risk Score"
              value={[filters.riskScoreMin, filters.riskScoreMax]}
              onChange={([min, max]) => setFilters(f => ({ 
                ...f, 
                riskScoreMin: min, 
                riskScoreMax: max 
              }))}
            />
            <ScoreFilter
              label="Fundamental Score"
              value={[filters.fundamentalScoreMin, filters.fundamentalScoreMax]}
              onChange={([min, max]) => setFilters(f => ({ 
                ...f, 
                fundamentalScoreMin: min, 
                fundamentalScoreMax: max 
              }))}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-border/40 bg-muted/30">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())
                      }
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                    Nessun titolo corrisponde ai criteri di ricerca
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.slice(0, 100).map(row => (
                  <tr
                    key={row.id}
                    className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-border/40 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Mostrando {Math.min(100, filteredData.length)} di {filteredData.length.toLocaleString()} risultati
            {filteredData.length > 100 && ' (limitato a 100 righe per performance)'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function SortableHeader({ column, label, className }: { column: any; label: string; className?: string }) {
  return (
    <button
      onClick={() => column.toggleSorting()}
      className={cn(
        'flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors',
        className
      )}
    >
      {label}
      {column.getIsSorted() === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5 text-primary" />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDown className="h-3.5 w-3.5 text-primary" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );
}

function ScoreCell({ value }: { value: number | null }) {
  return (
    <div className="text-right">
      <span className={cn('text-sm font-medium', getScoreColor(value))}>
        {formatNumber(value, 2)}
      </span>
    </div>
  );
}

function ScoreFilter({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: [number, number]; 
  onChange: (value: [number, number]) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <span className="text-xs text-foreground font-mono">
          {value[0].toFixed(1)} - {value[1].toFixed(1)}
        </span>
      </div>
      <Slider
        min={0}
        max={10}
        step={0.5}
        value={value}
        onValueChange={onChange}
      />
    </div>
  );
}
