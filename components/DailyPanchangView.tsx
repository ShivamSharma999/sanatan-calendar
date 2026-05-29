'use client';

import React from 'react';
import { motion } from 'motion/react';
import { type DailyPanchangResult } from 'panchang-ts';
import { Clock, Sun, Moon, BellRing } from 'lucide-react';
import { 
  type SubLanguage, 
  getPurnimantaMonthDisplay, 
  getMoonPhaseEmoji, 
  VARA_MAP, 
  TITHIS_MAP, 
  NAKSHATRAS_MAP, 
  YOGAS_MAP, 
  KARANAS_MAP, 
  RASHI_MAP, 
  formatSimpleTime 
} from '../lib/panchang-helpers';

interface DailyPanchangViewProps {
  dailyPanchang: DailyPanchangResult;
  language: SubLanguage;
  t: Record<string, string>;
  selectedDate: Date;
  formattedAyanamsa: string;
}

export function DailyPanchangView({
  dailyPanchang,
  language,
  t,
  selectedDate,
  formattedAyanamsa,
}: DailyPanchangViewProps) {
  return (
    <motion.div
      key="daily-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8 font-sans"
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
              <p className="flex items-center gap-1.5 mt-1.5 font-sans">
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
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col gap-2 font-mono">
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
              <span className="text-amber-500 font-semibold truncate max-w-[125px]">
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
          <div className="absolute right-3 top-3 opacity-10 pointer-events-none font-sans">
            <BellRing className="w-16 h-16 text-sacred-gold" />
          </div>
          <h3 className="text-xs uppercase font-display tracking-widest font-bold text-sacred-gold flex items-center gap-1.5 mb-3">
            <span>🔔</span> {t.festivals}
          </h3>
          {dailyPanchang.festivals.length > 0 ? (
            <ul className="flex flex-col gap-2 relative z-10 font-sans">
              {dailyPanchang.festivals.map((festival, fIdx) => (
                <li key={fIdx} className="bg-stone-950 border border-stone-800/80 hover:border-sacred-orange/40 rounded-xl p-3 flex flex-col gap-1 transition-colors font-sans">
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
  );
}
