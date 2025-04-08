'use client';

import { useEffect, useState } from 'react';

type PlatformSettings = {
  platformName: string;
  defaultTimeZone: string;
  defaultLanguage: string;
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: '',
    defaultTimeZone: '',
    defaultLanguage: '',
  });

  // Simulate fetching data from backend
  useEffect(() => {
    // TODO: Replace with real API call
    const fetchSettings = async () => {
      const dataFromServer = {
        platformName: 'Ollivu',
        defaultTimeZone: 'USD',
        defaultLanguage: 'English',
      };
      setSettings(dataFromServer);
    };

    fetchSettings();
  }, []);

  const handleChange = (field: keyof PlatformSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Platform settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Platform Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={settings.platformName}
            onChange={e => handleChange('platformName', e.target.value)}
            placeholder="Platform Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Time Zone</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={settings.defaultTimeZone}
            onChange={e => handleChange('defaultTimeZone', e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="GMT">GMT</option>
            <option value="BST">BST</option>
            <option value="IST">IST</option>
            <option value="IST">IST</option>
            <option value="IST">IST</option>
          </select>
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-10 mb-4">Set Language</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Default Language</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          value={settings.defaultLanguage}
          onChange={e => handleChange('defaultLanguage', e.target.value)}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
      </div>
    </div>
  );
};

export default SettingsPage;
