import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bus as BusIcon, MapPin, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import ConnectionError from '../components/ConnectionError';

export default function BusesPage() {
  const [query, setQuery] = useState('');
  const { language, t } = useLanguage();
  const { buses, loading, error, configError, getLocationById, getBusRouteSlug } = useData();

  const filteredBuses = useMemo(() => {
    const active = buses.filter(b => b.isActive);
    if (!query.trim()) return active;
    const q = query.toLowerCase().trim();
    return active.filter(bus => {
      const name = language === 'bn' ? bus.nameBn : bus.nameEn;
      const altName = language === 'bn' ? bus.nameEn : bus.nameBn;
      return name.toLowerCase().includes(q) || altName.toLowerCase().includes(q);
    });
  }, [query, language, buses]);

  if (loading || error || configError) {
    return <ConnectionError />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header with subtle bus image */}
      <div className="relative mb-8 rounded-2xl overflow-hidden h-40 sm:h-48">
        <img
          src="https://image.qwenlm.ai/generated-images/b05db81f-d9a8-4c5b-b4fc-20a315b969ba/_result.png"
          alt="Dhaka local bus at stop"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-end p-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {t('bus.allBuses')}
            </h1>
            <p className="text-white/80 text-sm">
              {language === 'bn' ? `${filteredBuses.length}টি বাস পাওয়া গেছে` : `${filteredBuses.length} buses found`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('bus.search')}
          className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="grid gap-4">
        {filteredBuses.map(bus => {
          const firstRoute = bus.routes[0];
          const firstStop = firstRoute?.stops[0];
          const lastStop = firstRoute?.stops[firstRoute.stops.length - 1];
          const startLoc = firstStop ? getLocationById(firstStop.locationId) : null;
          const endLoc = lastStop ? getLocationById(lastStop.locationId) : null;
          const allStops = new Set<string>();
          bus.routes.forEach(r => r.stops.forEach(s => allStops.add(s.locationId)));

          return (
            <Link
              key={bus.id}
              to={`/bus/${getBusRouteSlug(bus)}`}
              className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <BusIcon size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {language === 'bn' ? bus.nameBn : bus.nameEn}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {language === 'bn' ? bus.nameEn : bus.nameBn}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">
                      {startLoc && endLoc ? (
                        <>
                          {language === 'bn' ? startLoc.nameBn : startLoc.nameEn}
                          <ArrowRight size={12} className="inline mx-1" />
                          {language === 'bn' ? endLoc.nameBn : endLoc.nameEn}
                        </>
                      ) : (
                        `${allStops.size} ${language === 'bn' ? 'টি স্টপ' : 'stops'}`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {bus.type && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                        {bus.type}
                      </span>
                    )}
                    {bus.operatingHours && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {bus.operatingHours}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredBuses.length === 0 && (
        <div className="text-center py-12">
          <BusIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'bn' ? 'কোনো বাস পাওয়া যায়নি' : 'No buses found'}
          </p>
        </div>
      )}
    </div>
  );
}
