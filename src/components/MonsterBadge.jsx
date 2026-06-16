import React from 'react';

// 1. THE DATA
const ELEMENT_DATA = [
  { "element": "Neutral", "icon": "element-neutral", "color": "#E5DDC9", "strong": [], "weak": ["Poison (75%)", "Shadow (75%)"] },
  { "element": "Earth", "icon": "element-earth", "color": "#D48A36", "strong": ["Wind (125%)"], "weak": ["Earth (50%)", "Fire (75%)"] },
  { "element": "Fire", "icon": "element-fire", "color": "#FF6420", "strong": ["Earth (125%)"], "weak": ["Fire (50%)", "Water (75%)"] },
  { "element": "Water", "icon": "element-water", "color": "#10CFF6", "strong": ["Fire (125%)"], "weak": ["Water (50%)", "Wind (75%)"] },
  { "element": "Wind", "icon": "element-wind", "color": "#FAD500", "strong": ["Water (125%)"], "weak": ["Earth (75%)", "Wind (50%)"] },
  { "element": "Poison", "icon": "element-poison", "color": "#7AD479", "strong": ["Neutral (125%)"], "weak": ["Poison (50%)", "Undead (75%)"] },
  { "element": "Shadow", "icon": "element-shadow", "color": "#8B6CB1", "strong": ["Neutral (125%)", "Holy (125%)"], "weak": ["Shadow (50%)"] },
  { "element": "Holy", "icon": "element-holy", "color": "#F48EBC", "strong": ["Shadow (125%)", "Undead (125%)"], "weak": ["Holy (50%)"] },
  { "element": "Undead", "icon": "element-undead", "color": "#4A4A4A", "strong": ["Poison (125%)"], "weak": ["Holy (75%)", "Undead (50%)"] }
];

// 2. THE LEVEL BADGE
export function LevelBadge({ level }) {
  return (
    <span className="bg-[#0c4baf] text-white text-[9px] font-black uppercase px-2 py-1 rounded-full leading-none shadow-sm border border-white/10 shrink-0">
      Lv. {level || '?'}
    </span>
  );
}

// 3. THE ELEMENT BADGE
export function ElementBadge({ name, mini = false }) {
  const data = ELEMENT_DATA.find(e => e.element === name) || ELEMENT_DATA[0];
  const isLightColor = name === "Neutral" || name === "Wind" || name === "Poison";

  return (
    <span 
      className={`inline-flex items-center justify-center rounded-full font-black uppercase tracking-wider select-none cursor-help shadow-sm border border-white/10 shrink-0 ${mini ? 'w-5 h-5' : 'px-2.5 py-0.5 gap-1'}`}
      style={{ 
        backgroundColor: data.color, 
        color: isLightColor ? '#1c212e' : '#ffffff' 
      }}
      title={`Strong vs: ${data.strong.length ? data.strong.join(', ') : 'None'} \nWeak vs: ${data.weak.length ? data.weak.join(', ') : 'None'}`}
    >
      {/* FIXED PATH: changed 'elements' to 'elemts' to match your folder */}
      <img 
        src={`/elements/${data.icon}.webp`} 
        alt={data.element} 
        className={`${mini ? 'w-3.5 h-3.5' : 'w-3 h-3'} object-contain`}
        onError={(e) => e.target.style.display = 'none'} 
      />
      {!mini && <span className="text-[9px]">{data.element}</span>}
    </span>
  );
}

// 4. THE MAIN MONSTER BADGE
export default function MonsterBadge({ name, level, element, mini, isHostile }) {
  return (
    <a
      href={`https://spiritvale.info/monsters?search=${encodeURIComponent(name)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-[#1c212e] hover:bg-[#2a3143] py-1.5 pl-1.5 pr-2 rounded-full transition-colors duration-200 border border-white/5 w-full"
    >
      <div className="flex items-center gap-2">
        <LevelBadge level={level} />
        
        {/* Turns red if the mob wants the smoke */}
        <span className={`text-[11px] font-black tracking-wide truncate ${isHostile === 1 ? 'text-[#fa5c7c]' : 'text-white'}`}>
          {name}
        </span>
      </div>

      {element && element !== "None" && (
        <ElementBadge name={element} mini={mini} />
      )}
    </a>
  );
}