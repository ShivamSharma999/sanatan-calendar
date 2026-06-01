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
  type SubLanguage,
  TITHIS_MAP,
  NAKSHATRAS_MAP,
  YOGAS_MAP,
  KARANAS_MAP,
  RASHI_MAP,
  getMoonPhaseEmoji,
  getPurnimantaMonthDisplay,
  formatSimpleTime,
  formatTimePeriod
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

function getTithiDescription(index: number, language: SubLanguage): string {
  const isShukla = index < 15;
  const modIndex = index % 15;
  
  if (language === 'hi') {
    const descriptions = [
      "प्रतिपदा: नए कार्यों के शुभारंभ, गृह प्रवेश, धार्मिक अनुष्ठान और मंगल कार्यों के लिए अत्यंत शुभ तिथि है।",
      "द्वितीया: गृह निर्माण, विवाह, संपत्ति क्रय और यात्राओं के लिए उत्तम मानी जाती है।",
      "तृतीया: कला, संगीत, विद्यारंभ, मुंडन संस्कार और मांगलिक कार्यों के लिए समृद्धि प्रदान करने वाली तिथि है।",
      "चतुर्थी: भगवान गणेश की पावन तिथि। यह विघ्नों को हरने वाली है; इस दिन बड़े सांसारिक उद्यमों से बचना चाहिए।",
      "पंचमी: विद्या प्राप्ति, देव पूजन, विवाह तथा दीर्घकालिक यात्राओं के आरंभ के लिए परम फलदायी है।",
      "षष्ठी: भगवान कार्तिकेय से संबंधित। यश, विजय, आरोग्यता और शत्रुओं पर विजय प्राप्त करने के लिए उत्तम है।",
      "सप्तमी: भगवान सूर्य देव की ऊर्जा से युक्त। आरोग्यता, समृद्धि और महत्वपूर्ण राजकीय कार्यों के लिए उत्तम।",
      "अष्टमी: देवी दुर्गा और भगवान कृष्ण का पावन दिन। साधना, साधना सिद्धि तथा आध्यात्मिक कार्यों के लिए विशेष।",
      "नवमी: भगवान राम के जन्मोत्सव की तिथि। यह शक्ति संचय, देव पूजन तथा संकल्प शक्ति की सफलता के लिए अनुकूल है।",
      "दशमी: विजय और मान-सम्मान की प्राप्ति के लिए। यह सभी प्रकार के शुभ एवं नवीन उपक्रमों के लिए अनुकूल है।",
      "एकादशी: पूर्णतः भगवान विष्णु को समर्पित। व्रत, ध्यान, दान एवं चित्त की शुद्धि के लिए सर्वश्रेष्ठ महातिथि।",
      "द्वादशी: यज्ञ, गृह प्रवेश, यात्रा एवं परोपकार के कार्यों के लिए विशेष कल्याणकारी मानी गई है।",
      "त्रयोदशी: भगवान शिव की ऊर्जा से युक्त (प्रदोष काल)। दीर्घायु, आरोग्य तथा शत्रु दमन के कार्यों के लिए मंगलकारी।",
      "चतुर्दशी: भगवान शिव की विशेष तिथि (शिवरात्रि)। तंत्र-मंत्र साधना, शुद्धि और ध्यान के लिए परम सिद्ध मानी गई है।",
      "पूर्णिमा: पूर्ण चन्द्रमा की चमत्कारी ऊर्जा। मानसिक शांति, सत्यनारायण पूजन, दान-पुण्य और उत्सवों के लिए सर्वश्रेष्ठ।"
    ];
    if (index === 29) {
      return "अमावस्या: पितृ पूजन, तर्पण, ध्यान और मानसिक शांति के लिए सर्वश्रेष्ठ दिन। सांसारिक कार्यों को टालना उचित रहता है।";
    }
    return descriptions[modIndex] || "सामान्य वैदिक तिथि। दान, जप एवं स्वाध्याय के लिए उपयुक्त दिवस।";
  } else {
    const descriptions = [
      "Pratipada: Highly auspicious for beginning new ventures, housewarming, vows, and sacred ceremonies.",
      "Dwitiya: Excellent for laying foundations, marriage, asset acquisition, and starting journeys.",
      "Tritiya: Bestows prosperity; ideal for arts, music, initiation of education, and weddings.",
      "Chaturthi: Lord Ganesha's sacred tithi. Ideal for seeking obstacles removal, but worldly ventures can be delayed.",
      "Panchami: Extremely beneficial for educational pursuits, learning, unions, and travel.",
      "Shashti: Associated with Lord Kartikeya. Promotes courage, health, victory over challenges, and discipline.",
      "Saptami: Governed by the Sun Lord. Infuses high physical energy, ideal for solar energy alignment and active tasks.",
      "Ashtami: Sacred to Durga and Krishna. Deeply spiritual; suitable for inner introspection and meditation.",
      "Navami: Rooted in Ram Navami. Ideal for cultivating willpower, devotion, and performing sacred trials.",
      "Dashami: The day of victory (Vijay). Strongly favors building expansion and launching grand projects.",
      "Ekadashi: Extremely powerful period dedicated to Lord Vishnu. Perfect for fasting, charity, and meditation.",
      "Dwadashi: Highly favorable for spiritual sacrifices, benevolent acts, traveling, and construction.",
      "Trayodashi: Blessed by Lord Shiva (Pradosh). Favors healing, restoring relationships, and community work.",
      "Chaturdashi: Shivaratri energy. Ideal for deep cleaning, overcoming negative habits, and profound meditation.",
      "Purnima: Full Moon phase. Flooded with serene mental power; perfect for spiritual congregation, devotion, and celebrations."
    ];
    if (index === 29) {
      return "Amavasya: Deep spiritual introspection, paying homage to ancestors (Tarpan), and charitable work. Avoid initiating major material milestones.";
    }
    return descriptions[modIndex] || "A neutral Vedic day best suited for daily responsibilities, study, and simple spiritual awareness.";
  }
}

