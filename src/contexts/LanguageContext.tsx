import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; bn: string }> = {
  'app.title': { en: 'Dhaka Bus Finder', bn: 'ঢাকা বাস ফাইন্ডার' },
  'app.tagline': { en: 'Find your bus in Dhaka', bn: 'ঢাকায় আপনার বাস খুঁজুন' },
  'app.subtitle': { en: 'Direct buses and smart transfer routes, ranked for your journey.', bn: 'সরাসরি বাস এবং স্মার্ট ট্রান্সফার রুট, আপনার যাত্রার জন্য সাজানো।' },
  'app.network': { en: 'Dhaka Bus Network', bn: 'ঢাকা বাস নেটওয়ার্ক' },
  'nav.home': { en: 'Home', bn: 'হোম' },
  'nav.allBuses': { en: 'Buses', bn: 'বাস' },
  'nav.locations': { en: 'Locations', bn: 'স্থান' },
  'nav.about': { en: 'About', bn: 'সম্পর্কে' },
  'nav.admin': { en: 'Admin', bn: 'অ্যাডমিন' },
  'nav.feedback': { en: 'Feedback', bn: 'ফিডব্যাক' },
  'search.from': { en: 'From', bn: 'হতে' },
  'search.to': { en: 'To', bn: 'গন্তব্য' },
  'search.findBuses': { en: 'Find buses', bn: 'বাস খুঁজুন' },
  'search.swap': { en: 'Swap', bn: 'অদলবদল' },
  'search.placeholder': { en: 'Search location…', bn: 'স্থান খুঁজুন…' },
  'search.sameLocation': { en: 'Origin and destination are the same. Pick two different places.', bn: 'যাত্রা শুরু ও গন্তব্য একই। দুটি ভিন্ন স্থান নির্বাচন করুন।' },
  'search.popular': { en: 'Popular routes', bn: 'জনপ্রিয় রুট' },
  'search.notServed': { en: 'One of these places is not served by any bus in the database yet.', bn: 'এই স্থানগুলোর একটিতে এখনো কোনো বাস চলাচল করে না।' },
  'results.title': { en: 'Search results', bn: 'অনুসন্ধানের ফলাফল' },
  'results.found': { en: 'journeys found', bn: 'টি যাত্রা পাওয়া গেছে' },
  'results.direct': { en: 'Direct', bn: 'সরাসরি' },
  'results.recommended': { en: 'Best match', bn: 'সেরা পছন্দ' },
  'results.fewerStops': { en: 'Fewer stops', bn: 'কম স্টপ' },
  'results.alternative': { en: 'Alternative', bn: 'বিকল্প' },
  'results.transfers': { en: 'transfers', bn: 'টি ট্রান্সফার' },
  'results.transfer': { en: 'transfer', bn: 'টি ট্রান্সফার' },
  'results.stops': { en: 'stops', bn: 'টি স্টপ' },
  'results.viewRoute': { en: 'View full route', bn: 'সম্পূর্ণ রুট দেখুন' },
  'results.showLess': { en: 'Show less', bn: 'সংক্ষিপ্ত করুন' },
  'results.changeAt': { en: 'Change at', bn: 'পরিবর্তন করুন' },
  'results.board': { en: 'Board', bn: 'উঠুন' },
  'results.alight': { en: 'Get off', bn: 'নামুন' },
  'results.noResults': { en: 'No buses found for this journey', bn: 'এই যাত্রার জন্য কোনো বাস পাওয়া যায়নি' },
  'results.noResultsHint': { en: 'Try nearby major stops, or check the Locations page to see what is served.', bn: 'কাছাকাছি বড় স্টপ চেষ্টা করুন, অথবা স্থান পৃষ্ঠায় দেখুন কোন বাস চলাচল করে।' },
  'results.directBadge': { en: 'Direct — no transfer', bn: 'সরাসরি — ট্রান্সফার নেই' },
  'bus.type': { en: 'Type', bn: 'ধরন' },
  'bus.hours': { en: 'Operating hours', bn: 'সেবার সময়' },
  'bus.service': { en: 'Service', bn: 'সেবা' },
  'bus.condition': { en: 'Condition', bn: 'অবস্থা' },
  'bus.route': { en: 'Route', bn: 'রুট' },
  'bus.routes': { en: 'Routes', bn: 'রুটসমূহ' },
  'bus.allBuses': { en: 'All buses', bn: 'সকল বাস' },
  'bus.search': { en: 'Search buses…', bn: 'বাস খুঁজুন…' },
  'bus.notFound': { en: 'Bus not found', bn: 'বাস পাওয়া যায়নি' },
  'bus.viewAll': { en: 'View all buses', bn: 'সকল বাস দেখুন' },
  'bus.notes': { en: 'Special notes', bn: 'বিশেষ নোট' },
  'bus.directionBoth': { en: 'Both directions', bn: 'উভয় দিক' },
  'bus.directionUp': { en: 'Up direction', bn: 'আপ দিক' },
  'bus.directionDown': { en: 'Down direction', bn: 'ডাউন দিক' },
  'bus.sortName': { en: 'Name (A–Z)', bn: 'নাম (A–Z)' },
  'bus.sortRating': { en: 'Top rated', bn: 'সেরা রেটিং' },
  'bus.reviews': { en: 'reviews', bn: 'টি রিভিউ' },
  'locations.all': { en: 'All locations', bn: 'সকল স্থান' },
  'locations.search': { en: 'Search locations…', bn: 'স্থান খুঁজুন…' },
  'locations.busesHere': { en: 'buses serve this location', bn: 'টি বাস এই স্থানে চলাচল করে' },
  'locations.busesAt': { en: 'Buses at', bn: 'এখানে বাস' },
  'locations.notFound': { en: 'Location not found', bn: 'স্থান পাওয়া যায়নি' },
  'locations.viewAll': { en: 'View all locations', bn: 'সকল স্থান দেখুন' },
  'locations.none': { en: 'No buses serve this location yet', bn: 'এই স্থানে এখনো কোনো বাস চলাচল করে না' },
  'locations.count': { en: 'locations', bn: 'টি স্থান' },
  'buses.count': { en: 'buses', bn: 'টি বাস' },
  'about.title': { en: 'About Dhaka Bus Finder', bn: 'ঢাকা বাস ফাইন্ডার সম্পর্কে' },
  'about.desc': { en: 'Dhaka Bus Finder helps you navigate the city’s bus network. Find direct routes, plan transfers when no direct bus exists, and explore every bus and stop in the database.', bn: 'ঢাকা বাস ফাইন্ডার আপনাকে শহরের বাস নেটওয়ার্কে চলাচল করতে সাহায্য করে। সরাসরি রুট খুঁজুন, সরাসরি বাস না থাকলে ট্রান্সফার পরিকল্পনা করুন এবং ডেটাবেসের সব বাস ও স্টপ দেখুন।' },
  'about.feature1': { en: 'Direct bus routes between any two served locations', bn: 'যেকোনো দুটি স্থানের মধ্যে সরাসরি বাস রুট' },
  'about.feature2': { en: 'Smart 1- and 2-transfer suggestions when no direct bus runs', bn: 'সরাসরি বাস না থাকলে ১ ও ২ ট্রান্সফারের স্মার্ট পরামর্শ' },
  'about.feature3': { en: 'Results ranked by stops, transfers and bus quality rating', bn: 'স্টপ, ট্রান্সফার ও বাসের রেটিং অনুযায়ী সাজানো ফলাফল' },
  'about.feature4': { en: 'Browse all buses and locations, in English or Bangla', bn: 'সব বাস ও স্থান ব্রাউজ করুন, ইংরেজি বা বাংলায়' },
  'about.dataNote': { en: 'Route data is community-maintained. Spot a mistake? Send feedback and we will fix it.', bn: 'রুটের তথ্য কমিউনিটি রক্ষণাবেক্ষণ করে। ভুল পেলে ফিডব্যাক পাঠান, আমরা ঠিক করব।' },
  'feedback.title': { en: 'Send feedback', bn: 'ফিডব্যাক পাঠান' },
  'feedback.subtitle': { en: 'Bus name wrong? Route changed? Tell us and we will update the data.', bn: 'বাসের নাম ভুল? রুট পরিবর্তিত? জানান, আমরা তথ্য হালনাগাদ করব।' },
  'feedback.name': { en: 'Name (optional)', bn: 'নাম (ঐচ্ছিক)' },
  'feedback.email': { en: 'Email (optional)', bn: 'ইমেইল (ঐচ্ছিক)' },
  'feedback.subject': { en: 'Subject', bn: 'বিষয়' },
  'feedback.message': { en: 'Message', bn: 'বার্তা' },
  'feedback.submit': { en: 'Submit feedback', bn: 'ফিডব্যাক পাঠান' },
  'feedback.thanks': { en: 'Thank you!', bn: 'ধন্যবাদ!' },
  'feedback.thanksDesc': { en: 'Your feedback was submitted. We will review it soon.', bn: 'আপনার ফিডব্যাক জমা হয়েছে। আমরা শীঘ্রই পর্যালোচনা করব।' },
  'feedback.another': { en: 'Submit another', bn: 'আরেকটি পাঠান' },
  'error.notFound': { en: 'Page not found', bn: 'পৃষ্ঠা পাওয়া যায়নি' },
  'error.notFoundDesc': { en: 'The page you are looking for does not exist.', bn: 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই।' },
  'error.goHome': { en: 'Go home', bn: 'হোমে যান' },
  'error.findBus': { en: 'Find a bus', bn: 'বাস খুঁজুন' },
  'error.crashTitle': { en: 'Something went wrong', bn: 'কিছু একটা সমস্যা হয়েছে' },
  'error.crashDesc': { en: 'An unexpected error occurred. Reload the page to continue.', bn: 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। চালিয়ে যেতে পৃষ্ঠাটি রিলোড করুন।' },
  'error.reload': { en: 'Reload page', bn: 'পৃষ্ঠা রিলোড করুন' },
  'loading': { en: 'Loading…', bn: 'লোড হচ্ছে…' },
  'loading.data': { en: 'Loading bus data…', bn: 'বাসের তথ্য লোড হচ্ছে…' },
  'common.retry': { en: 'Retry', bn: 'পুনরায় চেষ্টা করুন' },
  'common.cancel': { en: 'Cancel', bn: 'বাতিল' },
  'common.save': { en: 'Save', bn: 'সংরক্ষণ' },
  'common.delete': { en: 'Delete', bn: 'মুছুন' },
  'common.edit': { en: 'Edit', bn: 'সম্পাদনা' },
  'common.close': { en: 'Close', bn: 'বন্ধ করুন' },
  'common.active': { en: 'Active', bn: 'সক্রিয়' },
  'common.inactive': { en: 'Inactive', bn: 'নিষ্ক্রিয়' },
  'footer.rights': { en: 'All rights reserved.', bn: 'সর্বস্বত্ব সংরক্ষিত।' },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return saved === 'bn' || saved === 'en' ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const t = (key: string): string => {
    const entry = translations[key];
    return entry ? (language === 'bn' ? entry.bn : entry.en) : key;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);