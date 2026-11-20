import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import ConnectionError from '../components/ConnectionError';
import { fuzzyMatch } from '../utils/fuzzy';

export default function LocationsPage() {
  const [query, setQuery] = useState('');
  const { language, t } = useLanguage();
  const { locations, loading, error, configError, getLocationSlug, getBusesForLocation } = useData();

  const filtered = useMemo(() => {
    const q = query.trim();
    const list = q
      ? locations.filter(
          (l) =>
            fuzzyMatch(q, l.nameEn) > 0 ||
            fuzzyMatch(q, l.nameBn) > 0 ||
            l.aliases.some((a) => fuzzyMatch(q, a) > 0)
        )
      : locations;
    return [...list].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  }, [query, locations]);

  if (loading || error || configError) return <ConnectionError />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('locations.all')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} {t('locations.count')}
        </p>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('locations.search')}
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filtered.map((loc) => (
          <Link
            key={loc.id}
            to={`/location/${getLocationSlug(loc)}`}
            className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
          >
            <MapPin size={15} className="text-gray-400 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">
                {language === 'bn' ? loc.nameBn : loc.nameEn}
              </span>
              <span className="block text-xs text-gray-400">
                {getBusesForLocation(loc.id).length} {t('buses.count')}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-xl">
          <MapPin size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'bn' ? 'কোনো স্থান পাওয়া যায়নি' : 'No locations found'}
          </p>
        </div>
      )}
    </div>
  );
}