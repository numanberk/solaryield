import React from 'react';
import { US_STATES_DATA } from '../constants';
import { CalculatorInputs } from '../types';
import { Sun, DollarSign, MapPin, Zap, TrendingUp } from 'lucide-react';

interface Props {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
}

export const SolarCalculatorForm: React.FC<Props> = ({ inputs, setInputs }) => {
  const handleChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getSunLabel = (val: number) => {
    if (val < 0.85) return 'Heavy Shade';
    if (val < 0.95) return 'Partial Shade';
    if (val < 1.05) return 'Standard';
    if (val < 1.15) return 'Very Sunny';
    return 'Full Exposure';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-8 transition-colors duration-200">
      
      {/* Section 1: Basics */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b dark:border-gray-700 pb-2">
          <div className="bg-primary-100 dark:bg-primary-900/40 p-1.5 rounded-lg">
            <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Your Usage</h2>
        </div>

        {/* Monthly Bill Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Average Monthly Electric Bill
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 dark:text-gray-400 font-bold">$</span>
            </div>
            <input
              type="number"
              min="0"
              value={inputs.monthlyBill}
              onChange={(e) => handleChange('monthlyBill', parseFloat(e.target.value) || 0)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-8 py-3 text-lg font-semibold focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 dark:text-white border outline-none transition-all"
              placeholder="150"
            />
          </div>
        </div>

        {/* State Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location (US State)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={inputs.stateCode}
              onChange={(e) => handleChange('stateCode', e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 py-3 text-base focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 dark:text-white border outline-none transition-all"
            >
              {US_STATES_DATA.map((state) => (
                <option key={state.code} value={state.code} className="dark:bg-gray-800">
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Advanced Knobs (Engagement Boosters) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b dark:border-gray-700 pb-2 pt-2">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-lg">
            <Sun className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">System & Market</h2>
        </div>

        {/* Roof Exposure Slider - High Precision */}
        <div>
          <div className="flex justify-between items-end mb-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Roof Sun Exposure</label>
             <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/40 px-2 py-1 rounded-md">
                {getSunLabel(inputs.roofSunExposure)} ({(inputs.roofSunExposure * 100).toFixed(0)}%)
             </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.2"
            step="0.01" // Makes it feel continuous/infinite
            value={inputs.roofSunExposure}
            onChange={(e) => handleChange('roofSunExposure', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        {/* Bill Offset Slider */}
        <div>
          <div className="flex justify-between items-end mb-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
               <Zap className="w-3 h-3 text-yellow-500" /> Bill Offset
             </label>
             <span className="text-xs font-bold text-gray-900 dark:text-white">{inputs.billOffset}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="120"
            step="5"
            value={inputs.billOffset}
            onChange={(e) => handleChange('billOffset', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <p className="text-[10px] text-gray-400 mt-1">How much of your bill do you want to eliminate?</p>
        </div>

        {/* Inflation Prediction Slider */}
        <div>
          <div className="flex justify-between items-end mb-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
               <TrendingUp className="w-3 h-3 text-red-500" /> Utility Inflation Rate
             </label>
             <span className="text-xs font-bold text-gray-900 dark:text-white">{inputs.inflationRate}% / yr</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="0.5"
            value={inputs.inflationRate}
            onChange={(e) => handleChange('inflationRate', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <p className="text-[10px] text-gray-400 mt-1">Higher inflation = higher savings.</p>
        </div>

      </div>
    </div>
  );
};