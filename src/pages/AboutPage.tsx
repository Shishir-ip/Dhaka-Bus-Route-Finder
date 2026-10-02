import { Link } from 'react-router-dom';
import { Bus, Route, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { t, language } = useLanguage();

  const features = [
    { icon: Route, key: 'about.feature1' },
    { icon: ArrowRight, key: 'about.feature2' },
    { icon: MapPin, key: 'about.feature3' },
    { icon: Bus, key: 'about.feature4' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
          <Bus size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('about.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          {t('about.desc')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
          >
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
              <feature.icon size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {t(feature.key)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <Bus size={18} />
          {t('search.findBuses')}
        </Link>
      </div>
    </div>
  );
}
