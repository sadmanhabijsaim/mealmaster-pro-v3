
import React, { useState, useRef } from 'react';
import { AppState } from '../types';

interface SettingsProps {
  state: AppState;
  onUpdate: (updates: Partial<AppState>) => void;
  onLogout: () => void;
  onUrlChange: (newUrl: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ state, onUpdate, onLogout, onUrlChange }) => {
  const [url, setUrl] = useState(state.scriptUrl);
  const [profile, setProfile] = useState(state.profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!url.startsWith('https://script.google.com')) {
      alert("Invalid Google Script URL. Please ensure it starts with https://script.google.com");
      return;
    }
    onUrlChange(url);
    onUpdate({ 
      profile: profile
    });
    alert('Configuration updated successfully!');
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const themeColors: Record<string, string> = {
    default: 'indigo',
    food: 'orange',
    nature: 'emerald',
    sunset: 'rose'
  };
  const accent = themeColors[profile.visualTheme || 'default'];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
          <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 mb-8 flex items-center gap-3">
            <span className={`w-1.5 h-6 bg-${accent}-600 rounded-full`}></span>
            Identity & Branding
          </h3>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
               <div className="relative group cursor-pointer" onClick={triggerUpload}>
                 <img 
                   src={profile.avatarUrl} 
                   className={`w-24 h-24 rounded-3xl border-4 border-slate-100 dark:border-slate-700 object-cover shadow-lg group-hover:opacity-80 transition-all`}
                   alt="Profile"
                 />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-3xl">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
               </div>
               <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Manager Identity</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Manager Name</label>
              <input
                type="text"
                value={profile.managerName}
                onChange={(e) => setProfile({ ...profile, managerName: e.target.value })}
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-200 shadow-sm`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mess / Institution Name (Rename)</label>
              <input
                type="text"
                value={profile.messName}
                onChange={(e) => setProfile({ ...profile, messName: e.target.value })}
                placeholder="e.g. Dream House"
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-200 shadow-sm`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Application Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {id: 'default', label: 'Pro Indigo', color: 'bg-indigo-600'},
                  {id: 'food', label: 'Tasty Food', color: 'bg-orange-500'},
                  {id: 'nature', label: 'Nature Fresh', color: 'bg-emerald-500'},
                  {id: 'sunset', label: 'Sunset Glow', color: 'bg-rose-500'}
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setProfile({ ...profile, visualTheme: t.id as any })}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${profile.visualTheme === t.id ? `border-${accent}-500 bg-${accent}-50 dark:bg-${accent}-900/10` : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50'}`}
                  >
                    <div className={`w-4 h-4 rounded-full ${t.color}`}></div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
          <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 mb-8 flex items-center gap-3">
            <span className={`w-1.5 h-6 bg-${accent}-500 rounded-full`}></span>
            Advanced Connectivity
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Google Apps Script API</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-200 shadow-sm font-mono text-xs overflow-hidden text-ellipsis`}
              />
            </div>

            <div className={`p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700`}>
              <h4 className="font-bold text-indigo-950 dark:text-slate-200 text-sm mb-2">Cloud Status</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Connection established. All changes will sync with your Google Sheet automatically.
              </p>
              <button 
                onClick={onLogout}
                className="w-full py-4 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all border border-rose-100 dark:border-rose-900/20"
              >
                Logout Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`px-12 py-4 bg-${accent}-600 text-white rounded-2xl font-extrabold hover:bg-${accent}-700 transition-all shadow-xl shadow-${accent}-200 active:scale-95`}
        >
          Update Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
