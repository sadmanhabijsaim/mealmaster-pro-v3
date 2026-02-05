import React from 'react';
import { motion } from 'framer-motion';
import { Profile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: Profile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, profile }) => {
  const themeColors: Record<string, string> = {
    default: 'indigo',
    food: 'orange',
    nature: 'emerald',
    sunset: 'rose'
  };
  const accent = themeColors[profile.visualTheme || 'default'];

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'meals', label: 'Meal Entry', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { id: 'history', label: 'Meal History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'bazaar', label: 'Bazaar Log', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'members', label: 'Members', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'report', label: 'Insights', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'settings', label: 'Config', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const activeBg = {
    indigo: 'bg-indigo-600 shadow-indigo-600/30',
    orange: 'bg-orange-600 shadow-orange-600/30',
    emerald: 'bg-emerald-600 shadow-emerald-600/30',
    rose: 'bg-rose-600 shadow-rose-600/30'
  }[accent];

  const iconActive = {
    indigo: 'text-indigo-300',
    orange: 'text-orange-300',
    emerald: 'text-emerald-300',
    rose: 'text-rose-300'
  }[accent];

  return (
    <div className="w-20 lg:w-72 bg-indigo-950 flex flex-col transition-all duration-300 z-30 shadow-2xl relative">
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl ${activeBg} flex items-center justify-center shadow-xl`}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <span className="font-extrabold text-white text-xl tracking-tight block truncate">{profile.messName}</span>
            <span className={`text-[10px] ${iconActive} font-bold uppercase tracking-widest`}>{profile.managerName}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 relative group ${
              activeTab === item.id 
                ? `${activeBg} text-white shadow-lg` 
                : `text-indigo-300 hover:bg-white/5 hover:text-white`
            }`}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute left-0 w-1 h-6 bg-white rounded-full translate-x-1"
              />
            )}
            <svg className={`w-5 h-5 shrink-0 transition-colors ${activeTab === item.id ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className={`hidden lg:block font-bold text-sm tracking-wide transition-colors ${activeTab === item.id ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 mt-auto hidden lg:block">
        <div className="p-4 bg-white/5 rounded-3xl border border-white/5">
          <p className={`text-[10px] ${iconActive} font-bold uppercase tracking-widest mb-1`}>Status</p>
          <p className="text-white font-bold text-xs">Premium Activated</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;