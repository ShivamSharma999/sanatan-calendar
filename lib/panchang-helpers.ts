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

export function getTithiDescription(index: number, lang: SubLanguage): string {
  const normIndex = index % 15;
  if (index === 14) { // Purnima
    return lang === 'en'
      ? 'Purnima is a day of fullness and spiritual abundance. Highly favorable for Satyanarayan Puja, charity, meditation, and bathing in sacred rivers to wash away inner obstacles.'
      : 'पूर्णिमा पूर्णता और आध्यात्मिक समृद्धि का पावन दिवस है। श्रीसत्यनारायण व्रत कथा, दान-पुण्य, ध्यान साधना एवं पवित्र नदियों में स्नान हेतु यह सर्वश्रेष्ठ तिथि मानी जाती है।';
  }
  if (index === 29) { // Amavasya
    return lang === 'en'
      ? 'Amavasya is dedicated to ancestral remembrance and inner reflection. Favorable for Pitru Tarpan, charity, and silent introspection to calm the mind.'
      : 'अमावस्या पितृ देवों की स्मृति, श्रद्धा अर्पण एवं मौन ध्यान हेतु समर्पित तिथि है। इस दिन तर्पण, दान व अंतर्दर्शन करने से मानसिक शांति एवं पितृ दोष से मुक्ति मिलती है।';
  }
  
  const descriptionsEn = [
    'Pratipada is the starting day of the lunar cycle. Favorable for planning, setting divine intentions, and sowing seeds of action.',
    'Dwitiya is rules by Brahma. It is ideal for laying foundations of new works, building assets, and social harmony.',
    'Tritiya is ruled by Goddess Gauri. It is highly auspicious for marriage ceremonies, domestic peace, and culinary arts.',
    'Chaturthi is ruled by Lord Ganesha. It brings focus and removing obstacles. Best for fasting and prayers to Ganesha.',
    'Panchami is ruled by Goddess Saraswati or Snake lords. Highly favorable for learning, arts, wisdom initiation, and remedies.',
    'Shashti is ruled by Lord Kartikeya. Excellent day to build discipline, physical vigor, and victory over competitive obstacles.',
    'Saptami is ruled by Surya Dev. Best day for health remedies, offering Arghya, and starting long journeys.',
    'Ashtami is ruled by Goddess Durga. Highly charged spiritual energy. Favorable for worship, temple visits, and seeking protection.',
    'Navami is ruled by Goddess Durga and Lord Rama. Represents triumph of righteousness over dark forces. Best for persistent effort.',
    'Dashami is ruled by Yamaraj or Ten directions. Extremely auspicious for beginning commerce, career shifts, and legal victories.',
    'Ekadashi is ruled by Lord Vishnu. The premier day for fasting (Vrat), spiritual study, and chanting to attain mental clarity and high vibrations.',
    'Dwadashi is ruled by Vishnu. It is considered highly beneficial for breaking fasts, donating to the needy, and spiritual reading.',
    'Trayodashi is rules by Lord Shiva (Pradosha). Favorable for Shiva Puja, evening prayers, and healing negative karmic tendencies.',
    'Chaturdashi is rules by Goddess Kali or Lord Shiva. Intense energy. Best suited for spiritual protection mantras and clearing obstacles.'
  ];

  const descriptionsHi = [
    'प्रतिपदा चंद्र मास की शुरुआत का दिन है। यह नए कार्यों की योजना बनाने और ईश्वरीय संकल्प लेने हेतु अनुकूल है।',
    'द्वितीया तिथि के स्वामी ब्रह्मा जी हैं। यह नए प्रोजेक्ट की नींव रखने, संपत्ति निर्माण एवं सामाजिक संबंधों के सुधार हेतु उत्तम है।',
    'तृतीया गौरी माता को समर्पित है। यह गृह-शांति, वैवाहिक चर्चा, मांगलिक कार्य एवं कलाओं की उन्नति के लिए श्रेष्ठ है।',
    'चतुर्थी के स्वामी विघ्नहर्ता भगवान गणेश हैं। यह संकल्प शक्ति सुदृढ़ करने एवं विघ्नों के निवारण हेतु व्रत-पूजा के लिए उत्तम है।',
    'पंचमी विद्या की देवी माँ सरस्वती को समर्पित है। अक्षर-आरंभ, विद्या अध्ययन, कला साधना एवं नए कौशल सीखने हेतु सर्वोत्तम है।',
    'षष्ठी के स्वामी भगवान कार्तिकेय हैं। यह दिन शारीरिक बल संवर्धन, प्रतियोगिता में विजय एवं अनुशासन निर्माण हेतु हितकारी है।',
    'सप्तमी सूर्य देव की पावन तिथि है। आरोग्य लाभ, आदित्य हृदय स्तोत्र पाठ, सूर्य अर्घ्य एवं लंबी यात्रा के लिए उपयुक्त मानी जाती है।',
    'अष्टमी माँ दुर्गा की दिव्य ऊर्जा का दिन है। यह शक्ति आराधना, कुलदेवी पूजन तथा सुरक्षा कवच के अनुष्ठान हेतु अत्यधिक प्रभावशाली है।',
    'नवमी प्रभु श्री राम एवं माँ सिद्धिदात्री की पावन तिथि है। यह अधर्म पर धर्म की विजय दर्शाती है; गंभीर साधना हेतु उत्तम है।',
    'दशमी दिगपालों की तिथि है। व्यावसायिक शुरुआत, नौकरी में परिवर्तन, सरकारी कार्यों एवं न्याय सम्बन्धी निर्णयों हेतु शुभ है।',
    'एकादशी भगवान विष्णु की अत्यंत प्रिय तिथि है। उपवास (व्रत), मानसिक शुद्धि, भागवत कथा श्रवण एवं जाप हेतु सर्वश्रेष्ठ दिन।',
    'द्वादशी व्रत पारण करने, दान-दक्षिणा देने, समाज सेवा एवं विष्णु सहस्रनाम के पाठ हेतु विशेष रूप से फलदायी है।',
    'त्रयोदशी भगवान शिव (प्रदोष काल) की मंगलकारी तिथि है। शिव आराधना, रुद्राभिषेक एवं पुरानी व्याधियों से मुक्ति हेतु अत्यंत लाभकारी।',
    'चतुर्दशी भगवान शिव और महाकाली की उग्र ऊर्जा की तिथि है। इस दिन तंत्र-मंत्र बाधा शांति एवं आध्यात्मिक आत्मरक्षा अनुष्ठान किए जाते हैं।'
  ];

  return lang === 'en' ? descriptionsEn[normIndex] : descriptionsHi[normIndex];
}

