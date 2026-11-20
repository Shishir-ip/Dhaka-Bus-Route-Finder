import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BusesPage from './pages/BusesPage';
import BusDetailPage from './pages/BusDetailPage';
import LocationsPage from './pages/LocationsPage';
import LocationDetailPage from './pages/LocationDetailPage';
import AboutPage from './pages/AboutPage';
import FeedbackPage from './pages/FeedbackPage';
import NotFoundPage from './pages/NotFoundPage';

const AdminPage = lazy(() => import('./pages/AdminPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Dhaka Bus Finder. {t('footer.rights')}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <Link to="/feedback" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.feedback')}
          </Link>
          <Link to="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.admin')}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
              <Navbar />
              <main className="flex-1">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/buses" element={<BusesPage />} />
                    <Route path="/bus/:slug" element={<BusDetailPage />} />
                    <Route path="/locations" element={<LocationsPage />} />
                    <Route path="/location/:slug" element={<LocationDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route
                      path="/admin"
                      element={
                        <Suspense
                          fallback={
                            <div className="min-h-[60vh] flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          }
                        >
                          <AdminPage />
                        </Suspense>
                      }
                    />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}