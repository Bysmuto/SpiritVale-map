import React, { useState,useEffect } from "react";
import mapImage from "./assets/map.png";
import mapSidesBg from "./assets/4k map.png";
import mapTiles from "./data/maps.json";
import monstersData from "./data/monsters.json";
import PreviewUI from "./pages/PreviewUI.jsx";
import FilterUI from "./pages/FilterUI.jsx";
import MapTile from "./pages/MapTile.jsx";
import MapPage from "./pages/MapPage.jsx";
import FilterPin from "./components/FilterPin.jsx";
// 1. INSTANT LOOKUPS (Runs once, 0 lag)
const monsterDict = {};
monstersData.forEach(mob => { monsterDict[mob.DisplayName] = mob; });

const mapDict = {};
mapTiles.forEach(map => { mapDict[map.DisplayName] = map; });



export default function GameMap() {
  const GRID_W = 5.1;
  const GRID_H = 9;
  const TILE_SIZE = 98;

const [activeZone, setActiveZone] = useState(null); // Existing hover state
  const [selectedMap, setSelectedMap] = useState(null); // NEW: The clicked map
const [displayMode, setDisplayMode] = useState('default');
  // 1. On load, check if the URL has a map in it (e.g., ?zone=mud-village)
useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlZone = params.get('zone');
    
    if (urlZone) {
      // We search the raw array for the Slug instead of using the DisplayName dictionary
      const foundMap = mapTiles.find(m => m.Slug === urlZone);
      if (foundMap) {
        setSelectedMap(foundMap);
      }
    }
  }, []);

  const getDominantElement = (monsterPool) => {
    if (!monsterPool || monsterPool.length === 0) return null;
    const counts = {};
    let maxEl = null;
    let maxCount = 0;
    
    monsterPool.forEach(mob => {
      const el = monsterDict[mob]?.Element;
      if (el && el !== "None") {
        counts[el] = (counts[el] || 0) + 1;
        if (counts[el] > maxCount) {
          maxCount = counts[el];
          maxEl = el;
        }
      }
    });
    return maxEl;
  };

  // 2. Open map & update URL
  const handleMapClick = (tile) => {
    setSelectedMap(tile);
    const url = new URL(window.location);
    url.searchParams.set('zone', tile.Slug);
    window.history.pushState({}, '', url);
  };

  // 3. Close map & clear URL
  const closeMapModal = () => {
    setSelectedMap(null);
    const url = new URL(window.location);
    url.searchParams.delete('zone');
    window.history.pushState({}, '', url);
  };  
  // SCALABLE FILTERS
  const [activeFilters, setActiveFilters] = useState({
    element: null,
    level: null,
    boss: null,
    classNpc: null
  });

  const setFilter = (category, value) => {
    setActiveFilters(prev => ({ ...prev, [category]: value }));
  };

  const getTileHighlightStatus = (tile) => {
    const isFiltering = Object.values(activeFilters).some(val => val !== null);
    if (!isFiltering) return 'normal';

    if (activeFilters.element) {
      const hasElement = tile.MonsterPool?.some(mobName => monsterDict[mobName]?.Element === activeFilters.element);
      if (!hasElement) return 'dimmed'; 
    }

    if (activeFilters.level) {
      const { min, max } = activeFilters.level;
      const overlaps = tile.MonsterMinLevel <= max && tile.MonsterMaxLevel >= min;
      if (tile.MonsterMinLevel === 0 || !overlaps) return 'dimmed';
    }

    if (activeFilters.boss && !tile.BossMonster) return 'dimmed';
    if (activeFilters.classNpc && (!tile.ClassNpc || tile.ClassNpc === "")) return 'dimmed';

    return 'highlighted'; 
  };

  return (
    <div className="relative w-screen h-screen bg-black flex justify-center items-center overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110 blur-xs pointer-events-none z-0"
        style={{ backgroundImage: `url(${mapSidesBg})` }}
      />

      <PreviewUI activeZone={activeZone} monsterDict={monsterDict} />
      <FilterUI activeFilters={activeFilters} setFilter={setFilter} displayMode={displayMode} 
        setDisplayMode={setDisplayMode}/>
      
      <div 
        className="relative w-full aspect-video z-10"
        style={{ maxHeight: '100vh', maxWidth: 'calc(100vh * (16 / 9))' }}
      >
        <img src={mapImage} alt="World Map" className="w-full h-full pointer-events-none" />
        
{/* LAYER 1: THE BASE MAP TILES */}
      <div className="absolute inset-0 w-full h-full z-10">
        {mapTiles.map((tile) => {
          const uniqueId = `${tile.Slug}-${tile.grid.row}-${tile.grid.collum}`;
          return (
            <MapTile 
              key={uniqueId} 
              tile={tile} 
              mapDict={mapDict}
              config={{ gridW: GRID_W, gridH: GRID_H, tileSize: TILE_SIZE }}
              isActive={activeZone?.grid.row === tile.grid.row && activeZone?.grid.collum === tile.grid.collum}
              onHover={() => setActiveZone(tile)}
              onLeave={() => setActiveZone(null)}
              onClick={() => handleMapClick(tile)}
            />
          );
        })}
      </div>

      {/* LAYER 2: THE FILTER PIN OVERLAY */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-50">
        {mapTiles.map((tile) => {
          const activePins = [];

          // 1. Check Display Modes (Level / Element)
          if (tile.MonsterMinLevel !== 0) {
            if (displayMode === 'level') {
              const avgLevel = Math.round((tile.MonsterMinLevel + tile.MonsterMaxLevel) / 2);
              activePins.push({ type: 'level', text: `Lv. ${avgLevel}` });
            } else if (displayMode === 'element') {
              const domElement = getDominantElement(tile.MonsterPool);
              if (domElement) activePins.push({ type: 'element', text: domElement });
            }
          }

          // 2. Check Special Filters (Bosses / NPCs)
          if (activeFilters.boss && tile.BossMonster) {
            activePins.push({ type: 'boss', text: tile.BossMonster });
          }
          if (activeFilters.classNpc && tile.ClassNpc) {
            activePins.push({ type: 'npc', text: tile.ClassNpc });
          }

          // 3. Render the Pin component only if there are active pins
          if (activePins.length === 0) return null;

          return (
            <FilterPin 
              key={`pin-${tile.Slug}-${tile.grid.row}-${tile.grid.collum}`} 
              tile={tile} 
              config={{ gridW: GRID_W, gridH: GRID_H }}
              activePins={activePins}
            />
          );
        })}
      </div>

      </div>
{/* Add this right before the final closing </div> of GameMap */}
      <MapPage
        mapData={selectedMap} 
        monsterDict={monsterDict} 
        onClose={closeMapModal} 
      />
    </div>
  );
}