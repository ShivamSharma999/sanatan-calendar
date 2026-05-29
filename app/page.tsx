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
  type PlanetaryPositions,
  type DailyTithiInfo,
  type DailyNakshatraInfo,
  type DailyYogaInfo,
  type DailyKaranaInfo
} from 'panchang-ts';
import { 
  LANG_LABELS, 
  MONTHS_MAP, 
  TITHIS_MAP, 
  PAKSHA_MAP, 
  NAKSHATRAS_MAP, 
  YOGAS_MAP, 
  KARANAS_MAP, 
  VARA_MAP, 
  RASHI_MAP, 
  GRAHA_MAP, 
  getMoonPhaseEmoji, 
  getPurnimantaMonthDisplay, 
  formatTimePeriod,
  formatSimpleTime,
  type SubLanguage 
} from '../lib/panchang-helpers';
import { 
  Compass, 
  Sun, 
  Moon, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Info, 
  Zap, 
  Share2, 
  CheckCircle,
  BellRing
} from 'lucide-react';

const DEFAULT_LOCATION: GeoLocation & { name: string } = {
  latitude: 23.1760,
  longitude: 75.7885,
  elevation: 510,
  name: 'Ujjain, MP (Avantika / अवंतिका)'
};

export default function SanatanCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Default to current date (or 2026-05-29 as current time from metadata)
    return new Date();
  });
  
  const [customLocation, setCustomLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [locationName, setLocationName] = useState<string>(DEFAULT_LOCATION.name);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'searching' | 'success' | 'error'>('idle');
  const [language, setLanguage] = useState<SubLanguage>('hi');
  const [activeTab, setActiveTab] = useState<'daily' | 'month' | 'festivals' | 'muhurta' | 'graha'>('daily');
  
  // States for month view navigation
  const [currentMonthYear, setCurrentMonthYear] = useState<{ month: number; year: number }>(() => {
    const today = new Date();
    return { month: today.getMonth(), year: today.getFullYear() };
  });

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
    // Attempt automatic non-blocking check
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
          // Keep default silently
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

  // Compute planetary positions for the active day
  const planets = useMemo<PlanetaryPositions | null>(() => {
    try {
      return computePlanetaryPositions(
        selectedDate,
        'lahiri'
      );
    } catch (e) {
      console.error("Failed calculating planetary positions", e);
      return null;
    }
  }, [selectedDate]);

  // Upcoming festivals range (45 days)
  const upcomingFestivals = useMemo<FestivalDay[]>(() => {
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
  }, [selectedDate, customLocation]);

  // Construct Month View items
  const monthDays = useMemo(() => {
    const { month, year } = currentMonthYear;
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const items = [];
    
    // Add spacer days from previous month
    for (let i = 0; i < firstDayIndex; i++) {
      items.push(null);
    }
    
    // Add actual calculated package items
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      let pData: DailyPanchangResult | null = null;
      try {
        // Fast calculation with computeEndTimes: false to prevent month view lag
        pData = getDailyPanchang(
          date,
          customLocation,
          {
            timezone: -date.getTimezoneOffset(),
            masaSystem: 'purnimanta',
            computeEndTimes: false
          }
        );
      } catch (err) {
        // Fallback
      }
      
      items.push({
        dayNumber: day,
        date,
        panchang: pData
      });
    }
    
    return items;
  }, [currentMonthYear, customLocation]);

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
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Header and Branding */}
      <header className="text-center mb-10 relative z-10" id="sanatan-header">
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
      <section className="bg-sacred-card/80 border border-sacred-gold/20 rounded-2xl p-5 md:p-6 mb-8 backdrop-blur-md relative z-10 shadow-xl glow-border" id="sanatan-controls">
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
                className="w-full bg-stone-900 border border-sacred-gold/30 rounded-lg px-3.5 py-2.5 text-sm outline-none text-white focus:border-sacred-orange transition-colors"
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
                className="flex-1 text-center bg-stone-900 border border-stone-800 rounded py-1 text-xs hover:border-sacred-gold/30 hover:text-sacred-gold transition-colors text-stone-400"
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
                className="flex-1 text-center bg-sacred-gold/10 border border-sacred-gold/40 rounded py-1 text-xs hover:bg-sacred-gold/20 hover:text-white transition-colors text-sacred-gold font-medium"
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
                className="flex-1 text-center bg-stone-900 border border-stone-800 rounded py-1 text-xs hover:border-sacred-gold/30 hover:text-sacred-gold transition-colors text-stone-400"
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
            <div className="bg-stone-900 border border-sacred-gold/20 rounded-lg px-3.5 py-2 flex items-center justify-between text-xs">
              <span className="text-stone-300 font-medium truncate max-w-[170px]" title={locationName}>
                {locationName}
              </span>
              <span className="text-[10px] bg-sacred-gold/10 text-sacred-gold border border-sacred-gold/20 rounded px-1.5 py-0.5">
                510m
              </span>
            </div>
            <button
              id="gps-trigger-button"
              onClick={requestLocation}
              disabled={gpsStatus === 'searching'}
              className="w-full bg-stone-900 border border-sacred-gold/30 hover:border-sacred-gold hover:bg-stone-800 rounded-lg py-2 text-xs flex items-center justify-center gap-1.5 transition-all outline-none"
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
            <div className="grid grid-cols-3 gap-1 bg-stone-900 p-1.5 rounded-lg border border-sacred-gold/25" id="language-tab-picker">
              <button 
                id="lang-btn-hi"
                onClick={() => setLanguage('hi')}
                className={`py-2 text-xs rounded font-medium transition-all outline-none ${
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
                className={`py-2 text-xs rounded font-medium transition-all outline-none ${
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
                className={`py-2 text-xs rounded font-medium transition-all outline-none ${
                  language === 'en' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold drop-shadow-md' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                English 🌍
              </button>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1">
              <Info className="w-3 h-3 text-sacred-gold" />
              <span>{t.purnimantaActive}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Tabs Navigation */}
      <nav className="flex flex-wrap gap-2 mb-8 justify-center z-10 relative" id="app-navigation-tabs">
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
            <motion.div
              key="daily-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              {/* Left Column: Essential Tithi & Hindu Day Metadata */}
              <div className="md:col-span-7 flex flex-col gap-6">
                
                {/* High Profile Summary Card with Lunar Phase Visualizer */}
                <div className="bg-gradient-to-br from-sacred-card to-stone-900 border border-sacred-gold/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
                  {/* Floating Month Watermark */}
                  <div className="absolute -bottom-6 -left-6 text-[90px] md:text-[120px] font-black opacity-[0.03] text-[#78350f] select-none leading-none pointer-events-none uppercase font-display">
                    {getPurnimantaMonthDisplay(dailyPanchang.chandramasa.purnimantaIndex, dailyPanchang.chandramasa.isAdhika, 'en').split(' ')[0]}
                  </div>
                  {/* Floating Moon Phase */}
                  <div className="absolute right-6 top-6 flex flex-col items-center">
                    <motion.span 
                      key={selectedDate.toISOString()}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="text-7xl md:text-8xl select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse-slow leading-none"
                    >
                      {getMoonPhaseEmoji(dailyPanchang.tithis[0]?.index || 0)}
                    </motion.span>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mt-2 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                      {dailyPanchang.tithis[0]?.paksha === 'Shukla' 
                        ? (language === 'en' ? 'Shukla Paksha' : language === 'hi' ? 'शुक्ल पक्ष' : 'शुक्लपक्षः') 
                        : (language === 'en' ? 'Krishna Paksha' : language === 'hi' ? 'कृष्ण पक्ष' : 'कृष्णपक्षः')}
                    </span>
                  </div>

                  {/* Sacred Saffron Emblem with Lunar / Solar month */}
                  <div className="flex flex-col gap-2 max-w-[65%]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🔱</span>
                      <span className="text-sm font-semibold text-sacred-orange tracking-widest uppercase font-display glow-text">
                        {dailyPanchang.samvat.vikramSamvat} {language === 'en' ? 'Vikram Samvat' : 'वैक्रम संवत्सरः'}
                      </span>
                    </div>
                    {/* Month Header in large letters */}
                    <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-widest mt-2 uppercase">
                      {getPurnimantaMonthDisplay(dailyPanchang.chandramasa.purnimantaIndex, dailyPanchang.chandramasa.isAdhika, language)}
                    </h2>
                    <p className="text-xs text-orange-400 font-mono mt-1 tracking-wider uppercase font-semibold">
                      {language === 'en' ? 'Masa System: ' : language === 'hi' ? 'प्रणाली: ' : 'पद्धतिः: '}
                       पूर्णिमान्त (North Indian)
                    </p>
                    
                    {/* Basic details */}
                    <div className="flex flex-col gap-1 mt-4 text-xs md:text-sm text-stone-300 font-sans border-t border-stone-800 pt-4">
                      <p className="flex items-center gap-1.5">
                        <span className="text-amber-500">⚜️</span>
                        <strong className="text-stone-400">{t.vara}:</strong> {VARA_MAP[language][dailyPanchang.vara.index]}
                      </p>
                      <p className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-amber-500">🌙</span>
                        <strong className="text-stone-400">{t.tithi}:</strong> {TITHIS_MAP[language][dailyPanchang.tithis[0]?.index || 0]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub-Angas Cards (Nakshtra, Yoga, Karana, Rashi) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { 
                      title: t.nakshatra, 
                      emoji: '✨', 
                      name: NAKSHATRAS_MAP[language][dailyPanchang.nakshatras[0]?.index || 0],
                      details: dailyPanchang.nakshatras[0]?.endTime 
                        ? `${t.endsAt} ${formatSimpleTime(dailyPanchang.nakshatras[0].endTime)}` 
                        : t.activeAtSunrise 
                    },
                    { 
                      title: t.yoga, 
                      emoji: '⚡', 
                      name: YOGAS_MAP[language][dailyPanchang.yogas[0]?.index || 0],
                      details: dailyPanchang.yogas[0]?.endTime 
                        ? `${t.endsAt} ${formatSimpleTime(dailyPanchang.yogas[0].endTime)}` 
                        : t.activeAtSunrise 
                    },
                    { 
                      title: t.karana, 
                      emoji: '🧩', 
                      name: KARANAS_MAP[language][dailyPanchang.karanas[0]?.index || 0],
                      details: dailyPanchang.karanas[0]?.endTime 
                        ? `${t.endsAt} ${formatSimpleTime(dailyPanchang.karanas[0].endTime)}` 
                        : t.activeAtSunrise 
                    },
                    { 
                      title: t.moonRashi, 
                      emoji: RASHI_MAP[language][dailyPanchang.chandraRashi.index]?.symbol || '🌙', 
                      name: RASHI_MAP[language][dailyPanchang.chandraRashi.index]?.name || dailyPanchang.chandraRashi.name,
                      details: language === 'en' ? 'Transit Moon' : 'गोचर चंद्र राशि'
                    }
                  ].map((anga, idx) => (
                    <div key={idx} className="bg-stone-900 border border-stone-800 hover:border-sacred-gold/40 p-4 rounded-xl transition-all shadow shadow-black">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase tracking-widest text-[#9c8470] font-sans font-semibold">
                          {anga.title}
                        </span>
                        <span className="text-lg" role="img" aria-label={anga.title}>{anga.emoji}</span>
                      </div>
                      <h3 className="text-lg font-display text-glow-gold text-sacred-gold font-bold">
                        {anga.name}
                      </h3>
                      <p className="text-[11px] text-stone-400 font-mono mt-1">
                        {anga.details}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Additional Astronomical Factors Info block */}
                <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col gap-2">
                  <h4 className="text-xs uppercase tracking-wider text-amber-500 font-semibold font-display mb-1">
                    {language === 'en' ? 'Astrological Observables' : language === 'hi' ? 'खगोलीय अवलोकन' : 'खगोलीय-प्रत्यक्षम्'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono text-stone-300">
                    <p className="border-b border-stone-900 pb-1 flex justify-between">
                      <span className="text-stone-400">{t.sunRashi}:</span>
                      <span className="text-amber-500 font-semibold">
                        {RASHI_MAP[language][dailyPanchang.suryaNakshatra.index % 12]?.name || ''}
                      </span>
                    </p>
                    <p className="border-b border-stone-900 pb-1 flex justify-between">
                      <span className="text-stone-400">{t.sunNakshatra}:</span>
                      <span className="text-amber-500 font-semibold truncate max-w-[120px]">
                        {NAKSHATRAS_MAP[language][dailyPanchang.suryaNakshatra.index] || ''}
                      </span>
                    </p>
                    <p className="flex justify-between col-span-2">
                      <span className="text-stone-400">{t.ayanamsa}:</span>
                      <span className="text-neutral-200">{formattedAyanamsa}</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: Celestial Timing and Daily Sun/Moon clocks */}
              <div className="md:col-span-5 flex flex-col gap-6">
                
                {/* Celestial Sunrise & Sun State Block */}
                <div className="bg-stone-900/40 border border-stone-800 p-5 rounded-2xl flex flex-col gap-4">
                  <h3 className="text-xs uppercase font-display tracking-widest font-bold text-sacred-gold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sacred-orange animate-pulse" />
                    {language === 'en' ? 'Solar & Lunar Horizons' : 'सौर एवं चंद्र क्षितिज'}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Sunrise */}
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-900 flex items-center gap-3">
                      <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                        <Sun className="w-5 h-5 text-sacred-orange" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-stone-400">{t.sunrise}</p>
                        <p className="text-sm font-bold font-mono text-white">{formatSimpleTime(dailyPanchang.sunrise)}</p>
                      </div>
                    </div>
                    {/* Sunset */}
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-900 flex items-center gap-3">
                      <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500">
                        <Sun className="w-5 h-5 opacity-80" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-stone-400">{t.sunset}</p>
                        <p className="text-sm font-bold font-mono text-white">{formatSimpleTime(dailyPanchang.sunset)}</p>
                      </div>
                    </div>
                    {/* Moonrise */}
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-900 flex items-center gap-3">
                      <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
                        <Moon className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-stone-400">{t.moonrise}</p>
                        <p className="text-sm font-bold font-mono text-white">
                          {dailyPanchang.moonrise ? formatSimpleTime(dailyPanchang.moonrise) : '--:--'}
                        </p>
                      </div>
                    </div>
                    {/* Moonset */}
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-900 flex items-center gap-3">
                      <div className="bg-indigo-950/20 p-2 rounded-lg text-indigo-600">
                        <Moon className="w-5 h-5 opacity-60" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-stone-400">{t.moonset}</p>
                        <p className="text-sm font-bold font-mono text-white">
                          {dailyPanchang.moonset ? formatSimpleTime(dailyPanchang.moonset) : '--:--'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Major Samvat and Era details */}
                <div className="bg-sacred-card border border-sacred-gold/15 p-4 rounded-xl flex flex-col gap-2">
                  <h4 className="text-xs font-display uppercase tracking-widest text-sacred-gold font-bold">
                    {t.samvat}
                  </h4>
                  <div className="flex flex-col gap-2 text-xs font-sans text-stone-300 pt-1">
                    <div className="flex justify-between items-center border-b border-stone-800/60 pb-1.5">
                      <span className="text-stone-400">{t.vikramSamvat}:</span>
                      <span className="font-mono bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-glow-gold text-sacred-gold font-semibold">
                        {dailyPanchang.samvat.vikramSamvat}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-stone-400">{t.shakaSamvat}:</span>
                      <span className="font-mono bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-orange-400 font-semibold block">
                        {dailyPanchang.samvat.shakaSamvat}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Daily Festivals Indicator List */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl relative overflow-hidden" id="daily-festivals-widget">
                  <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
                    <BellRing className="w-16 h-16 text-sacred-gold" />
                  </div>
                  <h3 className="text-xs uppercase font-display tracking-widest font-bold text-sacred-gold flex items-center gap-1.5 mb-3">
                    <span>🔔</span> {t.festivals}
                  </h3>
                  {dailyPanchang.festivals.length > 0 ? (
                    <ul className="flex flex-col gap-2 relative z-10">
                      {dailyPanchang.festivals.map((festival, fIdx) => (
                        <li key={fIdx} className="bg-stone-950 border border-stone-800/80 hover:border-sacred-orange/40 rounded-xl p-3 flex flex-col gap-1 transition-colors">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-semibold text-white tracking-wide">
                              🎉 {festival.name}
                            </h4>
                            <span className="text-[9px] bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 rounded px-1.5 py-0.5 select-none font-mono tracking-widest uppercase">
                              {festival.type}
                            </span>
                          </div>
                          {festival.description && (
                            <p className="text-[11px] text-stone-400 leading-relaxed font-sans font-normal border-t border-stone-900/60 pt-1 mt-1">
                              {festival.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-stone-950/60 border border-stone-800 border-dashed rounded-xl p-4 text-center text-xs text-stone-500 font-sans">
                      {t.noFestivals}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* Month View Tab */}
          {activeTab === 'month' && (
            <motion.div
              key="month-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-sacred-card border border-sacred-gold/15 rounded-2xl p-5 md:p-6 shadow-2xl"
              id="month-view-grid-panel"
            >
              {/* Grid Header Controls */}
              <div className="flex justify-between items-center mb-6">
                <button
                  id="month-grid-prev-btn"
                  onClick={handlePrevMonth}
                  className="bg-stone-900 border border-stone-800 hover:border-sacred-gold/40 hover:text-sacred-gold px-3.5 py-2 rounded-lg text-xs outline-none transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पूर्व मास' : language === 'sa' ? 'पूर्वमासः' : 'Prev Month'}</span>
                </button>
                
                <h3 className="text-lg md:text-2xl font-display font-medium text-sacred-gold tracking-widest text-center filter drop-shadow">
                  {getPurnimantaMonthDisplay(currentMonthYear.month, false, language)} {currentMonthYear.year}
                </h3>

                <button
                  id="month-grid-next-btn"
                  onClick={handleNextMonth}
                  className="bg-stone-900 border border-stone-800 hover:border-sacred-gold/40 hover:text-sacred-gold px-3.5 py-2 rounded-lg text-xs outline-none transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'hi' ? 'उत्तर मास' : language === 'sa' ? 'अपरमासः' : 'Next Month'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day Titles */}
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] md:text-xs uppercase tracking-wider font-display font-semibold text-neutral-400 mb-2">
                {language === 'en' 
                  ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                  : language === 'hi'
                    ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
                    : ['रविः', 'सोमः', 'भौमः', 'बुधः', 'गुरुः', 'भृगुः', 'शनिः']
                }
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((item, idx) => {
                  if (item === null) {
                    return <div key={`spacer-${idx}`} className="bg-stone-900/10 min-h-[75px] md:min-h-[105px] border border-stone-950/15" />;
                  }

                  const isToday = 
                    item.date.getDate() === selectedDate.getDate() && 
                    item.date.getMonth() === selectedDate.getMonth() && 
                    item.date.getFullYear() === selectedDate.getFullYear();

                  const tithiIndex = item.panchang?.tithis[0]?.index ?? 0;
                  const tithiName = TITHIS_MAP[language][tithiIndex] || '';
                  const truncatedTithi = tithiName.split(' ')[0] || '';
                  const paksha = item.panchang?.tithis[0]?.paksha || '';
                  const hasFestival = item.panchang && item.panchang.festivals.length > 0;

                  return (
                    <div
                      key={`day-${item.dayNumber}`}
                      onClick={() => handleDayClick(item.date)}
                      className={`min-h-[85px] md:min-h-[115px] border rounded-xl p-2 cursor-pointer flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                        isToday 
                          ? 'bg-gradient-to-br from-sacred-orange/20 to-sacred-gold/15 border-sacred-gold shadow text-white' 
                          : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800 hover:border-sacred-gold/40'
                      }`}
                    >
                      {/* Day number & Moon Phase */}
                      <div className="flex justify-between items-start">
                        <span className={`text-xs md:text-sm font-mono font-bold ${isToday ? 'text-sacred-gold text-glow-gold' : 'text-neutral-300'}`}>
                          {item.dayNumber}
                        </span>
                        <span className="text-base select-none" title={truncatedTithi}>
                          {getMoonPhaseEmoji(tithiIndex)}
                        </span>
                      </div>

                      {/* Tithi Display */}
                      <p className={`text-[9px] md:text-[10px] font-sans truncate font-medium mt-1 leading-normal ${
                        paksha === 'Shukla' ? 'text-amber-300' : 'text-stone-400'
                      }`}>
                        {truncatedTithi}
                      </p>

                      {/* Festival notification highlight */}
                      {hasFestival ? (
                        <div className="flex items-center gap-1 mt-2 overflow-hidden bg-stone-950 border border-amber-950 rounded px-1 py-0.5 max-w-full">
                          <span className="text-[8px] animate-pulse">🚩</span>
                          <span className="text-[7.5px] md:text-[9px] truncate font-medium text-sacred-gold font-sans">
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
          )}

          {/* Upcoming Festivals list View */}
          {activeTab === 'festivals' && (
            <motion.div
              key="festivals-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-sacred-card border border-sacred-gold/15 rounded-2xl p-5 md:p-6 shadow-2xl relative"
              id="festivals-range-feed-panel"
            >
              <h3 className="text-lg md:text-2xl font-display font-medium text-sacred-gold mb-1 tracking-widest flex items-center gap-2">
                <span>🏵️</span> {t.upcomingFestivals}
              </h3>
              <p className="text-xs text-stone-400 mb-6 font-sans">
                {language === 'en' 
                  ? 'Showing computed major and minor astronomical festivals / observations for the next 45 days:' 
                  : 'अगले ४५ दिनों के लिए गणना किए गए प्रमुख पर्व एवं विशिष्ट व्रत अनुष्ठान की सूची:'}
              </p>

              {upcomingFestivals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingFestivals.map((fItem, index) => {
                    // format date beautifully in localized text
                    const displayDateStr = fItem.date.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <div 
                        key={index} 
                        onClick={() => handleDayClick(fItem.date)}
                        className="bg-stone-900 hover:bg-stone-850/80 border border-stone-800 hover:border-sacred-gold/25 rounded-xl p-4 transition-all duration-300 group cursor-pointer shadow-md flex items-start gap-3 justify-between"
                      >
                        <div className="flex flex-col gap-1.5 text-left max-w-[80%]">
                          <span className="text-[10px] md:text-xs font-mono text-sacred-orange font-bold uppercase tracking-wider block">
                            🚩 {displayDateStr}
                          </span>
                          <h4 className="text-sm md:text-base font-semibold text-white tracking-wide">
                            {fItem.festival.name}
                          </h4>
                          {fItem.festival.description && (
                            <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                              {fItem.festival.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-1.5">
                          <span className="text-[8px] md:text-[9px] bg-sacred-gold/15 border border-sacred-gold/30 text-sacred-gold px-1.5 py-0.5 rounded uppercase font-semibold font-mono tracking-widest">
                            {fItem.festival.type}
                          </span>
                          <span className="text-xs font-mono text-stone-500 whitespace-nowrap block mt-1">
                            {language === 'en' ? 'Click to Panchang' : 'पञ्चांग देखें'} ➔
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-stone-950 border border-stone-800 border-dashed rounded-xl p-10 text-center text-xs text-stone-500 max-w-md mx-auto">
                  {t.noFestivals}
                </div>
              )}
            </motion.div>
          )}

          {/* Muhurtas and Inauspicious Times list view */}
          {activeTab === 'muhurta' && dailyPanchang && (
            <motion.div
              key="muhurta-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {/* Auspicious Muhurtas List */}
              <div className="bg-sacred-card border border-sacred-gold/15 rounded-2xl p-5 md:p-6 shadow-2xl">
                <h3 className="text-lg md:text-2xl font-display font-medium text-sacred-gold mb-6 tracking-widest flex items-center gap-2">
                  <span>⏱️</span> {t.muhurtasTime}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Abhijit Muhurta */}
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute right-3 top-3 text-2xl filter drop-shadow opacity-20 pointer-events-none">⭐</div>
                    <span className="text-[10px] uppercase font-display tracking-widest font-semibold text-sacred-gold">
                      {t.abhijit}
                    </span>
                    <h4 className="text-lg font-bold text-stone-100 flex items-center gap-1.5">
                      {language === 'en' ? 'Abhijit Muhurta' : 'अभिजित मुहूर्त'}
                    </h4>
                    <p className="text-xs font-mono text-amber-400 font-semibold mt-1">
                      {dailyPanchang.abhijitMuhurta 
                        ? formatTimePeriod(dailyPanchang.abhijitMuhurta.start, dailyPanchang.abhijitMuhurta.end) 
                        : (language === 'hi' ? 'बुधवार को निषेध' : 'Wed - Forbidden')}
                    </p>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans border-t border-stone-950 pt-2 mt-1">
                      {language === 'en' 
                        ? 'Highly auspicious mid-day slot centered on solar noon. Favorable for most initiation activities.' 
                        : 'सूर्य दोपहर में केंद्रित पूर्वाह्न। सभी नए महत्वपूर्ण कार्यों के शुभारंभ हेतु सर्वोत्कृष्ट है।'}
                    </p>
                  </div>

                  {/* Brahma Muhurta */}
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute right-3 top-3 text-2xl filter drop-shadow opacity-20 pointer-events-none">🕊️</div>
                    <span className="text-[10px] uppercase font-display tracking-widest font-semibold text-sacred-gold">
                      {t.brahma}
                    </span>
                    <h4 className="text-lg font-bold text-stone-100 flex items-center gap-1.5">
                      {language === 'en' ? 'Brahma Muhurta' : 'ब्रह्म मुहूर्त'}
                    </h4>
                    <p className="text-xs font-mono text-amber-400 font-semibold mt-1">
                      {formatTimePeriod(dailyPanchang.brahmaMuhurta.start, dailyPanchang.brahmaMuhurta.end)}
                    </p>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans border-t border-stone-950 pt-2 mt-1">
                      {language === 'en' 
                        ? 'Early morning period (1h 36m before sunrise). Best slot for meditation, studies, & spiritual reflection.' 
                        : 'सूर्योदय से ९६ मिनट पूर्व प्रारंभ समय। योग, पूजा-पाठ, ध्यान एवं अध्ययन साधना हेतु सर्वोपरि मुहूर्त।'}
                    </p>
                  </div>

                  {/* Amrit Kalam */}
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute right-3 top-3 text-2xl filter drop-shadow opacity-20 pointer-events-none">✨</div>
                    <span className="text-[10px] uppercase font-display tracking-widest font-semibold text-sacred-gold">
                      {t.amritkala}
                    </span>
                    <h4 className="text-lg font-bold text-stone-100 flex items-center gap-1.5">
                      {language === 'en' ? 'Amrit Kalam' : 'अमृत काल समय'}
                    </h4>
                    <p className="text-xs font-mono text-amber-400 font-semibold mt-1">
                      {dailyPanchang.amritKala 
                        ? formatTimePeriod(dailyPanchang.amritKala.start, dailyPanchang.amritKala.end) 
                        : (language === 'hi' ? 'नहीं है' : 'None today')}
                    </p>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans border-t border-stone-950 pt-2 mt-1">
                      {language === 'en' 
                        ? 'Computed based on the day’s transit nakshatra. Regarded as propitious for starting business/purchases.' 
                        : 'नक्षत्र के आधार पर निकाला गया शुभ काल। नया व्यापार या मूल्यवान वस्तु क्रय हेतु अत्यंत श्रेष्ठ माना गया है।'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inauspicious Times / Avoidance Zones Block */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 md:p-6 shadow-xl leading-normal">
                <h3 className="text-xs uppercase font-display tracking-widest font-bold text-sacred-orange flex items-center gap-1.5 mb-6">
                  <span>⚠️</span> {language === 'en' ? 'Avoidance Times (अशुभ समय)' : 'वर्जित एवं अशुभ समय सूची (सावधानी रखें)'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Rahu Kalam */}
                  <div className="bg-stone-950 border border-red-950 rounded-xl p-4 flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-red-500 font-semibold uppercase">{t.rahukalam}</span>
                    <h4 className="text-sm font-semibold text-white">{language === 'en' ? 'Rahu Kalam' : 'राहु काल'}</h4>
                    <span className="text-xs md:text-sm font-bold font-mono text-orange-500 bg-red-950/20 border border-red-900/30 rounded py-1 px-2 block mt-1">
                      {formatTimePeriod(dailyPanchang.rahuKalam.start, dailyPanchang.rahuKalam.end)}
                    </span>
                    <p className="text-[10.5px] text-stone-500 font-sans mt-1">
                      {language === 'en' ? 'Forbidden for starting travels, purchasing properties, or starting deals.' : 'यात्रा प्रस्थान, व्यापारिक सौदे, गृहप्रवेश एवं नया सामान क्रय करने हेतु निषिद्ध।'}
                    </p>
                  </div>

                  {/* Yamaganda */}
                  <div className="bg-stone-950 border border-red-950 rounded-xl p-4 flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-[#9c8470] font-semibold uppercase">{t.yamaganda}</span>
                    <h4 className="text-sm font-semibold text-white">{language === 'en' ? 'Yamaganda' : 'यमगण्ड काल'}</h4>
                    <span className="text-xs md:text-sm font-bold font-mono text-stone-400 bg-[#1c1917]/20 border border-stone-800 rounded py-1 px-2 block mt-1">
                      {formatTimePeriod(dailyPanchang.yamaganda.start, dailyPanchang.yamaganda.end)}
                    </span>
                    <p className="text-[10.5px] text-stone-500 font-sans mt-1">
                      {language === 'en' ? 'Auspicious initiations conducted during this span lead to delays or unfavorable loss.' : 'इस काल में महत्वपूर्ण काम की शुरुआत में अवरोध व बाधाएं उत्पन्न होने की संभावना रहती है।'}
                    </p>
                  </div>

                  {/* Gulika Kalam */}
                  <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-stone-400 font-semibold uppercase">{t.gulikakalam}</span>
                    <h4 className="text-sm font-semibold text-white">{language === 'en' ? 'Gulika Kalam' : 'गुलिक काल'}</h4>
                    <span className="text-xs md:text-sm font-bold font-mono text-stone-300 bg-stone-900 border border-stone-800 rounded py-1 px-2 block mt-1">
                      {formatTimePeriod(dailyPanchang.gulikaKalam.start, dailyPanchang.gulikaKalam.end)}
                    </span>
                    <p className="text-[10.5px] text-stone-500 font-sans mt-1">
                      {language === 'en' ? 'Neutral time period ruled by Saturn (Gulikan). Regarded as acceptable for secondary duties.' : 'शनि के उपग्रह गुलिक का नियंत्रक काल। सामान्य क्रियाकलाप और सहायक कार्यों हेतु मान्य।'}
                    </p>
                  </div>

                  {/* Bhadra Kalam / Vishti Karana */}
                  <div className="bg-stone-950 border border-amber-950 rounded-xl p-4 flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-amber-500 font-semibold uppercase">{t.bhadrakalam}</span>
                    <h4 className="text-sm font-semibold text-white">{language === 'en' ? 'Bhadra / Vishti' : 'भद्रा काल समय'}</h4>
                    <span className="text-xs md:text-sm font-bold font-mono text-yellow-500 bg-amber-950/20 border border-amber-900/40 rounded py-1 px-2 block mt-1">
                      {dailyPanchang.bhadra?.isActive 
                        ? formatTimePeriod(dailyPanchang.bhadra.start, dailyPanchang.bhadra.end) 
                        : (language === 'hi' ? 'भद्रा सक्रिय नहीं है' : 'No Bhadra Active')}
                    </span>
                    <p className="text-[10.5px] text-stone-500 font-sans mt-1">
                      {language === 'en' 
                        ? 'Bhadra resides in different realms. Earthly Bhadra requires strict avoidance of auspicious starts.' 
                        : 'जब भद्रा मृत्युलोक (पृथ्वी) में निवास करती है, तब किसी भी शुभ आरंभ का कड़ा निषेध होता है।'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Planetary positions Graha Spashta View */}
          {activeTab === 'graha' && planets && (
            <motion.div
              key="graha-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-sacred-card border border-sacred-gold/15 rounded-2xl p-5 md:p-6 shadow-2xl relative"
              id="planetary-positions-panel"
            >
              <h3 className="text-lg md:text-2xl font-display font-medium text-sacred-gold mb-1 tracking-widest flex items-center gap-2">
                <span>🌌</span> {t.planetaryPositions}
              </h3>
              <p className="text-xs text-stone-400 mb-6 font-sans">
                {language === 'en' 
                  ? 'Sidereal planetary alignments computed at standard Vedic sunrise with Nakshatra padas:' 
                  : 'वैदिक सूर्योदय समय पर गणना की गई वास्तविक सायन एवं निरयण ग्रहों की ज्योतिषीय स्थिति:'}
              </p>

              {/* Planets Table Layout */}
              <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/50">
                <table className="w-full text-left border-collapse text-xs md:text-sm font-sans">
                  <thead>
                    <tr className="bg-stone-950 text-sacred-gold font-display uppercase tracking-wider border-b border-stone-800 text-[10px] md:text-xs">
                      <th className="p-4">{t.grahas}</th>
                      <th className="p-4">{t.sign}</th>
                      <th className="p-4">{t.degree}</th>
                      <th className="p-4">{t.nakshatra}</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-950 font-medium text-stone-200">
                    {/* Iterate over planets */}
                    {[
                      { key: 'sun', data: planets.sun },
                      { key: 'moon', data: planets.moon },
                      { key: 'mars', data: planets.mars },
                      { key: 'mercury', data: planets.mercury },
                      { key: 'jupiter', data: planets.jupiter },
                      { key: 'venus', data: planets.venus },
                      { key: 'saturn', data: planets.saturn },
                      { key: 'rahu', data: planets.rahu },
                      { key: 'ketu', data: planets.ketu }
                    ].map((row, rIdx) => {
                      if (!row.data) return null;
                      
                      const planetLabel = GRAHA_MAP[language][row.data.planet] || row.data.planet;
                      const rashiIndex = row.data.rashi.index;
                      const rashiSymbol = RASHI_MAP[language][rashiIndex]?.symbol || '🌌';
                      const rashiLabel = RASHI_MAP[language][rashiIndex]?.name || row.data.rashi.name;
                      const d = row.data.degreeInRashi;
                      const deg = Math.floor(d);
                      const min = Math.round((d - deg) * 60);
                      const nakshatraLabel = NAKSHATRAS_MAP[language][row.data.nakshatra.index] || row.data.nakshatra.name;

                      return (
                        <tr key={rIdx} className="hover:bg-stone-900/50 transition-colors">
                          <td className="p-4 font-semibold text-white text-xs md:text-sm flex items-center gap-1.5">
                            {planetLabel}
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 md:gap-2">
                              <span className="text-lg filter drop-shadow">{rashiSymbol}</span>
                              <span className="font-semibold">{rashiLabel}</span>
                            </span>
                          </td>
                          <td className="p-4 font-mono font-medium text-stone-300">
                            {deg}° {min}&apos;
                          </td>
                          <td className="p-4 text-xs">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-stone-100">{nakshatraLabel}</span>
                              <span className="text-[10px] text-stone-500 font-mono font-normal">
                                Pada {row.data.nakshatra.pada || 1}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {row.data.isRetrograde ? (
                              <span className="inline-block bg-red-950/40 text-red-400 border border-red-900/50 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                {t.retrograde}
                              </span>
                            ) : (
                              <span className="inline-block bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                {t.direct}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Embedded Vedic Clock Visual Ornament - Fantastic aesthetic feature */}
      {dailyPanchang && activeTab === 'daily' && (
        <section className="mt-12 bg-stone-900/30 border border-stone-800 rounded-2xl p-6 text-center relative overflow-hidden flex flex-col items-center gap-6" id="cosmic-clock-section">
          <div className="max-w-md w-full">
            <h3 className="text-sm font-display font-bold text-sacred-gold tracking-widest uppercase mb-1">
              ⚜️ {t.vedicClock}
            </h3>
            <p className="text-[11px] text-stone-400 font-sans mb-6">
              {language === 'en' 
                ? 'Representing the 24-hour diurnal cycle mapped as a 360° circular mandala relative to daylight:' 
                : 'दिन-रात के २४ घंटों (६० घटी) के कालचक्र को सूर्योदय-सूर्यास्त के सापेक्ष चक्र रूप में निरूपण:'}
            </p>

            {/* Glowing clock dial */}
            <div className="relative w-64 h-64 mx-auto rounded-full border border-sacred-gold/30 bg-stone-950 flex items-center justify-center p-8 shadow-inner shadow-black">
              {/* Outer dial indicators */}
              <div className="absolute inset-2 rounded-full border border-stone-900 border-dashed" />
              
              <div className="absolute top-4 text-[9px] font-mono text-orange-400 tracking-wider font-bold">SOLAR NOON</div>
              <div className="absolute bottom-4 text-[9px] font-mono text-stone-500 tracking-wider font-bold">SOLAR MIDNIGHT</div>
              <div className="absolute right-4 text-[9px] font-mono text-slate-400 tracking-wider font-bold">SUNSET</div>
              <div className="absolute left-4 text-[9px] font-mono text-amber-500 tracking-wider font-bold">SUNRISE</div>

              {/* Central Saffron Circle with OM */}
              <div className="w-24 h-24 rounded-full bg-stone-900/90 border border-sacred-gold/40 flex flex-col items-center justify-center shadow-lg relative z-10">
                <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] text-sacred-gold">🕉️</span>
                <span className="text-[9px] font-mono text-neutral-300 font-bold block mt-1">
                  {formatSimpleTime(selectedDate)}
                </span>
              </div>

              {/* Rotating sun pointer */}
              <motion.div 
                className="absolute inset-0 z-0"
                style={{ originX: 0.5, originY: 0.5 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-1 left-1/2 -translate-x-1/2 text-lg filter drop-shadow-[0_0_5px_rgba(255,90,31,0.5)]">🌞</div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs font-sans text-stone-300 max-w-sm mx-auto mt-6">
              <div className="bg-stone-950/80 border border-stone-850 px-3 py-2 rounded-lg" id="din-mana-display">
                <strong className="text-[10px] uppercase font-display text-neutral-500 tracking-wider block mb-0.5">Dinamana (दिनमान)</strong>
                <span className="font-mono text-amber-400 font-bold">{Math.floor(dailyPanchang.dayDurationMinutes / 60)}h {Math.round(dailyPanchang.dayDurationMinutes % 60)}m</span>
              </div>
              <div className="bg-stone-950/80 border border-stone-850 px-3 py-2 rounded-lg" id="ratri-mana-display">
                <strong className="text-[10px] uppercase font-display text-neutral-500 tracking-wider block mb-0.5">Ratrimana (रात्रिमान)</strong>
                <span className="font-mono text-indigo-400 font-bold">{Math.floor(dailyPanchang.nightDurationMinutes / 60)}h {Math.round(dailyPanchang.nightDurationMinutes % 60)}m</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer credits and information */}
      <footer className="text-center mt-12 py-6 border-t border-stone-900/80 relative z-10" id="sanatan-footer-credits">
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
