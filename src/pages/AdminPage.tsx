import { useState, useEffect } from 'react';
import { supabase, fetchStats, fetchAllBusesAdmin, fetchAllLocationsAdmin, fetchFeedback, updateFeedbackStatus, deleteFeedback, createBus, updateBus, deleteBus, createLocation, updateLocation, deleteLocation, createRoute, deleteRoute, addRouteStop, deleteRouteStop, updateRouteStopOrder } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogOut, Shield, Database, RefreshCw, Bus, MapPin, Route, MessageSquare, Plus, Edit, Trash2, Star, ExternalLink, X, Save, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ConnectionError from '../components/ConnectionError';
import { useData } from '../contexts/DataContext';
import { DBBus, DBLocation, DBFeedback, DBBusRoute, DBRouteStop } from '../lib/supabase';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'buses' | 'locations' | 'feedback'>('dashboard');
  const [stats, setStats] = useState({ totalBuses: 0, totalLocations: 0, totalRoutes: 0, totalStops: 0 });
  const [feedback, setFeedback] = useState<DBFeedback[]>([]);
  const [buses, setBuses] = useState<DBBus[]>([]);
  const [locations, setLocations] = useState<DBLocation[]>([]);
  const [editingBus, setEditingBus] = useState<DBBus | null>(null);
  const [editingLocation, setEditingLocation] = useState<DBLocation | null>(null);
  const [showBusForm, setShowBusForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showRouteEditor, setShowRouteEditor] = useState(false);
  const [editingRoute, setEditingRoute] = useState<DBBusRoute | null>(null);
  const { language, t } = useLanguage();
  const { loading: dataLoading, error, configError, refetch } = useData();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const checkUser = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const loadAllData = async () => {
    try {
      const [s, b, l, fb] = await Promise.all([
        fetchStats(),
        fetchAllBusesAdmin(),
        fetchAllLocationsAdmin(),
        fetchFeedback(),
      ]);
      setStats(s);
      setBuses(b);
      setLocations(l);
      setFeedback(fb);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
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

  const handleFeedbackStatus = async (id: string, status: 'new' | 'reviewed' | 'resolved' | 'dismissed') => {
    try {
      await updateFeedbackStatus(id, status);
      loadAllData();
    } catch (err) {
      console.error('Failed to update feedback:', err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await deleteFeedback(id);
      loadAllData();
    } catch (err) {
      console.error('Failed to delete feedback:', err);
    }
  };

  const handleSaveBus = async (busData: Partial<DBBus>) => {
    try {
      if (editingBus) {
        await updateBus(editingBus.id, busData);
      } else {
        await createBus(busData);
      }
      setShowBusForm(false);
      setEditingBus(null);
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to save bus:', err);
      const errorMessage = err?.message || 'Unknown error occurred';
      alert(`Failed to save bus: ${errorMessage}\n\nPlease check:\n1. You are logged in\n2. Database schema is up to date\n3. RLS policies allow updates`);
    }
  };

  const handleDeleteBus = async (id: string) => {
    if (!confirm('Delete this bus? This will also delete all routes.')) return;
    try {
      await deleteBus(id);
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to delete bus:', err);
      alert(`Failed to delete bus: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleCreateRoute = async (busId: string, direction: 'up' | 'down' | 'both' = 'both') => {
    try {
      await createRoute({ bus_id: busId, direction });
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to create route:', err);
      alert(`Failed to create route: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!confirm('Delete this route and all its stops?')) return;
    try {
      await deleteRoute(routeId);
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to delete route:', err);
      alert(`Failed to delete route: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleAddStop = async (routeId: string, locationId: string, order: number) => {
    try {
      await addRouteStop({ route_id: routeId, location_id: locationId, stop_order: order });
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to add stop:', err);
      alert(`Failed to add stop: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    try {
      await deleteRouteStop(stopId);
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to delete stop:', err);
      alert(`Failed to delete stop: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleReorderStops = async (routeId: string, stops: { id: string; order: number }[]) => {
    try {
      await updateRouteStopOrder(routeId, stops);
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to reorder stops:', err);
      alert(`Failed to reorder stops: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleSaveLocation = async (locationData: Partial<DBLocation>) => {
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, locationData);
      } else {
        await createLocation(locationData);
      }
      setShowLocationForm(false);
      setEditingLocation(null);
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to save location:', err);
      const errorMessage = err?.message || 'Unknown error occurred';
      alert(`Failed to save location: ${errorMessage}\n\nPlease check:\n1. You are logged in\n2. Database schema is up to date\n3. RLS policies allow updates`);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Delete this location?')) return;
    try {
      await deleteLocation(id);
      loadAllData();
      refetch();
    } catch (err: any) {
      console.error('Failed to delete location:', err);
      alert(`Failed to delete location: ${err?.message || 'Unknown error'}`);
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: Database },
          { id: 'buses', label: `Buses (${buses.length})`, labelBn: `বাস (${buses.length})`, icon: Bus },
          { id: 'locations', label: `Locations (${locations.length})`, labelBn: `স্থান (${locations.length})`, icon: MapPin },
          { id: 'feedback', label: `Feedback (${feedback.filter(f => f.status === 'new').length})`, labelBn: `ফিডব্যাক (${feedback.filter(f => f.status === 'new').length})`, icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {language === 'bn' ? tab.labelBn : tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Bus} label={language === 'bn' ? 'মোট বাস' : 'Total Buses'} value={stats.totalBuses} color="emerald" />
            <StatCard icon={MapPin} label={language === 'bn' ? 'মোট স্থান' : 'Total Locations'} value={stats.totalLocations} color="blue" />
            <StatCard icon={Route} label={language === 'bn' ? 'মোট রুট' : 'Total Routes'} value={stats.totalRoutes} color="amber" />
            <StatCard icon={MapPin} label={language === 'bn' ? 'মোট স্টপ' : 'Total Stops'} value={stats.totalStops} color="purple" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === 'bn' ? 'ডেটাবেস সংযোগ' : 'Database Connection'}
              </h2>
              <button
                onClick={() => { refetch(); loadAllData(); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                <RefreshCw size={14} />
                {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              {language === 'bn' ? 'সংযুক্ত এবং প্রস্তুত' : 'Connected and ready'}
            </div>
          </div>
        </div>
      )}

      {/* Buses Tab */}
      {activeTab === 'buses' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'bn' ? 'বাস ব্যবস্থাপনা' : 'Bus Management'}
            </h2>
            <button
              onClick={() => { setEditingBus(null); setShowBusForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              {language === 'bn' ? 'নতুন বাস' : 'Add Bus'}
            </button>
          </div>

          <div className="space-y-2">
            {buses.map(bus => (
              <div key={bus.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{bus.name_en}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{bus.name_bn}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingBus(bus); setShowRouteEditor(true); }}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Route size={14} className="inline mr-1" />
                      {language === 'bn' ? 'রুট' : 'Routes'} ({bus.routes?.length || 0})
                    </button>
                    <button
                      onClick={() => { setEditingBus(bus); setShowBusForm(true); }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteBus(bus.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showBusForm && (
            <BusForm
              bus={editingBus}
              onSave={handleSaveBus}
              onCancel={() => { setShowBusForm(false); setEditingBus(null); }}
            />
          )}

          {showRouteEditor && editingBus && (
            <RouteEditor
              bus={editingBus}
              locations={locations}
              onClose={() => { setShowRouteEditor(false); setEditingBus(null); }}
              onCreateRoute={handleCreateRoute}
              onDeleteRoute={handleDeleteRoute}
              onAddStop={handleAddStop}
              onDeleteStop={handleDeleteStop}
              onReorderStops={handleReorderStops}
            />
          )}
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'bn' ? 'স্থান ব্যবস্থাপনা' : 'Location Management'}
            </h2>
            <button
              onClick={() => { setEditingLocation(null); setShowLocationForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              {language === 'bn' ? 'নতুন স্থান' : 'Add Location'}
            </button>
          </div>

          <div className="space-y-2">
            {locations.map(loc => (
              <div key={loc.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{loc.name_en}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{loc.name_bn}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingLocation(loc); setShowLocationForm(true); }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showLocationForm && (
            <LocationForm
              location={editingLocation}
              onSave={handleSaveLocation}
              onCancel={() => { setShowLocationForm(false); setEditingLocation(null); }}
            />
          )}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'bn' ? 'ব্যবহারকারী ফিডব্যাক' : 'User Feedback'}
          </h2>
          
          {feedback.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'bn' ? 'কোনো ফিডব্যাক নেই' : 'No feedback yet'}
            </p>
          ) : (
            <div className="space-y-4">
              {feedback.map(fb => (
                <div key={fb.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{fb.subject}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {fb.name || 'Anonymous'} • {new Date(fb.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      fb.status === 'new' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      fb.status === 'reviewed' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                      fb.status === 'resolved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {fb.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{fb.message}</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={fb.status}
                      onChange={(e) => handleFeedbackStatus(fb.id, e.target.value as any)}
                      className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                    <button
                      onClick={() => handleDeleteFeedback(fb.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-3`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function BusForm({ bus, onSave, onCancel }: { bus: DBBus | null; onSave: (data: Partial<DBBus>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<DBBus>>(bus || {
    name_en: '',
    name_bn: '',
    type: 'Local',
    operating_hours: '6:00 AM - 10:00 PM',
    service_type: 'Regular',
    condition_status: 'Good',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {bus ? 'Edit Bus' : 'Add New Bus'}
          </h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name (English) *
              </label>
              <input
                type="text"
                value={formData.name_en || ''}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name (Bangla) *
              </label>
              <input
                type="text"
                value={formData.name_bn || ''}
                onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formData.type || 'Local'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="Local">Local</option>
                <option value="AC">AC</option>
                <option value="Express">Express</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Type
              </label>
              <select
                value={formData.service_type || 'Regular'}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="Regular">Regular</option>
                <option value="Semi-sitting">Semi-sitting</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Operating Hours
            </label>
            <input
              type="text"
              value={formData.operating_hours || ''}
              onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
              placeholder="6:00 AM - 10:00 PM"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Condition Status
            </label>
            <select
              value={formData.condition_status || 'Good'}
              onChange={(e) => setFormData({ ...formData, condition_status: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="Good">Good</option>
              <option value="Not Bad">Not Bad</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Star Rating (0-5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.star_rating || 0}
              onChange={(e) => setFormData({ ...formData, star_rating: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/bus-image.jpg"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active || false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RouteEditor({ 
  bus, 
  locations, 
  onClose, 
  onCreateRoute, 
  onDeleteRoute, 
  onAddStop, 
  onDeleteStop, 
  onReorderStops 
}: { 
  bus: DBBus;
  locations: DBLocation[];
  onClose: () => void;
  onCreateRoute: (busId: string, direction: 'up' | 'down' | 'both') => void;
  onDeleteRoute: (routeId: string) => void;
  onAddStop: (routeId: string, locationId: string, order: number) => void;
  onDeleteStop: (stopId: string) => void;
  onReorderStops: (routeId: string, stops: { id: string; order: number }[]) => void;
}) {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(
    bus.routes && bus.routes.length > 0 ? bus.routes[0].id : null
  );
  const [newStopLocationId, setNewStopLocationId] = useState('');
  const [newRouteDirection, setNewRouteDirection] = useState<'up' | 'down' | 'both'>('both');

  const selectedRoute = bus.routes?.find(r => r.id === selectedRouteId);
  const sortedStops = selectedRoute?.stops?.sort((a, b) => a.stop_order - b.stop_order) || [];

  const handleAddStop = () => {
    if (!selectedRouteId || !newStopLocationId) return;
    const nextOrder = sortedStops.length > 0 
      ? Math.max(...sortedStops.map(s => s.stop_order)) + 1 
      : 1;
    onAddStop(selectedRouteId, newStopLocationId, nextOrder);
    setNewStopLocationId('');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !selectedRoute) return;
    const newStops = [...sortedStops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    onReorderStops(selectedRoute.id, newStops.map((s, i) => ({ id: s.id, order: i + 1 })));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedStops.length - 1 || !selectedRoute) return;
    const newStops = [...sortedStops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    onReorderStops(selectedRoute.id, newStops.map((s, i) => ({ id: s.id, order: i + 1 })));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Manage Routes: {bus.name_en}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{bus.name_bn}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Routes List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Routes</h4>
              <button
                onClick={() => onCreateRoute(bus.id, newRouteDirection)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={14} />
                Add Route
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm text-gray-600 dark:text-gray-400">Direction:</label>
              <select
                value={newRouteDirection}
                onChange={(e) => setNewRouteDirection(e.target.value as 'up' | 'down' | 'both')}
                className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
              >
                <option value="both">Both Directions</option>
                <option value="up">Up Only</option>
                <option value="down">Down Only</option>
              </select>
            </div>

            {bus.routes && bus.routes.length > 0 ? (
              <div className="space-y-2">
                {bus.routes.map(route => (
                  <div
                    key={route.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRouteId === route.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedRouteId(route.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Route {route.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Direction: {route.direction} • {route.stops?.length || 0} stops
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRoute(route.id);
                        }}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No routes yet. Add one above.</p>
            )}
          </div>

          {/* Selected Route Stops */}
          {selectedRoute && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Stops for Route {selectedRoute.id.slice(0, 8)}
              </h4>

              {/* Add Stop */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <select
                  value={newStopLocationId}
                  onChange={(e) => setNewStopLocationId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                >
                  <option value="">Select a location...</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name_en} ({loc.name_bn})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddStop}
                  disabled={!newStopLocationId}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add Stop
                </button>
              </div>

              {/* Stops List */}
              {sortedStops.length > 0 ? (
                <div className="space-y-2">
                  {sortedStops.map((stop, index) => {
                    const location = locations.find(l => l.id === stop.location_id);
                    return (
                      <div
                        key={stop.id}
                        className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 rounded transition-colors"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === sortedStops.length - 1}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 rounded transition-colors"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {location?.name_en || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {location?.name_bn}
                          </p>
                        </div>
                        <button
                          onClick={() => onDeleteStop(stop.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No stops yet. Add one above.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LocationForm({ location, onSave, onCancel }: { location: DBLocation | null; onSave: (data: Partial<DBLocation>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<DBLocation>>(location || {
    name_en: '',
    name_bn: '',
    aliases: [],
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {location ? 'Edit Location' : 'Add New Location'}
          </h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name (English) *
            </label>
            <input
              type="text"
              value={formData.name_en || ''}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name (Bangla) *
            </label>
            <input
              type="text"
              value={formData.name_bn || ''}
              onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
              required
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Aliases (comma-separated)
            </label>
            <input
              type="text"
              value={(formData.aliases || []).join(', ')}
              onChange={(e) => setFormData({ ...formData, aliases: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              placeholder="alias1, alias2, alias3"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Google Maps URL
            </label>
            <input
              type="url"
              value={formData.google_maps_url || ''}
              onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="loc_is_active"
              checked={formData.is_active || false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="loc_is_active" className="text-sm text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
