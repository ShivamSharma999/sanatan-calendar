// app/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import heroTempleImg from '../src/assets/images/sanatan_hero_temple_1780279363343.png';
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
  type SubLanguage,
  getTithiDescription,
  getNakshatraDescription,
  getPurnimantaMonthDisplay,
  TITHIS_MAP,
  NAKSHATRAS_MAP,
  YOGAS_MAP,
  KARANAS_MAP,
  RASHI_MAP,
  getMoonPhaseEmoji,
  formatTimePeriod,
  formatSimpleTime
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
          language: language
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

  // Upcoming festivals range (45 days) - calculated for festivals view and daily editorial dashboard (High Performance)
  const upcomingFestivals = useMemo<FestivalDay[]>(() => {
    if (activeTab !== 'festivals' && activeTab !== 'daily') return [];
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

  // Dynamic moon phases represent weekly transit surrounding the active day (Skipping DIYAS and DEITIES as requested)
  const moonPhasesForWeek = useMemo(() => {
    const result = [];
    if (!dailyPanchang) return [];
    try {
      const baseDate = new Date(selectedDate);
      for (let iv = -3; iv <= 3; iv++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + iv);
        
        const p = getDailyPanchang(d, customLocation, {
          timezone: -d.getTimezoneOffset(),
          masaSystem: 'purnimanta',
          language: language
        });
        
        if (p) {
          const tithiObj = p.tithis[0];
          const tithiIndex = tithiObj?.index ?? 0;
          const label = TITHIS_MAP[language][tithiIndex]?.split(' ')[0] || '';
          
          result.push({
            date: d,
            dayLabel: d.getDate() + ' ' + d.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { month: 'short' }),
            emoji: getMoonPhaseEmoji(tithiIndex),
            tithiName: label,
            isSelected: iv === 0
          });
        }
      }
    } catch (e) {
      console.error("Failed to generate moon phases surrounding date", e);
    }
    return result;
  }, [selectedDate, customLocation, language, dailyPanchang]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isDark ? 'bg-stone-950 text-stone-100' : 'bg-[#faf7f2] text-stone-900'}`} id="sanatan-root-app">
      {/* Top Professional Header & Navigation */}
      <header className={`sticky top-0 z-40 transition-all border-b backdrop-blur-md ${isDark ? 'bg-stone-900/90 border-stone-800' : 'bg-white/90 border-[#e8dcc4]'} shadow-sm`} id="sanatan-navbar">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md border-2 border-amber-300">
              <span className="text-white text-lg font-bold">🕉️</span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-display tracking-wider text-amber-700 dark:text-amber-500">
                {language === 'hi' ? 'सनातन कैलेंडर' : 'Sanatan Calendar'}
              </h1>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-sans tracking-tight uppercase">
                {language === 'hi' ? 'वैदिक पञ्चांग एवं ब्रह्मांडीय गणना' : 'Vedic Panchang & Cosmic Clock'}
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('daily')}
              className={`pb-1 border-b-2 transition-all outline-none cursor-pointer ${
                activeTab === 'daily' 
                  ? 'border-orange-600 text-orange-600 dark:text-amber-500 dark:border-amber-500 font-bold' 
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'पञ्चांग' : 'Panchang'}
            </button>
            <button
              onClick={() => setActiveTab('month')}
              className={`pb-1 border-b-2 transition-all outline-none cursor-pointer ${
                activeTab === 'month' 
                  ? 'border-orange-600 text-orange-600 dark:text-amber-500 dark:border-amber-500 font-bold' 
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'मास ग्रिड' : 'Month Grid'}
            </button>
            <button
              onClick={() => setActiveTab('festivals')}
              className={`pb-1 border-b-2 transition-all outline-none cursor-pointer ${
                activeTab === 'festivals' 
                  ? 'border-orange-600 text-orange-600 dark:text-amber-500 dark:border-amber-500 font-bold' 
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'त्योहार' : 'Festivals'}
            </button>
            <button
              onClick={() => setActiveTab('muhurta')}
              className={`pb-1 border-b-2 transition-all outline-none cursor-pointer ${
                activeTab === 'muhurta' 
                  ? 'border-orange-600 text-orange-600 dark:text-amber-500 dark:border-amber-500 font-bold' 
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'शुभ मुहूर्त' : 'Muhurtas'}
            </button>
            <button
              onClick={() => setActiveTab('graha')}
              className={`pb-1 border-b-2 transition-all outline-none cursor-pointer ${
                activeTab === 'graha' 
                  ? 'border-orange-600 text-orange-600 dark:text-amber-500 dark:border-amber-500 font-bold' 
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'ग्रह स्थिति' : 'Graha Spashta'}
            </button>
          </nav>

          {/* Controls Set */}
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg border border-amber-500/20 bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Date-picker / Settings collapsible panel bar */}
      <section className={`border-b transition-colors ${isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-[#f4ebd9]/40 border-[#e8dcc4]'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-4 items-center justify-between text-xs font-sans">
          {/* Active location summary */}
          <div className="flex items-center gap-1 text-stone-600 dark:text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-amber-500" />
            <span className="font-semibold">{t.location}:</span>
            <span className="text-orange-800 dark:text-orange-400 font-bold">{locationName}</span>
          </div>

          {/* Quick controls row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Input selected Gregory date */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 dark:text-stone-400 font-medium">{t.selectDate}:</span>
              <input
                id="selected-date-picker"
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(new Date(e.target.value));
                    setCurrentMonthYear({ month: new Date(e.target.value).getMonth(), year: new Date(e.target.value).getFullYear() });
                  }
                }}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold outline-none cursor-pointer ${
                  isDark 
                    ? 'bg-stone-800 border-stone-700 text-stone-200' 
                    : 'bg-white border-[#e8dcc4] text-stone-800 shadow-sm'
                }`}
              />
            </div>

            {/* GPS Trigger button */}
            <button
              id="gps-trigger-button"
              onClick={requestLocation}
              disabled={gpsStatus === 'searching'}
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
            >
              <Compass className={`w-3.5 h-3.5 ${gpsStatus === 'searching' ? 'animate-spin' : ''}`} />
              <span>{gpsStatus === 'searching' ? t.searchingLocation : (gpsStatus === 'success' ? t.detectionActive : t.requestLocation)}</span>
            </button>

            {/* Language toggle */}
            <div className="flex border border-amber-500/35 rounded-lg overflow-hidden font-medium">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer ${language === 'hi' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer ${language === 'en' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container Wrapper */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        
        {/* Majestic Split Hero Banner (Features the high-craft Himalayan sunrise temple background) */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl mb-10 h-64 md:h-80" id="sanatan-hero-banner">
          {/* Himalayan Zodiac Temple background image */}
          <Image 
            src={heroTempleImg} 
            alt="Sanatan Himalayan Temple & Zodiac Wheel" 
            fill
            className="object-cover transform scale-102 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Elegant Sunset Saffron Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-900/60 to-transparent" />

          {/* Hero Left Text Frame */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 md:p-10 max-w-lg z-10">
            <h2 className="text-xs uppercase font-display tracking-widest text-amber-500 font-bold mb-1">
              {language === 'hi' ? 'सत्यं शिवं सुन्दरम्' : 'Divine Celestial Calculations'}
            </h2>
            <h3 className="text-2xl md:text-3.5xl font-bold font-display leading-tight text-white mb-3">
              {language === 'hi' ? 'सनातन कैलेंडर: आधुनिक खगोलशास्त्र से संचालित प्रामाणिक पञ्चांग' : 'Sanatan Calendar: Your Daily Guide to Hindu Time & Traditions'}
            </h3>
            <p className="text-xs md:text-sm text-amber-100 mb-5 font-sans leading-relaxed tracking-wide">
              {language === 'hi' ? 'सटीक सूर्योदय, सूर्यास्त तथा शुभ-अशुभ काल गणना' : 'Real-time high fidelity sunrise, moon phases, and key festival timings.'}
            </p>
            <div>
              <button 
                onClick={() => {
                  setActiveTab('daily');
                  const elem = document.getElementById('today-sacred-day-anchor');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs rounded-full shadow-lg shadow-orange-600/20 tracking-wider uppercase transition-transform hover:scale-103 cursor-pointer outline-none"
              >
                {language === 'hi' ? 'आज का पञ्चांग देखें' : "Today's Panchang"}
              </button>
            </div>
          </div>

          {/* Centered Overlap Ohm badge bridging division line */}
          <div className="absolute right-10 bottom-6 w-14 h-14 hidden md:flex items-center justify-center rounded-full bg-stone-950/85 border border-amber-400 text-amber-400 text-xl font-bold animate-pulse">
            🕉️
          </div>
        </div>
        {/* Tab Sub-Navigation (Useful quick selectors) */}
        <nav className="flex flex-wrap gap-1.5 mb-8 justify-center z-10 relative font-sans" id="app-navigation-mobile-tabs">
          {[
            { key: 'daily', icon: '🕉️', name: language === 'hi' ? 'दैनिक पञ्चांग' : 'Daily Panchang' },
            { key: 'month', icon: '📅', name: language === 'hi' ? 'मास फल (ग्रिड)' : 'Month Calendar' },
            { key: 'festivals', icon: '🔔', name: language === 'hi' ? 'प्रमुख त्योहार' : 'Festivals List' },
            { key: 'muhurta', icon: '⏱️', name: language === 'hi' ? 'शुभ-अशुभ मुहूर्त' : 'View Muhurtas' },
            { key: 'graha', icon: '🌌', name: language === 'hi' ? 'ग्रह स्थिति' : 'Graha Positions' }
          ].map((tab) => (
            <button
              key={tab.key}
              id={`tab-navigation-${tab.key}`}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1.5 outline-none border ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 border-[#e8dcc4] text-white font-bold shadow-md scale-102' 
                  : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Home Editorial view (Active when activeTab === 'daily') */}
        {activeTab === 'daily' && dailyPanchang && (
          <div className="space-y-10" id="today-sacred-day-anchor">
            {/* Today's Sacred Day (Core Headline and 5 Staggered Cards) */}
            <div className={`p-6 md:p-8 rounded-2xl border ${isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-[#e8dcc4]'} shadow-sm text-center relative overflow-hidden`}>
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600" />
              <h3 className="text-xs tracking-widest text-amber-700 dark:text-amber-500 font-display font-medium uppercase mb-1">
                {language === 'hi' ? 'अद्यतन पावन वैदिक तिथि' : 'Sacred Vedic Calendar Info'}
              </h3>
              
              {/* Dynamic formatting of active month paksha and tithi */}
              <h2 className="text-xl md:text-2.5xl font-bold font-display uppercase tracking-wider text-stone-900 dark:text-amber-50">
                {language === 'hi' ? 'आज का पावन दिवस: ' : 'Today\'s Sacred Day: '}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent italic">
                  {getPurnimantaMonthDisplay(dailyPanchang.chandramasa.purnimantaIndex, dailyPanchang.chandramasa.isAdhika, language)}{' '}
                  {dailyPanchang.tithis[0] ? (language === 'hi' ? (dailyPanchang.tithis[0].paksha === 'Shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष') : dailyPanchang.tithis[0].paksha + ' Paksha') : ''}{' '}
                  {dailyPanchang.tithis[0] ? TITHIS_MAP[language][dailyPanchang.tithis[0].index]?.split(' ')[0] : ''}
                </span>
              </h2>
              
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium font-sans mt-2 tracking-wide">
                📆 {selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              {/* Staggered Row representing 5 Astronomical Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mt-8 text-left font-sans">
                {/* 1. Tithi Card */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'} transition-all hover:shadow-md`}>
                  <p className="text-[10px] uppercase text-amber-700 dark:text-amber-500 tracking-wider font-bold mb-1">🌗 {t.tithi}</p>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {dailyPanchang.tithis[0] ? TITHIS_MAP[language][dailyPanchang.tithis[0].index] : '--'}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-1">
                    {t.endsAt} {dailyPanchang.tithis[0] && dailyPanchang.tithis[0].endTime ? formatSimpleTime(dailyPanchang.tithis[0].endTime) : '--'}
                  </p>
                </div>

                {/* 2. Nakshatra Card */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'} transition-all hover:shadow-md`}>
                  <p className="text-[10px] uppercase text-amber-700 dark:text-amber-500 tracking-wider font-bold mb-1">✨ {t.nakshatra}</p>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {dailyPanchang.nakshatras[0] ? NAKSHATRAS_MAP[language][dailyPanchang.nakshatras[0].index] : '--'}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-1">
                    {t.endsAt} {dailyPanchang.nakshatras[0] && dailyPanchang.nakshatras[0].endTime ? formatSimpleTime(dailyPanchang.nakshatras[0].endTime) : '--'}
                  </p>
                </div>

                {/* 3. Yoga Card */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'} transition-all hover:shadow-md`}>
                  <p className="text-[10px] uppercase text-amber-700 dark:text-amber-500 tracking-wider font-bold mb-1">🌀 {t.yoga}</p>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {dailyPanchang.yogas[0] ? YOGAS_MAP[language][dailyPanchang.yogas[0].index] : '--'}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    {t.endsAt} {dailyPanchang.yogas[0] && dailyPanchang.yogas[0].endTime ? formatSimpleTime(dailyPanchang.yogas[0].endTime) : '--'}
                  </p>
                </div>

                {/* 4. Karana Card */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'} transition-all hover:shadow-md`}>
                  <p className="text-[10px] uppercase text-amber-700 dark:text-amber-500 tracking-wider font-bold mb-1">🏺 {t.karana}</p>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {dailyPanchang.karanas[0] ? KARANAS_MAP[language][dailyPanchang.karanas[0].index] : '--'}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-1">
                    {t.endsAt} {dailyPanchang.karanas[0] && dailyPanchang.karanas[0].endTime ? formatSimpleTime(dailyPanchang.karanas[0].endTime) : '--'}
                  </p>
                </div>

                {/* 5. Highlighted Hindu Month + Samvat Card (Gold outlined with warm background gradient) */}
                <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-500/10 dark:bg-amber-900/15 col-span-2 md:col-span-1 shadow-md">
                  <p className="text-[10px] uppercase text-amber-600 dark:text-amber-400 tracking-wider font-extrabold mb-1">🔥 {language === 'hi' ? 'संवत एवं मास' : 'Month & Samvat'}</p>
                  <p className="text-xs font-extrabold text-amber-800 dark:text-amber-300">
                    {getPurnimantaMonthDisplay(dailyPanchang.chandramasa.purnimantaIndex, dailyPanchang.chandramasa.isAdhika, language)}
                  </p>
                  <p className="text-[10px] text-stone-600 dark:text-stone-400 font-medium mt-1">
                    Vikram: <span className="font-bold text-amber-700 dark:text-amber-500">{dailyPanchang.samvat.vikramSamvat}</span>
                  </p>
                  <p className="text-[9px] text-stone-500">
                    Shaka: <span className="font-bold">{dailyPanchang.samvat.shakaSamvat}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Split Astro columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
              
              {/* Left Column (Panchang detailed explanation card & timings table) */}
              <div className="lg:col-span-8 space-y-6 text-left">
                
                {/* Visual Header with geometric flourish */}
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-amber-500/40 to-amber-500" />
                  <span className="text-amber-700 dark:text-amber-500 font-bold tracking-widest font-display text-sm uppercase">
                    ✴️ {language === 'hi' ? 'दैनिक पञ्चांग विवरण' : 'Panchang Details'} ✴️
                  </span>
                  <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-amber-500/40 to-amber-500" />
                </div>

                {/* Bounded pristine Card */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-stone-900/30 border-stone-800' : 'bg-white border-[#e8dcc4]'} grid grid-cols-1 md:grid-cols-12 gap-6 shadow-sm text-left`}>
                  
                  {/* Left Half: Traditional descriptive text block (Guarantees zero lorem-ipsum!) */}
                  <div className="md:col-span-6 space-y-5 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 pb-5 md:pb-0 md:pr-6 text-left">
                    {/* Tithi Detail Explanation */}
                    <div>
                      <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                        🕉️ {language === 'hi' ? 'तिथि वैशिष्ट्य सूचक' : 'Tithi Spiritual Influence'}
                      </h4>
                      <p className="text-sm font-bold text-stone-900 dark:text-amber-50 mt-1">
                        {dailyPanchang.tithis[0] ? TITHIS_MAP[language][dailyPanchang.tithis[0].index] : '--'}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-300 pointer-events-none mt-1.5 leading-relaxed font-medium">
                        {dailyPanchang.tithis[0] ? getTithiDescription(dailyPanchang.tithis[0].index, language) : ''}
                      </p>
                    </div>

                    {/* Nakshatra Detail Explanation */}
                    <div>
                      <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                        ✨ {language === 'hi' ? 'नक्षत्र ऊर्जा सूचक' : 'Nakshatra Characteristics'}
                      </h4>
                      <p className="text-sm font-bold text-stone-900 dark:text-amber-50 mt-1">
                        {dailyPanchang.nakshatras[0] ? NAKSHATRAS_MAP[language][dailyPanchang.nakshatras[0].index] : '--'}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-300 pointer-events-none mt-1.5 leading-relaxed font-medium">
                        {dailyPanchang.nakshatras[0] ? getNakshatraDescription(dailyPanchang.nakshatras[0].index, language) : ''}
                      </p>
                    </div>
                  </div>

                  {/* Right Half: Astro timing table with gold border divisions */}
                  <div className="md:col-span-6 flex flex-col justify-center space-y-3.5 text-left">
                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
                      ⏱️ {language === 'hi' ? 'काल निर्धारण चक्र' : 'Sacred Timing Chart'}
                    </h4>

                    {/* Grid of timings */}
                    <div className="grid grid-cols-2 gap-3.5 text-xs text-left">
                      {/* Sunrise */}
                      <div className="p-3 bg-stone-100/50 dark:bg-stone-900/50 rounded-lg border border-amber-500/10">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">🌅 {t.sunrise}</span>
                        <span className="text-sm font-bold text-stone-800 dark:text-stone-100 mt-1 block">
                          {formatSimpleTime(dailyPanchang.sunrise)}
                        </span>
                      </div>

                      {/* Sunset */}
                      <div className="p-3 bg-stone-100/50 dark:bg-stone-900/50 rounded-lg border border-amber-500/10">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">🌇 {t.sunset}</span>
                        <span className="text-sm font-bold text-stone-800 dark:text-stone-100 mt-1 block">
                          {formatSimpleTime(dailyPanchang.sunset)}
                        </span>
                      </div>

                      {/* Rahu Kaalam */}
                      <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                        <span className="text-[10px] text-red-600 font-extrabold uppercase block">💀 {t.rahukalam}</span>
                        <span className="text-xs font-extrabold text-red-700 dark:text-red-400 mt-1 block">
                          {formatTimePeriod(dailyPanchang.rahuKalam.start, dailyPanchang.rahuKalam.end)}
                        </span>
                      </div>

                      {/* Abhijit Muhurat */}
                      <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                        <span className="text-[10px] text-emerald-600 font-extrabold uppercase block">🌟 {t.abhijit}</span>
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 block">
                          {dailyPanchang.abhijitMuhurta ? formatTimePeriod(dailyPanchang.abhijitMuhurta.start, dailyPanchang.abhijitMuhurta.end) : (language === 'hi' ? 'वर्जित' : 'Forbidden/None')}
                        </span>
                      </div>

                      {/* Chandra Rashi */}
                      <div className="p-3 bg-stone-100/50 dark:bg-stone-900/50 rounded-lg border border-amber-500/10">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">🌙 {t.moonRashi}</span>
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-100 mt-1 block">
                          {RASHI_MAP[language][dailyPanchang.chandraRashi.index]?.symbol} {RASHI_MAP[language][dailyPanchang.chandraRashi.index]?.name || dailyPanchang.chandraRashi.name}
                        </span>
                      </div>

                      {/* Surya Rashi */}
                      <div className="p-3 bg-stone-100/50 dark:bg-stone-900/50 rounded-lg border border-amber-500/10">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">☀️ {t.sunRashi}</span>
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-100 mt-1 block">
                          {RASHI_MAP[language][(dailyPanchang.suryaNakshatra.index + 1) % 12]?.symbol} {RASHI_MAP[language][(dailyPanchang.suryaNakshatra.index + 1) % 12]?.name || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Lunar phases & Key Upcoming Calendars list) */}
              <div className="lg:col-span-4 space-y-6 text-left">
                
                {/* Hindu Month header title */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping" />
                  <h4 className="text-sm font-bold tracking-widest font-display text-amber-700 dark:text-amber-500 uppercase">
                    {language === 'hi' ? 'चन्द्र मास पारगमन' : 'Lunar Cycle Transit'}
                  </h4>
                </div>

                {/* Moon phases horizontal starry cosmic card (Strictly without diyas & deity images as requested!) */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border border-stone-800 shadow-md text-center text-white relative overflow-hidden">
                  {/* Subtle starriness background */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
                  
                  <p className="text-[10px] uppercase text-amber-500 tracking-widest font-bold mb-1 z-10 relative">
                    🌒 {getPurnimantaMonthDisplay(dailyPanchang.chandramasa.purnimantaIndex, dailyPanchang.chandramasa.isAdhika, language)} 
                  </p>
                  <p className="text-[9px] text-stone-400 z-10 relative">
                    {language === 'hi' ? 'पक्ष पारगमन (७ दिवसीय दृश्य)' : '7-Day Lunar Transit (Selected Center)'}
                  </p>

                  <div className="flex justify-between items-center gap-1 mt-6 z-10 relative font-sans">
                    {moonPhasesForWeek.map((phase, uiIdx) => (
                      <button
                        key={uiIdx}
                        onClick={() => setSelectedDate(phase.date)}
                        className={`flex flex-col items-center p-1.5 rounded-lg transition-transform hover:scale-108 cursor-pointer focus:outline-none ${phase.isSelected ? 'bg-amber-500/20 ring-1 ring-amber-400' : 'hover:bg-white/5'}`}
                      >
                        <span className={`text-xl ${phase.isSelected ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] filter' : 'opacity-65'}`}>
                          {phase.emoji}
                        </span>
                        <span className="text-[9px] text-stone-300 font-bold mt-2 font-mono">
                          {phase.dayLabel.split(' ')[0]}
                        </span>
                        <span className="text-[8px] text-amber-400/80 font-semibold mt-1">
                          {phase.tithiName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Upcoming Festivals section */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-700 dark:text-amber-500 text-lg">🔔</span>
                    <h4 className="text-sm font-bold tracking-widest font-display text-amber-700 dark:text-amber-500 uppercase">
                      {t.upcomingFestivals}
                    </h4>
                  </div>

                  {/* List of 3 key festivals (Strictly without images inside as requested!) */}
                  <div className="space-y-3 font-sans">
                    {upcomingFestivals.slice(0, 3).map((fDay, fIdx) => (
                      <div 
                        key={fIdx}
                        className={`p-4 rounded-xl border relative overflow-hidden transition-all hover:shadow-md ${isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-[#e8dcc4]'}`}
                      >
                        {/* Red Calendar date badge inside card top-left */}
                        <div className="absolute top-0 right-0 py-1 px-3 bg-gradient-to-b from-orange-600 to-amber-500 text-white rounded-bl-xl text-[9px] font-bold tracking-widest font-mono uppercase">
                          {fDay.date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </div>

                        {/* Title and date detail content */}
                        <div className="pr-12 text-left">
                          <p className="text-xs font-bold text-stone-900 dark:text-orange-100 tracking-wide uppercase">
                            {fDay.festivals[0]?.name || ''}
                          </p>
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                            {fDay.date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          {fDay.festivals[0] && fDay.festivals[0].description && (
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium mt-1 leading-normal line-clamp-2">
                              {fDay.festivals[0].description}
                            </p>
                          )}
                        </div>

                        {/* Elegant "Explore Day" button to load festival details and scroll up */}
                        <button
                          onClick={() => {
                            setSelectedDate(fDay.date);
                            const elem = document.getElementById('sanatan-navbar');
                            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="mt-3.5 w-full py-1.5 bg-stone-100 dark:bg-stone-850 hover:bg-orange-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-black transition-colors rounded-lg text-[10px] font-bold text-amber-700 dark:text-amber-400 tracking-wider uppercase border border-stone-200 dark:border-stone-800 cursor-pointer"
                        >
                          {language === 'hi' ? 'इस तिथि का विवरण देखें 🕉️' : 'Explore Astrological timing 🕉️'}
                        </button>
                      </div>
                    ))}

                    {upcomingFestivals.length === 0 && (
                      <p className="text-xs text-stone-400 italic text-center py-4 bg-stone-100/50 dark:bg-stone-900/50 rounded-xl">
                        {language === 'hi' ? 'आगामी ४५ दिनों में कोई पर्व उपलब्ध नहीं है।' : 'No upcoming sacred events computed.'}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Secondary views rendered inside page router container */}
        <main className="relative z-10" id="main-content-display">
          <AnimatePresence mode="wait">
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

        {/* Circular flowing cosmic Vedic Clock element */}
        {dailyPanchang && activeTab === 'daily' && (
          <div className="mt-12">
            <VedicClock
              dailyPanchang={dailyPanchang}
              selectedDate={selectedDate}
              language={language}
              t={t}
            />
          </div>
        )}

      </div>

      {/* Deep-seated Traditional Footer credits and information */}
      <footer className={`mt-20 py-12 text-center border-t font-sans transition-colors ${isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-stone-100 border-[#e8dcc4]'}`} id="sanatan-footer-credits">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-2xl text-amber-600/80">🕉️</div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <button onClick={() => { setActiveTab('daily'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-600">Home</button>
            <button onClick={() => { setActiveTab('month'); }} className="hover:text-amber-600">Month Grid</button>
            <button onClick={() => { setActiveTab('festivals'); }} className="hover:text-amber-600">Festivals List</button>
            <button onClick={() => { setActiveTab('muhurta'); }} className="hover:text-amber-600">Muhurtas</button>
            <button onClick={() => { setActiveTab('graha'); }} className="hover:text-amber-600">Graha Spashta</button>
          </div>
          <p className="text-[10px] font-mono text-stone-400 dark:text-stone-500 tracking-widest uppercase">
            Sanatan Calendar calculations are powered by modern astronomical calculations.
          </p>
          <p className="text-[10px] text-amber-600/60 font-display tracking-widest uppercase">
            अवन्तिका देशे उज्जयिन्यां निवासः | 🕉️ सर्वं ब्रह्ममयम् 🕉️
          </p>
        </div>
      </footer>
    </div>
  );
}
