import React, { useState } from 'react';
import { Member, Profile } from '../types';
import { motion } from 'framer-motion';

interface MembersProps {
  members: Member[];
  onUpdate: (members: Member[]) => void;
  profile: Profile;
}

const Members: React.FC<MembersProps> = ({ members, onUpdate, profile }) => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const themeColors: Record<string, string> = {
    default: 'indigo',
    food: 'orange',
    nature: 'emerald',
    sunset: 'rose'
  };
  const accent = themeColors[profile.visualTheme || 'default'];

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      joinDate: new Date().toISOString(),
    };
    onUpdate([...members, newMember]);
    setNewName('');
  };

  const removeMember = (id: string) => {
    if (confirm('Permanently remove this member and their data?')) {
      const filtered = members.filter(m => m.id !== id);
      onUpdate(filtered);
    }
  };

  const startEdit = (member: Member) => {
    setEditingId(member.id);
    setEditName(member.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    const updated = members.map(m => 
      m.id === editingId ? { ...m, name: editName.trim() } : m
    );
    onUpdate(updated);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 fade-in-fast">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3">
          <span className={`w-1.5 h-6 bg-${accent}-600 rounded-full`}></span>
          Register New Member
        </h3>
        <form onSubmit={addMember} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Full Member Name"
            className={`flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${accent}-500 font-bold text-indigo-950 dark:text-slate-100 transition-all shadow-inner`}
          />
          <button
            type="submit"
            className={`px-10 py-4 bg-${accent}-600 text-white rounded-2xl font-extrabold hover:bg-${accent}-700 transition-all shadow-xl shadow-${accent}-100 active:scale-95`}
          >
            Add Member
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Join Date</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {members.map((member, idx) => (
                <motion.tr 
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td className="px-8 py-5 font-bold text-indigo-950 dark:text-slate-100 text-sm">
                    {editingId === member.id ? (
                      <input 
                        className={`bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded border border-${accent}-200 focus:outline-none focus:ring-1 focus:ring-${accent}-500`}
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        autoFocus
                        onBlur={saveEdit}
                        onKeyDown={e => e.key === 'Enter' && saveEdit()}
                      />
                    ) : (
                      member.name
                    )}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">{new Date(member.joinDate).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(member)}
                      className={`p-2 text-${accent}-400 hover:text-${accent}-600 hover:bg-${accent}-50 dark:hover:bg-${accent}-900/20 rounded-xl transition-all shadow-sm`}
                      title="Rename Member"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all shadow-sm"
                      title="Remove Member"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </motion.tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-400 dark:text-slate-500 font-medium italic">No active members in this cloud mess.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;