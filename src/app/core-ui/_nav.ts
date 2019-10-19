interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    title: true,
    name: 'Admin Options'
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-chart'
  },
  {
    name: 'Co-workers',
    url: '/dashboard',
    icon: 'icon-user'
  },
  {
    name: 'Warehouse Schema',
    url: '/theme/colors',
    icon: 'icon-layers'
  },
  {
    name: 'Invoices List',
    url: '/theme/colors',
    icon: 'icon-list'
  }
  /* {
    name: 'Disabled',
    url: '/dashboard',
    icon: 'icon-ban',
    badge: {
      variant: 'secondary',
      text: 'NEW'
    },
    attributes: { disabled: true },
  } */
];
