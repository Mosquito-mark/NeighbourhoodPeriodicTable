
import { Neighbourhood, NeighbourhoodStats } from '../types';
import { WARD_SYMBOL_MAP, RAW_CSV_DATA } from '../constants';
import { FIELD_DEFINITIONS } from '../dataDefinition';

/**
 * Robust CSV parser for the dataset.
 * Handles quoted numeric values (e.g., "19,550") and commas within fields.
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

/**
 * Parses raw CSV into Neighbourhood objects and calculates grid positioning.
 * Normalizes both axes using rank-based distribution (quantiles).
 */
export const parseNeighbourhoods = (csvContent: string): Neighbourhood[] => {
  const lines = csvContent.split('\n');
  const rawNeighbourhoods: Neighbourhood[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const rowValues = parseCSVLine(line);
    // Basic validation: ensure we have at least the minimum required columns (10)
    if (rowValues.length < 10) continue;

    const [
      idCol, ward, name, type, popStr, hhStr, incomeStr, priceStr, modeStr, affStr
    ] = rowValues;

    // Clean data: remove thousands-separators and handle numeric conversion
    const population = parseInt(popStr.replace(/,/g, '').replace(/"/g, '')) || 0;
    const households = parseInt(hhStr.replace(/,/g, '').replace(/"/g, '')) || 0;
    const medianIncome = parseInt(incomeStr.replace(/,/g, '').replace(/"/g, '')) || 0;
    const medianHomePrice = parseInt(priceStr.replace(/,/g, '').replace(/"/g, '')) || 0;
    const sustainableModePct = parseFloat(modeStr.replace(/"/g, '')) || 0;
    const affordabilityRatio = parseFloat(affStr.replace(/"/g, '')) || 0;

    rawNeighbourhoods.push({
      id: `${ward}-${name}`,
      ward,
      name,
      type,
      population,
      households,
      medianIncome,
      medianHomePrice,
      sustainableModePct,
      affordabilityRatio,
      symbol: WARD_SYMBOL_MAP[ward] || idCol || '??',
      row: 0, 
      col: 0  
    });
  }

  // Ensure uniqueness
  const uniqueList = Array.from(new Map(rawNeighbourhoods.map(n => [n.id, n])).values());
  const count = uniqueList.length;
  if (count === 0) return [];

  // 1. Normalize Rows: Rank-based distribution by Affordability Ratio (9 Rows: 0-8)
  const sortedByAffordability = [...uniqueList].sort((a, b) => a.affordabilityRatio - b.affordabilityRatio);
  sortedByAffordability.forEach((n, idx) => {
    n.row = Math.floor((idx / count) * 9);
  });

  // 2. Normalize Cols: Rank-based distribution by Sustainable Mode % (21 Columns: 0-20)
  const sortedByMode = [...uniqueList].sort((a, b) => a.sustainableModePct - b.sustainableModePct);
  sortedByMode.forEach((n, idx) => {
    n.col = Math.floor((idx / count) * 21);
  });

  return uniqueList;
};

export const fetchNeighbourhoods = (): Neighbourhood[] => {
  return parseNeighbourhoods(RAW_CSV_DATA);
};

export const calculateStats = (data: Neighbourhood[]): NeighbourhoodStats => {
  const count = data.length;
  if (count === 0) return { totalNeighbourhoods: 0, avgAffordability: 0, avgIncome: 0, avgSustainableMode: 0 };

  const sumAffordability = data.reduce((acc, n) => acc + n.affordabilityRatio, 0);
  const sumIncome = data.reduce((acc, n) => acc + n.medianIncome, 0);
  const sumMode = data.reduce((acc, n) => acc + n.sustainableModePct, 0);

  return {
    totalNeighbourhoods: count,
    avgAffordability: sumAffordability / count,
    avgIncome: sumIncome / count,
    avgSustainableMode: sumMode / count
  };
};
