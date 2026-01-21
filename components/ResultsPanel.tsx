import React from 'react';
import { CalculationResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, TrendingUp, Wallet, BatteryCharging, DollarSign, Zap } from 'lucide-react';

interface Props {
  result: CalculationResult;
  darkMode?: boolean;
}

export const ResultsPanel: React.FC<Props> = ({ result, darkMode = false }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Annual Savings Card (New) */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-yellow-500 transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Annual Savings</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.annualSavings)}</h3>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-full">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Year 1 Projection</p>
        </div>

        {/* Net Cost Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-blue-500 transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Net Cost</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.netCost)}</h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
              <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">After 30% Fed Tax Credit</p>
        </div>

        {/* 25 Year Savings Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-green-500 transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">25-Year Savings</p>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(result.twentyFiveYearSavings)}</h3>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Inflation adjusted</p>
        </div>

        {/* Est. System Cost Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-orange-500 transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. System Cost</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.estimatedSystemCost)}</h3>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-full">
              <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Before Tax Incentives</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Cumulative Savings Over Time</h3>
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280'}} 
                minTickGap={20}
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  fontSize: '14px'
                }}
                cursor={{ stroke: darkMode ? '#4b5563' : '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="savings" 
                stroke="#16a34a" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSavings)" 
                name="Cumulative Savings"
                activeDot={{ r: 6, strokeWidth: 2, stroke: darkMode ? '#1f2937' : '#ffffff', fill: '#16a34a' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">System Breakdown</h3>
        <ul className="space-y-4">
          <li className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <BatteryCharging className="w-4 h-4" /> Recommended Size
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">{result.systemSizeKw.toFixed(1)} kW</span>
          </li>
          <li className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4" /> Gross Cost
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(result.estimatedSystemCost)}</span>
          </li>
          <li className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
            <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" /> Federal Tax Credit (30%)
            </span>
            <span className="font-bold text-green-600 dark:text-green-400">-{formatCurrency(result.federalTaxCredit)}</span>
          </li>
          <li className="flex justify-between items-center py-2">
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" /> Payback Period
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">{result.paybackPeriodYears.toFixed(1)} Years</span>
          </li>
        </ul>
      </div>
    </div>
  );
};