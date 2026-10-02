import { useParams, Link } from 'react-router-dom';
import { Bus as BusIcon, MapPin, Clock, Tag, ArrowLeft, ArrowRight, Star, ExternalLink, Image as ImageIcon } from 'lucide-react';
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

      {/* Bus Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        {/* Bus Image */}
        {bus.imageUrl && (
          <div className="relative h-48 sm:h-64 bg-gray-100 dark:bg-gray-700">
            <img
              src={bus.imageUrl}
              alt={language === 'bn' ? bus.nameBn : bus.nameEn}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <BusIcon size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {language === 'bn' ? bus.nameBn : bus.nameEn}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {language === 'bn' ? bus.nameEn : bus.nameBn}
              </p>

              {/* Star Rating */}
              {bus.starRating && bus.starRating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= Math.round(bus.starRating!) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {bus.starRating.toFixed(1)} ({bus.totalReviews || 0} {language === 'bn' ? 'টি রিভিউ' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bus Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            {bus.type && (
              <div className="flex items-center gap-2 text-sm">
                <Tag size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('bus.type')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{bus.type}</p>
                </div>
              </div>
            )}
            {bus.serviceType && (
              <div className="flex items-center gap-2 text-sm">
                <BusIcon size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === 'bn' ? 'সেবার ধরন' : 'Service Type'}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">{bus.serviceType}</p>
                </div>
              </div>
            )}
            {bus.operatingHours && (
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('bus.hours')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{bus.operatingHours}</p>
                </div>
              </div>
            )}
            {bus.conditionStatus && (
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  bus.conditionStatus === 'Good' ? 'bg-emerald-500' :
                  bus.conditionStatus === 'Not Bad' ? 'bg-amber-500' :
                  'bg-red-500'
                }`} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === 'bn' ? 'অবস্থা' : 'Condition'}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">{bus.conditionStatus}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {bus.description && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {bus.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Routes */}
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

      {/* Notes */}
      {bus.notes && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
            {language === 'bn' ? 'বিশেষ নোট' : 'Special Notes'}
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-400 whitespace-pre-wrap">
            {bus.notes}
          </p>
        </div>
      )}
    </div>
  );
}
