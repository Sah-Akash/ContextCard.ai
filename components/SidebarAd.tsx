import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const SidebarAd: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double-injection in React Strict Mode
    if (initialized.current) return;
    initialized.current = true;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense failed to load", e);
    }
  }, []);

  return (
    <div className="w-[300px] h-[600px] bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Ad Label for Policy Compliance */}
      <span className="absolute top-0 right-0 bg-slate-200 text-[10px] text-slate-500 px-2 py-0.5 rounded-bl z-10">
        Advertisement
      </span>

      {/* Actual AdSense Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '300px', height: '600px' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: REPLACE THIS
        data-ad-slot="1234567890"               // TODO: REPLACE THIS
      ></ins>

    </div>
  );
};