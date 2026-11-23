import React, { useState } from 'react';
import {
  Menu,
  Bell,
  X,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface ShellNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
}

export interface RailItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  url?: string;
  logoSrc?: string;
}

interface AppShellProps {
  navItems: ShellNavItem[];
  activeNav: string;
  onNavSelect: (id: string) => void;
  brandName: string;
  brandLogoSrc?: string;
  panelFooter?: React.ReactNode;
  dock?: RailItem[];
  /** Profile block at the bottom of the panel. */
  profileName?: string;
  profileEmail?: string;
  profileAvatar?: string;
  onProfileClick?: () => void;
  children: React.ReactNode;
}

const AppGlyph: React.FC<{ item: RailItem; className?: string }> = ({ item, className = 'w-6 h-6' }) => {
  const [failed, setFailed] = useState(false);
  const Icon = item.icon;
  if (item.logoSrc && !failed) {
    return <img src={item.logoSrc} alt="" loading="lazy" onError={() => setFailed(true)} className={`${className} rounded-md object-contain`} />;
  }
  return <Icon className={`${className} text-zinc-500`} strokeWidth={1.75} />;
};

/**
 * Structure:
 *   [ panel (full height) ][ header / canvas + panes ][ dock (full height) ]
 * The panel and the dock start at the very top edge; only the middle column has a
 * header, so panes open beneath it.
 */
