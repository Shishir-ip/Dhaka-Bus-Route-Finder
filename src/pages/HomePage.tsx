import { useState } from 'react';
import { ArrowRightLeft, Search, Bus, ArrowRight, MapPin, TrendingUp } from 'lucide-react';
import { Location, JourneyResult } from '../types';
import LocationAutocomplete from '../components/LocationAutocomplete';
import JourneyCard from '../components/JourneyCard';
import { findRoutes } from '../utils/routeFinder';
import { locations, getBusRouteSlug, getLocationSlug } from '../data/store';
import { useLanguage } from '../contexts/LanguageContext';

const popularRoutes = [
  { from: 'loc-005', to: 'loc-024', labelEn: 'Mirpur 10 → Motijheel' },
  { from: 'loc-033', to: 'loc-024', labelEn: 'Uttara → Motijheel' },
  { from: 'loc-049', to: 'loc-024', labelEn: 'Mohammadpur → Motijheel' },
  { from: 'loc-005', to: 'loc-031', labelEn: 'Mirpur 10 → Gulshan' },
  { from: 'loc-033', to: 'loc-012', labelEn: 'Uttara → Airport' },
  { from: 'loc-001', to: 'loc-025', labelEn: 'Gabtoli → Gulistan' },
];

export default function HomePage() {
  const [from, setFrom] = useState<Location | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [results, setResults] = useState<JourneyResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleSearch = () => {
    if (!from || !to) return;
    setLoading(true);
    setTimeout(() => {
      const found = findRoutes(from.id, to.id);
      setResults(found);
      setSearched(true);
      setLoading(false);
    }, 300);
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setResults([]);
    setSearched(false);
  };

  const handlePopularRoute = (fromId: string, toId: string) => {
    const fromLoc = locations.find(l => l.id === fromId);
    const toLoc = locations.find(l => l.id === toId);
    if (fromLoc && toLoc) {
      setFrom(fromLoc);
      setTo(toLoc);
      setLoading(true);
      setTimeout(() => {
        const found = findRoutes(fromId, toId);
        setResults(found);
        setSearched(true);
        setLoading(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
            <Bus size={16} />
            {language === 'bn' ? 'ঢাকার বাস নেটওয়ার্ক' : 'Dhaka Bus Network'}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {t('app.tagline')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
            {t('app.subtitle')}
          </p>

          {/* Search Box */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <LocationAutocomplete
                label={t('search.from')}
                value={from}
                onChange={setFrom}
              />

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all mx-auto mb-1"
                aria-label={t('search.swap')}
              >
                <ArrowRightLeft size={18} />
              </button>

              <LocationAutocomplete
                label={t('search.to')}
                value={to}
                onChange={setTo}
              />
            </div>

            {/* Mobile Swap */}
            <div className="sm:hidden flex justify-center my-2">
              <button
                onClick={handleSwap}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm"
              >
                <ArrowRightLeft size={14} />
                {t('search.swap')}
              </button>
            </div>

            <button
              onClick={handleSearch}
              disabled={!from || !to || loading}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={18} />
              )}
              {t('search.findBuses')}
            </button>
          </div>

          {/* Popular Routes */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <TrendingUp size={14} />
              <span>{language === 'bn' ? 'জনপ্রিয় রুট' : 'Popular Routes'}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {popularRoutes.map((route, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePopularRoute(route.from, route.to)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                >
                  {language === 'bn'
                    ? `${locations.find(l => l.id === route.from)?.nameBn} → ${locations.find(l => l.id === route.to)?.nameBn}`
                    : route.labelEn
                  }
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('results.searchResults')}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {results.length} {t('results.journeysFound')}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <Bus size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                {t('results.noResults')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {t('results.tryTransfer')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <JourneyCard key={idx} result={result} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Features Section (shown when no search done) */}
      {!searched && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-3">
                <Search size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                {language === 'bn' ? 'স্মার্ট সার্চ' : 'Smart Search'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'bn' ? 'যেকোনো দুটি স্থানের মধ্যে বাস খুঁজুন' : 'Find buses between any two locations'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-3">
                <ArrowRight size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                {language === 'bn' ? 'ট্রান্সফার রুট' : 'Transfer Routes'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'bn' ? 'সরাসরি বাস না পেলে ট্রান্সফার অপশন' : 'Transfer options when no direct bus'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl mb-3">
                <MapPin size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                {language === 'bn' ? 'রুট ভিজ্যুয়ালাইজেশন' : 'Route Visualization'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'bn' ? 'ভিজ্যুয়াল টাইমলাইনে সম্পূর্ণ রুট' : 'Complete routes in visual timeline'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
