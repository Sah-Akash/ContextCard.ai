import React from 'react';

export const SidebarAd: React.FC = () => {
  return (
    <div className="w-[300px] h-[600px] bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ad Label for Compliance */}
      <span className="absolute top-0 right-0 bg-slate-200 text-[10px] text-slate-500 px-2 py-0.5 rounded-bl">
        Advertisement
      </span>
      
      {/* Ad Placeholder Content */}
      <div className="text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h4 className="font-bold text-slate-700">Master Your Skills</h4>
        <p className="text-xs text-slate-500">
          Sign up for our advanced certification program today.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors w-full">
          Learn More
        </button>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none -z-10" />
    </div>
  );
};