import { useState } from 'react';
import { Save, Bell, Lock, User, Database, Palette } from 'lucide-react';

const SECTIONS = [
  {
    id: 'account',
    name: 'Account Settings',
    icon: User,
    fields: [
      { id: 'name', label: 'Full Name', type: 'text', value: 'Demo User' },
      { id: 'email', label: 'Email Address', type: 'email', value: 'demo@example.com' },
      { id: 'company', label: 'Company', type: 'text', value: 'Acme Inc.' },
    ],
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    fields: [
      { id: 'email_notifications', label: 'Email Notifications', type: 'checkbox', value: true },
      { id: 'push_notifications', label: 'Push Notifications', type: 'checkbox', value: false },
      { id: 'sms_notifications', label: 'SMS Notifications', type: 'checkbox', value: false },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    icon: Lock,
    fields: [
      { id: 'two_factor', label: '2FA Authentication', type: 'checkbox', value: true },
      { id: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', value: 30 },
    ],
  },
  {
    id: 'data',
    name: 'Data Preferences',
    icon: Database,
    fields: [
      { id: 'auto_backup', label: 'Automatic Backups', type: 'checkbox', value: true },
      { id: 'data_retention', label: 'Data Retention (days)', type: 'number', value: 90 },
      { id: 'compression', label: 'Data Compression', type: 'checkbox', value: true },
    ],
  },
  {
    id: 'appearance',
    name: 'Appearance',
    icon: Palette,
    fields: [
      { id: 'theme', label: 'Theme', type: 'select', value: 'system', options: ['light', 'dark', 'system'] },
      { id: 'compact_view', label: 'Compact View', type: 'checkbox', value: false },
    ],
  },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('account');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate save delay
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 divide-x divide-gray-200 dark:divide-gray-700">
          <div className="col-span-3 p-6">
            <nav className="space-y-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="col-span-9 p-6">
            {SECTIONS.map(
              (section) =>
                activeSection === section.id && (
                  <div key={section.id} className="space-y-6">
                    {section.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label
                          htmlFor={field.id}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          {field.label}
                        </label>
                        {field.type === 'checkbox' ? (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={field.id}
                              defaultChecked={field.value as boolean}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          </div>
                        ) : field.type === 'select' ? (
                          <select
                            id={field.id}
                            defaultValue={field.value}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                          >
                            {(field as any).options?.map((option: string) => (
                              <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            defaultValue={field.value}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}