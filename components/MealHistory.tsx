
import React, { useState, useMemo } from 'react';
import { AppState, MealRecord } from '../types';
import { motion } from 'framer-motion';

interface MealHistoryProps {
  state: AppState;
  onUpdate: (meals: MealRecord[]) => void;
}

const MealHistory: React.FC<MealHistoryProps> = ({ state, onUpdate }) => {
  const [filterName, setFilterName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<MealRecord | null>(null);

  const filteredHistory = useMemo(() => {
    let history = [...state.meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (filterName.trim()) {
      history = history.filter(record => {
        const member = state.members.find(m => m.id === record.memberId);
        return member?.name.toLowerCase().includes(filterName.toLowerCase());
      });
    }
    return history;
  }, [state.meals, state.members, filterName]);

  const startEdit = (record: MealRecord) => {
    setEditingId(record.id);
    setEditRecord({ ...record });
  };

  const saveEdit = () => {
    if (!editRecord) return;
    const updated = state.meals.map(m => 
      m.id === editingId ? editRecord : m
    );
    onUpdate(updated);
    setEditingId(null);
    setEditRecord(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRecord(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold text-indigo-950 dark:text-slate-100">Daily Meal History</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium italic">Full permission edit mode enabled</p>
          </div>
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Filter by name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-950 dark:text-slate-200 shadow-inner text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Member Name</th>
                <th className="px-6 py-5 text-center">Sokal</th>
                <th className="px-6 py-5 text-center">Dupur</th>
                <th className="px-6 py-5 text-center">Rat</th>
                <th className="px-6 py-5 text-right">Daily Total</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filteredHistory.map((record, idx) => {
                const isEditing = editingId === record.id;
                return (
                  <motion.tr 
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {isEditing ? (
                        <input type="date" className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs" value={editRecord?.date} onChange={e => setEditRecord({...editRecord!, date: e.target.value})} />
                      ) : record.date}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-indigo-950 dark:text-slate-200">
                      {isEditing ? (
                        <select className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs" value={editRecord?.memberId} onChange={e => setEditRecord({...editRecord!, memberId: e.target.value})}>
                          {state.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      ) : state.members.find(m => m.id === record.memberId)?.name}
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                      {isEditing ? (
                        <input type="number" step="0.5" className="w-12 text-center bg-slate-100 dark:bg-slate-900 rounded border border-indigo-200" value={editRecord?.sokal} onChange={e => setEditRecord({...editRecord!, sokal: parseFloat(e.target.value) || 0})} />
                      ) : record.sokal}
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                      {isEditing ? (
                        <input type="number" step="0.5" className="w-12 text-center bg-slate-100 dark:bg-slate-900 rounded border border-indigo-200" value={editRecord?.dupur} onChange={e => setEditRecord({...editRecord!, dupur: parseFloat(e.target.value) || 0})} />
                      ) : record.dupur}
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                      {isEditing ? (
                        <input type="number" step="0.5" className="w-12 text-center bg-slate-100 dark:bg-slate-900 rounded border border-indigo-200" value={editRecord?.rat} onChange={e => setEditRecord({...editRecord!, rat: parseFloat(e.target.value) || 0})} />
                      ) : record.rat}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="inline-flex px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                        {isEditing ? (editRecord!.sokal + editRecord!.dupur + editRecord!.rat) : (record.sokal + record.dupur + record.rat)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {isEditing ? (
                        <div className="flex gap-2 justify-center">
                          <button onClick={saveEdit} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl" title="Save"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
                          <button onClick={cancelEdit} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl" title="Cancel"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(record)} className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all" title="Rename/Edit Record">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400 dark:text-slate-500 font-medium italic">No records to display</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealHistory;
