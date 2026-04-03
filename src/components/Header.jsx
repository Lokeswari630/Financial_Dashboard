import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp } from 'lucide-react';
import { Moon, Sun } from 'lucide-react';

export default function Header({
  title = 'Dashboard Overview',
  subtitle = 'Your financial summary at a glance',
  sidebarOpen = true,
}) {
  const { role, setRole, isDarkMode, toggleDarkMode } = useFinance();

  return (
    <header className="font-sans bg-white shadow-lg transition-all duration-300 dark:bg-gray-800">
      <div className="w-full px-3 py-2 sm:px-6 sm:py-3 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <TrendingUp className="h-5 w-5 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-semibold leading-tight truncate bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent sm:text-2xl dark:from-violet-300 dark:to-fuchsia-300">
                  {title}
                </h1>
                <p className="text-xs leading-tight text-gray-500 truncate sm:text-sm dark:text-gray-400">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
              {/* Role Selector - Hidden on very small screens */}
              <div className="hidden sm:flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Role:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field w-[100px] sm:w-auto py-2 text-sm cursor-pointer"
                >
                  <option value="viewer">👁️ Viewer</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
