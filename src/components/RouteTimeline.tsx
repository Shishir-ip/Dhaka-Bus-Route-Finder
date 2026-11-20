import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

interface Props {
  stops: string[];
  boardStop?: string;
  alightStop?: string;
}

export default function RouteTimeline({ stops, boardStop, alightStop }: Props) {
  const { language, t } = useLanguage();
  const { getLocationById, getLocationSlug } = useData();

  if (!stops.length) return null;

  return (
    <div className="py-1">
      {stops.map((stopId, idx) => {
        const loc = getLocationById(stopId);
        const name = loc ? (language === 'bn' ? loc.nameBn : loc.nameEn) : stopId;
        const isBoard = stopId === boardStop;
        const isAlight = stopId === alightStop;
        const isLast = idx === stops.length - 1;
        const highlighted = isBoard || isAlight;

        return (
          <div key={`${stopId}-${idx}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${
                  isBoard
                    ? 'bg-emerald-500'
                    : isAlight
                    ? 'bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
              {!isLast && <div className="w-px flex-1 min-h-4 bg-gray-200 dark:bg-gray-700" />}
            </div>
            <div className={`flex items-center gap-2 ${isLast ? 'pb-0' : 'pb-2.5'}`}>
              {loc ? (
                <Link
                  to={`/location/${getLocationSlug(loc)}`}
                  className={`text-sm hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors ${
                    highlighted ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {name}
                </Link>
              ) : (
                <span className={`text-sm ${highlighted ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {name}
                </span>
              )}
              {isBoard && (
                <span className="text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                  {t('results.board')}
                </span>
              )}
              {isAlight && (
                <span className="text-[10px] font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">
                  {t('results.alight')}
                </span>
              )}
              {loc?.googleMapsUrl && (
                <a
                  href={loc.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  title="Google Maps"
                >
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}