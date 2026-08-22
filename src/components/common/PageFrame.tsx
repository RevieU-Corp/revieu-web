import type { ReactNode } from 'react';
import { cn } from '../ui/utils';

type PageFrameProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function PageFrame({ children, className, contentClassName }: PageFrameProps) {
  return (
    <div className={cn('w-full px-4 py-6 sm:px-6 lg:px-8', className)}>
      <div className={cn('mx-auto w-full max-w-7xl', contentClassName)}>{children}</div>
    </div>
  );
}
