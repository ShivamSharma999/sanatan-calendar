'use client';

import React from 'react';
import { motion } from 'motion/react';
import { type PlanetaryPositions } from 'panchang-ts';
import { 
  type SubLanguage, 
  GRAHA_MAP, 
  RASHI_MAP, 
  NAKSHATRAS_MAP 
} from '../lib/panchang-helpers';

interface PlanetaryPositionsViewProps {
  planets: PlanetaryPositions;
  language: SubLanguage;
  t: Record<string, string>;
}

export function PlanetaryPositionsView({ planets, language, t }: PlanetaryPositionsViewProps) {
  return (
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
          <tbody className="divide-y divide-stone-950 font-medium text-stone-200 font-sans">
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
  );
}