function getNakshatraDescription(index: number, language: SubLanguage): string {
  if (language === 'hi') {
    const nakshatraNames = [
      "अश्विनी: तीव्र गति, आरोग्यता और नवीन नवीन आविष्कारों तथा यात्राओं को आरंभ करने के लिए उत्तम नक्षत्र है।",
      "भरणी: यम शासित नक्षत्र। यह संयम, सत्य की खोज तथा कठोर परिवर्तनों के लिए फलदायी है।",
      "कृत्तिका: अग्नि प्रधान नक्षत्र। शुद्धि, बहस, बौद्धिक कार्य तथा पुरानी आदतों के विनाश के लिए उत्तम।",
      "रोहिणी: सर्वश्रेष्ठ नक्षत्रों में से एक। कला, कृषि, प्रेम, विवाह तथा रचनात्मक गतिविधियों के लिए परम शुभ।",
      "मृगशिरा: खोज, अन्वेषण, यात्रा और सौम्य मांगलिक कार्यों के लिए अत्यंत सुखद और मंगलকারী।",
      "आर्द्रा: रुद्र शासित नक्षत्र। यह संघर्षों, समस्याओं को दूर करने तथा संकल्पों को सुदृढ़ करने के लिए अनुकूल है।",
      "पुनर्वसु: अनुकूलता, पुनः प्राप्ति, मानसिक शांति तथा धार्मिक शिक्षा आरंभ करने के लिए सर्वश्रेष्ठ।",
      "पुष्य: देवों का पोषण करने वाला परम कल्याणकारी नक्षत्र। खरीदारी, नए व्यापार और पूजा संपादन के लिए सर्वश्रेष्ठ।",
      "अश्लेषा: कुटिल एवं रणनीतिक कार्यों के लिए अनुकूल। अपनी सीमाओं को सुरक्षित करने के लिए उत्तम।",
      "मघा: पूर्वजों के आशीर्वाद से युक्त। पैतृक संपत्ति, राज्याभिषेक तथा नेतृत्व विकास के कार्यों के लिए उत्तम।",
      "पूर्वाफाल्गुनी: आनंद, आराम, कला और रचनात्मकता की ऊर्जा से समृद्ध। सामाजिक संबंधों के लिए उत्तम।",
      "उत्तराफाल्गुनी: समाज कल्याण, विवाह, संधि तथा दीर्घकालिक संबंधों के निर्माण के लिए अति उत्तम।",
      "हस्त: कौशल, शिल्प, कला, हस्तकला और हंसमुख व्यवहार से जुड़े कार्यों के लिए अत्यंत शुभ नक्षत्र।",
      "चित्रा: विश्वकर्मा शासित नक्षत्र। यह वास्तुकला, कला, वस्त्र डिजाइनिंग और सुंदरता निखारने के लिए विशेष है।",
      "स्वाती: स्वतंत्र विचार, विदेशों से जुड़े व्यापार, शिक्षा तथा व्यापारिक संधियों के लिए परम अनुकूल।",
      "विशाखा: लक्ष्य की प्राप्ति, विजय, नए उद्यमों के निर्माण तथा नेतृत्व संभालने के लिए सफल नक्षत्र।",
      "अनुराधा: सहयोग, मित्रता, संगठन बनाने तथा दूरगामी योजनाओं के क्रियान्वयन के लिए सर्वश्रेष्ठ।",
      "ज्येष्ठा: नेतृत्व, गुरुता, रणनीतिक निर्णय लेने तथा परिवार के संरक्षण के कार्यों के लिए श्रेष्ठ नक्षत्र।",
      "मूल: गहरा अनुसंधान, जड़ों की ओर लौटना, सत्य की खोज तथा अनावश्यक विकृतियों को काटने के लिए अनुकूल।",
      "पूर्वाषाढ़ा: कलात्मक प्रतिभा, जल से जुड़े व्यापार, विवाद सुलझाने तथा साहस प्रदर्शन के लिए उत्तम।",
      "उत्तराषाढ़ा: लंबे समय तक चलने वाले कार्यों, कानूनी जीत, दृढ़ता तथा संस्थागत नींव रखने के लिए सर्वश्रेष्ठ।",
      "श्रवण: ज्ञान अर्जन, वेद पाठ, धार्मिक कथा श्रवण तथा नए शैक्षिक उपक्रमों के लिए परम शुभ।",
      "धनिष्ठा: संगीत, कला, वित्तीय सफलता तथा संपत्ति संचय के लिए अत्यधिक लाभकारी नक्षत्र माना जाता है।",
      "शतभिषा: राहु शासित नक्षत्र; इसे सौ वैद्यों का नक्षत्र कहा जाता है। चिकित्सा, ध्यान और तकनीकी शोध के लिए उत्तम।",
      "पूर्वाभाद्रपद: ध्यान, गहराई से सोचने, गुप्त ज्ञान तथा जीवन के गहरे रहस्यों को समझने के लिए अनुकूल।",
      "उत्तराभाद्रपद: स्थिरता, गहरे ध्यान, दूसरों की भलाई करने तथा दीर्घकालिक संकल्पों को मजबूत करने के लिए उत्तम।",
      "रेवती: सुखद यात्रा, कला, सुरक्षा, जानवरों की भलाई तथा प्रेम बढ़ाने के लिए सर्वश्रेष्ठ एवं कोमल नक्षत्र।"
    ];
    return nakshatraNames[index] || "वैदिक नक्षत्र। सकारात्मक विचार एवं कर्मों के लिए अनुकूल समय।";
  } else {
    const nakshatraNames = [
      "Ashwini: Governs vitality and rapid movement. Highly favorable for medical therapy, sports, and starting new ventures.",
      "Bharani: Ruled by Yama. Ideal for hard transformations, letting go, cleaning and disciplined trials.",
      "Krittika: Solar fire energy. Promotes logic, analysis, debate, breaking outdated habits, and purity.",
      "Rohini: The symbol of prosperity and growth. Highly favored for creativity, weddings, agriculture, and high art.",
      "Mrigashirsha: The searching star. Perfect for discovery, traveling, research, and minor domestic tasks.",
      "Ardra: Governed by Rudra. Fosters resilience, overcoming storm-like obstacles, and deep emotional healing.",
      "Punarvasu: The return of light. Excellent for reconciliation, starting projects anew, and studying philosophy.",
      "Pushya: Nourishing and deeply auspicious. Perfect for physical trade, purchasing valuable assets, and spiritual rituals.",
      "Ashlesha: Strategically strong; suitable for boundary defenses, analyzing hidden factors, and energetic work.",
      "Magha: Rooted in ancestral lineage. Highly favors leadership transitions, state honors, and cultural inheritance.",
      "Purva Phalguni: Generates warmth and relaxation. Favors celebration, fine arts, music, and social romance.",
      "Uttara Phalguni: Excellent for long-term alliances, civil unions, deep contracts, and societal community growth.",
      "Hasta: Associated with precision and manual skill. Great for learning magic, crafts, manufacturing, and commerce.",
      "Chitra: Guided by Vishwakarma. Promotes architects, construction, gemstone designing, and majestic beauty creations.",
      "Swati: The star of independent wind. Excellent for foreign trade, publishing, travel, and adjusting strategies.",
      "Vishakha: Focused determination. Favors achieving targeted results, winning competitions, and launching strong efforts.",
      "Anuradha: Promotes organic friendships, network integration, joint travel, and cooperative development.",
      "Jyeshtha: Seniority and strategic defense. Best for advising, leading groups, and protecting core family assets.",
      "Mula: Roots research. Favors botany, medicine, digging deep queries, and dissolving false systems.",
      "Purva Ashadha: Unconquerable spirit. Excellent for setting sail, creative challenges, and legal confrontation.",
      "Uttara Ashadha: Highly enduring. Governs laying foundations of major businesses, legal triumphs, and long vows.",
      "Shravana: The star of hearing. Highly auspicious for publishing, listening, academic studies, and peaceful retreats.",
      "Dhanishtha: Bestows physical and spiritual resonance. Excellent for music, purchase of properties, and accumulation.",
      "Shatabhisha: Star of a hundred healers. Supports medical cures, technology integration, yoga, and meditation.",
      "Purva Bhadrapada: Deep cosmic focus. Favors discovering secrets, esoteric studies, and letting go of pride.",
      "Uttara Bhadrapada: Promotes spiritual peace. Perfect for establishing lifelong habits, meditative ease, and helping others.",
      "Revati: Harmonious and gentle. Favors nice travel, purchase of vehicles, fine cooking, and spreading kindness."
    ];
    return nakshatraNames[index] || "A neutral Vedic star favoring continuous efforts, deep contemplation, and everyday tasks.";
  }
}

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

  // Sacred Lunar Cycle week values
  const moonPhasesForWeek = useMemo(() => {
    const phases = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      let phaseEmoji = '🌒';
      let tName = '';
      try {
        const panchang = getDailyPanchang(d, customLocation, {
          timezone: -selectedDate.getTimezoneOffset(),
          masaSystem: 'purnimanta',
          computeEndTimes: false,
          language: language
        });
        if (panchang && panchang.tithis[0]) {
          phaseEmoji = getMoonPhaseEmoji(panchang.tithis[0].index);
          tName = TITHIS_MAP[language][panchang.tithis[0].index].split(' ')[0];
        }
      } catch (e) {
        console.error("Error computing phase for week", e);
      }
      const dayLabel = d.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { weekday: 'short' });
      phases.push({
        date: d,
        emoji: phaseEmoji,
        dayLabel: dayLabel,
        tithiName: tName,
        isSelected: i === 0
      });
    }
    return phases;
  }, [selectedDate, customLocation, language]);

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
                  ? 'border-orange-600 text-orange-600 dark:text-amber-505 dark:border-amber-500 font-bold' 
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'शुभ मुहूर्त' : 'Muhurtas'}
            </button>
            <button
              onClick={() => setActiveTab('graha')}
              className={`pb-1 border-b-2 transition-all outline-none cursor-pointer ${
                activeTab === 'graha' 
                  ? 'border-orange-600 text-orange-600 dark:text-amber-505 dark:border-amber-500 font-bold' 
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
            <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-amber-500 shadow-sm" />
            <span className="font-semibold">{t.location}:</span>
            <span className="text-orange-850 dark:text-orange-400 font-bold">{locationName}</span>
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
                    const parsed = new Date(e.target.value);
                    setSelectedDate(parsed);
                    setCurrentMonthYear({ month: parsed.getMonth(), year: parsed.getFullYear() });
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
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer ${language === 'en' ? 'bg-gradient-to-r from-orange-600 to-amber-505 text-white font-bold' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container Wrapper */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        
        {/* Majestic Split Hero Banner with Animated Saffron/Celestial SVGs */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl mb-10 h-64 md:h-80 bg-gradient-to-br from-stone-950 via-stone-900 to-[#1c140c] flex items-center" id="sanatan-hero-banner">
          
          {/* Constellation Line Art Backdrop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-30">
            <svg className="absolute inset-0 w-full h-full text-amber-500/10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="con-star-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                  <circle cx="40" cy="40" r="1.5" fill="currentColor" />
                  <line x1="40" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="40" y1="40" x2="40" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#con-star-pattern)" />
              <circle cx="50%" cy="50%" r="20%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
              <circle cx="50%" cy="50%" r="35%" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" />
            </svg>
          </div>

          {/* Celestial Halos and Sunset Glares */}
          <div className="absolute -left-1/4 -top-1/4 w-[100%] h-[150%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/15 via-orange-900/5 to-transparent pointer-events-none" />
          <div className="absolute right-10 top-0 w-80 h-80 rounded-full bg-gradient-to-br from-amber-500/5 to-orange-500/5 blur-3xl pointer-events-none" />
          
          {/* Subtle horizontal gradient overlay to transition from deep gold to dark */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/60 to-transparent" />

          {/* Hero Left Text Frame */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 md:p-10 max-w-xl z-10">
            <h2 className="text-xs uppercase font-display tracking-widest text-amber-500 font-bold mb-1">
              {language === 'hi' ? 'सत्यं शिवं सुन्दरम्' : 'Divine Celestial Calculations'}
            </h2>
            <h3 className="text-xl md:text-3xl font-bold font-display leading-tight text-white mb-3">
              {language === 'hi' ? 'सनातन कैलेंडर: आधुनिक खगोलशास्त्र से संचालित प्रामाणिक पञ्चांग' : 'Sanatan Calendar: Your Daily Guide to Hindu Time & Traditions'}
            </h3>
            <p className="text-xs md:text-sm text-amber-100/90 mb-5 font-sans leading-relaxed tracking-wide">
              {language === 'hi' 
                ? 'सटीक सूर्योदय, सूर्यास्त तथा शुभ-अशुभ काल गणना' 
                : 'Real-time high fidelity astronomy, sun calculations, and key traditional festival alignments.'}
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
          <div className="absolute right-12 w-16 h-16 hidden md:flex items-center justify-center rounded-full bg-stone-950/80 border border-amber-500/35 text-amber-400 text-2xl font-bold hover:scale-108 transition-all duration-300">
            🕉️
          </div>
        </div>

        {/* Dynamic Navigation for Mobile (Tab Picker) */}
        <nav className="flex md:hidden flex-wrap gap-2 mb-8 justify-center z-10 relative font-sans" id="app-navigation-tabs">
          {[
            { key: 'daily', icon: '🕉️', name: language === 'hi' ? 'दैनिक पञ्चांग' : 'Daily Panchang' },
            { key: 'month', icon: '📅', name: language === 'hi' ? 'मास फल (ग्रिड)' : 'Month Grid' },
            { key: 'festivals', icon: '🔔', name: language === 'hi' ? 'पर्व एवं त्योहार' : 'Festivals' },
            { key: 'muhurta', icon: '⏱️', name: language === 'hi' ? 'शुभ-अशुभ मुहूर्त' : 'Muhurtas' },
            { key: 'graha', icon: '🌌', name: language === 'hi' ? 'ग्रह स्पष्ट' : 'Graha Spashta' }
          ].map((tab) => (
            <button
              key={tab.key}
              id={`tab-navigation-${tab.key}`}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-2.5 rounded-xl border text-[11px] font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1.5 outline-none ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-orange-600 to-sacred-gold border-sacred-gold text-white font-bold shadow-md' 
                  : 'bg-sacred-card/60 border-stone-800 text-stone-400'
              }`}
            >
              <span className="text-xs shrink-0">{tab.icon}</span>
              <span>{tab.name.split(' ')[0]}</span>
            </button>
          ))}
        </nav>

        {/* Primary Panels Content */}
        <main className="relative z-10" id="main-content-display">
          <AnimatePresence mode="wait">
            {activeTab === 'daily' && dailyPanchang && (
              <div className="space-y-10" id="today-sacred-day-anchor">
                
                {/* Visual Accent Header - Today's Sacred Day Card */}
                <div className="bg-sacred-card border-l-4 border-l-sacred-orange border-y border-r border-[#e8dcc4] dark:border-stone-800 rounded-r-2xl p-6 shadow-md shadow-amber-500/5">
                  <span className="text-[10px] tracking-widest text-sacred-orange font-bold uppercase font-sans">
                    🚩 {language === 'hi' ? 'आज का कल्याणकारी पवित्र काल' : 'TODAY\'S CHRONO OBSERVATION'}
                  </span>
                  
                  {/* Title Info */}
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 mt-1.5">
                    <h3 className="text-xl md:text-3xl font-bold tracking-wide font-display text-amber-850 dark:text-amber-500">
                      {getPurnimantaMonthDisplay(dailyPanchang.chandramasa.purnimantaIndex, dailyPanchang.chandramasa.isAdhika, language)} मास • {language === 'hi' ? (dailyPanchang.tithis[0]?.paksha === 'Shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष') : (dailyPanchang.tithis[0]?.paksha === 'Shukla' ? 'Shukla Paksha' : 'Krishna Paksha')}
                    </h3>
                    <span className="text-xs text-stone-500 font-medium">
                      ({language === 'hi' ? `${dailyPanchang.samvat.vikramSamvat} विक्रम संवत` : `Vikram Samvat ${dailyPanchang.samvat.vikramSamvat}`})
                    </span>
                  </div>

                  {/* Five Beautiful Astronomical Horology Badges */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mt-6">
                    
                    {/* Tithi Card */}
                    <div className="bg-stone-900/5 dark:bg-stone-900/40 border border-amber-500/10 rounded-xl p-3 text-left">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">🌕 {language === 'hi' ? 'तिथि / Tithi' : 'Tithi'}</span>
                      <p className="text-sm font-extrabold text-amber-850 dark:text-amber-400 mt-1 truncate">
                        {dailyPanchang.tithis[0] ? TITHIS_MAP[language][dailyPanchang.tithis[0].index].split(' ')[0] : '--'}
                      </p>
                      <span className="text-[9px] text-stone-600 dark:text-stone-400 mt-1 block">
                        {language === 'hi' ? 'विशेष प्रभाव काल अंत:' : 'Ends at'} {dailyPanchang.tithis[0]?.endTime ? formatSimpleTime(dailyPanchang.tithis[0].endTime) : '--'}
                      </span>
                    </div>

                    {/* Nakshatra Card */}
                    <div className="bg-stone-900/5 dark:bg-stone-900/40 border border-amber-500/10 rounded-xl p-3 text-left">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">⭐ {language === 'hi' ? 'नक्षत्र' : 'Nakshatra'}</span>
                      <p className="text-sm font-extrabold text-amber-850 dark:text-amber-400 mt-1 truncate">
                        {dailyPanchang.nakshatras[0] ? NAKSHATRAS_MAP[language][dailyPanchang.nakshatras[0].index] : '--'}
                      </p>
                      <span className="text-[9px] text-stone-600 dark:text-stone-400 mt-1 block">
                        {language === 'hi' ? 'अंत समय:' : 'Ends at'} {dailyPanchang.nakshatras[0]?.endTime ? formatSimpleTime(dailyPanchang.nakshatras[0].endTime) : '--'}
                      </span>
                    </div>

                    {/* Yoga Card */}
                    <div className="bg-stone-900/5 dark:bg-stone-900/40 border border-amber-500/10 rounded-xl p-3 text-left">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">⚡ {language === 'hi' ? 'योग / Yoga' : 'Yoga'}</span>
                      <p className="text-sm font-extrabold text-amber-850 dark:text-amber-400 mt-1 truncate">
                        {dailyPanchang.yogas[0] ? YOGAS_MAP[language][dailyPanchang.yogas[0].index] : '--'}
                      </p>
                      <span className="text-[9px] text-stone-600 dark:text-stone-400 mt-1 block">
                        {language === 'hi' ? 'अंत समय:' : 'Ends at'} {dailyPanchang.yogas[0]?.endTime ? formatSimpleTime(dailyPanchang.yogas[0].endTime) : '--'}
                      </span>
                    </div>

                    {/* Karana Card */}
                    <div className="bg-stone-900/5 dark:bg-stone-900/40 border border-amber-500/10 rounded-xl p-3 text-left">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">🌀 {language === 'hi' ? 'करण / Karana' : 'Karana'}</span>
                      <p className="text-sm font-extrabold text-amber-850 dark:text-amber-400 mt-1 truncate">
                        {dailyPanchang.karanas[0] ? KARANAS_MAP[language][dailyPanchang.karanas[0].index] : '--'}
                      </p>
                      <span className="text-[9px] text-stone-600 dark:text-stone-400 mt-1 block">
                        {language === 'hi' ? 'अंत समय:' : 'Ends at'} {dailyPanchang.karanas[0]?.endTime ? formatSimpleTime(dailyPanchang.karanas[0].endTime) : '--'}
                      </span>
                    </div>

                    {/* Solar Month Card */}
                    <div className="bg-stone-900/5 dark:bg-stone-900/40 border border-amber-500/10 rounded-xl p-3 text-left">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">☀️ {language === 'hi' ? 'सूर्य वास' : 'Solar Sign'}</span>
                      <p className="text-sm font-extrabold text-[#78350f] dark:text-amber-500 mt-1 truncate">
                        {RASHI_MAP[language][dailyPanchang.suryaNakshatra.index % 12]?.name || '--'}
                      </p>
                      <span className="text-[9px] text-stone-600 dark:text-stone-400 mt-1 block text-glow-orange font-semibold">
                        Ayanamsa: {formattedAyanamsa.split(' ')[0]}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Grid Split Content columns for detailed Panchang calculations and week Moon phase bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Main column : Timing Tables and Explanations */}
                  <div className="lg:col-span-8 space-y-8">
                    
                    {/* Educational Text Cards explaining significance of active Tithi & Nakshatra */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Tithi Detail Explanation */}
                      <div className="bg-sacred-card border border-[#e8dcc4] dark:border-stone-850 rounded-2xl p-5 shadow-sm text-left">
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                          🕉️ {language === 'hi' ? 'तिथि वैशिष्ट्य सूचक' : 'Tithi Spiritual Influence'}
                        </h4>
                        <p className="text-sm font-bold text-stone-900 dark:text-amber-50 mt-1.5">
                          {dailyPanchang.tithis[0] ? TITHIS_MAP[language][dailyPanchang.tithis[0].index] : '--'}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-300 pointer-events-none mt-2 leading-relaxed font-sans">
                          {dailyPanchang.tithis[0] ? getTithiDescription(dailyPanchang.tithis[0].index, language) : ''}
                        </p>
                      </div>

                      {/* Nakshatra Detail Explanation */}
                      <div className="bg-sacred-card border border-[#e8dcc4] dark:border-stone-850 rounded-2xl p-5 shadow-sm text-left">
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                          ✨ {language === 'hi' ? 'नक्षत्र प्रभाव सूचक' : 'Nakshatra Astral Current'}
                        </h4>
                        <p className="text-sm font-bold text-stone-900 dark:text-amber-50 mt-1.5">
                          {dailyPanchang.nakshatras[0] ? NAKSHATRAS_MAP[language][dailyPanchang.nakshatras[0].index] : '--'}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-300 pointer-events-none mt-2 leading-relaxed font-sans">
                          {dailyPanchang.nakshatras[0] ? getNakshatraDescription(dailyPanchang.nakshatras[0].index, language) : ''}
                        </p>
                      </div>

                    </div>

                    {/* Embedded Full Details View */}
                    <DailyPanchangView
                      dailyPanchang={dailyPanchang}
                      language={language}
                      t={t}
                      selectedDate={selectedDate}
                      formattedAyanamsa={formattedAyanamsa}
                    />

                  </div>

                  {/* Right Column: Mini calendar moon cycle + quick list upcoming festivals */}
                  <div className="lg:col-span-4 space-y-8 text-left">
                    
                    {/* Lunar Cycle Transit tracker card */}
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg relative overflow-hidden text-center text-white font-sans">
                      <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
                      <h4 className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-4 flex items-center justify-center gap-2">
                        <span>🌖</span> {language === 'hi' ? 'सप्त दिवसीय चन्द्र कला अनुक्रम' : 'Sacred Lunar Transit'}
                      </h4>
                      
                      {/* Horisontal week cycle buttons */}
                      <div className="grid grid-cols-7 gap-1">
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
                      
                      <div className="text-[10px] text-stone-400 mt-4 border-t border-stone-800 pt-3">
                        {language === 'hi' ? 'प्रत्येक दिन पर क्लिक कर तुरंत उस दिन का पञ्चांग फल आकलित करें।' : 'Click any lunar node shortcut to immediately inspect that day\'s complete horology.'}
                      </div>
                    </div>

                    {/* Live Festival observer feed panel card */}
                    <div className="bg-sacred-card border border-[#e8dcc4] dark:border-stone-850 rounded-2xl p-5 shadow-md">
                      <h4 className="text-xs uppercase tracking-wider text-sacred-orange font-bold mb-4 flex items-center gap-1.5">
                        🚩 {language === 'hi' ? 'आगामी व्रत महोत्सव' : 'Next Religious Festivals'}
                      </h4>

                      {/* Display 3 upcoming festivals dynamically computed from upcoming range */}
                      <div className="space-y-3">
                        {upcomingFestivals.slice(0, 4).length > 0 ? (
                          upcomingFestivals.slice(0, 4).map((fDay, fIdx) => (
                            <div 
                              key={fIdx}
                              onClick={() => setSelectedDate(fDay.date)}
                              className="group p-3 border border-stone-100 hover:border-amber-300 dark:border-stone-900 dark:hover:border-amber-500/20 rounded-xl hover:bg-amber-50/20 dark:hover:bg-stone-900/30 font-sans text-left transition-all cursor-pointer relative"
                            >
                              <div className="pr-12 text-left">
                                <p className="text-xs font-bold text-stone-900 dark:text-orange-100 tracking-wide uppercase">
                                  {fDay.festival.name}
                                </p>
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                                  {fDay.date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                {fDay.festival.description && (
                                  <p className="text-[10px] text-stone-550 dark:text-stone-400 font-medium mt-1 leading-normal line-clamp-2">
                                    {fDay.festival.description}
                                  </p>
                                )}
                              </div>
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 group-hover:text-sacred-gold transition-colors font-mono">
                                ➔
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-6">
                            {language === 'hi' ? 'गणना सूची सक्रिय की जा रही है, "त्योहार" टैब पर क्लिक करें' : 'Computing observances list. Tap on "Festivals" above to resolve entire range feed.'}
                          </p>
                        )}
                      </div>

                    </div>

                  </div>

                </div>

              </div>
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
        <footer className="text-center mt-12 py-6 border-t border-[#e8dcc4] dark:border-stone-850 relative z-10 font-sans" id="sanatan-footer-credits">
          <p className="text-[11px] font-mono text-stone-500 tracking-widest uppercase">
            Sanatan Calendar is computed in real-time. Offline calculations via high-fidelity astronomy algorithms.
          </p>
          <p className="text-[10px] text-amber-600/60 mt-1 font-display tracking-widest uppercase">
            अवन्तिका देशे उज्जयिन्यां निवासः | 🕉️ सर्वं ब्रह्ममयम् 🕉️
          </p>
        </footer>
      </div>

    </div>
  );
}
