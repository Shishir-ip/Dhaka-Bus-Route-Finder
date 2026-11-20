import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft, Search, Bus, Repeat, Star, MapPin, TrainFront } from 'lucide-react';
import type { Location, JourneyResult } from '../types';
import LocationAutocomplete from '../components/LocationAutocomplete';
import JourneyCard from '../components/JourneyCard';
import ConnectionError from '../components/ConnectionError';
import { findRoutes, hasDirectBus } from '../utils/routeFinder';
import { useSEO, homeMeta, HOME_FAQ } from '../utils/seo';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const [from, setFrom] = useState<Location | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [results, setResults] = useState<JourneyResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'all' | 'bus'>(() =>
    typeof window !== 'undefined' && localStorage.getItem('dbf-mode') === 'bus' ? 'bus' : 'all'
  );
  const { t, language } = useLanguage();
  const { buses, locations, loading: dataLoading, error, configError, getBusesForLocation, getLocationSlug } = useData();

  useSEO(homeMeta());

  useEffect(() => {
    localStorage.setItem('dbf-mode', mode);
  }, [mode]);

  // "Bus only" hides the metro from recommendations entirely.
  const searchBuses = useMemo(
    () => (mode === 'bus' ? buses.filter((b) => b.type !== 'Metro') : buses),
    [buses, mode]
  );

  const runSearch = (a: Location | null, b: Location | null) => {
    if (!a || !b) return;
    setSearched(true);
    if (a.id === b.id) {
      setResults([]);
      return;
    }
    setLoading(true);
    // Yield a frame so the spinner paints before the synchronous search.
    setTimeout(() => {
      try {
        setResults(findRoutes(a.id, b.id, searchBuses));
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 30);
  };

  // Re-rank live when the user switches Bus + Metro / Bus only.
  useEffect(() => {
    if (searched && from && to && from.id !== to.id) {
      setResults(findRoutes(from.id, to.id, searchBuses));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, searchBuses]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setResults([]);
    setSearched(false);
  };

  // Popular routes: pairs of major hubs that actually have a direct bus.
  const popularRoutes = useMemo(() => {
    const hubNames = ['Mirpur 10', 'Motijheel', 'Gulistan', 'Farmgate', 'Gabtoli', 'Shahbag', 'Mohammadpur', 'Airport', 'Gulshan 1', 'Sayedabad', 'Uttara', 'Savar'];
    const hubs = hubNames
      .map((n) => locations.find((l) => l.nameEn === n))
      .filter((l): l is Location => Boolean(l));
    const pairs: { from: Location; to: Location }[] = [];
    const wanted: [string, string][] = [
      ['Mirpur 10', 'Motijheel'],
      ['Gabtoli', 'Gulistan'],
      ['Airport', 'Motijheel'],
      ['Mohammadpur', 'Motijheel'],
      ['Mirpur 10', 'Gulshan 1'],
      ['Savar', 'Gabtoli'],
      ['Sayedabad', 'Shahbag'],
      ['Uttara', 'Gulistan'],
    ];
    for (const [a, b] of wanted) {
      const la = hubs.find((l) => l.nameEn === a);
      const lb = hubs.find((l) => l.nameEn === b);
      if (la && lb && hasDirectBus(la.id, lb.id, searchBuses)) pairs.push({ from: la, to: lb });
      if (pairs.length >= 6) break;
    }
    return pairs;
  }, [locations, searchBuses]);

  if (dataLoading || error || configError) return <ConnectionError />;

  const sameLocation = searched && from && to && from.id === to.id;
  const notServed = searched && !sameLocation && results.length === 0 && from && to &&
    (getBusesForLocation(from.id).length === 0 || getBusesForLocation(to.id).length === 0);

  return (
    <div>
      {/* Hero + search */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full mb-5">
            <Bus size={13} />
            {t('app.network')} · {buses.length} {t('buses.count')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">{t('app.tagline')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-3">{t('app.subtitle')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
            {language === 'bn'
              ? 'ঢাকা শহরের সব বাস রুট, এমআরটি লাইন ৬ মেট্রো ও ট্রান্সফার যাত্রা খুঁজুন — মিরপুর, উত্তরা, গুলশান, ধানমন্ডি, মোহাম্মদপুর, মতিঝিল, ফার্মগেট, গাবতলী, সায়েদাবাদ, যাত্রাবাড়ী, সাভার ও টঙ্গীসহ সারা ঢাকা।'
              : 'Search every Dhaka bus route, MRT Line 6 metro and transfer journey — across Mirpur, Uttara, Gulshan, Dhanmondi, Mohammadpur, Motijheel, Farmgate, Gabtoli, Sayedabad, Jatrabari, Savar, Tongi and greater Dhaka.'}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(from, to);
            }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-5 text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <LocationAutocomplete label={t('search.from')} value={from} onChange={setFrom} excludeId={to?.id} />
              <button
                type="button"
                onClick={handleSwap}
                aria-label={t('search.swap')}
                className="hidden sm:flex items-center justify-center w-9 h-9 mb-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
              >
                <ArrowRightLeft size={15} />
              </button>
              <LocationAutocomplete label={t('search.to')} value={to} onChange={setTo} excludeId={from?.id} />
            </div>
            <div className="sm:hidden flex justify-center my-2">
              <button
                type="button"
                onClick={handleSwap}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-emerald-600 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <ArrowRightLeft size={13} />
                {t('search.swap')}
              </button>
            </div>
            <button
              type="submit"
              disabled={!from || !to || loading}
              className="press w-full mt-4 flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {t('search.findBuses')}
            </button>

            {/* Transport mode toggle */}
            <div className="flex items-center justify-center gap-1 mt-3">
              <button
                type="button"
                onClick={() => setMode('all')}
                className={`press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  mode === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <TrainFront size={13} />
                {t('search.modeAll')}
              </button>
              <button
                type="button"
                onClick={() => setMode('bus')}
                className={`press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  mode === 'bus'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Bus size={13} />
                {t('search.modeBus')}
              </button>
            </div>
          </form>

          {popularRoutes.length > 0 && (
            <div className="mt-6">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2.5">{t('search.popular')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularRoutes.map((r, i) => (
                  <Link
                    key={i}
                    to={`/route/${getLocationSlug(r.from)}/${getLocationSlug(r.to)}`}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors press"
                  >
                    {language === 'bn' ? `${r.from.nameBn} → ${r.to.nameBn}` : `${r.from.nameEn} → ${r.to.nameEn}`}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          {sameLocation ? (
            <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
              {t('search.sameLocation')}
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">{t('results.title')}</h2>
                {!loading && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {results.length} {t('results.found')}
                  </span>
                )}
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="skeleton h-28 rounded-xl border border-gray-200 dark:border-gray-800" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                  <Bus size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{t('results.noResults')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    {notServed ? t('search.notServed') : t('results.noResultsHint')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result, idx) => (
                    <JourneyCard key={idx} result={result} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* Features */}
      {!searched && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Search, en: 'Smart search', bn: 'স্মার্ট সার্চ', descEn: 'Find buses between any two served locations.', descBn: 'যেকোনো দুটি স্থানের মধ্যে বাস খুঁজুন।' },
              { icon: Repeat, en: 'Transfer routes', bn: 'ট্রান্সফার রুট', descEn: 'No direct bus? Get 1- and 2-transfer options.', descBn: 'সরাসরি বাস নেই? ১ ও ২ ট্রান্সফারের অপশন পান।' },
              { icon: Star, en: 'Ranked results', bn: 'র‍্যাঙ্ক করা ফলাফল', descEn: 'Best buses first — fewer stops, better rating.', descBn: 'সেরা বাস আগে — কম স্টপ, ভালো রেটিং।' },
            ].map((f, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-white dark:bg-gray-900">
                <f.icon size={18} className="text-emerald-600 dark:text-emerald-400 mb-3" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {language === 'bn' ? f.bn : f.en}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {language === 'bn' ? f.descBn : f.descEn}
                </p>
              </div>
            ))}
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-8">
            <MapPin size={12} />
            {locations.length} {t('locations.count')} · {buses.length} {t('buses.count')}
          </p>
        </section>
      )}

      {/* FAQ — matches the FAQPage structured data for rich results */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
          {language === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'Frequently asked questions'}
        </h2>
        <div className="space-y-2.5">
          {HOME_FAQ.map((f, i) => (
            <details key={i} className="group border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 p-4">
              <summary className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between gap-2">
                {f.q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}