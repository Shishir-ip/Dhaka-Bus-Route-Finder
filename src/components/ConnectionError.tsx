import React from 'react';
import { AlertTriangle, RefreshCw, Database, Key, Globe } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function ConnectionError() {
  const { configError, error, refetch, loading } = useData();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'bn' ? 'ডেটা লোড হচ্ছে...' : 'Loading data from database...'}
          </p>
        </div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800 p-6 sm:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Database size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === 'bn' ? 'ডেটাবেস সংযোগ সমস্যা' : 'Database Connection Error'}
              </h2>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                {configError}
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {language === 'bn' ? 'সমাধানের ধাপ:' : 'How to fix:'}
              </h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>{language === 'bn' 
                  ? 'Vercel-এ VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY এনভায়রনমেন্ট ভেরিয়েবল সেট করুন'
                  : 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables'}</li>
                <li>{language === 'bn'
                  ? 'Supabase প্রকল্পে ডেটাবেস স্কিমা চালান'
                  : 'Run the database schema in your Supabase project'}</li>
                <li>{language === 'bn'
                  ? 'বাস ডেটা ইম্পোর্ট SQL চালান'
                  : 'Run the bus data import SQL'}</li>
                <li>{language === 'bn'
                  ? 'Vercel-এ পুনরায় ডিপ্লয় করুন'
                  : 'Redeploy on Vercel'}</li>
              </ol>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <Key size={14} />
              <span>{language === 'bn' 
                ? 'কখনোই সার্ভিস রোল কী ব্রাউজারে ব্যবহার করবেন না'
                : 'Never use the service role key in the browser'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-200 dark:border-amber-800 p-6 sm:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === 'bn' ? 'ডেটা লোড করতে সমস্যা' : 'Error Loading Data'}
              </h2>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {error}
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <p>{language === 'bn'
                ? 'সম্ভাব্য কারণ:'
                : 'Possible causes:'}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{language === 'bn' ? 'RLS পলিসি সঠিকভাবে কনফিগার করা হয়নি' : 'RLS policies not configured correctly'}</li>
                <li>{language === 'bn' ? 'ডেটাবেস টেবিল বিদ্যমান নেই' : 'Database tables do not exist'}</li>
                <li>{language === 'bn' ? 'নেটওয়ার্ক সমস্যা' : 'Network connectivity issue'}</li>
              </ul>
            </div>

            <button
              onClick={refetch}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
