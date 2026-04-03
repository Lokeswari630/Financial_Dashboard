import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronsLeft, LayoutGrid, Lightbulb, WalletCards, User, Settings } from 'lucide-react';
import Header from '../components/Header';

const navItems = [
  { to: '/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/transactions', label: 'Transactions', icon: WalletCards },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
];

const pageMeta = {
  '/overview': {
    title: 'Dashboard Overview',
    subtitle: 'Your financial summary at a glance',
  },
  '/transactions': {
    title: 'Transactions',
    subtitle: 'Search, filter, and manage transactions',
  },
  '/insights': {
    title: 'Insights',
    subtitle: 'Patterns and recommendations from your data',
  },
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    const stored = localStorage.getItem('finance_sidebar_open');
    return stored === null ? true : stored === 'true';
  });
  const location = useLocation();
  const currentMeta = pageMeta[location.pathname] || pageMeta['/overview'];

  React.useEffect(() => {
    localStorage.setItem('finance_sidebar_open', String(sidebarOpen));
  }, [sidebarOpen]);

  const SidebarContent = ({ compact = false }) => (
    <div className="flex flex-col h-full">
      <div className="border-b border-blue-200/30 px-4 py-4 dark:border-slate-700">
        <div className={`flex items-center ${compact ? 'justify-center' : 'justify-between'} w-full`}>
          {!compact && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                <LayoutGrid className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Zorvyn</p>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">FINTECH</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-900/10 dark:text-slate-300 dark:hover:bg-white/10 flex-shrink-0"
            aria-label={sidebarOpen ? 'Collapse menu' : 'Expand menu'}
          >
            {sidebarOpen ? (
              <ChevronsLeft className="h-4 w-4 transition-transform duration-300" />
            ) : (
              <ChevronsLeft className="h-4 w-4 rotate-180 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      <div className={`px-3 ${compact ? 'py-5' : 'py-5'} flex-1`}>
        {!compact && (
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Navigation</p>
        )}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center ${compact ? 'justify-center' : 'justify-between'} rounded-xl border px-3 py-2.5 text-base font-medium transition ${
                    isActive
                      ? 'border-blue-500/40 bg-blue-500/15 text-blue-700 dark:text-blue-300'
                      : 'border-transparent text-slate-600 hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`
                }
                title={item.label}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {!compact && <span>{item.label}</span>}
                </span>
                {!compact && <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />}
                {compact && (
                  <span className="pointer-events-none absolute left-full ml-3 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Icons */}
      <div className={`px-3 ${compact ? 'py-3' : 'py-5'} border-t border-blue-200/30 dark:border-slate-700`}>
        <nav className="space-y-2">
          <button
            className={`group relative flex items-center ${compact ? 'justify-center' : 'justify-between'} w-full rounded-xl border px-3 py-2.5 text-base font-medium transition border-transparent text-slate-600 hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white`}
            title="Profile"
          >
            <span className="flex items-center gap-3">
              <User className="h-4 w-4" />
              {!compact && <span>Profile</span>}
            </span>
            {!compact && <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />}
            {compact && (
              <span className="pointer-events-none absolute left-full ml-3 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                Profile
              </span>
            )}
          </button>
          <button
            className={`group relative flex items-center ${compact ? 'justify-center' : 'justify-between'} w-full rounded-xl border px-3 py-5 text-base font-medium transition border-transparent text-slate-600 hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white`}
            title="Settings"
          >
            <span className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              {!compact && <span>Settings</span>}
            </span>
            {!compact && <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />}
            {compact && (
              <span className="pointer-events-none absolute left-full ml-3 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                Settings
              </span>
            )}
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-100 font-sans transition-colors dark:from-gray-900 dark:to-gray-800">
      <style>{`
        .sidebar-no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .sidebar-no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      <div className="relative flex w-full flex-col">
        <aside
          className={`hidden self-stretch rounded-r-2xl border-r border-blue-200/40 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-slate-700 dark:bg-[#06122b]/95 lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:block lg:overflow-y-auto lg:z-30 sidebar-no-scrollbar ${
            sidebarOpen ? 'w-[272px]' : 'w-[78px]'
          }`}
        >
          <SidebarContent compact={!sidebarOpen} />
        </aside>

        <div className={`flex flex-col min-h-screen ${sidebarOpen ? 'lg:ml-[272px]' : 'lg:ml-[78px]'}`}>
          <Header title={currentMeta.title} subtitle={currentMeta.subtitle} sidebarOpen={sidebarOpen} />
          <main className="min-h-[calc(100vh-120px)] min-w-0 flex-1 p-4 pb-32 md:pb-24 lg:px-8 lg:pb-8 lg:pt-6">
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 backdrop-blur-lg dark:border-slate-700/60 dark:bg-[#041233]/95 lg:hidden">
        <div className="grid grid-cols-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? 'text-blue-600 dark:text-violet-300'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
