export interface StateData {
  name: string;
  code: string;
  avgCostPerKWh: number; // In dollars
  peakSunHours: number; // Daily average
}

export interface CalculatorInputs {
  monthlyBill: number;
  stateCode: string;
  roofSunExposure: number; // 0.8 to 1.2 modifier
  billOffset: number; // Percentage 50-150%
  inflationRate: number; // Percentage 0-10%
}

export interface CalculationResult {
  systemSizeKw: number;
  estimatedSystemCost: number;
  federalTaxCredit: number;
  netCost: number;
  annualSavings: number;
  paybackPeriodYears: number;
  twentyFiveYearSavings: number;
  chartData: Array<{ year: number; savings: number; cost: number }>;
}