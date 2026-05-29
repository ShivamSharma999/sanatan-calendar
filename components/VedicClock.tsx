'use client';

import React from 'react';
import { motion } from 'motion/react';
import { type DailyPanchangResult } from 'panchang-ts';
import { type SubLanguage, formatSimpleTime } from '../lib/panchang-helpers';

interface VedicClockProps {
  dailyPanchang: DailyPanchangResult;
  selectedDate: Date;
  language: SubLanguage;
  t: Record<string, string>;
}

export function VedicClock({ dailyPanchang, selectedDate, language, t }: VedicClockProps) {
  return (
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
  );
}
