import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, ArrowUpRight, Download, Globe, Smartphone, LayoutGrid, Star, Settings, ChevronDown,
  Fingerprint, Mail, HardDrive, Video, ShoppingBag, Bot, GitBranch, Home,
} from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PUBLIC_APPS, appHref } from '../data/apps';
import { APP_DOCK } from '../data/dock';
import { SITE_NAV } from '../data/nav';
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
      navItems={SITE_NAV}
      activeNav={filter}
      onNavSelect={(id) => {
        if (id === 'account') return openAccountCentre();
        if (id === 'products' || id === 'docs' || id === 'company' || id === 'contact') return onNavigate(id);
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
      profileName={signedIn && account ? (account.name || account.username) : undefined}
      profileEmail={signedIn && account ? account.email : undefined}
      profileAvatar={(account?.avatarUrl || account?.avatar_url) as string | undefined}
      onProfileClick={openAccountCentre}
    >
      {filter === 'home' && (
        <>
          {/* One row, 16:9 cards; images come later, the copy stays as it is */}
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {HEROES.map((h) => (
              <a
                key={h.id}
                href={h.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative shrink-0 snap-start overflow-hidden rounded-2xl bg-gradient-to-br ${h.tone} aspect-[16/9] w-[280px] sm:w-[320px] lg:w-[calc((100%-2.25rem)/3)] lg:max-w-[380px] p-4 flex flex-col justify-between text-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/15 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                <div className="relative">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur">
                    {h.eyebrow}
                  </span>
                  <h3 className="mt-2 text-base font-black tracking-tight leading-tight line-clamp-2">{h.title}</h3>
                  <p className="mt-1 text-[12px] text-white/80 line-clamp-2">{h.body}</p>
                </div>
                <span className="relative mt-2 inline-flex items-center gap-1 text-[12px] font-semibold">
                  {h.cta} <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
