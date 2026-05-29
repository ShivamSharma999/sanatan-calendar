// lib/panchang-helpers.ts

export type SubLanguage = 'en' | 'hi';

export const LANG_LABELS: Record<SubLanguage, Record<string, string>> = {
  en: {
    title: 'Sanatan Calendar',
    subtitle: 'Vedic Panchang & Cosmic Clock',
    selectDate: 'Select Date',
    location: 'Location',
    requestLocation: 'Use GPS Location',
    detectionActive: 'Location Active',
    defaultLocation: 'Default (Ujjain)',
    monthView: 'Month View',
    dailyPanchang: 'Daily Panchang',
    upcomingFestivals: 'Upcoming Festivals',
    muhurtasTime: 'Auspicious & Inauspicious Times',
    planetaryPositions: 'Planetary Positions (Graha Spashta)',
    adhikMasa: 'Adhik (Leap) Month',
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    karana: 'Karana',
    vara: 'Vara (Weekday)',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    moonrise: 'Moonrise',
    moonset: 'Moonset',
    samvat: 'Samvat Years',
    vikramSamvat: 'Vikram Samvat',
    shakaSamvat: 'Shaka Samvat',
    solarMonth: 'Solar Month',
    lunarMonth: 'Lunar Month',
    rashi: 'Rashi (Zodiac)',
    sunRashi: 'Surya Rashi',
    moonRashi: 'Chandra Rashi',
    sunNakshatra: 'Surya Nakshatra',
    ayanamsa: 'Ayanamsa',
    rahukalam: 'Rahu Kalam',
    yamaganda: 'Yamaganda',
    gulikakalam: 'Gulika Kalam',
    abhijit: 'Abhijit Muhurta',
    brahma: 'Brahma Muhurta',
    durmuhurta: 'Dur Muhurta',
    varjyam: 'Varjyam (Inauspicious)',
    amritkala: 'Amrit Kalam',
    bhadrakalam: 'Bhadra Kalam',
    gandmula: 'Ganda Mula',
    anandadi: 'Anandadi Yoga',
    choghadiya: 'Choghadiya (Day/Night Dividers)',
    hora: 'Hora Slots',
    grahas: 'Graha (Planets)',
    sign: 'Zodiac Sign',
    degree: 'Degree',
    retrograde: 'Retrograde',
    direct: 'Direct',
    festivals: 'Key Festivals & Vrats',
    noFestivals: 'No major festivals/observances on this day.',
    activeAtSunrise: 'Active at sunrise',
    endsAt: 'Ends at',
    auspicious: 'Auspicious (शुभ)',
    inauspicious: 'Inauspicious (अशुभ)',
    neutral: 'Neutral (मध्यम)',
    purnimantaActive: 'Purnimanta (North Indian System) is active for Lunar Month calculations.',
    searchingLocation: 'Detecting Location...',
    locationSuccess: 'Location updated!',
    locationError: 'Failed to access GPS. Using default (Ujjain).',
    vedicClock: 'Vedic Cosmic Clock',
  },
  hi: {
    title: 'सनातन कैलेंडर',
    subtitle: 'वैदिक पञ्चांग एवं ब्रह्मांडीय घड़ी',
    selectDate: 'तिथि चुनें',
    location: 'स्थान',
    requestLocation: 'जीपीएस स्थान का उपयोग करें',
    detectionActive: 'स्थान सक्रिय है',
    defaultLocation: 'डिफ़ॉल्ट (उज्जैन)',
    monthView: 'मासिक दृश्य',
    dailyPanchang: 'दैनिक पञ्चांग',
    upcomingFestivals: 'आगामी पर्व एवं त्योहार',
    muhurtasTime: 'शुभ एवं अशुभ समय',
    planetaryPositions: 'ग्रह स्पष्ट (ग्रहों की स्थिति)',
    adhikMasa: 'अधिक मास (लीप)',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    vara: 'वार (दिन)',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    moonrise: 'चन्द्रोदय',
    moonset: 'चन्द्रास्त',
    samvat: 'संवत वर्ष',
    vikramSamvat: 'विक्रम संवत',
    shakaSamvat: 'शक संवत',
    solarMonth: 'सौर मास',
    lunarMonth: 'चन्द्र मास',
    rashi: 'राशि (चंद्र)',
    sunRashi: 'सूर्य राशि',
    moonRashi: 'चंद्र राशि',
    sunNakshatra: 'सूर्य नक्षत्र',
    ayanamsa: 'अयनांश',
    rahukalam: 'राहु काल',
    yamaganda: 'यमगण्ड',
    gulikakalam: 'गुलिक काल',
    abhijit: 'अभिजित मुहूर्त',
    brahma: 'ब्रह्म मुहूर्त',
    durmuhurta: 'दुर्मुहूर्त',
    varjyam: 'वर्ज्यम (अशुभ)',
    amritkala: 'अमृत काल',
    bhadrakalam: 'भद्रा काल',
    gandmula: 'गण्डमूल नक्षत्र',
    anandadi: 'आनन्दादि योग',
    choghadiya: 'चौघड़िया (दिन/रात)',
    hora: 'होरा चक्र',
    grahas: 'नवग्रह स्थिति',
    sign: 'राशि चक्र',
    degree: 'अंश',
    retrograde: 'वक्र (Retrograde)',
    direct: 'मार्गी',
    festivals: 'प्रमुख पर्व एवं व्रत',
    noFestivals: 'इस दिन कोई प्रमुख व्रत या उत्सव नहीं है।',
    activeAtSunrise: 'सूर्योदय के समय सक्रिय',
    endsAt: 'समाप्ति काल',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'मध्यम',
    purnimantaActive: 'चंद्र मास की गणना पूर्णिमान्त (उत्तर भारतीय प्रणाली) के अनुसार की जा रही है।',
    searchingLocation: 'स्थान खोजा जा रहा है...',
    locationSuccess: 'स्थान अद्यतन किया गया!',
    locationError: 'जीपीएस निष्क्रिय। उज्जैन स्थान का उपयोग किया गया।',
    vedicClock: 'वैदिक ब्रह्मांडीय घड़ी',
  },
};

