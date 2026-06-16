import React from 'react';

export default function UIPanel({ title, extraClasses, children }) {
  return (
    // Added bg-[#1e2433] right here so the body is always dark navy
    <div className={`absolute top-0 bottom-0 m-4 rounded-[32px] border-2 border-black bg-[#222A38] z-30 flex flex-col shadow-none transition-all ${extraClasses} overflow-hidden`}>
      
      {/* 2. THE BLACK HEADER (Edge-to-Edge) */}
      <div className="bg-[#202129] px-6 py-6 border-b-4 border-white/5 shrink-0 flex flex-col gap-2">
        <h2 className="text-2xl font-black tracking-wide  text-white leading-none">
          {title}
        </h2>
      </div>
      
      {/* 3. CONTENT CONTAINER */}
      <div className="p-6 pt-4 flex-1 text-white font-medium text-sm flex flex-col gap-2 overflow-y-auto overflow-hidden">
        {children}
      </div>
      
    </div>
  );
}