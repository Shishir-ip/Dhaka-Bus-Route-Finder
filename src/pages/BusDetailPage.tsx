import { useParams, Link } from 'react-router-dom';
import { Bus as BusIcon, Clock, Tag, ArrowLeft, ArrowRight, Wrench, Flag } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { StarDisplay } from '../components/StarRating';
import RouteTimeline from '../components/RouteTimeline';
import ConnectionError from '../components/ConnectionError';

export default function BusDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { getBusBySlug, getLocationById, loading, error, configError } = useData();
  const bus = slug ? getBusBySlug(slug) : undefined;

  if (loading || error || configError) return <ConnectionError />;

  if (!bus) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <BusIcon size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <h1 className="font-semibold text-gray-900 dark:text-white mb-2">{t('bus.notFound')}</h1>
        <Link to="/buses" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
          {t('bus.viewAll')}
        </Link>
      </div>
    );
  }

  const rating = Number(bus.starRating) || 0;
  const directionLabel = (d: string) =>
    d === 'up' ? t('bus.directionUp') : d === 'down' ? t('bus.directionDown') : t('bus.directionBoth');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/buses"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-5"
      >
        <ArrowLeft size={15} />
        {t('bus.allBuses')}
      </Link>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-5">
        {bus.imageUrl && (
          <img
            src={bus.imageUrl}
            alt={bus.nameEn}
            className="w-full h-44 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg shrink-0">
              <BusIcon size={22} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'bn' ? bus.nameBn : bus.nameEn}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">{language === 'bn' ? bus.nameEn : bus.nameBn}</p>
              {rating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <StarDisplay rating={rating} size={15} showValue />
                  {bus.totalReviews ? (
                    <span className="text-xs text-gray-400">
                      ({bus.totalReviews} {t('bus.reviews')})
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {bus.type && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5">
                <Tag size={12} /> {bus.type}
              </span>
            )}
            {bus.operatingHours && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5">
                <Clock size={12} /> {bus.operatingHours}
              </span>
            )}
            {bus.serviceType && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5">
                <BusIcon size={12} /> {bus.serviceType}
              </span>
            )}
            {bus.conditionStatus && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5">
                <Wrench size={12} /> {bus.conditionStatus}
              </span>
            )}
          </div>

          {bus.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 whitespace-pre-wrap">{bus.description}</p>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <Link
              to={`/feedback?bus=${encodeURIComponent(bus.nameEn)}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Flag size={13} />
              {t('bus.report')}
            </Link>
          </div>
        </div>
      </div>

      {bus.routes.map((route, idx) => {
        const stops = route.stops.map((s) => s.locationId);
        if (stops.length === 0) return null;
        const first = getLocationById(stops[0]);
        const last = getLocationById(stops[stops.length - 1]);
        return (
          <div key={route.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-6 mb-4">
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {t('bus.route')} {bus.routes.length > 1 ? idx + 1 : ''}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {directionLabel(route.direction)} · {stops.length} {t('results.stops')}
              </span>
            </div>
            {first && last && (
              <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
                {language === 'bn' ? first.nameBn : first.nameEn}
                <ArrowRight size={13} />
                {language === 'bn' ? last.nameBn : last.nameEn}
              </p>
            )}
            <RouteTimeline stops={stops} />
          </div>
        );
      })}

      {bus.notes && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">{t('bus.notes')}</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 whitespace-pre-wrap">{bus.notes}</p>
        </div>
      )}
    </div>
  );
}