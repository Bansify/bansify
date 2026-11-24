import React from 'react';
import { LayoutGrid, Boxes, BookOpen, Building2, Mail, Settings } from 'lucide-react';
import { AppShell } from './AppShell';
import { useGothwadSession } from '../hooks/useGothwadSession';
import { openGothwadAccountMenu } from '../lib/accountMenuWidget';
import { ACCOUNTS_WEB_ORIGIN } from '../config/brand';
import { APP_DOCK } from '../data/dock';
import { SITE_NAV } from '../data/nav';


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

  const avatar = account?.avatarUrl || account?.avatar_url;
  const initial = (account?.name || account?.username || '?').slice(0, 1).toUpperCase();

  return (
    <AppShell
      title={SITE_NAV.find((n) => n.id === activePage)?.label ?? 'Bansify'}
      brandName="Bansify"
      brandLogoSrc="/assets/brand/logo.png"
      navItems={SITE_NAV}
      activeNav={activePage}
      onNavSelect={(id) => {
        if (id === 'account') return openAccountCentre();
        // list filters always live on the home page
        if (id === 'all' || id === 'web' || id === 'android' || id === 'featured' || id === 'home') {
          return onNavigate('home');
        }
        onNavigate(id);
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
      {children}
    </AppShell>
  );
};
