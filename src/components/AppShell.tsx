import React, { useState } from 'react';
import {
  Home,
  LayoutGrid,
  Boxes,
  BookOpen,
  Building2,
  Settings,
  PanelLeft,
  Menu,
  Bell,
  X,
  ArrowUpRight,
  Smartphone,
} from 'lucide-react';

export interface ShellNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface RailItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  url?: string;
  logoSrc?: string;
}

interface AppShellProps {
  rail?: RailItem[];
  activeRail?: string;
  onRailSelect?: (id: string) => void;
  /** Right-hand app dock (Accounts, Mail, Drive, …) with in-page previews. */
  rightRail?: RailItem[];
  sidebarTitle: string;
  navItems: ShellNavItem[];
  activeNav: string;
  onNavSelect: (id: string) => void;
  sidebarFooter?: React.ReactNode;
  headerAction?: React.ReactNode;
  accountSlot?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Productive shell: icon rail, section sidebar, card canvas and an optional app
 * dock on the right that previews a product in a phone-sized frame without
 * leaving the site.
 */
export const AppShell: React.FC<AppShellProps> = ({
  rail,
  activeRail = 'home',
  onRailSelect,
  rightRail,
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
  const [mobileNav, setMobileNav] = useState(false);
  const [preview, setPreview] = useState<RailItem | null>(null);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-zinc-950">
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
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              onClick={() => onRailSelect?.(item.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                active ? 'bg-[#0494f4]/10 text-[#0494f4]' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
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

      {/* Section sidebar — collapsible, never unreachable */}
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
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-3 sm:px-6 py-2.5 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
          {/* Mobile: the rail and sidebar are hidden, so this opens a drawer with both */}
          <button
            type="button"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              title="Show sidebar"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex-1 min-w-0">{headerAction}</div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-5">{children}</div>
      </main>

      {/* App dock */}
      {rightRail && rightRail.length > 0 && (
        <aside className="hidden lg:flex w-14 shrink-0 flex-col items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 py-3">
          {rightRail.map((item) => {
            const Icon = item.icon;
            const active = preview?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={`Preview ${item.label}`}
                aria-expanded={active}
                onClick={() => setPreview(active ? null : item)}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                  active ? 'bg-[#0494f4]/10 ring-1 ring-[#0494f4]/30' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                {item.logoSrc ? (
                  <img src={item.logoSrc} alt="" className="w-6 h-6 rounded-md object-contain" />
                ) : (
                  <Icon className="w-5 h-5 text-zinc-500" />
                )}
              </button>
            );
          })}
        </aside>
      )}

      {/* Mobile navigation drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-[78%] max-w-[300px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="flex items-center justify-between px-4 h-12 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">{sidebarTitle}</span>
              <button
                type="button"
                onClick={() => setMobileNav(false)}
                aria-label="Close navigation"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="p-2 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeNav === item.id;
                return (
                  <button
                    key={`m-${item.id}`}
                    type="button"
                    onClick={() => {
                      onNavSelect(item.id);
                      setMobileNav(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition cursor-pointer ${
                      active
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{item.label}</span>
                    {item.badge && <span className="ml-auto text-[10px] font-bold text-[#0494f4]">{item.badge}</span>}
                  </button>
                );
              })}
            </nav>
            {(rail ?? []).length > 0 && (
              <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 p-3 flex items-center gap-2 flex-wrap">
                {(rail ?? []).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={`mr-${item.id}`}
                      type="button"
                      aria-label={item.label}
                      onClick={() => {
                        onRailSelect?.(item.id);
                        setMobileNav(false);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        activeRail === item.id ? 'bg-[#0494f4]/10 text-[#0494f4]' : 'text-zinc-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phone-frame preview — the app opens inside the site, no redirect */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/30 backdrop-blur-[2px]" onClick={() => setPreview(null)}>
          <div
            className="relative m-3 sm:m-4 w-full max-w-[430px] rounded-[28px] bg-white dark:bg-zinc-950 shadow-2xl ring-1 ring-zinc-300 dark:ring-zinc-700 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 h-12 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <Smartphone className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{preview.label}</span>
              {preview.url && (
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-[11px] text-[#0494f4] hover:underline"
                >
                  Open in tab <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {preview.url ? (
              <iframe
                src={preview.url}
                title={preview.label}
                className="flex-1 w-full border-0 bg-white"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="clipboard-write; camera; microphone; fullscreen"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-zinc-500">No preview available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const RAIL_ITEMS: RailItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'apps', label: 'All apps', icon: LayoutGrid },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'docs', label: 'Docs', icon: BookOpen },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];
