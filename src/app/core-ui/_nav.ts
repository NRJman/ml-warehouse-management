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
  isForAdmin?: boolean;
}

export const navItems: NavData[] = [
  {
    name: 'Tasks Available',
    url: '/available-tasks',
    icon: 'icon-chart',
    isForAdmin: false
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-chart',
    isForAdmin: true
  },
  {
    name: 'Management',
    url: '/management',
    icon: 'icon-user',
    isForAdmin: true
  },
  {
    name: 'Areas',
    url: '/areas', // currently doesn't exist
    icon: 'icon-layers'
  },
  {
    name: 'Invoices List',
    url: '/invoices-list', // currently doesn't exist
    icon: 'icon-list',
    isForAdmin: true
  }
];
