'use client';

import * as React from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect = ({ options, value, onChange, placeholder = 'Select...', className }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== option));
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex flex-wrap items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-lg border border-border/50 bg-background/50 cursor-pointer transition-colors',
          'hover:border-primary/50',
          isOpen && 'border-primary ring-1 ring-primary/20'
        )}
      >
        {value.length === 0 ? (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        ) : (
          <>
            {value.slice(0, 2).map(v => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-medium"
              >
                {v}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={(e) => removeOption(v, e)}
                />
              </span>
            ))}
            {value.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{value.length - 2} altri
              </span>
            )}
          </>
        )}
        <ChevronDown className={cn(
          'ml-auto h-4 w-4 text-muted-foreground transition-transform',
          isOpen && 'rotate-180'
        )} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border/50 bg-card shadow-xl">
          <div className="p-2 border-b border-border/50">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca..."
              className="w-full px-2 py-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-2 px-3 text-sm text-muted-foreground text-center">
                Nessun risultato
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors',
                    'hover:bg-muted/50',
                    value.includes(option) && 'bg-primary/10 text-primary'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-4 h-4 rounded border',
                    value.includes(option) 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground/50'
                  )}>
                    {value.includes(option) && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span className="truncate">{option}</span>
                </div>
              ))
            )}
          </div>
          {value.length > 0 && (
            <div className="p-2 border-t border-border/50">
              <button
                onClick={() => onChange([])}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Cancella tutto ({value.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { MultiSelect };
