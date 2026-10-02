import { useParams, Link } from 'react-router-dom';
import { Bus as BusIcon, MapPin, Clock, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import RouteTimeline from '../components/RouteTimeline';
import ConnectionError from '../components/ConnectionError';

export default function BusDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { getBusBySlug, getLocationById, loading, error, configError } = useData();
  const bus = slug ? getBusBySlug(slug) : undefined;

  if (loading || error || configError) {
    return <ConnectionError />;
  }

  if (!bus) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <BusIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'bn' ? 'বাস পাওয়া যায়নি' : 'Bus not found'}
        </h1>
        <Link to="/buses" className="text-emerald-600 dark:text-emerald-400 hover:underline">
          {language === 'bn' ? 'সকল বাস দেখুন' : 'View all buses'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/buses" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors">
        <ArrowLeft size={16} />
        {t('bus.allBuses')}
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <BusIcon size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {language === 'bn' ? bus.nameBn : bus.nameEn}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {language === 'bn' ? bus.nameEn : bus.nameBn}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {bus.type && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Tag size={16} />
              <span>{t('bus.type')}: {bus.type}</span>
            </div>
          )}
          {bus.operatingHours && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock size={16} />
              <span>{t('bus.hours')}: {bus.operatingHours}</span>
            </div>
          )}
        </div>
      </div>

      {bus.routes.map((route, routeIdx) => {
        const stops = route.stops.map(s => s.locationId);
        const firstStop = getLocationById(stops[0]);
        const lastStop = getLocationById(stops[stops.length - 1]);

        return (
          <div key={route.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {t('bus.route')} {bus.routes.length > 1 ? `${routeIdx + 1}` : ''}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {firstStop && lastStop && (
                <>
                  {language === 'bn' ? firstStop.nameBn : firstStop.nameEn}
                  <ArrowRight size={14} className="inline mx-1.5" />
                  {language === 'bn' ? lastStop.nameBn : lastStop.nameEn}
                </>
              )}
              <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {stops.length} {t('results.stops')}
              </span>
            </p>

            <RouteTimeline stops={stops} />
          </div>
        );
      })}
    </div>
  );
}
