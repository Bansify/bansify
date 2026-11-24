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
  /** Card 2 title, e.g. "Home", "All apps", "Products". */
  title?: string;
  navItems: ShellNavItem[];
  activeNav: string;
  onNavSelect: (id: string) => void;
  brandName: string;
  brandLogoSrc?: string;
  /** Card 3 top row — the search box lives here. */
  searchSlot?: React.ReactNode;
  panelFooter?: React.ReactNode;
  dock?: RailItem[];
  profileName?: string;
  profileEmail?: string;
  profileAvatar?: string;
  onProfileClick?: () => void;
  children: React.ReactNode;
}

const AppGlyph: React.FC<{ item: RailItem; className?: string }> = ({ item, className = 'w-5 h-5' }) => {
  const [failed, setFailed] = useState(false);
  const Icon = item.icon;
  if (item.logoSrc && !failed) {
    return (
      <img
        src={item.logoSrc}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${className} rounded-md object-contain`}
      />
    );
  }
  return <Icon className={`${className} text-zinc-500 dark:text-zinc-400`} strokeWidth={1.75} />;
};

/**
 * Four floating cards on a canvas:
 *   1 rail · 2 navigation · 3 content (search on top) · 4 app dock
 * Previews open as an extra card between the content and the dock.
 */
export const AppShell: React.FC<AppShellProps> = ({
  title = '',
  navItems,
  activeNav,
  onNavSelect,
  brandName,
  brandLogoSrc = '/assets/brand/logo.png',
  searchSlot,
  panelFooter,
  dock,
  profileName,
  profileEmail,
  profileAvatar,
  onProfileClick,
  children,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [navOpen, setNavOpen] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [panes, setPanes] = useState<RailItem[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const openPane = (item: RailItem) =>
    setPanes((list) => (list.some((p) => p.id === item.id) ? list : [...list, item].slice(-2)));

  const togglePaneCollapse = (id: string) =>
    setCollapsed((map) => ({ ...map, [id]: !map[id] }));

  const initial = (profileName || 'B').slice(0, 1).toUpperCase();

  const profileAvatarNode = (
    <span className="w-9 h-9 rounded-full overflow-hidden bg-[#0494f4] text-white flex items-center justify-center text-xs font-bold shrink-0">
      {profileAvatar ? <img src={profileAvatar} alt="" className="w-full h-full object-cover" /> : initial}
    </span>
  );

  /* ── Card 2: navigation ─────────────────────────────────────────────── */
  const navCard = (
    <aside
      className="flex h-full w-60 shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-[#333333] dark:bg-[#2a2a2a]"
      aria-label="Navigation"
    >
      <div className="flex items-center gap-2 h-14 px-4 shrink-0">
        <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{title}</span>
        <button
          type="button"
          onClick={() => (mobileNav ? setMobileNav(false) : setNavOpen(false))}
          aria-label="Collapse navigation"
          title="Collapse"
          className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
        >
          {mobileNav ? <X className="w-4 h-4" strokeWidth={1.75} /> : <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />}
        </button>
      </div>

      <nav className="px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavSelect(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
                active
                  ? 'bg-[#0494f4]/12 text-[#0494f4] font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333]'
              }`}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#0494f4]" />}
              {Icon && <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />}
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-[#333333] text-zinc-500 dark:text-zinc-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        {panelFooter && <div className="px-4 pb-3 text-[11px] text-zinc-500 leading-relaxed">{panelFooter}</div>}
        <div className="mx-3 h-px bg-zinc-200 dark:bg-[#333333]" />
        <button
          type="button"
          onClick={onProfileClick}
          className="w-full flex items-center gap-2.5 px-3 py-3 hover:bg-zinc-50 dark:hover:bg-[#333333] cursor-pointer text-left"
        >
          {profileAvatarNode}
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {profileName || 'Sign in'}
            </span>
            <span className="block text-[11px] text-zinc-500 truncate">{profileEmail || 'with Bansify'}</span>
          </span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-[100dvh] w-full gap-3 bg-[#f5f6f7] p-3 dark:bg-[#212121]">
      {/* Card 1 — rail */}
      <aside
        className="hidden md:flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl border border-zinc-200 bg-white py-3 dark:border-[#333333] dark:bg-[#2a2a2a]"
        aria-label="Shortcuts"
      >
        <button
          type="button"
          onClick={() => setNavOpen((v) => !v)}
          aria-label={navOpen ? 'Hide navigation' : 'Show navigation'}
          title={navOpen ? 'Hide navigation' : 'Show navigation'}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
        >
          <img src={brandLogoSrc} alt={brandName} className="w-7 h-7 rounded-lg object-contain" />
        </button>
        <div className="w-6 h-px bg-zinc-200 dark:bg-[#333333] my-1" />

        {navItems.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavSelect(item.id)}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                active
                  ? 'bg-[#0494f4]/12 text-[#0494f4]'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333]'
              }`}
            >
              {Icon && <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />}
            </button>
          );
        })}

        <div className="mt-auto flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            title={navOpen ? 'Hide navigation' : 'Show navigation'}
            aria-label={navOpen ? 'Hide navigation' : 'Show navigation'}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
          >
            {navOpen ? <ChevronLeft className="w-4 h-4" strokeWidth={1.75} /> : <ChevronRight className="w-4 h-4" strokeWidth={1.75} />}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light' : 'Switch to dark'}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
          >
            {isDark ? <Sun className="w-[18px] h-[18px]" strokeWidth={1.75} /> : <Moon className="w-[18px] h-[18px]" strokeWidth={1.75} />}
          </button>
          <button
            type="button"
            title="Notifications"
            aria-label="Notifications"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={onProfileClick}
            title={profileEmail || 'Account'}
            aria-label="Account"
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
          >
            {profileAvatarNode}
          </button>
        </div>
      </aside>

      {/* Card 2 — navigation (desktop only; the drawer carries it on mobile) */}
      {navOpen && <div className="hidden md:block">{navCard}</div>}

      {/* Mobile drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNav(false)}
            className="absolute inset-0 bg-black/40 cursor-default"
          />
          <div className="absolute left-3 top-3 bottom-3">{navCard}</div>
        </div>
      )}

      {/* Card 3 — content */}
      <main className="flex flex-1 min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-[#333333] dark:bg-[#2a2a2a]">
        <div className="flex items-center gap-2 h-14 px-3 sm:px-4 shrink-0 border-b border-zinc-200 dark:border-[#333333]">
          <button
            type="button"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
          >
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-2">{searchSlot}</div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </main>

      {/* Preview panes — extra cards between content and dock */}
      {panes.map((item) => {
        const isCollapsed = !!collapsed[item.id];
        return (
          <section
            key={item.id}
            className={`hidden lg:flex shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-[#333333] dark:bg-[#2a2a2a] ${
              isCollapsed ? 'w-14' : 'w-[38%] max-w-[560px]'
            }`}
            aria-label={item.label}
          >
            <div className={`flex items-center gap-2 h-14 px-3 shrink-0 border-b border-zinc-200 dark:border-[#333333] ${isCollapsed ? 'justify-center px-0' : ''}`}>
              {isCollapsed ? (
                <button
                  type="button"
                  onClick={() => togglePaneCollapse(item.id)}
                  title={item.label}
                  aria-label={`Expand ${item.label}`}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
                >
                  <AppGlyph item={item} />
                </button>
              ) : (
                <>
                  <AppGlyph item={item} />
                  <span className="text-[13px] font-semibold truncate">{item.label}</span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-[#0494f4]"
                    >
                      Open in tab <ArrowUpRight className="w-3 h-3" strokeWidth={1.75} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => togglePaneCollapse(item.id)}
                    title="Collapse"
                    aria-label="Collapse"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanes((list) => list.filter((p) => p.id !== item.id))}
                    title="Close"
                    aria-label="Close"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
                  >
                    <X className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </>
              )}
            </div>
            {!isCollapsed && item.url && (
              <iframe src={item.url} title={item.label} className="flex-1 w-full border-0 bg-white" loading="lazy" />
            )}
          </section>
        );
      })}

      {/* Card 4 — app dock */}
      {dock && dock.length > 0 && (
        <aside
          className="hidden lg:flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl border border-zinc-200 bg-white py-3 dark:border-[#333333] dark:bg-[#2a2a2a]"
          aria-label="Bansify apps"
        >
          <button
            type="button"
            onClick={onProfileClick}
            title={profileEmail || 'Account'}
            aria-label="Account"
            className="mb-1 cursor-pointer"
          >
            {profileAvatarNode}
          </button>
          <div className="w-6 h-px bg-zinc-200 dark:bg-[#333333] mb-1" />

          {dock.map((item, index) => (
            <React.Fragment key={item.id}>
              {index === Math.ceil(dock.length / 2) && <div className="w-6 h-px bg-zinc-200 dark:bg-[#333333] my-1" />}
              <button
                type="button"
                onClick={() => openPane(item)}
                title={item.label}
                aria-label={`Open ${item.label}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                  panes.some((p) => p.id === item.id)
                    ? 'bg-[#0494f4]/12'
                    : 'hover:bg-zinc-100 dark:hover:bg-[#333333]'
                }`}
              >
                <AppGlyph item={item} />
              </button>
            </React.Fragment>
          ))}
        </aside>
      )}
    </div>
  );
};
