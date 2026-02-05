import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { CloudService } from '../services/syncService';

interface AuthOverlayProps {
  onLogin: (user: User) => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  // Removed password-reset related states and handlers

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      const user = await CloudService.authenticate(isLogin ? 'LOGIN' : 'SIGNUP', {
        email: cleanEmail,
        password: cleanPassword,
        phone: phone.trim()
      });

      if (user) {
        onLogin(user);
      }
    } catch (error: any) {
      console.error("AUTH_PROCESS_ERROR:", error);
      alert(error.message || 'Authentication failed. Please check your internet or Script URL.');
    } finally {
      setIsLoading(false);
    }
  };

  // Removed handleForgot and handlePerformReset functions

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 p-4 overflow-y-auto fade-in-fast">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden transition-colors my-8"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-bl-full translate-x-12 -translate-y-12"></div>
        
          <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 dark:shadow-none">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-4.514A9.01 9.01 0 0012 15a9.01 9.01 0 006.193 2.057M12 11V3.97a4.25 4.25 0 01-5.948-5.948L12 3.97z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-indigo-950 dark:text-slate-100 mb-2 tracking-tight">MealMaster Pro</h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">
            {isLoading ? 'Establishing Cloud Connection...' : (isLogin ? 'Sign in to access mess records' : 'Register your cloud mess')}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form 
            key="auth"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleAuth} 
            className="space-y-5"
          >
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Email / Username</label>
                <input 
                  type="text" 
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-950 dark:text-slate-100 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 disabled:opacity-50"
                  placeholder="e.g. sadman"
                />
              </div>
              {!isLogin && (
                 <div>
                   <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Password (Required)</label>
                   <input 
                     type="password" 
                     required
                     disabled={isLoading}
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-950 dark:text-slate-100 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 disabled:opacity-50"
                     placeholder="••••••••"
                   />
                 </div>
              )}
              {isLogin && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Password</label>
                  <input 
                    type="password" 
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-950 dark:text-slate-100 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-extrabold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {isLogin ? 'Log In Securely' : 'Create Manager Account'}
                </button>
                {/* Forgot Password removed - admin will manage passwords in DB */}
              </div>
            </motion.form>
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center space-y-6">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already a manager?" }
            <button 
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
              className="ml-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline disabled:opacity-50"
              type="button"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>

          <div className="flex flex-col items-center gap-6">
             <a 
               href="https://www.facebook.com/sadman.siam.566175" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex flex-col items-center group transition-all"
             >
                <div className="relative mb-3">
                   <img 
                     src="Sadman24_12_25.jpg" 
                     alt="Sadman" 
                     style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #007bff', objectFit: 'cover' }}
                     onError={(e) => { (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sadman'; }}
                   />
                </div>
                <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] group-hover:text-indigo-500 transition-colors">
                  Developed by <span className="text-indigo-600 dark:text-indigo-400">Sadman354</span>
                </p>
             </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthOverlay;