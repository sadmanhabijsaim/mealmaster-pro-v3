
import React, { useMemo } from 'react';
import { AppState } from '../types';
import * as XLSX from 'xlsx';

interface ReportProps {
  state: AppState;
}

const Report: React.FC<ReportProps> = ({ state }) => {
  const totals = useMemo(() => {
    const totalMeals = state.meals.reduce((sum, m) => sum + m.sokal + m.dupur + m.rat, 0);
    const totalBazaar = state.bazaar
      .filter(b => b.type === 'Bazaar')
      .reduce((sum, b) => sum + b.amount, 0);
    const mealRate = totalMeals > 0 ? totalBazaar / totalMeals : 0;
    const totalDeposits = state.bazaar
      .filter(b => b.type === 'Deposit')
      .reduce((sum, b) => sum + b.amount, 0);

    return { totalMeals, totalBazaar, mealRate, totalDeposits };
  }, [state.meals, state.bazaar]);

  const memberStats = useMemo(() => {
    return state.members.map(member => {
      const meals = state.meals
        .filter(m => m.memberId === member.id)
        .reduce((sum, m) => sum + m.sokal + m.dupur + m.rat, 0);
      
      const deposits = state.bazaar
        .filter(b => b.memberId === member.id && b.type === 'Deposit')
        .reduce((sum, b) => sum + b.amount, 0);
      
      const costs = meals * totals.mealRate;
      const balance = deposits - costs;

      return {
        name: member.name,
        meals: meals,
        deposits: deposits.toLocaleString(),
        costs: costs.toFixed(2),
        balance: balance.toFixed(2),
      };
    });
  }, [state.members, state.meals, state.bazaar, totals.mealRate]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
    const wsSummary = XLSX.utils.json_to_sheet(memberStats);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Member Summary");

    // All Bazaar Sheet
    const wsBazaar = XLSX.utils.json_to_sheet(state.bazaar);
    XLSX.utils.book_append_sheet(wb, wsBazaar, "Bazaar History");

    // All Meals Sheet
    const wsMeals = XLSX.utils.json_to_sheet(state.meals);
    XLSX.utils.book_append_sheet(wb, wsMeals, "Meal History");

    XLSX.writeFile(wb, `MealMaster_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-xl font-extrabold text-indigo-950 dark:text-slate-100">Monthly Summary Report</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Status: Current Period</p>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report (.xlsx)
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Member Name</th>
                <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Meals Count</th>
                <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Deposits (৳)</th>
                <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Meal Cost (৳)</th>
                <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Final Balance (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {memberStats.map((stat, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-indigo-950 dark:text-slate-200">{stat.name}</td>
                  <td className="px-6 py-5 text-center text-slate-600 dark:text-slate-400 font-medium">{stat.meals}</td>
                  <td className="px-6 py-5 text-right text-emerald-600 font-bold">৳{stat.deposits}</td>
                  <td className="px-6 py-5 text-right text-rose-500 font-bold">৳{stat.costs}</td>
                  <td className={`px-6 py-5 text-right font-extrabold ${Number(stat.balance) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {Number(stat.balance) >= 0 ? '+' : ''}৳{stat.balance}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-950 dark:bg-slate-950 text-white font-bold transition-all">
                <td className="px-6 py-5">System Totals</td>
                <td className="px-6 py-5 text-center">{totals.totalMeals}</td>
                <td className="px-6 py-5 text-right">৳{totals.totalDeposits.toLocaleString()}</td>
                <td className="px-6 py-5 text-right">৳{totals.totalBazaar.toLocaleString()}</td>
                <td className="px-6 py-5 text-right text-indigo-300">Rate: {totals.mealRate.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
