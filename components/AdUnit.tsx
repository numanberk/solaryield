import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  format: 'leaderboard' | 'sidebar' | 'inline';
  className?: string;
  adSlotId?: string; // You will get this ID from the AdSense dashboard
}

export const AdUnit: React.FC<AdUnitProps> = ({ format, className = '', adSlotId }) => {
  const adInit = useRef(false);

  // If you provide an adSlotId, we render a real Google Ad.
  // If not, we render the placeholder (good for development/waiting for approval).
  
  useEffect(() => {
    if (adSlotId && !adInit.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInit.current = true;
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [adSlotId]);

  let dimensions = { width: 'w-full', height: 'h-24', style: { display: 'block' } }; // leaderboard
  
  if (format === 'sidebar') {
    dimensions = { width: 'w-full', height: 'h-[600px]', style: { display: 'block' } };
  } else if (format === 'inline') {
    dimensions = { width: 'w-full', height: 'h-[250px]', style: { display: 'block' } };
  }

  // DEVELOPMENT MODE: No AdSlotId provided
  if (!adSlotId) {
    let label = 'Ad Space (728x90)';
    if (format === 'sidebar') label = 'Ad Space (300x600)';
    if (format === 'inline') label = 'Ad Space (300x250)';

    return (
      <div className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium rounded-lg overflow-hidden ${dimensions.width} ${dimensions.height} ${className} transition-colors duration-200`}>
        <div className="text-center">
          <span className="block">{label}</span>
          <span className="text-xs opacity-50 block mt-1">Place AdSense Code Here</span>
        </div>
      </div>
    );
  }

  // PRODUCTION MODE: Real AdSense Unit
  return (
    <div className={`overflow-hidden ${className}`}>
      <ins className="adsbygoogle"
         style={dimensions.style}
         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your Publisher ID
         data-ad-slot={adSlotId}
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    </div>
  );
};