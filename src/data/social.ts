import { Facebook, Instagram, Youtube, Twitter, Linkedin, Github, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
  icon: LucideIcon;
}

/** One handle everywhere: @bansifyofficial */
export const SOCIAL_LINKS: SocialLink[] = [
  { id: 'facebook', label: 'Facebook', handle: '@bansifyofficial', url: 'https://facebook.com/bansifyofficial', icon: Facebook },
  { id: 'instagram', label: 'Instagram', handle: '@bansifyofficial', url: 'https://instagram.com/bansifyofficial', icon: Instagram },
  { id: 'youtube', label: 'YouTube', handle: '@bansifyofficial', url: 'https://youtube.com/@bansifyofficial', icon: Youtube },
  { id: 'x', label: 'X', handle: '@bansifyofficial', url: 'https://x.com/bansifyofficial', icon: Twitter },
  { id: 'linkedin', label: 'LinkedIn', handle: '@bansifyofficial', url: 'https://linkedin.com/company/bansifyofficial', icon: Linkedin },
  { id: 'telegram', label: 'Telegram', handle: '@bansifyofficial', url: 'https://t.me/bansifyofficial', icon: Send },
  { id: 'github', label: 'GitHub', handle: '@Bansify', url: 'https://github.com/Bansify', icon: Github },
];
