import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { track } from '@vercel/analytics';
import { ArrowRightLeft, Search, Bus, Repeat, Star, MapPin, TrainFront, Clock, History } from 'lucide-react';
import type { Location, JourneyResult } from '../types';
import LocationAutocomplete from '../components/LocationAutocomplete';
import JourneyCard from '../components/JourneyCard';
import ConnectionError from '../components/ConnectionError';
import { findRoutes, hasDirectBus } from '../utils/routeFinder';
import { useSEO, homeMeta, HOME_FAQ } from '../utils/seo';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { isRunningNow } from '../utils/hours';
import { nearestServedHub, formatDistance } from '../utils/geo';

interface RecentSearch { f: string; t: string; fn: string; tn: string; fb: string; tb: string }

function readRecent(): RecentSearch[] {
  try {
    const raw = localStorage.getItem('dbf-recent');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [from, setFrom] = useState<Location | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [results, setResults] = useState<JourneyResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  // Bumped on every search: replays the results entrance animation and scrolls them into view.
  const [searchId, setSearchId] = useState(0);
  // Busy pairs can yield 1000+ valid combinations; render in batches so
  // phones stay smooth. Nothing is hidden — "Show more" reveals the rest.
  const [visibleCount, setVisibleCount] = useState(30);
  const resultsRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<'all' | 'bus'>(() =>
    typeof window !== 'undefined' && localStorage.getItem('dbf-mode') === 'bus' ? 'bus' : 'all'
  );
  // "Running now" hides services whose operating hours have ended for today.
  const [runningNow, setRunningNow] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('dbf-running') === '1'
  );
  // Filter results by the transfer hub ("via Mirpur 10") — null = everything.
  const [hubFilter, setHubFilter] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentSearch[]>(() => (typeof window !== 'undefined' ? readRecent() : []));
  const { t, language } = useLanguage();
  const { buses, locations, loading: dataLoading, error, configError, getBusesForLocation, getLocationSlug, getLocationBySlug } = useData();

  useSEO(homeMeta());

  useEffect(() => {
    localStorage.setItem('dbf-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('dbf-running', runningNow ? '1' : '0');
  }, [runningNow]);

  // "Bus only" hides the metro; "Running now" also drops closed services.
  const searchBuses = useMemo(() => {
    let list = mode === 'bus' ? buses.filter((b) => b.type !== 'Metro') : buses;
    if (runningNow) list = list.filter((b) => isRunningNow(b));
    return list;
  }, [buses, mode, runningNow]);

  const runSearch = (a: Location | null, b: Location | null) => {
    if (!a || !b) return;
    setSearched(true);
    setSearchId((n) => n + 1);
    setVisibleCount(30);
    setHubFilter(null);
    if (a.id === b.id) {
      setResults([]);
      return;
    }
    setLoading(true);
    // Yield a frame so the spinner paints before the synchronous search.
    setTimeout(() => {
      try {
        const found = findRoutes(a.id, b.id, searchBuses);
        setResults(found);
        track('search', { from: a.nameEn, to: b.nameEn, mode, results: found.length });
        if (found.length > 0) {
          const entry: RecentSearch = {
            f: getLocationSlug(a), t: getLocationSlug(b),
            fn: a.nameEn, tn: b.nameEn, fb: a.nameBn, tb: b.nameBn,
          };
          setRecent((prev) => {
            const next = [entry, ...prev.filter((r) => !(r.f === entry.f && r.t === entry.t))].slice(0, 5);
            try { localStorage.setItem('dbf-recent', JSON.stringify(next)); } catch { /* best-effort */ }
            return next;
          });
        }
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 30);
  };

  // Shareable search links: /?from=mirpur-14&to=kuril-bishwa-road opens with
  // results already loaded (used by the journey pages' "view all" button).
  const autoSearched = useRef(false);
  useEffect(() => {
    if (autoSearched.current || dataLoading || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const f = params.get('from');
    const t = params.get('to');
    if (!f || !t) return;
    const a = getLocationBySlug(f);
    const b = getLocationBySlug(t);
    if (!a || !b) return;
    autoSearched.current = true;
    setFrom(a);
    setTo(b);
    runSearch(a, b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoading]);

  // Users often miss that results rendered below the hero — glide them into
  // view once the results land (works the same on phone and desktop).
  useEffect(() => {
    if (!searchId || loading) return;
    const el = resultsRef.current;
    if (!el) return;
    const NAV_HEIGHT = 56; // sticky navbar is h-14
    const top = el.getBoundingClientRect().top;
    // Already comfortably on screen? Don't yank the page.
    if (top > NAV_HEIGHT + 12 && top < window.innerHeight * 0.55) return;
    const target = top + window.scrollY - NAV_HEIGHT - 12;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, target), behavior: smooth ? 'smooth' : 'auto' });
  }, [searchId, loading]);

  // Re-rank live when the user switches Bus + Metro / Bus only / Running now.
  useEffect(() => {
    if (searched && from && to && from.id !== to.id) {
      setResults(findRoutes(from.id, to.id, searchBuses));
      setHubFilter(null);
      setVisibleCount(30);
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

  // Transfer-hub chips: "via Mirpur 10 (17)" — group the long transfer list
  // by where you change, so it reads like choices instead of a phone book.
  const hubCounts = new Map<string, number>();
  for (const j of results) {
    if (j.totalTransfers === 0) continue;
    const hub = j.segments[0].alightStop;
    hubCounts.set(hub, (hubCounts.get(hub) || 0) + 1);
  }
  const hubChips = [...hubCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const filteredResults = hubFilter
    ? results.filter((j) => j.totalTransfers > 0 && j.segments[0].alightStop === hubFilter)
    : results;

  // Nearest-hub rescue: when an endpoint has no service, suggest the closest
  // stop that does (coordinates permitting) instead of a dead end.
  const rescue = (() => {
    if (!notServed || !from || !to) return null;
    const unserved = getBusesForLocation(from.id).length === 0 ? from : to;
    const other = unserved.id === from.id ? to : from;
    const hub = nearestServedHub(unserved, locations, searchBuses, [other.id]);
    if (!hub || hub.meters > 5000) return null;
    return { unserved, other, hub };
  })();

  const stopLabel = (id: string) => {
    const loc = locations.find((l) => l.id === id);
    return loc ? (language === 'bn' ? loc.nameBn : loc.nameEn) : id;
  };

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
                onClick={() => { setMode('all'); track('mode_toggle', { mode: 'all' }); }}
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
                onClick={() => { setMode('bus'); track('mode_toggle', { mode: 'bus' }); }}
                className={`press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  mode === 'bus'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Bus size={13} />
                {t('search.modeBus')}
              </button>
              <button
                type="button"
                onClick={() => { setRunningNow((v) => !v); track('running_toggle', { on: !runningNow }); }}
                aria-pressed={runningNow}
                className={`press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  runningNow
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Clock size={13} />
                {language === 'bn' ? 'এখন চলছে' : 'Running now'}
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
          {recent.length > 0 && (
            <div className="mt-4">
              <p className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-2.5">
                <History size={11} />
                {language === 'bn' ? 'সাম্প্রতিক সার্চ' : 'Recent searches'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {recent.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const a = getLocationBySlug(r.f);
                      const b = getLocationBySlug(r.t);
                      if (a && b) { setFrom(a); setTo(b); runSearch(a, b); }
                    }}
                    className="press px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {language === 'bn' ? `${r.fb} → ${r.tb}` : `${r.fn} → ${r.tn}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {searched && (
        <section ref={resultsRef} className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          {sameLocation ? (
            <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
              {t('search.sameLocation')}
            </p>
          ) : (
            <div key={searchId}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">{t('results.title')}</h2>
                {!loading && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {hubFilter ? `${filteredResults.length} / ${results.length}` : results.length} {t('results.found')}
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
                  {rescue && (
                    <div className="mt-5 mx-auto max-w-sm border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-4 text-left">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        <MapPin size={13} className="inline mr-1 text-emerald-600 dark:text-emerald-400" />
                        {language === 'bn'
                          ? `${rescue.unserved.nameBn}-এ বাস নেই। সবচেয়ে কাছের স্টপ ${rescue.hub.location.nameBn} (~${formatDistance(rescue.hub.meters)}) — সেখান থেকে ${rescue.hub.busCount}টি বাস চলে।`
                          : `No buses at ${rescue.unserved.nameEn}. Nearest stop: ${rescue.hub.location.nameEn} (~${formatDistance(rescue.hub.meters)}) with ${rescue.hub.busCount} buses.`}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const a = rescue.unserved.id === from?.id ? rescue.hub.location : from;
                          const b = rescue.unserved.id === from?.id ? to : rescue.hub.location;
                          setFrom(a);
                          setTo(b);
                          runSearch(a, b);
                        }}
                        className="press w-full text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg py-2 transition-colors"
                      >
                        {language === 'bn'
                          ? `${rescue.hub.location.nameBn} থেকে সার্চ করুন`
                          : `Search from ${rescue.hub.location.nameEn} instead`}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {hubChips.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 pb-1">
                      <button
                        type="button"
                        onClick={() => { setHubFilter(null); setVisibleCount(30); }}
                        className={`press px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          hubFilter === null
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {language === 'bn' ? `সব (${results.length})` : `All (${results.length})`}
                      </button>
                      {hubChips.map(([hub, count]) => (
                        <button
                          key={hub}
                          type="button"
                          onClick={() => { setHubFilter(hubFilter === hub ? null : hub); setVisibleCount(30); }}
                          className={`press px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            hubFilter === hub
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {language === 'bn' ? `${stopLabel(hub)} হয়ে (${count})` : `via ${stopLabel(hub)} (${count})`}
                        </button>
                      ))}
                    </div>
                  )}
                  {filteredResults.slice(0, visibleCount).map((result, idx) => (
                    <JourneyCard key={idx} result={result} delayMs={Math.min(idx, 8) * 70} />
                  ))}
                  {filteredResults.length > visibleCount && (
                    <button
                      type="button"
                      onClick={() => setVisibleCount((c) => c + 60)}
                      className="press w-full text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-xl py-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-colors"
                    >
                      {language === 'bn'
                        ? `আরও দেখুন — ${filteredResults.length - visibleCount}টি অপশন বাকি (মোট ${filteredResults.length})`
                        : `Show more — ${filteredResults.length - visibleCount} more options (${filteredResults.length} total)`}
                    </button>
                  )}
                </div>
              )}
            </div>
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