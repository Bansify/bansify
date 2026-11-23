import React, { useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PUBLIC_APPS, appHref } from '../data/apps';
import type { AppEntry } from '../data/apps';

const Logo: React.FC<{ app: AppEntry }> = ({ app }) => {
  const [failed, setFailed] = useState(false);
  const Icon = app.icon;
  if (app.logoSrc && !failed) {
    return (
      <img
        src={app.logoSrc}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-10 h-10 rounded-xl object-contain bg-white ring-1 ring-zinc-200 dark:ring-zinc-800"
      />
    );
  }
  return (
    <div className={`w-10 h-10 rounded-xl ${app.accent} flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
  );
};

/**
 * Products is the same catalogue as the home page — one source of truth in
 * `data/apps.ts`, so no page can drift or advertise numbers we cannot back.
 */
export const ProductsPage: React.FC = () => {
  const web = PUBLIC_APPS.filter((a) => a.platform === 'web');
  const android = PUBLIC_APPS.filter((a) => a.platform === 'android');

  const render = (apps: AppEntry[]) => (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {apps.map((app) => {
        const href = appHref(app);
        const isAndroid = app.platform === 'android';
        return (
          <a
            key={`${app.platform}-${app.id}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 hover:border-[#0494f4]/40 hover:shadow-sm transition"
          >
            <div className="flex items-start gap-3">
              <Logo app={app} />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{app.name}</h3>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{app.summary}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#0494f4]">
              {isAndroid ? <Download className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
              {isAndroid ? 'Download APK' : 'Open'}
            </div>
          </a>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto">
      <Breadcrumbs items={[{ name: 'Products', path: '/products' }]} />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Products</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
        Every Bansify app, web and Android, on one account.
      </p>

      <section className="mt-7">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Web · {web.length}</h2>
        {render(web)}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Android · {android.length}</h2>
        {render(android)}
      </section>
    </div>
  );
};
