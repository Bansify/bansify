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
  ChevronLeft,
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
  /** Primary navigation — rendered inside the single left panel. */
  navItems: ShellNavItem[];
  activeNav: string;
  onNavSelect: (id: string) => void;
  panelTitle: string;
  /** Secondary list pinned to the bottom of the panel (account state, help…). */
  panelFooter?: React.ReactNode;
  /** Right-hand app dock; the profile sits at its top. */
  dock?: RailItem[];
  profile?: React.ReactNode;
  notifications?: boolean;
  /** Left side of the content header (search). */
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

const DockIcon: React.FC<{ item: RailItem }> = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const Icon = item.icon;
  if (item.logoSrc && !failed) {
    return (
      <img
        src={item.logoSrc}
        alt=""
        width={24}
        height={24}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-6 h-6 rounded-md object-contain"
      />
    );
  }
  return <Icon className="w-5 h-5 text-zinc-500" />;
};

/**
 * One panel on the left (navigation + sections merged), the canvas in the middle,
 * and an app dock on the right whose preview opens beside the canvas — not in a
 * floating phone frame.
 */
export const AppShell: React.FC<AppShellProps> = ({
  navItems,
  activeNav,
  onNavSelect,
  panelTitle,
  panelFooter,
  dock,
  profile,
  notifications = true,
  headerAction,
  children,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [preview, setPreview] = useState<RailItem | null>(null);

  const panel = (mobile: boolean) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 h-12 px-3 shrink-0">
        <span className={`text-sm font-semibold text-zinc-900 dark:text-white truncate ${expanded || mobile ? '' : 'sr-only'}`}>
          {panelTitle}
        </span>
        <button
          type="button"
          onClick={() => (mobile ? setMobileNav(false) : setExpanded((v) => !v))}
          aria-label={mobile ? 'Close navigation' : expanded ? 'Collapse panel' : 'Expand panel'}
          className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
        >
          {mobile ? <X className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.id;
          return (
            <button
              key={`${mobile ? 'm' : 'd'}-${item.id}`}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              onClick={() => {
                onNavSelect(item.id);
                if (mobile) setMobileNav(false);
              }}
              className={`w-full flex items-center gap-2.5 rounded-lg text-sm transition cursor-pointer ${
                expanded || mobile ? 'px-2.5 py-2' : 'justify-center px-0 py-2.5'
              } ${
                active
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
              }`}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {(expanded || mobile) && <span className="truncate">{item.label}</span>}
              {(expanded || mobile) && item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#0494f4]/10 text-[#0494f4]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 p-2 space-y-1">
        {notifications && (
          <button
            type="button"
            title="Notifications"
            aria-label="Notifications"
            className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 cursor-pointer ${
              expanded || mobile ? '' : 'justify-center px-0'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            {(expanded || mobile) && <span>Notifications</span>}
          </button>
        )}
        {panelFooter && <div className={`px-1.5 ${expanded || mobile ? '' : 'sr-only'}`}>{panelFooter}</div>}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen supports-[height:100dvh]:h-[100dvh] w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Single left panel: navigation and sections together, collapsible to icons */}
      <aside
        className={`hidden md:flex shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800 transition-[width] duration-200 ${
          expanded ? 'w-60' : 'w-16'
        }`}
      >
        {panel(false)}
      </aside>

      {/* Canvas */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-3 sm:px-6 py-2.5 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
          <button
            type="button"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">{headerAction}</div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-5">{children}</div>
      </main>

      {/* Preview pane: sits beside the canvas so the app looks like part of the page */}
      {preview && (
        <section className="hidden md:flex flex-col w-[42%] max-w-[560px] shrink-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2 h-12 px-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
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
              aria-label="Close preview"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
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
            <div className="flex-1 grid place-items-center text-sm text-zinc-500">No preview available</div>
          )}
        </section>
      )}

      {/* Right dock: profile first, then apps */}
      {dock && dock.length > 0 && (
        <aside className="hidden lg:flex w-14 shrink-0 flex-col items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 py-3">
          {profile && <div className="mb-1">{profile}</div>}
          <div className="w-6 h-px bg-zinc-200 dark:bg-zinc-800 mb-1" />
          {dock.map((item) => {
            const active = preview?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={`Open ${item.label}`}
                aria-expanded={active}
                onClick={() => setPreview(active ? null : item)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                  active ? 'bg-[#0494f4]/10 ring-1 ring-[#0494f4]/30' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <DockIcon item={item} />
              </button>
            );
          })}
        </aside>
      )}

      {/* Mobile navigation drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-[78%] max-w-[300px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
            {panel(true)}
          </div>
        </div>
      )}

      {/* Mobile preview: full-screen sheet, since there is no room for a split pane */}
      {preview && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2 h-12 px-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{preview.label}</span>
            {preview.url && (
              <a href={preview.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-[11px] text-[#0494f4]">
                Open in tab
              </a>
            )}
            <button
              type="button"
              onClick={() => setPreview(null)}
              aria-label="Close preview"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {preview.url && (
            <iframe src={preview.url} title={preview.label} className="flex-1 w-full border-0 bg-white" referrerPolicy="strict-origin-when-cross-origin" />
          )}
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
