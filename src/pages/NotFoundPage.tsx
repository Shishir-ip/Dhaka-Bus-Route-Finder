import { Link } from 'react-router-dom';
import { Home, Search, Bus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <Bus size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h1 className="text-5xl font-bold text-gray-200 dark:text-gray-700 mb-2">404</h1>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-1">{t('error.notFound')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('error.notFoundDesc')}</p>
        <div className="flex items-center justify-center gap-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Home size={14} />
            {t('error.goHome')}
          </Link>
          <Link
            to="/buses"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            <Search size={14} />
            {t('error.findBus')}
          </Link>
        </div>
      </div>
    </div>
  );
}