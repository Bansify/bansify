import React, { useState } from 'react';
import {
  Home,
  LayoutGrid,
  Boxes,
  BookOpen,
  Building2,
  Settings,
  PanelLeft,
  Bell,
  Sparkles,
} from 'lucide-react';

export interface ShellNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface AppShellProps {
  /** Left rail shortcuts (the thin strip of icons). */
  rail?: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  activeRail?: string;
  onRailSelect?: (id: string) => void;
  /** Sidebar header, e.g. "Bansify". */
  sidebarTitle: string;
  navItems: ShellNavItem[];
  activeNav: string;
  onNavSelect: (id: string) => void;
  /** Optional secondary list under the nav (recent items, quick links). */
  sidebarFooter?: React.ReactNode;
  /** Right-hand side of the content header. */
  headerAction?: React.ReactNode;
  /** Account chip rendered at the bottom of the rail. */
  accountSlot?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Productive shell: a thin icon rail, a section sidebar and a card canvas —
 * the layout used across Bansify web apps.
 */
export const AppShell: React.FC<AppShellProps> = ({
  rail,
  activeRail = 'home',
  onRailSelect,
  sidebarTitle,
  navItems,
  activeNav,
  onNavSelect,
  sidebarFooter,
  headerAction,
  accountSlot,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Icon rail */}
      <aside className="hidden sm:flex w-14 shrink-0 flex-col items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 py-3">
        {(rail ?? []).map((item) => {
          const Icon = item.icon;
          const active = activeRail === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => onRailSelect?.(item.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                active
                  ? 'bg-[#0494f4]/10 text-[#0494f4]'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}

        <div className="mt-auto flex flex-col items-center gap-2">
          <button
            type="button"
            title="Notifications"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </button>
          {accountSlot}
        </div>
      </aside>

      {/* Section sidebar */}
      {sidebarOpen && (
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between px-4 h-12 shrink-0">
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">{sidebarTitle}</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              title="Hide sidebar"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>

          <nav className="px-2 pb-2 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavSelect(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition cursor-pointer ${
                    active
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#0494f4]/10 text-[#0494f4]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {sidebarFooter && <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 p-3">{sidebarFooter}</div>}
        </aside>
      )}

      {/* Canvas */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {headerAction && (
          <div className="sticky top-0 z-10 flex items-center justify-end gap-2 px-4 sm:px-6 py-2.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-100 dark:border-zinc-900">
            {headerAction}
          </div>
        )}
        <div className="px-4 sm:px-6 py-5">{children}</div>
      </main>
    </div>
  );
};

export const RAIL_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'apps', label: 'All apps', icon: LayoutGrid },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'docs', label: 'Docs', icon: BookOpen },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sparkle = Sparkles;
