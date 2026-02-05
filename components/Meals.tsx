import React, { useState, useMemo, useEffect } from 'react';
import { AppState, MealRecord } from '../types';
import { motion } from 'framer-motion';

interface MealsProps {
  state: AppState;
  onUpdate: (meals: MealRecord[]) => void;
}

const Meals: React.FC<MealsProps> = ({ state, onUpdate }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMeals, setCurrentMeals] = useState<Record<string, { sokal: number; dupur: number; rat: number }>>({});

  const themeColors: Record<string, string> = {
    default: 'indigo',
    food: 'orange',
    nature: 'emerald',
    sunset: 'rose'
  };
  const accent = themeColors[state.profile.visualTheme || 'default'];

  useEffect(() => {
    const init: Record<string, { sokal: number; dupur: number; rat: number }> = {};
    state.members.forEach(m => {
      const existing = state.meals.find(record => record.date === date && record.memberId === m.id);
      init[m.id] = { 
        sokal: existing?.sokal || 0, 
        dupur: existing?.dupur || 0, 
        rat: existing?.rat || 0 
      };
    });
    setCurrentMeals(init);
  }, [date, state.members, state.meals]);

  const handleInputChange = (memberId: string, type: 'sokal' | 'dupur' | 'rat', value: string) => {
    const num = parseFloat(value) || 0;
    setCurrentMeals(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], [type]: num }
    }));
  };

  const saveMeals = () => {
    const newRecords: MealRecord[] = state.members.map(member => ({
      id: state.meals.find(m => m.date === date && m.memberId === member.id)?.id || Math.random().toString(36).substr(2, 9),
      date,
      memberId: member.id,
      ...currentMeals[member.id]
    }));

    const activeEntries = newRecords.filter(r => (r.sokal + r.dupur + r.rat) > 0);
    const filtered = state.meals.filter(m => m.date !== date);
    onUpdate([...filtered, ...activeEntries]);
    alert('Meal logs successfully saved for ' + date);
  };

  const history = useMemo(() => {
    return [...state.meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.meals]);

  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
           <div>
             <h3 className="text-2xl font-extrabold text-indigo-950 dark:text-slate-100">Daily Meal Entry</h3>
             <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Input separate counts for Sokal, Dupur, and Rat</p>
           </div>
           <div className="flex items-center gap-3">
             <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Entry Date</label>
             <input
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               className={`px-6 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-200 shadow-inner`}
             />
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {state.members.map((member, i) => (
            <motion.div 
              key={member.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 group hover:bg-white dark:hover:bg-slate-700/50 hover:border-${accent}-100 dark:hover:border-slate-600 hover:shadow-xl hover:shadow-${accent}-500/5 transition-all duration-300`}
            >
              <div className="font-extrabold text-indigo-950 dark:text-slate-200 mb-6 flex items-center justify-between">
                {member.name}
                <span className={`w-8 h-8 rounded-full bg-${accent}-50 dark:bg-${accent}-900/30 text-${accent}-600 dark:text-${accent}-400 flex items-center justify-center text-[10px] font-bold`}>
                  {(currentMeals[member.id]?.sokal || 0) + (currentMeals[member.id]?.dupur || 0) + (currentMeals[member.id]?.rat || 0)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['sokal', 'dupur', 'rat'].map((time) => (
                  <div key={time}>
                    <label className="block text-[9px] uppercase text-slate-400 dark:text-slate-500 font-extrabold mb-2 tracking-widest text-center">{time}</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={currentMeals[member.id]?.[time as 'sokal' | 'dupur' | 'rat'] ?? ''}
                      placeholder="0"
                      onChange={(e) => handleInputChange(member.id, time as any, e.target.value)}
                      className={`w-full px-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-bold text-indigo-950 dark:text-slate-200 focus:border-${accent}-500 focus:ring-2 focus:ring-${accent}-100 transition-all text-sm`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={saveMeals}
            className={`group flex items-center gap-3 px-10 py-4 bg-${accent}-600 text-white rounded-2xl font-extrabold hover:bg-${accent}-700 transition-all shadow-xl shadow-${accent}-200 active:scale-95`}
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save All Entries
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
        <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 mb-8 flex items-center gap-3">
          <span className={`w-1.5 h-6 bg-${accent}-600 rounded-full`}></span>
          Detailed Meal History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4 text-center">Breakfast</th>
                <th className="px-6 py-4 text-center">Lunch</th>
                <th className="px-6 py-4 text-center">Dinner</th>
                <th className="px-6 py-4 text-right">Daily Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{record.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-950 dark:text-slate-200">
                    {state.members.find(m => m.id === record.memberId)?.name}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400">{record.sokal}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400">{record.dupur}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400">{record.rat}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-3 py-1 bg-${accent}-50 dark:bg-${accent}-900/30 text-${accent}-600 dark:text-${accent}-400 rounded-full text-xs font-bold`}>
                      {record.sokal + record.dupur + record.rat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Meals;