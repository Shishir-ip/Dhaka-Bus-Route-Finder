import { useState } from 'react';
import { ArrowRightLeft, Search, Bus, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';
import { Location, JourneyResult } from '../types';
import LocationAutocomplete from '../components/LocationAutocomplete';
import JourneyCard from '../components/JourneyCard';
import ConnectionError from '../components/ConnectionError';
import { findRoutes } from '../utils/routeFinder';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

// Professional hero image - Dhaka bus in authentic street setting
const HERO_IMAGE = 'https://image.qwenlm.ai/generated-images/e243ca8f-cf42-4cc6-bc5e-427bf5337b03/_result.png';

// Transfer feature image - navigation concept
const TRANSFER_IMAGE = 'https://image.qwenlm.ai/generated-images/033d6e84-ed45-4aa5-9f10-a3184c8b9395/_result.png';

export default function HomePage() {
  const [from, setFrom] = useState<Location | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [results, setResults] = useState<JourneyResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();
  const { buses, locations, loading: dataLoading, error, configError, getLocationById } = useData();

  const handleSearch = () => {
    if (!from || !to) return;
    
    if (from.id === to.id) {
      setResults([]);
      setSearched(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const found = findRoutes(from.id, to.id, buses, getLocationById);
      setResults(found);
      setSearched(true);
    } catch (error) {
      console.error('[HomePage] Error during search:', error);
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
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
      
      if (fromId === toId) {
        setResults([]);
        setSearched(true);
        return;
      }
      
      setLoading(true);
      
      try {
        const found = findRoutes(fromId, toId, buses, getLocationById);
        setResults(found);
        setSearched(true);
      } catch (error) {
        console.error('[HomePage] Error during popular route search:', error);
        setResults([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }
  };

  if (dataLoading || error || configError) {
    return <ConnectionError />;
  }

  const popularRoutes = [
    { from: locations.find(l => l.nameEn === 'Mirpur 10')?.id || '', to: locations.find(l => l.nameEn === 'Motijheel')?.id || '', labelEn: 'Mirpur 10 → Motijheel' },
    { from: locations.find(l => l.nameEn === 'Uttara')?.id || '', to: locations.find(l => l.nameEn === 'Motijheel')?.id || '', labelEn: 'Uttara → Motijheel' },
    { from: locations.find(l => l.nameEn === 'Mohammadpur')?.id || '', to: locations.find(l => l.nameEn === 'Motijheel')?.id || '', labelEn: 'Mohammadpur → Motijheel' },
    { from: locations.find(l => l.nameEn === 'Mirpur 10')?.id || '', to: locations.find(l => l.nameEn === 'Gulshan 1')?.id || '', labelEn: 'Mirpur 10 → Gulshan' },
    { from: locations.find(l => l.nameEn === 'Uttara')?.id || '', to: locations.find(l => l.nameEn === 'Airport')?.id || '', labelEn: 'Uttara → Airport' },
    { from: locations.find(l => l.nameEn === 'Gabtoli')?.id || '', to: locations.find(l => l.nameEn === 'Gulistan')?.id || '', labelEn: 'Gabtoli → Gulistan' },
  ].filter(r => r.from && r.to);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* ===== HERO SECTION - Split Layout ===== */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left: Content & Search */}
            <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                <Bus size={16} />
                {language === 'bn' ? 'ঢাকার বাস নেটওয়ার্ক' : 'Dhaka Bus Network'}
                <span className="ml-1 text-xs bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded">
                  {buses.length} {language === 'bn' ? 'টি বাস' : 'buses'}
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {t('app.tagline')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-8">
                {t('app.subtitle')}
              </p>

              {/* Search Box */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-start">
                  <LocationAutocomplete
                    label={t('search.from')}
                    value={from}
                    onChange={setFrom}
                  />
                  <button
                    onClick={handleSwap}
                    className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all mx-auto mt-6"
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

                <div className="sm:hidden flex justify-center my-2">
                  <button
                    onClick={handleSwap}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium min-h-[40px]"
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
              {popularRoutes.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <TrendingUp size={14} />
                    <span>{language === 'bn' ? 'জনপ্রিয় রুট' : 'Popular Routes'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularRoutes.map((route, idx) => {
                      const fromLoc = locations.find(l => l.id === route.from);
                      const toLoc = locations.find(l => l.id === route.to);
                      if (!fromLoc || !toLoc) return null;
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePopularRoute(route.from, route.to)}
                          className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                        >
                          {language === 'bn'
                            ? `${fromLoc.nameBn} → ${toLoc.nameBn}`
                            : route.labelEn
                          }
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Hero Image */}
            <div className="hidden lg:block relative h-full min-h-[500px]">
              <div className="absolute inset-0 pr-8 pb-8">
                <img
                  src={HERO_IMAGE}
                  alt="Dhaka local bus on city street"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  loading="eager"
                />
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hero Image (below search) */}
        <div className="lg:hidden px-4 sm:px-6 pb-8">
          <img
            src={HERO_IMAGE}
            alt="Dhaka local bus on city street"
            className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-lg"
            loading="eager"
          />
        </div>
      </section>

      {/* ===== RESULTS SECTION ===== */}
      {searched && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
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
              <RefreshCw size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
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
        </section>
      )}

      {/* ===== FEATURES SECTION (only when no search) ===== */}
      {!searched && (
        <>
          {/* How It Works - with passenger image */}
          <section className="bg-white dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'bn' ? 'কিভাবে কাজ করে' : 'How It Works'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {language === 'bn' 
                      ? 'আপনার গন্তব্যে পৌঁছানোর সেরা উপায় খুঁজুন - সরাসরি বা ট্রান্সফার করে।'
                      : 'Find the best way to reach your destination — direct or with transfers.'}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {language === 'bn' ? 'স্থান নির্বাচন করুন' : 'Select Locations'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'bn' ? 'আপনার শুরুর স্থান এবং গন্তব্য নির্বাচন করুন' : 'Choose your starting point and destination'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {language === 'bn' ? 'বাস খুঁজুন' : 'Find Buses'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'bn' ? 'সরাসরি রুট বা ট্রান্সফার অপশন দেখুন' : 'See direct routes or transfer options'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {language === 'bn' ? 'যাত্রা শুরু করুন' : 'Start Your Journey'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'bn' ? 'সম্পূর্ণ রুট এবং স্টপ দেখুন' : 'View complete route with all stops'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Passenger view image */}
                <div className="relative">
                  <img
                    src="https://image.qwenlm.ai/generated-images/1a10017f-c5ea-44a5-84a2-23a16619f9ec/_result.png"
                    alt="Passenger view from inside Dhaka bus"
                    className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Transfer Feature - with navigation image */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Navigation concept image */}
              <div className="relative order-2 lg:order-1">
                <img
                  src={TRANSFER_IMAGE}
                  alt="Multiple transit routes converging"
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
                  loading="lazy"
                />
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'bn' ? 'সরাসরি বাস নেই?' : "Can't find a direct bus?"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {language === 'bn'
                    ? 'চিন্তা করবেন না! আমাদের স্মার্ট রুট ফাইন্ডার স্বয়ংক্রিয়ভাবে সেরা ট্রান্সফার অপশন খুঁজে দেয়।'
                    : "No worries! Our smart route finder automatically discovers the best transfer options for you."}
                </p>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <ArrowRight size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    {language === 'bn'
                      ? 'আমরা ২টি ট্রান্সফার পর্যন্ত অপশন খুঁজি'
                      : 'We search up to 2 transfers to find your best route'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Dhaka Transportation - wide divider image */}
          <section className="relative h-48 sm:h-64 overflow-hidden">
            <img
              src="https://image.qwenlm.ai/generated-images/a7ae6d0f-24f2-4ccc-b06a-960633583795/_result.png"
              alt="Dhaka city transportation from elevated view"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-900/30 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8 sm:px-16">
              <div className="max-w-md">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {language === 'bn' ? 'ঢাকার বাস নেটওয়ার্ক' : 'Dhaka Bus Network'}
                </h2>
                <p className="text-sm text-white/80">
                  {language === 'bn'
                    ? `${buses.length}+ বাস, ${locations.length}+ স্থান`
                    : `${buses.length}+ buses, ${locations.length}+ locations`}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
