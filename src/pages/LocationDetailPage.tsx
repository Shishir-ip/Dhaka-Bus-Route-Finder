import { useParams, Link } from 'react-router-dom';
import { MapPin, Bus as BusIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import ConnectionError from '../components/ConnectionError';

export default function LocationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { getLocationBySlug, getBusesForLocation, getBusRouteSlug, getLocationById, loading, error, configError } = useData();
  const location = slug ? getLocationBySlug(slug) : undefined;

  if (loading || error || configError) {
    return <ConnectionError />;
  }

  if (!location) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <MapPin size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'bn' ? 'স্থান পাওয়া যায়নি' : 'Location not found'}
        </h1>
        <Link to="/locations" className="text-emerald-600 dark:text-emerald-400 hover:underline">
          {language === 'bn' ? 'সকল স্থান দেখুন' : 'View all locations'}
        </Link>
      </div>
    );
  }

  const buses = getBusesForLocation(location.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/locations" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors">
        <ArrowLeft size={16} />
        {t('locations.allLocations')}
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <MapPin size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {language === 'bn' ? location.nameBn : location.nameEn}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {language === 'bn' ? location.nameEn : location.nameBn}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {buses.length} {t('locations.busesHere')}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {t('bus.busesAt')} {language === 'bn' ? location.nameBn : location.nameEn}
      </h2>

      <div className="grid gap-3">
        {buses.map(bus => {
          const firstRoute = bus.routes[0];
          const firstStop = firstRoute?.stops[0];
          const lastStop = firstRoute?.stops[firstRoute.stops.length - 1];
          const startLoc = firstStop ? getLocationById(firstStop.locationId) : null;
          const endLoc = lastStop ? getLocationById(lastStop.locationId) : null;

          return (
            <Link
              key={bus.id}
              to={`/bus/${getBusRouteSlug(bus)}`}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                <BusIcon size={18} className="text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? bus.nameBn : bus.nameEn}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {startLoc && endLoc && (
                    <>
                      <span className="truncate">{language === 'bn' ? startLoc.nameBn : startLoc.nameEn}</span>
                      <ArrowRight size={10} className="shrink-0" />
                      <span className="truncate">{language === 'bn' ? endLoc.nameBn : endLoc.nameEn}</span>
                    </>
                  )}
                </div>
              </div>
              {bus.type && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full shrink-0">
                  {bus.type}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {buses.length === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <BusIcon size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'bn' ? 'এই স্থানে কোনো বাস চলাচল করে না' : 'No buses serve this location'}
          </p>
        </div>
      )}
    </div>
  );
}
