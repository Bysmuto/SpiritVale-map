import React, { useEffect } from 'react';
import UIPanel from '../components/UIPanel';

// 1. COZY MINIMALIST TOGGLE SWITCH
const ToggleSwitch = ({ label, isActive, onClick, activeBg = 'bg-[#5fb4f6]' }) => (
  <>
    <div 
      onClick={onClick}
      className="flex items-center justify-between w-full px-4 py-4 bg-[#1c212e] rounded-full cursor-pointer hover:bg-[#2a3143] transition-colors duration-200"
    >
      <span className={`text-[10px] font-bold tracking-wider uppercase ${isActive ? 'text-white' : 'text-[#afb4bb]'}`}>
        {label}
      </span>
      
      {/* SpiritVale Style Toggle */}
      <div 
        className={`relative flex items-center w-[54px] h-[26px] rounded-full p-1 transition-colors duration-200 ${
          isActive ? activeBg : 'bg-[#0f172a]'
        }`}
      >
        <span className={`absolute text-[10px] font-extrabold ${isActive ? 'right-2 text-white' : 'left-2 text-gray-400'}`}>
          {isActive ? 'ON' : 'OFF'}
        </span>
        
        <div 
          className={`w-[18px] h-[18px] bg-white rounded-[6px] shadow-sm transition-transform duration-200 z-10 ${
            isActive ? 'translate-x-0' : 'translate-x-[28px]'
          }`}
        />
      </div>
    </div>
  </>
);

// 2. MAIN COMPONENT
export default function FilterUI({ activeFilters, setFilter, displayMode, setDisplayMode }) {
  
  // URL -> STATE (Runs once when the page loads)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const displayParam = params.get('display');

    if (displayParam) {
      // 1. Reset everything first
      setDisplayMode('default');
      setFilter('boss', null);
      setFilter('classNpc', null);

      // 2. Turn on the specific filter matching the URL string
      if (displayParam === 'level') setDisplayMode('level');
      if (displayParam === 'elements') setDisplayMode('element');
      if (displayParam === 'bosses') setFilter('boss', true);
      if (displayParam === 'npcs') setFilter('classNpc', true);
    }
  }, []); // Empty array means this only runs once on initial load

  // STATE -> URL (Runs silently every time you click a toggle)
  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    
    // Figure out which filter is currently active
    let currentDisplay = null;
    if (displayMode === 'level') currentDisplay = 'level';
    if (displayMode === 'element') currentDisplay = 'elements';
    if (activeFilters.boss) currentDisplay = 'bosses';
    if (activeFilters.classNpc) currentDisplay = 'npcs';

    // Update or remove the ?display parameter
    if (currentDisplay) {
      newParams.set('display', currentDisplay);
    } else {
      newParams.delete('display');
    }

    // Rewrite the browser URL bar without refreshing the page
    const newUrl = newParams.toString() ? `?${newParams.toString()}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [displayMode, activeFilters]);

  // EXCLUSIVE TOGGLE LOGIC: Turns everything off, then turns the target on
  const handleToggle = (type) => {
    setDisplayMode('default');
    setFilter('boss', null);
    setFilter('classNpc', null);

    if (type === 'level' && displayMode !== 'level') setDisplayMode('level');
    if (type === 'element' && displayMode !== 'element') setDisplayMode('element');
    if (type === 'boss' && !activeFilters.boss) setFilter('boss', true);
    if (type === 'classNpc' && !activeFilters.classNpc) setFilter('classNpc', true);
  };

  return (
    <UIPanel title="Display" extraClasses="right-4 top-4 w-[16vw] bg-[#1e2433] text-white rounded-[24px] border-0 shadow-none">
      <div className="flex flex-col gap-3 mt-2">
        
        <ToggleSwitch 
          label="Map Level" 
          isActive={displayMode === 'level'} 
          onClick={() => handleToggle('level')} 
        />
        
        <ToggleSwitch 
          label="Elements" 
          isActive={displayMode === 'element'} 
          onClick={() => handleToggle('element')} 
        />
        
        <ToggleSwitch 
          label="Bosses" 
          isActive={activeFilters.boss} 
          onClick={() => handleToggle('boss')} 
        />
        
        <ToggleSwitch 
          label="Class NPCs" 
          isActive={activeFilters.classNpc} 
          onClick={() => handleToggle('classNpc')} 
        />

      </div>
    </UIPanel>
  );
}