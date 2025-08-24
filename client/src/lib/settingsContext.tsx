import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppSettings {
  units: string;
  language: string;
  theme: string;
  notifications: boolean;
  dataRefresh: number;
  userName: string;
  email: string;
  apiProvider: string;
  defaultLocation: string;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: (key: keyof AppSettings, value: any) => void;
  saveSettings: () => void;
  hasChanges: boolean;
}

const defaultSettings: AppSettings = {
  units: "metric",
  language: "english",
  theme: "dark",
  notifications: true,
  dataRefresh: 30,
  userName: "User",
  email: "user@example.com",
  apiProvider: "openweathermap",
  defaultLocation: "Los Angeles"
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('weatherMoodSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
        // Use default settings if parsing fails
        setSettings(defaultSettings);
      }
    }
  }, []);

  // Apply theme changes when settings change
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.body.className = 'dark-theme';
    } else if (settings.theme === 'light') {
      document.body.className = 'light-theme';
    } else {
      // System default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.className = prefersDark ? 'dark-theme' : 'light-theme';
    }
  }, [settings.theme]);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('weatherMoodSettings', JSON.stringify(settings));
    setHasChanges(false);
  };

  const value: SettingsContextType = {
    settings,
    updateSetting,
    saveSettings,
    hasChanges
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
