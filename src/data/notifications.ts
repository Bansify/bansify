/**
 * Notifications shown in the panel card.
 *
 * These are product announcements, not user data — they live in code on purpose. A
 * database and a delivery system for a handful of launch notes would be more moving
 * parts than the feature is worth. Edit the list below and ship.
 */

export interface ShellNotification {
  id: string;
  app: string;
  title: string;
  body: string;
  /** Shown as-is; keep it relative and short. */
  when: string;
  tone: 'brand' | 'green' | 'amber';
}

export const NOTIFICATIONS: ShellNotification[] = [
  {
    id: 'ai-live',
    app: 'Bansify AI',
    title: 'Bansify AI is live',
    body: 'One workspace for every model, on the same Bansify account.',
    when: 'Just now',
    tone: 'brand',
  },
  {
    id: 'india-ai',
    app: 'Bansify AI',
    title: 'Built in India, for India',
    body: 'Your prompts and files stay with your account — no third-party analytics.',
    when: 'Today',
    tone: 'amber',
  },
  {
    id: 'files-launch',
    app: 'Bansify Files',
    title: 'Bansify Files 1.0 is out',
    body: 'Browse, clean and free up storage. Signed APK, checksums published.',
    when: 'Today',
    tone: 'brand',
  },
  {
    id: 'mail-android',
    app: 'Bansify Mail',
    title: 'Mail on every device',
    body: 'The Android app now matches the webmail — same inbox, same account.',
    when: 'Yesterday',
    tone: 'green',
  },
  {
    id: 'browser-update',
    app: 'Bansify Browser',
    title: 'Browser build refreshed',
    body: 'Faster tabs, keyboard and mouse on TV, and a smaller download.',
    when: 'Yesterday',
    tone: 'brand',
  },
  {
    id: 'store-verified',
    app: 'Kiwi Store',
    title: 'Every APK is SHA-256 verified',
    body: 'Downloads are checked against the published checksum before install.',
    when: '2 days ago',
    tone: 'green',
  },
  {
    id: 'drive',
    app: 'Bansify Drive',
    title: 'Google Drive imports work',
    body: 'Bring a folder across and it keeps its structure and sharing.',
    when: '3 days ago',
    tone: 'brand',
  },
  {
    id: 'pay',
    app: 'Bansify Pay',
    title: 'One bill for the ecosystem',
    body: 'Plans and add-ons across every product, on a single invoice.',
    when: '4 days ago',
    tone: 'amber',
  },
];

const READ_KEY = 'bansify-notifications-read';

export function readNotificationIds(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function markNotificationsRead(ids: string[]): void {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    /* storage disabled — the dot simply comes back next time */
  }
}
