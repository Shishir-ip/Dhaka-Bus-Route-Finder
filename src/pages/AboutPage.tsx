import { Link } from 'react-router-dom';
import { Bus, Repeat, Star, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO, listMeta } from '../utils/seo';

export default function AboutPage() {
  const { t } = useLanguage();
  const { buses, locations } = useData();
  useSEO(listMeta('about'));

  const features = [
    { icon: Bus, key: 'about.feature1' },
    { icon: Repeat, key: 'about.feature2' },
    { icon: Star, key: 'about.feature3' },
    { icon: MapPin, key: 'about.feature4' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('about.title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{t('about.desc')}</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-white dark:bg-gray-900 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{buses.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('buses.count')}</p>
        </div>
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-white dark:bg-gray-900 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{locations.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('locations.count')}</p>
        </div>
      </div>

      <div className="space-y-2.5 mb-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3 border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-white dark:bg-gray-900">
            <f.icon size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">{t(f.key)}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">{t('about.dataNote')}</p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Bus size={16} />
        {t('search.findBuses')}
      </Link>
    </div>
  );
}