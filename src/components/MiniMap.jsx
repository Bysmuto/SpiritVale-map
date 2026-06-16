import React, { useState } from 'react';

export default function MiniMap({ mapName }) {
  const [hasError, setHasError] = useState(false);

  // If the image fails to load, component returns null.
  if (hasError) return null;

  return (
    // w-full h-full guarantees it fills the parent container
    <div className="w-full h-full flex flex-col items-center font-sans leading-none">
      
      {/* 1. THE MAP IMAGE CONTAINER */}
      {/* Added flex-1 and w-full so it physically pushes the legend down and takes up all screen space */}
      <div className="w-full flex-1 flex justify-center items-center rounded-[24px] overflow-hidden bg-[#1c212e] border-0 shadow-none">
        <img 
          src={`/miniMaps/${mapName}.png`} 
          alt={`${mapName} Minimap`} 
          // object-contain + w-full + h-full = scales up as big as possible without warping
          className="w-full h-full object-contain"
          onError={() => setHasError(true)}
        />
      </div>

      {/* 2. THE LEGEND */}
      {/* Added mt-4 so it has some breathing room when the map gets huge */}
      <div className="flex gap-2 text-[7px] font-black text-white bg-[#1c212e] px-5 py-2.5 rounded-full uppercase tracking-widest select-none shadow-none border-0">
        
        {/* Legendary Point 1 */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#5fb4f6] rounded-full" />
          <span className="text-white">EXIT</span>
        </div>
        
        {/* Legendary Point 2 */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#eab308] rounded-full" />
          <span className="text-white">NPC</span>
        </div>
        
        {/* Legendary Point 3 */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#f31d48] rounded-full" />
          <span className="text-white">TP</span>
        </div>
      
      </div>

    </div>
  );
}