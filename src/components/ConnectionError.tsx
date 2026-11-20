import { AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function ConnectionError() {
  const { configError, error, refetch, loading } = useData();
  const { language, t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('loading.data')}</p>
        </div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
        <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={22} className="text-red-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {language === 'bn' ? 'ডেটাবেস সংযোগ সমস্যা' : 'Database connection problem'}
            </h2>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg p-3 mb-4 font-mono break-all">
            {configError}
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <li>{language === 'bn' ? 'Vercel-এ VITE_SUPABASE_URL ও VITE_SUPABASE_ANON_KEY সেট করুন' : 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your host (e.g. Vercel) environment variables'}</li>
            <li>{language === 'bn' ? 'Supabase SQL Editor-এ স্কিমা ও ডেটা SQL চালান' : 'Run the schema and data SQL in the Supabase SQL Editor'}</li>
            <li>{language === 'bn' ? 'সাইটটি পুনরায় ডিপ্লয় করুন' : 'Redeploy the site'}</li>
          </ol>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
        <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={22} className="text-amber-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {language === 'bn' ? 'ডেটা লোড করতে সমস্যা' : 'Error loading data'}
            </h2>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 mb-4 break-all">
            {error}
          </p>
          <button
            onClick={refetch}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw size={15} />
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}