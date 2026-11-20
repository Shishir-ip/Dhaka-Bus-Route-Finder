import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bus as BusIcon, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { StarDisplay } from '../components/StarRating';
import ConnectionError from '../components/ConnectionError';
import { fuzzyMatch } from '../utils/fuzzy';

export default function BusesPage() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'name' | 'rating'>('name');
  const { language, t } = useLanguage();
  const { buses, loading, error, configError, getLocationById, getBusRouteSlug } = useData();

  const filtered = useMemo(() => {
    const active = buses.filter((b) => b.isActive);
    const q = query.trim();
    const list = q
      ? active.filter((b) => fuzzyMatch(q, b.nameEn) > 0 || fuzzyMatch(q, b.nameBn) > 0)
      : active;
    return [...list].sort((a, b) =>
      sort === 'rating'
        ? (b.starRating || 0) - (a.starRating || 0) || a.nameEn.localeCompare(b.nameEn)
        : a.nameEn.localeCompare(b.nameEn)
    );
  }, [query, sort, buses]);

  if (loading || error || configError) return <ConnectionError />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('bus.allBuses')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} {t('buses.count')}
        </p>
      </div>

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('bus.search')}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'name' | 'rating')}
          className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="name">{t('bus.sortName')}</option>
          <option value="rating">{t('bus.sortRating')}</option>
        </select>
      </div>

      <div className="space-y-2.5">
        {filtered.map((bus) => {
          const route = bus.routes[0];
          const first = route?.stops[0];
          const last = route?.stops[route.stops.length - 1];
          const startLoc = first ? getLocationById(first.locationId) : undefined;
          const endLoc = last ? getLocationById(last.locationId) : undefined;
          return (
            <Link
              key={bus.id}
              to={`/bus/${getBusRouteSlug(bus)}`}
              className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {language === 'bn' ? bus.nameBn : bus.nameEn}
                    </h3>
                    {bus.starRating ? <StarDisplay rating={bus.starRating} size={12} /> : null}
                    {bus.type && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {bus.type}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{language === 'bn' ? bus.nameEn : bus.nameBn}</p>
                  {startLoc && endLoc && (
                    <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1.5 truncate">
                      {language === 'bn' ? startLoc.nameBn : startLoc.nameEn}
                      <ArrowRight size={11} className="shrink-0" />
                      {language === 'bn' ? endLoc.nameBn : endLoc.nameEn}
                    </p>
                  )}
                </div>
                <BusIcon size={16} className="text-gray-300 dark:text-gray-600 shrink-0 mt-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-xl">
          <BusIcon size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'bn' ? 'কোনো বাস পাওয়া যায়নি' : 'No buses found'}
          </p>
        </div>
      )}
    </div>
  );
}