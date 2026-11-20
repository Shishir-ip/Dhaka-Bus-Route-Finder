import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bus as BusIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { StarDisplay } from '../components/StarRating';
import ConnectionError from '../components/ConnectionError';
import { useSEO, locationMeta } from '../utils/seo';
import { hasDirectBus } from '../utils/routeFinder';

export default function LocationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { buses, locations, getLocationBySlug, getBusesForLocation, getBusRouteSlug, getLocationById, getLocationSlug, loading, error, configError } = useData();
  const location = slug ? getLocationBySlug(slug) : undefined;

  const meta = useMemo(
    () => (location ? locationMeta(location, { buses, locations }) : { title: 'Location not found — Dhaka Bus Finder', description: '', noindex: true }),
    [location, buses, locations]
  );
  useSEO(meta);

  const destinations = useMemo(() => {
    if (!location) return [];
    const counts = new Map<string, number>();
    for (const b of buses) {
      if (!b.isActive) continue;
      for (const r of b.routes) for (const s of new Set(r.stops.map((x) => x.locationId))) counts.set(s, (counts.get(s) || 0) + 1);
    }
    return locations
      .filter((l) => l.id !== location.id && (counts.get(l.id) || 0) >= 25 && hasDirectBus(location.id, l.id, buses))
      .sort((a, b) => (counts.get(b.id) || 0) - (counts.get(a.id) || 0))
      .slice(0, 8);
  }, [location, buses, locations]);

  if (loading || error || configError) return <ConnectionError />;

  if (!location) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <MapPin size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <h1 className="font-semibold text-gray-900 dark:text-white mb-2">{t('locations.notFound')}</h1>
        <Link to="/locations" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
          {t('locations.viewAll')}
        </Link>
      </div>
    );
  }

  const servingBuses = [...getBusesForLocation(location.id)].sort((a, b) => a.nameEn.localeCompare(b.nameEn));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/locations" className="hover:text-emerald-600 dark:hover:text-emerald-400">{t('nav.locations')}</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300 truncate">{location.nameEn}</span>
      </nav>
      <Link
        to="/locations"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-5"
      >
        <ArrowLeft size={15} />
        {t('locations.all')}
      </Link>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg shrink-0">
            <MapPin size={22} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'bn' ? location.nameBn : location.nameEn}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">{language === 'bn' ? location.nameEn : location.nameBn}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {servingBuses.length} {t('locations.busesHere')}
            </p>
          </div>
        </div>
      </div>

      <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
        {t('locations.busesAt')} {language === 'bn' ? location.nameBn : location.nameEn}
      </h2>

      <div className="space-y-2.5">
        {servingBuses.map((bus) => {
          const route = bus.routes[0];
          const first = route?.stops[0];
          const last = route?.stops[route.stops.length - 1];
          const startLoc = first ? getLocationById(first.locationId) : undefined;
          const endLoc = last ? getLocationById(last.locationId) : undefined;
          return (
            <Link
              key={bus.id}
              to={`/bus/${getBusRouteSlug(bus)}`}
              className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
            >
              <BusIcon size={16} className="text-gray-400 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'bn' ? bus.nameBn : bus.nameEn}
                  </span>
                  {bus.starRating ? <StarDisplay rating={bus.starRating} size={11} /> : null}
                </span>
                {startLoc && endLoc && (
                  <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 truncate">
                    {language === 'bn' ? startLoc.nameBn : startLoc.nameEn}
                    <ArrowRight size={10} className="shrink-0" />
                    {language === 'bn' ? endLoc.nameBn : endLoc.nameEn}
                  </span>
                )}
              </span>
              {bus.type && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                  {bus.type}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {servingBuses.length === 0 && (
        <div className="text-center py-10 border border-gray-200 dark:border-gray-800 rounded-xl">
          <BusIcon size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('locations.none')}</p>
        </div>
      )}

      {destinations.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
            Popular journeys from {location.nameEn}
          </h2>
          <div className="flex flex-wrap gap-2">
            {destinations.map((l) => (
              <Link
                key={l.id}
                to={`/route/${getLocationSlug(location)}/${getLocationSlug(l)}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-gray-900 press"
              >
                {location.nameEn} <ArrowRight size={10} /> {l.nameEn}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}