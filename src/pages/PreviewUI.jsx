import UIPanel from "../components/UIPanel.jsx";
import MiniMap from "../components/MiniMap.jsx";
import MonsterBadge from "../components/MonsterBadge.jsx";
export default function PreviewUI({ activeZone, monsterDict }) {
  const sortedMonsters = activeZone?.MonsterPool
    ? [...activeZone.MonsterPool].sort((a, b) => {
        const lvlA = monsterDict[a]?.Level || 0;
        const lvlB = monsterDict[b]?.Level || 0;
        return lvlA - lvlB;
      })
    : [];

  const zoneDrops = activeZone?.MonsterPool
    ? [
        ...new Set(
          activeZone.MonsterPool.flatMap(
            (mobName) => monsterDict[mobName]?.MaterialDrops?.map((drop) => drop.Id) || []
          )
        )
      ]
    : [];
return (
    <UIPanel
      title={
        activeZone ? (
          <div className="flex flex-col gap-2">
            <span>{activeZone.DisplayName}</span>
            
            {/* Level sits right below the name now */}
            {activeZone.MonsterMinLevel !== 0 && (
              <span className="w-fit bg-[#0c4baf] text-white text-[12px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                lvl : {activeZone.MonsterMinLevel} - {activeZone.MonsterMaxLevel}
              </span>
            )}
          </div>
        ) : (
          "Select a Zone"
        )
      }
      extraClasses="left-4 top-4 w-[22vw] bg-[#1e2433] text-white border-0 shadow-none rounded-[24px]"
    >
      {activeZone ? (
        <>
          <div className="">
            <MiniMap key={`preview-${activeZone.Slug}`} mapName={activeZone.DisplayName} />
          </div>

          <p className="text-[10px] font-black text-white/80 uppercase tracking-widest  ml-1">
            Monsters :
          </p>

          <ul className="flex overflow-hidden flex-col gap-1">
            {sortedMonsters.map((mobName, i) => {
              const mobDetails = monsterDict[mobName];

              return (
                <li key={i}>
                  <MonsterBadge
                    name={mobName}
                    level={mobDetails?.Level}
                    element={mobDetails?.Element}
                    mini={true}
                    isHostile={mobDetails?.IsHostile}
                  />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-[#64748b] font-bold text-xs uppercase tracking-wider text-center">
            Hover over any zone
            <br />
            to view details
          </p>
        </div>
      )}
    </UIPanel>
  );
}
