import '@/features/admin-entities';
import { Icons } from "@/shared/components/atoms/ui/icons";
import { getRegisteredAdminEntities } from '@/shared/lib/admin/admin-generator';

const kAppName = "Boiler"
const kAppAbbr = "TA";
const kAppTagline = "Système d'administration ultra-simplifié";
const kAppDescription = `Boiler est une plateforme d'administration moderne qui permet de gérer facilement vos contenus, utilisateurs et paramètres avec des interfaces CRUD générées automatiquement.`;

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export const CLIENT_MENU_ITEMS: NavItem[] = [
  {
    title: "Rechercher",
    url: "/rechercher",
  },
  {
    title: "Calendrier",
    url: "/calendar",
  },
  {
    title: "Mes evénements",
    url: "/events",
  },
];

export function getSidebarNavItems(): NavItem[] {
  const adminEntities = getRegisteredAdminEntities()
    .slice()
    .sort((a, b) => (a.menuOrder ?? 999) - (b.menuOrder ?? 999))
    .map(entity => {
      const config = entity.config as { title?: string; description?: string; icon?: string };
      // Si l'icône est un emoji, on le met dans label, sinon dans icon (clé Icons)
      const isEmoji = typeof config.icon === 'string' && config.icon.length <= 3;
      return {
        title: config.title || entity.path,
        url: entity.href,
        icon: !isEmoji ? (config.icon as keyof typeof Icons) : undefined,
        label: isEmoji ? config.icon : undefined,
        description: config.description,
        items: [],
      };
    });

  return [...adminEntities];
}
export const AVATAR_CHOICES = [
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_11.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_12.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_13.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_14.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_15.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_16.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_17.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_19.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_20.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_21.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_22.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_23.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_24.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_25.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_26.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_27.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_11.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_12.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_13.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_14.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_15.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_16.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_17.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_18.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_19.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_20.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_21.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_22.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_23.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_24.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_25.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_26.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_27.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_28.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_29.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_30.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_31.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_32.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_33.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_34.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_35.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_11.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_12.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_13.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_14.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_15.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_11.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_12.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_14.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_15.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_16.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_17.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_18.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_19.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_21.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_22.png",
];
export const AVATARS_PER_PAGE = 20;
export { kAppName, kAppAbbr, kAppTagline, kAppDescription };
