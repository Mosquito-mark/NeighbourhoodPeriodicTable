
export interface Neighbourhood {
  id: string;
  ward: string;
  name: string;
  type: string;
  population: number;
  households: number;
  medianIncome: number;
  medianHomePrice: number;
  sustainableModePct: number;
  affordabilityRatio: number;
  symbol: string;
  row: number;
  col: number;
}

export interface NeighbourhoodStats {
  totalNeighbourhoods: number;
  avgAffordability: number;
  avgIncome: number;
  avgSustainableMode: number;
}

export interface AnalysisResponse {
  summary: string;
  keyHighlights: string[];
  recommendation: string;
}
