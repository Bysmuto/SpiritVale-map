import React from "react";

const ConnectionArrows = ({ connections, mapDict, row, col }) => {
  if (!connections || connections.length === 0) return null;

  const accentColor = "#1f53a7"; // Vivid Blue

  return (
    // 1. z-0 forces the arrow strictly to the bottom of the stack, behind your z-50 pins.
    // 2. The CSS drop-shadows stack to create a flawless, uniform white outline around everything inside.
    <div 
      className="absolute inset-0 pointer-events-none z-50"
      style={{ 
        filter: 'drop-shadow(1px 1px 1px white) drop-shadow(-1px -1px 1px white) drop-shadow(0px 0px 2px white)' 
      }}
    >
      <svg className="absolute top-0 left-0 w-full h-full overflow-visible">
        <defs>
          {/* Just ONE marker. The CSS drop-shadow handles the outline automatically */}
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto" overflow="visible">
            <path
              d="M 1 1 L 7 5 L 1 9"
              fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {/* Base Circle */}
        <circle cx="50%" cy="50%" r="5" fill="#1c212e" stroke={accentColor} strokeWidth="3" />

        {connections.map((targetName) => {
          const target = mapDict[targetName];
          if (!target) return null;

          const dRow = target.grid.row - row;
          const dCol = target.grid.collum - col;

          return (
            <line
              key={targetName}
              x1="50%"
              y1="50%"
              x2={`${50 + dCol * 100}%`}
              y2={`${50 + dRow * 100}%`}
              stroke={accentColor}
              strokeWidth="4"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
      </svg>
    </div>
  );
};




export default function MapTile({ tile, mapDict, config, isActive, onHover, onLeave, onClick }) {
  const {
    DisplayName: name,
    MonsterMinLevel: minLevel,
    MonsterMaxLevel: maxLevel,
    waypoint: isWaypoint,
    Connections: connections
  } = tile;
  const { row, collum: col, nudgeX = 0, nudgeY = 0 } = tile.grid;
  const { gridW, gridH, tileSize } = config;

  const calculatedTop = 2.8 + (row - 1) * gridH + nudgeY;
  const calculatedLeft = 26.0 + (col - 1) * gridW + nudgeX;

const formattedName = name ? name.replace(/ (\d+)$/, '\u00A0$1') : "";

  return (
    <div
      className="absolute flex justify-center items-center cursor-pointer group z-10 hover:z-30"
      style={{
        top: `${calculatedTop}%`,
        left: `${calculatedLeft}%`,
        width: `${gridW}%`,
        height: `${gridH}%`
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div
        // Note: Make sure overflow-hidden isn't aggressively chopping the sides of your text off!
        className={`flex flex-col justify-end items-center overflow-hidden transition-all rounded-sm p-1 border border-blue-950/50 bg-black/10 group-hover:bg-white/40 group-hover:scale-110 ${isActive ? "ring-2 ring-white/30" : ""}`}
        style={{ width: `${tileSize}%`, height: `${tileSize}%` }}
      >
        <span
          className="text-white/95 [text-shadow:-1px_2px_4px_rgba(0,0,0,1)] font-bold text-[8.6px] leading-[1.1] text-center select-none  "
     
        >
          {formattedName}
        </span>
        
        {minLevel !== 0 && (
          <span
            className="text-white/80 text-[7px] font-bold antialiased tracking-wide mt-0.5"
           
          >
            Lv.{minLevel}-{maxLevel}
          </span>
        )}

        {isWaypoint && (
          <img 
            src="/imgs/crystal.png" 
            alt="Waypoint" 
            className="absolute top-1 left-1 w-3.5 h-3.5 object-contain drop-shadow-[0_0_4px_rgba(95,180,246,0.8)]" 
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
      </div>
      
      {isActive && (
        <ConnectionArrows connections={connections} mapDict={mapDict} row={row} col={col} />
      )}
    </div>
  );
}
