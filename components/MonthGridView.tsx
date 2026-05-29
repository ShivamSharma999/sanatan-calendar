'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { getDailyPanchang, type GeoLocation, type DailyPanchangResult } from 'panchang-ts';
import { 
  type SubLanguage, 
  TITHIS_MAP, 
  getMoonPhaseEmoji, 
  getPurnimantaMonthDisplay 
} from '../lib/panchang-helpers';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthGridViewProps {
  currentMonthYear: { month: number; year: number };
  customLocation: GeoLocation;
  selectedDate: Date;
  language: SubLanguage;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleDayClick: (date: Date) => void;
}

// Memory Cache for calculated Panchang days to guarantee instantly-rendered transitions
const PANCHANG_CACHE = new Map<string, DailyPanchangResult>();

export function MonthGridView({
  currentMonthYear,
  customLocation,
  selectedDate,
  language,
  handlePrevMonth,
  handleNextMonth,
  handleDayClick,
}: MonthGridViewProps) {

  // State to trigger local re-renders when async elements complete and are added to PANCHANG_CACHE
  const [computedPanchangs, setComputedPanchangs] = useState<Record<string, DailyPanchangResult>>({});

  // Prepare the layout structure immediately inside a pure memoized structure
  const initialElements = useMemo(() => {
    const { month, year } = currentMonthYear;
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const items: Array<{ dayNumber: number; date: Date; panchang: DailyPanchangResult | null } | null> = [];
    
    // Spaces for offset days
    for (let i = 0; i < firstDayIndex; i++) {
      items.push(null);
    }
    
    const timezoneOffset = -new Date().getTimezoneOffset();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const cacheKey = `${customLocation.latitude.toFixed(4)}_${customLocation.longitude.toFixed(4)}_${timezoneOffset}_${year}_${month}_${day}`;
      const cached = PANCHANG_CACHE.get(cacheKey) || computedPanchangs[cacheKey];
      
      items.push({
        dayNumber: day,
        date,
        panchang: cached || null
      });
    }
    
    return items;
  }, [currentMonthYear, customLocation, computedPanchangs]);

  // Derived loading state checks if any of the active days do not have cached Panchang data yet
  const isLoading = useMemo(() => {
    const { month, year } = currentMonthYear;
    const timezoneOffset = -new Date().getTimezoneOffset();
    
    return initialElements.some(item => {
      if (item === null) return false;
      const key = `${customLocation.latitude.toFixed(4)}_${customLocation.longitude.toFixed(4)}_${timezoneOffset}_${year}_${month}_${item.dayNumber}`;
      return !PANCHANG_CACHE.has(key);
    });
  }, [initialElements, currentMonthYear, customLocation]);

  useEffect(() => {
    const { month, year } = currentMonthYear;
    const timezoneOffset = -new Date().getTimezoneOffset();
    let active = true;

    const calculateAsync = async () => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const missingDays: Array<{ dayNumber: number; date: Date; key: string }> = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const cacheKey = `${customLocation.latitude.toFixed(4)}_${customLocation.longitude.toFixed(4)}_${timezoneOffset}_${year}_${month}_${day}`;
        if (!PANCHANG_CACHE.has(cacheKey)) {
          missingDays.push({
            dayNumber: day,
            date,
            key: cacheKey
          });
        }
      }

      if (missingDays.length > 0) {
        // Resolve uncached dates sequentially in micro-tasks to guarantee 0ms engine stutter
        for (let i = 0; i < missingDays.length; i++) {
          if (!active) break;
          const { date, key } = missingDays[i];
          
          await new Promise(resolve => setTimeout(resolve, 0));
          
          try {
            const pData = getDailyPanchang(
              date,
              customLocation,
              {
                timezone: timezoneOffset,
                masaSystem: 'purnimanta',
                computeEndTimes: false
              }
            );
            
            if (pData) {
              PANCHANG_CACHE.set(key, pData);
              
              if (active) {
                setComputedPanchangs(prev => ({
                  ...prev,
                  [key]: pData
                }));
              }
            }
          } catch (e) {
            // Squelch calculation overflows
          }
        }
      }
    };
    
    calculateAsync();

    return () => {
      active = false;
    };
  }, [currentMonthYear, customLocation]);

  return (
    <motion.div
      key="month-tab"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="bg-sacred-card border border-sacred-gold/15 rounded-2xl p-5 md:p-6 shadow-2xl font-sans"
      id="month-view-grid-panel"
    >
      {/* Grid Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <button
          id="month-grid-prev-btn"
          onClick={handlePrevMonth}
          className="bg-stone-900 border border-stone-800 hover:border-sacred-gold/40 hover:text-sacred-gold px-3.5 py-2 rounded-lg text-xs outline-none transition-all flex items-center gap-1 cursor-pointer font-sans"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'पूर्व मास' : 'Prev Month'}</span>
        </button>
        
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-lg md:text-2xl font-display font-medium text-sacred-gold tracking-widest filter drop-shadow">
            {getPurnimantaMonthDisplay(currentMonthYear.month, false, language)} {currentMonthYear.year}
          </h3>
          {isLoading && (
            <span className="text-[10px] text-amber-500 font-mono tracking-wider animate-pulse uppercase">
              • {language === 'hi' ? 'गणना जारी है...' : 'Calculating...'}
            </span>
          )}
        </div>

        <button
          id="month-grid-next-btn"
          onClick={handleNextMonth}
          className="bg-stone-900 border border-stone-800 hover:border-sacred-gold/40 hover:text-sacred-gold px-3.5 py-2 rounded-lg text-xs outline-none transition-all flex items-center gap-1 cursor-pointer font-sans"
        >
          <span>{language === 'hi' ? 'उत्तर मास' : 'Next Month'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Day Titles */}
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] md:text-xs uppercase tracking-wider font-display font-semibold text-neutral-400 mb-2">
        {language === 'hi'
          ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-2">
        {initialElements.map((item, idx) => {
          if (item === null) {
            return <div key={`spacer-${idx}`} className="bg-stone-900/10 min-h-[75px] md:min-h-[105px] border border-stone-950/15 rounded-xl" />;
          }

          const isToday = 
            item.date.getDate() === selectedDate.getDate() && 
            item.date.getMonth() === selectedDate.getMonth() && 
            item.date.getFullYear() === selectedDate.getFullYear();

          const tithiIndex = item.panchang?.tithis[0]?.index ?? 0;
          const tithiName = item.panchang ? (TITHIS_MAP[language][tithiIndex] || '') : '';
          const truncatedTithi = tithiName ? (tithiName.split(' ')[0] || '') : '';
          const paksha = item.panchang?.tithis[0]?.paksha || '';
          const hasFestival = item.panchang && item.panchang.festivals.length > 0;

          return (
            <div
              key={`day-${item.dayNumber}`}
              onClick={() => handleDayClick(item.date)}
              className={`min-h-[85px] md:min-h-[115px] border rounded-xl p-2 cursor-pointer flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                isToday 
                  ? 'bg-gradient-to-br from-sacred-orange/20 to-sacred-gold/15 border-sacred-gold shadow text-white font-sans' 
                  : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800 hover:border-sacred-gold/40 font-sans'
              }`}
            >
              {/* Day number & Moon Phase */}
              <div className="flex justify-between items-start">
                <span className={`text-xs md:text-sm font-mono font-bold ${isToday ? 'text-sacred-gold text-glow-gold' : 'text-neutral-300'}`}>
                  {item.dayNumber}
                </span>
                {item.panchang ? (
                  <span className="text-base select-none leading-none" title={truncatedTithi}>
                    {getMoonPhaseEmoji(tithiIndex)}
                  </span>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-stone-800 animate-spin border-t-amber-500 shrink-0" />
                )}
              </div>

              {/* Tithi Display */}
              <p className={`text-[9px] md:text-[10px] font-sans truncate font-medium mt-1 leading-normal ${
                paksha === 'Shukla' ? 'text-amber-300' : 'text-stone-400'
              }`}>
                {truncatedTithi || '...'}
              </p>

              {/* Festival notification highlight */}
              {hasFestival ? (
                <div className="flex items-center gap-1 mt-2 overflow-hidden bg-stone-950 border border-amber-950 rounded px-1 py-0.5 max-w-full">
                  <span className="text-[8px] animate-pulse">🚩</span>
                  <span className="text-[7.5px] md:text-[9px] truncate font-medium text-sacred-gold font-sans font-semibold">
                    {item.panchang?.festivals[0]?.name}
                  </span>
                </div>
              ) : (
                <div className="h-[14px]" /> // blank placeholder to keep alignment stable
              )}

              {/* Accent glow on selected */}
              {isToday && (
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-sacred-orange to-sacred-gold animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
