import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, ArrowUpRight, Download, Globe, Smartphone, LayoutGrid, Star, Settings, ChevronDown,
  Fingerprint, Mail, HardDrive, Video, ShoppingBag, Bot, GitBranch, Home,
} from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PUBLIC_APPS, appHref } from '../data/apps';
import { APP_DOCK } from '../data/dock';
import type { AppEntry } from '../data/apps';
import { useGothwadSession } from '../hooks/useGothwadSession';
import { ACCOUNTS_WEB_ORIGIN } from '../config/brand';
import { openGothwadAccountMenu } from '../lib/accountMenuWidget';

type Filter = 'home' | 'all' | 'web' | 'android';

/** Hero cards for the home feed — offers, launches and featured products. */
const HEROES = [
  {
    id: 'mail-pro',
    eyebrow: 'Limited offer',
    title: 'Bansify Mail, now on every device',
    body: 'One inbox, one account — web, Android and TV. Free for the first year.',
    cta: 'Open Mail',
    href: 'https://mail.bansify.com',
    tone: 'from-[#0494f4] via-[#0a6fd8] to-[#053b74]',
  },
  {
    id: 'meet',
    eyebrow: 'New launch',
    title: 'Bansify Meet is live',
    body: 'HD calls, screen share and whiteboard — no install, no plugin.',
    cta: 'Start a meeting',
    href: 'https://meet.bansify.com',
    tone: 'from-[#0f766e] via-[#0b5d57] to-[#062e2b]',
  },
  {
    id: 'store',
    eyebrow: 'Featured',
    title: 'Kiwi Store: verified APKs',
    body: 'Every build SHA-256 checked. Install the whole ecosystem in one place.',
    cta: 'Browse store',
    href: 'https://store.bansify.com',
    tone: 'from-[#7c3aed] via-[#5b21b6] to-[#2e1065]',
  },
  {
    id: 'pay',
    eyebrow: 'Billing',
    title: 'Bansify Pay — one bill',
    body: 'Plans and add-ons across every product, on a single invoice.',
    cta: 'See plans',
    href: 'https://pay.bansify.com',
    tone: 'from-[#f59e0b] via-[#d97706] to-[#78350f]',
  },
  {
    id: 'drive',
    eyebrow: 'Core',
    title: 'Bansify Drive',
    body: 'Files, folders and sharing, backed by your Bansify account.',
    cta: 'Open Drive',
    href: 'https://drive.bansify.com',
    tone: 'from-[#059669] via-[#047857] to-[#064e3b]',
  },
];


