'use client';

import React from 'react';
import { motion } from 'motion/react';
import { type FestivalDay } from 'panchang-ts';
import { type SubLanguage } from '../lib/panchang-helpers';

interface UpcomingFestivalsViewProps {
  upcomingFestivals: FestivalDay[];
  language: SubLanguage;
  t: Record<string, string>;
  handleDayClick: (date: Date) => void;
}

export function UpcomingFestivalsView({ upcomingFestivals, language, t, handleDayClick }: UpcomingFestivalsViewProps) {
  return (
    <motion.div
      key="festivals-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="bg-sacred-card border border-sacred-gold/15 rounded-2xl p-5 md:p-6 shadow-2xl relative font-sans"
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
                className="bg-stone-900 hover:bg-stone-850/80 border border-stone-800 hover:border-sacred-gold/25 rounded-xl p-4 transition-all duration-300 group cursor-pointer shadow-md flex items-start gap-3 justify-between font-sans"
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

                <div className="flex flex-col items-end shrink-0 gap-1.5 font-sans">
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
  );
}
