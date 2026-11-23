import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ArrowUpRight, Download, Globe, Smartphone, LayoutGrid, Star, Settings, ChevronDown, Fingerprint, Mail, HardDrive, Video, ShoppingBag, Bot, GitBranch } from 'lucide-react';
import { AppShell, RAIL_ITEMS } from '../components/AppShell';
import { PUBLIC_APPS, appHref } from '../data/apps';
import type { AppEntry } from '../data/apps';
import { useGothwadSession } from '../hooks/useGothwadSession';
import { ACCOUNTS_WEB_ORIGIN } from '../config/brand';
import { openGothwadAccountMenu } from '../lib/accountMenuWidget';

type Filter = 'all' | 'web' | 'android';

const AppLogo: React.FC<{ app: AppEntry; size?: number }> = ({ app, size = 40 }) => {
  const [failed, setFailed] = useState(false);
  const Icon = app.icon;
  const px = { width: size, height: size };
  if (app.logoSrc && !failed) {
    return (
      <img
        src={app.logoSrc}
        alt={`${app.name} logo`}
        style={px}
        loading="lazy"
        onError={() => setFailed(true)}
        className="rounded-xl object-contain bg-white ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0"
      />
    );
  }
  return (
    <div style={px} className={`rounded-xl ${app.accent} flex items-center justify-center shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
  );
};

const AppCard: React.FC<{ app: AppEntry }> = ({ app }) => {
  const href = appHref(app);
  const isAndroid = app.platform === 'android';
  return (
    <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 hover:border-[#0494f4]/40 hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <AppLogo app={app} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{app.name}</h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{app.summary}</p>
        </div>
        {href && (
          <a
            href={href}
            title={isAndroid ? 'Download APK' : 'Open'}
            className="shrink-0 w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:bg-[#0494f4] hover:text-white hover:border-[#0494f4] transition"
            target="_blank"
            rel="noopener noreferrer"
            {...(isAndroid ? { download: '' } : {})}
          >
            {isAndroid ? <Download className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
          </a>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
          {isAndroid ? 'Android' : 'Web'}
        </span>
        {app.badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0494f4]/10 text-[#0494f4]">
            {app.badge}
          </span>
        )}
        {href && (
          <a
            href={href}
            className="ml-auto text-xs font-semibold text-[#0494f4] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...(isAndroid ? { download: '' } : {})}
          >
            {isAndroid ? 'Download' : 'Open'}
          </a>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; count: number; children: React.ReactNode }> = ({ title, count, children }) => (
  <section className="mt-7">
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h2>
      <span className="text-xs text-zinc-400">{count}</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">{children}</div>
  </section>
);

export const HomePage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [rail, setRail] = useState('apps');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const session = useGothwadSession();

  // The ⌘K hint in the header is real: focus the search field from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') searchRef.current?.blur();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PUBLIC_APPS.filter((app) => {
      if (filter !== 'all' && app.platform !== filter) return false;
      if (!term) return true;
      return app.name.toLowerCase().includes(term) || app.summary.toLowerCase().includes(term);
    });
  }, [filter, q]);

  const webApps = filtered.filter((a) => a.platform === 'web');
  const androidApps = filtered.filter((a) => a.platform === 'android');
  const featured = PUBLIC_APPS.filter((a) => a.platform === 'web').slice(0, 3);

  const account = session.data?.user;
  const signedIn = session.authenticated;

  // The same account centre that Mail and Drive open — an overlay, not a redirect.
  const openAccountCentre = () => {
    openGothwadAccountMenu(
      {
        user: session.data?.user ?? null,
        accounts: session.data?.accounts ?? [],
        activeId: session.data?.activeId ?? null,
        authuser: session.data?.authuser ?? 0,
      },
      { manageAccountHref: `${ACCOUNTS_WEB_ORIGIN}/account` },
    );
  };

  const railItems = RAIL_ITEMS.map((item) =>
    item.id === 'home' ? { ...item, id: 'apps' } : item,
  );

  return (
    <AppShell
      rail={railItems}
      activeRail={rail}
      onRailSelect={(id) => {
        setRail(id);
        if (id === 'products') onNavigate('products');
        if (id === 'docs') onNavigate('docs');
        if (id === 'company') onNavigate('company');
        if (id === 'settings') onNavigate('settings');
      }}
      rightRail={[
        { id: 'accounts', label: 'Bansify Accounts', icon: Fingerprint, url: 'https://accounts.bansify.com', logoSrc: 'https://accounts.bansify.com/icon-192.png' },
        { id: 'mail', label: 'Bansify Mail', icon: Mail, url: 'https://mail.bansify.com', logoSrc: 'https://mail.bansify.com/icon-192.png' },
        { id: 'drive', label: 'Bansify Drive', icon: HardDrive, url: 'https://drive.bansify.com', logoSrc: 'https://drive.bansify.com/icon-192.png' },
        { id: 'meet', label: 'Bansify Meet', icon: Video, url: 'https://meet.bansify.com', logoSrc: 'https://meet.bansify.com/icon-192.png' },
        { id: 'pay', label: 'Bansify Pay', icon: ShoppingBag, url: 'https://pay.bansify.com', logoSrc: 'https://pay.bansify.com/icon-192.png' },
        { id: 'ai', label: 'Bansify AI', icon: Bot, url: 'https://ai.bansify.com', logoSrc: 'https://ai.bansify.com/icon-192.png' },
        { id: 'gitplus', label: 'GitPlus', icon: GitBranch, url: 'https://gitplus.bansify.com', logoSrc: 'https://gitplus.bansify.com/icon-192.png' },
      ]}
      sidebarTitle="Bansify"
      navItems={[
        { id: 'all', label: 'All apps', icon: LayoutGrid, badge: String(PUBLIC_APPS.length) },
        { id: 'web', label: 'Website', icon: Globe, badge: String(PUBLIC_APPS.filter((a) => a.platform === 'web').length) },
        { id: 'android', label: 'Android', icon: Smartphone, badge: String(PUBLIC_APPS.filter((a) => a.platform === 'android').length) },
        { id: 'featured', label: 'Featured', icon: Star },
        { id: 'account', label: 'Account centre', icon: Settings },
      ]}
      activeNav={filter}
      onNavSelect={(id) => {
        if (id === 'account') {
          openAccountCentre();
          return;
        }
        if (id === 'featured') {
          setFilter('all');
          return;
        }
        setFilter(id as Filter);
      }}
      sidebarFooter={
        <div className="text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
          {signedIn && account ? (
            <>
              Signed in as <span className="font-semibold text-zinc-700 dark:text-zinc-300">{account.name || account.username}</span>
            </>
          ) : (
            <>
              <button type="button" onClick={openAccountCentre} className="text-[#0494f4] hover:underline font-medium cursor-pointer">
                Sign in with Bansify
              </button>{' '}
              to sync across apps
            </>
          )}
        </div>
      }
      headerAction={
        <div className="flex items-center gap-2 w-full">
          {/* Search with a keyboard hint */}
          <div className="flex items-center gap-2 h-9 px-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus-within:border-[#0494f4]/40 transition">
            <Search className="w-4 h-4 text-zinc-400" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search apps"
              className="w-32 sm:w-52 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-400 font-sans">
              ⌘K
            </kbd>
          </div>

          {/* Profile sits beside search — no redirect button */}
          <button
            type="button"
            onClick={openAccountCentre}
            title={signedIn ? 'Open account centre' : 'Sign in with Bansify'}
            className="ml-auto inline-flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-[#0494f4]/40 transition cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full overflow-hidden bg-[#0494f4] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {(account?.avatarUrl || account?.avatar_url) ? (
                <img src={(account.avatarUrl || account.avatar_url) as string} alt="" className="w-full h-full object-cover" />
              ) : signedIn && account ? (
                (account.name || account.username || '?').slice(0, 1).toUpperCase()
              ) : (
                'In'
              )}
            </span>
            <span className="hidden sm:block text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[120px] truncate">
              {signedIn && account ? (account.name || account.username) : 'Sign in'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      }
      accountSlot={
        <button
          type="button"
          onClick={openAccountCentre}
          title={signedIn ? 'Your Bansify account' : 'Sign in'}
          className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 bg-[#0494f4] text-white flex items-center justify-center text-xs font-bold cursor-pointer"
        >
          {(account?.avatarUrl || account?.avatar_url) ? (
            <img src={(account.avatarUrl || account.avatar_url) as string} alt="" className="w-full h-full object-cover" />
          ) : signedIn && account ? (
            (account.name || account.username || '?').slice(0, 1).toUpperCase()
          ) : (
            <span className="text-[10px]">In</span>
          )}
        </button>
      }
    >
      <div className="flex items-center gap-2 flex-wrap">
        {([
          { id: 'all' as const, label: 'All' },
          { id: 'web' as const, label: 'Website' },
          { id: 'android' as const, label: 'Android' },
        ]).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition cursor-pointer ${
              filter === f.id
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent'
                : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!q && (
        <>
          <h2 className="mt-6 mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Featured</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {featured.map((app) => (
              <a
                key={`f-${app.id}`}
                href={appHref(app)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-[#0494f4]/40 hover:shadow-sm transition"
              >
                <AppLogo app={app} size={44} />
                <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">{app.name}</h3>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{app.summary}</p>
              </a>
            ))}
          </div>
        </>
      )}

      {webApps.length > 0 && (
        <Section title="Website" count={webApps.length}>
          {webApps.map((app) => (
            <AppCard key={`w-${app.id}`} app={app} />
          ))}
        </Section>
      )}

      {androidApps.length > 0 && (
        <Section title="Android" count={androidApps.length}>
          {androidApps.map((app) => (
            <AppCard key={`a-${app.id}`} app={app} />
          ))}
        </Section>
      )}

      {filtered.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-sm text-zinc-500">No apps match “{q}”</p>
          <button onClick={() => setQ('')} className="mt-2 text-xs text-[#0494f4] hover:underline cursor-pointer">
            Clear search
          </button>
        </div>
      )}
    </AppShell>
  );
};
