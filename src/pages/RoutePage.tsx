import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bus, TrainFront, Clock, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { findRoutes, hasDirectBus } from '../utils/routeFinder';
import { useSEO, routeMeta, routeFaqPairs, estimateMinutes } from '../utils/seo';
import JourneyCard from '../components/JourneyCard';
import ConnectionError from '../components/ConnectionError';

export default function RoutePage() {
  const { fromSlug, toSlug } = useParams<{ fromSlug: string; toSlug: string }>();
  const { language, t } = useLanguage();
  const { buses, locations, loading, error, configError, getLocationBySlug, getLocationSlug, getBusesForLocation } = useData();

  const from = fromSlug ? getLocationBySlug(fromSlug) : undefined;
  const to = toSlug ? getLocationBySlug(toSlug) : undefined;

  const results = useMemo(
    () => (from && to ? findRoutes(from.id, to.id, buses) : []),
    [from, to, buses]
  );

  const meta = useMemo(
    () => (from && to ? routeMeta(from, to, results) : { title: 'Route not found — Dhaka Bus Finder', description: '', noindex: true }),
    [from, to, results]
  );
  useSEO(meta);

  const faqs = useMemo(() => (from && to ? routeFaqPairs(from, to, results) : []), [from, to, results]);

  // Related journeys from the same origin (internal linking).
  const related = useMemo(() => {
    if (!from) return [];
    const counts = new Map<string, number>();
    for (const b of buses) {
      if (!b.isActive) continue;
      for (const r of b.routes) for (const s of new Set(r.stops.map((x) => x.locationId))) counts.set(s, (counts.get(s) || 0) + 1);
    }
    return locations
      .filter((l) => l.id !== from.id && l.id !== to?.id && (counts.get(l.id) || 0) >= 25 && hasDirectBus(from.id, l.id, buses))
      .sort((a, b) => (counts.get(b.id) || 0) - (counts.get(a.id) || 0))
      .slice(0, 8);
  }, [from, to, buses, locations]);

  if (loading || error || configError) return <ConnectionError />;

  if (!from || !to) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <MapPin size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <h1 className="font-semibold text-gray-900 dark:text-white mb-2">{t('locations.notFound')}</h1>
        <Link to="/" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">{t('error.goHome')}</Link>
      </div>
    );
  }

  const directs = results.filter((r) => r.totalTransfers === 0);
  const hasMetro = results.some((r) => r.segments.some((s) => s.bus.type === 'Metro'));
  const best = results[0];
  const name = (l: { nameEn: string; nameBn: string }) => (language === 'bn' ? l.nameBn : l.nameEn);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/locations" className="hover:text-emerald-600 dark:hover:text-emerald-400">{t('nav.locations')}</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">{from.nameEn} → {to.nameEn}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {from.nameEn} to {to.nameEn} — Bus & Metro Routes
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {name(from)} থেকে {name(to)} যাওয়ার বাস ও মেট্রো রুট
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-900">
            <Bus size={12} /> {directs.length} direct bus{directs.length === 1 ? '' : 'es'}
          </span>
          {best && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-900">
              <Clock size={12} /> fastest ~{estimateMinutes(best)} min · {best.totalStops} stops
            </span>
          )}
          {hasMetro && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-lg px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40">
              <TrainFront size={12} /> MRT Line 6 available
            </span>
          )}
        </div>
      </header>

      {results.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 mb-8">
          <Bus size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{t('results.noResults')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{t('results.noResultsHint')}</p>
        </div>
      ) : (
        <section className="space-y-3 mb-8" aria-label="Journey options">
          {results.slice(0, 10).map((result, idx) => (
            <JourneyCard key={idx} result={result} />
          ))}
          {results.length > 10 && (
            <Link
              to={`/?from=${fromSlug}&to=${toSlug}`}
              className="press block text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-xl py-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-colors"
            >
              View all {results.length} journey options →
            </Link>
          )}
        </section>
      )}

      {/* Bangla content — real answers for Bangla search queries */}
      <section className="mb-8" lang="bn">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
          {from.nameBn} থেকে {to.nameBn} বাস ও মেট্রো রুট
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 p-4">
          {directs.length > 0 ? (
            <p>
              {from.nameBn} থেকে {to.nameBn} যাওয়ার সরাসরি বাস: {directs.slice(0, 8).map((r) => r.segments[0].bus.nameBn).join(', ')}
              {directs.length > 8 ? ` সহ মোট ${directs.length}টি বাস` : ''}। কোনো ট্রান্সফার লাগবে না।
            </p>
          ) : best ? (
            <p>
              {from.nameBn} থেকে {to.nameBn} সরাসরি বাস নেই। সবচেয়ে ভালো উপায়: {best.segments.map((s) => s.bus.nameBn).join(', তারপর ')}
              {' '}— মোট {best.totalStops} স্টপ, {best.totalTransfers} বার বাস বদলাতে হবে।
            </p>
          ) : (
            <p>এই দুই স্থানের মধ্যে এখনো কোনো বাস রুট আমাদের ডাটাবেসে নেই। কাছের বড় স্টপ থেকে সার্চ করে দেখুন।</p>
          )}
          {hasMetro && (
            <p>
              মেট্রোরেল (এমআরটি লাইন ৬) এই যাত্রায় ব্যবহার করা যায় — উত্তরা থেকে মতিঝিল পর্যন্ত ১৬টি স্টেশন, ভাড়া ৳২০–১০০, প্রতি ৫–১০ মিনিটে ট্রেন।
            </p>
          )}
          {best && (
            <p>সবচেয়ে দ্রুত যাত্রায় আনুমানিক {estimateMinutes(best)} মিনিট লাগে (ঢাকার যানজটের ওপর সময় কম-বেশি হতে পারে)।</p>
          )}
        </div>
      </section>

      {/* FAQ — visible content matching the FAQPage structured data */}
      {faqs.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
            {from.nameEn} to {to.nameEn} — common questions
          </h2>
          <div className="space-y-2.5">
            {faqs.map((f, i) => (
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
      )}

      {/* Related journeys */}
      {related.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Other journeys from {from.nameEn}</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((l) => (
              <Link
                key={l.id}
                to={`/route/${getLocationSlug(from)}/${getLocationSlug(l)}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-gray-900"
              >
                {from.nameEn} <ArrowRight size={10} /> {l.nameEn}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-gray-200 dark:border-gray-800 pt-5">
        <Link to={`/location/${getLocationSlug(from)}`} className="text-xs text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400">
          Buses at {from.nameEn}
        </Link>
        <Link to={`/location/${getLocationSlug(to)}`} className="text-xs text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400">
          Buses at {to.nameEn}
        </Link>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
          <ArrowLeft size={12} /> Plan another journey
        </Link>
      </div>
      <p className="sr-only">
        {getBusesForLocation(from.id).length} buses serve {from.nameEn}; {getBusesForLocation(to.id).length} buses serve {to.nameEn}.
      </p>
    </div>
  );
}