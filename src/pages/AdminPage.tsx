import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogOut, Shield, Database, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ConnectionError from '../components/ConnectionError';
import { useData } from '../contexts/DataContext';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const { language, t } = useLanguage();
  const { loading: dataLoading, error, configError } = useData();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!supabase) {
      setAuthError('Supabase not configured');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setUser(data.user);
      setEmail('');
      setPassword('');
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || configError) {
    return <ConnectionError />;
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
              <Shield size={32} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'bn' ? 'অ্যাডমিন লগইন' : 'Admin Login'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {language === 'bn' 
                ? 'বাস এবং রুট পরিচালনা করতে লগইন করুন' 
                : 'Sign in to manage buses and routes'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {language === 'bn' ? 'ইমেইল' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
            >
              {language === 'bn' ? 'লগইন' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // User is authenticated - show admin dashboard
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          {language === 'bn' ? 'লগআউট' : 'Logout'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database size={24} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'bn' ? 'ডেটাবেস সংযুক্ত' : 'Database Connected'}
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'bn'
            ? 'আপনি সফলভাবে লগইন করেছেন। Supabase ডেটাবেস সংযুক্ত এবং প্রস্তুত।'
            : 'You are successfully authenticated. Supabase database is connected and ready.'}
        </p>
        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            {language === 'bn'
              ? '✓ অ্যাডমিন CRUD অপারেশন Supabase-এর সাথে সংযুক্ত'
              : '✓ Admin CRUD operations are connected to Supabase'}
          </p>
        </div>
      </div>
    </div>
  );
}
