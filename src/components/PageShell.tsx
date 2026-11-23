import React from 'react';
import { LayoutGrid, Boxes, BookOpen, Building2, Mail, Settings } from 'lucide-react';
import { AppShell } from './AppShell';
import { useGothwadSession } from '../hooks/useGothwadSession';
import { openGothwadAccountMenu } from '../lib/accountMenuWidget';
import { ACCOUNTS_WEB_ORIGIN } from '../config/brand';
import { APP_DOCK } from '../data/dock';


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
      brandName="Bansify"
      brandLogoSrc="/assets/brand/logo.png"
      navItems={[
        { id: 'home', label: 'All apps', icon: LayoutGrid },
        { id: 'products', label: 'Products', icon: Boxes },
        { id: 'docs', label: 'Docs', icon: BookOpen },
        { id: 'company', label: 'Company', icon: Building2 },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'account', label: 'Account centre', icon: Settings },
      ]}
      activeNav={activePage}
      onNavSelect={(id) => (id === 'account' ? openAccountCentre() : onNavigate(id))}
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
      headerAction={<span className="text-xs font-medium text-zinc-400 capitalize">{activePage}</span>}
    >
      {children}
    </AppShell>
  );
};
