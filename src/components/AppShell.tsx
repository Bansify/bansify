import React, { useState } from 'react';
import {
  Menu,
  Bell,
  X,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
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
  navItems: ShellNavItem[];
  activeNav: string;
  onNavSelect: (id: string) => void;
  brandName: string;
  brandLogoSrc?: string;
  panelFooter?: React.ReactNode;
  dock?: RailItem[];
  profile?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

/** Dock icon with a glyph fallback, so a missing logo never leaves a blank square. */
const AppGlyph: React.FC<{ item: RailItem; className?: string }> = ({ item, className = 'w-6 h-6' }) => {
  const [failed, setFailed] = useState(false);
  const Icon = item.icon;
  if (item.logoSrc && !failed) {
    return <img src={item.logoSrc} alt="" loading="lazy" onError={() => setFailed(true)} className={`${className} rounded-md object-contain`} />;
  }
  return <Icon className={`${className} text-zinc-500`} />;
};

/**
 * Brand + navigation in one left panel, a header spanning the full width, then the
 * canvas, any open app panes and the dock underneath it. Panes sit side by side,
 * can be collapsed to a strip and closed.
 */
export const AppShell: React.FC<AppShellProps> = ({
  navItems,
  activeNav,
  onNavSelect,
  brandName,
  brandLogoSrc = '/assets/brand/logo.png',
  panelFooter,
  dock,
  profile,
  headerAction,
  children,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [panes, setPanes] = useState<RailItem[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const openPane = (item: RailItem) =>
    setPanes((list) => (list.some((p) => p.id === item.id) ? list : [...list, item].slice(-2)));
  const closePane = (id: string) => setPanes((list) => list.filter((p) => p.id !== id));
  const togglePane = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  const panel = (mobile: boolean) => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 px-3 pt-3 pb-1 ${expanded || mobile ? '' : 'justify-center'}`}>
        <img src={brandLogoSrc} alt="Bansify" className="w-8 h-8 rounded-lg object-contain shrink-0" />
        {(expanded || mobile) && (
          <span className="text-[19px] font-black tracking-tight text-[#0494f4] dark:text-[#3fb0ff]">{brandName}</span>
        )}
      </div>

      <div className={`px-2 pt-1 pb-2 ${expanded || mobile ? '' : 'flex justify-center'}`}>
        <button
          type="button"
          onClick={() => (mobile ? setMobileNav(false) : setExpanded((v) => !v))}
          aria-label={mobile ? 'Close navigation' : expanded ? 'Collapse panel' : 'Expand panel'}
          className="inline-flex items-center gap-1.5 h-7 rounded-lg px-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 cursor-pointer"
        >
          {mobile ? <X className="w-4 h-4" /> : expanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {(expanded || mobile) && <span className="text-[11px] font-medium">Collapse</span>}
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
              className={`relative w-full flex items-center gap-2.5 rounded-xl text-[13px] transition cursor-pointer ${
                expanded || mobile ? 'px-2.5 py-2' : 'justify-center px-0 py-2.5'
              } ${
                active
                  ? 'bg-[#0494f4]/10 text-[#0494f4] font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[#0494f4]" />}
              {Icon && <Icon className="w-[18px] h-[18px] shrink-0" />}
              {(expanded || mobile) && <span className="truncate">{item.label}</span>}
              {(expanded || mobile) && item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 p-2">
        <div className={`flex items-center gap-1 ${expanded || mobile ? '' : 'flex-col'}`}>
          <button
            type="button"
            title="Notifications"
            aria-label="Notifications"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>
          {profile}
        </div>
        {panelFooter && (expanded || mobile) && <div className="mt-2 px-1 text-[11px] text-zinc-500 leading-relaxed">{panelFooter}</div>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen supports-[height:100dvh]:h-[100dvh] w-full overflow-hidden bg-white dark:bg-zinc-950">
      <header className="flex items-center gap-2 px-3 sm:px-5 h-14 shrink-0 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setMobileNav(true)}
          aria-label="Open navigation"
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">{headerAction}</div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className={`hidden md:flex shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800 transition-[width] duration-200 ${
            expanded ? 'w-60' : 'w-16'
          }`}
        >
          {panel(false)}
        </aside>

        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-5">{children}</div>
        </main>

        {panes.map((pane, index) => {
          const isCollapsed = collapsed[pane.id];
          return (
            <section
              key={pane.id}
              className={`hidden md:flex flex-col shrink-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 ${
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
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                  >
                    <AppGlyph item={pane} className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => closePane(pane.id)}
                    aria-label={`Close ${pane.label}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 h-12 px-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
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
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => closePane(pane.id)}
                        aria-label={`Close ${pane.label}`}
                        title="Close"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
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

        {dock && dock.length > 0 && (
          <aside className="hidden lg:flex w-14 shrink-0 flex-col items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 py-3">
            {dock.map((item) => {
              const active = panes.some((p) => p.id === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.label}
                  aria-label={`Open ${item.label}`}
                  aria-pressed={active}
                  onClick={() => (active ? closePane(item.id) : openPane(item))}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                    active ? 'bg-[#0494f4]/10 ring-1 ring-[#0494f4]/30' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <AppGlyph item={item} />
                </button>
              );
            })}
          </aside>
        )}
      </div>

      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-[78%] max-w-[300px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
            {panel(true)}
          </div>
        </div>
      )}

      {panes.length > 0 && (
        <div className="md:hidden">
          {panes.slice(-1).map((pane) => (
            <div key={`m-${pane.id}`} className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
              <div className="flex items-center gap-2 h-12 px-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
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
