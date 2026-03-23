'use client';

import { useState } from 'react';
import { FileSpreadsheet, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RawSheetData } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface RawDataInspectorProps {
  sheets: RawSheetData[];
}

export function RawDataInspector({ sheets }: RawDataInspectorProps) {
  const [activeSheet, setActiveSheet] = useState(sheets[0]?.sheetName || '');
  
  if (sheets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Nessun foglio disponibile</h3>
        <p className="text-sm text-muted-foreground mt-1">
          I fogli di dati grezzi non sono stati trovati nel file Excel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Raw Data Inspector</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Esplora i dati grezzi dei {sheets.length} fogli Excel disponibili
        </p>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue={activeSheet} value={activeSheet} onValueChange={setActiveSheet} className="w-full">
        {/* Scrollable Tab List */}
        <div className="relative">
          <TabsList className="w-full overflow-x-auto flex-nowrap justify-start bg-card border border-border/50 rounded-lg p-1">
            {sheets.map((sheet) => (
              <TabsTrigger 
                key={sheet.sheetName} 
                value={sheet.sheetName}
                className="whitespace-nowrap flex-shrink-0"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                {sheet.sheetName}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Contents */}
        {sheets.map((sheet) => (
          <TabsContent key={sheet.sheetName} value={sheet.sheetName}>
            <SheetTable sheet={sheet} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function SheetTable({ sheet }: { sheet: RawSheetData }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;
  const totalPages = Math.ceil(sheet.rows.length / rowsPerPage);
  
  const paginatedRows = sheet.rows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  // Limit columns displayed for performance
  const maxCols = 15;
  const displayHeaders = sheet.headers.slice(0, maxCols);
  const hasMoreCols = sheet.headers.length > maxCols;

  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden animate-fade-in">
      {/* Sheet Info */}
      <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{sheet.sheetName}</p>
            <p className="text-xs text-muted-foreground">
              {sheet.rows.length} righe × {sheet.headers.length} colonne
              {hasMoreCols && ` (mostrando prime ${maxCols} colonne)`}
            </p>
          </div>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground min-w-[80px] text-center">
              Pagina {page + 1} di {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-12">
                #
              </th>
              {displayHeaders.map((header, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap max-w-[200px]"
                  title={header}
                >
                  <span className="truncate block">{header || `Col ${idx + 1}`}</span>
                </th>
              ))}
              {hasMoreCols && (
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                  ...
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td 
                  colSpan={displayHeaders.length + 2} 
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Nessun dato disponibile
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={cn(
                    'border-b border-border/20 hover:bg-muted/20 transition-colors',
                    rowIdx % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                  )}
                >
                  <td className="px-3 py-2 text-xs text-muted-foreground font-mono">
                    {page * rowsPerPage + rowIdx + 1}
                  </td>
                  {row.slice(0, maxCols).map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-3 py-2 max-w-[200px]"
                      title={cell !== null ? String(cell) : ''}
                    >
                      <CellValue value={cell} />
                    </td>
                  ))}
                  {hasMoreCols && (
                    <td className="px-3 py-2 text-muted-foreground">...</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/40 bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Mostrando righe {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, sheet.rows.length)} di {sheet.rows.length}
        </p>
      </div>
    </div>
  );
}

function CellValue({ value }: { value: string | number | null }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground/50 text-xs">—</span>;
  }

  if (typeof value === 'number') {
    // Check if it's a percentage (between -1 and 1 with decimals)
    if (Math.abs(value) <= 1 && value !== Math.floor(value) && value !== 0) {
      return (
        <span className={cn(
          'font-mono text-xs',
          value >= 0 ? 'text-emerald-600' : 'text-rose-600'
        )}>
          {(value * 100).toFixed(2)}%
        </span>
      );
    }
    
    // Regular number
    return (
      <span className="font-mono text-xs text-foreground">
        {value.toLocaleString('it-IT', { maximumFractionDigits: 4 })}
      </span>
    );
  }

  // String value
  return (
    <span className="text-foreground text-xs truncate block">
      {String(value)}
    </span>
  );
}