export function getNakshatraDescription(index: number, lang: SubLanguage): string {
  const descriptionsEn = [
    'Ashwini represents quick action and vitality. Ruled by Ashwini Kumars, the celestial healers. Excellent for starting medical treatment and sports.',
    'Bharani represents birth, transformation, and discipline. Ruled by Yama. Favorable for artistic creative output and solid work.',
    'Krittika signifies fiery purification and courage. Ruled by Agni. Favorable for taking decisive actions, technical installations, and debates.',
    'Rohini represents growth, beauty, and emotional depth. Ruled by Brahma. Highly auspicious for creative design, romance, and purchases of clothing.',
    'Mrigashirsha represents search, curiosity, and comfort. Ruled by Soma. Favorable for traveling, exploring, research work, and friendly meetings.',
    'Ardra represents storm, emotional clearing, and breakthrough. Ruled by Rudra. Good for resolving long-standing conflicts and research.',
    'Punarvasu represents return of light and renewal. Ruled by Aditi. Highly favorable for starting negotiations, buying houses, and spiritual practice.',
    'Pushyami represents supreme nourishment and spiritual wisdom. Ruled by Brihaspati. The most auspicious star for starting long-term investments and studies.',
    'Ashlesha represents deep intuition, occult secrets, and intensity. Ruled by Sarpas. Favorable for strategic business deals and defensive measures.',
    'Magha represents royal lineage, pride, and ancestral strength. Ruled by Pitru Devas. Excellent for administrative planning and respecting elders.',
    'Purva Phalguni represents relaxed creativity, passion, and artistic joy. Ruled by Bhaga. Best for celebrations, poetry, music, and social events.',
    'Uttara Phalguni represents relationship harmony, loyalty, and patronage. Ruled by Aryaman. Auspicious for long-term oaths and marriages.',
    'Hasta represents dexterity, manual skills, and manifestation. Ruled by Savitur. Favorable for craftsmanship, trade negotiations, and holistic healing.',
    'Chitra represents fine craftsmanship, architecture, and beauty. Ruled by Vishvakarma. Best for building, designing websites, fashion, and construction.',
    'Swati represents balance, independent spirit, and flexible growth. Ruled by Vayu. Excellent for starting trade transport, public speaking, and education.',
    'Vishakha represents focus, double goals, and ultimate triumph. Ruled by Indra & Agni. Favorable for long-term target setting and perseverance.',
    'Anuradha represents friendship, divine love, and core devotion. Ruled by Mitra. Highly favorable for organizing events, spiritual gatherings, and deep yoga.',
    'Jyeshtha represents elderly wisdom, leadership, and protection. Ruled by Indra. Favorable for taking charge of family issues and business protection.',
    'Mula represents laying deep roots, uncovering truth, and foundations. Ruled by Nirriti. Ideal for deep scientific research or garden planting.',
    'Purva Ashadha represents indomitable spirit, victory, and water element. Ruled by Apas. Auspicious for water-related projects, travel, and courage.',
    'Uttara Ashadha represents universal victory, righteousness, and focus. Ruled by Vishvadevas. Excellent day for beginning construction or oath ceremonies.',
    'Shravana represents divine hearing, deep listening, and traditional wisdom. Ruled by Vishnu. Outstanding day for teaching, listening to scriptures, and planning.',
    'Dhanishta represents cosmic rhythm, wealth manifestation, and music. Ruled by Vasus. Highly favorable for public gatherings, launching software, and arts.',
    'Shatabhisha represents hundred healers, mystical cures, and media focus. Ruled by Varuna. Exceptional for medical research, healing therapies, and astronomy.',
    'Purva Bhadrapada represents spiritual ascension, intense focus, and tapas. Ruled by Aja Ekapada. Excellent for yoga, meditation, and deep concentration.',
    'Uttara Bhadrapada represents stable foundation, wisdom of depth, and peace. Ruled by Ahirbudhnya. Favorable for home settlement, vows, and investments.',
    'Revati represents final journey, safe transition, wealth, and empathy. Ruled by Pushan, the protector of travelers. Best for traveling and creative arts.'
  ];

  const descriptionsHi = [
    'अश्विनी शीघ्रता, नव-ऊर्जा और देव-वैधों के हीलिंग प्रभाव का प्रतिनिधित्व करता है। चिकित्सा आरंभ करने एवं खेल-कूद की विधियों हेतु उत्तम नक्षत्र।',
    'भरणी का अर्थ जन्म, रचनात्मक परिवर्तन एवं यम देव की कर्मशीलता है। जटिल संकल्पों को पूरा करने तथा कलात्मक रचनाओं के संपादन हेतु उत्तम।',
    'कृत्तिका अग्नि और शुद्धिकरण का प्रतीक है। इसके स्वामी सूर्यदेव हैं। यह मुकदमों, वाद-विवाद, तकनीकी कार्य एवं साहसिक गतिविधियों हेतु अनुकूल है।',
    'रोहिणी संवर्धन, सौंदर्य और मानसिक समृद्धि का प्रतिनिधित्व करती है। इसके स्वामी चंद्रदेव हैं। नया वस्त्र खरीदने, गृहप्रवेश एवं विवाह हेतु अत्यंत शुभ।',
    'मृगशिरा जिज्ञासा, खोज एवं मित्रता का भाव जागृत करता है। अनुसंधान कार्यों, संगीत-कला के सुभारंभ एवं मैत्री सम्बन्ध मजबूत करने हेतु सर्वश्रेष्ठ।',
    'आर्द्रा तूफानी आवेग एवं भावनात्मक शुद्धता का परिचायक है। इसके स्वामी रुद्र (शिव) हैं। पुरानी समस्याओं के निवारण एवं गंभीर शोध कार्य हेतु उत्तम।',
    'पुनर्वसु समृद्धि और जीवन में पुनः प्रकाश की वापसी दर्शाता है। मांगलिक कार्यों के आरंभ, नवीन वाहन क्रय करने एवं नए घर की स्थापना हेतु अनुकूल।',
    'पुष्य सभी नक्षत्रों का सम्राट है; ज्ञान और परम पोषण का नक्षत्र। दीर्घकालिक निवेशों, व्यवसाय शुभारंभ एवं विद्यारंभ हेतु सर्वोत्कृष्ट नक्षत्र।',
    'अश्लेषा गहरी अंतर्दृष्टि, कूटनीति और तीव्रता का प्रतीक है। इसके स्वामी सर्प देव हैं। रणनीति बनाने एवं सुरक्षात्मक कार्यों को लागू करने हेतु उपयुक्त।',
    'मघा राजसी तेज, स्वाभिमान और पितृ देवों की दिव्य ऊर्जा का प्रतीक है। प्रशासनिक कार्यों, पूर्वजों के प्रति सम्मान प्रकट करने एवं नेतृत्व हेतु उत्तम।',
    'पूर्वाफाल्गुनी कला, ऐश्वर्य, आराम और सांसारिक सुखों का प्रतिनिधित्व करता है। कलात्मक प्रतियोगिताओं, उत्सवों एवं मनोरंजन शुभारंभ हेतु शुभ।',
    'उत्तराफाल्गुनी दीर्घकालिक निष्ठा और मैत्रीपूर्ण समझौतों का नक्षत्र है। विवाह बंधन, नए संधियों पर हस्ताक्षर एवं दान-पुण्य हेतु अति उत्तम।',
    'हस्त हस्तकौशल, शिल्प और त्वरित मानसिक गणना का नक्षत्र है। व्यापारिक सौदों, चित्रकारी, लेखन एवं स्वास्थ्य उपचार आरंभ करने के लिए उत्तम।',
    'चित्रा कलात्मक शिल्पकला और विश्वकर्मा देव के सृजन का नक्षत्र है। वास्तुकला, गृह-निर्माण, वस्त्र-डिजाइनिंग एवं सौंदर्यीकरण हेतु सर्वश्रेष्ठ।',
    'स्वाती संतुलन, स्वतंत्र सोच और वायु देव की चंचलता का नक्षत्र है। सार्वजनिक भाषणों, विदेश यात्रा, व्यापार विस्तार एवं उच्च शिक्षा हेतु हितकारी।',
    'विशाखा महत्वाकांक्षा, दृढ़ संकल्प और लक्ष्य प्राप्ति का प्रतीक है। इसके स्वामी इंद्र-अग्नि हैं। प्रतियोगिता तथा संकल्प साधना हेतु अनुकूल।',
    'अनुराधा मित्रता, भक्ति (राधा भाव) और सामंजस्य का प्रतीक है। सामूहिक आयोजनों, कीर्तन साधना, ध्यान शिविर एवं नए मित्रों से सहयोग पाने हेतु शुभ।',
    'ज्येष्ठा गुरुता, नेतृत्व कौशल और रक्षात्मक नियंत्रण का प्रतीक है। ज्येष्ठ परिवार के निर्णयों, व्यावसायिक सुरक्षा एवं साहस दिखाने में फलदायी।',
    'मूल सत्य की गहरी खोज और जीवन के आधारभूत सत्य को खोजने का नक्षत्र है। वृक्षारोपण, गहरे वैज्ञानिक शोध एवं पुरानी आदतों को बदलने हेतु उत्तम।',
    'पूर्वाषाढ़ा अजेय उत्साह और जल देव की प्रवाहमयी ऊर्जा का नक्षत्र है। जल प्रबन्धन, यात्राओं के आरंभ एवं साहसिक कार्यों हेतु सर्वोत्तम।',
    'उत्तराषाढ़ा सार्वभौमिक विजय, कर्मठता और आत्मविश्वास का नक्षत्र है। सामाजिक योजनाओं की शुरुआत, नींव रखने एवं शपथ ग्रहण करने हेतु श्रेष्ठ।',
    'श्रवण ईश्वरीय संदेशों के श्रवण और विद्या प्राप्ति का नक्षत्र है। गुरु दीक्षा, शास्त्रों के पठन-पाठन एवं योजना निर्माण हेतु अत्यंत मांगलिक नक्षत्र।',
    'धनिष्ठा लयबद्ध संगीत और अष्ट वसुओं के ऐश्वर्य का नक्षत्र है। जनसभाओं, नए ऐप्स के लॉन्च, संगीत-कला एवं वित्त योजनाओं हेतु उत्तम नक्षत्र।',
    'शतभिषा चिकित्सकीय चमत्कारों और वरुण देव की सूक्ष्म अंतर्दृष्टि का नक्षत्र है। नई दवाइयों के सेवन, शोध कार्य एवं ध्यान लगाने हेतु सर्वोत्तम।',
    'पूर्वाभाद्रपद आध्यात्मिक तप और संकल्प शक्ति का उच्चतम स्तर है। ध्यान क्रिया, योगाभ्यास, मानसिक दृढ़ता एवं एकांत साधना हेतु अनुशंसित।',
    'उत्तराभाद्रपद शांति, स्थायी समृद्धि और गहरे संतोष का द्योतक है। दीर्घकालिक निवेशों, प्रतिज्ञाओं के पालन एवं स्थायी योजनाओं हेतु श्रेष्ठ।',
    'रेवती सुरक्षित यात्रा, परोपकार और सुखद अंत का नक्षत्र है। इसके स्वामी पूषा देव हैं। कला साधना एवं यात्रा पर प्रस्थान हेतु परम शुभ।'
  ];

  return lang === 'en' ? descriptionsEn[index % 27] : descriptionsHi[index % 27];
}