export const AppShell: React.FC<AppShellProps> = ({
  navItems,
  activeNav,
  onNavSelect,
  brandName,
  brandLogoSrc = '/assets/brand/logo.png',
  panelFooter,
  dock,
  profileName,
  profileEmail,
  profileAvatar,
  onProfileClick,
  children,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [panes, setPanes] = useState<RailItem[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const openPane = (item: RailItem) =>
    setPanes((list) => (list.some((p) => p.id === item.id) ? list : [...list, item].slice(-2)));
  const closePane = (id: string) => setPanes((list) => list.filter((p) => p.id !== id));
  const togglePane = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  const panel = (mobile: boolean) => {
    const open = expanded || mobile;
    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#212121]">
        {/* Brand */}
        <div className={`flex items-center h-14 shrink-0 ${open ? 'gap-2.5 px-4' : 'justify-center px-0'}`}>
          <img src={brandLogoSrc} alt="Bansify" className="w-8 h-8 rounded-lg object-contain shrink-0" />
          {open && <span className="text-[18px] font-black tracking-tight text-[#0494f4] dark:text-[#4cb4ff]">{brandName}</span>}
          {open && !mobile && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Collapse panel"
              title="Collapse"
              className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {!open && !mobile && (
            <span className="sr-only">Collapsed</span>
          )}
        </div>

        {!open && !mobile && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-label="Expand panel"
              title="Expand"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className={`mx-3 h-px bg-zinc-200 dark:bg-[#333333] ${open ? '' : 'mx-2'}`} />

        {/* Navigation */}
        <nav className={`mt-2 space-y-0.5 overflow-y-auto ${open ? 'px-2' : 'px-1.5'}`}>
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
                className={`relative w-full flex items-center rounded-xl text-[13px] transition-colors cursor-pointer ${
                  open ? 'gap-2.5 px-2.5 py-2' : 'w-11 h-11 mx-auto justify-center px-0'
                } ${
                  active
                    ? 'bg-[#0494f4]/12 text-[#0494f4] font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#0494f4]" />}
                {Icon && <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />}
                {open && <span className="truncate">{item.label}</span>}
                {open && item.badge && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-[#2a2a2a] text-zinc-500 dark:text-zinc-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Utilities + profile, pinned to the bottom */}
        <div className="mt-auto">
          <div className={`mx-3 h-px bg-zinc-200 dark:bg-[#333333] ${open ? '' : 'mx-2'}`} />
          <div className={`flex items-center gap-1 py-2 ${open ? 'px-3' : 'flex-col items-center px-0'}`}>
            <button
              type="button"
              title="Notifications"
              aria-label="Notifications"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to light' : 'Switch to dark'}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              {isDark ? <Sun className="w-[18px] h-[18px]" strokeWidth={1.75} /> : <Moon className="w-[18px] h-[18px]" strokeWidth={1.75} />}
            </button>
            <button
              type="button"
              title="Settings"
              aria-label="Settings"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </button>
          </div>

          <div className={`mx-3 h-px bg-zinc-200 dark:bg-[#333333] ${open ? '' : 'mx-2'}`} />

          <button
            type="button"
            onClick={onProfileClick}
            title={profileName ?? 'Account'}
            aria-label="Account"
            className={`w-full flex items-center gap-2.5 py-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#2a2a2a] ${
              open ? 'px-3' : 'justify-center px-0'
            }`}
          >
            <span className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#0494f4] text-white flex items-center justify-center text-xs font-bold">
              {profileAvatar ? (
                <img src={profileAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                (profileName || '?').slice(0, 1).toUpperCase()
              )}
            </span>
            {open && (
              <span className="min-w-0 text-left">
                <span className="block text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {profileName || 'Sign in'}
                </span>
                <span className="block text-[11px] text-zinc-500 truncate">{profileEmail || 'with Bansify'}</span>
              </span>
            )}
          </button>
          {panelFooter && open && <div className="px-3 pb-3 text-[11px] text-zinc-500 leading-relaxed">{panelFooter}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen supports-[height:100dvh]:h-[100dvh] w-full overflow-hidden bg-white dark:bg-[#212121]">
      {/* Left panel: full height, starts at the very top */}
      <aside
        className={`hidden md:flex shrink-0 flex-col border-r border-zinc-200 dark:border-[#333333] transition-[width] duration-200 ${
          expanded ? 'w-60' : 'w-[68px]'
        }`}
      >
        {panel(false)}
      </aside>

      {/* Middle column: header + canvas + panes */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex items-center gap-2 px-3 h-12 shrink-0 border-b border-zinc-200 dark:border-[#333333]">
          <button
            type="button"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <div className="flex flex-1 min-h-0">
          <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-5">{children}</div>
          </main>

          {panes.map((pane, index) => {
            const isCollapsed = collapsed[pane.id];
            return (
              <section
                key={pane.id}
                className={`hidden md:flex flex-col shrink-0 border-l border-zinc-200 dark:border-[#333333] bg-white dark:bg-[#212121] ${
                  isCollapsed ? 'w-12' : index === 0 ? 'w-[38%] max-w-[520px]' : 'w-[32%] max-w-[440px]'
                }`}
              >
                {isCollapsed ? (
                  <div className="flex flex-col items-center gap-2 py-3">
                    <button
                      type="button"
                      onClick={() => togglePane(pane.id)}
                      aria-label={`Expand ${pane.label}`}
                      title={pane.label}
                      className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] cursor-pointer"
                    >
                      <AppGlyph item={pane} className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => closePane(pane.id)}
                      aria-label={`Close ${pane.label}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 h-12 px-3 border-b border-zinc-200 dark:border-[#333333] shrink-0">
                      <AppGlyph item={pane} className="w-5 h-5" />
                      <span className="text-[13px] font-semibold text-zinc-900 dark:text-white truncate">{pane.label}</span>
                      <div className="ml-auto flex items-center gap-1">
                        {pane.url && (
                          <a
                            href={pane.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#0494f4] hover:underline px-1"
                          >
                            Open in tab <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => togglePane(pane.id)}
                          aria-label={`Collapse ${pane.label}`}
                          title="Collapse"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => closePane(pane.id)}
                          aria-label={`Close ${pane.label}`}
                          title="Close"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {pane.url ? (
                      <iframe
                        src={pane.url}
                        title={pane.label}
                        className="flex-1 w-full border-0 bg-white"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="clipboard-write; camera; microphone; fullscreen"
                      />
                    ) : (
                      <div className="flex-1 grid place-items-center text-sm text-zinc-500">No preview available</div>
                    )}
                  </>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* Right dock: full height, profile at the top like the panel has it at the bottom */}
      {dock && dock.length > 0 && (
        <aside className="hidden lg:flex w-14 shrink-0 flex-col items-center gap-1 border-l border-zinc-200 dark:border-[#333333] py-3">
          <button
            type="button"
            onClick={onProfileClick}
            title={profileName ?? 'Account'}
            aria-label="Account"
            className="mb-1 w-9 h-9 rounded-full overflow-hidden bg-[#0494f4] text-white flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            {profileAvatar ? (
              <img src={profileAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              (profileName || '?').slice(0, 1).toUpperCase()
            )}
          </button>
          <div className="w-6 h-px bg-zinc-200 dark:bg-[#333333] mb-1" />
          {dock.map((item, index) => {
            const active = panes.some((p) => p.id === item.id);
            return (
              <React.Fragment key={item.id}>
              {index === Math.ceil(dock.length / 2) && <div className="w-6 h-px bg-zinc-200 dark:bg-[#333333] my-1" />}
              <button
                type="button"
                title={item.label}
                aria-label={`Open ${item.label}`}
                aria-pressed={active}
                onClick={() => (active ? closePane(item.id) : openPane(item))}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#0494f4]/12 ring-1 ring-[#0494f4]/30'
                    : 'hover:bg-zinc-100 dark:hover:bg-[#2a2a2a]'
                }`}
              >
                <AppGlyph item={item} className="w-7 h-7" />
              </button>
              </React.Fragment>
            );
          })}
        </aside>
      )}

      {/* Mobile navigation */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-[78%] max-w-[300px] bg-white dark:bg-[#212121] border-r border-zinc-200 dark:border-[#333333]">
            {panel(true)}
          </div>
        </div>
      )}

      {/* Mobile panes */}
      {panes.length > 0 && (
        <div className="md:hidden">
          {panes.slice(-1).map((pane) => (
            <div key={`m-${pane.id}`} className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#212121]">
              <div className="flex items-center gap-2 h-12 px-3 border-b border-zinc-200 dark:border-[#333333] shrink-0">
                <AppGlyph item={pane} className="w-5 h-5" />
                <span className="text-[13px] font-semibold text-zinc-900 dark:text-white truncate">{pane.label}</span>
                <div className="ml-auto flex items-center gap-2">
                  {pane.url && (
                    <a href={pane.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#0494f4]">
                      Open in tab
                    </a>
                  )}
                  <button type="button" onClick={() => closePane(pane.id)} aria-label="Close" className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {pane.url && <iframe src={pane.url} title={pane.label} className="flex-1 w-full border-0 bg-white" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RAIL_ITEMS: RailItem[] = [];
