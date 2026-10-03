import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus as BusIcon, ArrowRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { JourneyResult } from '../types';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import RouteTimeline from './RouteTimeline';

interface Props {
  result: JourneyResult;
  index: number;
}

export default function JourneyCard({ result, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { language, t } = useLanguage();
  const { getLocationById, getBusRouteSlug } = useData();

  const getStopName = (id: string) => {
    const loc = getLocationById(id);
    return loc ? (language === 'bn' ? loc.nameBn : loc.nameEn) : id;
  };

  const isDirect = result.type === 'direct';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {/* Category Badge */}
              {result.category && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  result.category === 'recommended'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : result.category === 'direct'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : result.category === 'fewer_stops'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {result.category === 'recommended' && (language === 'bn' ? 'প্রস্তাবিত' : 'Recommended')}
                  {result.category === 'direct' && t('results.direct')}
                  {result.category === 'fewer_stops' && (language === 'bn' ? 'কম স্টপ' : 'Fewer Stops')}
                  {result.category === 'alternative' && (language === 'bn' ? 'বিকল্প' : 'Alternative')}
                </span>
              )}
              
              {/* Transfer count */}
              {!isDirect && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  {result.totalTransfers} {t('results.transfers')}
                </span>
              )}
            </div>
            
            {/* Reason */}
            {result.reason && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">
                {result.reason}
              </p>
            )}

            {result.segments.map((segment, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2">
                  <BusIcon size={16} className="text-gray-500 dark:text-gray-400 shrink-0" />
                  <Link
                    to={`/bus/${getBusRouteSlug(segment.bus)}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {language === 'bn' ? segment.bus.nameBn : segment.bus.nameEn}
                  </Link>
                </div>
                <div className="flex items-center gap-1.5 mt-1 ml-6 text-sm text-gray-600 dark:text-gray-400">
                  <span>{getStopName(segment.boardStop)}</span>
                  <ArrowRight size={14} />
                  <span>{getStopName(segment.alightStop)}</span>
                </div>
                {idx < result.segments.length - 1 && (
                  <div className="flex items-center gap-2 my-2 ml-6">
                    <div className="w-6 h-px bg-amber-400" />
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      {t('results.changeAt')} {getStopName(segment.alightStop)}
                    </span>
                    <div className="w-6 h-px bg-amber-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-right shrink-0">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {result.totalStops} {t('results.stops')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp size={16} />
                {language === 'bn' ? 'সংক্ষিপ্ত করুন' : 'Show less'}
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                {t('results.viewRoute')}
              </>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
          {result.segments.map((segment, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-3">
                <BusIcon size={14} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {language === 'bn' ? segment.bus.nameBn : segment.bus.nameEn}
                </span>
                {segment.bus.type && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                    {segment.bus.type}
                  </span>
                )}
              </div>
              <RouteTimeline
                stops={segment.stops}
                boardStop={segment.boardStop}
                alightStop={segment.alightStop}
                compact={segment.stops.length > 15}
              />
              {idx < result.segments.length - 1 && (
                <div className="my-4 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                    <MapPin size={14} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      {t('results.changeAt')} {getStopName(segment.alightStop)}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
