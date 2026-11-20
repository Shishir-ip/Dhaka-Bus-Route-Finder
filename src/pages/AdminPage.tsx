import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  LogOut, Shield, Database, RefreshCw, Bus, MapPin, Route, MessageSquare,
  Plus, Edit, Trash2, X, Save, ArrowUp, ArrowDown, Search, CheckCircle, AlertTriangle,
} from 'lucide-react';
import {
  supabase, fetchStats, fetchAdminData, fetchFeedback, updateFeedbackStatus, deleteFeedback,
  createBus, updateBus, deleteBus, createLocation, updateLocation, deleteLocation,
  createRoute, deleteRoute, addRouteStop, deleteRouteStop, updateRouteStopOrder,
  DBBus, DBLocation, DBFeedback,
} from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import ConnectionError from '../components/ConnectionError';
import Modal from '../components/Modal';
import { StarDisplay, StarPicker } from '../components/StarRating';
import { useSEO } from '../utils/seo';

type Tab = 'dashboard' | 'buses' | 'locations' | 'feedback';
type Toast = { msg: string; kind: 'success' | 'error' } | null;

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500';
const labelClass = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';
const btnPrimary =
  'inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors';
const btnGhost =
  'inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState({ totalBuses: 0, totalLocations: 0, totalRoutes: 0, totalStops: 0 });
  const [buses, setBuses] = useState<DBBus[]>([]);
  const [locations, setLocations] = useState<DBLocation[]>([]);
  const [feedback, setFeedback] = useState<DBFeedback[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [busSearch, setBusSearch] = useState('');
  const [locSearch, setLocSearch] = useState('');
  const [showBusForm, setShowBusForm] = useState(false);
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [routeBusId, setRouteBusId] = useState<string | null>(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const { language, t } = useLanguage();
  const { configError, refetch } = useData();
  useSEO({ title: 'Admin — Dhaka Bus Finder', description: '', noindex: true });

  // Always derive the edited records from the freshest data so the route
  // editor updates immediately after every mutation.
  const editingBus = buses.find((b) => b.id === editingBusId) ?? null;
  const routeBus = buses.find((b) => b.id === routeBusId) ?? null;
  const editingLocation = locations.find((l) => l.id === editingLocationId) ?? null;

  const notify = useCallback((msg: string, kind: 'success' | 'error' = 'success') => {
    setToast({ msg, kind });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });
  }, []);

  const loadAllData = useCallback(async () => {
    setDataLoading(true);
    setLoadError('');
    try {
      const [graph, s, fb] = await Promise.all([fetchAdminData(), fetchStats(), fetchFeedback()]);
      setBuses(graph.buses);
      setLocations(graph.locations);
      setStats(s);
      setFeedback(fb);
    } catch (err) {
      console.error('Admin data load failed:', err);
      setLoadError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadAllData();
  }, [user, loadAllData]);

  const reload = useCallback(async () => {
    await loadAllData();
    refetch();
  }, [loadAllData, refetch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError('');
    setSigningIn(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setSigningIn(false);
    if (error) setAuthError(error.message);
    else {
      setUser(data.user);
      setEmail('');
      setPassword('');
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setBuses([]);
    setLocations([]);
    setFeedback([]);
  };

  // ----- Bus handlers (throw so forms can show the real error inline) -----
  const handleSaveBus = async (data: Partial<DBBus>) => {
    if (editingBusId) await updateBus(editingBusId, data);
    else await createBus(data);
    setShowBusForm(false);
    setEditingBusId(null);
    notify(language === 'bn' ? 'বাস সংরক্ষিত হয়েছে' : 'Bus saved');
    await reload();
  };

  const handleDeleteBus = async (id: string) => {
    if (!confirm(language === 'bn' ? 'এই বাস ও এর সব রুট মুছে ফেলবেন?' : 'Delete this bus and all its routes?')) return;
    try {
      await deleteBus(id);
      notify(language === 'bn' ? 'বাস মুছে ফেলা হয়েছে' : 'Bus deleted');
      await reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  // ----- Location handlers -----
  const handleSaveLocation = async (data: Partial<DBLocation>) => {
    if (editingLocationId) await updateLocation(editingLocationId, data);
    else await createLocation(data);
    setShowLocationForm(false);
    setEditingLocationId(null);
    notify(language === 'bn' ? 'স্থান সংরক্ষিত হয়েছে' : 'Location saved');
    await reload();
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm(language === 'bn' ? 'এই স্থান মুছে ফেলবেন? এর সব স্টপও মুছে যাবে।' : 'Delete this location? Its stops on every route will also be removed.')) return;
    try {
      await deleteLocation(id);
      notify(language === 'bn' ? 'স্থান মুছে ফেলা হয়েছে' : 'Location deleted');
      await reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  // ----- Route handlers -----
  const handleCreateRoute = async (busId: string, direction: 'up' | 'down' | 'both') => {
    await createRoute(busId, direction);
    notify(language === 'bn' ? 'রুট যোগ হয়েছে' : 'Route added');
    await reload();
  };
  const handleDeleteRoute = async (routeId: string) => {
    if (!confirm(language === 'bn' ? 'এই রুট ও এর সব স্টপ মুছে ফেলবেন?' : 'Delete this route and all its stops?')) return;
    await deleteRoute(routeId);
    notify(language === 'bn' ? 'রুট মুছে ফেলা হয়েছে' : 'Route deleted');
    await reload();
  };
  const handleAddStop = async (routeId: string, locationId: string, order: number) => {
    await addRouteStop(routeId, locationId, order);
    await reload();
  };
  const handleDeleteStop = async (stopId: string) => {
    await deleteRouteStop(stopId);
    await reload();
  };
  const handleReorderStops = async (stops: { id: string; order: number }[]) => {
    await updateRouteStopOrder(stops);
    await reload();
  };

  // ----- Feedback handlers -----
  const handleFeedbackStatus = async (id: string, status: DBFeedback['status']) => {
    try {
      await updateFeedbackStatus(id, status);
      await loadAllData();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Update failed', 'error');
    }
  };
  const handleDeleteFeedback = async (id: string) => {
    if (!confirm(language === 'bn' ? 'এই ফিডব্যাক মুছে ফেলবেন?' : 'Delete this feedback?')) return;
    try {
      await deleteFeedback(id);
      await loadAllData();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  const filteredBuses = useMemo(() => {
    const q = busSearch.toLowerCase().trim();
    const list = q ? buses.filter((b) => b.name_en.toLowerCase().includes(q) || (b.name_bn || '').toLowerCase().includes(q)) : buses;
    return [...list].sort((a, b) => a.name_en.localeCompare(b.name_en));
  }, [buses, busSearch]);

  const filteredLocations = useMemo(() => {
    const q = locSearch.toLowerCase().trim();
    const list = q ? locations.filter((l) => l.name_en.toLowerCase().includes(q) || (l.name_bn || '').toLowerCase().includes(q)) : locations;
    return [...list].sort((a, b) => a.name_en.localeCompare(b.name_en));
  }, [locations, locSearch]);

  if (configError) return <ConnectionError />;

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ----- Login -----
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl mb-3">
              <Shield size={22} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {language === 'bn' ? 'অ্যাডমিন লগইন' : 'Admin login'}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {language === 'bn' ? 'Supabase Auth অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন' : 'Sign in with your Supabase Auth admin account'}
            </p>
          </div>
          <form onSubmit={handleLogin} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
            <div>
              <label className={labelClass}>{language === 'bn' ? 'ইমেইল' : 'Email'}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
            </div>
            {authError && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">{authError}</p>
            )}
            <button type="submit" disabled={signingIn} className={`${btnPrimary} w-full justify-center`}>
              {signingIn && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {language === 'bn' ? 'লগইন' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Bus }[] = [
    { id: 'dashboard', label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', icon: Database },
    { id: 'buses', label: `${language === 'bn' ? 'বাস' : 'Buses'} (${buses.length})`, icon: Bus },
    { id: 'locations', label: `${language === 'bn' ? 'স্থান' : 'Locations'} (${locations.length})`, icon: MapPin },
    { id: 'feedback', label: `${language === 'bn' ? 'ফিডব্যাক' : 'Feedback'} (${feedback.filter((f) => f.status === 'new').length})`, icon: MessageSquare },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin dashboard'}
          </h1>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => reload()} className={btnGhost} disabled={dataLoading}>
            <RefreshCw size={14} className={dataLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
          <button onClick={handleLogout} className={btnGhost}>
            <LogOut size={14} />
            <span className="hidden sm:inline">{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {loadError && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 mb-4">
          {loadError}
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white font-medium'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: language === 'bn' ? 'মোট বাস' : 'Buses', value: stats.totalBuses, icon: Bus },
            { label: language === 'bn' ? 'মোট স্থান' : 'Locations', value: stats.totalLocations, icon: MapPin },
            { label: language === 'bn' ? 'মোট রুট' : 'Routes', value: stats.totalRoutes, icon: Route },
            { label: language === 'bn' ? 'মোট স্টপ' : 'Stops', value: stats.totalStops, icon: MapPin },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <s.icon size={16} className="text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Buses */}
      {activeTab === 'buses' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {language === 'bn' ? 'বাস ব্যবস্থাপনা' : 'Bus management'}
            </h2>
            <button
              onClick={() => { setEditingBusId(null); setShowBusForm(true); }}
              className={btnPrimary}
            >
              <Plus size={15} />
              {language === 'bn' ? 'নতুন বাস' : 'Add bus'}
            </button>
          </div>
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={busSearch}
              onChange={(e) => setBusSearch(e.target.value)}
              placeholder={language === 'bn' ? 'বাস খুঁজুন…' : 'Search buses…'}
              className={`${inputClass} pl-9`}
            />
          </div>
          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {filteredBuses.map((bus) => (
              <div key={bus.id} className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{bus.name_en}</span>
                    {bus.star_rating ? <StarDisplay rating={Number(bus.star_rating)} size={11} /> : null}
                    {!bus.is_active && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">{t('common.inactive')}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{bus.name_bn}</p>
                </div>
                <button
                  onClick={() => setRouteBusId(bus.id)}
                  className="shrink-0 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/70 rounded-lg transition-colors"
                >
                  <Route size={12} className="inline mr-1" />
                  {bus.routes?.length || 0}
                </button>
                <button
                  onClick={() => { setEditingBusId(bus.id); setShowBusForm(true); }}
                  aria-label={t('common.edit')}
                  className="shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Edit size={14} className="text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeleteBus(bus.id)}
                  aria-label={t('common.delete')}
                  className="shrink-0 p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            ))}
            {filteredBuses.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">{language === 'bn' ? 'কোনো বাস পাওয়া যায়নি' : 'No buses found'}</p>
            )}
          </div>
        </div>
      )}

      {/* Locations */}
      {activeTab === 'locations' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {language === 'bn' ? 'স্থান ব্যবস্থাপনা' : 'Location management'}
            </h2>
            <button onClick={() => { setEditingLocationId(null); setShowLocationForm(true); }} className={btnPrimary}>
              <Plus size={15} />
              {language === 'bn' ? 'নতুন স্থান' : 'Add location'}
            </button>
          </div>
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={locSearch}
              onChange={(e) => setLocSearch(e.target.value)}
              placeholder={language === 'bn' ? 'স্থান খুঁজুন…' : 'Search locations…'}
              className={`${inputClass} pl-9`}
            />
          </div>
          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {filteredLocations.map((loc) => (
              <div key={loc.id} className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{loc.name_en}</span>
                    {!loc.is_active && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">{t('common.inactive')}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{loc.name_bn}</p>
                </div>
                <button
                  onClick={() => { setEditingLocationId(loc.id); setShowLocationForm(true); }}
                  aria-label={t('common.edit')}
                  className="shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Edit size={14} className="text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeleteLocation(loc.id)}
                  aria-label={t('common.delete')}
                  className="shrink-0 p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            ))}
            {filteredLocations.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">{language === 'bn' ? 'কোনো স্থান পাওয়া যায়নি' : 'No locations found'}</p>
            )}
          </div>
        </div>
      )}

      {/* Feedback */}
      {activeTab === 'feedback' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'bn' ? 'ব্যবহারকারী ফিডব্যাক' : 'User feedback'}
          </h2>
          {feedback.length === 0 ? (
            <p className="text-sm text-gray-400">{language === 'bn' ? 'কোনো ফিডব্যাক নেই' : 'No feedback yet'}</p>
          ) : (
            <div className="space-y-3">
              {feedback.map((fb) => (
                <div key={fb.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{fb.subject}</h3>
                      <p className="text-xs text-gray-400">
                        {fb.name || 'Anonymous'} · {new Date(fb.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      fb.status === 'new' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                      : fb.status === 'reviewed' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                      : fb.status === 'resolved' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                      {fb.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-wrap">{fb.message}</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={fb.status}
                      onChange={(e) => handleFeedbackStatus(fb.id, e.target.value as DBFeedback['status'])}
                      className="text-xs px-2 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                    <button
                      onClick={() => handleDeleteFeedback(fb.id)}
                      aria-label={t('common.delete')}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showBusForm && (
        <BusForm
          bus={editingBus}
          onSave={handleSaveBus}
          onCancel={() => { setShowBusForm(false); setEditingBusId(null); }}
        />
      )}
      {routeBus && (
        <RouteEditor
          bus={routeBus}
          locations={locations}
          onClose={() => setRouteBusId(null)}
          onCreateRoute={handleCreateRoute}
          onDeleteRoute={handleDeleteRoute}
          onAddStop={handleAddStop}
          onDeleteStop={handleDeleteStop}
          onReorderStops={handleReorderStops}
        />
      )}
      {showLocationForm && (
        <LocationForm
          location={editingLocation}
          onSave={handleSaveLocation}
          onCancel={() => { setShowLocationForm(false); setEditingLocationId(null); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg fade-in ${
          toast.kind === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.kind === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          <span className="max-w-[80vw] truncate">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

// ================= Bus form =================
function BusForm({ bus, onSave, onCancel }: {
  bus: DBBus | null;
  onSave: (data: Partial<DBBus>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(() => ({
    name_en: bus?.name_en ?? '',
    name_bn: bus?.name_bn ?? '',
    type: bus?.type ?? 'Local',
    service_type: bus?.service_type ?? 'Regular',
    condition_status: bus?.condition_status ?? 'Good',
    operating_hours: bus?.operating_hours ?? '',
    star_rating: bus?.star_rating != null ? Number(bus.star_rating) : 0,
    image_url: bus?.image_url ?? '',
    description: bus?.description ?? '',
    notes: bus?.notes ?? '',
    is_active: bus?.is_active ?? true,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save bus');
      setSaving(false);
    }
  };

  return (
    <Modal title={bus ? (language === 'bn' ? 'বাস সম্পাদনা' : 'Edit bus') : (language === 'bn' ? 'নতুন বাস' : 'Add bus')} subtitle={bus?.name_en} onClose={onCancel}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{language === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'} *</label>
            <input value={form.name_en} onChange={(e) => set({ name_en: e.target.value })} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{language === 'bn' ? 'নাম (বাংলা)' : 'Name (Bangla)'}</label>
            <input value={form.name_bn} onChange={(e) => set({ name_bn: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t('bus.type')}</label>
            <select value={form.type} onChange={(e) => set({ type: e.target.value })} className={inputClass}>
              <option>Local</option>
              <option>AC</option>
              <option>Express</option>
              <option>Metro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('bus.service')}</label>
            <select value={form.service_type} onChange={(e) => set({ service_type: e.target.value })} className={inputClass}>
              <option>Regular</option>
              <option>Semi-sitting</option>
              <option>Both</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('bus.condition')}</label>
            <select value={form.condition_status} onChange={(e) => set({ condition_status: e.target.value })} className={inputClass}>
              <option>Good</option>
              <option>Not Bad</option>
              <option>Needs Improvement</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('bus.hours')}</label>
          <input value={form.operating_hours} onChange={(e) => set({ operating_hours: e.target.value })} placeholder="6:00 AM - 10:00 PM" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            {language === 'bn' ? 'স্টার রেটিং (সেরা বাস উপরে দেখাবে)' : 'Star rating (better buses rank higher in search)'}
          </label>
          <StarPicker value={form.star_rating} onChange={(v) => set({ star_rating: v })} />
        </div>

        <div>
          <label className={labelClass}>{language === 'bn' ? 'ছবির URL' : 'Image URL'}</label>
          <input type="url" value={form.image_url} onChange={(e) => set({ image_url: e.target.value })} placeholder="https://…" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{language === 'bn' ? 'বিবরণ' : 'Description'}</label>
          <textarea value={form.description} onChange={(e) => set({ description: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label className={labelClass}>{language === 'bn' ? 'নোট' : 'Notes'}</label>
          <textarea value={form.notes} onChange={(e) => set({ notes: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set({ is_active: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
          {t('common.active')}
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 break-all">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
            {t('common.save')}
          </button>
          <button type="button" onClick={onCancel} className={btnGhost}>{t('common.cancel')}</button>
        </div>
      </form>
    </Modal>
  );
}

// ================= Route editor =================
function RouteEditor({ bus, locations, onClose, onCreateRoute, onDeleteRoute, onAddStop, onDeleteStop, onReorderStops }: {
  bus: DBBus;
  locations: DBLocation[];
  onClose: () => void;
  onCreateRoute: (busId: string, direction: 'up' | 'down' | 'both') => Promise<void>;
  onDeleteRoute: (routeId: string) => Promise<void>;
  onAddStop: (routeId: string, locationId: string, order: number) => Promise<void>;
  onDeleteStop: (stopId: string) => Promise<void>;
  onReorderStops: (stops: { id: string; order: number }[]) => Promise<void>;
}) {
  const routes = bus.routes || [];
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(routes[0]?.id ?? null);
  const [newDirection, setNewDirection] = useState<'up' | 'down' | 'both'>('both');
  const [stopQuery, setStopQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) ?? routes[0] ?? null;
  const sortedStops = useMemo(
    () => [...(selectedRoute?.stops ?? [])].sort((a, b) => a.stop_order - b.stop_order),
    [selectedRoute]
  );
  const sortedLocations = useMemo(() => [...locations].sort((a, b) => a.name_en.localeCompare(b.name_en)), [locations]);
  const locationById = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);

  const run = async (fn: () => Promise<void>) => {
    setError('');
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setBusy(false);
    }
  };

  const addStop = () => {
    if (!selectedRoute) return;
    const q = stopQuery.trim().toLowerCase();
    const loc = locations.find((l) => l.name_en.toLowerCase() === q || (l.name_bn || '').toLowerCase() === q);
    if (!loc) {
      setError(language === 'bn' ? 'তালিকা থেকে একটি স্থান নির্বাচন করুন' : 'Pick a location from the list');
      return;
    }
    const nextOrder = sortedStops.length ? Math.max(...sortedStops.map((s) => s.stop_order)) + 1 : 1;
    run(async () => {
      await onAddStop(selectedRoute.id, loc.id, nextOrder);
      setStopQuery('');
    });
  };

  const move = (index: number, delta: number) => {
    if (!selectedRoute) return;
    const target = index + delta;
    if (target < 0 || target >= sortedStops.length) return;
    const next = [...sortedStops];
    [next[index], next[target]] = [next[target], next[index]];
    run(() => onReorderStops(next.map((s, i) => ({ id: s.id, order: i + 1 }))));
  };

  return (
    <Modal title={`${language === 'bn' ? 'রুট' : 'Routes'}: ${bus.name_en}`} subtitle={bus.name_bn || undefined} onClose={onClose} wide>
      <div className="space-y-5">
        {/* Route selector */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('bus.routes')}</h4>
            <div className="flex items-center gap-2">
              <select
                value={newDirection}
                onChange={(e) => setNewDirection(e.target.value as 'up' | 'down' | 'both')}
                className="text-xs px-2 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300"
              >
                <option value="both">{t('bus.directionBoth')}</option>
                <option value="up">{t('bus.directionUp')}</option>
                <option value="down">{t('bus.directionDown')}</option>
              </select>
              <button
                onClick={() => run(() => onCreateRoute(bus.id, newDirection))}
                disabled={busy}
                className={btnPrimary}
              >
                <Plus size={14} />
                {language === 'bn' ? 'রুট যোগ' : 'Add route'}
              </button>
            </div>
          </div>
          {routes.length === 0 ? (
            <p className="text-sm text-gray-400">{language === 'bn' ? 'কোনো রুট নেই। উপরে যোগ করুন।' : 'No routes yet. Add one above.'}</p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {routes.map((route, i) => (
                <div
                  key={route.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedRoute?.id === route.id
                      ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedRouteId(route.id)}
                >
                  <span>
                    {language === 'bn' ? 'রুট' : 'Route'} {i + 1} · {route.stops?.length || 0} {t('results.stops')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      run(() => onDeleteRoute(route.id));
                    }}
                    aria-label={t('common.delete')}
                    className="p-0.5 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stops */}
        {selectedRoute && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'bn' ? 'স্টপসমূহ' : 'Stops'} ({sortedStops.length})
            </h4>
            <div className="flex gap-2 mb-3">
              <input
                list="admin-locations"
                value={stopQuery}
                onChange={(e) => setStopQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addStop();
                  }
                }}
                placeholder={language === 'bn' ? 'স্থানের নাম লিখুন…' : 'Type a location name…'}
                className={inputClass}
              />
              <datalist id="admin-locations">
                {sortedLocations.map((l) => (
                  <option key={l.id} value={l.name_en}>{l.name_bn || ''}</option>
                ))}
              </datalist>
              <button onClick={addStop} disabled={busy || !stopQuery.trim()} className={btnPrimary}>
                <Plus size={14} />
                {language === 'bn' ? 'যোগ' : 'Add'}
              </button>
            </div>

            {sortedStops.length === 0 ? (
              <p className="text-sm text-gray-400">{language === 'bn' ? 'কোনো স্টপ নেই।' : 'No stops yet.'}</p>
            ) : (
              <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-1">
                {sortedStops.map((stop, index) => {
                  const loc = locationById.get(stop.location_id);
                  return (
                    <div key={stop.id} className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5">
                      <span className="w-6 text-center text-xs text-gray-400 shrink-0">{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-gray-900 dark:text-white truncate">{loc?.name_en || 'Unknown'}</span>
                        {loc?.name_bn && <span className="block text-xs text-gray-400 truncate">{loc.name_bn}</span>}
                      </span>
                      <button onClick={() => move(index, -1)} disabled={index === 0 || busy} aria-label="Move up" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30">
                        <ArrowUp size={13} />
                      </button>
                      <button onClick={() => move(index, 1)} disabled={index === sortedStops.length - 1 || busy} aria-label="Move down" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30">
                        <ArrowDown size={13} />
                      </button>
                      <button onClick={() => run(() => onDeleteStop(stop.id))} disabled={busy} aria-label={t('common.delete')} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded text-red-500">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 break-all">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

// ================= Location form =================
function LocationForm({ location, onSave, onCancel }: {
  location: DBLocation | null;
  onSave: (data: Partial<DBLocation>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(() => ({
    name_en: location?.name_en ?? '',
    name_bn: location?.name_bn ?? '',
    aliases: (location?.aliases ?? []).join(', '),
    google_maps_url: location?.google_maps_url ?? '',
    is_active: location?.is_active ?? true,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave({
        name_en: form.name_en,
        name_bn: form.name_bn,
        aliases: form.aliases.split(',').map((s) => s.trim()).filter(Boolean),
        google_maps_url: form.google_maps_url,
        is_active: form.is_active,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save location');
      setSaving(false);
    }
  };

  return (
    <Modal
      title={location ? (language === 'bn' ? 'স্থান সম্পাদনা' : 'Edit location') : (language === 'bn' ? 'নতুন স্থান' : 'Add location')}
      onClose={onCancel}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={labelClass}>{language === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'} *</label>
          <input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{language === 'bn' ? 'নাম (বাংলা)' : 'Name (Bangla)'}</label>
          <input value={form.name_bn} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{language === 'bn' ? 'উপনাম (কমা দিয়ে)' : 'Aliases (comma-separated)'}</label>
          <input value={form.aliases} onChange={(e) => setForm({ ...form, aliases: e.target.value })} placeholder="alias1, alias2" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Google Maps URL</label>
          <input type="url" value={form.google_maps_url} onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })} placeholder="https://maps.google.com/…" className={inputClass} />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
          {t('common.active')}
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 break-all">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
            {t('common.save')}
          </button>
          <button type="button" onClick={onCancel} className={btnGhost}>{t('common.cancel')}</button>
        </div>
      </form>
    </Modal>
  );
}