import React, { useState, useEffect } from 'react';
import { SolarCalculatorForm } from './components/SolarCalculatorForm';
import { SolarResultsPanel } from './components/SolarResultsPanel';
import { AdUnit } from './components/AdUnit';
import { InstallerModal } from './components/InstallerModal';
import { CalculatorInputs, CalculationResult } from './types';
import { US_STATES_DATA, COST_PER_WATT, FEDERAL_TAX_CREDIT_RATE, DEFAULT_INFLATION_RATE } from './constants';
import { Zap, X, HelpCircle, FileText, TrendingUp, Map, Moon, Sun } from 'lucide-react';

export default function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyBill: 200,
    stateCode: 'TX',
    roofSunExposure: 1.0,
    billOffset: 100, // Default to 100% coverage
    inflationRate: DEFAULT_INFLATION_RATE, // Default inflation from constants (4.5%)
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      // Default to light mode (false) if no preference is saved
      return false;
    }
    return false;
  });

  // Apply Theme Side Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // SEO: Dynamic Title, Description, and Social Tags Update
  useEffect(() => {
    const stateData = US_STATES_DATA.find(s => s.code === inputs.stateCode);
    const stateName = stateData?.name || 'the US';
    
    // Dynamic Content Generation
    const title = `Is Solar Worth It in ${stateName}? 2025 Calculator & Costs`;
    const description = `Calculate true solar savings in ${stateName} with 2025 rates. See installation costs, payback period, and 30% federal tax credit eligibility for ${stateName} homeowners.`;
    const keywords = `solar calculator ${stateName}, solar panel cost ${stateName}, ${stateName} solar incentives 2025, is solar worth it in ${stateName}, solar roi calculator`;

    // 1. Update Browser Title
    document.title = title;
    
    // 2. Helper to update meta tags securely
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    // 3. Update Standard Meta Tags
    setMeta('meta[name="description"]', description);
    setMeta('meta[name="keywords"]', keywords);
    
    // 4. Update Open Graph (Facebook/LinkedIn)
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    
    // 5. Update Twitter Cards
    setMeta('meta[property="twitter:title"]', title);
    setMeta('meta[property="twitter:description"]', description);

  }, [inputs.stateCode]);

  // Core Business Logic
  useEffect(() => {
    const calculateSolar = () => {
      const stateData = US_STATES_DATA.find(s => s.code === inputs.stateCode) || US_STATES_DATA[US_STATES_DATA.length - 1];
      
      // 1. Calculate Annual kWh consumption
      const monthlyKwh = inputs.monthlyBill / stateData.avgCostPerKWh;
      const annualKwhNeeded = monthlyKwh * 12;

      // 2. Apply Bill Offset (Target Production)
      const targetAnnualProduction = annualKwhNeeded * (inputs.billOffset / 100);

      // 3. Calculate Required System Size (kW)
      const efficiencyFactor = 0.75 * inputs.roofSunExposure;
      const systemSizeKw = targetAnnualProduction / (stateData.peakSunHours * 365 * efficiencyFactor);
      
      // 4. Financials
      const estimatedSystemCost = systemSizeKw * 1000 * COST_PER_WATT;
      const federalTaxCredit = estimatedSystemCost * FEDERAL_TAX_CREDIT_RATE;
      const netCost = estimatedSystemCost - federalTaxCredit;

      // 5. Projection
      const chartData = [];
      let cumulativeSavings = -netCost;
      
      // The utility cost we are saving is proportional to the offset
      let initialAnnualSaving = (inputs.monthlyBill * 12) * (inputs.billOffset / 100);
      let currentAnnualSaving = initialAnnualSaving;
      
      let paybackPeriodYears = 0;
      let foundPayback = false;
      const inflationDecimal = inputs.inflationRate / 100;

      for (let year = 0; year <= 25; year++) {
        if (year === 0) {
          chartData.push({ year, savings: -netCost, cost: 0 });
          continue;
        }

        cumulativeSavings += currentAnnualSaving;
        
        if (!foundPayback && cumulativeSavings >= 0) {
          const prevSavings = chartData[year-1].savings;
          const fraction = Math.abs(prevSavings) / (cumulativeSavings - prevSavings);
          paybackPeriodYears = (year - 1) + fraction;
          foundPayback = true;
        }

        chartData.push({
          year,
          savings: Math.round(cumulativeSavings),
          cost: Math.round(currentAnnualSaving)
        });

        currentAnnualSaving *= (1 + inflationDecimal);
      }

      setResult({
        systemSizeKw,
        estimatedSystemCost,
        federalTaxCredit,
        netCost,
        annualSavings: initialAnnualSaving,
        paybackPeriodYears: foundPayback ? paybackPeriodYears : 25,
        twentyFiveYearSavings: cumulativeSavings,
        chartData
      });
    };

    calculateSolar();
  }, [inputs]);

  const handleStateLinkClick = (code: string) => {
    setInputs(prev => ({ ...prev, stateCode: code }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentStateName = US_STATES_DATA.find(s => s.code === inputs.stateCode)?.name;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Header */}
      <header className={`border-b sticky top-0 z-50 transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Zap className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              SolarYield<span className="text-primary-600">US</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowQuoteModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Get Installer Quote
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Top Ad Unit */}
          <div className="mb-8 flex justify-center">
            <AdUnit format="leaderboard" />
          </div>

          <div className="text-center mb-10 max-w-3xl mx-auto">
            <h1 className={`text-3xl md:text-4xl font-extrabold mb-4 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Is Solar Worth It in {currentStateName}?
            </h1>
            <p className={`text-lg transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Calculate your solar potential, federal tax credits, and estimated payback period in {currentStateName} based on 2025 market rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Calculator Inputs & Ad */}
            <div className="lg:col-span-4 space-y-8">
              <SolarCalculatorForm inputs={inputs} setInputs={setInputs} />
              
              <div className="hidden lg:block sticky top-24">
                <AdUnit format="sidebar" />
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 space-y-8">
              {result && <SolarResultsPanel result={result} darkMode={darkMode} />}
              
              <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to save {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result?.twentyFiveYearSavings || 0)}?</h3>
                  <p className="text-blue-100">Connect with pre-screened installers in {inputs.stateCode} to lock in these rates.</p>
                </div>
                <button 
                  onClick={() => setShowQuoteModal(true)}
                  className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap"
                >
                  Get Free Quotes
                </button>
              </div>

              {/* Mobile Only Ad */}
              <div className="lg:hidden">
                <AdUnit format="inline" />
              </div>
            </div>
          </div>
          
          {/* SEO Content Section */}
          <div className={`mt-24 border-t pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <article className="prose prose-green lg:prose-lg">
              <h2 className={`text-2xl font-bold flex items-center gap-2 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FileText className="text-primary-600" />
                {currentStateName} Solar Incentives (2025)
              </h2>
              <p className={`mb-4 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Homeowners in <strong>{currentStateName}</strong> can significantly reduce the cost of solar through the Investment Tax Credit (ITC). The ITC allows you to deduct <strong>30% of your system cost</strong> from your federal taxes. 
              </p>
              <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Combined with {currentStateName}'s specific net metering policies and local electricity rates, going solar is often one of the safest investments a homeowner can make against rising inflation.
              </p>
            </article>

            <article className="prose prose-green lg:prose-lg">
              <h2 className={`text-2xl font-bold flex items-center gap-2 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <TrendingUp className="text-primary-600" />
                Solar Payback Period in {currentStateName}
              </h2>
              <p className={`mb-4 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Based on current average electricity rates in {currentStateName} ({US_STATES_DATA.find(s => s.code === inputs.stateCode)?.avgCostPerKWh.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}/kWh) and average peak sun hours ({US_STATES_DATA.find(s => s.code === inputs.stateCode)?.peakSunHours} hours/day), most systems pay for themselves within <strong>{Math.floor(result?.paybackPeriodYears || 8)} to {Math.ceil((result?.paybackPeriodYears || 8) + 2)} years</strong>.
              </p>
              <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                After this payback period, the energy your panels produce is effectively free, generating thousands in profit over the life of the system.
              </p>
            </article>
            
             <article className="col-span-1 md:col-span-2 mt-8">
              <h2 className={`text-2xl font-bold flex items-center gap-2 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <HelpCircle className="text-primary-600" />
                {currentStateName} Solar FAQ
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>How much do solar panels cost in {currentStateName}?</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>While exact costs vary by installer, the average cost before tax credits is approximately ${COST_PER_WATT} per watt. For a typical 6kW to 10kW system, this equates to a gross cost between $18,000 and $30,000, before the 30% federal credit is applied.</p>
                </div>
                <div>
                  <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Is solar worth it in {currentStateName} if I have some shade?</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Yes, modern panels and microinverters can mitigate the impact of partial shade. Use our "Roof Shade" slider above to adjust the efficiency and see how it impacts your specific ROI in {currentStateName}.</p>
                </div>
              </div>
            </article>
          </div>
          
          {/* STATE DIRECTORY LINKS */}
          <div className={`mt-20 border-t pt-12 transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Map className="w-6 h-6 text-primary-600" />
              Check Solar Savings by State
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {US_STATES_DATA.map((state) => (
                 <button
                   key={state.code}
                   onClick={() => handleStateLinkClick(state.code)}
                   className={`text-sm py-2 px-3 rounded-md text-left transition-colors ${
                    inputs.stateCode === state.code 
                      ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800' 
                      : darkMode 
                        ? 'hover:bg-gray-800 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                   }`}
                 >
                   Solar in {state.name}
                 </button>
              ))}
            </div>
            <p className={`text-xs text-center mt-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Select your state to update the calculator with 2025 electricity rates and sun hour averages.
            </p>
          </div>

        </div>
      </main>

      <footer className={`border-t mt-12 transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2025 SolarYield US. Estimates based on NREL PVWatts data and average US electricity inflation rates.
            <br />
            This tool is for informational purposes only. Consult a professional tax advisor regarding the ITC.
          </p>
          <div className={`flex justify-center gap-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <button onClick={() => setShowPrivacy(true)} className="hover:text-primary-600 underline">Privacy Policy</button>
            <span className="hover:text-primary-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary-600 cursor-pointer">About Us</span>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <button 
              onClick={() => setShowPrivacy(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Privacy Policy</h2>
            <div className={`prose text-sm space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Last updated: January 2025</p>
              <p>At SolarYield US, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SolarYield US and how we use it.</p>
              
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Log Files</h3>
              <p>SolarYield US follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>

              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Google DoubleClick DART Cookie</h3>
              <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-blue-600" target="_blank">https://policies.google.com/technologies/ads</a></p>

              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Consent</h3>
              <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
            </div>
          </div>
        </div>
      )}
      
      {showQuoteModal && (
        <InstallerModal 
          isOpen={showQuoteModal} 
          onClose={() => setShowQuoteModal(false)} 
          stateCode={inputs.stateCode} 
        />
      )}
    </div>
  );
}
