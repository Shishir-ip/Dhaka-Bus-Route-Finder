import { Link } from 'react-router-dom';
import { Bus, Route, MapPin, ArrowRight, Search, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// About page atmospheric image - Dhaka street life
const ABOUT_IMAGE = 'https://image.qwenlm.ai/generated-images/dd83bd80-eca6-4e33-81d6-a173b25f9b7c/_result.png';

export default function AboutPage() {
  const { t, language } = useLanguage();

  const features = [
    { icon: Route, key: 'about.feature1' },
    { icon: ArrowRight, key: 'about.feature2' },
    { icon: MapPin, key: 'about.feature3' },
    { icon: Bus, key: 'about.feature4' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero with atmospheric image */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={ABOUT_IMAGE}
          alt="Dhaka city street life"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('about.title')}
            </h1>
            <p className="text-white/80 max-w-xl">
              {t('about.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
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

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <Bus size={18} />
            {t('search.findBuses')}
          </Link>
        </div>
      </section>
    </div>
  );
}
