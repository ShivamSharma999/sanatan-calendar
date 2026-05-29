// app/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getDailyPanchang, 
  getFestivalsInRange, 
  computePlanetaryPositions,
  type DailyPanchangResult,
  type GeoLocation,
  type FestivalDay,
  type PlanetaryPositions
} from 'panchang-ts';
import { 
  LANG_LABELS, 
  type SubLanguage 
} from '../lib/panchang-helpers';
import { 
  Compass, 
  MapPin, 
  Calendar as CalendarIcon, 
  Globe, 
  Info,
  Sun,
  Moon
} from 'lucide-react';

// Import our newly modularized components
import { DailyPanchangView } from '../components/DailyPanchangView';
import { MonthGridView } from '../components/MonthGridView';
import { UpcomingFestivalsView } from '../components/UpcomingFestivalsView';
import { MuhurtasView } from '../components/MuhurtasView';
import { PlanetaryPositionsView } from '../components/PlanetaryPositionsView';
import { VedicClock } from '../components/VedicClock';

const DEFAULT_LOCATION: GeoLocation & { name: string } = {
  latitude: 23.1760,
  longitude: 75.7885,
  elevation: 510,
  name: 'Ujjain, MP (Avantika / अवंतिका)'
};

export default function SanatanCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    return new Date();
  });
  
  const [customLocation, setCustomLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [locationName, setLocationName] = useState<string>(DEFAULT_LOCATION.name);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'searching' | 'success' | 'error'>('idle');
  const [language, setLanguage] = useState<SubLanguage>('hi');
  const [activeTab, setActiveTab] = useState<'daily' | 'month' | 'festivals' | 'muhurta' | 'graha'>('daily');
  
  // Theme state for Dark Mode support
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return false; // light-mode default to respect editorial layout first
    }
    return false;
  });

  // States for month view navigation
  const [currentMonthYear, setCurrentMonthYear] = useState<{ month: number; year: number }>(() => {
    const today = new Date();
    return { month: today.getMonth(), year: today.getFullYear() };
  });

  // Apply dark class to html document node
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Multilingual labels shortcut
  const t = useMemo(() => LANG_LABELS[language], [language]);

  // Request user geolocation
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }
    setGpsStatus('searching');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          elevation: 0
        };
        setCustomLocation(coords);
        setLocationName(`${t.detectionActive} (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`);
        setGpsStatus('success');
      },
      (err) => {
        console.error(err);
        setGpsStatus('error');
      },
      { timeout: 6000 }
    );
  };

  // Run auto GPS request on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            elevation: 0
          };
          setCustomLocation(coords);
          setLocationName(`GPS Detected (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`);
          setGpsStatus('success');
        },
        () => {
          setGpsStatus('idle');
        },
        { timeout: 4000 }
      );
    }
  }, []);

  // Compute daily panchang results with end times enabled for focus day
  const dailyPanchang = useMemo<DailyPanchangResult | null>(() => {
    try {
      return getDailyPanchang(
        selectedDate,
        customLocation,
        {
          timezone: -selectedDate.getTimezoneOffset(), // correct browser timezone offset in minutes
          masaSystem: 'purnimanta',
          computeEndTimes: true,
          language: language === 'sa' ? 'hi' : language // fallback inside library to hi if sa
        }
      );
    } catch (e) {
      console.error("Failed calculating daily panchang", e);
      return null;
    }
  }, [selectedDate, customLocation, language]);

  // Compute planetary positions for the active day - ONLY calculated when graha tab is active! (High Performance)
  const planets = useMemo<PlanetaryPositions | null>(() => {
    if (activeTab !== 'graha') return null;
    try {
      return computePlanetaryPositions(
        selectedDate,
        'lahiri'
      );
    } catch (e) {
      console.error("Failed calculating planetary positions", e);
      return null;
    }
  }, [selectedDate, activeTab]);

  // Upcoming festivals range (45 days) - ONLY calculated when festivals tab is active! (High Performance)
  const upcomingFestivals = useMemo<FestivalDay[]>(() => {
    if (activeTab !== 'festivals') return [];
    try {
      const endRange = new Date(selectedDate);
      endRange.setDate(endRange.getDate() + 45);
      return getFestivalsInRange(
        selectedDate,
        endRange,
        customLocation,
        { timezone: -selectedDate.getTimezoneOffset() }
      );
    } catch (e) {
      console.error("Failed calculating festivals in range", e);
      return [];
    }
  }, [selectedDate, customLocation, activeTab]);

  // Navigation handlers for monthly calendar
  const handlePrevMonth = () => {
    setCurrentMonthYear(prev => {
      let m = prev.month - 1;
      let y = prev.year;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
      return { month: m, year: y };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthYear(prev => {
      let m = prev.month + 1;
      let y = prev.year;
      if (m > 11) {
        m = 0;
        y += 1;
      }
      return { month: m, year: y };
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setActiveTab('daily');
  };

  // Convert Ayanamsa value to Degrees, Minutes, Seconds (DMS) representation for neatness
  const formattedAyanamsa = useMemo(() => {
    if (!dailyPanchang) return '';
    const d = dailyPanchang.ayanamsa;
    const deg = Math.floor(d);
    const minFloat = (d - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    return `${deg}° ${min}' ${sec}" (Lahiri)`;
  }, [dailyPanchang]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative overflow-hidden" id="sanatan-root-app">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-orange-600/5 dark:bg-orange-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-amber-500/5 dark:bg-amber-400/10 blur-[120px] pointer-events-none" />

      {/* Floating Theme Switcher */}
      <div className="absolute right-4 top-4 z-20">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 md:p-2.5 rounded-xl border border-sacred-gold/30 bg-sacred-card hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer shadow-md select-none flex items-center gap-1.5 text-xs text-sacred-gold font-semibold font-sans backdrop-blur-md"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#78350f]" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Header and Branding */}
      <header className="text-center mb-10 relative z-10 font-sans" id="sanatan-header">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-block mb-3"
        >
          <div className="relative p-2 rounded-full border-2 border-sacred-gold/40 animate-spin-slow bg-stone-900/40 shadow-lg shadow-sacred-gold/10">
            <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] px-2">🕉️</span>
          </div>
        </motion.div>
        <span className="block max-w-sm mx-auto h-[1px] bg-gradient-to-r from-transparent via-sacred-gold to-transparent my-1" />
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-wider text-sacred-gold text-glow-gold uppercase">
          {t.title}
        </h1>
        <p className="font-sans text-xs md:text-sm tracking-widest text-orange-400 font-medium px-4 mt-2">
          {t.subtitle} 🚩 ✨
        </p>
        <span className="block max-w-lg mx-auto h-[1px] bg-gradient-to-r from-transparent via-sacred-gold to-transparent my-2" />
      </header>

      {/* Inputs and Controls Card */}
      <section className="bg-sacred-card/80 border border-sacred-gold/20 rounded-2xl p-5 md:p-6 mb-8 backdrop-blur-md relative z-10 shadow-xl glow-border font-sans" id="sanatan-controls">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Calendar Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-wider text-neutral-400 font-medium flex items-center gap-1.5 uppercase font-display">
              <CalendarIcon className="w-3.5 h-3.5 text-sacred-gold" /> {t.selectDate}
            </label>
            <div className="relative">
              <input 
                type="date"
                id="selected-date-picker"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    const parsed = new Date(e.target.value);
                    setSelectedDate(parsed);
                    setCurrentMonthYear({ month: parsed.getMonth(), year: parsed.getFullYear() });
                  }
                }}
                className="w-full bg-stone-900 border border-sacred-gold/30 rounded-lg px-3.5 py-2.5 text-sm outline-none text-white focus:border-sacred-orange transition-colors font-sans"
                title="Select Gregorian calendar date to compute"
              />
            </div>
            <div className="flex gap-2">
              <button 
                id="preset-prev-day"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d);
                  setCurrentMonthYear({ month: d.getMonth(), year: d.getFullYear() });
                }}
                className="flex-1 text-center bg-stone-900 border border-stone-800 rounded py-1 text-xs hover:border-sacred-gold/30 hover:text-sacred-gold transition-colors text-stone-400 font-sans cursor-pointer"
              >
                ◀ {language === 'hi' ? 'पिछला दिन' : language === 'sa' ? 'पूर्वदिवसः' : 'Prev Day'}
              </button>
              <button
                id="preset-today"
                onClick={() => {
                  const d = new Date();
                  setSelectedDate(d);
                  setCurrentMonthYear({ month: d.getMonth(), year: d.getFullYear() });
                }}
                className="flex-1 text-center bg-sacred-gold/10 border border-sacred-gold/40 rounded py-1 text-xs hover:bg-sacred-gold/20 hover:text-white transition-colors text-sacred-gold font-medium font-sans cursor-pointer"
              >
                {language === 'hi' ? 'आज' : language === 'sa' ? 'अद्य' : 'Today'}
              </button>
              <button
                id="preset-next-day"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d);
                  setCurrentMonthYear({ month: d.getMonth(), year: d.getFullYear() });
                }}
                className="flex-1 text-center bg-stone-900 border border-stone-800 rounded py-1 text-xs hover:border-sacred-gold/30 hover:text-sacred-gold transition-colors text-stone-400 font-sans cursor-pointer"
              >
                {language === 'hi' ? 'अगला दिन' : language === 'sa' ? 'परदिवसः' : 'Next Day'} ▶
              </button>
            </div>
          </div>

          {/* Location Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-wider text-neutral-400 font-medium flex items-center gap-1.5 uppercase font-display">
              <MapPin className="w-3.5 h-3.5 text-sacred-gold" /> {t.location}
            </label>
            <div className="bg-stone-900 border border-sacred-gold/20 rounded-lg px-3.5 py-2 flex items-center justify-between text-xs font-sans">
              <span className="text-stone-300 font-medium truncate max-w-[170px]" title={locationName}>
                {locationName}
              </span>
              <span className="text-[10px] bg-sacred-gold/10 text-sacred-gold border border-sacred-gold/20 rounded px-1.5 py-0.5 select-none font-sans font-semibold">
                510m
              </span>
            </div>
            <button
              id="gps-trigger-button"
              onClick={requestLocation}
              disabled={gpsStatus === 'searching'}
              className="w-full bg-stone-900 border border-sacred-gold/30 hover:border-sacred-gold hover:bg-stone-800 rounded-lg py-2 text-xs flex items-center justify-center gap-1.5 transition-all outline-none font-sans cursor-pointer"
            >
              <Compass className={`w-3.5 h-3.5 text-sacred-orange ${gpsStatus === 'searching' ? 'animate-spin' : ''}`} />
              <span className="text-stone-200 font-medium">
                {gpsStatus === 'searching' ? t.searchingLocation : t.requestLocation}
              </span>
            </button>
          </div>

          {/* Multilingual Switch */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-wider text-neutral-400 font-medium flex items-center gap-1.5 uppercase font-display">
              <Globe className="w-3.5 h-3.5 text-sacred-gold" /> Language / भाषा / भाषा
            </label>
            <div className="grid grid-cols-3 gap-1 bg-stone-900 p-1.5 rounded-lg border border-sacred-gold/25 font-sans" id="language-tab-picker">
              <button 
                id="lang-btn-hi"
                onClick={() => setLanguage('hi')}
                className={`py-2 text-xs rounded font-medium transition-all outline-none cursor-pointer ${
                  language === 'hi' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold drop-shadow-md' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                हिन्दी 🕉️
              </button>
              <button 
                id="lang-btn-sa"
                onClick={() => setLanguage('sa')}
                className={`py-2 text-xs rounded font-medium transition-all outline-none cursor-pointer ${
                  language === 'sa' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold drop-shadow-md' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sanskrit संस्कृतम् ⚜️
              </button>
              <button 
                id="lang-btn-en"
                onClick={() => setLanguage('en')}
                className={`py-2 text-xs rounded font-medium transition-all outline-none cursor-pointer ${
                  language === 'en' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold drop-shadow-md' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                English 🌍
              </button>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 font-sans">
              <Info className="w-3 h-3 text-sacred-gold" />
              <span>{t.purnimantaActive}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Tabs Navigation */}
      <nav className="flex flex-wrap gap-2 mb-8 justify-center z-10 relative font-sans" id="app-navigation-tabs">
        {[
          { key: 'daily', icon: '🕉️', name: language === 'hi' ? 'दैनिक पञ्चांग' : language === 'sa' ? 'दैनिकपञ्चाङ्गम्' : 'Daily Panchang' },
          { key: 'month', icon: '📅', name: language === 'hi' ? 'मास फल (ग्रिड)' : language === 'sa' ? 'मासिककोशः' : 'Month Grid' },
          { key: 'festivals', icon: '🔔', name: language === 'hi' ? 'पर्व एवं त्योहार' : language === 'sa' ? 'उत्सवाः' : 'Festivals' },
          { key: 'muhurta', icon: '⏱️', name: language === 'hi' ? 'शुभ-अशुभ मुहूर्त' : language === 'sa' ? 'शुभाशुभमुहूर्तः' : 'Muhurtas' },
          { key: 'graha', icon: '🌌', name: language === 'hi' ? 'ग्रह स्पष्ट' : language === 'sa' ? 'ग्रहस्पष्टम्' : 'Graha Spashta' }
        ].map((tab) => (
          <button
            key={tab.key}
            id={`tab-navigation-${tab.key}`}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-3 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 outline-none ${
              activeTab === tab.key 
                ? 'bg-gradient-to-r from-orange-600 to-sacred-gold border-sacred-gold text-white font-bold shadow-lg shadow-sacred-orange/15 scale-102' 
                : 'bg-sacred-card/60 backdrop-blur-sm border-sacred-gold/10 text-stone-400 hover:text-stone-200 hover:border-sacred-gold/30'
            }`}
          >
            <span className="text-sm shrink-0">{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>

      {/* Primary Panels Content */}
      <main className="relative z-10" id="main-content-display">
        <AnimatePresence mode="wait">
          {activeTab === 'daily' && dailyPanchang && (
            <DailyPanchangView
              dailyPanchang={dailyPanchang}
              language={language}
              t={t}
              selectedDate={selectedDate}
              formattedAyanamsa={formattedAyanamsa}
            />
          )}

          {activeTab === 'month' && (
            <MonthGridView
              currentMonthYear={currentMonthYear}
              customLocation={customLocation}
              selectedDate={selectedDate}
              language={language}
              handlePrevMonth={handlePrevMonth}
              handleNextMonth={handleNextMonth}
              handleDayClick={handleDayClick}
            />
          )}

          {activeTab === 'festivals' && (
            <UpcomingFestivalsView
              upcomingFestivals={upcomingFestivals}
              language={language}
              t={t}
              handleDayClick={handleDayClick}
            />
          )}

          {activeTab === 'muhurta' && dailyPanchang && (
            <MuhurtasView
              dailyPanchang={dailyPanchang}
              language={language}
              t={t}
            />
          )}

          {activeTab === 'graha' && planets && (
            <PlanetaryPositionsView
              planets={planets}
              language={language}
              t={t}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Embedded Vedic Clock Visual Ornament */}
      {dailyPanchang && activeTab === 'daily' && (
        <VedicClock
          dailyPanchang={dailyPanchang}
          selectedDate={selectedDate}
          language={language}
          t={t}
        />
      )}

      {/* Footer credits and information */}
      <footer className="text-center mt-12 py-6 border-t border-stone-900/80 relative z-10 font-sans" id="sanatan-footer-credits">
        <p className="text-[11px] font-mono text-stone-500 tracking-widest uppercase">
          Sanatan Calendar is computed in real-time. Offline calculations via high-fidelity astronomy algorithms.
        </p>
        <p className="text-[10px] text-amber-600/60 mt-1 font-display tracking-widest uppercase">
          अवन्तिका देशे उज्जयिन्यां निवासः | 🕉️ सर्वं ब्रह्ममयम् 🕉️
        </p>
      </footer>
    </div>
  );
}
