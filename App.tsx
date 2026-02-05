import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Member, MealRecord, BazaarRecord, User, ThemeMode } from './types';
import { INITIAL_MEMBERS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Meals from './components/Meals';
import Bazaar from './components/Bazaar';
import Settings from './components/Settings';
import Report from './components/Report';
import MealHistory from './components/MealHistory';
import AuthOverlay from './components/AuthOverlay';
import { CloudService, getScriptUrl } from './services/syncService';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [state, setState] = useState<AppState>(() => {
    const savedSession = localStorage.getItem('meal_app_session');
    const user = savedSession ? JSON.parse(savedSession) : null;
    const savedTheme = localStorage.getItem('meal_app_theme') as ThemeMode;
    
    return {
      members: INITIAL_MEMBERS,
      meals: [],
      bazaar: [],
      scriptUrl: getScriptUrl(),
      profile: {
        managerName: user ? (user.email || user.id) : 'Sadman',
        messName: 'Dream House',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sadman',
        visualTheme: 'default',
      },
      user,
      theme: savedTheme || 'light',
    };
  });

  useEffect(() => {
    const loadCloudData = async () => {
      if (state.user?.email) {
        setIsLoading(true);
        setError(null);
        try {
          const cloudData = await CloudService.fetchData(state.user.email);
          if (cloudData) {
            setState(prev => ({ ...prev, ...cloudData }));
          }
        } catch (err: any) {
          console.error("CLOUD_SYNC_ERROR", err);
          setError(err.message || 'Failed to sync with cloud database.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadCloudData();
  }, [state.user?.email, state.scriptUrl]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('meal_app_theme', state.theme);
  }, [state.theme]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      if (prev.user?.email) {
         CloudService.saveData('SYNC_STATE', prev.user.email, {
           members: newState.members,
           meals: newState.meals,
           bazaar: newState.bazaar,
           profile: newState.profile
         });
      }
      return newState;
    });
  }, []);

  const toggleTheme = () => {
    updateState({ theme: state.theme === 'light' ? 'dark' : 'light' });
  };

  const logout = () => {
    if (confirm('Log out from MealMaster Pro?')) {
      localStorage.clear();
      setState(prev => ({
        ...prev,
        user: null,
        members: INITIAL_MEMBERS,
        meals: [],
        bazaar: []
      }));
      window.location.reload();
    }
  };

  const handleLogin = (user: User) => {
    localStorage.setItem('meal_app_session', JSON.stringify(user));
    setState(prev => ({ 
      ...prev, 
      user,
      profile: {
        ...prev.profile,
        managerName: user.email || user.id
      }
    }));
  };

  const handleUrlChange = (newUrl: string) => {
    localStorage.setItem('meal_app_custom_script_url', newUrl);
    setState(prev => ({ ...prev, scriptUrl: newUrl }));
  };

  if (!state.user) {
    return <AuthOverlay onLogin={handleLogin} />;
  }

  const themeColors: Record<string, string> = {
    default: 'indigo',
    food: 'orange',
    nature: 'emerald',
    sunset: 'rose'
  };
  const accent = themeColors[state.profile.visualTheme || 'default'];

  const renderContent = () => {
    const variants = {
      initial: { opacity: 0, scale: 0.98, y: 15 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 1.02, y: -15 }
    };

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 fade-in-fast">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center mb-6 text-rose-600 shadow-xl">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-indigo-950 dark:text-slate-100 mb-2">Sync Error</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm font-medium leading-relaxed">{error}</p>
          <div className="flex gap-4">
            <button onClick={() => window.location.reload()} className={`px-10 py-4 bg-${accent}-600 text-white rounded-2xl font-extrabold shadow-xl hover:bg-${accent}-700 transition-all active:scale-95`}>Retry Sync</button>
            <button onClick={() => setActiveTab('settings')} className={`px-10 py-4 bg-white dark:bg-slate-800 text-${accent}-600 dark:text-${accent}-400 rounded-2xl font-extrabold border border-${accent}-100 dark:border-slate-700 transition-all active:scale-95`}>Settings</button>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className={`w-12 h-12 border-4 border-${accent}-600 border-t-transparent rounded-full animate-spin mb-6`}></div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cloud Sync in Progress...</p>
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'dashboard' && <Dashboard state={state} />}
          {activeTab === 'members' && <Members members={state.members} onUpdate={(m) => updateState({ members: m })} profile={state.profile} />}
          {activeTab === 'meals' && <Meals state={state} onUpdate={(m) => updateState({ meals: m })} />}
          {activeTab === 'history' && <MealHistory state={state} onUpdate={(m) => updateState({ meals: m })} />}
          {activeTab === 'bazaar' && <Bazaar state={state} onUpdate={(b) => updateState({ bazaar: b })} />}
          {activeTab === 'report' && <Report state={state} />}
          {activeTab === 'settings' && <Settings state={state} onUpdate={updateState} onLogout={logout} onUrlChange={handleUrlChange} />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className={`flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-${accent}-100 selection:text-${accent}-900`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={state.profile} />
      
      <main className="flex-1 lg:p-12 p-6 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-black text-indigo-950 dark:text-slate-100 tracking-tight">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full bg-${accent}-500 animate-pulse`}></span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Mess Session</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className={`p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-${accent}-600 transition-all premium-card-hover`}>
                {state.theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-indigo-950 dark:text-slate-200">{state.profile.managerName}</p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">Mess Manager</p>
                </div>
                <div className={`premium-border p-[2px] transition-all`} style={{ background: accent === 'orange' ? 'linear-gradient(135deg, #f97316, #fb923c)' : accent === 'emerald' ? 'linear-gradient(135deg, #10b981, #34d399)' : accent === 'rose' ? 'linear-gradient(135deg, #f43f5e, #fb7185)' : undefined }}>
                  <img src="Sadman24_12_25.jpg" alt="Avatar" className="w-10 h-10 rounded-full shadow-sm object-cover border border-white dark:border-slate-800" onError={(e) => { (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sadman'; }} />
                </div>
              </div>
            </div>
          </header>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;