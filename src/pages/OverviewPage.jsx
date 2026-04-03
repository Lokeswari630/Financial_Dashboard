import React from 'react';
import DashboardOverview from '../components/DashboardOverview';
import ChartsSection from '../components/ChartsSection';
import { useFinance } from '../context/FinanceContext';

export default function OverviewPage() {
  const { role } = useFinance();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todayLabel = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <section className="space-y-8" aria-labelledby="overview-welcome-heading">
      <section className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-100 px-5 py-5 shadow-sm dark:border-slate-700/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/80">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-400/20 blur-2xl dark:bg-cyan-400/12" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-indigo-400/20 blur-2xl dark:bg-indigo-400/12" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_38%)]" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            
            <h2 id="overview-welcome-heading" className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-sky-300 sm:text-[30px]">
              {greeting}, {role === 'admin' ? 'Admin' : 'Viewer'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Welcome back. Let&apos;s review today&apos;s financial pulse and recent spending signals.
            </p>
          </div>

          <div className="inline-flex h-fit items-center rounded-xl border border-blue-200/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-200">
            {todayLabel}
          </div>
        </div>
      </section>

      <DashboardOverview />
      <ChartsSection />
    </section>
  );
}
