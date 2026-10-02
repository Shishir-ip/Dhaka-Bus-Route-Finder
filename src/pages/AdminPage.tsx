import { useState } from 'react';
import { Shield, Bus, MapPin, Route, Plus, Edit, Trash2, Search, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { buses, locations } from '../data/store';
import { useLanguage } from '../contexts/LanguageContext';

type AdminTab = 'dashboard' | 'buses' | 'locations' | 'routes';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const { language, t } = useLanguage();

  const stats = {
    totalBuses: buses.filter(b => b.isActive).length,
    totalLocations: locations.length,
    totalRoutes: buses.reduce((acc, b) => acc + b.routes.length, 0),
    totalStops: buses.reduce((acc, b) => acc + b.routes.reduce((a, r) => a + r.stops.length, 0), 0),
  };

  const filteredBuses = buses.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.nameEn.toLowerCase().includes(q) || b.nameBn.includes(q);
  });

  const filteredLocations = locations.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return l.nameEn.toLowerCase().includes(q) || l.nameBn.includes(q);
  });

  const tabs: { id: AdminTab; label: string; labelBn: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: BarChart3 },
    { id: 'buses', label: 'Buses', labelBn: 'বাস', icon: Bus },
    { id: 'locations', label: 'Locations', labelBn: 'স্থান', icon: MapPin },
    { id: 'routes', label: 'Routes', labelBn: 'রুট', icon: Route },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
          <Shield size={24} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'bn' ? 'বাস এবং রুট পরিচালনা' : 'Manage buses and routes'}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {language === 'bn'
            ? '⚡ এটি একটি ডেমো ড্যাশবোর্ড। Supabase সংযোগের পরে সম্পূর্ণ CRUD কার্যকারিতা সক্রিয় হবে।'
            : '⚡ This is a demo dashboard. Full CRUD functionality will be active after Supabase connection.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <tab.icon size={16} />
            {language === 'bn' ? tab.labelBn : tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Bus}
              label={language === 'bn' ? 'মোট বাস' : 'Total Buses'}
              value={stats.totalBuses}
              color="emerald"
            />
            <StatCard
              icon={MapPin}
              label={language === 'bn' ? 'মোট স্থান' : 'Total Locations'}
              value={stats.totalLocations}
              color="blue"
            />
            <StatCard
              icon={Route}
              label={language === 'bn' ? 'মোট রুট' : 'Total Routes'}
              value={stats.totalRoutes}
              color="amber"
            />
            <StatCard
              icon={MapPin}
              label={language === 'bn' ? 'মোট স্টপ' : 'Total Stops'}
              value={stats.totalStops}
              color="purple"
            />
          </div>

          {/* Recent Buses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'bn' ? 'সাম্প্রতিক বাস' : 'Recent Buses'}
            </h3>
            <div className="space-y-3">
              {buses.slice(0, 5).map(bus => (
                <div key={bus.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <Bus size={14} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {language === 'bn' ? bus.nameBn : bus.nameEn}
                      </p>
                      <p className="text-xs text-gray-500">
                        {bus.routes[0]?.stops.length || 0} {language === 'bn' ? 'টি স্টপ' : 'stops'}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={12} />
                    {language === 'bn' ? 'সক্রিয়' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Buses Tab */}
      {activeTab === 'buses' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'বাস খুঁজুন...' : 'Search buses...'}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={16} />
              {language === 'bn' ? 'নতুন বাস' : 'Add Bus'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      {language === 'bn' ? 'বাস' : 'Bus'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">
                      {language === 'bn' ? 'ধরন' : 'Type'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">
                      {language === 'bn' ? 'স্টপ' : 'Stops'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      {language === 'bn' ? 'স্ট্যাটাস' : 'Status'}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      {language === 'bn' ? 'কার্যক্রম' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuses.map(bus => (
                    <tr key={bus.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {language === 'bn' ? bus.nameBn : bus.nameEn}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {language === 'bn' ? bus.nameEn : bus.nameBn}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                          {bus.type || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {bus.routes[0]?.stops.length || 0}
                      </td>
                      <td className="px-4 py-3">
                        {bus.isActive ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={12} />
                            {language === 'bn' ? 'সক্রিয়' : 'Active'}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                            <XCircle size={12} />
                            {language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Edit">
                            <Edit size={14} className="text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'স্থান খুঁজুন...' : 'Search locations...'}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={16} />
              {language === 'bn' ? 'নতুন স্থান' : 'Add Location'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredLocations.map(loc => (
              <div key={loc.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'bn' ? loc.nameBn : loc.nameEn}
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === 'bn' ? loc.nameEn : loc.nameBn}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Edit size={14} className="text-gray-500" />
                  </button>
                  <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'bn' ? 'রুট ব্যবস্থাপনা' : 'Route Management'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {language === 'bn'
                ? 'প্রতিটি বাসের রুট এবং স্টপের ক্রম পরিচালনা করুন। Supabase সংযোগের পরে সম্পূর্ণ ড্র্যাগ-এন্ড-ড্রপ সমর্থন সক্রিয় হবে।'
                : 'Manage each bus\'s route and stop ordering. Full drag-and-drop support will be active after Supabase connection.'}
            </p>
            <div className="space-y-3">
              {buses.slice(0, 8).map(bus => (
                <div key={bus.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bus size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {language === 'bn' ? bus.nameBn : bus.nameEn}
                      </p>
                      <p className="text-xs text-gray-500">
                        {bus.routes[0]?.stops.length || 0} {language === 'bn' ? 'টি স্টপ' : 'stops'}
                      </p>
                    </div>
                  </div>
                  <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                    {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
                  </button>
                </div>
              ))}
            </div>
          </div>
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
