import React, { useState } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
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
  title?: string;
  navItems: ShellNavItem[];
  activeNav: string;
  onNavSelect: (id: string) => void;
  brandName: string;
  brandLogoSrc?: string;
  searchSlot?: React.ReactNode;
  panelFooter?: React.ReactNode;
  dock?: RailItem[];
  profileName?: string;
  profileEmail?: string;
  profileAvatar?: string;
  onProfileClick?: () => void;
  children: React.ReactNode;
}

/* ── tiles ─────────────────────────────────────────────────────────────── */

const BrandTile: React.FC<{ src: string; name: string }> = ({ src, name }) => (
  <span className="w-9 h-9 rounded-[10px] bg-[#0494f4] overflow-hidden flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10 shrink-0">
    <img src={src} alt={name} className="w-full h-full object-cover" />
  </span>
);

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
        <img src={item.logoSrc} alt="" loading="lazy" onError={() => setFailed(true)} className="w-full h-full object-cover" />
      ) : (
        <Icon className="w-1/2 h-1/2 text-white" strokeWidth={1.75} />
      )}
    </span>
  );
};

/* ── the left panel ────────────────────────────────────────────────────── */

/**
 * One row, used by both states, so the two can never drift apart: a 40px icon box that
 * always sits 12px from the edge, and a label that appears when the panel is open.
 */
