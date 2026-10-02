import { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { submitFeedback } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { isSupabaseConfigured } from '../lib/supabase';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!isSupabaseConfigured()) {
      setError(language === 'bn' ? 'সিস্টেম কনফিগার করা হয়নি' : 'System not configured');
      setSubmitting(false);
      return;
    }

    try {
      await submitFeedback({
        name: name || undefined,
        email: email || undefined,
        subject,
        message,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <CheckCircle size={32} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'bn' ? 'ধন্যবাদ!' : 'Thank You!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'bn'
              ? 'আপনার ফিডব্যাক সফলভাবে জমা দেওয়া হয়েছে। আমরা শীঘ্রই এটি পর্যালোচনা করব।'
              : 'Your feedback has been successfully submitted. We will review it soon.'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
          >
            {language === 'bn' ? 'আরেকটি ফিডব্যাক পাঠান' : 'Submit Another Feedback'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
          <MessageSquare size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'bn' ? 'ফিডব্যাক পাঠান' : 'Send Feedback'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'bn'
            ? 'বাসের নাম, রুট বা অন্য কিছু পরিবর্তনের প্রয়োজন হলে আমাদের জানান'
            : 'Let us know if bus names, routes, or anything else needs to be changed'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {language === 'bn' ? 'নাম (ঐচ্ছিক)' : 'Name (Optional)'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {language === 'bn' ? 'বিষয়' : 'Subject'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder={language === 'bn' ? 'যেমন: বাসের নাম ভুল, রুট পরিবর্তন...' : 'e.g., Wrong bus name, Route change...'}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {language === 'bn' ? 'বার্তা' : 'Message'} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder={language === 'bn'
              ? 'দয়া করে বিস্তারিত জানান কী পরিবর্তন করা উচিত...'
              : 'Please describe in detail what should be changed...'}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {language === 'bn' ? 'ফিডব্যাক পাঠান' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
