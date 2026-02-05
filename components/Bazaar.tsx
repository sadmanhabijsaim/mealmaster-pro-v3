import React, { useState, useEffect } from 'react';
import { AppState, BazaarRecord } from '../types';
import { motion } from 'framer-motion';

interface BazaarProps {
  state: AppState;
  onUpdate: (bazaar: BazaarRecord[]) => void;
}

const Bazaar: React.FC<BazaarProps> = ({ state, onUpdate }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'Bazaar' as 'Bazaar' | 'Deposit',
    memberId: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<BazaarRecord | null>(null);

  useEffect(() => {
    if (!formData.memberId && state.members.length > 0) {
      setFormData(prev => ({ ...prev, memberId: state.members[0].id }));
    }
  }, [state.members, formData.memberId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.memberId) {
      alert('Missing required fields (Description, Amount, or Member)');
      return;
    }

    const newRecord: BazaarRecord = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date,
    };

    onUpdate([...state.bazaar, newRecord]);
    setFormData(prev => ({ ...prev, description: '', amount: '' }));
  };

  const deleteEntry = (id: string) => {
    if (confirm('Permanently delete this transaction record?')) {
      const newList = state.bazaar.filter(b => b.id !== id);
      onUpdate(newList);
    }
  };

  const startEdit = (entry: BazaarRecord) => {
    setEditingId(entry.id);
    setEditFormData({ ...entry });
  };

  const saveEdit = () => {
    if (!editFormData) return;
    const newList = state.bazaar.map(b => b.id === editingId ? editFormData : b);
    onUpdate(newList);
    setEditingId(null);
    setEditFormData(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  // Theme variable map
  const themeColors: Record<string, string> = {
    default: 'indigo',
    food: 'orange',
    nature: 'emerald',
    sunset: 'rose'
  };
  const accent = themeColors[state.profile.visualTheme || 'default'];

  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
        <div className="mb-10">
          <h3 className="text-2xl font-extrabold text-indigo-950 dark:text-slate-100">Quick Transaction</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Add expenses or deposits with real-time updates</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Action Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-200 transition-all appearance-none shadow-sm`}
            >
              <option value="Bazaar">Bazaar (Expense)</option>
              <option value="Deposit">Deposit (Fund)</option>
            </select>
          </div>
          
          <div className="lg:col-span-3 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Member</label>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-200 transition-all appearance-none shadow-sm`}
            >
              <option value="">Choose member...</option>
              {state.members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Chicken 2kg"
              className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-200 shadow-sm`}
            />
          </div>

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Amount (৳)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-200 shadow-sm`}
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className={`w-full py-4 bg-${accent}-600 text-white rounded-2xl font-extrabold hover:bg-${accent}-700 transition-all shadow-xl shadow-${accent}-200 dark:shadow-none active:scale-95`}
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700">
         <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <span className={`w-1.5 h-6 bg-${accent}-500 rounded-full`}></span>
             <div>
               <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100">Full Transaction History</h3>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Manager Mode: Rename & Edit Enabled</p>
             </div>
           </div>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[800px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-700">
                 <th className="px-6 py-4">Date</th>
                 <th className="px-6 py-4">Type</th>
                 <th className="px-6 py-4">Member Name</th>
                 <th className="px-6 py-4">Narration / Rename</th>
                 <th className="px-6 py-4 text-right">Amount</th>
                 <th className="px-6 py-4 text-center">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
               {state.bazaar.slice().reverse().map((entry, idx) => {
                 const isEditing = editingId === entry.id;
                 return (
                   <motion.tr 
                     key={entry.id}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                     className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                   >
                     <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                       {isEditing ? (
                         <input type="date" className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs border border-indigo-200" value={editFormData?.date} onChange={e => setEditFormData({...editFormData!, date: e.target.value})} />
                       ) : entry.date}
                     </td>
                     <td className="px-6 py-4">
                       {isEditing ? (
                         <select className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs border border-indigo-200" value={editFormData?.type} onChange={e => setEditFormData({...editFormData!, type: e.target.value as any})}>
                           <option value="Bazaar">Bazaar</option>
                           <option value="Deposit">Deposit</option>
                         </select>
                       ) : (
                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight ${entry.type === 'Bazaar' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                           {entry.type}
                         </span>
                       )}
                     </td>
                     <td className="px-6 py-4 font-bold text-indigo-950 dark:text-slate-200">
                       {isEditing ? (
                         <select className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs border border-indigo-200" value={editFormData?.memberId} onChange={e => setEditFormData({...editFormData!, memberId: e.target.value})}>
                           {state.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                         </select>
                       ) : state.members.find(m => m.id === entry.memberId)?.name}
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium italic">
                       {isEditing ? (
                         <input type="text" className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs w-full border border-indigo-200" value={editFormData?.description} onChange={e => setEditFormData({...editFormData!, description: e.target.value})} />
                       ) : entry.description}
                     </td>
                     <td className={`px-6 py-4 text-right font-extrabold text-lg ${entry.type === 'Bazaar' ? 'text-rose-600' : 'text-emerald-600'}`}>
                       {isEditing ? (
                         <input type="number" className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs w-24 text-right border border-indigo-200" value={editFormData?.amount} onChange={e => setEditFormData({...editFormData!, amount: parseFloat(e.target.value) || 0})} />
                       ) : `৳${entry.amount.toLocaleString()}`}
                     </td>
                     <td className="px-6 py-4 text-center">
                       {isEditing ? (
                         <div className="flex gap-2 justify-center">
                           <button onClick={saveEdit} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all shadow-sm" title="Save Changes"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
                           <button onClick={cancelEdit} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all shadow-sm" title="Cancel"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                         </div>
                       ) : (
                         <div className="flex gap-1 justify-center">
                           <button onClick={() => startEdit(entry)} className={`p-2 text-${accent}-400 hover:text-${accent}-600 hover:bg-${accent}-50 dark:hover:bg-${accent}-900/20 rounded-xl transition-all shadow-sm`} title="Rename/Edit Transaction">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                           </button>
                           <button onClick={() => deleteEntry(entry.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all shadow-sm" title="Permanently Delete">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                         </div>
                       )}
                     </td>
                   </motion.tr>
                 );
               })}
               {state.bazaar.length === 0 && (
                 <tr>
                   <td colSpan={6} className="px-6 py-20 text-center text-slate-400 dark:text-slate-500 font-medium italic">No transactions recorded in this period.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default Bazaar;