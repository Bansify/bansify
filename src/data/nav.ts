import {
  Home,
  LayoutGrid,
  Globe,
  Smartphone,
  Star,
  Boxes,
  BookOpen,
  Building2,
  Mail,
  Settings,
} from 'lucide-react';
import type { ShellNavItem } from '../components/AppShell';
import { PUBLIC_APPS } from './apps';

const webCount = PUBLIC_APPS.filter((a) => a.platform === 'web').length;
const androidCount = PUBLIC_APPS.filter((a) => a.platform === 'android').length;

/**
 * One navigation list for every page. Keeping it identical everywhere is what stops
 * items from disappearing when the route changes.
 */
export const SITE_NAV: ShellNavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'all', label: 'All apps', icon: LayoutGrid, badge: String(PUBLIC_APPS.length) },
  { id: 'web', label: 'Website', icon: Globe, badge: String(webCount) },
  { id: 'android', label: 'Android', icon: Smartphone, badge: String(androidCount) },
  { id: 'featured', label: 'Featured', icon: Star },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'docs', label: 'Docs', icon: BookOpen },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'account', label: 'Account centre', icon: Settings },
];

/** Ids that filter the app list on the home page rather than open a route. */
export const FILTER_IDS = ['home', 'all', 'web', 'android', 'featured'] as const;

export type FilterId = (typeof FILTER_IDS)[number];