const PanelRow: React.FC<{
  item: ShellNavItem;
  active: boolean;
  open: boolean;
  onClick: () => void;
}> = ({ item, active, open, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      title={item.label}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
      className={`group relative flex items-center h-10 rounded-xl cursor-pointer transition-colors ${
        open ? 'w-full' : 'w-10'
      } ${
        active ? 'text-[#0494f4]' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
      }`}
    >
      <span
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          active
            ? 'bg-[#0494f4]/12'
            : 'group-hover:bg-zinc-100 dark:group-hover:bg-[#333333]'
        }`}
      >
        {Icon && <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />}
      </span>

      {open && (
        <>
          <span className={`ml-2 truncate text-[13px] ${active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
          {item.badge && (
            <span
              className={`ml-auto mr-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                active ? 'bg-[#0494f4] text-white' : 'bg-zinc-100 dark:bg-[#333333] text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  );
};

const SectionLabel: React.FC<{ open: boolean; children: React.ReactNode }> = ({ open, children }) => (
  <div className={`flex items-center h-7 ${open ? 'px-3' : 'justify-center w-10'}`}>
    {open ? (
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">{children}</p>
    ) : (
      <span className="block w-6 h-px bg-zinc-200 dark:bg-[#333333]" />
    )}
  </div>
);

export const AppShell: React.FC<AppShellProps> = ({
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
  const [open, setOpen] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [panes, setPanes] = useState<RailItem[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const openPane = (item: RailItem) =>
    setPanes((list) => (list.some((p) => p.id === item.id) ? list : [...list, item].slice(-2)));

  const togglePaneCollapse = (id: string) => setCollapsed((map) => ({ ...map, [id]: !map[id] }));
  const initial = (profileName || 'B').slice(0, 1).toUpperCase();

  const avatar = (
    <span className="w-9 h-9 rounded-full overflow-hidden bg-[#0494f4] text-white flex items-center justify-center text-xs font-bold shrink-0">
      {profileAvatar ? <img src={profileAvatar} alt="" className="w-full h-full object-cover" /> : initial}
    </span>
  );

  const browse = navItems.slice(0, 5);
  const ecosystem = navItems.slice(5);

  const panel = (variant: 'desktop' | 'drawer') => {
    const isOpen = variant === 'drawer' ? true : open;
    return (
      <div
        className={`flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-[#333333] dark:bg-[#2a2a2a] ${
          isOpen ? 'w-[260px]' : 'w-16'
        } ${variant === 'desktop' ? 'transition-[width] duration-200 ease-out' : ''}`}
      >
        {/* header */}
        <div className={`flex items-center h-16 shrink-0 ${isOpen ? 'gap-2.5 px-3' : 'justify-center px-0'}`}>
          {isOpen ? (
            <>
              <BrandTile src={brandLogoSrc} name={brandName} />
              <span className="min-w-0 text-[16px] font-black tracking-tight leading-none truncate">
                <span className="text-[#0494f4]">{brandName}</span>{' '}
                <span className="text-zinc-900 dark:text-zinc-100">Ecosystem</span>
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              title={`Open ${brandName}`}
              aria-label="Expand panel"
              className="rounded-[10px] cursor-pointer"
            >
              <BrandTile src={brandLogoSrc} name={brandName} />
            </button>
          )}

          {isOpen && (
            <button
              type="button"
              onClick={() => (variant === 'drawer' ? setMobileNav(false) : setOpen(false))}
              title="Collapse"
              aria-label="Collapse panel"
              className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer shrink-0"
            >
              {variant === 'drawer' ? (
                <X className="w-4 h-4" strokeWidth={1.75} />
              ) : (
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              )}
            </button>
          )}
        </div>

        {/* navigation */}
        <div className={`flex-1 min-h-0 overflow-y-auto ${isOpen ? 'px-3' : 'px-0 flex flex-col items-center'}`}>
          {browse.map((item) => (
            <PanelRow key={item.id} item={item} active={activeNav === item.id} open={isOpen} onClick={() => onNavSelect(item.id)} />
          ))}
          <SectionLabel open={isOpen}>Ecosystem</SectionLabel>
          {ecosystem.map((item) => (
            <PanelRow key={item.id} item={item} active={activeNav === item.id} open={isOpen} onClick={() => onNavSelect(item.id)} />
          ))}
        </div>

        {/* footer */}
        <div className="shrink-0">
          {isOpen && panelFooter && (
            <div className="px-4 pb-2 text-[11px] leading-relaxed text-zinc-500">{panelFooter}</div>
          )}
          <div className={`mx-3 h-px bg-zinc-200 dark:bg-[#333333] ${isOpen ? '' : 'mx-2'}`} />

          {isOpen && (
            <div className="flex items-center gap-1 px-3 pt-2">
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to light' : 'Switch to dark'}
                aria-label="Toggle theme"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4" strokeWidth={1.75} /> : <Moon className="w-4 h-4" strokeWidth={1.75} />}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onProfileClick}
            title={profileEmail || 'Account'}
            aria-label="Account"
            className={`w-full flex items-center gap-2.5 py-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#333333] ${
              isOpen ? 'px-3' : 'justify-center px-0'
            }`}
          >
            {avatar}
            {isOpen && (profileName || profileEmail) && (
              <span className="min-w-0 text-left">
                {profileName && (
                  <span className="block text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {profileName}
                  </span>
                )}
                {profileEmail && <span className="block text-[11px] text-zinc-500 truncate">{profileEmail}</span>}
              </span>
            )}
          </button>

          {!isOpen && (
            <div className="flex justify-center pb-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                title="Expand panel"
                aria-label="Expand panel"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[100dvh] w-full gap-3 bg-[#f5f6f7] p-3 dark:bg-[#212121]">
      <div className="hidden md:block shrink-0">{panel('desktop')}</div>

      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNav(false)}
            className="absolute inset-0 bg-black/40 cursor-default"
          />
          <div className="absolute left-3 top-3 bottom-3">{panel('drawer')}</div>
        </div>
      )}

      <main className="flex flex-1 min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-[#333333] dark:bg-[#2a2a2a]">
        <div className="flex items-center gap-2 h-16 px-3 sm:px-4 shrink-0 border-b border-zinc-200 dark:border-[#333333]">
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
            <div
              className={`flex items-center gap-2 h-16 px-3 shrink-0 border-b border-zinc-200 dark:border-[#333333] ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              {isCollapsed ? (
                <button
                  type="button"
                  onClick={() => togglePaneCollapse(item.id)}
                  title={item.label}
                  aria-label={`Expand ${item.label}`}
                  className="group w-10 h-10 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-[#333333] cursor-pointer"
                >
                  <DockTile item={item} />
                </button>
              ) : (
                <>
                  <DockTile item={item} />
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

      {dock && dock.length > 0 && (
        <aside
          className="hidden lg:flex w-16 shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-3 dark:border-[#333333] dark:bg-[#2a2a2a]"
          aria-label="Bansify apps"
        >
          <button type="button" onClick={onProfileClick} title={profileEmail || 'Account'} aria-label="Account" className="mb-1 cursor-pointer">
            {avatar}
          </button>
          <div className="w-6 h-px bg-zinc-200 dark:bg-[#333333] mb-1" />

          {dock.map((item) => (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => openPane(item)}
                title={item.label}
                aria-label={`Open ${item.label}`}
                className="group cursor-pointer rounded-[10px]"
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
