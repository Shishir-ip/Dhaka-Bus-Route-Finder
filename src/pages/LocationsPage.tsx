import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { locations, getLocationSlug, getBusesForLocation } from '../data/store';
import { useLanguage } from '../contexts/LanguageContext';

export default function LocationsPage() {
  const [query, setQuery] = useState('');
  const { language, t } = useLanguage();

  const filteredLocations = useMemo(() => {
    if (!query.trim()) return locations;
    const q = query.toLowerCase().trim();
    return locations.filter(loc => {
      const name = language === 'bn' ? loc.nameBn : loc.nameEn;
      const altName = language === 'bn' ? loc.nameEn : loc.nameBn;
      if (name.toLowerCase().includes(q)) return true;
      if (altName.toLowerCase().includes(q)) return true;
      if (loc.aliases.some(a => a.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [query, language]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('locations.allLocations')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'bn' ? `${filteredLocations.length}টি স্থান` : `${filteredLocations.length} locations`}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('locations.searchPlaceholder')}
          className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredLocations.map(loc => {
          const busCount = getBusesForLocation(loc.id).length;
          return (
            <Link
              key={loc.id}
              to={`/location/${getLocationSlug(loc)}`}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                <MapPin size={16} className="text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? loc.nameBn : loc.nameEn}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {busCount} {language === 'bn' ? 'টি বাস' : 'buses'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'bn' ? 'কোনো স্থান পাওয়া যায়নি' : 'No locations found'}
          </p>
        </div>
      )}
    </div>
  );
}
