'use client';

import React from 'react';
import { motion } from 'motion/react';
import { type DailyPanchangResult } from 'panchang-ts';
import { type SubLanguage, formatTimePeriod } from '../lib/panchang-helpers';

interface MuhurtasViewProps {
  dailyPanchang: DailyPanchangResult;
  language: SubLanguage;
  t: Record<string, string>;
}

export function MuhurtasView({ dailyPanchang, language, t }: MuhurtasViewProps) {
  return (
    <motion.div
      key="muhurta-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8 font-sans"
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
  );
}