export const MONTHS_MAP: Record<SubLanguage, string[]> = {
  en: ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'],
  hi: ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'],
};

export const TITHIS_MAP: Record<SubLanguage, string[]> = {
  en: [
    'Pratipada (1)', 'Dwitiya (2)', 'Tritiya (3)', 'Chaturthi (4)', 'Panchami (5)',
    'Shashti (6)', 'Saptami (7)', 'Ashtami (8)', 'Navami (9)', 'Dashami (10)',
    'Ekadashi (11)', 'Dwadashi (12)', 'Trayodashi (13)', 'Chaturdashi (14)', 'Purnima (15)',
    'Pratipada (1)', 'Dwitiya (2)', 'Tritiya (3)', 'Chaturthi (4)', 'Panchami (5)',
    'Shashti (6)', 'Saptami (7)', 'Ashtami (8)', 'Navami (9)', 'Dashami (10)',
    'Ekadashi (11)', 'Dwadashi (12)', 'Trayodashi (13)', 'Chaturdashi (14)', 'Amavasya (30)'
  ],
  hi: [
    'प्रतिपदा (१)', 'द्वितीया (२)', 'तृतीया (३)', 'चतुर्थी (४)', 'पंचमी (५)',
    'षष्ठी (६)', 'सप्तमी (७)', 'अष्टमी (८)', 'नवमी (९)', 'दशमी (१०)',
    'एकादशी (११)', 'द्वादशी (१२)', 'त्रयोदशी (१३)', 'चतुर्दशी (१४)', 'पूर्णिमा (१५)',
    'प्रतिपदा (१)', 'द्वितीया (२)', 'तृतीया (३)', 'चतुर्थी (४)', 'पंचमी (५)',
    'षष्ठी (६)', 'सप्तमी (७)', 'अष्टमी (८)', 'नवमी (९)', 'दशमी (१०)',
    'एकादशी (११)', 'द्वादशी (१२)', 'त्रयोदशी (१३)', 'चतुर्दशी (१४)', 'अमावस्या (३०)'
  ],
};

export const PAKSHA_MAP: Record<SubLanguage, Record<string, string>> = {
  en: { Shukla: 'Shukla Paksha (Waxing Moon) 🌒', Krishna: 'Krishna Paksha (Waning Moon) 🌘' },
  hi: { Shukla: 'शुक्ल पक्ष 🌒', Krishna: 'कृष्ण पक्ष 🌘' },
};

export const NAKSHATRAS_MAP: Record<SubLanguage, string[]> = {
  en: [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ],
  hi: [
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'अश्लेषा',
    'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
    'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'
  ],
};

export const YOGAS_MAP: Record<SubLanguage, string[]> = {
  en: [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shoola',
    'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha',
    'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
  ],
  hi: [
    'विष्कम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल',
    'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतिपात', 'वरीयान', 'परिघ',
    'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'
  ],
};

export const KARANAS_MAP: Record<SubLanguage, string[]> = {
  en: ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti (Bhadra)', 'Shakuni', 'Chatuspada', 'Naga', 'Kintughna'],
  hi: ['बव', 'बालव', 'कौलव', 'तैतिल', 'गरिज', 'वणिज', 'विष्टि (भद्रा)', 'शकुनि', 'चतुष्पाद', 'नाग', 'किन्तुघ्न'],
};

