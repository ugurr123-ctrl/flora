import React from 'react';
import { Heart, CalendarDays, BarChart2, User } from 'lucide-react';
import { TabType } from '../types';
import { soundEngine } from '../utils/audio';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'bugun' as TabType,
      label: 'Bugün',
      icon: Heart,
    },
    {
      id: 'dongu' as TabType,
      label: 'Döngü',
      icon: CalendarDays,
    },
    {
      id: 'raporlar' as TabType,
      label: 'Raporlar',
      icon: BarChart2,
    },
    {
      id: 'profil' as TabType,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto px-4 pb-3">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-full py-2 px-3 shadow-[0_12px_36px_rgba(216,27,96,0.18)] border border-pink-100 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playDropletSound();
                  setActiveTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-[#805062] hover:text-[#b0004a]'
                }`}
              >
                {isActive ? (
                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#b0004a] to-[#d81b60] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(216,27,96,0.4)] scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#b0004a] mt-1">
                      {tab.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-1 px-3">
                    <Icon className="w-5 h-5 text-[#805062]" />
                    <span className="text-[10px] font-semibold text-[#805062] mt-1">
                      {tab.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
