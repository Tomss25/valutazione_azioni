'use client';

import { AlertCircle, RefreshCw, FileX } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorFallbackProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <FileX className="h-10 w-10 text-destructive" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-card border-2 border-destructive flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-foreground mb-2">
          Errore nel Caricamento Dati
        </h2>
        
        <Alert variant="destructive" className="text-left mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dettagli Errore</AlertTitle>
          <AlertDescription className="mt-1">
            {error}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Riprova
            </button>
          )}
          
          <p className="text-sm text-muted-foreground">
            Verifica che il file <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">modello_finale_integrato.xlsx</code> sia presente nella root del progetto.
          </p>
        </div>
      </div>
    </div>
  );
}
