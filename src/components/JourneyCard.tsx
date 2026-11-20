import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus as BusIcon, ArrowRight, ChevronDown, ChevronUp, Repeat } from 'lucide-react';
import type { JourneyResult } from '../types';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { StarDisplay } from './StarRating';
import RouteTimeline from './RouteTimeline';

interface Props {
  result: JourneyResult;
}

export default function JourneyCard({ result }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { language, t } = useLanguage();
  const { getLocationById, getBusRouteSlug } = useData();

  const stopName = (id: string) => {
    const loc = getLocationById(id);
    return loc ? (language === 'bn' ? loc.nameBn : loc.nameEn) : id;
  };
  const busName = (bus: { nameEn: string; nameBn: string }) => (language === 'bn' ? bus.nameBn : bus.nameEn);

  const category = result.category;
  const badgeClass =
    category === 'recommended'
      ? 'bg-emerald-600 text-white'
      : category === 'direct'
      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
      : category === 'fewer_stops'
      ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  const badgeText =
    category === 'recommended'
      ? t('results.recommended')
      : category === 'direct'
      ? t('results.direct')
      : category === 'fewer_stops'
      ? t('results.fewerStops')
      : t('results.alternative');

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl border overflow-hidden fade-in ${
        category === 'recommended' ? 'border-emerald-300 dark:border-emerald-800' : 'border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>{badgeText}</span>
            {result.totalTransfers > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                <Repeat size={11} />
                {result.totalTransfers} {result.totalTransfers === 1 ? t('results.transfer') : t('results.transfers')}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {result.totalStops} {t('results.stops')}
          </span>
        </div>

        <div className="space-y-2.5">
          {result.segments.map((segment, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 flex-wrap">
                <BusIcon size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <Link
                  to={`/bus/${getBusRouteSlug(segment.bus)}`}
                  className="text-sm font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {busName(segment.bus)}
                </Link>
                {segment.bus.starRating ? <StarDisplay rating={segment.bus.starRating} size={12} /> : null}
                {segment.bus.type && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {segment.bus.type}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1 ml-6 text-sm text-gray-600 dark:text-gray-400">
                <span>{stopName(segment.boardStop)}</span>
                <ArrowRight size={13} className="text-gray-400" />
                <span>{stopName(segment.alightStop)}</span>
                <span className="text-xs text-gray-400">
                  · {segment.stopCount} {t('results.stops')}
                </span>
              </div>
              {idx < result.segments.length - 1 && (
                <div className="flex items-center gap-2 my-2 ml-6">
                  <Repeat size={12} className="text-amber-500" />
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    {t('results.changeAt')} {stopName(segment.alightStop)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? t('results.showLess') : t('results.viewRoute')}
        </button>
      </div>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4 fade-in">
          {result.segments.map((segment, idx) => (
            <div key={idx}>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                {busName(segment.bus)}
              </p>
              <RouteTimeline stops={segment.stops} boardStop={segment.boardStop} alightStop={segment.alightStop} />
              {idx < result.segments.length - 1 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Repeat size={12} />
                    {t('results.changeAt')} {stopName(segment.alightStop)}
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}