export const VARA_MAP: Record<SubLanguage, string[]> = {
  en: ['Aditya-vara (Sunday) ☀️', 'Soma-vara (Monday) 🌙', 'Mangala-vara (Tuesday) 🔴', 'Budha-vara (Wednesday) 🟢', 'Guru-vara (Thursday) 🟡', 'Shukra-vara (Friday) ⚪', 'Shani-vara (Saturday) 🟣'],
  hi: ['रविवार (आदित्यवार) ☀️', 'सोमवार 🌙', 'मंगलवार 🔴', 'बुधवार 🟢', 'गुरुवार (बृहस्पतिवार) 🟡', 'शुक्रवार ⚪', 'शनिवार 🟣'],
};

export const RASHI_MAP: Record<SubLanguage, { name: string; symbol: string }[]> = {
  en: [
    { name: 'Mesha (Aries)', symbol: '♈' },
    { name: 'Vrishabha (Taurus)', symbol: '♉' },
    { name: 'Mithuna (Gemini)', symbol: '♊' },
    { name: 'Karka (Cancer)', symbol: '♋' },
    { name: 'Simha (Leo)', symbol: '♌' },
    { name: 'Kanya (Virgo)', symbol: '♍' },
    { name: 'Tula (Libra)', symbol: '♎' },
    { name: 'Vrishchika (Scorpio)', symbol: '♏' },
    { name: 'Dhanu (Sagittarius)', symbol: '♐' },
    { name: 'Makara (Capricorn)', symbol: '♑' },
    { name: 'Kumbha (Aquarius)', symbol: '♒' },
    { name: 'Meena (Pisces)', symbol: '♓' }
  ],
  hi: [
    { name: 'मेष', symbol: '♈' },
    { name: 'वृषभ', symbol: '♉' },
    { name: 'मिथुन', symbol: '♊' },
    { name: 'कर्क', symbol: '♋' },
    { name: 'सिंह', symbol: '♌' },
    { name: 'कन्या', symbol: '♍' },
    { name: 'तुला', symbol: '♎' },
    { name: 'वृश्चिक', symbol: '♏' },
    { name: 'धनु', symbol: '♐' },
    { name: 'मकर', symbol: '♑' },
    { name: 'कुम्भ', symbol: '♒' },
    { name: 'मीन', symbol: '♓' }
  ],
};

export const GRAHA_MAP: Record<SubLanguage, Record<string, string>> = {
  en: {
    Sun: 'Surya (Sun) ☀️',
    Moon: 'Chandra (Moon) 🌙',
    Mars: 'Mangal (Mars) 🔴',
    Mercury: 'Budha (Mercury) 🟢',
    Jupiter: 'Guru (Jupiter) 🟡',
    Venus: 'Shukra (Venus) ⚪',
    Saturn: 'Shani (Saturn) 🟣',
    Rahu: 'Rahu (North Node) 🌚',
    Ketu: 'Ketu (South Node) 🌑',
  },
  hi: {
    Sun: 'सूर्य ☀️',
    Moon: 'चंद्र 🌙',
    Mars: 'मंगल 🔴',
    Mercury: 'बुध 🟢',
    Jupiter: 'गुरु (बृहस्पति) 🟡',
    Venus: 'शुक्र ⚪',
    Saturn: 'शनि 🟣',
    Rahu: 'राहु 🌚',
    Ketu: 'केतु 🌑',
  },
};

/**
 * Gets a beautifully animated lunar phase emoji based on the Tithi index (0-29).
 */
export function getMoonPhaseEmoji(tithiIndex: number): string {
  if (tithiIndex === 14) return '🌕'; // Purnima (Full Moon)
  if (tithiIndex === 29) return '🌑'; // Amavasya (New Moon)
  
  if (tithiIndex < 14) {
    // Shukla paksha (0 to 13)
    if (tithiIndex < 4) return '🌒';
    if (tithiIndex < 10) return '🌓';
    return '🌔';
  } else {
    // Krishna paksha (15 to 28)
    const relativeIndex = tithiIndex - 15;
    if (relativeIndex < 4) return '🌖';
    if (relativeIndex < 10) return '🌗';
    return '🌘';
  }
}

/**
 * Returns complete Purnimanta Month String with Adhika prefix if isAdhika is true.
 */
export function getPurnimantaMonthDisplay(
  purnimantaIndex: number,
  isAdhika: boolean,
  lang: SubLanguage
): string {
  const baseMonth = MONTHS_MAP[lang][purnimantaIndex] || '';
  if (isAdhika) {
    if (lang === 'en') return `Adhika ${baseMonth}`;
    if (lang === 'hi') return `अधिक ${baseMonth}`;
  }
  return baseMonth;
}

export function formatTimePeriod(start: Date | null, end: Date | null, timeZoneOffsetMinutes: number = 330): string {
  if (!start) return '--:--';
  const formatTime = (d: Date) => {
    // Return in local HH:MM client/requested format
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  if (!end) return `${formatTime(start)}`;
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function formatSimpleTime(d: Date | null): string {
  if (!d) return '--:--';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}
