export interface SecurityData {
  nome: string;
  isin: string;
  valutaBase: string;
  settore: string;
  industria: string;
  exchangeCountry: string;
  marketCapMilEur: number | null;
  marketCapCategory: string;
  peAttuale: number | null;
  peForward: number | null;
  pegRatio: number | null;
  pbAttuale: number | null;
  valuationScore: number | null;
  operationsScore: number | null;
  riskScore: number | null;
  fundamentalGlobalScore: number | null;
  dividendYield: number | null;
  roe: number | null;
  roa: number | null;
  netMargin: number | null;
  operMargin: number | null;
}

export interface RawSheetData {
  sheetName: string;
  headers: string[];
  rows: (string | number | null)[][];
}

export interface PortfolioAPIResponse {
  success: boolean;
  data?: {
    securities: SecurityData[];
    rawSheets: RawSheetData[];
    summary: {
      totalSecurities: number;
      totalMarketCap: number;
      avgFundamentalScore: number;
      sectors: { name: string; count: number; percentage: number }[];
      industries: { name: string; count: number; percentage: number }[];
      scoreDistribution: { range: string; count: number }[];
    };
  };
  error?: string;
}

export interface FilterState {
  sectors: string[];
  industries: string[];
  valuationScoreMin: number;
  valuationScoreMax: number;
  operationsScoreMin: number;
  operationsScoreMax: number;
  riskScoreMin: number;
  riskScoreMax: number;
  fundamentalScoreMin: number;
  fundamentalScoreMax: number;
}

export type SortDirection = 'asc' | 'desc' | false;

export interface SortConfig {
  key: keyof SecurityData;
  direction: SortDirection;
}
