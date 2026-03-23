import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { SecurityData, RawSheetData, PortfolioAPIResponse } from '@/types/portfolio';

const EXCLUDED_SHEETS = [
  'market average',
  'input usa average',
  'input europe average',
];

function parseValue(val: unknown): string | number | null {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === '-' || trimmed === 'N/A' || trimmed === 'NaN') return null;
    const num = parseFloat(trimmed.replace(',', '.'));
    if (!isNaN(num)) return num;
    return trimmed;
  }
  return String(val);
}

function getNumericValue(val: unknown): number | null {
  const parsed = parseValue(val);
  if (parsed === null) return null;
  if (typeof parsed === 'number') return parsed;
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'modello_finale_integrato.xlsx');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'File Excel non trovato. Assicurati che modello_finale_integrato.xlsx sia nella root del progetto.',
      } as PortfolioAPIResponse, { status: 500 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    let workbook: XLSX.WorkBook;
    
    try {
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'File Excel corrotto o formato non valido.',
      } as PortfolioAPIResponse, { status: 500 });
    }

    const securities: SecurityData[] = [];
    const rawSheets: RawSheetData[] = [];

    // Parse FUNDAMENTAL ANALYSIS sheet for securities data
    const fundamentalSheet = workbook.Sheets['FUNDAMENTAL ANALYSIS'];
    if (fundamentalSheet) {
      const jsonData = XLSX.utils.sheet_to_json(fundamentalSheet, { header: 1 }) as unknown[][];
      
      if (jsonData.length > 1) {
        const headers = jsonData[0] as string[];
        
        // Find column indices
        const colMap: Record<string, number> = {};
        headers.forEach((h, i) => {
          if (h) colMap[String(h).toLowerCase().trim()] = i;
        });

        const nameIdx = colMap['nome'] ?? 0;
        const isinIdx = colMap['isin'] ?? 1;
        const valutaIdx = colMap['valuta base'] ?? 2;
        const settoreIdx = colMap['settore'] ?? 3;
        const industriaIdx = colMap['industria'] ?? 4;
        const exchangeIdx = colMap['exchange country'] ?? 5;
        const marketCapMilIdx = colMap['cap mercato in mil eur'] ?? 6;
        const marketCapCatIdx = colMap['market cap'] ?? 7;
        const peAttualeIdx = colMap['indicatore p/e attuale'] ?? 8;
        const peForwardIdx = colMap['indicatore p/e forward'] ?? 9;
        const pegIdx = colMap['peg ratio'] ?? 10;
        const pbIdx = colMap['indicatore p/b attuale'] ?? 13;
        const valuationIdx = colMap['valuation score'] ?? headers.findIndex(h => String(h).toLowerCase().includes('valuation score'));
        const operationsIdx = colMap['operations score'] ?? headers.findIndex(h => String(h).toLowerCase() === 'operations score');
        const riskIdx = colMap['risk score'] ?? headers.findIndex(h => String(h).toLowerCase() === 'risk score');
        const globalIdx = colMap['fundamental global score'] ?? headers.findIndex(h => String(h).toLowerCase().includes('fundamental global score'));
        const divYieldIdx = colMap['dividend yield % current'] ?? headers.findIndex(h => String(h).toLowerCase().includes('dividend yield'));
        const roeIdx = colMap['roe % (trailing) (long)'] ?? headers.findIndex(h => String(h).toLowerCase().includes('roe'));
        const roaIdx = colMap['roa % (trailing) (long)'] ?? headers.findIndex(h => String(h).toLowerCase().includes('roa'));
        const netMarginIdx = colMap['net margin % ttm'] ?? headers.findIndex(h => String(h).toLowerCase().includes('net margin'));
        const operMarginIdx = colMap['oper margin % fy 1'] ?? headers.findIndex(h => String(h).toLowerCase().includes('oper margin'));

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || !row[nameIdx]) continue;

          const security: SecurityData = {
            nome: String(row[nameIdx] || ''),
            isin: String(row[isinIdx] || ''),
            valutaBase: String(row[valutaIdx] || ''),
            settore: String(row[settoreIdx] || 'Unknown'),
            industria: String(row[industriaIdx] || 'Unknown'),
            exchangeCountry: String(row[exchangeIdx] || ''),
            marketCapMilEur: getNumericValue(row[marketCapMilIdx]),
            marketCapCategory: String(row[marketCapCatIdx] || ''),
            peAttuale: getNumericValue(row[peAttualeIdx]),
            peForward: getNumericValue(row[peForwardIdx]),
            pegRatio: getNumericValue(row[pegIdx]),
            pbAttuale: getNumericValue(row[pbIdx]),
            valuationScore: getNumericValue(row[valuationIdx]),
            operationsScore: getNumericValue(row[operationsIdx]),
            riskScore: getNumericValue(row[riskIdx]),
            fundamentalGlobalScore: getNumericValue(row[globalIdx]),
            dividendYield: getNumericValue(row[divYieldIdx]),
            roe: getNumericValue(row[roeIdx]),
            roa: getNumericValue(row[roaIdx]),
            netMargin: getNumericValue(row[netMarginIdx]),
            operMargin: getNumericValue(row[operMarginIdx]),
          };

          securities.push(security);
        }
      }
    }

    // Parse other sheets for raw data (excluding the specified ones)
    for (const sheetName of workbook.SheetNames) {
      const lowerName = sheetName.toLowerCase().trim();
      
      if (EXCLUDED_SHEETS.some(ex => lowerName.includes(ex))) continue;
      if (lowerName === 'fundamental analysis') continue; // Already processed
      
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
      
      if (jsonData.length > 0) {
        const headers = (jsonData[0] || []).map(h => String(h || ''));
        const rows = jsonData.slice(1, 101).map(row => 
          (row as unknown[]).map(cell => parseValue(cell))
        );

        rawSheets.push({
          sheetName,
          headers,
          rows,
        });
      }
    }

    // Calculate summary statistics
    const validScores = securities.filter(s => s.fundamentalGlobalScore !== null);
    const totalMarketCap = securities.reduce((sum, s) => sum + (s.marketCapMilEur || 0), 0);
    const avgScore = validScores.length > 0 
      ? validScores.reduce((sum, s) => sum + (s.fundamentalGlobalScore || 0), 0) / validScores.length 
      : 0;

    // Sector distribution
    const sectorCounts: Record<string, number> = {};
    securities.forEach(s => {
      const sector = s.settore || 'Unknown';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });
    const sectors = Object.entries(sectorCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / securities.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    // Industry distribution (top 20)
    const industryCounts: Record<string, number> = {};
    securities.forEach(s => {
      const industry = s.industria || 'Unknown';
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });
    const industries = Object.entries(industryCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / securities.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Score distribution
    const scoreRanges = [
      { range: '0-1', min: 0, max: 1 },
      { range: '1-2', min: 1, max: 2 },
      { range: '2-3', min: 2, max: 3 },
      { range: '3-4', min: 3, max: 4 },
      { range: '4-5', min: 4, max: 5 },
      { range: '5+', min: 5, max: Infinity },
    ];
    
    const scoreDistribution = scoreRanges.map(({ range, min, max }) => ({
      range,
      count: securities.filter(s => {
        const score = s.fundamentalGlobalScore;
        if (score === null) return false;
        return score >= min && score < max;
      }).length,
    }));

    return NextResponse.json({
      success: true,
      data: {
        securities,
        rawSheets,
        summary: {
          totalSecurities: securities.length,
          totalMarketCap,
          avgFundamentalScore: avgScore,
          sectors,
          industries,
          scoreDistribution,
        },
      },
    } as PortfolioAPIResponse);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: `Errore interno del server: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
    } as PortfolioAPIResponse, { status: 500 });
  }
}
