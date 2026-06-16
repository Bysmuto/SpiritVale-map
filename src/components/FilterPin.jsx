import React from 'react';

// 1. DYNAMIC ELEMENT COLORS
const ELEMENT_COLORS = {
  "Neutral": "#E5DDC9",
  "Earth": "#D48A36",
  "Fire": "#FF6420",
  "Water": "#10CFF6",
  "Wind": "#FAD500",
  "Poison": "#7AD479",
  "Shadow": "#8B6CB1",
  "Holy": "#F48EBC",
  "Undead": "#4A4A4A"
};

// 2. CENTRALIZED STYLES
// FIXED: Folder is now 'elements'.
// Removed hardcoded green tailwind classes from 'element' so we can inject the dynamic hex colors below.
const BADGE_STYLES = {
  boss: { border: 'border-red-500', shadow: 'shadow-[0_0_15px_red]', bg: 'bg-red-900/90', icon: '💀', folder: 'bosses', ext: '.png' },
  npc: { border: 'border-blue-400', shadow: 'shadow-[0_0_15px_blue]', bg: 'bg-blue-900/90', icon: '🧙‍♂️', folder: 'class npcs', ext: '.png' },
  level: { border: 'border-white', shadow: 'shadow-[0_0_15px_yellow]', bg: 'bg-blue-900/90' },
  element: { border: '', shadow: '', bg: '', icon: '✨', folder: 'elements', prefix: 'element-', ext: '.webp' }
};

export default function FilterPin({ tile, config, activePins }) {
  if (!activePins || activePins.length === 0) return null;

  const { row, collum: col, nudgeX = 0, nudgeY = 0 } = tile.grid;
  const { gridW, gridH } = config;

  // Grid Math (Matches MapTile exactly)
  const calculatedTop = 2.8 + ((row - 1) * gridH) + nudgeY;
  const calculatedLeft = 26.0 + ((col - 1) * gridW) + nudgeX;

  return (
    <div
      className="absolute flex justify-center items-end pointer-events-none z-20"
      style={{ top: `${calculatedTop}%`, left: `${calculatedLeft}%`, width: `${gridW}%`, height: `${gridH}%` }}
    >
      <div className="absolute  flex flex-row gap-2 items-end ">
        
        {activePins.map((pin, idx) => {
          const style = BADGE_STYLES[pin.type];

          // --- TEXT PINS (Level Only) ---
          if (pin.type === 'level') {
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex items-center justify-center px-2 py-2 min-w-[32px] min-h-[32px] rounded-full border-2 bg-black/90 z-10 ${style.border} ${style.shadow}`}>
                  <span className="text-[12px] font-bold text-white whitespace-nowrap">
                    {pin.text}
                  </span>
                </div>
                <div className={`w-1 h-3 border-l border-r -mt-1 ${style.border} ${style.bg}`} />
              </div>
            );
          }

          // --- IMAGE PINS (Boss, NPC, & Element) ---
          const fileName = `${style.prefix || ''}${pin.text.replace(/\s+/g, '-').toLowerCase()}${style.ext || '.png'}`;
          
          // Logic to grab the specific hex color if it's an element pin
          const isElement = pin.type === 'element';
          const elColor = isElement ? (ELEMENT_COLORS[pin.text] || '#ffffff') : null;
          
          return (
            <div key={idx} className="flex flex-col items-center">
              <img 
                src={`/${style.folder}/${fileName}`} 
                alt={pin.text} 
                className={`w-10 h-10 rounded-full border-2 bg-black object-contain ${style.border} ${style.shadow}`} 
                // Injects dynamic color for Element pins only (80 at the end adds 50% opacity to the glow)
                style={isElement ? { borderColor: elColor, boxShadow: `0 0 12px ${elColor}80` } : {}}
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} 
              />
              <div 
                className={`hidden w-8 h-8 rounded-full border-2 bg-black/80 items-center justify-center text-sm ${style.border} ${style.shadow}`}
                style={isElement ? { borderColor: elColor, boxShadow: `0 0 12px ${elColor}80` } : {}}
              >
                {style.icon}
              </div>
              <span 
                className={`text-[8px] font-bold px-1 rounded-sm mt-1 whitespace-nowrap shadow-md uppercase border ${style.bg} ${style.border} ${isElement ? 'bg-[#1c212e]' : 'text-white'}`}
                // Matches the text and border to the specific element color
                style={isElement ? { borderColor: elColor, color: elColor } : {}}
              >
                {pin.text}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}