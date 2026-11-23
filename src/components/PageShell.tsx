import React from 'react';
import { LayoutGrid, Boxes, BookOpen, Building2, Mail, Settings, ChevronDown, Fingerprint, HardDrive, Video, ShoppingBag, Bot, GitBranch } from 'lucide-react';
import { AppShell, RAIL_ITEMS } from './AppShell';
import { useGothwadSession } from '../hooks/useGothwadSession';
import { openGothwadAccountMenu } from '../lib/accountMenuWidget';
import { ACCOUNTS_WEB_ORIGIN } from '../config/brand';

/** Sidebar entries shared by every non-home page, so the site keeps one shell. */
const PAGE_NAV = [
  { id: 'home', label: 'All apps', icon: LayoutGrid },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'docs', label: 'Docs', icon: BookOpen },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'account', label: 'Account centre', icon: Settings },
];

const RAIL_TO_PAGE: Record<string, string> = {
  home: 'home',
  apps: 'home',
  products: 'products',
  docs: 'docs',
  company: 'company',
  settings: 'contact',
};

export const PageShell: React.FC<{
  activePage: string;
  onNavigate: (p: string) => void;
  children: React.ReactNode;
}> = ({ activePage, onNavigate, children }) => {
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

  return (
    <AppShell
      rail={RAIL_ITEMS}
      activeRail={activePage === 'contact' ? 'settings' : activePage}
      onRailSelect={(id) => onNavigate(RAIL_TO_PAGE[id] ?? 'home')}
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
      navItems={PAGE_NAV}
      activeNav={activePage}
      onNavSelect={(id) => (id === 'account' ? openAccountCentre() : onNavigate(id))}
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
          <span className="text-xs font-medium text-zinc-400 capitalize">{activePage}</span>
          <button
            type="button"
            onClick={openAccountCentre}
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
      {children}
    </AppShell>
  );
};
