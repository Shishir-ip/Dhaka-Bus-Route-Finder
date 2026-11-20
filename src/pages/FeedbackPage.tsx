import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { submitFeedback, isSupabaseConfigured } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isSupabaseConfigured()) {
      setError(language === 'bn' ? 'সিস্টেম কনফিগার করা হয়নি' : 'System is not configured');
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500';

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
        <CheckCircle size={40} className="mx-auto text-emerald-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('feedback.thanks')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('feedback.thanksDesc')}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t('feedback.another')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('feedback.title')}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('feedback.subtitle')}</p>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('feedback.name')}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('feedback.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t('feedback.subject')} <span className="text-red-500">*</span>
          </label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t('feedback.message')} <span className="text-red-500">*</span>
          </label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className={`${inputClass} resize-none`} />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {submitting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={15} />
          )}
          {t('feedback.submit')}
        </button>
      </form>
    </div>
  );
}