const AppLogo: React.FC<{ app: AppEntry; size?: number }> = ({ app, size = 40 }) => {
  const [failed, setFailed] = useState(false);
  const Icon = app.icon;
  const px = { width: size, height: size };
  if (app.logoSrc && !failed) {
    return (
      <img
        src={app.logoSrc}
        alt=""
        style={px}
        loading="lazy"
        onError={() => setFailed(true)}
        className="rounded-xl object-contain bg-white ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0"
      />
    );
  }
  return (
    <div style={px} className="rounded-xl bg-[#0494f4] flex items-center justify-center shrink-0">
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
            aria-label={isAndroid ? `Download ${app.name}` : `Open ${app.name}`}
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
  const [filter, setFilter] = useState<Filter>('home');
  const [q, setQ] = useState('');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const session = useGothwadSession();

  const account = session.data?.user;
  const signedIn = session.authenticated;

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
      if (filter !== 'home' && filter !== 'all' && app.platform !== filter) return false;
      if (!term) return true;
      return app.name.toLowerCase().includes(term) || app.summary.toLowerCase().includes(term);
    });
  }, [filter, q]);

  const webApps = filtered.filter((a) => a.platform === 'web');
  const androidApps = filtered.filter((a) => a.platform === 'android');
  const featured = PUBLIC_APPS.filter((a) => a.platform === 'web').slice(0, 3);

  const initial = (account?.name || account?.username || '?').slice(0, 1).toUpperCase();
  const avatar = account?.avatarUrl || account?.avatar_url;

  return (
    <AppShell
      brandName="Bansify"
      brandLogoSrc="/assets/brand/logo.png"
      navItems={[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'all', label: 'All apps', icon: LayoutGrid, badge: String(PUBLIC_APPS.length) },
        { id: 'web', label: 'Website', icon: Globe, badge: String(PUBLIC_APPS.filter((a) => a.platform === 'web').length) },
        { id: 'android', label: 'Android', icon: Smartphone, badge: String(PUBLIC_APPS.filter((a) => a.platform === 'android').length) },
        { id: 'featured', label: 'Featured', icon: Star },
        { id: 'products', label: 'Products', icon: LayoutGrid },
        { id: 'docs', label: 'Docs', icon: Globe },
        { id: 'account', label: 'Account centre', icon: Settings },
      ]}
      activeNav={filter}
      onNavSelect={(id) => {
        if (id === 'account') return openAccountCentre();
        if (id === 'products') return onNavigate('products');
        if (id === 'docs') return onNavigate('docs');
        if (id === 'featured') return setFilter('all');
        setFilter(id as Filter);
      }}
      panelFooter={
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
      dock={APP_DOCK}
      profile={
        <button
          type="button"
          onClick={openAccountCentre}
          title={signedIn && account ? `${account.name || account.username} — account centre` : 'Sign in with Bansify'}
          aria-label="Account centre"
          className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 bg-[#0494f4] text-white flex items-center justify-center text-xs font-bold cursor-pointer"
        >
          {avatar ? <img src={avatar as string} alt="" className="w-full h-full object-cover" /> : signedIn && account ? initial : <span className="text-[10px]">In</span>}
        </button>
      }
      headerAction={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 h-9 px-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus-within:border-[#0494f4]/40 transition">
            <Search className="w-4 h-4 text-zinc-400" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search apps"
              className="w-32 sm:w-56 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-400 font-sans">
              ⌘K
            </kbd>
          </div>
          <button
            type="button"
            onClick={openAccountCentre}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-[#0494f4]/40 transition cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full overflow-hidden bg-[#0494f4] text-white flex items-center justify-center text-[10px] font-bold">
              {avatar ? <img src={avatar as string} alt="" className="w-full h-full object-cover" /> : signedIn && account ? initial : 'In'}
            </span>
            <span className="hidden sm:block text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[120px] truncate">
              {signedIn && account ? account.name || account.username : 'Sign in'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      }
    >
      {filter === 'home' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {HEROES.map((h, i) => (
              <a
                key={h.id}
                href={h.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${h.tone} p-6 min-h-[190px] flex flex-col justify-between text-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                  i === 0 ? 'lg:col-span-2 min-h-[240px]' : ''
                }`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:28px_28px]" />
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/15 blur-3xl group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-black/20 blur-2xl" />
                <div className="relative">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                    {h.eyebrow}
                  </span>
                  <h3 className={`mt-3 font-black tracking-tight ${i === 0 ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{h.title}</h3>
                  <p className="mt-1.5 text-sm text-white/80 max-w-lg">{h.body}</p>
                  {i === 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {['Free for 1 year', 'Web · Android · TV', 'One account'].map((chip) => (
                        <span key={chip} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-[13px] font-bold text-zinc-900 shadow-sm transition group-hover:bg-white">
                  {h.cta} <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Featured products</h2>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="ml-auto text-xs font-semibold text-[#0494f4] hover:underline cursor-pointer"
            >
              See all {PUBLIC_APPS.length}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {PUBLIC_APPS.slice(0, 6).map((app) => (
              <AppCard key={`h-${app.id}`} app={app} />
            ))}
          </div>
        </>
      )}

      {filter !== 'home' && (
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

      )}

      {filter !== 'home' && !q && (
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

      {filter !== 'home' && webApps.length > 0 && (
        <Section title="Website" count={webApps.length}>
          {webApps.map((app) => (
            <AppCard key={`w-${app.id}`} app={app} />
          ))}
        </Section>
      )}

      {filter !== 'home' && androidApps.length > 0 && (
        <Section title="Android" count={androidApps.length}>
          {androidApps.map((app) => (
            <AppCard key={`a-${app.id}`} app={app} />
          ))}
        </Section>
      )}

      {filter !== 'home' && filtered.length === 0 && (
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
