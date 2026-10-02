import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; bn: string }> = {
  'app.title': { en: 'Dhaka Bus Finder', bn: 'ঢাকা বাস ফাইন্ডার' },
  'app.tagline': { en: 'Find Your Bus in Dhaka', bn: 'ঢাকায় আপনার বাস খুঁজুন' },
  'app.subtitle': { en: 'Search direct and transfer-based bus routes across Dhaka city', bn: 'ঢাকা শহরের সরাসরি এবং ট্রান্সফার ভিত্তিক বাস রুট খুঁজুন' },
  'nav.home': { en: 'Home', bn: 'হোম' },
  'nav.findBus': { en: 'Find Bus', bn: 'বাস খুঁজুন' },
  'nav.allBuses': { en: 'All Buses', bn: 'সকল বাস' },
  'nav.locations': { en: 'Locations', bn: 'স্থানসমূহ' },
  'nav.about': { en: 'About', bn: 'সম্পর্কে' },
  'nav.admin': { en: 'Admin', bn: 'অ্যাডমিন' },
  'search.from': { en: 'From', bn: 'হতে' },
  'search.to': { en: 'To', bn: 'গন্তব্য' },
  'search.findBuses': { en: 'Find Buses', bn: 'বাস খুঁজুন' },
  'search.swap': { en: 'Swap', bn: 'অদলবদল' },
  'search.placeholder': { en: 'Search location...', bn: 'স্থান খুঁজুন...' },
  'results.direct': { en: 'Direct Bus', bn: 'সরাসরি বাস' },
  'results.1transfer': { en: '1 Transfer', bn: '১টি ট্রান্সফার' },
  'results.transfers': { en: 'transfers', bn: 'টি ট্রান্সফার' },
  'results.stops': { en: 'stops', bn: 'টি স্টপ' },
  'results.viewRoute': { en: 'View Route', bn: 'রুট দেখুন' },
  'results.viewJourney': { en: 'View Journey', bn: 'যাত্রা দেখুন' },
  'results.noResults': { en: 'No buses found for this route', bn: 'এই রুটে কোনো বাস পাওয়া যায়নি' },
  'results.tryTransfer': { en: 'Try different locations', bn: 'ভিন্ন স্থান চেষ্টা করুন' },
  'results.changeAt': { en: 'Change at', bn: 'পরিবর্তন করুন' },
  'results.boardAt': { en: 'Board at', bn: 'উঠুন' },
  'results.alightAt': { en: 'Get off at', bn: 'নামুন' },
  'results.yourJourney': { en: 'Your Journey', bn: 'আপনার যাত্রা' },
  'results.searchResults': { en: 'Search Results', bn: 'অনুসন্ধানের ফলাফল' },
  'results.journeysFound': { en: 'journeys found', bn: 'টি যাত্রা পাওয়া গেছে' },
  'bus.type': { en: 'Type', bn: 'ধরন' },
  'bus.hours': { en: 'Operating Hours', bn: 'সেবার সময়' },
  'bus.route': { en: 'Route', bn: 'রুট' },
  'bus.allStops': { en: 'All Stops', bn: 'সকল স্টপ' },
  'bus.search': { en: 'Search buses...', bn: 'বাস খুঁজুন...' },
  'bus.allBuses': { en: 'All Buses', bn: 'সকল বাস' },
  'bus.busesAt': { en: 'Buses at', bn: 'এখানে বাস' },
  'bus.commonRoutes': { en: 'Common Routes', bn: 'সাধারণ রুট' },
  'bus.startingPoint': { en: 'Starting Point', bn: 'শুরুর স্থান' },
  'bus.destination': { en: 'Destination', bn: 'গন্তব্য' },
  'error.notFound': { en: 'Page Not Found', bn: 'পৃষ্ঠা পাওয়া যায়নি' },
  'error.notFoundDesc': { en: 'The page you are looking for does not exist.', bn: 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই।' },
  'error.goHome': { en: 'Go Home', bn: 'হোমে যান' },
  'error.findBus': { en: 'Find a Bus', bn: 'বাস খুঁজুন' },
  'loading': { en: 'Loading...', bn: 'লোড হচ্ছে...' },
  'about.title': { en: 'About Dhaka Bus Finder', bn: 'ঢাকা বাস ফাইন্ডার সম্পর্কে' },
  'about.desc': { en: 'Dhaka Bus Finder helps you navigate the city\'s bus network. Find direct routes, plan transfers, and explore bus routes across Dhaka.', bn: 'ঢাকা বাস ফাইন্ডার আপনাকে শহরের বাস নেটওয়ার্কে নেভিগেট করতে সাহায্য করে। সরাসরি রুট খুঁজুন, ট্রান্সফার পরিকল্পনা করুন এবং ঢাকার বাস রুট অন্বেষণ করুন।' },
  'about.feature1': { en: 'Find direct bus routes between any two locations', bn: 'যেকোনো দুটি স্থানের মধ্যে সরাসরি বাস রুট খুঁজুন' },
  'about.feature2': { en: 'Discover transfer options when no direct bus is available', bn: 'সরাসরি বাস না পেলে ট্রান্সফার অপশন আবিষ্কার করুন' },
  'about.feature3': { en: 'Explore complete bus routes with visual timeline', bn: 'ভিজ্যুয়াল টাইমলাইন সহ সম্পূর্ণ বাস রুট অন্বেষণ করুন' },
  'about.feature4': { en: 'Browse all buses and locations in Dhaka', bn: 'ঢাকার সকল বাস এবং স্থান ব্রাউজ করুন' },
  'locations.allLocations': { en: 'All Locations', bn: 'সকল স্থান' },
  'locations.searchPlaceholder': { en: 'Search locations...', bn: 'স্থান খুঁজুন...' },
  'locations.busesHere': { en: 'buses serve this location', bn: 'টি বাস এই স্থানে চলাচল করে' },
  'footer.rights': { en: 'All rights reserved', bn: 'সর্বস্বত্ব সংরক্ষিত' },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'bn' || saved === 'en') return saved;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return language === 'bn' ? entry.bn : entry.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
