import { useLanguage } from '../contexts/LanguageContext';
import { getLocationById } from '../data/store';

interface Props {
  stops: string[];
  boardStop?: string;
  alightStop?: string;
  transferStop?: string;
  compact?: boolean;
}

export default function RouteTimeline({ stops, boardStop, alightStop, transferStop, compact = false }: Props) {
  const { language } = useLanguage();

  const getStopName = (id: string) => {
    const loc = getLocationById(id);
    return loc ? (language === 'bn' ? loc.nameBn : loc.nameEn) : id;
  };

  const getStopType = (id: string) => {
    if (id === boardStop) return 'board';
    if (id === alightStop) return 'alight';
    if (id === transferStop) return 'transfer';
    return 'normal';
  };

  const displayStops = compact ? [stops[0], ...stops.slice(1, -1), stops[stops.length - 1]] : stops;

  return (
    <div className="relative py-2">
      {displayStops.map((stopId, idx) => {
        const type = getStopType(stopId);
        const isFirst = idx === 0;
        const isLast = idx === displayStops.length - 1;

        return (
          <div key={`${stopId}-${idx}`} className="flex items-start gap-3">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                type === 'board' ? 'bg-emerald-500 border-emerald-500' :
                type === 'alight' ? 'bg-blue-500 border-blue-500' :
                type === 'transfer' ? 'bg-amber-500 border-amber-500' :
                'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600'
              }`} />
              {!isLast && (
                <div className={`w-0.5 ${compact ? 'h-4' : 'h-6'} ${
                  type === 'board' || type === 'alight' || type === 'transfer'
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>

            {/* Stop name */}
            <div className={`pb-2 ${isLast ? 'pb-0' : ''}`}>
              <span className={`text-sm ${
                type === 'board' ? 'font-semibold text-emerald-700 dark:text-emerald-300' :
                type === 'alight' ? 'font-semibold text-blue-700 dark:text-blue-300' :
                type === 'transfer' ? 'font-semibold text-amber-700 dark:text-amber-300' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {getStopName(stopId)}
              </span>
              {type === 'board' && (
                <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                  {language === 'bn' ? 'উঠুন' : 'Board'}
                </span>
              )}
              {type === 'alight' && (
                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                  {language === 'bn' ? 'নামুন' : 'Get off'}
                </span>
              )}
              {type === 'transfer' && (
                <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                  {language === 'bn' ? 'পরিবর্তন' : 'Transfer'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
