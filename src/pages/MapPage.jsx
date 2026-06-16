import React from "react";
import MonsterBadge from '../components/MonsterBadge.jsx';

// 1. EXTRACTED COMPONENT: Bosses and NPCs
const SpecialTargetCard = ({ type, name, icon, color, url, folder }) => {
  // Format the name for the image file exactly like FilterPin does
  const fileName = `${name.replace(/\s+/g, '-').toLowerCase()}.png`;

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#1c212e] hover:bg-[#2a3143] p-3 rounded-[20px] flex items-center gap-3 transition-colors duration-200 border border-white/5 cursor-pointer w-full"
    >
      <div className="relative w-10 h-10 shrink-0">
        {/* Dynamic Image */}
        <img 
          src={`/${folder}/${fileName}`} 
          alt={name} 
          className="w-10 h-10 rounded-full border-2 bg-black object-contain shadow-sm"
          style={{ borderColor: color }}
          // Fallback to the hidden div below if the image fails to load
          onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} 
        />
        {/* Emoji Fallback (Hidden by default) */}
        <div 
          className="hidden w-10 h-10 rounded-full border-2 items-center justify-center text-xl shadow-sm"
          style={{ borderColor: color, backgroundColor: `${color}40` }} // 40 adds transparency to the fallback bg
        >
          {icon}
        </div>
      </div>
      <div className="overflow-hidden">
        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: color }}>
          {type}
        </p>
        <p className="text-white font-bold text-base truncate">{name}</p>
      </div>
    </a>
  );
};

// 2. MAIN MODAL COMPONENT
export default function MapModal({ mapData, monsterDict, onClose }) {
  if (!mapData) return null;

  const hasSpecials = mapData.BossMonster || mapData.ClassNpc;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1c212e]/90 p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#1e2433] rounded-[32px] shadow-none overflow-hidden flex flex-col max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-8 pb-6 border-b-4 border-white/5 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-wide">
              {mapData.DisplayName}
            </h2>
            {mapData.MonsterMinLevel !== 0 && (
              <span className="inline-block bg-[#eab308] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Lv. {mapData.MonsterMinLevel} - {mapData.MonsterMaxLevel}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="bg-[#1c212e] text-[#64748b] hover:bg-[#fa5c7c] hover:text-white w-10 h-10 rounded-full flex justify-center items-center transition-colors text-lg font-bold z-10"
          >
            ✕
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-8 overflow-y-auto custom-scrollbar text-white">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* LEFT COLUMN: Specials */}
            {hasSpecials && (
              <div className="flex flex-col w-full md:w-[260px] shrink-0">
                <h3 className="text-[12px] font-black text-[#64748b] uppercase tracking-widest mb-3 pl-2">
                  Notable Targets
                </h3>
                <div className="flex flex-col gap-3">
                  {mapData.BossMonster && (
                    <SpecialTargetCard 
                      type="Zone Boss" 
                      name={mapData.BossMonster} 
                      icon="💀" 
                      color="#fa5c7c"
                      folder="bosses" 
                      url={`https://spiritvale.info/monsters?search=${encodeURIComponent(mapData.BossMonster)}`} 
                    />
                  )}
                  {mapData.ClassNpc && (
                    <SpecialTargetCard 
                      type="Class NPC" 
                      name={mapData.ClassNpc} 
                      icon="🧙‍♂️" 
                      color="#3b82f6"
                      folder="class npcs" 
                      url="https://spiritvale.info/wiki/Classes" 
                    />
                  )}
                </div>
              </div>
            )}

            {/* RIGHT COLUMN: Resident Monsters */}
            <div className="flex-1 w-full">
              <h3 className="text-[12px] font-black text-[#64748b] uppercase tracking-widest mb-3 pl-2">
                Resident Monsters
              </h3>
              
              <div className={`grid gap-3 ${hasSpecials ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {mapData.MonsterPool?.map((mobName, i) => {
                  const mob = monsterDict[mobName];
                  return (
                    <MonsterBadge 
                      key={i}
                      name={mobName} 
                      level={mob?.Level} 
                      element={mob?.Element}
                      isHostile={mob?.IsHostile} 
                    />
                  );
                })}

                {(!mapData.MonsterPool || mapData.MonsterPool.length === 0) && (
                  <p className="text-sm text-[#64748b] font-bold italic pl-2 col-span-full">
                    No monsters in this zone.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}