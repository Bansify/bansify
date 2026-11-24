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
import { NOTIFICATIONS, markNotificationsRead, readNotificationIds } from '../data/notifications';

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

/** The brand mark in the dock's tile language: 36px, solid blue, soft corners. */
const BrandTile: React.FC<{ src: string; name: string; className?: string }> = ({ src, name, className = '' }) => (
  <span className={`w-[36px] h-[36px] rounded-[10px] bg-[#0494f4] overflow-hidden flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10 shrink-0 ${className}`}>
    <img src={src} alt={name} className="w-full h-full object-cover" />
  </span>
);

/** Square brand-blue tile used by the dock — same shape and colour as the app list. */
const DockTile: React.FC<{ item: RailItem; active?: boolean }> = ({ item, active }) => {
  const [failed, setFailed] = useState(false);
  const Icon = item.icon;
  return (
    <span
      className={`w-[34px] h-[34px] rounded-[10px] bg-[#0494f4] overflow-hidden flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10 transition group-hover:brightness-110 ${
        active ? 'outline outline-2 outline-offset-2 outline-[#0494f4]/60' : ''
      }`}
    >
      {item.logoSrc && !failed ? (
        <img
          src={item.logoSrc}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <Icon className="w-1/2 h-1/2 text-white" strokeWidth={1.75} />
      )}
    </span>
  );
};

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
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => readNotificationIds());
  const hasUnread = NOTIFICATIONS.some((n) => !readIds.includes(n.id));
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
      <div className="flex items-center gap-2.5 h-16 px-3 shrink-0">
        <BrandTile src={brandLogoSrc} name={brandName} />
        <span className="min-w-0 text-[17px] font-black tracking-tight leading-none truncate">
          <span className="text-[#0494f4]">{brandName}</span>{' '}
          <span className="text-zinc-900 dark:text-zinc-100">Ecosystem</span>
        </span>
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

      <nav className="px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavSelect(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative w-full flex items-center gap-1 h-10 pr-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
                active
                  ? 'bg-[#0494f4]/12 text-[#0494f4] font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333]'
              }`}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#0494f4]" />}
              <span className="w-10 h-10 flex items-center justify-center shrink-0">
                {Icon && <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />}
              </span>
              <span className="truncate text-[13px]">{item.label}</span>
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
      {/* Card 1 — the rail. Collapsed markup is unchanged. */}
      {!navOpen && (
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
          <BrandTile src={brandLogoSrc} name={brandName} />
        </button>
        <div className="w-6 h-px bg-zinc-200 dark:bg-[#333333] my-1" />

        {/* every destination, scrollable when the list is long */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col items-center gap-1">
          {navItems.map((item) => {
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
        </div>

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
            onClick={() => {
              setNotifOpen((v) => !v);
              if (!notifOpen) {
                const ids = NOTIFICATIONS.map((n) => n.id);
                setReadIds(ids);
                markNotificationsRead(ids);
              }
            }}
            title="Notifications"
            aria-label={hasUnread ? 'Notifications (unread)' : 'Notifications'}
            aria-expanded={notifOpen}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer ${
              notifOpen
                ? 'bg-[#0494f4]/12 text-[#0494f4]'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333]'
            }`}
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e5484d] ring-2 ring-white dark:ring-[#2a2a2a]" />
            )}
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
      )}

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

      {/* Notifications card — opens from the bell, sits beside the content */}
      {notifOpen && (
        <section
          className="hidden lg:flex w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-[#333333] dark:bg-[#2a2a2a]"
          aria-label="Notifications"
        >
          <div className="flex items-center gap-2 h-16 px-4 shrink-0 border-b border-zinc-200 dark:border-[#333333]">
            <span className="text-[13px] font-semibold">Notifications</span>
            <span className="text-[11px] text-zinc-500">{NOTIFICATIONS.length}</span>
            <button
              type="button"
              onClick={() => setNotifOpen(false)}
              title="Close"
              aria-label="Close notifications"
              className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-zinc-200 dark:divide-[#333333]">
            {NOTIFICATIONS.map((n) => (
              <article key={n.id} className="flex gap-3 p-4">
                <span
                  className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    n.tone === 'green' ? 'bg-emerald-500' : n.tone === 'amber' ? 'bg-amber-500' : 'bg-[#0494f4]'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{n.app}</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{n.title}</p>
                  <p className="mt-0.5 text-[12px] text-zinc-500 leading-relaxed">{n.body}</p>
                  <p className="mt-1 text-[11px] text-zinc-400">{n.when}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

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

          {dock.map((item) => (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => openPane(item)}
                title={item.label}
                aria-label={`Open ${item.label}`}
                className="group cursor-pointer rounded-[12px]"
              >
                <DockTile item={item} active={panes.some((p) => p.id === item.id)} />
              </button>
              <div className="w-5 h-px bg-zinc-200 dark:bg-[#333333]" />
            </React.Fragment>
          ))}
        </aside>
      )}
    </div>
  );
};
