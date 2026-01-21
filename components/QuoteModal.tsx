import React, { useState } from 'react';
import { X, CheckCircle, Loader2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  stateCode: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, stateCode }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Controlled inputs state
  const [formData, setFormData] = useState({
    zip: '',
    bill: '$151 - $200',
    shade: 'No Shade',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3); // Success state
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        
        {/* Header */}
        <div className="bg-blue-900 p-6 text-white text-center relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          {step === 2 && (
             <button 
               onClick={() => setStep(1)}
               className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
          )}
          
          {step === 3 ? (
             <div className="flex justify-center mb-4">
               <div className="bg-green-500 rounded-full p-3">
                 <CheckCircle className="w-8 h-8 text-white" />
               </div>
             </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Get 3 Free Quotes</h2>
              <p className="text-blue-200 text-sm">Compare installers in {stateCode} and save up to 40%</p>
            </>
          )}
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto">
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Zip Code</label>
                  <input 
                    required 
                    type="text" 
                    pattern="[0-9]*" 
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" 
                    placeholder="e.g. 90210" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Electric Bill</label>
                  <select 
                    value={formData.bill}
                    onChange={(e) => handleChange('bill', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option>100 - $150</option>
                    <option>151 - $200</option>
                    <option>201 - $300</option>
                    <option>300+</option>
                  </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roof Shade</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => handleChange('shade', 'No Shade')}
                        className={`border rounded-lg p-3 text-sm font-medium transition-all ${
                          formData.shade === 'No Shade' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        No Shade
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleChange('shade', 'Some Shade')}
                        className={`border rounded-lg p-3 text-sm font-medium transition-all ${
                          formData.shade === 'Some Shade' 
                             ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                             : 'border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        Some Shade
                      </button>
                   </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <ShieldCheck className="w-4 h-4" /> No spam guarantee. Your data is secure.
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" 
                      placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" 
                    placeholder="john@example.com" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" 
                    placeholder="(555) 123-4567" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get My Free Quotes"}
              </button>
              
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-tight">
                By clicking "Get My Free Quotes", you authorize SolarYield US and its partners to contact you with quotes at the number provided.
              </p>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Request Received!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We have matched you with 3 top-rated installers in <strong>{stateCode}</strong>. They will reach out to you shortly with your custom savings report.
              </p>
              <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Back to Calculator
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {step < 3 && (
          <div className="bg-gray-100 dark:bg-gray-700 h-2 w-full shrink-0">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: step === 1 ? '50%' : '90%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};