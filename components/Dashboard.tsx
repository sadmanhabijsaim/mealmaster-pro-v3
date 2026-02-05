import React, { useMemo } from 'react';
import { AppState } from '../types';
import { motion } from 'framer-motion';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const totals = useMemo(() => {
    // Calculate total meals across all members
    const meals = state.meals.reduce((sum, m) => sum + m.sokal + m.dupur + m.rat, 0);
    
    const totalBazaar = state.bazaar.filter(b => b.type === 'Bazaar').reduce((s, b) => s + b.amount, 0);
    const totalDeposits = state.bazaar.filter(b => b.type === 'Deposit').reduce((s, b) => s + b.amount, 0);
    
    const rate = meals > 0 ? (totalBazaar / meals) : 0;
    const remaining = totalDeposits - totalBazaar;

    return { meals, bazaar: totalBazaar, deposits: totalDeposits, rate, remaining };
  }, [state.meals, state.bazaar]);

  const memberBalances = useMemo(() => {
    return state.members.map(member => {
      const meals = state.meals
        .filter(m => m.memberId === member.id)
        .reduce((sum, m) => sum + m.sokal + m.dupur + m.rat, 0);
      const deposits = state.bazaar
        .filter(b => b.memberId === member.id && b.type === 'Deposit')
        .reduce((sum, b) => sum + b.amount, 0);
      const cost = meals * totals.rate;
      const balance = deposits - cost;
      return { ...member, meals, deposits, cost, balance };
    });
  }, [state.members, state.meals, state.bazaar, totals.rate]);

  const stats = [
    { label: 'Total Meals', value: totals.meals, sub: 'Total consumed', color: 'bg-blue-600', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Meal Rate', value: `৳${totals.rate.toFixed(2)}`, sub: 'Bazaar / Meals', color: 'bg-indigo-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'Meal Fund', value: `৳${totals.deposits.toLocaleString()}`, sub: 'Total Deposits', color: 'bg-emerald-600', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Remaining', value: `৳${totals.remaining.toLocaleString()}`, sub: 'Fund - Bazaar', color: 'bg-rose-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="space-y-10 pb-20 fade-in-fast">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700 relative overflow-hidden group premium-card-hover transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] dark:opacity-[0.1] rounded-bl-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center ${stat.color} text-white shadow-lg`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-extrabold text-indigo-950 dark:text-slate-100 mb-1">{stat.value}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
            <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 flex items-center gap-3 mb-8">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              Member-wise Total Meals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {memberBalances.map((mb, idx) => (
                <motion.div 
                  key={mb.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center premium-card-hover"
                >
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-tighter">{mb.name}</span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{mb.meals}</span>
                </motion.div>
              ))}
              {memberBalances.length === 0 && (
                <p className="col-span-full text-center py-4 text-slate-400 dark:text-slate-500 italic text-sm">No members added yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                Bazaar Expense History
              </h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-700">
                     <th className="px-4 py-3">Date</th>
                     <th className="px-4 py-3">Member</th>
                     <th className="px-4 py-3">Narration</th>
                     <th className="px-4 py-3 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                    {state.bazaar.filter(b => b.type === 'Bazaar').slice(-5).reverse().map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{entry.date}</td>
                        <td className="px-4 py-3 font-bold text-indigo-950 dark:text-slate-200 text-sm">{state.members.find(m => m.id === entry.memberId)?.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 italic">{entry.description}</td>
                        <td className="px-4 py-3 text-right text-sm font-extrabold text-rose-600">৳{entry.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between h-full border border-white/5">
            <div>
              <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6">MealMaster Insights</div>
              <h4 className="text-2xl font-bold leading-tight mb-4 text-white tracking-tight">Efficient Mess Management</h4>
              <p className="text-indigo-200/80 text-sm leading-relaxed mb-8">
                Calculated Rate: <strong>৳{totals.rate.toFixed(2)}</strong><br/>
                Total Bazaar: <strong>৳{totals.bazaar.toLocaleString()}</strong><br/>
                Meal Fund: <strong>৳{totals.deposits.toLocaleString()}</strong>
              </p>
            </div>
            
            <div className="mt-auto">
               <a 
                 href="https://www.facebook.com/sadman.siam.566175" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex flex-col items-center p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all group premium-card-hover"
               >
                 <div className="relative mb-4">
                    <img 
                      src="Sadman24_12_25.jpg" 
                      alt="Sadman" 
                      style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #007bff', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sadman'; }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-indigo-950 flex items-center justify-center shadow-lg">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                 </div>
                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1">Premium Developer</p>
                 <p className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">Sadman</p>
                 <p className="text-[9px] text-indigo-300/50 mt-2 italic">Official Support</p>
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;