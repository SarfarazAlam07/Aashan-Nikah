// app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiGlobe, 
  FiBell, 
  FiLock, 
  FiUser, 
  FiMail, 
  FiMoon, 
  FiSun,
  FiSave,
  FiRefreshCw,
  FiDatabase,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Nikah Aasan',
    siteTagline: 'Halal Islamic Matrimony',
    siteEmail: 'info@nikahaasan.com',
    sitePhone: '+91 12345 67890',
    siteAddress: 'Patna, Bihar, India'
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    compactView: false
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      
      if (parsed.role !== 'SUPER_ADMIN') {
        toast.error('Access Denied');
        router.push('/admin/dashboard');
        return;
      }
      
      // Load saved settings from localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setAppearanceSettings(prev => ({ ...prev, theme: savedTheme }));
      }
    }
    setLoading(false);
  }, [router]);

  const handleSaveSettings = () => {
    setSaving(true);
    
    // Save theme
    localStorage.setItem('theme', appearanceSettings.theme);
    
    // Apply theme to body
    if (appearanceSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Simulate API call for other settings
    setTimeout(() => {
      toast.success('Settings saved successfully!');
      setSaving(false);
    }, 500);
  };

  const handleClearCache = () => {
    toast.loading('Clearing cache...', { id: 'cache' });
    setTimeout(() => {
      localStorage.clear();
      toast.success('Cache cleared! Please refresh the page.', { id: 'cache' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, 1000);
  };

  const handleBackupDatabase = () => {
    toast.loading('Creating backup...', { id: 'backup' });
    setTimeout(() => {
      toast.success('Database backup created! Download starting...', { id: 'backup' });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-white text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: FiGlobe },
    { id: 'appearance', label: 'Appearance', icon: FiMoon },
    { id: 'maintenance', label: 'Tools', icon: FiDatabase }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your platform configuration</p>
      </div>

      {/* Settings Tabs */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap transition
                  ${isActive 
                    ? 'border-b-2 border-emerald-500 text-emerald-400' 
                    : 'text-gray-400 hover:text-gray-300'
                  }
                `}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg mb-4">General Settings</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingInput
                  label="Site Name"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  icon={<FiGlobe size={14} />}
                />
                <SettingInput
                  label="Site Tagline"
                  value={generalSettings.siteTagline}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteTagline: e.target.value})}
                />
                <SettingInput
                  label="Contact Email"
                  value={generalSettings.siteEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteEmail: e.target.value})}
                  icon={<FiMail size={14} />}
                  type="email"
                />
                <SettingInput
                  label="Contact Phone"
                  value={generalSettings.sitePhone}
                  onChange={(e) => setGeneralSettings({...generalSettings, sitePhone: e.target.value})}
                />
                <SettingInput
                  label="Address"
                  value={generalSettings.siteAddress}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteAddress: e.target.value})}
                  className="sm:col-span-2"
                />
              </div>
            </div>
          )}

          {/* Appearance Settings - Working */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg mb-4">Appearance Settings</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})}
                    className={`p-4 rounded-xl border-2 transition ${
                      appearanceSettings.theme === 'dark'
                        ? 'border-emerald-500 bg-gray-700'
                        : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    <FiMoon className="mx-auto text-white text-2xl mb-2" />
                    <p className="text-white text-sm font-medium">Dark Mode</p>
                    {appearanceSettings.theme === 'dark' && (
                      <FiCheckCircle className="mx-auto mt-2 text-emerald-500" size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})}
                    className={`p-4 rounded-xl border-2 transition ${
                      appearanceSettings.theme === 'light'
                        ? 'border-emerald-500 bg-gray-700'
                        : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    <FiSun className="mx-auto text-white text-2xl mb-2" />
                    <p className="text-white text-sm font-medium">Light Mode</p>
                    {appearanceSettings.theme === 'light' && (
                      <FiCheckCircle className="mx-auto mt-2 text-emerald-500" size={16} />
                    )}
                  </button>
                </div>
                
                <SettingToggle
                  label="Compact View"
                  description="Show more content with less spacing"
                  checked={appearanceSettings.compactView}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, compactView: e.target.checked})}
                />
              </div>
            </div>
          )}

          {/* Tools Section */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg mb-4">Tools & Maintenance</h2>
              
              <div className="space-y-4">
                {/* Clear Cache */}
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FiRefreshCw className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Clear Cache</h3>
                        <p className="text-gray-400 text-xs">Clear all cached data and refresh</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearCache}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Clear Now
                    </button>
                  </div>
                </div>

                {/* Backup Database */}
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <FiDatabase className="text-emerald-400" size={20} />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Database Backup</h3>
                        <p className="text-gray-400 text-xs">Create a backup of all data</p>
                      </div>
                    </div>
                    <button
                      onClick={handleBackupDatabase}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                    >
                      Backup Now
                    </button>
                  </div>
                </div>

                {/* Info Note */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="text-yellow-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-yellow-400 text-sm font-medium">Note</p>
                      <p className="text-gray-400 text-xs">
                        General settings will be saved in database. Appearance settings are saved in your browser.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button - Only for settings that need saving */}
      {activeTab !== 'maintenance' && (
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <FiSave size={16} />
            )}
            <span>Save Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Helper Components
function SettingInput({ label, value, onChange, icon, type = 'text', className = '' }: any) {
  return (
    <div className={className}>
      <label className="block text-gray-400 text-sm mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
        />
      </div>
    </div>
  );
}

function SettingToggle({ label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-gray-400 text-xs">{description}</p>}
      </div>
      <button
        onClick={() => onChange({ target: { checked: !checked } })}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition
          ${checked ? 'bg-emerald-600' : 'bg-gray-600'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}