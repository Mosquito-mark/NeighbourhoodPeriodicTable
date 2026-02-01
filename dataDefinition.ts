
export interface FieldDefinition {
  key: string;
  column: string;
  dataType: 'String' | 'Integer' | 'Float' | 'Percentage' | 'Currency';
  description: string;
  required: boolean;
  visualImpact: string;
  example: string;
}

/**
 * Technical specification for the Periodic Table data engine.
 * This file serves as the single source of truth for mapping CSV data
 * to the internal Neighbourhood model and visual components.
 */
export const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: 'id',
    column: 'ID',
    dataType: 'String',
    description: 'A 2-letter symbol representing the ward or primary administrative region.',
    required: true,
    visualImpact: 'Displayed as the "Atomic Symbol" in the center of each cell.',
    example: 'Me'
  },
  {
    key: 'ward',
    column: 'Ward Name',
    dataType: 'String',
    description: 'The full name of the administrative ward or district.',
    required: true,
    visualImpact: 'Displayed as a secondary label below the symbol and used for filtering.',
    example: 'Métis'
  },
  {
    key: 'name',
    column: 'Neighbourhood',
    dataType: 'String',
    description: 'The name of the specific neighbourhood or community.',
    required: true,
    visualImpact: 'Primary text label on the cell.',
    example: 'Alberta Avenue'
  },
  {
    key: 'type',
    column: 'Type',
    dataType: 'String',
    description: 'Categorization (e.g., Residential, Industrial, Mixed-Use).',
    required: false,
    visualImpact: 'Displayed in the list view and detailed analysis panel.',
    example: 'Residential'
  },
  {
    key: 'population',
    column: 'Population',
    dataType: 'Integer',
    description: 'Total resident count based on the latest municipal census.',
    required: true,
    visualImpact: 'Top-right corner metric "P" on cell.',
    example: '6200'
  },
  {
    key: 'households',
    column: 'Households',
    dataType: 'Integer',
    description: 'Total number of private households.',
    required: true,
    visualImpact: 'Top-right corner metric "H" on cell.',
    example: '3100'
  },
  {
    key: 'medianIncome',
    column: 'Median Income',
    dataType: 'Currency',
    description: 'Median annual household income in the area.',
    required: true,
    visualImpact: 'Displayed as "I" in footer. Used to calculate affordability rank.',
    example: '58000'
  },
  {
    key: 'medianHomePrice',
    column: 'Median Home Price',
    dataType: 'Currency',
    description: 'Median residential property sale price (Single Family or Weighted Average).',
    required: true,
    visualImpact: 'Displayed as "P" in footer. Primary driver of affordability ratio.',
    example: '315000'
  },
  {
    key: 'sustainableModePct',
    column: 'Sustainable Mode %',
    dataType: 'Percentage',
    description: 'Percentage of population using transit, cycling, or walking for commute.',
    required: true,
    visualImpact: 'Determines cell color (Blue=Low, Red=High) and horizontal (Column) position.',
    example: '32.1'
  },
  {
    key: 'affordabilityRatio',
    column: 'Affordability Ratio',
    dataType: 'Float',
    description: 'Calculation of Median Home Price divided by Median Annual Household Income.',
    required: true,
    visualImpact: 'Determines vertical (Row) position. Low ratio (Affordable) at top, High (Unattainable) at bottom.',
    example: '5.4'
  }
];
