import type { LucideIcon } from 'lucide-react';
import { Compass, Home, Search, UserRound } from 'lucide-react';
import { PATHS } from '../../../../routes/paths';

export type CustomerNavigationItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
};

export const customerNavigation: CustomerNavigationItem[] = [
  { label: 'Home', path: PATHS.CUSTOMER.HOME, icon: Home, end: true },
  { label: 'Discover', path: PATHS.CUSTOMER.DISCOVER, icon: Compass, end: true },
  { label: 'Explore', path: PATHS.CUSTOMER.EXPLORE, icon: Search, end: true },
  { label: 'Profile', path: PATHS.CUSTOMER.ME.ROOT, icon: UserRound },
];

export const customerPrimaryPaths = customerNavigation.map(({ path }) => path);
