import { Link } from 'react-router-dom';
import { Home, Search, Bus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFoundPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-6 flex justify-center">
          <img 
            src="https://image.qwenlm.ai/generated-images/d160c36c-4cd6-48a9-ab09-9d493bcfb94d/_result.png" 
            alt="Lost bus" 
            className="w-56 h-56 object-contain"
          />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('error.notFound')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {t('error.notFoundDesc')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
          >
            <Home size={16} />
            {t('error.goHome')}
          </Link>
          <Link
            to="/buses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all border border-gray-200 dark:border-gray-700"
          >
            <Search size={16} />
            {t('error.findBus')}
          </Link>
        </div>
      </div>
    </div>
  );
}
